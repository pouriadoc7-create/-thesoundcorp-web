import { getTranslations } from "next-intl/server";

import { BrandLogoTile } from "@/components/brands/BrandLogoTile";
import { Reveal } from "@/components/motion/Reveal";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Link } from "@/i18n/navigation";
import { BRANDS } from "@/lib/data/brands";

export async function BrandsGrid() {
  const t = await getTranslations("brandsGrid");

  return (
    <Section className="relative">
      {/* Hairline separator instead of a hard background change — no tonal seam,
          and the page's ambient glow reads straight through. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 mx-auto h-px max-w-7xl bg-gradient-to-r from-transparent via-white/10 to-transparent"
      />
      <Container>
        <div className="mb-12 flex flex-col items-center text-center sm:mb-16">
          <Reveal as="p" className="eyebrow">
            {t("eyebrow")}
          </Reveal>
          <Reveal as="h2" delayMs={80} className="mt-4 text-holo text-balance display-2 font-medium">
            {t("heading")}
          </Reveal>
          <Reveal as="p" delayMs={140} className="mt-3 text-[13px] tracking-wide text-muted">
            {t("count", { count: BRANDS.length })}
          </Reveal>
        </div>

        {/* Centered wrap (not a fixed grid) so an incomplete final row sits
            centred rather than leaving a lone logo dangling on the start edge. */}
        <div className="flex flex-wrap justify-center gap-4 sm:gap-5">
          {BRANDS.map((brand, i) => (
            <Reveal key={brand.slug} delayMs={(i % 5) * 55} className="w-[45%] sm:w-[30%] md:w-[22%] lg:w-[17.4%]">
              <BrandLogoTile brand={brand} />
            </Reveal>
          ))}
        </div>

        <Reveal delayMs={120} className="mt-12 flex justify-center">
          <Link
            href="/brands"
            className="group inline-flex items-center gap-2 rounded-md text-[12.5px] font-medium uppercase tracking-[0.14em] text-zinc-400 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
          >
            {t("viewAll")}
            <svg
              className="h-4 w-4 transition-transform duration-300 ease-[var(--ease-premium)] group-hover:translate-x-1 rtl:-scale-x-100"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.75}
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </Link>
        </Reveal>
      </Container>
    </Section>
  );
}
