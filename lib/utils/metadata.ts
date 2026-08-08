import type { Metadata } from "next";

import { SITE_NAME, SITE_URL } from "@/lib/constants/site";

import { buildLanguageAlternates } from "./alternates";

interface OgImage {
  url: string;
  width?: number;
  height?: number;
  alt?: string;
}

interface PageMetadataArgs {
  locale: string;
  /** Locale-agnostic path: "" (home), "/about", `/products/${slug}`, … */
  path: string;
  /** Page title (the layout appends "| TheSoundCorp" via its title template). */
  title: string;
  description: string;
  /** OpenGraph object type; product pages should pass "article"/"website". */
  ogType?: "website" | "article" | "profile";
  /** Override the social image(s); defaults to the branded 1200×630 OG card. */
  images?: OgImage[];
}

const DEFAULT_OG_IMAGE: OgImage = {
  url: "/og-image.jpg",
  width: 1200,
  height: 630,
  alt: SITE_NAME,
};

/**
 * Single source of truth for per-page metadata. Guarantees every page ships a
 * self-referencing canonical, hreflang alternates, and page-specific Open Graph
 * + Twitter tags pointing at the production domain — instead of inheriting the
 * homepage's. Use in each route's generateMetadata.
 */
export function buildPageMetadata({
  locale,
  path,
  title,
  description,
  ogType = "website",
  images,
}: PageMetadataArgs): Metadata {
  const url = `${SITE_URL}/${locale}${path}`;
  const ogImages = images ?? [DEFAULT_OG_IMAGE];

  return {
    title,
    description,
    alternates: {
      canonical: url,
      languages: buildLanguageAlternates(path),
    },
    openGraph: {
      type: ogType,
      siteName: SITE_NAME,
      url,
      locale: locale === "fa" ? "fa_IR" : "en_US",
      // Advertise the sibling locale so scrapers know the page has an
      // equivalent in the other language (pairs with the hreflang alternates).
      alternateLocale: locale === "fa" ? "en_US" : "fa_IR",
      title,
      description,
      images: ogImages,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ogImages.map((i) => i.url),
    },
  };
}
