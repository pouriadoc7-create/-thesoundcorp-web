import type { Metadata } from "next";
import localFont from "next/font/local";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { AboutConcept } from "@/components/about/AboutConcept";
import { JsonLd } from "@/components/seo/JsonLd";
import { SITE_NAME, SITE_URL } from "@/lib/constants/site";
import { buildPageMetadata } from "@/lib/utils/metadata";

// Satoshi for the About statement — loaded here so the English editorial typography is
// authentic even in the Farsi locale (which otherwise ships Vazirmatn on the body). Same
// self-hosted file the layout uses; preload:false since it isn't above the fold on load.
const satoshi = localFont({
  src: "../../fonts/Satoshi-Variable.woff2",
  variable: "--font-satoshi",
  weight: "300 900", // Satoshi's real variable axis; sub-300 CSS weights clamp to 300
  display: "swap",
  preload: false,
});

interface AboutPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: AboutPageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata.about" });

  return buildPageMetadata({
    locale,
    path: "/about",
    title: t("title"),
    description: t("description", { siteName: SITE_NAME }),
  });
}

export default async function AboutPage({ params }: AboutPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("about");

  const aboutPageJsonLd = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    name: t("title", { siteName: SITE_NAME }),
    url: `${SITE_URL}/${locale}/about`,
    about: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
  };

  return (
    <>
      <JsonLd data={aboutPageJsonLd} />
      <div className={satoshi.variable}>
        <AboutConcept />
      </div>
    </>
  );
}
