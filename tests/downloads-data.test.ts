import { describe, expect, it } from "vitest";

import { DOWNLOAD_BRANDS } from "@/lib/data/downloads";
import type { DownloadFormat } from "@/lib/types/download";
import { isUrlOnBrandDomains } from "@/lib/utils/downloads";

const VALID_FORMATS: DownloadFormat[] = ["PDF", "ZIP", "EXE", "DOCX", "DOC", "PPTX"];

describe("Download Center data integrity", () => {
  it("has brands, and every brand slug is unique", () => {
    expect(DOWNLOAD_BRANDS.length).toBeGreaterThanOrEqual(1);
    const slugs = DOWNLOAD_BRANDS.map((b) => b.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it("every product has a unique slug within its brand and at least one document", () => {
    for (const brand of DOWNLOAD_BRANDS) {
      const productSlugs = brand.products.map((p) => p.slug);
      expect(new Set(productSlugs).size, `dup product slug in ${brand.slug}`).toBe(productSlugs.length);
      for (const product of brand.products) {
        expect(product.documents.length, `${brand.slug}/${product.slug} has no docs`).toBeGreaterThan(0);
      }
    }
  });

  it("every document is https, on the brand's official domain(s), with a valid format and unique id", () => {
    for (const brand of DOWNLOAD_BRANDS) {
      for (const product of brand.products) {
        const ids = product.documents.map((d) => d.id);
        expect(new Set(ids).size, `dup doc id in ${brand.slug}/${product.slug}`).toBe(ids.length);
        for (const doc of product.documents) {
          expect(doc.officialUrl.startsWith("https://"), `${doc.id} not https`).toBe(true);
          expect(isUrlOnBrandDomains(doc.officialUrl, brand), `${doc.id} off-domain`).toBe(true);
          expect(VALID_FORMATS, `${doc.id} bad format`).toContain(doc.format);
        }
      }
    }
  });

  it("has no duplicate official URLs within a brand", () => {
    for (const brand of DOWNLOAD_BRANDS) {
      const urls = brand.products.flatMap((p) => p.documents.map((d) => d.officialUrl));
      expect(new Set(urls).size, `dup url in ${brand.slug}`).toBe(urls.length);
    }
  });

  it("only AudioVector retains download content; every other brand is cleared", () => {
    // Business rule (owner decision, 2026-08): download files/products were
    // cleared for every brand EXCEPT AudioVector, which keeps its content exactly.
    // Brand entries + metadata are retained so links can be re-added later.
    for (const brand of DOWNLOAD_BRANDS) {
      if (brand.slug === "audiovector") {
        expect(brand.products.length, "audiovector should keep its products").toBeGreaterThan(0);
      } else {
        expect(brand.products.length, `${brand.slug} should be cleared`).toBe(0);
      }
    }
  });

  it("does not include excluded brands (TEAC / Marten)", () => {
    const slugs = new Set(DOWNLOAD_BRANDS.map((b) => b.slug));
    expect(slugs.has("teac")).toBe(false);
    expect(slugs.has("marten")).toBe(false);
  });
});
