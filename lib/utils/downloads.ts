import { DOWNLOAD_BRANDS } from "@/lib/data/downloads";
import type {
  DownloadBrand,
  DownloadDocType,
  DownloadDocument,
  DownloadProduct,
} from "@/lib/types/download";

/**
 * Ordered document groups shown in the UI. Each group collects one or more
 * `DownloadDocType`s; the label is localised in the components via
 * `downloads.groups.<key>`. Only non-empty groups are rendered.
 */
export interface DocGroupDef {
  key: string;
  types: DownloadDocType[];
}

export const DOC_GROUPS: DocGroupDef[] = [
  { key: "manuals", types: ["user-manual"] },
  { key: "quickStart", types: ["quick-start"] },
  { key: "datasheets", types: ["datasheet"] },
  { key: "technical", types: ["technical"] },
  { key: "brochures", types: ["brochure"] },
  { key: "firmware", types: ["firmware", "software"] },
  { key: "other", types: ["other"] },
];

const TYPE_TO_GROUP: Record<DownloadDocType, string> = DOC_GROUPS.reduce(
  (acc, g) => {
    for (const t of g.types) acc[t] = g.key;
    return acc;
  },
  {} as Record<DownloadDocType, string>
);

export function groupKeyForType(type: DownloadDocType): string {
  return TYPE_TO_GROUP[type] ?? "other";
}

// ---- Lookups ---------------------------------------------------------------

export function getDownloadBrands(): DownloadBrand[] {
  return DOWNLOAD_BRANDS;
}

export function getDownloadBrand(slug: string): DownloadBrand | undefined {
  return DOWNLOAD_BRANDS.find((b) => b.slug === slug);
}

export function getDownloadProduct(
  brandSlug: string,
  productSlug: string
): DownloadProduct | undefined {
  return getDownloadBrand(brandSlug)?.products.find((p) => p.slug === productSlug);
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

// ---- Counts & grouping -----------------------------------------------------

export function countBrandDocuments(brand: DownloadBrand): number {
  return brand.products.reduce((n, p) => n + p.documents.length, 0);
}

export function countAllDocuments(): number {
  return DOWNLOAD_BRANDS.reduce((n, b) => n + countBrandDocuments(b), 0);
}

export interface DocumentGroup {
  key: string;
  docs: DownloadDocument[];
}

/** Bucket a product's documents into the ordered, non-empty UI groups. */
export function groupDocuments(docs: DownloadDocument[]): DocumentGroup[] {
  return DOC_GROUPS.map((g) => ({
    key: g.key,
    docs: docs.filter((d) => g.types.includes(d.type)),
  })).filter((g) => g.docs.length > 0);
}

// ---- Official-domain allowlist (proxy hardening) --------------------------

/** Every official domain a brand publishes files on (primary + alternates). */
export function brandDomains(brand: DownloadBrand): string[] {
  return [brand.officialDomain, ...(brand.altDomains ?? [])].map((d) => d.toLowerCase());
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

// ---- Search index ----------------------------------------------------------

export interface DownloadSearchRow {
  brandSlug: string;
  brandName: string;
  productSlug: string;
  productName: string;
  modelCode?: string;
  category: string;
  doc: DownloadDocument;
  /** Precomputed lowercase haystack for cheap substring search. */
  haystack: string;
}

/** Flatten every document into a searchable row (brand · product · model · title · type). */
export function buildSearchIndex(): DownloadSearchRow[] {
  const rows: DownloadSearchRow[] = [];
  for (const brand of DOWNLOAD_BRANDS) {
    for (const product of brand.products) {
      for (const doc of product.documents) {
        const parts = [
          brand.name,
          product.name,
          product.modelCode ?? "",
          product.category,
          doc.title,
          doc.type,
        ];
        rows.push({
          brandSlug: brand.slug,
          brandName: brand.name,
          productSlug: product.slug,
          productName: product.name,
          modelCode: product.modelCode,
          category: product.category,
          doc,
          haystack: parts.join(" ").toLowerCase(),
        });
      }
    }
  }
  return rows;
}
