import { SITE_NAME } from "@/lib/constants/site";

/**
 * Shown by the App Router during route-level loading / Suspense. An elegant,
 * on-brand loader: the wordmark under a slow shimmer with a thin sweeping line
 * beneath it — quiet, not a spinner. Both animations are motion-safe only.
 *
 * The wrapper is min-h-dvh — a full viewport, NOT a partial height — because
 * this file's mere existence makes the App Router wrap every [locale] page in a
 * Suspense boundary, and that boundary is baked into the *prerendered* HTML:
 * the shell ships this fallback inline, then <footer>, and only later the real
 * content in a `<div hidden id="S:0">` that an inline `$RC=` script swaps in.
 * A browser that paints between those two points sees the footer sitting right
 * under a short fallback, then watches it jump ~3.8k px down the page.
 *
 * At 60vh the fallback was ~494px, which put the footer at y≈605 in an 823px
 * viewport — visible. Layout-shift impact is the shifted element's visible
 * fraction, so that cost 218/823 = 0.265 CLS (measured, exactly), dropping
 * mobile Lighthouse performance ~90 -> 78 on whichever page won the race.
 * Filling the viewport keeps the footer below the fold until the real content
 * has replaced this, so the swap shifts nothing the user can see. Any change
 * here must keep the fallback >= 100dvh tall.
 */
export default function Loading() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-6 px-6">
      <span className="loader-shimmer text-[16px] font-medium tracking-[0.04em] sm:text-[19px] xl:text-2xl">
        {SITE_NAME}
      </span>
      <span
        aria-hidden="true"
        className="relative block h-px w-40 overflow-hidden bg-white/10"
      >
        <span className="absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-transparent via-white/80 to-transparent motion-safe:animate-[lineSweep_1.5s_var(--ease-premium)_infinite]" />
      </span>
      <span className="sr-only">Loading…</span>
    </div>
  );
}
