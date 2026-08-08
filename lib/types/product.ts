export type ProductCategory =
  | "loudspeakers"
  | "amplifiers"
  | "digital-sources"
  | "accessories";

export interface ProductSpec {
  label: string;
  value: string;
}

/**
 * A single view in the product gallery. `label` names the angle (e.g. Front).
 * When `src` is set, real photography is rendered through next/image (with the
 * `blurDataURL` LQIP if supplied); when it is absent the premium branded
 * placeholder is shown instead. Adding real photos is therefore a data-only
 * change — set `src` (and optionally `blurDataURL`) here, no component edits.
 */
export interface ProductView {
  label: string;
  /** Local image path under /public (e.g. "/products/marten-dexter/front.jpg").
   *  Remote hosts are intentionally not permitted by next.config images. */
  src?: string;
  /** Tiny base64 LQIP used for the blur-up placeholder. */
  blurDataURL?: string;
}

export interface Product {
  slug: string;
  name: string;
  /** Brand display name — matches an entry in lib/data/brands. */
  brand: string;
  brandSlug: string;
  category: ProductCategory;
  /** One-line hook shown on cards and under the title. */
  tagline: string;
  /** Short paragraph for the detail page. */
  description: string;
  specs: ProductSpec[];
  /**
   * Primary product image (used by the card and Open Graph). When set, real
   * photography renders via next/image; when absent the branded placeholder is
   * used. Setting this is the ONLY change needed to light up a product photo.
   */
  imageUrl?: string;
  /** Tiny base64 LQIP for `imageUrl`'s blur-up placeholder. */
  imageBlurDataURL?: string;
  /** Gallery angles. Views with a `src` render real photos; the rest fall back. */
  gallery: ProductView[];
  /** Luxury pricing is by enquiry; kept as a short note rather than a number. */
  priceNote: string;
}
