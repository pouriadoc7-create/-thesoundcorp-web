export interface Brand {
  name: string;
  slug: string;
  /** Reserved for a future brand description; unused until real copy exists. */
  description?: string;
}
// Brand logos are not a field on Brand — they live in lib/data/brand-logos.ts
// (BRAND_LOGOS, keyed by slug), the single mechanism every logo consumer uses.

export interface BrandColumn {
  title: string;
  brands: Brand[];
}
