import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";

import { ProductCard } from "@/components/products/ProductCard";
import { ProductGallery } from "@/components/products/ProductGallery";
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
import { getAllProductSlugs, getProductBySlug, getRelatedProducts } from "@/lib/data/products";
import { buildPageMetadata } from "@/lib/utils/metadata";
import { getDownloadBrand } from "@/lib/utils/downloads";

interface ProductPageProps {
  params: Promise<{ locale: string; slug: string }>;
}

// generateStaticParams enumerates every real product slug (× locale), so any
// slug NOT in that list is genuinely invalid. dynamicParams=false makes such
// slugs return a real HTTP 404 at the routing layer — before any shell streams —
// instead of on-demand-prerendering a soft 200. Without this, the streamed
// response commits a 200 before the component's notFound() runs, producing an
// unlimited soft-404 surface.
export const dynamicParams = false;

export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    getAllProductSlugs().map((slug) => ({ locale, slug }))
  );
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) {
    return { title: "Product Not Found" };
  }

  const t = await getTranslations({ locale, namespace: "metadata.productDetail" });

  return buildPageMetadata({
    locale,
    path: `/products/${product.slug}`,
    title: `${product.brand} ${product.name}`,
    description: t("description", {
      product: product.name,
      brand: product.brand,
      siteName: SITE_NAME,
    }),
    ogType: "article",
    images: product.imageUrl
      ? [{ url: product.imageUrl, alt: `${product.brand} ${product.name}` }]
      : undefined,
  });
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { locale, slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  setRequestLocale(locale);
  const t = await getTranslations("products");
  const tCommon = await getTranslations("common");
  const tNav = await getTranslations("nav");

  const related = getRelatedProducts(product);
  const brandLogo = BRAND_LOGOS[product.brandSlug];
  const downloadBrand = getDownloadBrand(product.brandSlug);
  const categoryLabel = t(`categories.${product.category}`);
  const inquiryMessage = t("detail.inquiryMessage", {
    brand: product.brand,
    product: product.name,
  });

  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: `${product.brand} ${product.name}`,
    brand: { "@type": "Brand", name: product.brand },
    category: categoryLabel,
    description: product.description,
    url: `${SITE_URL}/${locale}/products/${product.slug}`,
    // Absolute image when real photography exists (Google needs an absolute URL;
    // omitted rather than faked for products still awaiting photos).
    ...(product.imageUrl ? { image: `${SITE_URL}${product.imageUrl}` } : {}),
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: tNav("products"), item: `${SITE_URL}/${locale}/products` },
      {
        "@type": "ListItem",
        position: 2,
        name: `${product.brand} ${product.name}`,
        item: `${SITE_URL}/${locale}/products/${product.slug}`,
      },
    ],
  };

  return (
    <Section>
      <Container>
        <JsonLd data={productJsonLd} />
        <JsonLd data={breadcrumbJsonLd} />

        <Breadcrumbs
          label={tCommon("breadcrumb")}
          items={[
            { label: tCommon("home"), href: "/" },
            { label: tNav("products"), href: "/products" },
            { label: `${product.brand} ${product.name}` },
          ]}
        />

        {/* Gallery + primary info */}
        <div className="mt-8 grid grid-cols-1 gap-10 lg:grid-cols-2">
          <ProductGallery brand={product.brand} name={product.name} views={product.gallery} />

          <div className="flex flex-col">
            {brandLogo ? (
              <Link href={`/brands/${product.brandSlug}`} className="mb-4 w-fit">
                <BrandLogo
                  name={product.brand}
                  logoUrl={brandLogo}
                  className="h-10 w-40 ltr:justify-start rtl:justify-end"
                  imgClassName="ltr:object-left rtl:object-right"
                />
              </Link>
            ) : null}
            <Link
              href={`/brands/${product.brandSlug}`}
              className="w-fit text-xs font-medium uppercase tracking-[0.24em] text-muted transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
            >
              {product.brand} · {categoryLabel}
            </Link>
            <h1 className="mt-3 text-holo display-2 font-medium">{product.name}</h1>
            <p className="mt-3 text-[14px] font-light text-zinc-400 xl:text-lg">{product.tagline}</p>
            <p className="mt-4 text-[12px] uppercase tracking-wider text-muted">
              {product.priceNote}
            </p>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <WhatsAppInquiry message={inquiryMessage} label={t("detail.inquire")} />
              {downloadBrand ? (
                <Link
                  href={{ pathname: "/downloads", query: { brand: product.brandSlug } }}
                  className="btn-lux btn-lux--ghost inline-flex items-center justify-center gap-2 rounded-full border border-white/20 px-6 py-3.5 font-medium text-white hover:border-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
                >
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 24 24"
                    className="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.75"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M12 3v12m0 0 4-4m-4 4-4-4" />
                    <path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2" />
                  </svg>
                  {t("detail.officialDocuments")}
                </Link>
              ) : null}
            </div>

            <p className="mt-6 text-[13.5px] leading-7 text-zinc-300 xl:text-base">{product.description}</p>
          </div>
        </div>

        {/* Technical specifications */}
        <div className="mt-16">
          <h2 className="text-[16px] font-medium xl:text-xl">{t("detail.specifications")}</h2>
          <p className="mt-2 max-w-2xl text-[12px] leading-relaxed text-muted">{t("detail.specsNote")}</p>
          <dl className="mt-6 grid grid-cols-1 gap-x-12 sm:grid-cols-2">
            {product.specs.map((spec) => (
              <div
                key={spec.label}
                className="flex justify-between gap-6 border-b border-white/[0.08] py-3.5"
              >
                <dt className="text-sm text-muted">{spec.label}</dt>
                <dd className="text-sm font-medium text-zinc-200 ltr:text-right rtl:text-left">
                  {spec.value}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        {/* Related products */}
        {related.length > 0 ? (
          <div className="mt-20">
            <h2 className="text-[16px] font-medium xl:text-xl">{t("detail.related")}</h2>
            <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((rel) => (
                <ProductCard
                  key={rel.slug}
                  product={rel}
                  categoryLabel={t(`categories.${rel.category}`)}
                />
              ))}
            </div>
          </div>
        ) : null}
      </Container>
    </Section>
  );
}
