"use client";

import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

/**
 * Appears once the reader is well down the page and glides them back to the
 * top. Sits on the opposite side to the floating WhatsApp button (logical
 * inset-inline-start vs -end), so the two never collide in either direction.
 */
export function BackToTop() {
  const t = useTranslations("common");
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 700);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const toTop = () => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
  };

  return (
    <button
      type="button"
      onClick={toTop}
      aria-label={t("backToTop")}
      title={t("backToTop")}
      tabIndex={visible ? 0 : -1}
      style={{
        insetInlineStart: "max(1rem, env(safe-area-inset-left))",
        bottom: "max(1rem, env(safe-area-inset-bottom))",
      }}
      className={`group fixed z-[var(--z-toast)] inline-flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-black/60 text-white/80 backdrop-blur-md transition-all duration-300 ease-[var(--ease-premium)] hover:border-[color:var(--color-gold)]/50 hover:text-[color:var(--color-gold-soft)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-gold)]/60 ${
        visible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-3 opacity-0"
      }`}
    >
      <svg
        viewBox="0 0 24 24"
        className="h-5 w-5 transition-transform duration-300 ease-[var(--ease-premium)] group-hover:-translate-y-0.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M12 19V5M5 12l7-7 7 7" />
      </svg>
    </button>
  );
}
