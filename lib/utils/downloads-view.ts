import type {
  DownloadBrand,
  DownloadDocType,
  DownloadDocument,
  DownloadProduct,
} from "@/lib/types/download";

/**
 * Pure, DATA-FREE Download Center helpers — this module never imports the heavy
 * DOWNLOAD_BRANDS dataset, so client components can use it without pulling the
 * whole ~157 KB catalogue into their JS bundle. Anything that operates on data
 * passed as an argument lives here; anything that reaches into DOWNLOAD_BRANDS
 * (lookups, counts-of-everything, the proxy allowlist) stays in ./downloads,
 * which re-exports these so existing server/test imports are unaffected.
 */

// ---- Document groups -------------------------------------------------------

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

// ---- Counts (operate on a passed brand) ------------------------------------

export function countBrandDocuments(brand: DownloadBrand): number {
  return brand.products.reduce((n, p) => n + p.documents.length, 0);
}

// ---- Lookups within a passed brand list ------------------------------------

export function findBrand(brands: DownloadBrand[], slug: string): DownloadBrand | undefined {
  return brands.find((b) => b.slug === slug);
}

export function findProduct(
  brands: DownloadBrand[],
  brandSlug: string,
  productSlug: string
): DownloadProduct | undefined {
  return findBrand(brands, brandSlug)?.products.find((p) => p.slug === productSlug);
}

// ---- Search index (built from a passed brand list) -------------------------

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
export function buildSearchIndexFor(brands: DownloadBrand[]): DownloadSearchRow[] {
  const rows: DownloadSearchRow[] = [];
  for (const brand of brands) {
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
