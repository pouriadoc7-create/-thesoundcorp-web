"use client";

import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";

import { OPEN_COMMAND_PALETTE } from "@/components/features/CommandPalette";
import { Link, usePathname } from "@/i18n/navigation";
import { NAV_LINKS } from "@/lib/constants/site";
import { getBrandColumns } from "@/lib/data/brands";
import { useHoverDropdown } from "@/lib/hooks/useHoverDropdown";
import { useMobileMenu } from "@/lib/hooks/useMobileMenu";
import { cn } from "@/lib/utils/cn";

import { BrandLogo } from "@/components/ui/BrandLogo";

import { LocaleSwitcher } from "./LocaleSwitcher";
import { Logo } from "./Logo";
import { MobileNav } from "./MobileNav";

const BRAND_COLUMNS = getBrandColumns(5);
const BRANDS_MENU_ID = "brands-mega-menu";

/** Shared classes for a single desktop nav item — uppercase + tracked in LTR,
 *  left untouched in RTL so Persian's joined letterforms don't break. */
const NAV_ITEM =
  "nav-link rounded-md text-[12.5px] font-[560] leading-none transition-colors duration-300 ltr:uppercase ltr:tracking-[0.1em] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50";

export function Header() {
  const {
    isOpen: mobileNavOpen,
    toggle: toggleMobileNav,
    close: closeMobileNav,
    panelRef: mobileNavPanelRef,
    triggerRef: mobileNavTriggerRef,
  } = useMobileMenu();
  const { isOpen: brandsOpen, containerProps } = useHoverDropdown();
  const t = useTranslations("nav");
  const tHeader = useTranslations("header");
  const tSearch = useTranslations("common.search");
  const pathname = usePathname();

  const headerRef = useRef<HTMLElement>(null);
  const [scrolled, setScrolled] = useState(false);

  // At the top the header is nearly transparent; once scrolled it solidifies
  // into stronger matte glass and shrinks a touch — a slow, cinematic settle.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Keep --header-height in lock-step with the real rendered height (which
  // changes as the header shrinks) so the mega menu and mobile-nav backdrop
  // that anchor off it never drift.
  useEffect(() => {
    const el = headerRef.current;
    if (!el) return;
    const sync = () =>
      document.documentElement.style.setProperty("--header-height", `${el.offsetHeight}px`);
    sync();
    const ro = new ResizeObserver(sync);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);
  const brandsActive = isActive("/brands");

  return (
    <header
      ref={headerRef}
      className={cn(
        "sticky top-0 z-[var(--z-header)] w-full pl-[env(safe-area-inset-left)] pr-[env(safe-area-inset-right)] backdrop-blur-[14px] backdrop-saturate-[1.15] transition-[background-color,border-color,box-shadow] duration-700 ease-[var(--ease-premium)]",
        scrolled
          ? "border-b border-white/[0.07] bg-black/70 shadow-[0_16px_50px_-30px_rgba(0,0,0,0.9)] supports-[backdrop-filter]:bg-black/55"
          : "border-b border-white/[0.02] bg-black/25 supports-[backdrop-filter]:bg-black/10"
      )}
    >
      {/* Almost-invisible top light line + faint downward gradient (premium depth). */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/[0.12] to-transparent opacity-70"
      />

      <div
        className={cn(
          "relative mx-auto flex max-w-7xl items-center justify-between px-6 transition-[height] duration-700 ease-[var(--ease-premium)] lg:px-10",
          scrolled ? "h-[94px]" : "h-[110px]"
        )}
      >
        {/* Logo — the hero. Generous room on the start edge, subtle scale on scroll/hover. */}
        <Logo
          imageClassName={cn(
            "transition-[height] duration-700 ease-[var(--ease-premium)]",
            scrolled ? "h-[46px] md:h-[52px]" : "h-[54px] md:h-[64px]"
          )}
        />

        <div className="flex items-center gap-3 lg:gap-4">
          {/* Desktop nav — gated at lg; spacing opens up further at xl. */}
          <nav
            className={cn(
              "hidden items-center transition-[column-gap] duration-500 ease-[var(--ease-premium)] lg:flex",
              scrolled ? "lg:gap-5 xl:gap-10" : "lg:gap-6 xl:gap-12"
            )}
          >
            {NAV_LINKS.map((link) => {
              if (link.key === "brands") {
                return (
                  <div key={link.key} className="relative" {...containerProps}>
                    <button
                      type="button"
                      className={cn(NAV_ITEM, "flex items-center gap-1.5", brandsActive ? "text-white" : "text-zinc-400 hover:text-white")}
                      aria-expanded={brandsOpen}
                      aria-haspopup="true"
                      aria-controls={BRANDS_MENU_ID}
                      aria-current={brandsActive ? "page" : undefined}
                    >
                      {t("brands")}
                      <svg
                        className={cn("h-3 w-3 transition-transform duration-300 ease-[var(--ease-premium)]", brandsOpen && "rotate-180")}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        aria-hidden="true"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>

                    {/* Mega menu. `inert` while closed removes its ~50 links and
                        column labels from the tab order and accessibility tree
                        (they're only visually hidden otherwise). */}
                    <div
                      id={BRANDS_MENU_ID}
                      inert={!brandsOpen}
                      className={cn(
                        "fixed inset-x-0 top-[var(--header-height)] z-[var(--z-dropdown)] flex justify-center px-4 transition-all duration-300 ease-[var(--ease-premium)] sm:px-6 lg:px-8",
                        brandsOpen
                          ? "pointer-events-auto translate-y-0 scale-100 opacity-100"
                          : "pointer-events-none -translate-y-2 scale-[0.97] opacity-0"
                      )}
                    >
                      <div className="mt-4 w-full max-w-7xl">
                        <div className="relative overflow-hidden rounded-[var(--radius-panel)] border border-white/[0.08] bg-surface/85 shadow-[0_25px_70px_-15px_rgba(0,0,0,0.75),0_10px_30px_-10px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(255,255,255,0.06)] backdrop-blur-xl">
                          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.07),transparent_55%)]" />
                          <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

                          <div className="relative grid grid-cols-5 gap-x-10 px-10 py-10">
                            {BRAND_COLUMNS.map((column, colIndex) => (
                              <div
                                key={column.title}
                                style={{ transitionDelay: brandsOpen ? `${80 + colIndex * 70}ms` : "0ms" }}
                                className={cn(
                                  "transform-gpu transition-all duration-500 ease-[var(--ease-premium)] motion-reduce:transition-none",
                                  brandsOpen ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0",
                                  colIndex !== 0 && "border-s border-white/[0.08] ps-10"
                                )}
                              >
                                {/* Decorative column label — intentionally not a
                                    heading so it doesn't precede the page <h1>. */}
                                <p className="mb-4 border-b border-white/[0.08] pb-3 text-[11px] font-medium uppercase tracking-[0.2em] text-white/90">
                                  {column.title}
                                </p>
                                <ul className="flex flex-col gap-0.5">
                                  {column.brands.map((brand) => (
                                    <li key={brand.slug}>
                                      <Link
                                        href={`/brands/${brand.slug}`}
                                        className="block rounded-md px-2 py-2.5 text-sm tracking-wide text-white/60 transition-all duration-300 ease-out hover:text-white hover:[text-shadow:0_0_16px_rgba(255,255,255,0.35)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 ltr:hover:-translate-x-1 rtl:hover:translate-x-1"
                                      >
                                        {brand.logoUrl ? (
                                          <BrandLogo
                                            name={brand.name}
                                            logoUrl={brand.logoUrl}
                                            className="h-5 w-24 ltr:justify-start rtl:justify-end"
                                            imgClassName="ltr:object-left rtl:object-right"
                                          />
                                        ) : (
                                          brand.name
                                        )}
                                      </Link>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              }

              const active = isActive(link.href);
              return (
                <Link
                  key={link.key}
                  href={link.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(NAV_ITEM, active ? "text-white" : "text-zinc-400 hover:text-white")}
                >
                  {t(link.key)}
                </Link>
              );
            })}
          </nav>

          {/* Hairline divider + language switcher (desktop) */}
          <div className="hidden lg:flex lg:items-center lg:border-s lg:border-white/[0.08] lg:ps-5">
            <LocaleSwitcher />
          </div>

          {/* Search (⌘K) — slightly larger, thin stroke, gold glow + soft rotate on hover */}
          <button
            type="button"
            onClick={() => window.dispatchEvent(new Event(OPEN_COMMAND_PALETTE))}
            aria-label={tSearch("open")}
            title={tSearch("open")}
            className="group inline-flex h-11 w-11 items-center justify-center rounded-full text-zinc-300 transition-colors duration-300 hover:text-[color:var(--color-gold-soft)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-gold)]/60"
          >
            <svg
              className="h-[24px] w-[24px] transition-transform duration-300 ease-[var(--ease-premium)] group-hover:scale-110 group-hover:rotate-[10deg] group-hover:drop-shadow-[0_0_9px_rgba(212,175,55,0.55)]"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.5}
              strokeLinecap="round"
              aria-hidden="true"
            >
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-3.4-3.4" />
            </svg>
          </button>

          {/* Mobile toggle */}
          <button
            ref={mobileNavTriggerRef}
            type="button"
            className="inline-flex items-center justify-center rounded-md p-2 text-zinc-200 transition-colors duration-300 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 lg:hidden"
            onClick={toggleMobileNav}
            aria-expanded={mobileNavOpen}
            aria-controls="mobile-nav-panel"
            aria-label={tHeader("toggleNavigation")}
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75} aria-hidden="true">
              {mobileNavOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 7h16M4 12h16M4 17h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      <MobileNav isOpen={mobileNavOpen} onNavigate={closeMobileNav} panelRef={mobileNavPanelRef} />
    </header>
  );
}
