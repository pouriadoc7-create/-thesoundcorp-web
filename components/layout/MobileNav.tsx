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

function Backdrop({ isOpen }: { isOpen: boolean }) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "fixed inset-x-0 top-[var(--header-height)] bottom-0 z-[var(--z-overlay)] bg-black/60 backdrop-blur-sm transition-opacity duration-300 lg:hidden",
        isOpen ? "opacity-100" : "pointer-events-none opacity-0"
      )}
    />
  );
}

export function MobileNav({ isOpen, onNavigate, panelRef }: MobileNavProps) {
  const t = useTranslations("nav");

  // The header this panel lives in has `backdrop-blur`, which establishes a
  // containing block for `position: fixed` descendants — a fixed element
  // using both `top` and `bottom` (like the backdrop) would then size
  // itself against the header's own ~64px box instead of the viewport,
  // collapsing to near-zero height. Portaling to <body> sidesteps that
  // entirely. Mounted-check avoids an SSR crash (no `document` on the
  // server) and the hydration mismatch that would come from rendering
  // portal content only on the client without it.
  const mounted = useIsMounted();

  return (
    <>
      {mounted ? createPortal(<Backdrop isOpen={isOpen} />, document.body) : null}

      {/* Panel — always mounted so it can animate open/closed instead of
          popping in and out instantly. `inert` while closed keeps it out
          of both the tab order and hit-testing despite still being in the
          DOM at zero height. */}
      <div
        id="mobile-nav-panel"
        ref={panelRef}
        inert={!isOpen}
        className={cn(
          "grid overflow-hidden bg-black transition-[grid-template-rows] duration-300 ease-[var(--ease-premium)] lg:hidden",
          isOpen ? "grid-rows-[1fr] border-t border-zinc-800" : "grid-rows-[0fr]"
        )}
      >
        <div className="min-h-0">
          <nav
            className="flex flex-col px-4 py-3"
            style={{ paddingBottom: "max(0.75rem, env(safe-area-inset-bottom))" }}
          >
            {NAV_LINKS.map((link) => {
              if (link.key === "brands") {
                return (
                  <details key={link.key} className="group">
                    <summary className="flex cursor-pointer list-none items-center justify-between rounded-md py-2 text-sm font-medium text-zinc-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60">
                      {t("brands")}
                      <svg
                        className="h-4 w-4 transition-transform duration-200 group-open:rotate-180"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </summary>
                    <div className="mt-2 rounded-[20px] border border-white/[0.08] bg-surface/90 p-4 backdrop-blur-xl">
                      <div className="grid grid-cols-2 gap-x-4 gap-y-1 sm:grid-cols-3">
                        {BRANDS.map((brand) => (
                          <Link
                            key={brand.slug}
                            href={`/brands/${brand.slug}`}
                            className="block rounded-md px-2 py-1.5 text-sm tracking-wide text-white/60 transition-all duration-300 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
                            onClick={onNavigate}
                          >
                            {brand.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </details>
                );
              }

              return (
                <Link
                  key={link.key}
                  href={link.href}
                  className="rounded-md py-2 text-sm font-medium text-zinc-200 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
                  onClick={onNavigate}
                >
                  {t(link.key)}
                </Link>
              );
            })}

            <div className="mt-3 border-t border-zinc-800 pt-3">
              <LocaleSwitcher />
            </div>
          </nav>
        </div>
      </div>
    </>
  );
}
