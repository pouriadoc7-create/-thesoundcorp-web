import { DOWNLOAD_BRANDS } from "@/lib/data/downloads";
import type { DownloadBrand, DownloadDocument, DownloadProduct } from "@/lib/types/download";

import {
  buildSearchIndexFor,
  countBrandDocuments,
  DOC_GROUPS,
  findBrand,
  findProduct,
  groupDocuments,
  groupKeyForType,
} from "./downloads-view";
import type { DocGroupDef, DocumentGroup, DownloadSearchRow } from "./downloads-view";

/**
 * Data-bound Download Center helpers — these reach into the full DOWNLOAD_BRANDS
 * catalogue, so this module (unlike ./downloads-view) is server/proxy-only; a
 * client component importing from here would bundle the whole dataset. The pure
 * helpers are re-exported below so existing imports of "@/lib/utils/downloads"
 * (server pages, the proxy, tests) keep resolving unchanged.
 */

// Re-export the pure, data-free helpers (defined in ./downloads-view).
export { DOC_GROUPS, countBrandDocuments, findBrand, findProduct, groupDocuments, groupKeyForType, buildSearchIndexFor };
export type { DocGroupDef, DocumentGroup, DownloadSearchRow };

// ---- Lookups over the whole catalogue --------------------------------------

export function getDownloadBrands(): DownloadBrand[] {
  return DOWNLOAD_BRANDS;
}

export function getDownloadBrand(slug: string): DownloadBrand | undefined {
  return findBrand(DOWNLOAD_BRANDS, slug);
}

export function getDownloadProduct(
  brandSlug: string,
  productSlug: string
): DownloadProduct | undefined {
  return findProduct(DOWNLOAD_BRANDS, brandSlug, productSlug);
}

export interface FoundDocument {
  brand: DownloadBrand;
  product: DownloadProduct;
  doc: DownloadDocument;
}

/** Resolve a document from ids only — the key primitive the proxy relies on so
 *  no caller-supplied URL is ever fetched. */
export function findDocument(
  brandSlug: string,
  productSlug: string,
  docId: string
): FoundDocument | undefined {
  const brand = getDownloadBrand(brandSlug);
  const product = brand?.products.find((p) => p.slug === productSlug);
  const doc = product?.documents.find((d) => d.id === docId);
  if (!brand || !product || !doc) return undefined;
  return { brand, product, doc };
}

// ---- Counts over the whole catalogue ---------------------------------------

export function countAllDocuments(): number {
  return DOWNLOAD_BRANDS.reduce((n, b) => n + countBrandDocuments(b), 0);
}

// ---- Official-domain allowlist (proxy hardening) --------------------------

/** Every official domain a brand publishes files on (primary + alternates). */
export function brandDomains(brand: DownloadBrand): string[] {
  return [brand.officialDomain, ...(brand.altDomains ?? [])]
    .filter((d): d is string => Boolean(d))
    .map((d) => d.toLowerCase());
}

/** Every domain any brand's documents are allowed to live on. */
export const OFFICIAL_DOMAINS: readonly string[] = Array.from(
  new Set(DOWNLOAD_BRANDS.flatMap((b) => brandDomains(b)))
);

/**
 * True only for an https URL whose host is `officialDomain` (or a subdomain of
 * it). Used by the download proxy for the initial URL and for every redirect hop.
 */
export function isAllowedOfficialUrl(rawUrl: string, officialDomain: string): boolean {
  let u: URL;
  try {
    u = new URL(rawUrl);
  } catch {
    return false;
  }
  if (u.protocol !== "https:") return false;
  const host = u.hostname.toLowerCase();
  const dom = officialDomain.toLowerCase();
  return host === dom || host.endsWith(`.${dom}`);
}

/** True if the https URL is on any of the brand's official domains. */
export function isUrlOnBrandDomains(rawUrl: string, brand: DownloadBrand): boolean {
  return brandDomains(brand).some((dom) => isAllowedOfficialUrl(rawUrl, dom));
}

// ---- Search index over the whole catalogue ---------------------------------

/** Flatten every document in the catalogue into a searchable row. */
export function buildSearchIndex(): DownloadSearchRow[] {
  return buildSearchIndexFor(DOWNLOAD_BRANDS);
}
