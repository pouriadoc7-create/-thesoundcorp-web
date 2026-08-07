// Creates the exact Master Assets/ folder tree for every brand (or one brand).
// Usage: node scaffold.mjs            -> all 26 brands
//        node scaffold.mjs marten     -> just that slug
import { writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { BRANDS, CATEGORY_DIRS, LOGO_SUBDIRS } from "./config.mjs";
import { ensureDir, libraryPath } from "./lib.mjs";

const only = process.argv[2];
const brands = only ? BRANDS.filter((b) => b.slug === only) : BRANDS;
if (!brands.length) { console.error("No matching brand:", only); process.exit(1); }

for (const b of brands) {
  const base = libraryPath(b.slug);
  for (const cat of CATEGORY_DIRS) {
    await ensureDir(path.join(base, cat));
    if (cat === "01 Logos") for (const s of LOGO_SUBDIRS) await ensureDir(path.join(base, cat, s));
  }
  // A place for untouched source downloads, kept separate from web derivatives.
  await ensureDir(path.join(base, "13 Archive", "_originals"));
  // Seed an empty manifest if none exists yet.
  const manifest = path.join(base, "manifest.json");
  if (!existsSync(manifest)) {
    await writeFile(manifest, JSON.stringify({
      brand: b.name, slug: b.slug, domain: b.domain,
      note: "Add {url, category, product?, angle?, filename?} entries. category must match a Master Assets folder name.",
      assets: [],
    }, null, 2));
  }
  console.log("scaffolded", b.slug);
}
console.log(`\nDone — ${brands.length} brand tree(s).`);
