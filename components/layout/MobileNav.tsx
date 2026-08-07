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

      <nav className="flex flex-1 flex-col px-6 pt-8">
        {NAV_LINKS.map((link, i) => {
          if (link.key === "brands") {
            return (
              <div key={link.key} style={stagger(i)} className={itemMotion}>
                <details className="group border-b border-white/[0.07]">
                  <summary className="flex min-h-[56px] cursor-pointer list-none items-center justify-between text-2xl font-semibold tracking-tight text-zinc-100 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60">
                    {t("brands")}
                    <svg
                      className="h-5 w-5 text-zinc-500 transition-transform duration-300 ease-[var(--ease-premium)] group-open:rotate-180"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      aria-hidden="true"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M19 9l-7 7-7-7" />
                    </svg>
                  </summary>
                  <div className="mb-5 grid grid-cols-2 gap-x-5 gap-y-0.5 pb-1">
                    {BRANDS.map((brand) => (
                      <Link
                        key={brand.slug}
                        href={`/brands/${brand.slug}`}
                        onClick={onNavigate}
                        className="flex min-h-[44px] items-center rounded-md text-[15px] tracking-wide text-white/55 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
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
                className="flex min-h-[56px] items-center border-b border-white/[0.07] text-2xl font-semibold tracking-tight text-zinc-100 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
              >
                {t(link.key)}
              </Link>
            </div>
          );
        })}

        <div style={stagger(NAV_LINKS.length)} className={cn(itemMotion, "mt-8")}>
          <LocaleSwitcher />
        </div>
      </nav>
    </div>
  );

  return createPortal(panel, document.body);
}
