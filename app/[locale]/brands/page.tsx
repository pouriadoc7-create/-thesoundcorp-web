import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { BrandLogo } from "@/components/ui/BrandLogo";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Link } from "@/i18n/navigation";
import { SITE_NAME } from "@/lib/constants/site";
import { BRAND_LOGOS, LOGO_SCALE } from "@/lib/data/brand-logos";
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
        <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-4 lg:grid-cols-5">
          {BRANDS.map((brand) => {
            const downloadBrand = getDownloadBrand(brand.slug);
            const docs = downloadBrand ? countBrandDocuments(downloadBrand) : 0;
            const scale = LOGO_SCALE[brand.slug];

            return (
              <Link
                key={brand.slug}
                href={`/brands/${brand.slug}`}
                className="card-lux group relative flex min-h-[132px] flex-col items-center justify-center gap-3 rounded-xl border border-white/[0.08] bg-white/[0.02] p-5 text-center transition-colors hover:border-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 sm:p-6"
              >
                <div
                  className="flex flex-1 items-center justify-center"
                  style={scale ? { transform: `scale(${scale})` } : undefined}
                >
                  <BrandLogo
                    name={brand.name}
                    logoUrl={BRAND_LOGOS[brand.slug]}
                    sizes="(max-width: 768px) 40vw, (max-width: 1024px) 22vw, 180px"
                    className="h-10 w-full"
                    imgClassName="opacity-90 transition-opacity duration-300 group-hover:opacity-100"
                    wordmarkClassName="text-[15px] font-medium text-white"
                  />
                </div>

                {docs > 0 ? (
                  <span className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-[0.14em] text-zinc-500 transition-colors duration-300 group-hover:text-[color:var(--color-gold-soft)]/85">
                    <svg
                      viewBox="0 0 24 24"
                      className="h-3 w-3"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <path d="M12 3v11m0 0 4-4m-4 4-4-4" />
                      <path d="M5 19h14" />
                    </svg>
                    {t("documentsCount", { count: docs })}
                  </span>
                ) : null}
              </Link>
            );
          })}
        </div>
      </Container>
    </Section>
  );
}
