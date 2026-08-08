"use client";

import { useRef, type MouseEvent } from "react";
import { useTranslations } from "next-intl";

import { BrandLogo } from "@/components/ui/BrandLogo";
import { BRAND_LOGOS } from "@/lib/data/brand-logos";
import type { DownloadBrand } from "@/lib/types/download";

interface BrandTileProps {
  brand: DownloadBrand;
  productCount: number;
  docCount: number;
  onOpen: () => void;
}

/**
 * Brand entry as an experience, not a plain grid cell: a cursor-aware gold
 * spotlight and a whisper of magnetic movement on the inner content, both
 * inert on touch and under reduced-motion.
 */
export function BrandTile({ brand, productCount, docCount, onOpen }: BrandTileProps) {
  const t = useTranslations("downloads");
  const ref = useRef<HTMLButtonElement>(null);
  const fine = useRef(true);

  function handleMove(e: MouseEvent<HTMLButtonElement>) {
    const el = ref.current;
    if (!el) return;
    if (typeof window !== "undefined") {
      fine.current = !window.matchMedia("(pointer: coarse)").matches;
    }
    if (!fine.current) return;
    const r = el.getBoundingClientRect();
    const x = e.clientX - r.left;
    const y = e.clientY - r.top;
    el.style.setProperty("--mx", `${x}px`);
    el.style.setProperty("--my", `${y}px`);
    const relX = (x / r.width - 0.5) * 2;
    const relY = (y / r.height - 0.5) * 2;
    el.style.setProperty("--tx", `${(relX * 5).toFixed(2)}px`);
    el.style.setProperty("--ty", `${(relY * 5).toFixed(2)}px`);
  }

  function handleLeave() {
    const el = ref.current;
    if (!el) return;
    el.style.setProperty("--tx", "0px");
    el.style.setProperty("--ty", "0px");
  }

  const logoUrl = BRAND_LOGOS[brand.slug];

  return (
    <button
      ref={ref}
      type="button"
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      onClick={onOpen}
      aria-label={t("openBrand", { brand: brand.name })}
      className="dl-brand card-lux group relative flex min-h-[290px] w-full flex-col overflow-hidden rounded-[var(--radius-panel)] border border-white/[0.08] bg-white/[0.02] p-7 text-start focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 sm:min-h-[320px] sm:p-8"
    >
      <span aria-hidden="true" className="dl-spotlight" />

      <div className="dl-brand-inner relative flex h-full flex-1 flex-col">
        <div className="text-[10px] font-medium uppercase tracking-[0.24em] text-zinc-500">
          {t("brandEyebrow")}
        </div>

        <div className="flex flex-1 items-center justify-start py-8">
          <BrandLogo
            name={brand.name}
            logoUrl={logoUrl}
            className="h-12 w-[172px] sm:h-14 sm:w-[196px]"
            imgClassName="opacity-90 transition-opacity duration-500 group-hover:opacity-100 ltr:object-left rtl:object-right"
            wordmarkClassName="text-holo text-2xl font-medium tracking-[0.14em]"
          />
        </div>

        <div className="flex items-end justify-between">
          <div className="text-[11px] uppercase tracking-[0.16em] text-zinc-500">
            {t("brandMeta", { products: productCount, documents: docCount })}
          </div>
          <span className="inline-flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-[0.14em] text-zinc-400 transition-colors duration-500 group-hover:text-[color:var(--color-gold-soft)]">
            {t("explore")}
            <svg
              viewBox="0 0 24 24"
              fill="none"
              className="h-3.5 w-3.5 transition-transform duration-500 ease-[var(--ease-premium)] rtl:rotate-180 motion-safe:group-hover:translate-x-1 motion-safe:rtl:group-hover:-translate-x-1"
              aria-hidden="true"
            >
              <path d="M5 12h13M13 6l6 6-6 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
        </div>
      </div>
    </button>
  );
}
