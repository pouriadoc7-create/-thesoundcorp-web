"use client";

import { useTranslations } from "next-intl";

import { ProductImage } from "@/components/products/ProductImage";
import { Badge } from "@/components/ui/Badge";
import type { DownloadProduct } from "@/lib/types/download";
import { cardAspectClass } from "@/lib/utils/downloads-view";

interface ProductTileProps {
  brandName: string;
  product: DownloadProduct;
  onOpen: () => void;
}

export function ProductTile({ brandName, product, onOpen }: ProductTileProps) {
  const t = useTranslations("downloads");
  const docCount = product.documents.length;

  return (
    <button
      type="button"
      onClick={onOpen}
      // w-full is load-bearing: a <button> is shrink-to-fit, so without it the card
      // collapses to its intrinsic content width and sits at the start (left) of its
      // grid cell — percentage-width children (the image stage) add nothing to that
      // intrinsic width. w-full makes every card fill its cell, so all cards share
      // one width and one centered X position.
      className="card-lux group flex w-full flex-col overflow-hidden rounded-[var(--radius-panel)] border border-white/[0.08] bg-white/[0.02] text-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 sm:text-start"
    >
      {/* Premium image stage: one consistent aspect per product type (portrait for
          speakers, square for electronics); the image FILLS the area (object-cover,
          aspect ratio preserved — never stretched), intelligently centered. */}
      <div className={`relative w-full overflow-hidden border-b border-white/[0.06] ${cardAspectClass(product.category)}`}>
        <ProductImage
          brand={brandName}
          name={product.name}
          src={product.imageUrl}
          blurDataURL={product.imageBlurDataURL}
          variant="full"
          fit="cover"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 380px"
          className="absolute inset-0 h-full w-full"
        />
      </div>

      <div className="flex flex-1 flex-col items-center p-5 sm:items-start">
        <div className="flex items-center justify-center gap-2 text-[10px] uppercase tracking-[0.18em] text-muted sm:justify-start">
          <span>{product.category}</span>
          {product.status ? (
            <>
              <span aria-hidden="true" className="h-0.5 w-0.5 rounded-full bg-zinc-600" />
              <span className="text-[color:var(--color-gold-soft)]/70">{t(`status.${product.status}`)}</span>
            </>
          ) : null}
        </div>

        <h2 className="mt-2 break-words text-xl font-medium text-zinc-100 transition-colors duration-500 group-hover:text-white">
          {product.name}
        </h2>

        {product.modelCode ? (
          <div className="mt-3 flex items-center justify-center gap-2.5 sm:justify-start">
            <Badge tone="gold">{t("modelCode", { code: product.modelCode })}</Badge>
          </div>
        ) : null}

        <div className="mt-5 flex w-full flex-col items-center gap-2.5 border-t border-white/[0.06] pt-4 sm:flex-row sm:items-center sm:justify-between sm:gap-0">
          <span className="text-[11px] uppercase tracking-[0.16em] text-muted">
            {t("documentCount", { count: docCount })}
          </span>
          <span className="inline-flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-[0.14em] text-zinc-400 transition-colors duration-500 group-hover:text-[color:var(--color-gold-soft)]">
            {t("viewDocuments")}
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
