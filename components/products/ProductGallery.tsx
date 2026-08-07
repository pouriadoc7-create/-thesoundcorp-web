"use client";

import { useState } from "react";

import type { ProductView } from "@/lib/types/product";
import { cn } from "@/lib/utils/cn";

import { ProductImage } from "./ProductImage";

interface ProductGalleryProps {
  brand: string;
  name: string;
  views: ProductView[];
}

/**
 * Product image gallery: a large active view plus a row of selectable
 * thumbnails. Keyboard-operable (native buttons) and horizontally scrollable
 * on small screens.
 */
export function ProductGallery({ brand, name, views }: ProductGalleryProps) {
  const [active, setActive] = useState(0);
  const safeViews = views.length ? views : [{ label: "Front" }];
  const current = safeViews[active];

  return (
    <div className="group">
      <ProductImage
        brand={brand}
        name={name}
        src={current?.src}
        blurDataURL={current?.blurDataURL}
        viewLabel={current?.label}
        fit="contain"
        priority
        sizes="(max-width: 1024px) 100vw, 600px"
        className="aspect-[4/3] w-full rounded-[var(--radius-panel)]"
      />

      {safeViews.length > 1 ? (
        <div className="mt-4 flex gap-3 overflow-x-auto pb-1">
          {safeViews.map((view, i) => (
            <button
              key={view.label}
              type="button"
              onClick={() => setActive(i)}
              aria-pressed={i === active}
              aria-label={view.label}
              className={cn(
                "h-20 w-24 shrink-0 overflow-hidden rounded-xl border transition-all duration-300 ease-[var(--ease-premium)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60",
                i === active
                  ? "border-white/70"
                  : "border-white/10 opacity-70 hover:opacity-100 hover:border-white/30"
              )}
            >
              <ProductImage
                brand={brand}
                name={name}
                src={view.src}
                blurDataURL={view.blurDataURL}
                viewLabel={view.label}
                variant="compact"
                sizes="96px"
                className="h-full w-full rounded-[10px] border-0"
              />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
