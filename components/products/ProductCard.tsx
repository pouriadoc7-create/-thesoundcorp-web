import { Link } from "@/i18n/navigation";
import type { Product } from "@/lib/types/product";

import { ProductImage } from "./ProductImage";

interface ProductCardProps {
  product: Product;
  /** Localised category name (e.g. "Loudspeakers" / "بلندگوها"). */
  categoryLabel: string;
}

export function ProductCard({ product, categoryLabel }: ProductCardProps) {
  return (
    <Link
      href={`/products/${product.slug}`}
      className="card-lux group flex flex-col overflow-hidden rounded-[var(--radius-panel)] border border-white/[0.08] bg-white/[0.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
    >
      <ProductImage
        brand={product.brand}
        name={product.name}
        src={product.imageUrl ?? product.gallery.find((v) => v.src)?.src}
        blurDataURL={product.imageBlurDataURL ?? product.gallery.find((v) => v.src)?.blurDataURL}
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        className="aspect-[4/3] w-full rounded-none border-0 border-b border-white/[0.06]"
      />
      <div className="flex flex-1 flex-col p-4">
        <span className="text-[10px] font-medium uppercase tracking-[0.18em] text-zinc-500 xl:text-[11px]">
          {product.brand} · {categoryLabel}
        </span>
        <h3 className="mt-2 text-[14px] font-medium text-white transition-colors group-hover:text-white xl:text-lg">
          {product.name}
        </h3>
        <p className="mt-1 line-clamp-2 text-[12px] leading-5 text-zinc-400 xl:text-sm">{product.tagline}</p>
        <span className="mt-3 text-[12px] text-zinc-500 xl:text-sm">{product.priceNote}</span>
      </div>
    </Link>
  );
}
