import { getTranslations } from "next-intl/server";

import { Parallax } from "@/components/motion/Parallax";
import { Reveal } from "@/components/motion/Reveal";
import { Button } from "@/components/ui/Button";
import { SITE_NAME } from "@/lib/constants/site";

export async function Hero() {
  const t = await getTranslations("hero");

  return (
    <section className="relative flex min-h-dvh flex-col items-center justify-center overflow-hidden px-6 text-center">
      {/*
        Hero media stage. Architectural darkness now — a soft champagne glow that
        drifts gently on scroll, seated by a vignette. This layer is the future
        home of a real hero photograph: drop a <Image fill className="object-cover"
        /> in here and the vignette + gradient already frame it, no layout change.
      */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <Parallax speed={0.14} className="absolute inset-0">
          <div className="absolute left-1/2 top-[42%] h-[78vmin] w-[78vmin] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(212,175,55,0.07),rgba(255,255,255,0.04)_38%,transparent_70%)] blur-[60px]" />
        </Parallax>
        <div className="absolute inset-0 bg-[radial-gradient(120%_120%_at_50%_28%,transparent_42%,rgba(0,0,0,0.6))]" />
      </div>

      {/* Brand kicker (the wordmark lives in the header; here it grounds the hero). */}
      <Reveal as="p" className="eyebrow">
        {SITE_NAME}
      </Reveal>

      <Reveal
        as="h1"
        blur
        delayMs={90}
        className="mt-6 max-w-[17ch] text-balance text-holo display-1 font-light"
      >
        {t("headline")}
      </Reveal>

      <Reveal
        as="p"
        delayMs={190}
        className="mt-6 max-w-xl text-balance text-[14px] font-light leading-relaxed text-gray-400 sm:text-[15px] xl:text-lg"
      >
        {t("description")}
      </Reveal>

      <Reveal
        delayMs={280}
        className="mt-9 flex flex-wrap items-center justify-center gap-4 sm:mt-11 sm:gap-5"
      >
        <Button href="/brands" variant="primary" size="lg">
          {t("exploreBrands")}
        </Button>
        <Button href="/about" variant="ghost" size="lg">
          {t("aboutUs")}
        </Button>
      </Reveal>

      {/* Quiet scroll cue — a hairline that fades downward. */}
      <div aria-hidden="true" className="pointer-events-none absolute bottom-8 left-1/2 -translate-x-1/2">
        <span className="flex flex-col items-center gap-2.5 text-[9.5px] uppercase tracking-[0.32em] text-white/35">
          {t("scroll")}
          <span className="h-9 w-px bg-gradient-to-b from-white/45 to-transparent" />
        </span>
      </div>
    </section>
  );
}
