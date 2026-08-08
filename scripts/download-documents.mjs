// Master Asset Library — official document downloader (Agent 2, documents).
// Downloads every official document referenced in lib/data/downloads.ts as a REAL
// file into assets/master/, idempotently, and writes a manifest. Official domains
// only (the URLs in downloads.ts are already validated on brand domains).
//
//   node scripts/download-documents.mjs
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const OUT = path.join(ROOT, "assets", "master");
const UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124 Safari/537.36";
const CONC = 6;
const TIMEOUT_MS = 120_000;

const src = fs.readFileSync(path.join(ROOT, "lib", "data", "downloads.ts"), "utf8");
const marker = "DownloadBrand[] =";
const arr = src.slice(src.indexOf(marker) + marker.length);
const brands = JSON.parse(arr.slice(0, arr.lastIndexOf("]") + 1));

const sanitize = (n) => (n.replace(/[^A-Za-z0-9._-]+/g, "_").slice(0, 180) || "file");

const jobs = [];
for (const b of brands)
  for (const p of b.products)
    for (const d of p.documents)
      jobs.push({
        brand: b.slug,
        brandName: b.name,
        product: p.slug,
        productName: p.name,
        docId: d.id,
        title: d.title,
        type: d.type,
        format: d.format,
        expectedSize: d.fileSize ?? null,
        url: d.officialUrl,
        domain: b.officialDomain,
      });

async function download(job) {
  const dir = path.join(OUT, "brands", job.brand, "products", job.product, "documents");
  fs.mkdirSync(dir, { recursive: true });
  const base = sanitize(
    decodeURIComponent(new URL(job.url).pathname.split("/").pop() || `${job.docId}.${job.format.toLowerCase()}`),
  );
  const dest = path.join(dir, base);
  const rel = path.relative(ROOT, dest).replace(/\\/g, "/");

  if (fs.existsSync(dest) && fs.statSync(dest).size > 0) {
    return { ...job, filename: base, localPath: rel, size: fs.statSync(dest).size, status: "exists" };
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(job.url, {
      redirect: "follow",
      signal: controller.signal,
      headers: { "user-agent": UA, accept: "*/*", referer: `https://${job.domain}/` },
    });
    clearTimeout(timer);
    const ct = (res.headers.get("content-type") || "").toLowerCase();
    if (!res.ok || !res.body) return { ...job, status: `http_${res.status}` };
    if (/text\/html/.test(ct)) return { ...job, status: "reject_html", contentType: ct };
    const buf = Buffer.from(await res.arrayBuffer());
    if (buf.length === 0) return { ...job, status: "reject_empty" };
    fs.writeFileSync(dest, buf);
    return { ...job, filename: base, localPath: rel, size: buf.length, contentType: ct, status: "downloaded" };
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
    if (idx % 20 === 0) process.stderr.write(`  …${idx}/${jobs.length}\n`);
  }
}
await Promise.all(Array.from({ length: CONC }, worker));

fs.mkdirSync(OUT, { recursive: true });
fs.writeFileSync(path.join(OUT, "documents-manifest.json"), JSON.stringify(results, null, 1));

const by = {};
for (const r of results) by[r.status] = (by[r.status] || 0) + 1;
const bytes = results.filter((r) => r.size).reduce((n, r) => n + r.size, 0);
console.log("DOCUMENTS:", results.length, "| status:", JSON.stringify(by));
console.log("total bytes:", bytes, `(${(bytes / 1048576).toFixed(1)} MB)`);
console.log("manifest:", path.relative(ROOT, path.join(OUT, "documents-manifest.json")));
