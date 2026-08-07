import { getTranslations } from "next-intl/server";

import { MagneticButton } from "@/components/motion/MagneticButton";
import { Parallax } from "@/components/motion/Parallax";
import { Reveal } from "@/components/motion/Reveal";
import { Button } from "@/components/ui/Button";
import { SITE_NAME } from "@/lib/constants/site";

export async function Hero() {
  const t = await getTranslations("hero");

  return (
    <section className="relative flex min-h-dvh flex-col items-center justify-center overflow-hidden px-6 text-center">
      {/* Soft parallax glow — decorative, drifts gently on scroll. */}
      <Parallax speed={0.16} className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-1/2 h-[70vmin] w-[70vmin] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.07),transparent_68%)] blur-2xl" />
      </Parallax>

      <Reveal
        as="h1"
        blur
        className="text-balance text-4xl font-bold leading-[1.05] sm:text-5xl md:text-6xl lg:text-7xl"
      >
        {SITE_NAME}
      </Reveal>

      <Reveal as="p" delayMs={90} className="mt-6 text-balance text-xl leading-snug text-gray-400 sm:text-2xl">
        {t("tagline")}
      </Reveal>

      <Reveal as="p" delayMs={170} className="mt-5 max-w-2xl text-base leading-relaxed text-gray-500 sm:text-lg">
        {t("description")}
      </Reveal>

      <Reveal delayMs={260} className="mt-10 flex flex-wrap items-center justify-center gap-4 sm:mt-12 sm:gap-5">
        <MagneticButton>
          <Button href="/brands" variant="primary" size="lg">
            {t("exploreBrands")}
          </Button>
        </MagneticButton>
        <MagneticButton>
          <Button href="/about" variant="ghost" size="lg">
            {t("aboutUs")}
          </Button>
        </MagneticButton>
      </Reveal>
    </section>
  );
}
