import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

// The proxy resolves docs from the real dataset via findDocument. To test the
// proxy's own behaviour independently of the (currently all-local) catalogue, we
// mock findDocument and inject synthetic remote/local docs. isUrlOnBrandDomains
// stays REAL so the domain-allowlist logic is genuinely exercised.
vi.mock("@/lib/utils/downloads", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/lib/utils/downloads")>();
  return { ...actual, findDocument: vi.fn() };
});

import { GET } from "@/app/api/download/route";
import type { FoundDocument } from "@/lib/utils/downloads";
import { findDocument } from "@/lib/utils/downloads";

const mockFind = vi.mocked(findDocument);

type Req = Parameters<typeof GET>[0];
const makeReq = (qs: string): Req =>
  ({ nextUrl: new URL(`https://site/api/download${qs}`) }) as unknown as Req;

const brand = { slug: "demo", name: "Demo", officialDomain: "example.com", products: [] };
const product = { slug: "p", name: "P", category: "Speakers", documents: [] };

/** A resolvable REMOTE official document (streamed via fetch). */
const remoteFound: FoundDocument = {
  brand,
  product,
  doc: { id: "manual", type: "user-manual", title: "manual.pdf", format: "PDF", officialUrl: "https://example.com/manual.pdf" },
};
/** A resolvable LOCAL (imported) document — served statically, refused by the proxy. */
const localFound: FoundDocument = {
  brand,
  product,
  doc: { id: "b", type: "brochure", title: "b.pdf", format: "PDF", localPath: "/downloads/demo/p/b.pdf" },
};

interface UpstreamOpts {
  status?: number;
  ok?: boolean;
  url?: string;
  contentType?: string;
  contentLength?: number | null;
  bytes?: Uint8Array;
}

function mockUpstream(opts: UpstreamOpts = {}) {
  const {
    status = 200,
    ok = true,
    url = "",
    contentType = "application/pdf",
    contentLength = null,
    bytes = new Uint8Array([0x25, 0x50, 0x44, 0x46]), // %PDF
  } = opts;
  const headers = new Headers({ "content-type": contentType });
  if (contentLength != null) headers.set("content-length", String(contentLength));
  const body = new ReadableStream<Uint8Array>({
    start(c) {
      c.enqueue(bytes);
      c.close();
    },
  });
  return { status, ok, url, headers, body };
}

function stubFetch(mock: ReturnType<typeof mockUpstream>) {
  vi.stubGlobal(
    "fetch",
    vi.fn(async () => mock),
  );
}

const REMOTE = "?brand=demo&product=p&doc=manual";

describe("GET /api/download (secure proxy)", () => {
  beforeEach(() => mockFind.mockReset());
  afterEach(() => vi.unstubAllGlobals());

  it("returns 400 when params are missing", async () => {
    expect((await GET(makeReq("?brand=demo"))).status).toBe(400);
  });

  it("returns 404 for an unknown document or brand", async () => {
    mockFind.mockReturnValue(undefined);
    expect((await GET(makeReq("?brand=demo&product=p&doc=nope"))).status).toBe(404);
  });

  it("returns 404 for a locally-hosted document (served statically, not via the proxy)", async () => {
    mockFind.mockReturnValue(localFound);
    expect((await GET(makeReq("?brand=demo&product=p&doc=b"))).status).toBe(404);
  });

  it("streams a valid PDF as an attachment with security headers", async () => {
    mockFind.mockReturnValue(remoteFound);
    stubFetch(mockUpstream({ contentType: "application/pdf", contentLength: 4 }));
    const res = await GET(makeReq(REMOTE));
    expect(res.status).toBe(200);
    expect(res.headers.get("content-type")).toBe("application/pdf");
    expect(res.headers.get("content-disposition")).toMatch(/^attachment; filename="manual\.pdf"/);
    expect(res.headers.get("cache-control")).toBe("no-store");
    expect(res.headers.get("x-content-type-options")).toBe("nosniff");
    const bytes = new Uint8Array(await res.arrayBuffer());
    expect(Array.from(bytes)).toEqual([0x25, 0x50, 0x44, 0x46]);
  });

  it("returns 415 for a non-file (html) content-type", async () => {
    mockFind.mockReturnValue(remoteFound);
    stubFetch(mockUpstream({ contentType: "text/html; charset=utf-8" }));
    expect((await GET(makeReq(REMOTE))).status).toBe(415);
  });

  it("returns 502 when a redirect leaves the official domain", async () => {
    mockFind.mockReturnValue(remoteFound);
    stubFetch(mockUpstream({ url: "https://evil.example/x.pdf" }));
    expect((await GET(makeReq(REMOTE))).status).toBe(502);
  });

  it("returns 502 when the upstream response is not ok", async () => {
    mockFind.mockReturnValue(remoteFound);
    stubFetch(mockUpstream({ ok: false, status: 503 }));
    expect((await GET(makeReq(REMOTE))).status).toBe(502);
  });

  it("accepts an application/zip content-type", async () => {
    mockFind.mockReturnValue(remoteFound);
    stubFetch(mockUpstream({ contentType: "application/zip" }));
    expect((await GET(makeReq(REMOTE))).status).toBe(200);
  });
});
