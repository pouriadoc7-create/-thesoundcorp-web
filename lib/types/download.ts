/**
 * Download Center data model.
 *
 * This is a self-contained dataset, deliberately separate from the marketing
 * catalogue in `lib/data/products.ts` / `lib/data/brands.ts`. It powers the
 * `/downloads` experience only and is shaped `Brand → Products → Documents`
 * so new brands/products/documents are a pure data addition.
 *
 * IMPORTANT: no document file is ever stored in this project. Each document
 * keeps the manufacturer's own official file URL; the site streams it on
 * demand through a same-origin proxy (see `app/api/download/route.ts`) so the
 * user downloads directly without leaving TheSoundCorp and without us hosting
 * the file.
 */

/** Groups a document into one of the ordered sections shown in the UI. */
export type DownloadDocType =
  | "user-manual"
  | "quick-start"
  | "datasheet"
  | "technical"
  | "brochure"
  | "firmware"
  | "software"
  | "other";

/** File container, shown as a small format chip and used for the filename. */
export type DownloadFormat = "PDF" | "ZIP" | "EXE" | "DOCX" | "DOC" | "PPTX";

export interface DownloadDocument {
  /** Stable, URL-safe id, unique within its product. The download proxy
   *  resolves the official URL from (brand, product, id) — the client never
   *  sends a URL, which keeps the proxy SSRF-safe. */
  id: string;
  type: DownloadDocType;
  /** Official document title, as published by the manufacturer. */
  title: string;
  /** Language chip, e.g. "EN", "DE", "EN/DE". */
  language?: string;
  /** Manufacturer version string, if published. */
  version?: string;
  /** Publication / revision date (ISO `YYYY-MM-DD` or as-published), if known. */
  date?: string;
  format: DownloadFormat;
  /** Size in bytes, only when the official server reports Content-Length. */
  fileSize?: number;
  /** Direct URL to the file on the manufacturer's OWN official domain. */
  officialUrl: string;
}

export interface DownloadProduct {
  slug: string;
  name: string;
  /** Short model / order code, e.g. "NP5". */
  modelCode?: string;
  /** Human category, e.g. "Network Player". */
  category: string;
  status?: "current" | "legacy";
  /** One-line hook shown under the product name. */
  tagline?: string;
  /** A few key specifications shown in the product hero. */
  specs?: { label: string; value: string }[];
  /**
   * Official product image. When set, the hero renders it (local `/public`
   * path, or a remote host allowed in `next.config`); when absent, a premium
   * branded placeholder is shown. Lighting up the real photo is therefore a
   * data-only change — no component edit.
   */
  imageUrl?: string;
  /** Tiny base64 LQIP for `imageUrl`'s blur-up. */
  imageBlurDataURL?: string;
  documents: DownloadDocument[];
}

export interface DownloadBrand {
  /** Matches `Brand.slug` so the shared brand logo can be reused. */
  slug: string;
  name: string;
  /** The brand's primary official domain (shown in the UI). */
  officialDomain: string;
  /** Additional official domains this brand publishes files on (e.g. a regional
   *  or international site). Together with `officialDomain` these form the proxy
   *  allowlist for the brand — anything else is refused. */
  altDomains?: string[];
  /** Optional short brand note shown on the brand view. */
  blurb?: string;
  products: DownloadProduct[];
}
