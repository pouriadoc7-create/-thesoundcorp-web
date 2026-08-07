import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Link } from "@/i18n/navigation";
import { SITE_NAME } from "@/lib/constants/site";
import { BRANDS } from "@/lib/data/brands";
import { buildPageMetadata } from "@/lib/utils/metadata";

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

      <Container className="mt-16">
        <div className="grid grid-cols-2 gap-6 md:grid-cols-4 lg:grid-cols-5">
          {BRANDS.map((brand) => (
            <Link
              key={brand.slug}
              href={`/brands/${brand.slug}`}
              className="rounded-xl border border-zinc-700 p-6 text-center transition hover:border-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
            >
              <h2 className="text-lg font-semibold">{brand.name}</h2>
            </Link>
          ))}
        </div>
      </Container>
    </Section>
  );
}
