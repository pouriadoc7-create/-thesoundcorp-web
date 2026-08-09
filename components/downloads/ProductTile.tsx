"use client";

import { useTranslations } from "next-intl";

import { ProductImage } from "@/components/products/ProductImage";
import { Badge } from "@/components/ui/Badge";
import type { DownloadProduct } from "@/lib/types/download";

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
      className="card-lux group flex flex-col overflow-hidden rounded-[var(--radius-panel)] border border-white/[0.08] bg-white/[0.02] text-start focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
    >
      {/* Premium image stage: one consistent portrait aspect across every card,
          the product contained (never cropped or stretched) and softly framed. */}
      <div className="relative aspect-[4/5] w-full overflow-hidden border-b border-white/[0.06]">
        <ProductImage
          brand={brandName}
          name={product.name}
          src={product.imageUrl}
          blurDataURL={product.imageBlurDataURL}
          variant="full"
          fit="contain"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 380px"
          className="absolute inset-0 h-full w-full"
        />
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.18em] text-muted">
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
          <div className="mt-3 flex items-center gap-2.5">
            <Badge tone="gold">{t("modelCode", { code: product.modelCode })}</Badge>
          </div>
        ) : null}

        <div className="mt-5 flex items-center justify-between border-t border-white/[0.06] pt-4">
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
