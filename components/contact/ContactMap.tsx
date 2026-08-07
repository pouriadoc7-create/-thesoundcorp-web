import { getTranslations } from "next-intl/server";

import { LocationIcon } from "@/components/icons/ContactIcons";
import { CONTACT } from "@/lib/constants/site";

/**
 * Embedded Google Maps preview. The iframe is a keyless `output=embed` map
 * (no API key needed) and is made non-interactive (`pointer-events-none`) so
 * that a transparent full-cover anchor on top captures every click and opens
 * the exact provided Google Maps shortlink in a new tab — satisfying "clicking
 * the map or the button opens the location." A gradient placeholder sits behind
 * the iframe so the section still looks intentional if the embed can't load.
 */
export async function ContactMap() {
  const t = await getTranslations("contact");
  const openLabel = t("map.open");
  const mapAriaLabel = t("map.ariaLabel");

  return (
    <section aria-labelledby="contact-map-heading" className="mt-16 w-full">
      <h2
        id="contact-map-heading"
        className="text-center text-sm font-medium uppercase tracking-[0.2em] text-zinc-500"
      >
        {t("map.title")}
      </h2>

      <div className="group relative mt-6 overflow-hidden rounded-[var(--radius-panel)] border border-white/[0.08] shadow-[0_25px_70px_-15px_rgba(0,0,0,0.75)]">
        {/* Fallback shown behind the iframe if the embed fails to paint. */}
        <div
          aria-hidden="true"
          className="absolute inset-0 grid place-items-center bg-[radial-gradient(ellipse_at_center,#1b2436,#0a0d14)] text-zinc-600"
        >
          <LocationIcon className="h-10 w-10" />
        </div>

        <iframe
          src={CONTACT.map.embed}
          title={t("map.title")}
          loading="eager"
          referrerPolicy="no-referrer-when-downgrade"
          sandbox="allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox"
          className="pointer-events-none relative block h-[300px] w-full border-0 grayscale-[0.25] transition duration-500 ease-[var(--ease-premium)] group-hover:grayscale-0 sm:h-[380px] md:h-[440px]"
        />

        {/* Full-cover click target — the whole map opens Google Maps. */}
        <a
          href={CONTACT.map.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={mapAriaLabel}
          className="absolute inset-0 z-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-white/70"
        />

        {/* Visible affordance — a distinct, keyboard-reachable button. */}
        <a
          href={CONTACT.map.href}
          target="_blank"
          rel="noopener noreferrer"
          className="absolute bottom-4 end-4 z-20 inline-flex items-center gap-2 rounded-full border border-white/15 bg-black/70 px-4 py-2.5 text-sm font-medium text-white backdrop-blur-md transition-all duration-300 ease-[var(--ease-premium)] hover:-translate-y-0.5 hover:border-white/30 hover:bg-black/85 active:translate-y-0 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
        >
          <LocationIcon className="h-4 w-4" />
          {openLabel}
        </a>
      </div>
    </section>
  );
}
