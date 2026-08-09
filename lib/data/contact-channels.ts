import { CONTACT } from "@/lib/constants/site";

/**
 * Single source of truth for the Contact section's channel list. The
 * ContactChannels component renders this array generically, so **adding a new
 * channel (LinkedIn, Telegram, X, …) is a data-only change**: append an entry
 * here, register its icon in the `CONTACT_ICONS` map (components/contact/
 * ContactChannels.tsx), and add the `contact.items.<key>` label to messages/*.
 * No layout, styling, or markup changes required.
 *
 * Conventions:
 *  - `href: null`  → the channel isn't live yet; the card renders as a polished,
 *    non-clickable "Coming Soon" placeholder that flips to a real link the
 *    moment a URL is supplied (see YouTube below).
 *  - `value: null` → the display value is locale-dependent, resolved from
 *    `contact.items.<key>Value` (e.g. the translated address).
 *  - `external`    → http(s) links open in a new, safely-rel'd tab; tel:/mailto:
 *    stay in-app.
 */

/** Icon registry keys — must match a component in CONTACT_ICONS. */
export type ContactIconKey =
  | "phone"
  | "whatsapp"
  | "instagram"
  | "gmail"
  | "maps"
  | "youtube";
// Future: | "linkedin" | "telegram" | "x"

export interface ContactChannel {
  /** Stable key; also the `contact.items.<key>` translation label. */
  key: string;
  /** Ready-to-use link, or `null` while the channel is still "Coming Soon". */
  href: string | null;
  /** Static display value, or `null` to resolve from `items.<key>Value`. */
  value: string | null;
  /** Which brand icon to render. */
  icon: ContactIconKey;
  /** http(s) → new tab; tel:/mailto: → same tab. Ignored when href is null. */
  external: boolean;
}

export const CONTACT_CHANNELS: ContactChannel[] = [
  { key: "phone", href: CONTACT.phone.href, value: CONTACT.phone.display, icon: "phone", external: false },
  { key: "whatsapp", href: CONTACT.whatsapp.href, value: CONTACT.whatsapp.display, icon: "whatsapp", external: true },
  { key: "instagram", href: CONTACT.instagram.href, value: CONTACT.instagram.display, icon: "instagram", external: true },
  { key: "email", href: CONTACT.email.href, value: CONTACT.email.display, icon: "gmail", external: false },
  { key: "address", href: CONTACT.map.href, value: null, icon: "maps", external: true },
  // Not live yet → renders "Coming Soon". Set CONTACT.youtube.href to go live.
  { key: "youtube", href: CONTACT.youtube.href, value: CONTACT.youtube.display || null, icon: "youtube", external: true },
];
