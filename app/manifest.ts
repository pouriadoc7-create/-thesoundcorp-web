import type { MetadataRoute } from "next";
import { getTranslations } from "next-intl/server";

import { routing } from "@/i18n/routing";
import { SITE_NAME } from "@/lib/constants/site";

export default async function manifest(): Promise<MetadataRoute.Manifest> {
  const t = await getTranslations({
    locale: routing.defaultLocale,
    namespace: "metadata.home",
  });

  return {
    name: SITE_NAME,
    short_name: SITE_NAME,
    description: t("description"),
    start_url: `/${routing.defaultLocale}`,
    display: "standalone",
    background_color: "#000000",
    theme_color: "#000000",
    icons: [
      { src: "/favicon.ico", sizes: "any", type: "image/x-icon" },
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icons/icon-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
