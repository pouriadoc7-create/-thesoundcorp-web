// Generates SEO metadata for every ORIGINAL image: seo filename, alt, title,
// caption, description, keywords. Writes a per-brand CSV (12 SEO/seo.csv) plus
// one JSON sidecar per image. Bilingual-ready (EN alt/title; add FA as needed).
//
// Usage: node seo.mjs marten
import { writeFile } from "node:fs/promises";
import path from "node:path";
import { BRANDS } from "./config.mjs";
import { ensureDir, libraryPath, walk, isImage, slugify } from "./lib.mjs";

const slug = process.argv[2];
const brand = BRANDS.find((b) => b.slug === slug);
if (!brand) { console.error("Unknown brand slug"); process.exit(1); }
const base = libraryPath(slug);
const brandName = brand.name.replace(/\s*\(.*\)\s*/, "").trim();

const csvEsc = (s) => `"${String(s).replace(/"/g, '""')}"`;
const titleCase = (s) => s.replace(/[-_]+/g, " ").replace(/\b\w/g, (m) => m.toUpperCase()).trim();

function meta(rel) {
  const parts = rel.split(/[\\/]/);
  const cat = parts[0];
  const isProduct = cat === "03 Products";
  const product = isProduct ? titleCase(parts[1]) : null;
  const fileBase = path.basename(rel, path.extname(rel));
  const angle = isProduct ? (fileBase.split("-").pop() || "front") : null;
  const subject = product ? `${brandName} ${product}` : brandName;

  const kind = {
    "00 Brand": "brand imagery", "01 Logos": "logo", "02 Hero Images": "hero image",
    "03 Products": "product photo", "04 Lifestyle": "lifestyle image", "05 Rooms": "listening room",
    "10 Icons": "icon",
  }[cat] || "image";

  const seoFilename = `${slugify(subject)}-${slugify(fileBase)}-high-end-audio${path.extname(rel)}`.replace(/-+/g, "-");
  const alt = product
    ? `${subject} ${angle && angle !== fileBase ? angle + " view " : ""}— ${kind} | high-end Hi-Fi audio`
    : `${subject} ${kind} — luxury high-end Hi-Fi audio`;
  const title = `${subject} — ${titleCase(kind)}`;
  const caption = product
    ? `${subject}, distributed by The Sound Corp. Tehran.`
    : `${brandName} — official ${kind}, distributed by The Sound Corp.`;
  const description = product
    ? `High-resolution ${kind} of the ${subject}, a reference high-end audio component. Official manufacturer asset, available at The Sound Corp., authorised distributor in Iran.`
    : `Official ${brandName} ${kind}. ${brandName} is a premium Hi-Fi / high-end audio marque distributed by The Sound Corp.`;
  const keywords = [
    brandName, product, "high-end audio", "Hi-Fi", "luxury audio", "audiophile",
    kind, "Tehran", "Iran", "The Sound Corp",
  ].filter(Boolean).join(", ");

  return { file: rel, seoFilename, alt, title, caption, description, keywords };
}

const images = (await walk(base)).filter(isImage)
  // Originals only: product Originals, logos, and the top-level hero/lifestyle/room/brand files.
  .filter((f) => /(^|[\\/])(Original|01 Logos[\\/](SVG|PNG)|02 Hero Images|04 Lifestyle|05 Rooms|00 Brand)([\\/]|$)/i.test(path.relative(base, f)))
  // Exclude every derivative folder AND the flat archive safety-copies (avoid double-tagging).
  .filter((f) => !/(^|[\\/])(Desktop|Laptop|Tablet|Mobile|Retina|Ultrahd|WebP|AVIF|JPG|PNG|White|Black|_web|13 Archive|11 Social Media)([\\/])/i.test(path.relative(base, f)));

const rows = [];
for (const f of images) {
  const rel = path.relative(base, f);
  const m = meta(rel);
  rows.push(m);
  const jsonPath = path.join(base, "12 SEO", "sidecars", rel.replace(/[\\/]/g, "__") + ".json");
  await ensureDir(path.dirname(jsonPath));
  await writeFile(jsonPath, JSON.stringify(m, null, 2));
}

const header = ["file", "seoFilename", "alt", "title", "caption", "description", "keywords"];
const csv = [header.join(","), ...rows.map((r) => header.map((h) => csvEsc(r[h])).join(","))].join("\n");
await ensureDir(path.join(base, "12 SEO"));
await writeFile(path.join(base, "12 SEO", "seo.csv"), csv);
await writeFile(path.join(base, "12 SEO", "seo.json"), JSON.stringify(rows, null, 2));
console.log(`${brand.name}: SEO metadata for ${rows.length} images → 12 SEO/seo.csv`);
