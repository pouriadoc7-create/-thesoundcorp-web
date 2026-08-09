// Central configuration for the Master Asset Library pipeline.
// Everything downstream (scaffold, download, process, seo, qc, report) reads this.

export const LIBRARY_ROOT = "Master Assets";

/** The 26 official brands — name, url slug, and the ONLY domain we ever touch. */
export const BRANDS = [
  { slug: "aai", name: "AAI (Authentic Audio Industry)", domain: "https://aai.sk/en/" },
  { slug: "aavik", name: "Aavik", domain: "https://aavik-acoustics.com" },
  { slug: "acoustic-arts", name: "Acoustic Arts", domain: "https://acoustic-arts.de" },
  { slug: "audes", name: "Audes", domain: "https://audes.eu" },
  { slug: "audioflight", name: "Audioflight", domain: "https://www.audioflight.it" },
  { slug: "audiovector", name: "Audiovector", domain: "https://audiovector.com" },
  { slug: "borresen", name: "Børresen", domain: "https://borresen-acoustics.com" },
  { slug: "cayin", name: "Cayin", domain: "https://en.cayin.cn" },
  { slug: "chord-electronics", name: "Chord Electronics", domain: "https://chordelectronics.co.uk" },
  { slug: "davis-acoustics", name: "Davis Acoustics", domain: "https://www.davis-acoustics.com" },
  { slug: "eat", name: "European Audio Team (E.A.T.)", domain: "https://www.europeanaudioteam.com" },
  { slug: "esoteric", name: "Esoteric", domain: "https://www.esoteric.jp/en" },
  { slug: "graham-audio", name: "Graham Audio", domain: "https://grahamaudio.co.uk" },
  { slug: "jadis", name: "Jadis", domain: "https://jadis-electronics.com" },
  { slug: "jorma-design", name: "Jorma Design", domain: "https://jormadesign.com" },
  { slug: "marten", name: "Marten", domain: "https://www.marten.se" },
  { slug: "mastersound", name: "Mastersound", domain: "https://mastersoundsas.it" },
  { slug: "merason", name: "Merason", domain: "https://merason.com" },
  { slug: "primare", name: "Primare", domain: "https://primare.net" },
  { slug: "qln", name: "QLN", domain: "https://qln.se" },
  { slug: "qualiton", name: "Qualiton", domain: "https://qualiton.eu" },
  { slug: "roksan", name: "Roksan", domain: "https://www.roksan.com" },
  { slug: "soulnote", name: "Soulnote", domain: "https://www.soulnote.audio" },
  { slug: "teac", name: "TEAC", domain: "https://teac.jp" },
  { slug: "van-den-hul", name: "Van den Hul", domain: "https://www.vandenhul.com" },
  { slug: "vienna-acoustics", name: "Vienna Acoustics", domain: "https://www.vienna-acoustics.com" },
];

/** Numbered category folders — exactly as specified in the brief. */
export const CATEGORY_DIRS = [
  "00 Brand",
  "01 Logos",
  "02 Hero Images",
  "03 Products",
  "04 Lifestyle",
  "05 Rooms",
  "06 Catalogs",
  "07 Manuals",
  "08 Datasheets",
  "09 Videos",
  "10 Icons",
  "11 Social Media",
  "12 SEO",
  "13 Archive",
];

/** Sub-folders inside 01 Logos and inside each 03 Products/<product>. */
export const LOGO_SUBDIRS = ["SVG", "PNG", "White", "Black"];
export const PRODUCT_SUBDIRS = [
  "Original", "Desktop", "Laptop", "Tablet", "Mobile", "Retina", "WebP", "AVIF", "PNG", "JPG",
];

/** The canonical per-product angle set the brief asks for (used by the report). */
export const PRODUCT_ANGLES = [
  "front", "rear", "left", "right", "top", "bottom", "45-degree",
  "detail", "lifestyle", "packaging", "accessories", "connections",
  "remote", "display", "internal",
];

/** Responsive breakpoints (target width in px, longest side). */
export const RESPONSIVE = {
  mobile: 640,
  tablet: 1024,
  laptop: 1440,
  desktop: 1920,
  retina: 2880,
  ultrahd: 3840,
};

/** Raster output formats. PNG is only emitted when the source has transparency. */
export const RASTER_FORMATS = ["webp", "avif", "jpeg"];

/** Social export specs (name -> {w,h,fit}). */
export const SOCIAL = {
  "instagram-square": { w: 1080, h: 1080, fit: "cover" },
  "instagram-portrait": { w: 1080, h: 1350, fit: "cover" },
  "instagram-landscape": { w: 1080, h: 566, fit: "cover" },
  "facebook-link": { w: 1200, h: 630, fit: "cover" },
  "linkedin-share": { w: 1200, h: 627, fit: "cover" },
  "youtube-thumb": { w: 1280, h: 720, fit: "cover" },
  "youtube-banner": { w: 2560, h: 1440, fit: "cover" },
  "x-post": { w: 1600, h: 900, fit: "cover" },
};

/** Minimum "highest side" resolution before we flag LOW RESOLUTION (from brief). */
export const MIN_RES = {
  "02 Hero Images": 5000,
  "04 Lifestyle": 4000,
  "05 Rooms": 4000,
  "03 Products": 3000,
  _default: 2000,
};

export const IMAGE_EXT = new Set([".jpg", ".jpeg", ".png", ".webp", ".avif", ".tif", ".tiff"]);
export const VECTOR_EXT = new Set([".svg", ".eps", ".ai", ".pdf"]);
export const VIDEO_EXT = new Set([".mp4", ".mov", ".webm", ".m4v"]);

export const USER_AGENT =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124 Safari/537.36";
