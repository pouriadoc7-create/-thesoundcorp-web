import { describe, expect, it } from "vitest";

import { BRANDS } from "@/lib/data/brands";
import { BRAND_LOGOS } from "@/lib/data/brand-logos";
import { DOWNLOAD_BRANDS } from "@/lib/data/downloads";
import { PRODUCTS } from "@/lib/data/products";

/**
 * Cross-dataset slug invariants. The site stitches four independently-authored
 * datasets together by brand slug (marketing brands, brand logos, the product
 * catalogue, and the Download Center). Nothing but these tests stops one of
 * them drifting — e.g. a product pointing at a brand slug that no longer
 * exists, or a Download-Center brand whose "N documents" chip on /brands can
 * never resolve. Catch that at test time, not in production.
 */
describe("cross-dataset slug invariants", () => {
  const brandSlugs = new Set(BRANDS.map((b) => b.slug));
  const logoSlugs = new Set(Object.keys(BRAND_LOGOS));

  it("every product points at a real marketing brand slug", () => {
    for (const p of PRODUCTS) {
      expect(brandSlugs.has(p.brandSlug), `product '${p.slug}' -> unknown brand '${p.brandSlug}'`).toBe(true);
    }
  });

  it("every product's brand has a logo (renders a mark, not the bare-wordmark fallback)", () => {
    for (const p of PRODUCTS) {
      expect(logoSlugs.has(p.brandSlug), `brand '${p.brandSlug}' has no BRAND_LOGOS entry`).toBe(true);
    }
  });

  it("no orphan brand logos — every BRAND_LOGOS key is a real brand slug", () => {
    for (const slug of logoSlugs) {
      expect(brandSlugs.has(slug), `BRAND_LOGOS has orphan slug '${slug}'`).toBe(true);
    }
  });

  it("every Download Center brand resolves to a marketing brand (so /brands doc-count + deep-links align)", () => {
    for (const d of DOWNLOAD_BRANDS) {
      expect(brandSlugs.has(d.slug), `download brand '${d.slug}' is not in the marketing brand list`).toBe(true);
    }
  });
});
