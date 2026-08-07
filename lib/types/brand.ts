export interface Brand {
  name: string;
  slug: string;
  /** Reserved for a future brand logo asset; unused until real images exist. */
  logoUrl?: string;
  /** Reserved for a future brand description; unused until real copy exists. */
  description?: string;
}

export interface BrandColumn {
  title: string;
  brands: Brand[];
}
