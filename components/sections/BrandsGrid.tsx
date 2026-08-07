import { getTranslations } from "next-intl/server";

import { Reveal } from "@/components/motion/Reveal";
import { BrandLogo } from "@/components/ui/BrandLogo";
import { BRANDS } from "@/lib/data/brands";
import { BRAND_LOGOS } from "@/lib/data/brand-logos";

/** Per-logo visual size tuning for the Our Brands grid so every mark reads at a
 *  balanced visual weight. Pure `transform: scale` (aspect ratio preserved — no
 *  stretch/distort); the card size, grid and layout stay unchanged and it causes
 *  no layout shift. Slugs not listed render at their natural size (scale 1). */
const LOGO_SCALE: Record<string, number> = {
  // compact marks — enlarged
  aavik: 1.464,
  "acoustic-arts": 1.464,
  borresen: 1.464,
  marten: 1.464,
  audiovector: 1.2,
  davis: 1.2,
  graham: 1.22,
  primare: 1.22,
  soulnote: 1.22,
  jadis: 1.22,
  // wide wordmarks — reduced to balance their visual weight
  jorma: 0.68,
  teac: 0.68,
  roksan: 0.68,
  audes: 0.68,
};

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
