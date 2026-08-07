// Builds the FINAL REPORT across all brands: per-brand counts (logos, products,
// manuals, catalogs, videos, lifestyle, mobile/desktop derivatives), missing
// assets, a completeness score, and recommendations. Reads only what's on disk
// (never fabricates). Writes REPORT.md + report.json at the library root.
//
// Usage: node report.mjs
import { readdir, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { BRANDS } from "./config.mjs";
import { ROOT, libraryPath, walk, isImage, readJSON } from "./lib.mjs";

const EXPECTED = ["01 Logos", "02 Hero Images", "03 Products", "06 Catalogs", "07 Manuals", "08 Datasheets"];

async function countIn(dir, pred) {
  return (await walk(dir)).filter(pred).length;
}
const isPdf = (f) => f.toLowerCase().endsWith(".pdf");
const isVideo = (f) => /\.(mp4|mov|webm|m4v)$/i.test(f);

async function analyseBrand(b) {
  const base = libraryPath(b.slug);
  const manifest = await readJSON(path.join(base, "manifest.json"), { assets: [] });
  const dl = await readJSON(path.join(base, "download-log.json"), { log: [] });
  const qc = await readJSON(path.join(base, "qc-report.json"), null);

  const logos = await countIn(path.join(base, "01 Logos"), (f) => /\.(svg|png|eps|ai|pdf)$/i.test(f) && !/[\\/](White|Black)[\\/]/.test(f));
  const productDirs = existsSync(path.join(base, "03 Products"))
    ? (await readdir(path.join(base, "03 Products"), { withFileTypes: true })).filter((d) => d.isDirectory()).map((d) => d.name) : [];
  const heroes = await countIn(path.join(base, "02 Hero Images"), (f) => isImage(f) && !/[\\/](_web)[\\/]/.test(f));
  const lifestyle = await countIn(path.join(base, "04 Lifestyle"), (f) => isImage(f) && !/[\\/](_web)[\\/]/.test(f));
  const catalogs = await countIn(path.join(base, "06 Catalogs"), isPdf);
  const manuals = await countIn(path.join(base, "07 Manuals"), isPdf);
  const datasheets = await countIn(path.join(base, "08 Datasheets"), isPdf);
  const videos = await countIn(path.join(base, "09 Videos"), isVideo);
  const mobile = await countIn(base, (f) => /[\\/]Mobile[\\/]/i.test(f) || /-mobile\.jpg$/i.test(f));
  const desktop = await countIn(base, (f) => /[\\/]Desktop[\\/]/i.test(f) || /-desktop\.jpg$/i.test(f));

  const present = EXPECTED.filter((cat) => {
    if (cat === "01 Logos") return logos > 0;
    if (cat === "02 Hero Images") return heroes > 0;
    if (cat === "03 Products") return productDirs.length > 0;
    if (cat === "06 Catalogs") return catalogs > 0;
    if (cat === "07 Manuals") return manuals > 0;
    if (cat === "08 Datasheets") return datasheets > 0;
    return false;
  });
  const missing = EXPECTED.filter((c) => !present.includes(c));
  const completeness = Math.round((present.length / EXPECTED.length) * 100);

  const recs = [];
  if (!logos) recs.push("No logo captured yet — seed manifest with the official SVG/PNG logo.");
  if (!productDirs.length) recs.push("No products yet — add product hero images to the manifest.");
  if (!manuals && !catalogs) recs.push("No PDFs — check the brand's Downloads/Support page for manuals & catalogs.");
  if (qc?.lowResolution) recs.push(`${qc.lowResolution} image(s) below the resolution threshold — source larger originals if available.`);
  if (!manifest.assets.length) recs.push("Manifest empty — run recon to list official asset URLs before downloading.");

  return {
    brand: b.name, slug: b.slug, domain: b.domain,
    counts: { logos, products: productDirs.length, heroes, lifestyle, catalogs, manuals, datasheets, videos, mobileDerivatives: mobile, desktopDerivatives: desktop },
    products: productDirs,
    downloaded: dl.log.filter((l) => l.dest && !l.skip).length,
    qc: qc ? { scanned: qc.scanned, broken: qc.broken, lowResolution: qc.lowResolution, nearDuplicates: qc.nearDuplicates } : null,
    missing, completeness, recommendations: recs,
  };
}

const results = [];
for (const b of BRANDS) results.push(await analyseBrand(b));

const md = [];
md.push("# Master Asset Library — Final Report\n");
md.push(`Generated across ${BRANDS.length} official brands. Counts reflect files actually present on disk.\n`);
md.push("| Brand | Logos | Products | Manuals | Catalogs | Videos | Lifestyle | Mobile | Desktop | Complete | Missing |");
md.push("|---|--:|--:|--:|--:|--:|--:|--:|--:|--:|---|");
for (const r of results) {
  const c = r.counts;
  md.push(`| ${r.brand} | ${c.logos} | ${c.products} | ${c.manuals} | ${c.catalogs} | ${c.videos} | ${c.lifestyle} | ${c.mobileDerivatives} | ${c.desktopDerivatives} | ${r.completeness}% | ${r.missing.join(", ") || "—"} |`);
}
md.push("\n## Per-brand recommendations\n");
for (const r of results) {
  if (!r.recommendations.length) continue;
  md.push(`**${r.brand}** — ${r.completeness}%`);
  for (const rec of r.recommendations) md.push(`- ${rec}`);
  md.push("");
}
await writeFile(path.join(ROOT, "REPORT.md"), md.join("\n"));
await writeFile(path.join(ROOT, "report.json"), JSON.stringify(results, null, 2));
console.log(`Report written → asset-library/REPORT.md (${results.length} brands).`);
console.log("Avg completeness:", Math.round(results.reduce((a, r) => a + r.completeness, 0) / results.length) + "%");
