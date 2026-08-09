import type { NextRequest } from "next/server";

import { findDocument, isUrlOnBrandDomains } from "@/lib/utils/downloads";

/**
 * Secure official-file download proxy.
 *
 * Flow: TheSoundCorp → this endpoint → official manufacturer file. The browser
 * fetches this SAME-ORIGIN route, which streams the manufacturer's own file
 * back with `Content-Disposition: attachment` so the download starts in place —
 * the user never leaves the site, no new tab, no redirect, and nothing is ever
 * stored on our server.
 *
 * Hardening:
 *  - The client sends only ids (brand/product/doc); the URL is resolved from our
 *    vetted dataset, so there is NO caller-controlled URL to fetch (SSRF-safe).
 *  - https-only + official-domain allowlist, re-checked on the final URL.
 *  - Connect timeout + per-chunk inactivity (stall) timeout, size cap, and
 *    upstream content-type validation.
 */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Time budget for establishing the connection and receiving the response
// HEADERS. NOT the total download time — a large file over a slow client
// connection can legitimately take much longer to stream.
const CONNECT_TIMEOUT_MS = 30_000;
// Inactivity guard DURING streaming: abort only if no bytes flow for this long
// (resets on every chunk). This lets a slow-but-steady large download finish
// while still killing a genuinely stalled upstream.
const STALL_TIMEOUT_MS = 45_000;
const MAX_BYTES = 150 * 1024 * 1024; // 150 MB hard cap
const UPSTREAM_UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124 Safari/537.36";

/** Allowed upstream content-types (documents & firmware archives only). */
const ALLOWED_CONTENT_TYPE = [
  /^application\/pdf\b/i,
  /^application\/zip\b/i,
  /^application\/x-zip(-compressed)?\b/i,
  /^application\/octet-stream\b/i,
  /^application\/msword\b/i,
  /officedocument/i,
  /^application\/x-msdownload\b/i,
  /^application\/vnd\.microsoft\.portable-executable\b/i,
  /^application\/(force-download|download)\b/i,
  /^binary\/octet-stream\b/i,
];

/** Keep letters, digits, dots, hyphens, spaces and unicode; drop control and
 *  filesystem-illegal characters. */
function sanitizeFilename(name: string): string {
  const cleaned = name
    .replace(/[\x00-\x1f<>:"/\\|?*]+/g, "")
    .replace(/\s+/g, " ")
    .trim();
  return cleaned.length > 0 && cleaned.length <= 180 ? cleaned : "download";
}

function fail(status: number, message: string): Response {
  return new Response(message, {
    status,
    headers: { "content-type": "text/plain; charset=utf-8", "cache-control": "no-store" },
  });
}

export async function GET(req: NextRequest): Promise<Response> {
  const sp = req.nextUrl.searchParams;
  const brandSlug = sp.get("brand");
  const productSlug = sp.get("product");
  const docId = sp.get("doc");

  if (!brandSlug || !productSlug || !docId) {
    return fail(400, "Missing brand, product or doc.");
  }

  const found = findDocument(brandSlug, productSlug, docId);
  if (!found) return fail(404, "Unknown document.");

  const { brand, doc } = found;

  // Locally-hosted (imported) files live under /public and are served directly as
  // static assets — this proxy exists only to safely stream REMOTE official files.
  if (!doc.officialUrl) {
    return fail(404, "This document is served as a local file, not via the proxy.");
  }

  // Defense in depth: even though the URL comes from our own dataset, refuse
  // anything that is not https on one of the brand's official domains.
  if (!isUrlOnBrandDomains(doc.officialUrl, brand)) {
    return fail(403, "Document URL is not on the brand's official domain.");
  }

  const controller = new AbortController();
  let connectTimer: ReturnType<typeof setTimeout> | null = setTimeout(
    () => controller.abort(),
    CONNECT_TIMEOUT_MS
  );
  let stallTimer: ReturnType<typeof setTimeout> | null = null;
  const clearTimers = () => {
    if (connectTimer) {
      clearTimeout(connectTimer);
      connectTimer = null;
    }
    if (stallTimer) {
      clearTimeout(stallTimer);
      stallTimer = null;
    }
  };
  const armStall = () => {
    if (stallTimer) clearTimeout(stallTimer);
    stallTimer = setTimeout(() => controller.abort(), STALL_TIMEOUT_MS);
  };

  try {
    // Let fetch follow redirects, then re-validate the FINAL url against the
    // allowlist — Node's fetch returns opaque responses for `redirect: manual`,
    // so the final-url check is the reliable guard against a redirect escaping
    // the official domain(s).
    const upstream = await fetch(doc.officialUrl, {
      method: "GET",
      redirect: "follow",
      signal: controller.signal,
      cache: "no-store",
      headers: {
        "user-agent": UPSTREAM_UA,
        accept: "*/*",
        // Same-site referer keeps common hotlink protection happy.
        referer: `https://${brand.officialDomain}/`,
      },
    });
    // Headers received — the connect budget no longer applies.
    if (connectTimer) {
      clearTimeout(connectTimer);
      connectTimer = null;
    }

    if (upstream.url && !isUrlOnBrandDomains(upstream.url, brand)) {
      clearTimers();
      return fail(502, "Upstream redirect left the official domain.");
    }

    if (!upstream.ok || !upstream.body) {
      clearTimers();
      return fail(502, "Could not reach the official file.");
    }

    const contentType = upstream.headers.get("content-type") ?? "application/octet-stream";
    if (!ALLOWED_CONTENT_TYPE.some((re) => re.test(contentType))) {
      clearTimers();
      return fail(415, "Unexpected file type from the official source.");
    }

    const contentLength = upstream.headers.get("content-length");
    if (contentLength && Number(contentLength) > MAX_BYTES) {
      clearTimers();
      return fail(413, "File exceeds the maximum allowed size.");
    }

    // Prefer the official file's own basename; if the URL has no usable
    // extension (e.g. a PHP download handler), build one from the title + format.
    const rawBase = decodeURIComponent(new URL(doc.officialUrl).pathname.split("/").pop() ?? "");
    const hasExt = /\.(pdf|zip|exe|docx?|pptx)$/i.test(rawBase);
    const titleBase = (doc.title || productSlug).replace(/\.(pdf|zip|exe|docx?|pptx)$/i, "");
    const filename = sanitizeFilename(
      hasExt ? rawBase : `${titleBase}.${doc.format.toLowerCase()}`
    );
    // ASCII fallback for the quoted form; full unicode via RFC 5987 filename*.
    const asciiName = filename.replace(/[^\x20-\x7e]/g, "_").replace(/"/g, "") || "download";

    // Pass the upstream body through, enforcing the size cap as bytes flow and a
    // per-chunk inactivity timeout (reset on progress) instead of a total cap.
    const reader = upstream.body.getReader();
    let transferred = 0;
    armStall();
    const stream = new ReadableStream<Uint8Array>({
      async pull(ctrl) {
        try {
          const { done, value } = await reader.read();
          if (done) {
            clearTimers();
            ctrl.close();
            return;
          }
          if (!value) return;
          armStall(); // progress → reset the inactivity timer
          transferred += value.byteLength;
          if (transferred > MAX_BYTES) {
            clearTimers();
            void reader.cancel();
            ctrl.error(new Error("File exceeds the maximum allowed size."));
            return;
          }
          ctrl.enqueue(value);
        } catch (err) {
          clearTimers();
          ctrl.error(err);
        }
      },
      cancel() {
        clearTimers();
        void reader.cancel();
      },
    });

    const headers = new Headers();
    headers.set("content-type", contentType.split(";")[0].trim());
    headers.set(
      "content-disposition",
      `attachment; filename="${asciiName}"; filename*=UTF-8''${encodeURIComponent(filename)}`
    );
    if (contentLength) headers.set("content-length", contentLength);
    headers.set("cache-control", "no-store");
    headers.set("x-content-type-options", "nosniff");
    headers.set("x-robots-tag", "noindex");

    return new Response(stream, { status: 200, headers });
  } catch (err) {
    clearTimers();
    const aborted = err instanceof Error && err.name === "AbortError";
    return fail(aborted ? 504 : 502, aborted ? "The official source timed out." : "Download failed.");
  }
}
