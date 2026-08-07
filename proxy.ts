import type { NextRequest } from "next/server";
import createMiddleware from "next-intl/middleware";

import { routing } from "@/i18n/routing";

const intlMiddleware = createMiddleware(routing);

/** Countries that should default to a non-English locale on first visit. */
const COUNTRY_TO_LOCALE: Record<string, (typeof routing.locales)[number]> = {
  IR: "fa",
};

export default function proxy(request: NextRequest) {
  const hasStoredPreference = request.cookies.has("NEXT_LOCALE");

  // Manual selection (or any prior visit) always wins — only apply
  // geo-based detection on a genuinely first visit.
  if (!hasStoredPreference) {
    // Populated automatically by Vercel's edge network in production;
    // absent in local dev and on non-Vercel hosts, where next-intl's
    // Accept-Language-based negotiation below is used as-is.
    const country = request.headers.get("x-vercel-ip-country");
    const geoLocale = country ? COUNTRY_TO_LOCALE[country] : undefined;

    if (geoLocale) {
      request.headers.set("accept-language", geoLocale);
    }
  }

  return intlMiddleware(request);
}

export const config = {
  // Run on every path except Next.js internals and files with an extension
  // (static assets). This still covers /robots.txt, /sitemap.xml, etc. via
  // the routes themselves living outside the locale prefix.
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
