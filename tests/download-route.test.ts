import { afterEach, describe, expect, it, vi } from "vitest";

import { GET } from "@/app/api/download/route";

type Req = Parameters<typeof GET>[0];

/** The route only reads `req.nextUrl.searchParams`, so a minimal stand-in is enough. */
const makeReq = (qs: string): Req =>
  ({ nextUrl: new URL(`https://site/api/download${qs}`) }) as unknown as Req;

interface UpstreamOpts {
  status?: number;
  ok?: boolean;
  url?: string;
  contentType?: string;
  contentLength?: number | null;
  bytes?: Uint8Array;
}

/** A minimal stand-in for the parts of `Response` the proxy consumes. */
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

// AudioVector is the only brand that retains download content, so it is the
// live fixture the proxy resolves against. Its official URL is a PHP download
// handler (no file extension), which exercises the title+format filename path.
const AV = "?brand=audiovector&product=r-series-general&doc=audiovector-r-series-brochure-pdf";

describe("GET /api/download (secure proxy)", () => {
  afterEach(() => vi.unstubAllGlobals());

  it("returns 400 when params are missing", async () => {
    expect((await GET(makeReq("?brand=audiovector"))).status).toBe(400);
  });

  it("returns 404 for an unknown document or brand", async () => {
    expect((await GET(makeReq("?brand=audiovector&product=r-series-general&doc=nope"))).status).toBe(404);
    expect((await GET(makeReq("?brand=nope&product=r-series-general&doc=audiovector-r-series-brochure-pdf"))).status).toBe(404);
  });

  it("streams a valid PDF as an attachment with security headers", async () => {
    stubFetch(mockUpstream({ contentType: "application/pdf", contentLength: 4 }));
    const res = await GET(makeReq(AV));
    expect(res.status).toBe(200);
    expect(res.headers.get("content-type")).toBe("application/pdf");
    // URL has no extension → filename is built from the doc title + format.
    expect(res.headers.get("content-disposition")).toMatch(
      /^attachment; filename="audiovector_r_series_brochure\.pdf"/,
    );
    expect(res.headers.get("cache-control")).toBe("no-store");
    expect(res.headers.get("x-content-type-options")).toBe("nosniff");
    const bytes = new Uint8Array(await res.arrayBuffer());
    expect(Array.from(bytes)).toEqual([0x25, 0x50, 0x44, 0x46]);
  });

  it("returns 415 for a non-file (html) content-type", async () => {
    stubFetch(mockUpstream({ contentType: "text/html; charset=utf-8" }));
    expect((await GET(makeReq(AV))).status).toBe(415);
  });

  it("returns 502 when a redirect leaves the official domain", async () => {
    stubFetch(mockUpstream({ url: "https://evil.example/x.pdf" }));
    expect((await GET(makeReq(AV))).status).toBe(502);
  });

  it("returns 502 when the upstream response is not ok", async () => {
    stubFetch(mockUpstream({ ok: false, status: 503 }));
    expect((await GET(makeReq(AV))).status).toBe(502);
  });

  it("accepts an application/zip content-type (firmware archives)", async () => {
    stubFetch(mockUpstream({ contentType: "application/zip" }));
    expect((await GET(makeReq(AV))).status).toBe(200);
  });
});
