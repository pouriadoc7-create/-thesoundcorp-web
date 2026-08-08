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
import { Link } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { SITE_NAME, SITE_URL } from "@/lib/constants/site";
import { BRAND_LOGOS } from "@/lib/data/brand-logos";
import { BRANDS, getAllBrandSlugs, getBrandBySlug } from "@/lib/data/brands";
import { getProductsByBrand } from "@/lib/data/products";
import { buildPageMetadata } from "@/lib/utils/metadata";
import { countBrandDocuments, getDownloadBrand } from "@/lib/utils/downloads";

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
  const brandLogo = BRAND_LOGOS[brand.slug];
  const downloadBrand = getDownloadBrand(brand.slug);
  const downloadDocs = downloadBrand ? countBrandDocuments(downloadBrand) : 0;

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

        {/* Masthead — the brand logo on architectural darkness. This stage is the
            structural home for future brand imagery: swap the gradient for an
            <Image fill className="object-cover" /> of the marque's flagship and
            the framing already holds. */}
        <div className="relative mt-8 overflow-hidden rounded-2xl border border-white/[0.08]">
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-[radial-gradient(120%_140%_at_50%_0%,rgba(212,175,55,0.07),transparent_55%)]"
          />
          <div className="holo-edge relative flex min-h-[220px] items-center justify-center px-6 py-14 sm:min-h-[280px]">
            {brandLogo ? (
              <BrandLogo
                name={brand.name}
                logoUrl={brandLogo}
                priority
                className="h-16 w-64 sm:h-20 sm:w-80"
                imgClassName="opacity-95"
              />
            ) : (
              <span className="text-holo display-2 font-medium">{brand.name}</span>
            )}
          </div>
        </div>

        <div className="mt-10 max-w-3xl">
          <h1 className="text-holo display-2 font-medium">{brand.name}</h1>
          <p className="mt-5 max-w-2xl text-[14px] font-light leading-7 text-gray-300 xl:text-base">
            {t("intro", { brand: brand.name, count: BRANDS.length, siteName: SITE_NAME })}
          </p>

          {/* Real-data facts — gives each brand page substance beyond the shared
              intro line (counts differ per brand; zeros are hidden). */}
          <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-3 border-y border-white/[0.08] py-5 text-[12px] uppercase tracking-[0.15em]">
            <span className="font-medium tracking-[0.16em] text-[color:var(--color-gold-soft)]/85">
              {t("distributorFact")}
            </span>
            {products.length > 0 ? (
              <span className="border-white/[0.1] text-zinc-400 ltr:border-l ltr:pl-8 rtl:border-r rtl:pr-8">
                {t("productCount", { count: products.length })}
              </span>
            ) : null}
            {downloadDocs > 0 ? (
              <span className="border-white/[0.1] text-zinc-400 ltr:border-l ltr:pl-8 rtl:border-r rtl:pr-8">
                {t("officialDocuments", { count: downloadDocs })}
              </span>
            ) : null}
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
            <WhatsAppInquiry
              message={t("whatsappText", { brand: brand.name })}
              label={t("inquire", { brand: brand.name })}
            />
            {downloadBrand ? (
              <Link
                href={{ pathname: "/downloads", query: { brand: brand.slug } }}
                className="btn-lux btn-lux--ghost inline-flex items-center justify-center gap-2 rounded-full border border-white/20 px-6 py-3.5 font-medium text-white transition-colors hover:border-[color:var(--color-gold)]/70 hover:text-[color:var(--color-gold-soft)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-gold)]/60 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
              >
                <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 3v12m0 0 4-4m-4 4-4-4" />
                  <path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2" />
                </svg>
                {t("officialDocuments", { count: downloadDocs })}
              </Link>
            ) : null}
          </div>
        </div>

        {/* Featured products (real catalogue data, cross-linked to product pages) */}
        <div className="mt-16">
          <h2 className="text-[16px] font-medium xl:text-xl">{t("featured")}</h2>
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
            <p className="mt-4 max-w-2xl text-[13.5px] leading-7 text-gray-500 xl:text-base">
              {t("noProducts", { brand: brand.name })}
            </p>
          )}
        </div>

        {/* Brand story — clearly marked as forthcoming rather than invented. */}
        <div className="mt-16 max-w-2xl border-t border-white/[0.08] pt-8">
          <h2 className="text-[16px] font-medium xl:text-xl">{t("storyTitle")}</h2>
          <p className="mt-4 text-[13.5px] leading-7 text-gray-500 xl:text-base">{t("storyComingSoon", { brand: brand.name })}</p>
        </div>
      </Container>
    </Section>
  );
}
