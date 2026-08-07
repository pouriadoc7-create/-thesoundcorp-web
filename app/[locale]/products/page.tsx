import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { Reveal } from "@/components/motion/Reveal";
import { ProductCatalog } from "@/components/products/ProductCatalog";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { SITE_NAME } from "@/lib/constants/site";
import { buildPageMetadata } from "@/lib/utils/metadata";

interface ProductsPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: ProductsPageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata.products" });

  return buildPageMetadata({
    locale,
    path: "/products",
    title: t("title"),
    description: t("description", { siteName: SITE_NAME }),
  });
}

export default async function ProductsPage({ params }: ProductsPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("products");

  return (
    <Section>
      <Container>
        <SectionHeader eyebrow={t("eyebrow")} title={t("title")} description={t("description")} />

        <Reveal delayMs={240} className="mt-14">
          <ProductCatalog />
        </Reveal>

        <p className="mt-12 text-center text-xs text-zinc-600">{t("sampleNote")}</p>
      </Container>
    </Section>
  );
}
