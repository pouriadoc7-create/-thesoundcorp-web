"use client";

import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";
import { useCallback, useEffect, useRef } from "react";

import { useFocusTrap } from "@/lib/hooks/useFocusTrap";
import type { GalleryImage } from "@/lib/types/gallery";

interface LightboxProps {
  images: GalleryImage[];
  index: number;
  onIndexChange: (index: number) => void;
  onClose: () => void;
}

/**
 * Fullscreen image viewer. Supports Escape / Arrow-key navigation, touch swipe,
 * a live counter and caption, locks body scroll while open, and restores focus
 * to the trigger on close. Rendered only while open (no inert bookkeeping).
 */
export function Lightbox({ images, index, onIndexChange, onClose }: LightboxProps) {
  const t = useTranslations("gallery");
  const locale = useLocale() as "en" | "fa";
  const total = images.length;
  const image = images[index];

  const closeRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const touchStart = useRef<{ x: number; y: number } | null>(null);

  // Trap Tab within the viewer — it's aria-modal, so the gallery behind must
  // leave the tab order. Mounted only while open, so it's always active here.
  useFocusTrap(true, dialogRef);

  const go = useCallback(
    (delta: number) => onIndexChange((index + delta + total) % total),
    [index, total, onIndexChange]
  );

  // Keyboard navigation.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowRight") go(1);
      else if (e.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go, onClose]);

  // Lock body scroll + restore focus to whatever was focused before opening.
  useEffect(() => {
    const previouslyFocused = document.activeElement as HTMLElement | null;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    return () => {
      document.body.style.overflow = prevOverflow;
      previouslyFocused?.focus?.();
    };
  }, []);

  const onTouchStart = (e: React.TouchEvent) => {
    const t0 = e.touches[0];
    touchStart.current = { x: t0.clientX, y: t0.clientY };
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (!touchStart.current) return;
    const t1 = e.changedTouches[0];
    const dx = t1.clientX - touchStart.current.x;
    const dy = t1.clientY - touchStart.current.y;
    touchStart.current = null;
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) go(dx < 0 ? 1 : -1);
  };

  if (!image) return null;

  return (
    // Backdrop click-to-close is a MOUSE convenience that duplicates controls
    // keyboard users already have: Escape (line ~44), the focused close button,
    // and a focus trap. Adding a key listener here would be redundant, and
    // making the backdrop focusable would put a phantom stop in the tab order.
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-noninteractive-element-interactions
    <div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-label={image.caption[locale] || t("title")}
      className="fixed inset-0 z-[var(--z-modal)] flex flex-col bg-black/95 backdrop-blur-md motion-safe:animate-[pageEnter_0.3s_var(--ease-premium)]"
      onClick={onClose}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      {/* Top bar: counter + close */}
      {/* Pure event plumbing — stops a click on the bar from reaching the
          backdrop's close handler. Not an interactive element. */}
      {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions */}
      <div
        className="flex items-center justify-between px-5 py-4 text-white/80 sm:px-8"
        onClick={(e) => e.stopPropagation()}
      >
        <span className="text-sm tabular-nums tracking-wider text-white/60">
          {t("counter", { current: index + 1, total })}
        </span>
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          aria-label={t("close")}
          className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/15 text-white/80 transition-colors hover:border-white/40 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" aria-hidden="true">
            <path d="m6 6 12 12M18 6 6 18" />
          </svg>
        </button>
      </div>

      {/* Stage */}
      <div className="relative flex min-h-0 flex-1 items-center justify-center px-4 sm:px-16">
        {total > 1 ? (
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); go(-1); }}
            aria-label={t("previous")}
            className="absolute z-10 inline-flex h-12 w-12 items-center justify-center rounded-full border border-white/15 bg-black/40 text-white/80 backdrop-blur transition-colors hover:border-white/40 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 ltr:left-2 rtl:right-2 sm:ltr:left-5 sm:rtl:right-5"
          >
            <svg viewBox="0 0 24 24" className="h-6 w-6 rtl:-scale-x-100" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="m15 6-6 6 6 6" />
            </svg>
          </button>
        ) : null}

        {/* Event plumbing only — keeps a click on the image from closing the viewer. */}
        {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions */}
        <div className="relative flex max-h-full items-center justify-center" onClick={(e) => e.stopPropagation()}>
          <Image
            key={image.id}
            src={image.src}
            alt={image.caption[locale]}
            width={image.width}
            height={image.height}
            placeholder="blur"
            blurDataURL={image.blurDataURL}
            priority
            sizes="100vw"
            className="h-auto max-h-[78vh] w-auto max-w-[92vw] rounded-lg object-contain shadow-[0_30px_80px_-20px_rgba(0,0,0,0.9)]"
          />
        </div>

        {total > 1 ? (
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); go(1); }}
            aria-label={t("next")}
            className="absolute z-10 inline-flex h-12 w-12 items-center justify-center rounded-full border border-white/15 bg-black/40 text-white/80 backdrop-blur transition-colors hover:border-white/40 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 ltr:right-2 rtl:left-2 sm:ltr:right-5 sm:rtl:left-5"
          >
            <svg viewBox="0 0 24 24" className="h-6 w-6 rtl:-scale-x-100" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="m9 6 6 6-6 6" />
            </svg>
          </button>
        ) : null}
      </div>

      {/* Caption */}
      {/* Event plumbing only — selecting caption text must not close the viewer. */}
      {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions */}
      <div className="px-5 py-5 text-center sm:px-8" onClick={(e) => e.stopPropagation()}>
        <p className="text-[11px] font-medium uppercase tracking-[0.24em] text-white/50">
          {t(`categories.${image.category}`)}
        </p>
        <p className="mt-1.5 text-sm text-white/85">{image.caption[locale]}</p>
      </div>
    </div>
  );
}
