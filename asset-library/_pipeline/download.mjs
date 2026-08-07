// Manifest-driven downloader. Pulls ONLY the URLs you list in a brand's
// manifest.json (which must point at the official domain), stores untouched
// originals in the correct Master Assets folder, skips existing files, and
// records a download log. Never modifies originals.
//
// Usage: node download.mjs marten
import { writeFile, copyFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { BRANDS } from "./config.mjs";
import { ensureDir, fetchBinary, libraryPath, readJSON, slugify, extname } from "./lib.mjs";

const slug = process.argv[2];
const brand = BRANDS.find((b) => b.slug === slug);
if (!brand) { console.error("Unknown brand slug. e.g. node download.mjs marten"); process.exit(1); }

const base = libraryPath(slug);
const manifest = await readJSON(path.join(base, "manifest.json"));
if (!manifest?.assets?.length) { console.error(`No assets in ${slug}/manifest.json`); process.exit(1); }

const officialHost = new URL(brand.domain).host.replace(/^www\./, "");
const log = [];

function targetFor(a) {
  const ext = a.filename ? path.extname(a.filename) : extname(a.url);
  const cat = a.category;
  if (cat === "03 Products") {
    const prod = slugify(a.product || "product");
    const name = a.filename || `${prod}-${slugify(a.angle || "front")}${ext}`;
    return path.join(base, cat, prod, "Original", name);
  }
  if (cat === "01 Logos") {
    const sub = ext === ".svg" ? "SVG" : ext === ".png" ? "PNG" : ".";
    return path.join(base, cat, sub, a.filename || `${slug}-logo${ext}`);
  }
  return path.join(base, cat, a.filename || `${slug}-${slugify(a.label || path.basename(new URL(a.url).pathname))}`);
}

for (const a of manifest.assets) {
  let host;
  try { host = new URL(a.url).host.replace(/^www\./, ""); } catch { log.push({ url: a.url, skip: "bad-url" }); continue; }
  // Hard guard: only ever download from the brand's own official domain.
  if (!host.endsWith(officialHost.split(".").slice(-2).join("."))) {
    log.push({ url: a.url, skip: `non-official-host (${host})` }); console.warn("SKIP non-official:", a.url); continue;
  }
  const dest = targetFor(a);
  if (existsSync(dest)) { log.push({ url: a.url, dest, skip: "exists" }); continue; }
  await ensureDir(path.dirname(dest));
  const r = await fetchBinary(a.url);
  if (!r.ok) { log.push({ url: a.url, error: r.error || r.status }); console.warn("FAIL", r.status || r.error, a.url); continue; }
  if ((r.type || "").includes("text/html")) { log.push({ url: a.url, skip: "html-not-asset" }); console.warn("SKIP html:", a.url); continue; }
  await writeFile(dest, r.buf);
  // Safety copy of every original into the flat archive.
  const archive = path.join(base, "13 Archive", "_originals", path.basename(dest));
  if (!existsSync(archive)) await copyFile(dest, archive);
  log.push({ url: a.url, dest: path.relative(base, dest), bytes: r.bytes, type: r.type });
  console.log("OK", (r.bytes / 1024).toFixed(0) + "KB", path.relative(base, dest));
}

await writeFile(path.join(base, "download-log.json"), JSON.stringify({ when: null, brand: brand.name, log }, null, 2));
const ok = log.filter((l) => l.dest && !l.skip).length;
console.log(`\n${brand.name}: ${ok} downloaded, ${log.filter(l=>l.skip).length} skipped, ${log.filter(l=>l.error).length} failed.`);
