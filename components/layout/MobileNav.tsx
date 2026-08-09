"use client";

import { useTranslations } from "next-intl";
import type { RefObject } from "react";
import { createPortal } from "react-dom";

import { Link } from "@/i18n/navigation";
import { NAV_LINKS } from "@/lib/constants/site";
import { BRANDS } from "@/lib/data/brands";
import { cn } from "@/lib/utils/cn";
import { useIsMounted } from "@/lib/hooks/useIsMounted";

import { LocaleSwitcher } from "./LocaleSwitcher";

interface MobileNavProps {
  isOpen: boolean;
  onNavigate: () => void;
  panelRef: RefObject<HTMLDivElement | null>;
}

/**
 * Fullscreen mobile menu that fills the viewport below the sticky header. A
 * frosted-glass overlay that fades + slides in, with its items staggering into
 * place. Portaled to <body> so the header's own backdrop-filter can't clip its
 * fixed position. `inert` + pointer-events-none while closed keep it out of the
 * tab order and hit-testing though it stays mounted (so it can animate). Motion
 * resolves instantly under prefers-reduced-motion.
 */
export function MobileNav({ isOpen, onNavigate, panelRef }: MobileNavProps) {
  const t = useTranslations("nav");
  const mounted = useIsMounted();
  if (!mounted) return null;

  const stagger = (i: number) => ({ transitionDelay: isOpen ? `${70 + i * 45}ms` : "0ms" });
  const itemMotion = cn(
    "transition-[opacity,transform] duration-500 ease-[var(--ease-premium)] motion-reduce:transition-none",
    isOpen ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
  );

  const panel = (
    <div
      id="mobile-nav-panel"
      ref={panelRef}
      role="dialog"
      aria-modal="true"
      aria-label={t("primary")}
      inert={!isOpen}
      className={cn(
        "fixed inset-x-0 top-[var(--header-height)] bottom-0 z-[var(--z-overlay)] flex flex-col overflow-y-auto overscroll-contain bg-black/85 backdrop-blur-2xl backdrop-saturate-150 transition-[opacity,transform] duration-[400ms] ease-[var(--ease-premium)] motion-reduce:transition-none lg:hidden",
        isOpen
          ? "pointer-events-auto translate-y-0 opacity-100"
          : "pointer-events-none -translate-y-2 opacity-0"
      )}
      style={{ paddingBottom: "max(1.5rem, env(safe-area-inset-bottom))" }}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent"
      />

      <nav aria-label={t("primary")} className="flex flex-1 flex-col px-6 pt-5">
        {NAV_LINKS.map((link, i) => {
          if (link.key === "brands") {
            return (
              <div key={link.key} style={stagger(i)} className={itemMotion}>
                <details className="group">
                  <summary className="flex min-h-[44px] cursor-pointer list-none items-center justify-between text-[14px] font-normal leading-[1.1] tracking-[-0.015em] text-holo opacity-90 transition-opacity duration-300 hover:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60">
                    {t("brands")}
                    <svg
                      className="h-4 w-4 text-white/25 transition-transform duration-300 ease-[var(--ease-premium)] group-open:rotate-180"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      aria-hidden="true"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
                    </svg>
                  </summary>
                  <div className="mb-5 grid grid-cols-2 gap-x-4 gap-y-0.5 pb-1">
                    {BRANDS.map((brand) => (
                      <Link
                        key={brand.slug}
                        href={`/brands/${brand.slug}`}
                        onClick={onNavigate}
                        className="flex min-h-[44px] items-center rounded-md text-[12px] font-light tracking-[0.01em] text-[color:var(--color-gold-soft)]/90 transition-colors duration-300 hover:text-[color:var(--color-gold-soft)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
                      >
                        {brand.name}
                      </Link>
                    ))}
                  </div>
                </details>
              </div>
            );
          }

          return (
            <div key={link.key} style={stagger(i)} className={itemMotion}>
              <Link
                href={link.href}
                onClick={onNavigate}
                className="flex min-h-[44px] items-center text-[14px] font-normal leading-[1.1] tracking-[-0.015em] text-holo opacity-90 transition-opacity duration-300 hover:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
              >
                {t(link.key)}
              </Link>
            </div>
          );
        })}

        <div style={stagger(NAV_LINKS.length)} className={cn(itemMotion, "mt-6")}>
          <LocaleSwitcher />
        </div>
      </nav>
    </div>
  );

  return createPortal(panel, document.body);
}
