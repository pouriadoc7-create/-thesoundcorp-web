import { describe, expect, it } from "vitest";

import { BRAND_LOGOS, LOGO_SCALE } from "@/lib/data/brand-logos";
import { BRANDS, getAllBrandSlugs, getBrandBySlug, getBrandColumns } from "@/lib/data/brands";
import { slugify } from "@/lib/utils/slugify";

describe("brands data", () => {
  it("has 26 brands, alphabetically sorted by name, with unique slugs", () => {
    expect(BRANDS.length).toBe(26);
    const names = BRANDS.map((b) => b.name);
    expect(names).toEqual([...names].sort((a, b) => a.localeCompare(b)));
    const slugs = BRANDS.map((b) => b.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it("each slug equals slugify(name)", () => {
    for (const b of BRANDS) expect(b.slug).toBe(slugify(b.name));
  });

  it("getAllBrandSlugs / getBrandBySlug behave", () => {
    expect(getAllBrandSlugs().length).toBe(26);
    expect(getBrandBySlug("primare")?.name).toBe("PRIMARE");
    expect(getBrandBySlug("nope")).toBeUndefined();
  });

  it("getBrandColumns splits every brand into balanced columns", () => {
    const cols = getBrandColumns(5);
    expect(cols.length).toBeLessThanOrEqual(5);
    const total = cols.reduce((n, c) => n + c.brands.length, 0);
    expect(total).toBe(BRANDS.length);
    const sizes = cols.map((c) => c.brands.length);
    expect(Math.max(...sizes) - Math.min(...sizes)).toBeLessThanOrEqual(1);
  });

  it("every brand has a logo and LOGO_SCALE keys are all valid slugs", () => {
    const valid = new Set(getAllBrandSlugs());
    for (const b of BRANDS) expect(BRAND_LOGOS[b.slug], `missing logo: ${b.slug}`).toBeTruthy();
    for (const slug of Object.keys(LOGO_SCALE)) expect(valid.has(slug), `bad LOGO_SCALE key: ${slug}`).toBe(true);
  });
});
