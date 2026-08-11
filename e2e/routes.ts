/**
 * Single source of truth for the pages every e2e suite walks.
 *
 * Kept deliberately small: one representative page per route *shape* (index,
 * dynamic detail, client-heavy explorer, form). Walking all 98 prerendered
 * pages would be slow without catching anything the shapes don't already.
 */
export const LOCALES = ["en", "fa"] as const;
export type Locale = (typeof LOCALES)[number];

/** Locale-relative paths — prefix with `/${locale}`. */
export const ROUTES = [
  { path: "", name: "home" },
  { path: "/brands", name: "brands-index" },
  { path: "/brands/audiovector", name: "brand-detail" },
  { path: "/products", name: "products-index" },
  { path: "/products/marten-dexter", name: "product-detail" },
  { path: "/gallery", name: "gallery" },
  { path: "/downloads", name: "downloads" },
  { path: "/about", name: "about" },
  { path: "/contact", name: "contact" },
] as const;

export function urlFor(locale: Locale, path: string): string {
  return `/${locale}${path}`;
}

/** Every locale × route pair, flattened for `for (const … of …)` test loops. */
export const ALL_PAGES = LOCALES.flatMap((locale) =>
  ROUTES.map((route) => ({ locale, ...route, url: urlFor(locale, route.path) })),
);

/**
 * Viewport widths that have to stay overflow-free. These are the exact widths
 * verified by hand during the mobile-centering work (CLAUDE.md §9) — iPhone SE
 * through iPad landscape.
 */
export const OVERFLOW_WIDTHS = [360, 375, 390, 430, 440, 768, 810, 1024];
