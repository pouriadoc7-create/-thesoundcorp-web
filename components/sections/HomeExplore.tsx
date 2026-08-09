import { getTranslations } from "next-intl/server";

import { Reveal } from "@/components/motion/Reveal";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Link } from "@/i18n/navigation";

/**
 * Onward journeys — closes the old two-section dead-end by surfacing the three
 * routes a visitor most wants next: Products, the Download Center, and a visit.
 */
export async function HomeExplore() {
  const t = await getTranslations("home.explore");

  const paths = [
    { href: "/products" as const, title: t("productsTitle"), text: t("productsText") },
    { href: "/downloads" as const, title: t("downloadsTitle"), text: t("downloadsText") },
    { href: "/contact" as const, title: t("contactTitle"), text: t("contactText") },
  ];

  return (
    <Section className="relative">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 mx-auto h-px max-w-7xl bg-gradient-to-r from-transparent via-white/10 to-transparent"
      />
      <Container>
        <Reveal as="p" className="eyebrow text-center">
          {t("eyebrow")}
        </Reveal>
        <div className="mt-12 grid gap-4 sm:mt-14 sm:grid-cols-3 sm:gap-5">
          {paths.map((path, i) => (
            <Reveal key={path.href} delayMs={i * 80} className="h-full">
              <Link
                href={path.href}
                className="card-lux group flex h-full flex-col justify-between gap-10 rounded-2xl border border-white/[0.08] p-8 transition-colors hover:border-white/25 hover:bg-white/[0.03] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
              >
                <div className="flex flex-col gap-3">
                  <h3 className="display-3 font-medium text-white">{path.title}</h3>
                  <p className="text-[13.5px] font-light leading-relaxed text-zinc-400">{path.text}</p>
                </div>
                <span className="inline-flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.18em] text-[color:var(--color-gold-soft)]/80">
                  {t("cta")}
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
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
      </Container>
    </Section>
  );
}
