import { routing } from "@/i18n/routing";
import { SITE_URL } from "@/lib/constants/site";

/**
 * Builds hreflang alternates for a locale-agnostic pathname (e.g. "" for
 * home, "/about", `/brands/${slug}`). Paths are identical across locales
 * (only the /en or /fa prefix changes), so this is plain concatenation
 * rather than next-intl's pathname-translation machinery.
 */
export function buildLanguageAlternates(pathname: string): Record<string, string> {
  const languages: Record<string, string> = {};

  for (const locale of routing.locales) {
    languages[locale] = `${SITE_URL}/${locale}${pathname}`;
  }

  languages["x-default"] = `${SITE_URL}/${routing.defaultLocale}${pathname}`;

  return languages;
}
