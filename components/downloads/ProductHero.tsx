"use client";

import { useTranslations } from "next-intl";

import { Reveal } from "@/components/motion/Reveal";
import { ProductImage } from "@/components/products/ProductImage";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import type { DownloadProduct } from "@/lib/types/download";

interface ProductHeroProps {
  brandName: string;
  product: DownloadProduct;
  docCount: number;
}

/** High-end product presentation: a framed hero image beside precise, minimal
 *  typography and a spec ledger. Not a file-manager header. */
export function ProductHero({ brandName, product, docCount }: ProductHeroProps) {
  const t = useTranslations("downloads");

  return (
    <div className="grid items-center gap-8 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1fr)] lg:gap-12 xl:gap-16">
      <Reveal blur className="group order-1">
        <Card className="relative overflow-hidden holo-edge">
          <ProductImage
            brand={brandName}
            name={product.name}
            src={product.imageUrl}
            blurDataURL={product.imageBlurDataURL}
            variant="full"
            fit="contain"
            priority
            sizes="(max-width: 1024px) 100vw, 480px"
            className="aspect-[4/3] w-full"
          />
        </Card>
      </Reveal>

      <div className="order-2">
        <Reveal
          as="p"
          className="flex items-center gap-2.5 text-[10px] font-medium uppercase tracking-[0.24em] text-[color:var(--color-gold-soft)]/90 sm:text-[11px]"
        >
          <span>{brandName}</span>
          <span aria-hidden="true" className="h-1 w-1 rounded-full bg-[color:var(--color-gold)]/60" />
          <span className="text-zinc-400">{product.category}</span>
        </Reveal>

        <Reveal as="h2" delayMs={70} className="mt-3 text-holo text-balance text-[28px] font-medium leading-[1.08] sm:text-[34px] xl:text-[2.75rem]">
          {product.name}
        </Reveal>

        <Reveal delayMs={130} className="mt-4 flex flex-wrap items-center gap-2.5">
          {product.modelCode ? (
            <Badge tone="gold">{t("modelCode", { code: product.modelCode })}</Badge>
          ) : null}
          {product.status ? <Badge>{t(`status.${product.status}`)}</Badge> : null}
          <span className="text-[11px] uppercase tracking-[0.16em] text-zinc-500">
            {t("documentCount", { count: docCount })}
          </span>
        </Reveal>

        {product.tagline ? (
          <Reveal as="p" delayMs={180} className="mt-5 max-w-xl text-[14px] leading-relaxed text-zinc-400 sm:text-[15px]">
            {product.tagline}
          </Reveal>
        ) : null}

        {product.specs?.length ? (
          <Reveal delayMs={230} className="mt-7">
            <dl className="divide-y divide-white/[0.06] border-y border-white/[0.06]">
              {product.specs.map((spec) => (
                <div key={spec.label} className="grid grid-cols-[minmax(88px,0.34fr)_1fr] gap-4 py-2.5">
                  <dt className="text-[10.5px] font-medium uppercase tracking-[0.16em] text-zinc-500">
                    {spec.label}
                  </dt>
                  <dd className="text-[13px] leading-relaxed text-zinc-200">{spec.value}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
        ) : null}
      </div>
    </div>
  );
}
