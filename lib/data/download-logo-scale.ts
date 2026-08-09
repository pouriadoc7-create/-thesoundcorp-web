/**
 * Download Center logo-size normalization — DOWNLOADS SECTION ONLY.
 *
 * A per-brand scale applied to each mark in the Download Center brand grid
 * (BrandTile) and brand header (DownloadsExplorer → ProductsView), on top of a
 * fixed object-contain envelope box — `h-[62px] w-[156px]` mobile,
 * `sm:h-[76px] sm:w-[190px]` desktop (~0.82x on mobile). CHANGE THE BOX AND THIS
 * MAP TOGETHER.
 *
 * Goal: every logo reads at approximately the same VISUAL WEIGHT (equal rendered
 * area) as AUDES — the widest reference wordmark — with each logo's aspect ratio
 * preserved (a uniform scale never stretches/distorts). Values were derived
 * deterministically from each asset's intrinsic aspect ratio (equal-area target,
 * height-clamped): wide marks scale down and width-cap; compact/square marks fill
 * the box height so they don't read as smaller.
 *
 * This is INDEPENDENT of `LOGO_SCALE` in lib/data/brand-logos.ts (used by the
 * site-wide "Our Brands" grid). Editing this map affects the Downloads section
 * only. A slug absent here renders at scale 1.
 */
export const DOWNLOAD_LOGO_SCALE: Record<string, number> = {
  // wide wordmarks — reference weight, width-capped
  aai: 0.989,
  audes: 0.989,
  jorma: 0.982,
  roksan: 0.953,
  teac: 0.922,
  merason: 0.91,
  mastersound: 0.81,
  qualiton: 0.779,
  eat: 0.734,
  esoteric: 0.716,
  // medium marks
  chord: 0.661,
  "van-den-hul": 0.676,
  audiovector: 0.686,
  audioflight: 0.694,
  cayin: 0.7,
  "vienna-acoustics": 0.771,
  jadis: 0.778,
  qln: 0.787,
  soulnote: 0.859,
  marten: 0.928,
  // compact / square marks — fill the box height to match the wide logos' weight
  davis: 1,
  "acoustic-arts": 1,
  primare: 1,
  graham: 1,
  borresen: 1,
  aavik: 1,
};
