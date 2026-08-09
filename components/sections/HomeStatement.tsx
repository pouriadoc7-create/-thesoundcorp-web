import { getTranslations } from "next-intl/server";

import { Reveal } from "@/components/motion/Reveal";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";

/**
 * The editorial heart of the homepage: a philosophy statement followed by three
 * quiet pillars (curation / official import / support). Typographic and
 * restrained — architectural darkness, expensive whitespace, no imagery needed.
 */
export async function HomeStatement() {
  const t = await getTranslations("home.statement");
  const p = await getTranslations("home.pillars");

  const pillars = [
    { n: "01", title: p("oneTitle"), text: p("oneText") },
    { n: "02", title: p("twoTitle"), text: p("twoText") },
    { n: "03", title: p("threeTitle"), text: p("threeText") },
  ];

  return (
    <Section>
      <Container className="max-w-5xl">
        <Reveal as="p" className="eyebrow">
          {t("eyebrow")}
        </Reveal>
        <Reveal
          as="p"
          delayMs={80}
          className="mt-6 max-w-4xl text-balance display-3 font-light leading-[1.45] text-zinc-100"
        >
          {t("lead")}
        </Reveal>
        <Reveal
          as="p"
          delayMs={150}
          className="mt-6 max-w-2xl text-[14px] font-light leading-relaxed text-zinc-400 xl:text-base"
        >
          {t("body")}
        </Reveal>

        {/* Hairline-divided pillar row (gap-px over a faint fill = crisp 1px rules). */}
        <div className="mt-16 grid gap-px overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.06] sm:mt-20 sm:grid-cols-3">
          {pillars.map((pillar, i) => (
            <Reveal key={pillar.n} delayMs={i * 80} className="bg-black">
              <div className="flex h-full flex-col gap-3 p-7 sm:p-8">
                <span className="text-[11px] font-medium tracking-[0.2em] text-[color:var(--color-gold-soft)]/70">
                  {pillar.n}
                </span>
                <h3 className="text-[17px] font-medium text-white xl:text-lg">{pillar.title}</h3>
                <p className="text-[13.5px] font-light leading-relaxed text-zinc-400">{pillar.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </Section>
  );
}
