import { describe, expect, it } from "vitest";

import { getBrandBySlug } from "@/lib/data/brands";
import {
  PRODUCTS,
  PRODUCT_CATEGORIES,
  getAllProductSlugs,
  getProductBrands,
  getProductBySlug,
  getProductsByBrand,
  getRelatedProducts,
} from "@/lib/data/products";

describe("products data", () => {
  it("has products with unique slugs and valid categories", () => {
    expect(PRODUCTS.length).toBeGreaterThan(0);
    const slugs = PRODUCTS.map((p) => p.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
    for (const p of PRODUCTS) expect(PRODUCT_CATEGORIES).toContain(p.category);
  });

  it("every product's brandSlug resolves to a real brand", () => {
    for (const p of PRODUCTS) expect(getBrandBySlug(p.brandSlug), `unknown brand: ${p.brandSlug}`).toBeDefined();
  });

  it("getProductBySlug / getAllProductSlugs behave", () => {
    expect(getAllProductSlugs().length).toBe(PRODUCTS.length);
    const first = PRODUCTS[0];
    expect(getProductBySlug(first.slug)?.name).toBe(first.name);
    expect(getProductBySlug("nope")).toBeUndefined();
  });

  it("getProductsByBrand returns only that brand's products", () => {
    for (const p of PRODUCTS.slice(0, 5)) {
      const list = getProductsByBrand(p.brandSlug);
      expect(list.some((x) => x.slug === p.slug)).toBe(true);
      expect(list.every((x) => x.brandSlug === p.brandSlug)).toBe(true);
    }
  });

  it("getRelatedProducts returns same-category items, excludes self, within the limit", () => {
    const p = PRODUCTS[0];
    const related = getRelatedProducts(p, 3);
    expect(related.length).toBeLessThanOrEqual(3);
    expect(related.every((r) => r.category === p.category && r.slug !== p.slug)).toBe(true);
  });

  it("getProductBrands lists distinct, sorted brands that each have ≥1 product", () => {
    const brands = getProductBrands();
    expect(new Set(brands).size).toBe(brands.length);
    expect(brands).toEqual([...brands].sort((a, b) => a.localeCompare(b)));
    for (const name of brands) expect(PRODUCTS.some((p) => p.brand === name)).toBe(true);
  });
});
