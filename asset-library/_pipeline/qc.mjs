// Quality control over ORIGINAL images: verifies each opens, records real
// dimensions, flags LOW RESOLUTION vs the brief's thresholds, and detects
// near-duplicates via difference-hash (Hamming distance <= 5). Writes a QC
// report; never deletes anything (duplicates are reported for your sign-off).
//
// Usage: node qc.mjs marten
import sharp from "sharp";
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { BRANDS, MIN_RES } from "./config.mjs";
import { ensureDir, libraryPath, walk, isImage, dHash } from "./lib.mjs";

sharp.cache(false);
const slug = process.argv[2];
const brand = BRANDS.find((b) => b.slug === slug);
if (!brand) { console.error("Unknown brand slug"); process.exit(1); }
const base = libraryPath(slug);

const hamming = (a, b) => {
  let x = BigInt("0x" + a) ^ BigInt("0x" + b), c = 0;
  while (x) { c += Number(x & 1n); x >>= 1n; }
  return c;
};
const catOf = (rel) => rel.split(/[\\/]/)[0];
const minFor = (rel) => MIN_RES[catOf(rel)] ?? MIN_RES._default;

const originals = (await walk(base)).filter(isImage)
  // Skip every derivative folder, the flat archive copies, and social/SEO output.
  .filter((f) => !/(^|[\\/])(Desktop|Laptop|Tablet|Mobile|Retina|Ultrahd|WebP|AVIF|JPG|PNG|White|Black|_web|11 Social Media|12 SEO|13 Archive)([\\/])/i.test(path.relative(base, f)));

const items = [], broken = [], lowres = [], dups = [];
for (const f of originals) {
  const rel = path.relative(base, f);
  try {
    const buf = await readFile(f);
    const m = await sharp(buf, { failOn: "none" }).metadata();
    const longest = Math.max(m.width || 0, m.height || 0);
    const hash = await dHash(sharp, buf);
    const rec = { file: rel, w: m.width, h: m.height, longest, format: m.format, hash, min: minFor(rel) };
    items.push(rec);
    if (longest < rec.min) { rec.lowres = true; lowres.push({ file: rel, longest, required: rec.min }); }
  } catch (e) { broken.push({ file: rel, error: String(e.message || e) }); }
}
// duplicate detection
for (let i = 0; i < items.length; i++)
  for (let j = i + 1; j < items.length; j++)
    if (hamming(items[i].hash, items[j].hash) <= 5)
      dups.push({ keep: items[i].file, duplicate: items[j].file, distance: hamming(items[i].hash, items[j].hash),
        reason: "near-identical (dHash) — keep the higher-resolution copy" });

const report = {
  brand: brand.name, scanned: items.length,
  broken: broken.length, lowResolution: lowres.length, nearDuplicates: dups.length,
  details: { broken, lowres, dups },
  items: items.map(({ file, w, h, longest, format, lowres }) => ({ file, w, h, longest, format, lowres: !!lowres })),
};
await ensureDir(path.join(base, "12 SEO"));
await writeFile(path.join(base, "qc-report.json"), JSON.stringify(report, null, 2));
console.log(`${brand.name} QC — scanned ${items.length}: ${broken.length} broken, ${lowres.length} low-res, ${dups.length} dup pairs.`);
if (lowres.length) console.log("  LOW-RES:", lowres.slice(0, 5).map((l) => `${l.file} (${l.longest}px<${l.required})`).join("; "));
