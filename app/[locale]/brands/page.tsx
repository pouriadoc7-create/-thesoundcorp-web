import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { BrandLogoTile } from "@/components/brands/BrandLogoTile";
import { Reveal } from "@/components/motion/Reveal";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { SITE_NAME } from "@/lib/constants/site";
import { BRANDS } from "@/lib/data/brands";
import { buildPageMetadata } from "@/lib/utils/metadata";
import { countBrandDocuments, getDownloadBrand } from "@/lib/utils/downloads";

interface BrandsPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: BrandsPageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata.brands" });

  return buildPageMetadata({
    locale,
    path: "/brands",
    title: t("title"),
    description: t("description", { siteName: SITE_NAME }),
  });
}

export default async function BrandsPage({ params }: BrandsPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("brandsPage");

  return (
    <Section>
      <Container>
        <SectionHeader
          eyebrow={t("eyebrow")}
          title={t("heading")}
          description={t("description", { siteName: SITE_NAME, count: BRANDS.length })}
        />
      </Container>

      <Container className="mt-14 sm:mt-16">
        {/* Centered wrap so the incomplete final row sits centred (26 brands
            never divide evenly into a fixed column count). */}
        <div className="flex flex-wrap justify-center gap-4 sm:gap-5">
          {BRANDS.map((brand, i) => {
            const downloadBrand = getDownloadBrand(brand.slug);
            const docs = downloadBrand ? countBrandDocuments(downloadBrand) : 0;

            return (
              <Reveal key={brand.slug} delayMs={(i % 5) * 55} className="w-[45%] sm:w-[30%] md:w-[22%] lg:w-[17.4%]">
                <BrandLogoTile
                  brand={brand}
                  docsLabel={docs > 0 ? t("documentsCount", { count: docs }) : undefined}
                />
              </Reveal>
            );
          })}
        </div>
      </Container>
    </Section>
  );
}
