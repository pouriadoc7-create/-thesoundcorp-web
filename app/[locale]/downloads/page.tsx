import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { DownloadsExplorer } from "@/components/downloads/DownloadsExplorer";
import { Reveal } from "@/components/motion/Reveal";
import { JsonLd } from "@/components/seo/JsonLd";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { SITE_NAME, SITE_URL } from "@/lib/constants/site";
import { buildPageMetadata } from "@/lib/utils/metadata";
import { countAllDocuments, getDownloadBrands } from "@/lib/utils/downloads";

interface DownloadsPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: DownloadsPageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata.downloads" });

  return buildPageMetadata({
    locale,
    path: "/downloads",
    title: t("title"),
    description: t("description", { siteName: SITE_NAME }),
  });
}

export default async function DownloadsPage({ params }: DownloadsPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("downloads");
  const tCommon = await getTranslations("common");
  const tNav = await getTranslations("nav");

  const brands = getDownloadBrands();
  const brandCount = brands.length;
  const productCount = brands.reduce((n, b) => n + b.products.length, 0);
  const documentCount = countAllDocuments();

  const collectionJsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: t("title"),
    description: t("description", { siteName: SITE_NAME }),
    url: `${SITE_URL}/${locale}/downloads`,
    inLanguage: locale,
    isPartOf: { "@type": "WebSite", name: SITE_NAME, url: SITE_URL },
    about: { "@type": "Thing", name: "Official product documentation" },
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: tCommon("home"), item: `${SITE_URL}/${locale}` },
      {
        "@type": "ListItem",
        position: 2,
        name: tNav("downloads"),
        item: `${SITE_URL}/${locale}/downloads`,
      },
    ],
  };

  return (
    <Section className="relative">
      <JsonLd data={collectionJsonLd} />
      <JsonLd data={breadcrumbJsonLd} />
      <Container>
        <div className="mx-auto max-w-3xl text-center">
          <SectionHeader
            eyebrow={t("eyebrow")}
            title={t("title")}
            description={t("description", { siteName: SITE_NAME })}
          />

          <Reveal delayMs={220} className="mt-8 flex justify-center">
            <span aria-hidden="true" className="hr-premium w-20" />
          </Reveal>

          <Reveal
            as="p"
            delayMs={280}
            className="mt-5 text-[11px] uppercase tracking-[0.2em] text-zinc-500"
          >
            {t("brandCount", { count: brandCount })}
            <span aria-hidden="true" className="mx-2 text-zinc-700">
              ·
            </span>
            {t("productCount", { count: productCount })}
            <span aria-hidden="true" className="mx-2 text-zinc-700">
              ·
            </span>
            {t("documentCount", { count: documentCount })}
          </Reveal>
        </div>

        <div className="mt-14 sm:mt-16">
          {/* Pass the catalogue as a prop so it serializes into the RSC payload
              instead of being bundled into the client component's JS. */}
          <DownloadsExplorer brands={brands} />
        </div>
      </Container>
    </Section>
  );
}
