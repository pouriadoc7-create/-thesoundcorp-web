import { getTranslations } from "next-intl/server";

import { Reveal } from "@/components/motion/Reveal";
import { BrandLogo } from "@/components/ui/BrandLogo";
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
            <Reveal
              key={brand.slug}
              // Stagger left-to-right within each 5-column row for a soft cascade.
              delayMs={(i % 5) * 60}
              className="card-lux flex items-center justify-center rounded-xl border border-zinc-700 p-6 text-center hover:border-white hover:bg-white/[0.03]"
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
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
