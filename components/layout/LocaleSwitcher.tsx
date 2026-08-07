"use client";

import { useLocale, useTranslations } from "next-intl";

import { usePathname, useRouter } from "@/i18n/navigation";
import { getLocaleDirection, routing } from "@/i18n/routing";
import { cn } from "@/lib/utils/cn";

/**
 * Ultra-minimal segmented control. A single soft pill slides beneath the active
 * language; the slide is computed in *physical* slots so it lands correctly
 * under both LTR and RTL (where the flex row visually reverses). Behaviour is
 * unchanged — clicking a segment swaps the locale on the current path.
 */
export function LocaleSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const t = useTranslations("localeSwitcher");

  const count = routing.locales.length;
  const activeIndex = Math.max(0, routing.locales.indexOf(locale as (typeof routing.locales)[number]));
  const isRtl = getLocaleDirection(locale) === "rtl";
  const physicalSlot = isRtl ? count - 1 - activeIndex : activeIndex;

  return (
    <div
      role="group"
      aria-label={t("label")}
      className="relative inline-flex items-center rounded-full border border-white/[0.08] bg-white/[0.03] p-[3.5px] backdrop-blur-sm"
    >
      {/* Sliding indicator */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-[3.5px] rounded-full bg-white/[0.10] ring-1 ring-white/[0.08] shadow-[0_1px_6px_rgba(0,0,0,0.4)] transition-transform duration-[320ms] ease-[var(--ease-premium)]"
        style={{ width: `calc(${(100 / count).toFixed(4)}% - 3.5px)`, transform: `translateX(${physicalSlot * 100}%)`, left: "3.5px" }}
      />
      {routing.locales.map((loc) => {
        const active = loc === locale;
        return (
          <button
            key={loc}
            type="button"
            onClick={() => router.replace(pathname, { locale: loc })}
            aria-current={active ? "true" : undefined}
            className={cn(
              "relative z-10 rounded-full px-4 py-[7px] text-[13px] font-medium tracking-[0.02em] transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50",
              active ? "text-white" : "text-zinc-400 hover:text-zinc-200"
            )}
          >
            {t(loc)}
          </button>
        );
      })}
    </div>
  );
}
