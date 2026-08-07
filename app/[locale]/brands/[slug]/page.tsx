import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";

import { ProductCard } from "@/components/products/ProductCard";
import { WhatsAppInquiry } from "@/components/products/WhatsAppInquiry";
import { JsonLd } from "@/components/seo/JsonLd";
import { BrandLogo } from "@/components/ui/BrandLogo";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { routing } from "@/i18n/routing";
import { SITE_NAME, SITE_URL } from "@/lib/constants/site";
import { BRANDS, getAllBrandSlugs, getBrandBySlug } from "@/lib/data/brands";
import { getProductsByBrand } from "@/lib/data/products";
import { buildPageMetadata } from "@/lib/utils/metadata";

const SAMPLE_CATALOGUE = "/downloads/sample-brochure.pdf";

interface BrandPageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    getAllBrandSlugs().map((slug) => ({ locale, slug }))
  );
}

export async function generateMetadata({ params }: BrandPageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  const brand = getBrandBySlug(slug);

  if (!brand) {
    return { title: "Brand Not Found" };
  }

  const t = await getTranslations({ locale, namespace: "metadata.brandDetail" });

  return buildPageMetadata({
    locale,
    path: `/brands/${brand.slug}`,
    title: brand.name,
    description: t("description", { brand: brand.name, siteName: SITE_NAME }),
  });
}

export default async function BrandPage({ params }: BrandPageProps) {
  const { locale, slug } = await params;
  const brand = getBrandBySlug(slug);

  if (!brand) {
    notFound();
  }

  setRequestLocale(locale);
  const t = await getTranslations("brandDetail");
  const tCommon = await getTranslations("common");
  const tNav = await getTranslations("nav");
  const tProducts = await getTranslations("products");

  const products = getProductsByBrand(brand.slug);

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: tNav("brands"), item: `${SITE_URL}/${locale}/brands` },
      {
        "@type": "ListItem",
        position: 2,
        name: brand.name,
        item: `${SITE_URL}/${locale}/brands/${brand.slug}`,
      },
    ],
  };

  const brandJsonLd = {
    "@context": "https://schema.org",
    "@type": "Brand",
    name: brand.name,
    url: `${SITE_URL}/${locale}/brands/${brand.slug}`,
  };

  return (
    <Section>
      <Container>
        <JsonLd data={breadcrumbJsonLd} />
        <JsonLd data={brandJsonLd} />

        <Breadcrumbs
          label={tCommon("breadcrumb")}
          items={[
            { label: tCommon("home"), href: "/" },
            { label: tNav("brands"), href: "/brands" },
            { label: brand.name },
          ]}
        />

        <div className="mt-8 max-w-3xl">
          {brand.logoUrl ? (
            <BrandLogo
              name={brand.name}
              logoUrl={brand.logoUrl}
              priority
              className="mb-6 h-16 w-52 ltr:justify-start rtl:justify-end"
              imgClassName="ltr:object-left rtl:object-right"
            />
          ) : null}
          <p className="text-xs font-medium uppercase tracking-[0.24em] text-[color:var(--color-gold-soft)]/85">
            {tNav("brands")}
          </p>
          <h1 className="mt-3 text-4xl font-bold sm:text-5xl">{brand.name}</h1>
          <p className="mt-6 max-w-2xl leading-8 text-gray-300">
            {t("intro", { brand: brand.name, count: BRANDS.length, siteName: SITE_NAME })}
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
            <WhatsAppInquiry
              message={t("whatsappText", { brand: brand.name })}
              label={t("inquire", { brand: brand.name })}
            />
            <a
              href={SAMPLE_CATALOGUE}
              download={`${brand.slug}-catalogue.pdf`}
              className="btn-lux btn-lux--ghost inline-flex items-center justify-center gap-2 rounded-full border border-white/20 px-6 py-3.5 font-medium text-white transition-colors hover:border-[color:var(--color-gold)]/70 hover:text-[color:var(--color-gold-soft)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-gold)]/60 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
            >
              <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 3v12m0 0 4-4m-4 4-4-4" />
                <path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2" />
              </svg>
              {t("catalogue")}
            </a>
          </div>
        </div>

        {/* Featured products (real catalogue data, cross-linked to product pages) */}
        <div className="mt-16">
          <h2 className="text-xl font-semibold">{t("featured")}</h2>
          {products.length > 0 ? (
            <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {products.map((product) => (
                <ProductCard
                  key={product.slug}
                  product={product}
                  categoryLabel={tProducts(`categories.${product.category}`)}
                />
              ))}
            </div>
          ) : (
            <p className="mt-4 max-w-2xl leading-8 text-gray-500">
              {t("noProducts", { brand: brand.name })}
            </p>
          )}
        </div>

        {/* Brand story — clearly marked as forthcoming rather than invented. */}
        <div className="mt-16 max-w-2xl border-t border-white/[0.08] pt-8">
          <h2 className="text-xl font-semibold">{t("storyTitle")}</h2>
          <p className="mt-4 leading-8 text-gray-500">{t("storyComingSoon", { brand: brand.name })}</p>
        </div>
      </Container>
    </Section>
  );
}
