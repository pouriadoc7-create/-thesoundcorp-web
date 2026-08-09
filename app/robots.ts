import type { MetadataRoute } from "next";

import { SITE_URL } from "@/lib/constants/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // The download streaming proxy and the contact endpoint are behaviour,
      // not content — there is nothing to index under /api, and keeping the
      // proxy out of the crawl budget avoids bots hammering upstream files.
      disallow: "/api/",
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
