import { getTranslations } from "next-intl/server";
import type { ComponentType } from "react";

import {
  GmailBrandIcon,
  GoogleMapsBrandIcon,
  InstagramBrandIcon,
  WhatsAppBrandIcon,
  YouTubeBrandIcon,
} from "@/components/icons/BrandIcons";
import { PhoneIcon } from "@/components/icons/ContactIcons";
import { CONTACT_CHANNELS, type ContactIconKey } from "@/lib/data/contact-channels";
import { cn } from "@/lib/utils/cn";

/**
 * Official brand-coloured icon for each channel. Phone is deliberately left
 * NEUTRAL (currentColor line icon) per brand guidance; every other channel
 * wears its official colours (WhatsApp green, Instagram gradient, Gmail,
 * Google Maps pin, YouTube red). Register a new channel's icon here when you
 * append it to CONTACT_CHANNELS.
 */
const CONTACT_ICONS: Record<ContactIconKey, ComponentType<{ className?: string }>> = {
  phone: PhoneIcon,
  whatsapp: WhatsAppBrandIcon,
  instagram: InstagramBrandIcon,
  gmail: GmailBrandIcon,
  maps: GoogleMapsBrandIcon,
  youtube: YouTubeBrandIcon,
};

// Shared classes so the live <a> and the "Coming Soon" <div> are identical in
// spacing, typography and hover — the placeholder only drops the click/focus
// affordances it can't honour yet.
const CARD_BASE =
  "group flex h-full items-center gap-4 rounded-[var(--radius-panel)] border border-white/[0.08] bg-white/[0.02] p-5 text-start transition-all duration-300 ease-[var(--ease-premium)] hover:-translate-y-0.5 hover:border-white/20 hover:bg-white/[0.05]";
const CARD_INTERACTIVE =
  "active:translate-y-0 active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60";

/**
 * The clickable contact channels, rendered generically from CONTACT_CHANNELS so
 * new channels are a data-only change. Phone and email use tel:/mailto: and stay
 * in-app; WhatsApp, Instagram, YouTube and the address open in a new, safely-
 * rel'd tab. A channel with no URL yet (href === null) renders as a polished,
 * non-clickable "Coming Soon" card that becomes a live link the instant a URL
 * is added — no markup change.
 */
export async function ContactChannels() {
  const t = await getTranslations("contact");

  return (
    <ul className="mt-12 grid w-full grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {CONTACT_CHANNELS.map(({ key, href, value, icon, external }) => {
        const comingSoon = href == null;
        const Icon = CONTACT_ICONS[icon];
        const label = t(`items.${key}`);
        const shownValue = comingSoon
          ? t("items.comingSoon")
          : value ?? t(`items.${key}Value`);

        const iconBadge = (
          <span className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/[0.03] text-zinc-200 transition-colors duration-300 group-hover:border-white/25 group-hover:text-white">
            <Icon className="h-5 w-5 transition-transform duration-300 ease-[var(--ease-premium)] group-hover:scale-110" />
          </span>
        );

        const textBlock = (
          <span className="min-w-0">
            <span className="block text-[11px] font-medium uppercase tracking-[0.18em] text-muted">
              {label}
            </span>
            <span
              dir="auto"
              className={cn(
                "mt-1 block truncate text-base transition-colors duration-300",
                comingSoon
                  ? "text-zinc-400 group-hover:text-zinc-300"
                  : "text-zinc-100 group-hover:text-white"
              )}
            >
              {shownValue}
            </span>
          </span>
        );

        return (
          <li key={key}>
            {comingSoon ? (
              <div
                aria-disabled="true"
                aria-label={`${label}: ${shownValue}`}
                className={cn(CARD_BASE, "cursor-default")}
              >
                {iconBadge}
                {textBlock}
              </div>
            ) : (
              <a
                href={href}
                aria-label={`${label}: ${shownValue}`}
                {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                className={cn(CARD_BASE, CARD_INTERACTIVE)}
              >
                {iconBadge}
                {textBlock}
              </a>
            )}
          </li>
        );
      })}
    </ul>
  );
}
