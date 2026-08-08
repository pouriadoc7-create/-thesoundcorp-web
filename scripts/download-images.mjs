// Master Asset Library — official product-image downloader (Agent 2, images).
// Reads assets/master/image-sources.json (produced from Agent 1's discovery results),
// downloads each REAL image into assets/master/brands/<brand>/products/<product>/{images,mobile,brand-images}/,
// validates it is a genuine image (magic bytes, not HTML), measures pixel dimensions,
// and writes assets/master/images-manifest.json. Official URLs only (Agent 1 vetted them).
//
//   node scripts/download-images.mjs
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const OUT = path.join(ROOT, "assets", "master");
const SRC = path.join(OUT, "image-sources.json");
const UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124 Safari/537.36";
const CONC = 6;
const TIMEOUT_MS = 90_000;

if (!fs.existsSync(SRC)) {
  console.error("No image-sources.json — run Agent 1 discovery and write it first.");
  process.exit(1);
}
const sources = JSON.parse(fs.readFileSync(SRC, "utf8"));
const sanitize = (n) => (n.replace(/[^A-Za-z0-9._-]+/g, "_").slice(0, 180) || "image");

// kind → subfolder
const folderFor = (kind) =>
  kind === "mobile" ? "mobile" : kind === "logo" ? "logos" : kind === "brand" ? "brand-images" : "images";

// Pure-JS pixel-dimension reader for the common web formats. Returns {w,h,format} or null.
function dimensions(buf) {
  const b = buf;
  // PNG
  if (b.length > 24 && b[0] === 0x89 && b[1] === 0x50 && b[2] === 0x4e && b[3] === 0x47) {
    return { w: b.readUInt32BE(16), h: b.readUInt32BE(20), format: "PNG" };
  }
  // GIF
  if (b.length > 10 && b[0] === 0x47 && b[1] === 0x49 && b[2] === 0x46) {
    return { w: b.readUInt16LE(6), h: b.readUInt16LE(8), format: "GIF" };
  }
  // JPEG — scan SOF markers
  if (b.length > 4 && b[0] === 0xff && b[1] === 0xd8) {
    let o = 2;
    while (o + 9 < b.length) {
      if (b[o] !== 0xff) { o++; continue; }
      const marker = b[o + 1];
      if (marker >= 0xc0 && marker <= 0xcf && marker !== 0xc4 && marker !== 0xc8 && marker !== 0xcc) {
        return { h: b.readUInt16BE(o + 5), w: b.readUInt16BE(o + 7), format: "JPEG" };
      }
      const len = b.readUInt16BE(o + 2);
      if (len < 2) break;
      o += 2 + len;
    }
    return { w: null, h: null, format: "JPEG" };
  }
  // WebP (RIFF....WEBP)
  if (b.length > 30 && b.toString("latin1", 0, 4) === "RIFF" && b.toString("latin1", 8, 12) === "WEBP") {
    const fourcc = b.toString("latin1", 12, 16);
    if (fourcc === "VP8X") return { w: 1 + b.readUIntLE(24, 3), h: 1 + b.readUIntLE(27, 3), format: "WEBP" };
    if (fourcc === "VP8 ") {
      const w = b.readUInt16LE(26) & 0x3fff;
      const h = b.readUInt16LE(28) & 0x3fff;
      return { w, h, format: "WEBP" };
    }
    if (fourcc === "VP8L") {
      const bits = b.readUInt32LE(21);
      return { w: (bits & 0x3fff) + 1, h: ((bits >> 14) & 0x3fff) + 1, format: "WEBP" };
    }
    return { w: null, h: null, format: "WEBP" };
  }
  // SVG / XML
  const head = b.toString("latin1", 0, 256).trimStart();
  if (/^<(\?xml|svg)/i.test(head)) {
    const wv = /width="([\d.]+)/.exec(head);
    const hv = /height="([\d.]+)/.exec(head);
    return { w: wv ? Math.round(+wv[1]) : null, h: hv ? Math.round(+hv[1]) : null, format: "SVG" };
  }
  // AVIF / HEIC (ftyp box) — dimensions not parsed here
  if (b.length > 12 && b.toString("latin1", 4, 8) === "ftyp") {
    const brand = b.toString("latin1", 8, 12);
    if (/avif|avis|heic|heix|mif1/.test(brand)) return { w: null, h: null, format: "AVIF" };
  }
  return null;
}

function looksHtml(buf) {
  return /^\s*<(!doctype|html|head|body)/i.test(buf.toString("latin1", 0, 200));
}

const jobs = [];
for (const s of sources)
  for (const img of s.images || [])
    jobs.push({ brand: s.brand, product: s.product, kind: img.kind || "product", url: img.url, note: img.note || "" });

async function download(job) {
  const sub = folderFor(job.kind);
  const dir = job.product
    ? path.join(OUT, "brands", job.brand, "products", job.product, sub)
    : path.join(OUT, "brands", job.brand, sub);
  fs.mkdirSync(dir, { recursive: true });

  let base;
  try {
    base = sanitize(decodeURIComponent(new URL(job.url).pathname.split("/").pop() || "image"));
  } catch {
    return { ...job, status: "bad_url" };
  }
  if (!/\.(jpe?g|png|webp|avif|gif|svg)$/i.test(base)) base += ".img";
  const dest = path.join(dir, base);
  const rel = path.relative(ROOT, dest).replace(/\\/g, "/");

  if (fs.existsSync(dest) && fs.statSync(dest).size > 0) {
    const buf = fs.readFileSync(dest);
    const dim = dimensions(buf) || {};
    return { ...job, filename: base, localPath: rel, size: buf.length, width: dim.w ?? null, height: dim.h ?? null, format: dim.format ?? null, status: "exists" };
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(job.url, {
      redirect: "follow",
      signal: controller.signal,
      headers: { "user-agent": UA, accept: "image/*,*/*", referer: new URL(job.url).origin + "/" },
    });
    clearTimeout(timer);
    const ct = (res.headers.get("content-type") || "").toLowerCase();
    if (!res.ok || !res.body) return { ...job, status: `http_${res.status}` };
    const buf = Buffer.from(await res.arrayBuffer());
    if (buf.length === 0) return { ...job, status: "reject_empty" };
    if (/text\/html/.test(ct) || looksHtml(buf)) return { ...job, status: "reject_html", contentType: ct };
    const dim = dimensions(buf);
    if (!dim && !/image\//.test(ct)) return { ...job, status: "reject_not_image", contentType: ct };
    fs.writeFileSync(dest, buf);
    return {
      ...job,
      filename: base,
      localPath: rel,
      size: buf.length,
      width: dim?.w ?? null,
      height: dim?.h ?? null,
      format: dim?.format ?? null,
      contentType: ct,
      status: "downloaded",
    };
  } catch (e) {
    clearTimeout(timer);
    return { ...job, status: "error", error: String((e && e.name) || e) };
  }
}

const results = new Array(jobs.length);
let i = 0;
async function worker() {
  while (i < jobs.length) {
    const idx = i++;
    results[idx] = await download(jobs[idx]);
  }
}
await Promise.all(Array.from({ length: CONC }, worker));

fs.mkdirSync(OUT, { recursive: true });
fs.writeFileSync(path.join(OUT, "images-manifest.json"), JSON.stringify(results, null, 1));

const by = {};
for (const r of results) by[r.status] = (by[r.status] || 0) + 1;
const bytes = results.filter((r) => r.size).reduce((n, r) => n + r.size, 0);
console.log("IMAGES:", results.length, "| status:", JSON.stringify(by));
console.log("total bytes:", bytes, `(${(bytes / 1048576).toFixed(1)} MB)`);
console.log("manifest:", path.relative(ROOT, path.join(OUT, "images-manifest.json")));
