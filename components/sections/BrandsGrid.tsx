import { getTranslations } from "next-intl/server";

import { Reveal } from "@/components/motion/Reveal";
import { BrandLogo } from "@/components/ui/BrandLogo";
import { Link } from "@/i18n/navigation";
import { BRANDS } from "@/lib/data/brands";
import { BRAND_LOGOS, LOGO_SCALE } from "@/lib/data/brand-logos";

export async function BrandsGrid() {
  const t = await getTranslations("brandsGrid");

  return (
    <section className="bg-zinc-950 py-16 text-white lg:py-24">
      <div className="mx-auto max-w-7xl px-8">
        <Reveal as="h2" className="mb-8 text-center text-holo text-[22px] font-medium sm:text-[26px] lg:text-[30px] xl:text-4xl">
          {t("heading")}
        </Reveal>

        <div className="grid grid-cols-2 gap-6 md:grid-cols-4 lg:grid-cols-5">
          {BRANDS.map((brand, i) => (
            // Stagger left-to-right within each 5-column row for a soft cascade.
            <Reveal key={brand.slug} delayMs={(i % 5) * 60} className="h-full">
              <Link
                href={`/brands/${brand.slug}`}
                className="card-lux flex h-full items-center justify-center rounded-xl border border-zinc-700 p-6 text-center transition-colors hover:border-white hover:bg-white/[0.03] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
              >
                <div
                  className="flex w-full items-center justify-center"
                  style={
                    LOGO_SCALE[brand.slug]
                      ? { transform: `scale(${LOGO_SCALE[brand.slug]})` }
                      : undefined
                  }
                >
                  <BrandLogo
                    name={brand.name}
                    logoUrl={BRAND_LOGOS[brand.slug]}
                    sizes="(max-width: 768px) 40vw, (max-width: 1024px) 22vw, 180px"
                    className="h-11 w-full"
                    imgClassName="opacity-90 transition-opacity duration-300"
                    wordmarkClassName="text-[15px] font-medium text-white xl:text-lg"
                  />
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
