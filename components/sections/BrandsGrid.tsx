import { getTranslations } from "next-intl/server";

import { Reveal } from "@/components/motion/Reveal";
import { BrandLogo } from "@/components/ui/BrandLogo";
import { BRANDS } from "@/lib/data/brands";

export async function BrandsGrid() {
  const t = await getTranslations("brandsGrid");

  return (
    <section className="bg-zinc-950 py-24 text-white">
      <div className="mx-auto max-w-7xl px-8">
        <Reveal as="h2" className="mb-12 text-center text-4xl font-semibold">
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
              <BrandLogo
                name={brand.name}
                logoUrl={brand.logoUrl}
                className="h-10 w-full"
                wordmarkClassName="text-lg font-semibold text-white"
              />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
