/**
 * Official brand logos, keyed by BRANDS[].slug. This is the single source of
 * truth for a brand's mark — read by the homepage "Our Brands" grid, the
 * /brands index and detail pages, product detail pages, the Download Center
 * brand tiles, and the header navigation (desktop mega-menu + mobile menu) —
 * all via <BrandLogo>.
 *
 * Every file lives in /public/brand-logos/ and is a white / light / official-
 * colour version prepared for the site's dark background (SVG where a vector
 * exists; high-resolution PNG otherwise). Keys match BRANDS[].slug.
 */
export const BRAND_LOGOS: Record<string, string> = {
  aai: "/brand-logos/aai.png",
  aavik: "/brand-logos/aavik.svg",
  "acoustic-arts": "/brand-logos/acoustic-arts.svg",
  audes: "/brand-logos/audes.svg",
  audioflight: "/brand-logos/audioflight.svg",
  audiovector: "/brand-logos/audiovector.svg",
  borresen: "/brand-logos/borresen.svg",
  cayin: "/brand-logos/cayin.png",
  chord: "/brand-logos/chord.svg",
  davis: "/brand-logos/davis.png",
  eat: "/brand-logos/eat.svg",
  esoteric: "/brand-logos/esoteric.svg",
  graham: "/brand-logos/graham.png",
  jadis: "/brand-logos/jadis.png",
  jorma: "/brand-logos/jorma.png",
  marten: "/brand-logos/marten.png",
  mastersound: "/brand-logos/mastersound.png",
  merason: "/brand-logos/merason.png",
  primare: "/brand-logos/primare.png",
  qln: "/brand-logos/qln.svg",
  qualiton: "/brand-logos/qualiton.png",
  roksan: "/brand-logos/roksan.png",
  soulnote: "/brand-logos/soulnote.svg",
  teac: "/brand-logos/teac.svg",
  "van-den-hul": "/brand-logos/van-den-hul.svg",
  "vienna-acoustics": "/brand-logos/vienna-acoustics.svg",
};

/**
 * Per-logo visual size tuning so every mark reads at a balanced weight in a
 * logo grid. Pure `transform: scale` (aspect ratio preserved — no distortion,
 * no layout shift). Slugs not listed render at their natural size (scale 1).
 * Shared by the homepage grid, the /brands directory, and the header nav — every
 * place logos sit in a centered, consistent-height, object-contain box.
 */
export const LOGO_SCALE: Record<string, number> = {
  // compact marks — enlarged
  aavik: 1.464,
  "acoustic-arts": 1.464,
  borresen: 1.464,
  marten: 1.464,
  audiovector: 1.2,
  davis: 1.2,
  graham: 1.22,
  primare: 1.22,
  soulnote: 1.22,
  jadis: 1.22,
  // wide wordmarks — reduced to balance their visual weight
  jorma: 0.68,
  teac: 0.68,
  roksan: 0.68,
  audes: 0.68,
};
