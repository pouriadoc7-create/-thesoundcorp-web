import type { Metadata } from "next";

import { SITE_URL } from "@/lib/constants/site";

/**
 * Locale-independent metadata defaults, consumed by the root [locale] layout
 * and spread under the translated title/description/openGraph fields it builds
 * per-request. The branded 1200×630 social card lives at /public/og-image.jpg
 * and is wired in via buildPageMetadata / the layout's openGraph.
 */
export const DEFAULT_METADATA: Metadata = {
  metadataBase: new URL(SITE_URL),
  robots: {
    index: true,
    follow: true,
  },
};
