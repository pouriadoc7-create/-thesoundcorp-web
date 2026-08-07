import type { MetadataRoute } from "next";

import { routing } from "@/i18n/routing";
import { SITE_URL } from "@/lib/constants/site";
import { getAllBrandSlugs } from "@/lib/data/brands";
import { getAllProductSlugs } from "@/lib/data/products";
import { buildLanguageAlternates } from "@/lib/utils/alternates";

const STATIC_PATHS = [
  "",
  "/about",
  "/contact",
  "/products",
  "/gallery",
  "/downloads",
  "/brands",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const brandPaths = getAllBrandSlugs().map((slug) => `/brands/${slug}`);
  const productPaths = getAllProductSlugs().map((slug) => `/products/${slug}`);
  const allPaths = [...STATIC_PATHS, ...brandPaths, ...productPaths];

  return allPaths.flatMap((path) =>
    routing.locales.map((locale) => ({
      url: `${SITE_URL}/${locale}${path}`,
      lastModified: now,
      alternates: { languages: buildLanguageAlternates(path) },
    }))
  );
}
