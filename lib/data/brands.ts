import type { Brand, BrandColumn } from "@/lib/types/brand";
import { slugify } from "@/lib/utils/slugify";

const BRAND_NAMES = [
  "SOULNOTE",
  "MARTEN",
  "AUDIOVECTOR",
  "ESOTERIC",
  "BORRESEN",
  "AAVIK",
  "AUDIOFLIGHT",
  "GRAHAM",
  "CHORD",
  "ROKSAN",
  "EAT",
  "TEAC",
  "MERASON",
  "PRIMARE",
  "QLN",
  "CAYIN",
  "VIENNA ACOUSTICS",
  "QUALITON",
  "AUDES",
  "JADIS",
  "AAI",
  "JORMA",
  "VAN DEN HUL",
  "ACOUSTIC ARTS",
  "MASTERSOUND",
  "DAVIS",
] as const;

/** Single source of truth for every brand TheSoundCorp distributes. */
export const BRANDS: Brand[] = BRAND_NAMES.map((name) => ({
  name,
  slug: slugify(name),
})).sort((a, b) => a.name.localeCompare(b.name));

export function getAllBrandSlugs(): string[] {
  return BRANDS.map((brand) => brand.slug);
}

export function getBrandBySlug(slug: string): Brand | undefined {
  return BRANDS.find((brand) => brand.slug === slug);
}

/**
 * Splits the alphabetically-sorted brand list into `columnCount` balanced
 * columns, labeling each with the first-letter range it spans (e.g. "A",
 * "B–E"). Used by the header mega menu; general enough for any future
 * brand-directory layout that needs a different column count.
 */
export function getBrandColumns(columnCount: number): BrandColumn[] {
  const total = BRANDS.length;
  const baseSize = Math.floor(total / columnCount);
  const remainder = total % columnCount;

  const columns: BrandColumn[] = [];
  let cursor = 0;

  for (let i = 0; i < columnCount; i++) {
    const size = baseSize + (i < remainder ? 1 : 0);
    const brands = BRANDS.slice(cursor, cursor + size);
    cursor += size;

    if (brands.length === 0) continue;

    const firstLetter = brands[0].name[0];
    const lastLetter = brands[brands.length - 1].name[0];
    const title = firstLetter === lastLetter ? firstLetter : `${firstLetter}–${lastLetter}`;

    columns.push({ title, brands });
  }

  return columns;
}
