"use client";

import { useTranslations } from "next-intl";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { Badge } from "@/components/ui/Badge";
import { useRouter } from "@/i18n/navigation";
import { NAV_LINKS } from "@/lib/constants/site";
import { BRANDS } from "@/lib/data/brands";
import { PRODUCTS } from "@/lib/data/products";
import { useFocusTrap } from "@/lib/hooks/useFocusTrap";
import { cn } from "@/lib/utils/cn";

/** Anyone can open the palette by dispatching this event (e.g. a header button). */
export const OPEN_COMMAND_PALETTE = "open-command-palette";

type Group = "pages" | "brands" | "products";
interface Item {
  id: string;
  label: string;
  href: string;
  group: Group;
}

export function CommandPalette() {
  const t = useTranslations("common.search");
  const tNav = useTranslations("nav");
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);

  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const restoreFocus = useRef<HTMLElement | null>(null);

  // Keep Tab within the dialog (it's aria-modal, so the page behind must be
  // unreachable). Open/close, initial focus and restore are handled below.
  useFocusTrap(open, dialogRef);

  const groupLabel: Record<Group, string> = {
    pages: t("groupPages"),
    brands: t("groupBrands"),
    products: t("groupProducts"),
  };

  const items = useMemo<Item[]>(
    () => [
      ...NAV_LINKS.map((l) => ({ id: `p-${l.key}`, label: tNav(l.key), href: l.href, group: "pages" as const })),
      ...BRANDS.map((b) => ({ id: `b-${b.slug}`, label: b.name, href: `/brands/${b.slug}`, group: "brands" as const })),
      ...PRODUCTS.map((p) => ({
        id: `pr-${p.slug}`,
        label: `${p.brand} ${p.name}`,
        href: `/products/${p.slug}`,
        group: "products" as const,
      })),
    ],
    [tNav]
  );

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items.filter((i) => i.group === "pages");
    return items.filter((i) => i.label.toLowerCase().includes(q)).slice(0, 24);
  }, [items, query]);

  const close = useCallback(() => {
    setOpen(false);
    setQuery("");
    setActive(0);
  }, []);

  const openPalette = useCallback(() => {
    restoreFocus.current = document.activeElement as HTMLElement | null;
    setOpen(true);
  }, []);

  const navigate = useCallback(
    (item: Item | undefined) => {
      if (!item) return;
      close();
      router.push(item.href);
    },
    [close, router]
  );

  // Global ⌘K / Ctrl+K toggle, plus an event other UI can dispatch to open it.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((o) => {
          if (!o) restoreFocus.current = document.activeElement as HTMLElement | null;
          return !o;
        });
      }
    };
    const onOpen = () => openPalette();
    window.addEventListener("keydown", onKey);
    window.addEventListener(OPEN_COMMAND_PALETTE, onOpen);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener(OPEN_COMMAND_PALETTE, onOpen);
    };
  }, [openPalette]);

  // Focus the input on open, lock scroll (iOS-safe), restore focus + scroll on
  // close. overflow:hidden alone lets iOS Safari rubber-band the background, so
  // pin the body with position:fixed at the negative scroll offset and restore
  // the exact position on unlock — visually identical, no jump for desktop users.
  useEffect(() => {
    if (!open) return;
    const body = document.body;
    const scrollY = window.scrollY;
    const prev = {
      overflow: body.style.overflow,
      position: body.style.position,
      top: body.style.top,
      width: body.style.width,
    };
    body.style.overflow = "hidden";
    body.style.position = "fixed";
    body.style.top = `-${scrollY}px`;
    body.style.width = "100%";
    inputRef.current?.focus();
    return () => {
      body.style.overflow = prev.overflow;
      body.style.position = prev.position;
      body.style.top = prev.top;
      body.style.width = prev.width;
      window.scrollTo(0, scrollY);
      restoreFocus.current?.focus?.();
    };
  }, [open]);

  const onInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      e.preventDefault();
      close();
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((a) => Math.min(a + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((a) => Math.max(a - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      navigate(results[active]);
    }
  };

  if (!open) return null;

  return (
    // Backdrop click-to-close is a MOUSE convenience. Keyboard users already
    // have Escape (line ~139), a focus trap, and the focused search input —
    // a key listener here would be redundant and a tabbable backdrop harmful.
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
    <div
      className="fixed inset-0 z-[var(--z-modal)] flex items-start justify-center bg-black/70 p-4 pt-[12vh] backdrop-blur-md motion-safe:animate-[pageEnter_0.2s_var(--ease-premium)]"
      onClick={close}
    >
      {/* Event plumbing only — clicks inside the panel must not reach the backdrop. */}
      {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-noninteractive-element-interactions */}
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label={t("label")}
        onClick={(e) => e.stopPropagation()}
        className="glass w-full max-w-xl overflow-hidden rounded-[var(--radius-panel)] shadow-[var(--shadow-luxe)]"
      >
        <div className="flex items-center gap-3 border-b border-white/10 px-4">
          <svg viewBox="0 0 24 24" className="h-5 w-5 shrink-0 text-muted" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" aria-hidden="true">
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-3.2-3.2" />
          </svg>
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setActive(0);
            }}
            onKeyDown={onInputKeyDown}
            aria-label={t("label")}
            aria-controls="command-results"
            aria-activedescendant={results[active] ? `cmd-${results[active].id}` : undefined}
            placeholder={t("placeholder")}
            className="w-full bg-transparent py-4 text-white placeholder:text-muted focus:outline-none"
          />
        </div>

        <div id="command-results" role="listbox" ref={listRef} className="max-h-[52vh] overflow-y-auto p-2">
          {results.length > 0 ? (
            results.map((item, i) => (
              <button
                key={item.id}
                id={`cmd-${item.id}`}
                role="option"
                aria-selected={i === active}
                onMouseMove={() => setActive(i)}
                onClick={() => navigate(item)}
                className={cn(
                  "flex w-full items-center justify-between gap-3 rounded-xl px-3 py-2.5 text-start transition-colors",
                  i === active ? "bg-white/[0.07] text-white" : "text-zinc-300 hover:bg-white/[0.04]"
                )}
              >
                <span className="truncate text-sm">{item.label}</span>
                <Badge tone={item.group === "pages" ? "gold" : "default"}>{groupLabel[item.group]}</Badge>
              </button>
            ))
          ) : (
            <p className="px-3 py-8 text-center text-sm text-muted">{t("empty")}</p>
          )}
        </div>
      </div>
    </div>
  );
}
