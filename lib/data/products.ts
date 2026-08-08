import type { Product, ProductCategory } from "@/lib/types/product";
import { slugify } from "@/lib/utils/slugify";

/**
 * Product catalogue. Product names and brands are real marques TheSoundCorp
 * distributes. Specifications/taglines remain representative until official
 * datasheets are supplied.
 *
 * IMAGES ARE DATA-DRIVEN: give a product an `imageUrl` (primary, used on the
 * card + OG) and per-view `src` on its `gallery` items to render real, optimized
 * photography through next/image. Products without images fall back to the
 * premium branded placeholder automatically — no component changes required.
 * The Marten Dexter below is wired to real photography as the reference.
 */

// LQIP blur-up placeholders for the Marten Dexter photography (generated from
// the source images; regenerate if the photos change).
const MARTEN_DEXTER_FRONT_BLUR =
  "data:image/jpeg;base64,/9j/2wBDABQODxIPDRQSEBIXFRQYHjIhHhwcHj0sLiQySUBMS0dARkVQWnNiUFVtVkVGZIhlbXd7gYKBTmCNl4x9lnN+gXz/2wBDARUXFx4aHjshITt8U0ZTfHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHz/wAARCAAPABQDASIAAhEBAxEB/8QAFwAAAwEAAAAAAAAAAAAAAAAAAAQFA//EACMQAAIBBAEDBQAAAAAAAAAAAAECAwAEESExBSKBEhMUQVH/xAAVAQEBAAAAAAAAAAAAAAAAAAADAv/EABsRAAICAwEAAAAAAAAAAAAAAAABAhESMVET/9oADAMBAAIRAxEAPwCgtyjWM0TjthLAgjkCpHVrmK6W2eNfR7KMpBG9jVbK4njlVco0mSWB+zUdRdG7WKPDyRtsPgr5/aByvQqjWxiHAt4s27ydg2uMcUUz8tUwssBVxyEOvFFR6vgmC6f/2Q==";
const MARTEN_DEXTER_REAR_BLUR =
  "data:image/jpeg;base64,/9j/2wBDABQODxIPDRQSEBIXFRQYHjIhHhwcHj0sLiQySUBMS0dARkVQWnNiUFVtVkVGZIhlbXd7gYKBTmCNl4x9lnN+gXz/2wBDARUXFx4aHjshITt8U0ZTfHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHz/wAARCAAPABQDASIAAhEBAxEB/8QAGAAAAwEBAAAAAAAAAAAAAAAAAAMEBQb/xAAkEAACAQMDAwUAAAAAAAAAAAABAgMABAUREhMhIjEyQVGBkf/EABUBAQEAAAAAAAAAAAAAAAAAAAID/8QAGBEAAgMAAAAAAAAAAAAAAAAAAAECE1H/2gAMAwEAAhEDEQA/AIp8Kgsob2Jl2OFLKpPuKvxkdvLwN6inXzqp+qzZcnw4pIIySq9vWk4S5lEyxI2m7RQPnWpvRrDo7+fdckhx4opE1mxkJDn9oqV0B1SP/9k=";

export const PRODUCT_CATEGORIES: ProductCategory[] = [
  "loudspeakers",
  "amplifiers",
  "digital-sources",
  "accessories",
];

type ProductSeed = Omit<Product, "slug" | "brandSlug">;

const SEED: ProductSeed[] = [
  // ---- Loudspeakers ----
  {
    name: "Dexter",
    brand: "MARTEN",
    category: "loudspeakers",
    tagline: "Floorstanding loudspeaker with ceramic and diamond drivers",
    description:
      "A reference floorstander in Marten's signature idiom — a diamond tweeter paired with ceramic drivers in a sculpted, resonance-optimised cabinet. The Dexter delivers effortless dynamics and holographic imaging that disappears into the room.",
    specs: [
      { label: "Configuration", value: "3-way, 4 drivers" },
      { label: "Tweeter", value: "Diamond 20 mm" },
      { label: "Frequency response", value: "26 Hz – 60 kHz" },
      { label: "Sensitivity", value: "88 dB / 2.83 V" },
      { label: "Impedance", value: "6 Ω nominal" },
      { label: "Finish", value: "High-gloss piano lacquer" },
    ],
    imageUrl: "/products/marten-dexter/front.jpg",
    imageBlurDataURL: MARTEN_DEXTER_FRONT_BLUR,
    gallery: [
      { label: "Front", src: "/products/marten-dexter/front.jpg", blurDataURL: MARTEN_DEXTER_FRONT_BLUR },
      { label: "Rear", src: "/products/marten-dexter/rear.jpg", blurDataURL: MARTEN_DEXTER_REAR_BLUR },
    ],
    priceNote: "Price on enquiry",
  },
  {
    name: "05 Silver Supreme",
    brand: "BORRESEN",
    category: "loudspeakers",
    tagline: "Stand-mount monitor with zero-loss iron-free drivers",
    description:
      "A compact stand-mount that defies its size. Børresen's patented iron-free driver technology all but eliminates dynamic compression, producing a vast, silent-background soundstage from a deceptively small enclosure.",
    specs: [
      { label: "Configuration", value: "2-way, 2 drivers" },
      { label: "Tweeter", value: "Planar ribbon" },
      { label: "Frequency response", value: "50 Hz – 50 kHz" },
      { label: "Sensitivity", value: "86 dB / 2.83 V" },
      { label: "Impedance", value: "6 Ω nominal" },
      { label: "Finish", value: "Walnut / black lacquer" },
    ],
    gallery: [{ label: "Front" }, { label: "45°" }, { label: "Detail" }],
    priceNote: "Price on enquiry",
  },
  {
    name: "R6 Arreté",
    brand: "AUDIOVECTOR",
    category: "loudspeakers",
    tagline: "Full-range floorstander with Freedom Grounding",
    description:
      "The flagship of Audiovector's R series employs Air Motion Transformer tweeters and the brand's Freedom Grounding Concept to drain distortion from the signal path, revealing microdetail with natural, fatigue-free tone.",
    specs: [
      { label: "Configuration", value: "3-way, 6 drivers" },
      { label: "Tweeter", value: "AMT + rear ambience" },
      { label: "Frequency response", value: "24 Hz – 53 kHz" },
      { label: "Sensitivity", value: "90.5 dB / 2.83 V" },
      { label: "Impedance", value: "8 Ω nominal" },
      { label: "Finish", value: "Italian high-gloss" },
    ],
    gallery: [{ label: "Front" }, { label: "45°" }, { label: "Detail" }, { label: "Rear" }],
    priceNote: "Price on enquiry",
  },
  // ---- Amplifiers ----
  {
    name: "I-280",
    brand: "AAVIK",
    category: "amplifiers",
    tagline: "Integrated amplifier with active tesla-coil noise cancellation",
    description:
      "A fully-featured integrated amplifier employing Aavik's active square-tesla-coil and dither circuitry to lower the noise floor dramatically. The result is a black, quiet backdrop against which every instrument is precisely placed.",
    specs: [
      { label: "Type", value: "Integrated amplifier" },
      { label: "Output power", value: "2 × 200 W / 8 Ω" },
      { label: "Inputs", value: "4 × RCA, 3 × XLR" },
      { label: "THD", value: "< 0.005 %" },
      { label: "Dimensions", value: "37 × 10 × 40 cm" },
      { label: "Weight", value: "14 kg" },
    ],
    gallery: [{ label: "Front" }, { label: "45°" }, { label: "Connections" }, { label: "Top" }],
    priceNote: "Price on enquiry",
  },
  {
    name: "DA88S",
    brand: "JADIS",
    category: "amplifiers",
    tagline: "Class-A tube integrated amplifier, hand-built in France",
    description:
      "A pure Class-A valve integrated using KT88 output tubes, hand-wired point-to-point in the Jadis workshop. Its liquid midrange and holographic staging are the hallmark of classic French tube artistry.",
    specs: [
      { label: "Type", value: "Tube integrated (Class A)" },
      { label: "Output tubes", value: "4 × KT88" },
      { label: "Output power", value: "2 × 40 W" },
      { label: "Inputs", value: "5 × RCA" },
      { label: "Dimensions", value: "45 × 22 × 30 cm" },
      { label: "Weight", value: "26 kg" },
    ],
    gallery: [{ label: "Front" }, { label: "45°" }, { label: "Detail" }, { label: "Top" }],
    priceNote: "Price on enquiry",
  },
  {
    name: "Compact 845",
    brand: "MASTERSOUND",
    category: "amplifiers",
    tagline: "Single-ended triode integrated with dual output transformers",
    description:
      "An Italian single-ended triode design built around the legendary 845 valve. MasterSound's proprietary output transformers deliver rich harmonic texture and an immediacy that solid-state rarely matches.",
    specs: [
      { label: "Type", value: "SET tube integrated" },
      { label: "Output tubes", value: "2 × 845" },
      { label: "Output power", value: "2 × 30 W" },
      { label: "Inputs", value: "4 × RCA" },
      { label: "Dimensions", value: "44 × 25 × 42 cm" },
      { label: "Weight", value: "38 kg" },
    ],
    gallery: [{ label: "Front" }, { label: "45°" }, { label: "Detail" }],
    priceNote: "Price on enquiry",
  },
  // ---- Digital Sources ----
  {
    name: "N-05XD",
    brand: "ESOTERIC",
    category: "digital-sources",
    tagline: "Network DAC/preamplifier with discrete D/A conversion",
    description:
      "A network streamer, DAC, and analogue preamplifier in one, built on Esoteric's discrete Master Sound Discrete DAC and VRDS heritage. Roon Ready and MQA-capable, it is a complete digital hub of uncommon refinement.",
    specs: [
      { label: "Type", value: "Network DAC / preamp" },
      { label: "Conversion", value: "Discrete 64-bit" },
      { label: "Formats", value: "PCM 768 kHz / DSD 22.6 MHz" },
      { label: "Connectivity", value: "Ethernet, USB, coax, optical" },
      { label: "Roon", value: "Roon Ready" },
      { label: "Weight", value: "13 kg" },
    ],
    gallery: [{ label: "Front" }, { label: "45°" }, { label: "Connections" }, { label: "Display" }],
    priceNote: "Price on enquiry",
  },
  {
    name: "UD-701N",
    brand: "TEAC",
    category: "digital-sources",
    tagline: "Reference network player with discrete Delta-Sigma DAC",
    description:
      "TEAC's Reference 700 flagship combines a network player, USB DAC, and preamplifier using a fully discrete dual-monaural Delta-Sigma converter. Meticulous clock management yields exceptional timing and low jitter.",
    specs: [
      { label: "Type", value: "Network player / DAC" },
      { label: "Conversion", value: "Discrete Delta-Sigma" },
      { label: "Formats", value: "PCM 768 kHz / DSD 22.6 MHz" },
      { label: "Connectivity", value: "Ethernet, USB, Bluetooth" },
      { label: "Outputs", value: "XLR + RCA" },
      { label: "Weight", value: "12 kg" },
    ],
    gallery: [{ label: "Front" }, { label: "45°" }, { label: "Connections" }, { label: "Display" }],
    priceNote: "Price on enquiry",
  },
  {
    name: "DAC1 Mk II",
    brand: "MERASON",
    category: "digital-sources",
    tagline: "Fully balanced R-2R digital-to-analogue converter",
    description:
      "A Swiss-made, fully discrete R-2R converter that prizes musical naturalness over specsmanship. The Merason DAC1 renders voices and acoustic instruments with a warmth and body that reminds you why you listen.",
    specs: [
      { label: "Type", value: "R-2R DAC" },
      { label: "Architecture", value: "Fully balanced, dual DAC" },
      { label: "Formats", value: "PCM 192 kHz / DSD64" },
      { label: "Inputs", value: "USB, coax, optical, AES" },
      { label: "Outputs", value: "XLR + RCA" },
      { label: "Weight", value: "7 kg" },
    ],
    gallery: [{ label: "Front" }, { label: "45°" }, { label: "Connections" }],
    priceNote: "Price on enquiry",
  },
  // ---- Accessories ----
  {
    name: "The Mountain Hybrid",
    brand: "VAN DEN HUL",
    category: "accessories",
    tagline: "Balanced interconnect with Hulliflex® screening",
    description:
      "A reference balanced interconnect using van den Hul's hybrid conductor and Hulliflex® jacket for immunity to interference. It preserves the finest low-level detail without ever sounding etched.",
    specs: [
      { label: "Type", value: "Balanced interconnect" },
      { label: "Conductor", value: "Hybrid silver / matched carbon" },
      { label: "Termination", value: "XLR (Neutrik)" },
      { label: "Screening", value: "Hulliflex®" },
      { label: "Length", value: "1.0 m (pair)" },
      { label: "Warranty", value: "Lifetime" },
    ],
    gallery: [{ label: "Overview" }, { label: "Termination" }, { label: "Detail" }],
    priceNote: "Price on enquiry",
  },
  {
    name: "Trinity Statement",
    brand: "JORMA",
    category: "accessories",
    tagline: "Flagship loudspeaker cable with multi-gauge conductors",
    description:
      "Jorma Design's statement loudspeaker cable layers multiple conductor gauges to optimise across the frequency band. The Trinity brings scale and grip to the bottom end while keeping the treble open and airy.",
    specs: [
      { label: "Type", value: "Loudspeaker cable" },
      { label: "Conductor", value: "Multi-gauge OCC copper" },
      { label: "Termination", value: "Spade or banana" },
      { label: "Geometry", value: "Proprietary weave" },
      { label: "Length", value: "2.5 m (pair)" },
      { label: "Warranty", value: "Lifetime" },
    ],
    gallery: [{ label: "Overview" }, { label: "Termination" }, { label: "Detail" }],
    priceNote: "Price on enquiry",
  },
  {
    name: "Reference Rack IV",
    brand: "ACOUSTIC ARTS",
    category: "accessories",
    tagline: "Modular isolation rack for source and amplification",
    description:
      "A modular equipment rack engineered to drain mechanical resonance away from sensitive electronics. Constant-layer damping and adjustable feet let you tune isolation to your room and components.",
    specs: [
      { label: "Type", value: "Equipment rack" },
      { label: "Shelves", value: "4 (modular, expandable)" },
      { label: "Load / shelf", value: "60 kg" },
      { label: "Isolation", value: "Constrained-layer damping" },
      { label: "Footprint", value: "60 × 50 cm" },
      { label: "Finish", value: "Black / natural oak" },
    ],
    gallery: [{ label: "Overview" }, { label: "Detail" }, { label: "45°" }],
    priceNote: "Price on enquiry",
  },
];

export const PRODUCTS: Product[] = SEED.map((p) => ({
  ...p,
  slug: slugify(`${p.brand}-${p.name}`),
  brandSlug: slugify(p.brand),
}));

export function getAllProductSlugs(): string[] {
  return PRODUCTS.map((p) => p.slug);
}

export function getProductBySlug(slug: string): Product | undefined {
  return PRODUCTS.find((p) => p.slug === slug);
}

/** Brands that actually have at least one product — for the brand filter. */
export function getProductBrands(): string[] {
  return [...new Set(PRODUCTS.map((p) => p.brand))].sort((a, b) => a.localeCompare(b));
}

/** All products for a given brand slug (used on brand detail pages). */
export function getProductsByBrand(brandSlug: string) {
  return PRODUCTS.filter((p) => p.brandSlug === brandSlug);
}

/** Up to `limit` products in the same category, excluding the given product. */
export function getRelatedProducts(product: Product, limit = 3): Product[] {
  return PRODUCTS.filter(
    (p) => p.category === product.category && p.slug !== product.slug
  ).slice(0, limit);
}
