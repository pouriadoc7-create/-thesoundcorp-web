import { getTranslations } from "next-intl/server";

import { CONTACT } from "@/lib/constants/site";

/**
 * Find Us — the approved "Concept B" gold-themed location section: a champagne-gold
 * eyebrow + gradient title + lounge note + gold "Open in Maps" pill on one side, and
 * a stylised dark map (faint streets, one gold avenue, a glowing gold pin with a slow
 * gold radar pulse) on the other. The map and the button both open the real Google
 * Maps location. Server-rendered and fully localised; RTL mirrors automatically.
 */

// Abstract street grid for the stylised map (decorative). One avenue is drawn in gold.
const STREETS: [number, number, number, number][] = [
  [0, 120, 600, 90],
  [0, 250, 600, 270],
  [0, 360, 600, 330],
  [150, 0, 120, 420],
  [330, 0, 360, 420],
  [480, 0, 450, 420],
  [0, 60, 600, 180],
  [60, 420, 340, 0],
];

function ArrowGlyph() {
  return (
    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 rtl:-scale-x-100" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

export async function ContactMap() {
  const t = await getTranslations("contact");

  return (
    <section
      aria-labelledby="contact-findus-heading"
      className="relative w-full border-t border-white/[0.06] bg-[#080a0d] px-6 py-20 sm:py-24 lg:px-10 lg:py-[100px]"
    >
      <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-10 md:grid-cols-[0.92fr_1.08fr] md:gap-16">
        {/* Left — gold copy */}
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.3em] text-[color:var(--color-gold-soft)]/90">
            {t("findus.eyebrow")}
          </p>
          <h2
            id="contact-findus-heading"
            className="mt-3 text-[30px] font-medium leading-[1.06] tracking-[-0.02em] text-[#f4f5f7] sm:text-4xl lg:text-[2.75rem]"
          >
            {t("findus.titleLine1")}
            <br />
            <span className="bg-[linear-gradient(96deg,#efdcac,var(--color-gold)_52%,var(--color-gold-deep))] bg-clip-text text-transparent">
              {t("findus.titleLine2")}
            </span>
          </h2>
          <p className="mt-5 max-w-md text-[14.5px] font-light leading-relaxed text-zinc-400">
            {t("findus.subtitle")}
          </p>
          <a
            href={CONTACT.map.href}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-7 inline-flex items-center gap-2 rounded-full border border-[color:var(--color-gold)]/40 px-6 py-3 text-[13.5px] font-medium tracking-[0.02em] text-[color:var(--color-gold-soft)] transition-all duration-300 ease-[var(--ease-premium)] hover:-translate-y-0.5 hover:border-[color:var(--color-gold)]/70 hover:bg-[color:var(--color-gold)]/[0.06] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-gold)]/50"
          >
            {t("findus.openMaps")}
            <ArrowGlyph />
          </a>
        </div>

        {/* Right — stylised gold map (whole surface opens the real location) */}
        <a
          href={CONTACT.map.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={t("findus.mapAriaLabel")}
          className="group relative block h-[300px] overflow-hidden rounded-[22px] border border-white/[0.08] bg-[radial-gradient(120%_120%_at_50%_40%,#0e1116,#080a0d)] shadow-[0_25px_70px_-25px_rgba(0,0,0,0.8)] transition-shadow duration-500 ease-[var(--ease-premium)] hover:shadow-[0_30px_80px_-25px_rgba(212,175,55,0.18)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-gold)]/50 sm:h-[360px] md:h-[400px]"
        >
          <svg
            className="absolute inset-0 h-full w-full"
            viewBox="0 0 600 420"
            preserveAspectRatio="xMidYMid slice"
            aria-hidden="true"
          >
            {STREETS.map(([x1, y1, x2, y2], i) => (
              <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#ffffff" strokeOpacity="0.05" strokeWidth="1" />
            ))}
            <line x1="0" y1="212" x2="600" y2="236" stroke="#d4af37" strokeOpacity="0.32" strokeWidth="2" />
          </svg>
          {/* Radial fade for depth. */}
          <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(60%_60%_at_50%_48%,transparent,rgba(8,10,13,0.55))]" />
          {/* Gold pin + slow gold radar pulse. */}
          <div className="absolute left-1/2 top-[47%] -translate-x-1/2 -translate-y-full">
            <svg viewBox="0 0 24 24" className="h-8 w-8 text-[color:var(--color-gold-soft)] [filter:drop-shadow(0_6px_14px_rgba(212,175,55,0.4))]" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            <span className="contact-ping absolute bottom-[-4px] left-1/2 h-2.5 w-2.5 -translate-x-1/2 rounded-full bg-[color:var(--color-gold)]/60" aria-hidden="true" />
          </div>
        </a>
      </div>
    </section>
  );
}
