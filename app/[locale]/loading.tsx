import { SITE_NAME } from "@/lib/constants/site";

/**
 * Shown by the App Router during route-level loading / Suspense. An elegant,
 * on-brand loader: the wordmark under a slow shimmer with a thin sweeping line
 * beneath it — quiet, not a spinner. Both animations are motion-safe only.
 */
export default function Loading() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-6 px-6">
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
