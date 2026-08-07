import { getTranslations } from "next-intl/server";

import { WhatsAppIcon } from "@/components/icons/ContactIcons";
import { CONTACT } from "@/lib/constants/site";

/**
 * Floating WhatsApp action button, rendered once in the root layout so it
 * appears on every page. Positioned with the logical `inset-inline-end`
 * property (via inline style) so it sits bottom-right in LTR (en) and
 * automatically flips to bottom-left in RTL (fa) — no locale branching needed.
 * The `max(..., env(safe-area-inset-*))` offsets keep it clear of the iPhone
 * home indicator and Android gesture bar so it never covers browser controls.
 */
export async function FloatingWhatsApp() {
  const t = await getTranslations("social");
  const label = t("whatsapp");

  return (
    <a
      href={CONTACT.whatsapp.href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      title={label}
      style={{
        insetInlineEnd: "max(1rem, env(safe-area-inset-right))",
        bottom: "max(1rem, env(safe-area-inset-bottom))",
      }}
      className="group fixed z-[var(--z-toast)] inline-flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_10px_30px_-5px_rgba(37,211,102,0.55),0_4px_12px_rgba(0,0,0,0.4)] ring-1 ring-black/10 transition-all duration-300 ease-[var(--ease-premium)] hover:scale-105 hover:shadow-[0_14px_38px_-4px_rgba(37,211,102,0.7),0_6px_16px_rgba(0,0,0,0.45)] active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black sm:h-16 sm:w-16"
    >
      {/* Gentle resting halo — decorative, and only animates when the user
          hasn't asked for reduced motion (keyframe defined in globals.css). */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-full bg-[#25D366]/40 motion-safe:animate-[waPulse_2.4s_var(--ease-premium)_infinite]"
      />
      <WhatsAppIcon className="relative h-7 w-7 transition-transform duration-300 ease-[var(--ease-premium)] group-hover:scale-110 sm:h-8 sm:w-8" />
    </a>
  );
}
