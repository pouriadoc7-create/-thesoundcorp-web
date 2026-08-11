export type LabLocale = "en" | "fa";

export interface LabNavItem {
  key: string;
  href: string;
  /** Label per locale. */
  label: Record<LabLocale, string>;
}

export interface LabBrand {
  slug: string;
  name: string;
}

export interface LabCopy {
  search: Record<LabLocale, string>;
  language: Record<LabLocale, string>;
  brands: Record<LabLocale, string>;
  close: Record<LabLocale, string>;
  menu: Record<LabLocale, string>;
  back: Record<LabLocale, string>;
  noResults: Record<LabLocale, string>;
}

export interface LabData {
  nav: LabNavItem[];
  brands: LabBrand[];
  copy: LabCopy;
}

/**
 * The contract every concept implements. A concept owns its ENTIRE experience:
 * its own trigger, open/close choreography, item list, brands submenu, search
 * and locale control. It renders inside a fixed, full-viewport stage.
 */
export interface ConceptProps {
  data: LabData;
  locale: LabLocale;
  onLocaleChange: (locale: LabLocale) => void;
  /** Return to the lab index. */
  onExit: () => void;
  /** True when the user prefers reduced motion — resolve instantly, no motion. */
  reduced: boolean;
}
