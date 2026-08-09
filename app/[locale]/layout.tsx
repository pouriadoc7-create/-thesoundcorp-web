import type { Metadata, Viewport } from "next";
import { Vazirmatn } from "next/font/google";
import { hasLocale } from "next-intl";
import { NextIntlClientProvider } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { preload } from "react-dom";

import "../globals.css";

import { BackToTop } from "@/components/features/BackToTop";
import { CommandPalette } from "@/components/features/CommandPalette";
import { ScrollProgress } from "@/components/features/ScrollProgress";
import { FloatingWhatsApp } from "@/components/layout/FloatingWhatsApp";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { JsonLd } from "@/components/seo/JsonLd";
import { routing, getLocaleDirection, type AppLocale } from "@/i18n/routing";
import { DEFAULT_METADATA } from "@/lib/constants/seo";
import { CONTACT, SITE_NAME, SITE_URL } from "@/lib/constants/site";
import { buildLanguageAlternates } from "@/lib/utils/alternates";

// Only one family is applied per request (by locale — see bodyFontClassName).
// Satoshi (Indian Type Foundry, via Fontshare — a refined variable grotesk,
// 300–900, Swiss-editorial / B&O character) is the Latin/en display+body face;
// it's self-hosted in globals.css (app-origin, no CDN) so its <link rel=preload>
// can be emitted per-locale below. Vazirmatn (Persian/fa) stays on next/font.
// This split exists because next/font preloads a font on EVERY route its loader
// file wraps — in the shared [locale] layout that would preload the unused face
// on the other locale, so it can't target only the active one.
const vazirmatn = Vazirmatn({
  variable: "--font-vazirmatn",
  subsets: ["arabic", "latin"],
  preload: false,
});

interface LocaleLayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

// viewportFit: "cover" is required for env(safe-area-inset-*) to resolve to
// anything other than 0 — without it the layout viewport doesn't extend
// under the iPhone notch/home-indicator area in the first place.
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#000000",
};

export async function generateMetadata({ params }: LocaleLayoutProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata.home" });

  return {
    ...DEFAULT_METADATA,
    title: {
      default: t("title"),
      template: `%s | ${SITE_NAME}`,
    },
    description: t("description"),
    alternates: {
      canonical: `${SITE_URL}/${locale}`,
      languages: buildLanguageAlternates(""),
    },
    openGraph: {
      type: "website",
      siteName: SITE_NAME,
      url: `${SITE_URL}/${locale}`,
      locale: locale === "fa" ? "fa_IR" : "en_US",
      alternateLocale: locale === "fa" ? "en_US" : "fa_IR",
      title: t("title"),
      description: t("description"),
      images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: SITE_NAME }],
    },
    twitter: {
      card: "summary_large_image",
      title: t("title"),
      description: t("description"),
      images: ["/og-image.jpg"],
    },
  };
}

export default async function LocaleLayout({ children, params }: LocaleLayoutProps) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);

  const direction = getLocaleDirection(locale);
  const isFa = (locale as AppLocale) === "fa";

  // Preload the ACTIVE Latin display face (Satoshi) for en — it's the hero's LCP
  // font. Emitted only for en, so fa never fetches an unused Latin face. Vazirmatn
  // (fa) stays on next/font. crossOrigin is required so the preload matches the
  // font's CORS fetch and the file isn't downloaded twice.
  if (!isFa) {
    preload("/fonts/Satoshi-Variable.woff2", { as: "font", type: "font/woff2", crossOrigin: "anonymous" });
  }

  // --font-sans-latin is now defined globally in globals.css (Satoshi self-hosted),
  // so en needs no per-request font variable; fa still gets Vazirmatn's.
  const fontVariables = isFa ? vazirmatn.variable : "";
  const bodyFontClassName = isFa ? "font-[family-name:var(--font-vazirmatn)]" : "font-sans";

  // Real company data only — no invented prices, ratings, hours or claims.
  // E.164 phone for schema (the display string keeps its spaces for humans).
  const phoneE164 = CONTACT.phone.href.replace("tel:", "");
  const ORG_ID = `${SITE_URL}/#organization`;

  // Typed as both Organization and LocalBusiness so it earns the Organization
  // knowledge panel AND local/store treatment for the physical Tehran showroom.
  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": ["Organization", "LocalBusiness"],
    "@id": ORG_ID,
    name: SITE_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}/logo.png`,
    image: `${SITE_URL}/og-image.jpg`,
    description:
      "Official importer and distributor of premium Hi-Fi / Hi-End audio brands in Iran.",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Manzariyeh",
      addressLocality: "Tehran",
      addressRegion: "Tehran",
      addressCountry: "IR",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 35.7895928,
      longitude: 51.4572719,
    },
    hasMap: CONTACT.map.href,
    telephone: phoneE164,
    priceRange: "$$$$",
    areaServed: { "@type": "Country", name: "Iran" },
    contactPoint: {
      "@type": "ContactPoint",
      telephone: phoneE164,
      contactType: "sales",
      email: CONTACT.email.display,
    },
    sameAs: [CONTACT.instagram.href, CONTACT.whatsapp.href],
  };

  const websiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    name: SITE_NAME,
    url: SITE_URL,
    inLanguage: locale === "fa" ? "fa-IR" : "en-US",
    publisher: { "@id": ORG_ID },
  };

  return (
    <html lang={locale} dir={direction} className={`${fontVariables} h-full antialiased`}>
      <body className={`flex min-h-full flex-col bg-black text-white ${bodyFontClassName}`}>
        {/* Ambient depth layer — soft drifting glows + faint noise behind all
            content (decorative; purely CSS, GPU-only, reduced-motion aware). */}
        <div className="ambient-bg" aria-hidden="true">
          <div className="noise" />
        </div>
        <NextIntlClientProvider>
          <ScrollProgress />
          <SkipLink />
          <JsonLd data={organizationJsonLd} />
          <JsonLd data={websiteJsonLd} />
          <Header />
          <main id="main-content" className="flex-1">
            {children}
          </main>
          <Footer />
          <FloatingWhatsApp />
          <BackToTop />
          <CommandPalette />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}

async function SkipLink() {
  const t = await getTranslations("header");
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:fixed focus:start-4 focus:top-4 focus:z-[100] focus:rounded-md focus:bg-white focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-black"
    >
      {t("skipToContent")}
    </a>
  );
}
