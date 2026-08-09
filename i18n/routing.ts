import { defineRouting } from "next-intl/routing";

/**
 * Single source of truth for supported locales. Adding a language later is
 * a one-line change here (plus a messages/{locale}.json file) — no route
 * restructuring needed since every page already lives under [locale].
 */
export const routing = defineRouting({
  locales: ["en", "fa"],
  defaultLocale: "en",
  localePrefix: "always",
});

export type AppLocale = (typeof routing.locales)[number];

export const RTL_LOCALES: readonly AppLocale[] = ["fa"];

export function getLocaleDirection(locale: string): "rtl" | "ltr" {
  return (RTL_LOCALES as readonly string[]).includes(locale) ? "rtl" : "ltr";
}
