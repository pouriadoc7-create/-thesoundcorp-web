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

// Crawl hints per page role. The home and portfolio hubs change most often and
// matter most; individual brand/product pages are stable reference content.
function crawlHints(path: string): { changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"]; priority: number } {
  if (path === "") return { changeFrequency: "weekly", priority: 1 };
  if (path === "/brands" || path === "/products" || path === "/downloads")
    return { changeFrequency: "weekly", priority: 0.8 };
  if (path.startsWith("/brands/") || path.startsWith("/products/"))
    return { changeFrequency: "monthly", priority: 0.6 };
  return { changeFrequency: "monthly", priority: 0.5 };
}

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const brandPaths = getAllBrandSlugs().map((slug) => `/brands/${slug}`);
  const productPaths = getAllProductSlugs().map((slug) => `/products/${slug}`);
  const allPaths = [...STATIC_PATHS, ...brandPaths, ...productPaths];

  return allPaths.flatMap((path) => {
    const { changeFrequency, priority } = crawlHints(path);
    return routing.locales.map((locale) => ({
      url: `${SITE_URL}/${locale}${path}`,
      lastModified: now,
      changeFrequency,
      priority,
      alternates: { languages: buildLanguageAlternates(path) },
    }));
  });
}
