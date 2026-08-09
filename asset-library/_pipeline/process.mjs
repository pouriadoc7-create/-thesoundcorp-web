// Generates web-ready derivatives from the untouched originals using sharp.
// - Responsive widths (mobile..ultrahd), never upscaled
// - WebP + AVIF + JPEG for every size; PNG kept where the source has alpha
// - White + Black monochrome logos derived from transparent PNG logos
// - Social crops (Instagram/Facebook/LinkedIn/YouTube/X) from hero + lifestyle
// Originals are never touched.
//
// Usage: node process.mjs marten
import sharp from "sharp";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { BRANDS, RESPONSIVE, RASTER_FORMATS, SOCIAL } from "./config.mjs";
import { ensureDir, libraryPath, walk, isImage } from "./lib.mjs";

sharp.cache(false);
const slug = process.argv[2];
const brand = BRANDS.find((b) => b.slug === slug);
if (!brand) { console.error("Unknown brand slug"); process.exit(1); }
const base = libraryPath(slug);
let made = 0;

const encoders = {
  webp: (p) => p.webp({ quality: 82 }),
  avif: (p) => p.avif({ quality: 55, effort: 2 }),
  jpeg: (p) => p.jpeg({ quality: 82, mozjpeg: true }),
  png: (p) => p.png({ compressionLevel: 9 }),
};
const extOf = (fmt) => (fmt === "jpeg" ? "jpg" : fmt);

async function emit(buf, meta, outPath, fmt, width) {
  const p = sharp(buf, { failOn: "none" }).resize({ width: Math.min(width, meta.width), withoutEnlargement: true });
  if (fmt === "jpeg" && meta.hasAlpha) p.flatten({ background: "#ffffff" });
  await ensureDir(path.dirname(outPath));
  await encoders[fmt](p).toFile(outPath);
  made++;
}

/** Responsive size set in every raster format (+PNG when alpha). */
async function responsiveSet(buf, meta, outDir, baseName) {
  const formats = meta.hasAlpha ? [...RASTER_FORMATS, "png"] : RASTER_FORMATS;
  for (const [, width] of Object.entries(RESPONSIVE)) {
    if (width > meta.width && width !== Math.min(...Object.values(RESPONSIVE))) continue; // don't upscale beyond original
    for (const fmt of formats) {
      const folder = { jpeg: "JPG", webp: "WebP", avif: "AVIF", png: "PNG" }[fmt];
      await emit(buf, meta, path.join(outDir, folder, `${baseName}-${Math.min(width, meta.width)}.${extOf(fmt)}`), fmt, width);
    }
  }
  // Convenience single-master per named breakpoint (spec's size folders: no Ultra HD folder).
  const sizeFolders = { mobile: "Mobile", tablet: "Tablet", laptop: "Laptop", desktop: "Desktop", retina: "Retina" };
  for (const [sizeName, folder] of Object.entries(sizeFolders)) {
    await emit(buf, meta, path.join(outDir, folder, `${baseName}-${sizeName}.jpg`), "jpeg", RESPONSIVE[sizeName]);
  }
}

async function makeMono(buf, meta, outPath, color) {
  // Use the source alpha as a mask over a solid colour → clean white/black logo.
  const alpha = await sharp(buf, { failOn: "none" }).ensureAlpha().extractChannel("alpha").toBuffer();
  await ensureDir(path.dirname(outPath));
  await sharp({ create: { width: meta.width, height: meta.height, channels: 3, background: color } })
    .joinChannel(alpha).png().toFile(outPath);
  made++;
}

async function social(buf, baseName) {
  for (const [name, s] of Object.entries(SOCIAL)) {
    const out = path.join(base, "11 Social Media", name, `${baseName}-${name}.jpg`);
    await ensureDir(path.dirname(out));
    await sharp(buf, { failOn: "none" }).resize({ width: s.w, height: s.h, fit: "cover", position: "attention" })
      .flatten({ background: "#0a0a0a" }).jpeg({ quality: 84, mozjpeg: true }).toFile(out);
    made++;
  }
}

const files = (await walk(base)).filter(isImage)
  .filter((f) => !/[\\/](Desktop|Laptop|Tablet|Mobile|Retina|Ultrahd|WebP|AVIF|JPG|PNG|White|Black|_web|11 Social Media)[\\/]/i.test(f));

for (const f of files) {
  const rel = path.relative(base, f);
  const buf = await readFile(f);
  let meta;
  try { meta = await sharp(buf, { failOn: "none" }).metadata(); } catch { console.warn("unreadable", rel); continue; }
  const baseName = path.basename(f, path.extname(f));

  if (/^03 Products[\\/]/.test(rel)) {
    const productDir = path.join(base, "03 Products", rel.split(/[\\/]/)[1]);
    await responsiveSet(buf, meta, productDir, baseName);
  } else if (/^01 Logos[\\/]PNG[\\/]/.test(rel) && meta.hasAlpha) {
    await makeMono(buf, meta, path.join(base, "01 Logos", "White", `${baseName}-white.png`), "#ffffff");
    await makeMono(buf, meta, path.join(base, "01 Logos", "Black", `${baseName}-black.png`), "#000000");
    await responsiveSet(buf, meta, path.join(base, "01 Logos"), baseName);
  } else if (/^(02 Hero Images|04 Lifestyle|05 Rooms|00 Brand)[\\/]/.test(rel)) {
    await responsiveSet(buf, meta, path.join(path.dirname(f), "_web"), baseName);
    if (/^(02 Hero Images|04 Lifestyle)/.test(rel)) await social(buf, baseName);
  }
  console.log("processed", rel, `(${meta.width}x${meta.height}${meta.hasAlpha ? " alpha" : ""})`);
}
console.log(`\n${brand.name}: generated ${made} derivative files.`);
