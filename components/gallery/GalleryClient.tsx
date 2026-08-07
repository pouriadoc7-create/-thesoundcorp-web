"use client";

import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";
import { useMemo, useState } from "react";

import { Reveal } from "@/components/motion/Reveal";
import { GALLERY_CATEGORIES, GALLERY_IMAGES } from "@/lib/data/gallery";
import type { GalleryCategory } from "@/lib/types/gallery";
import { cn } from "@/lib/utils/cn";

import { Lightbox } from "./Lightbox";

type CategoryFilter = GalleryCategory | "all";

export function GalleryClient() {
  const t = useTranslations("gallery");
  const locale = useLocale() as "en" | "fa";
  const [category, setCategory] = useState<CategoryFilter>("all");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const images = useMemo(
    () => (category === "all" ? GALLERY_IMAGES : GALLERY_IMAGES.filter((i) => i.category === category)),
    [category]
  );

  return (
    <div>
      {/* Category filters */}
      <div className="flex flex-wrap justify-center gap-2" role="group" aria-label={t("filterLabel")}>
        {(["all", ...GALLERY_CATEGORIES] as CategoryFilter[]).map((c) => {
          const active = category === c;
          return (
            <button
              key={c}
              type="button"
              onClick={() => setCategory(c)}
              aria-pressed={active}
              className={cn(
                "rounded-full border px-4 py-2 text-sm transition-all duration-300 ease-[var(--ease-premium)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60",
                active
                  ? "border-white bg-white text-black"
                  : "border-white/15 text-zinc-300 hover:border-white/40 hover:text-white"
              )}
            >
              {c === "all" ? t("allCategories") : t(`categories.${c}`)}
            </button>
          );
        })}
      </div>

      <p className="mt-5 text-center text-sm text-zinc-500" aria-live="polite">
        {t("photoCount", { count: images.length })}
      </p>

      {/* Masonry (CSS columns) */}
      {images.length > 0 ? (
        <div className="mt-10 gap-4 [column-fill:_balance] sm:columns-2 lg:columns-3 xl:columns-4">
          {images.map((image, i) => (
            <Reveal key={image.id} className="mb-4 break-inside-avoid">
              <button
                type="button"
                onClick={() => setLightboxIndex(i)}
                aria-label={`${t("openImage")} — ${image.caption[locale]}`}
                className="card-lux group relative block w-full overflow-hidden rounded-[var(--radius-panel)] border border-white/[0.08] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
              >
                <Image
                  src={image.src}
                  alt={image.caption[locale]}
                  width={image.width}
                  height={image.height}
                  placeholder="blur"
                  blurDataURL={image.blurDataURL}
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                  className="h-auto w-full transition-transform duration-700 ease-[var(--ease-premium)] group-hover:scale-[1.05]"
                />
                {/* Caption scrim — subtle by default, intensifies on hover. */}
                <span className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent p-4 text-start opacity-90 transition-opacity duration-300 group-hover:opacity-100">
                  <span className="block text-[10px] font-medium uppercase tracking-[0.2em] text-white/50">
                    {t(`categories.${image.category}`)}
                  </span>
                  <span className="mt-0.5 block text-sm text-white/90">{image.caption[locale]}</span>
                </span>
              </button>
            </Reveal>
          ))}
        </div>
      ) : (
        <p className="mt-16 text-center text-zinc-500">{t("empty")}</p>
      )}

      {lightboxIndex !== null ? (
        <Lightbox
          images={images}
          index={lightboxIndex}
          onIndexChange={setLightboxIndex}
          onClose={() => setLightboxIndex(null)}
        />
      ) : null}
    </div>
  );
}
