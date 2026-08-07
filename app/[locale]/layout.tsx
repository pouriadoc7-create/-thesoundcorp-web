import type { Metadata, Viewport } from "next";
import { Vazirmatn } from "next/font/google";
import localFont from "next/font/local";
import { hasLocale } from "next-intl";
import { NextIntlClientProvider } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";

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

// Only one of these two families is ever applied per request (based on
// locale — see bodyFontClassName below), but next/font's loader calls must
// stay at module scope. `preload: false` on both stops Next from emitting
// a <link rel="preload"> for the family that ends up unused, which browsers
// otherwise flag as "preloaded but not used within a few seconds."
// Satoshi (Indian Type Foundry, via Fontshare — free for commercial use),
// self-hosted through next/font/local so it ships from our own origin — no
// external CDN and no runtime font request. A refined contemporary grotesk
// with a full variable weight axis (300–900); its light/regular weights give
// navigation and display type a thin, compact, Swiss-editorial / Bang &
// Olufsen / Porsche Design character rather than a generic corporate sans.
// (PP Neue Montreal was requested first but is a commercial font with no
// licence present in this project, so it is deliberately NOT used — no fake
// substitution. Satoshi is the licensed self-hosted fallback.)
const satoshi = localFont({
  src: "../fonts/Satoshi-Variable.woff2",
  variable: "--font-sans-latin",
  weight: "300 900",
  display: "swap",
  preload: false,
});

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
  const fontVariables = (locale as AppLocale) === "fa" ? vazirmatn.variable : satoshi.variable;
  const bodyFontClassName =
    (locale as AppLocale) === "fa" ? "font-[family-name:var(--font-vazirmatn)]" : "font-sans";

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
