import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { JsonLd } from "@/components/seo/JsonLd";
import { Button } from "@/components/ui/Button";
import { PlaceholderSection } from "@/components/ui/PlaceholderSection";
import { SITE_NAME, SITE_URL } from "@/lib/constants/site";
import { buildPageMetadata } from "@/lib/utils/metadata";

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
      <PlaceholderSection
        eyebrow={t("eyebrow")}
        title={t("title", { siteName: SITE_NAME })}
        description={t("description")}
      >
        <Button href="/brands" size="lg">
          {t("cta")}
        </Button>
      </PlaceholderSection>
    </>
  );
}
