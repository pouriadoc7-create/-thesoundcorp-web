import type { NavLink } from "@/lib/types/nav";

/** Proper noun — not translated across locales. */
export const SITE_NAME = "TheSoundCorp";

/** Canonical production origin. Every absolute URL (canonical, OG, sitemap,
 *  robots, JSON-LD, next/image) derives from this. */
export const PRODUCTION_URL = "https://thesoundcorp.ir";

/**
 * Absolute site origin. Defaults to the real production domain so there is NO
 * localhost dependency in any build output — override with NEXT_PUBLIC_SITE_URL
 * only for a staging/preview origin. The trailing slash is stripped so callers
 * can always concatenate `${SITE_URL}/path`.
 */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? PRODUCTION_URL).replace(/\/+$/, "");

export const NAV_LINKS: NavLink[] = [
  { key: "home", href: "/" },
  { key: "brands", href: "/brands" },
  { key: "products", href: "/products" },
  { key: "gallery", href: "/gallery" },
  { key: "downloads", href: "/downloads" },
  { key: "about", href: "/about" },
  { key: "contact", href: "/contact" },
];

/**
 * Single source of truth for real contact details. `href` values are the
 * exact, ready-to-use links (tel/mailto/wa.me/etc.); `display` values are the
 * human-readable strings shown in the UI. Phone/WhatsApp share one number.
 * Keeping these here means the Contact page, footer, and floating button can
 * never drift out of sync.
 */
export const CONTACT = {
  phone: {
    display: "+98 912 321 5847",
    href: "tel:+989123215847",
  },
  whatsapp: {
    // Same number as phone; wa.me wants the international form with no "+".
    display: "+98 912 321 5847",
    href: "https://wa.me/989123215847",
  },
  instagram: {
    display: "@the.sound.corp",
    href: "https://instagram.com/the.sound.corp",
  },
  email: {
    display: "thesound1.ir@gmail.com",
    href: "mailto:thesound1.ir@gmail.com",
  },
  youtube: {
    // Channel isn't live yet. When it is, paste the channel URL into `href`
    // (e.g. "https://youtube.com/@thesoundcorp") and set `display` to the
    // handle — the Contact card auto-switches from "Coming Soon" to a live
    // link with no code changes (see lib/data/contact-channels.ts).
    display: "",
    href: null as string | null,
  },
  map: {
    // The exact shortlink provided — used by every "open the location" action.
    // Resolves to the "The Sound Corp." place (ftid 0x3f8e07977611203d:0xc7714d8940f47db9,
    // plus code QFQ4+RWJ Tehran) at 35.7895928, 51.4572719.
    href: "https://maps.app.goo.gl/N9oq4FTZCqztKKDm8?g_st=ic",
    // Keyless embed pinned to those EXACT coordinates — `q=lat,lng` drops a
    // marker on the business and centres on it; z=17 shows the street/building
    // (not the whole Manzariyeh neighbourhood). Same destination as `href`.
    embed:
      "https://www.google.com/maps?q=35.7895928,51.4572719&z=17&output=embed",
  },
} as const;
