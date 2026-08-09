import { hasLocale } from "next-intl";
import { getRequestConfig } from "next-intl/server";

import { routing } from "./routing";

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested) ? requested : routing.defaultLocale;

  return {
    locale,
    // Locale message catalog. Loaded per-request so adding a locale is just a
    // new messages/{locale}.json file — no wiring changes here.
    messages: (await import(`../messages/${locale}.json`)).default,
  };
});
