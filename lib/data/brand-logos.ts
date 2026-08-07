/**
 * Official brand logos for the homepage "Our Brands" grid ONLY.
 *
 * Kept deliberately separate from lib/data/brands.ts (which only holds name +
 * slug) so the header mega-menu, mobile navigation and any other consumer of
 * `brand.logoUrl` are completely unaffected — they intentionally keep showing
 * the champagne-gold wordmarks. Only <BrandsGrid> reads this map.
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
