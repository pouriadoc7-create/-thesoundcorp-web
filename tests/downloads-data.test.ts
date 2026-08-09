import { existsSync } from "node:fs";

import { describe, expect, it } from "vitest";

import { BRANDS } from "@/lib/data/brands";
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

  it("every document has exactly one valid source, a valid format, and a unique id", () => {
    for (const brand of DOWNLOAD_BRANDS) {
      for (const product of brand.products) {
        const ids = product.documents.map((d) => d.id);
        expect(new Set(ids).size, `dup doc id in ${brand.slug}/${product.slug}`).toBe(ids.length);
        for (const doc of product.documents) {
          // Exactly one of officialUrl (remote, proxied) / localPath (imported).
          const hasRemote = typeof doc.officialUrl === "string";
          const hasLocal = typeof doc.localPath === "string";
          expect(hasRemote !== hasLocal, `${doc.id} must set exactly one of officialUrl/localPath`).toBe(true);
          if (doc.officialUrl) {
            expect(doc.officialUrl.startsWith("https://"), `${doc.id} not https`).toBe(true);
            expect(isUrlOnBrandDomains(doc.officialUrl, brand), `${doc.id} off-domain`).toBe(true);
          }
          if (doc.localPath) {
            expect(doc.localPath.startsWith("/downloads/"), `${doc.id} localPath not under /downloads/`).toBe(true);
            expect(doc.localPath.includes(".."), `${doc.id} localPath contains ..`).toBe(false);
          }
          expect(VALID_FORMATS, `${doc.id} bad format`).toContain(doc.format);
        }
      }
    }
  });

  it("has no duplicate document sources within a brand", () => {
    for (const brand of DOWNLOAD_BRANDS) {
      const srcs = brand.products.flatMap((p) => p.documents.map((d) => d.officialUrl ?? d.localPath));
      expect(new Set(srcs).size, `dup source in ${brand.slug}`).toBe(srcs.length);
    }
  });

  it("every imported local file + product image resolves to a real file in /public", () => {
    for (const brand of DOWNLOAD_BRANDS) {
      for (const product of brand.products) {
        if (product.imageUrl?.startsWith("/")) {
          expect(existsSync(`public${product.imageUrl}`), `missing image ${product.imageUrl}`).toBe(true);
        }
        for (const doc of product.documents) {
          if (doc.localPath) {
            expect(existsSync(`public${doc.localPath}`), `missing file ${doc.localPath}`).toBe(true);
          }
        }
      }
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

  it("covers all 26 marketing brands (Downloads brand list == Our Brands)", () => {
    // Owner decision (2026-08): the Download Center lists every brand the site
    // carries (26), so a brand tile exists for each — even before its files land.
    expect(DOWNLOAD_BRANDS.length).toBe(26);
    const dlSlugs = new Set(DOWNLOAD_BRANDS.map((b) => b.slug));
    for (const b of BRANDS) {
      expect(dlSlugs.has(b.slug), `download brand missing for '${b.slug}'`).toBe(true);
    }
  });
});
