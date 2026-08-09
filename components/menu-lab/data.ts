import { BRANDS } from "@/lib/data/brands";

import type { LabData } from "./types";

/**
 * Lab data mirrors the real site structure (same nav keys/hrefs as
 * lib/constants/site.ts, same brand list as lib/data/brands.ts) but carries its
 * own EN/FA labels, because /menu-lab lives outside the [locale] tree and
 * therefore outside the next-intl provider.
 */
export const LAB_DATA: LabData = {
  nav: [
    { key: "home", href: "/", label: { en: "Home Page", fa: "صفحه اصلی" } },
    { key: "brands", href: "/brands", label: { en: "Brands", fa: "برندها" } },
    { key: "products", href: "/products", label: { en: "Products", fa: "محصولات" } },
    { key: "gallery", href: "/gallery", label: { en: "Gallery", fa: "گالری" } },
    { key: "downloads", href: "/downloads", label: { en: "Downloads", fa: "دانلودها" } },
    { key: "about", href: "/about", label: { en: "About", fa: "درباره ما" } },
    { key: "contact", href: "/contact", label: { en: "Contact", fa: "تماس با ما" } },
  ],
  brands: BRANDS.map((b) => ({ slug: b.slug, name: b.name })),
  copy: {
    search: { en: "Search", fa: "جست‌وجو" },
    language: { en: "Language", fa: "زبان" },
    brands: { en: "Brands", fa: "برندها" },
    close: { en: "Close", fa: "بستن" },
    menu: { en: "Menu", fa: "منو" },
    back: { en: "Back to Lab", fa: "بازگشت به آزمایشگاه" },
    noResults: { en: "No matches", fa: "نتیجه‌ای نیست" },
  },
};

export interface ConceptMeta {
  id: string;
  number: string;
  title: Record<"en" | "fa", string>;
  tagline: string;
  /** One-line description of the interaction philosophy. */
  philosophy: string;
}

export const CONCEPTS: ConceptMeta[] = [
  {
    id: "strata",
    number: "01",
    title: { en: "Holographic Strata", fa: "لایه‌های هولوگرافیک" },
    tagline: "Depth planes",
    philosophy: "Navigation suspended across parallax depth planes; drag to move through the stack.",
  },
  {
    id: "orbital",
    number: "02",
    title: { en: "Orbital Resonance", fa: "تشدید مداری" },
    tagline: "Radial dial",
    philosophy: "A weighted dial orbiting the monogram; rotate to bring a destination into focus.",
  },
  {
    id: "editorial",
    number: "03",
    title: { en: "Cinematic Editorial", fa: "تیتراژ سینمایی" },
    tagline: "Type in motion",
    philosophy: "Oversized editorial type on a rotating cylinder; the focused line resolves from blur.",
  },
  {
    id: "glass",
    number: "04",
    title: { en: "Optical Glass", fa: "معماری شیشه" },
    tagline: "Refractive fins",
    philosophy: "Angled optical fins that pivot flat as light rakes across them.",
  },
  {
    id: "acoustic",
    number: "05",
    title: { en: "Acoustic Resonance", fa: "تشدید آکوستیک" },
    tagline: "Standing wave",
    philosophy: "Destinations sit at the antinodes of a living standing wave; touch excites the medium.",
  },
  {
    id: "aperture",
    number: "06",
    title: { en: "Spatial Aperture", fa: "دیافراگم فضایی" },
    tagline: "Focus pull",
    philosophy: "A lens iris opens; scrub the focus ring to pull a destination into the plane of focus.",
  },
];
