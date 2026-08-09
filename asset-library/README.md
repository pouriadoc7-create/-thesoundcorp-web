# Master Asset Library — build system

A repeatable, official-source-only pipeline that turns each manufacturer's
downloadable assets into a clean, web-ready, SEO-tagged library for
thesoundcorp-web.

## What this is (and how it stays honest)

The brief asks to "download everything" from 26 official brand sites and generate
every responsive / format / social / SEO derivative. Two realities shape how this
is built:

1. **Most manufacturer sites don't publish a full per-product angle set** (rear,
   top, bottom, internal, packaging, remote). They publish a hero shot or two, a
   catalog PDF, and manuals. The pipeline captures whatever the official site
   actually offers and the **report lists what's genuinely missing** — it never
   invents assets or a "100%" that isn't real.
2. **These are copyrighted assets.** As an authorised distributor you are the
   intended recipient of each brand's press / dealer / media kit, which is the
   compliant channel. The downloader is **hard-restricted to each brand's own
   official domain** and pulls only URLs you place in that brand's `manifest.json`.
   Confirm redistribution terms per brand before publishing to production — most
   provide a dealer asset licence for exactly this.

## Folder layout

```
Master Assets/<brand>/
  00 Brand/ 01 Logos/{SVG,PNG,White,Black}/ 02 Hero Images/ 03 Products/<product>/{Original,Desktop,Laptop,Tablet,Mobile,Retina,WebP,AVIF,PNG,JPG}/
  04 Lifestyle/ 05 Rooms/ 06 Catalogs/ 07 Manuals/ 08 Datasheets/ 09 Videos/
  10 Icons/ 11 Social Media/ 12 SEO/ 13 Archive/_originals/
  manifest.json         <- you (or recon) list official asset URLs here
```

## Workflow (per brand)

```bash
cd asset-library/_pipeline

node scaffold.mjs <slug>     # 1. create the folder tree (already run for all 26)
# 2. populate Master Assets/<slug>/manifest.json with official asset URLs
node download.mjs <slug>     # 3. fetch untouched originals (official domain only)
node process.mjs <slug>      # 4. responsive + WebP/AVIF/JPEG/PNG + mono logos + social
node seo.mjs <slug>          # 5. alt/title/caption/description/keywords + filenames
node qc.mjs <slug>           # 6. dimensions, low-res flags, duplicate detection
node report.mjs              # 7. (all brands) completeness + missing + recommendations
```

`<slug>` values are in `_pipeline/config.mjs` (e.g. `marten`, `soulnote`, `qln`).

## manifest.json entry shape

```json
{ "assets": [
  { "url": "https://www.marten.se/.../logo.svg", "category": "01 Logos" },
  { "url": "https://www.marten.se/.../oscar-trio.jpg", "category": "03 Products",
    "product": "Oscar Trio", "angle": "front" },
  { "url": "https://www.marten.se/.../catalogue.pdf", "category": "06 Catalogs",
    "filename": "marten-catalogue.pdf" }
] }
```

`category` must equal one of the numbered folder names. The downloader **refuses
any URL that is not on the brand's official domain.**

## Guarantees

- **Originals are never modified** — derivatives are written to new folders; a
  flat safety copy lands in `13 Archive/_originals/`.
- **Never upscales** — responsive widths only ever downscale from the original.
- **QC reports, never deletes** — duplicates/low-res are listed for your sign-off.

## Outputs

- `Master Assets/<brand>/12 SEO/seo.csv` + per-image JSON sidecars
- `Master Assets/<brand>/qc-report.json`
- `asset-library/REPORT.md` + `report.json` (all brands)
