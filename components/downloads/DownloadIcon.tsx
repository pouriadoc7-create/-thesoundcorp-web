"use client";

import { useTranslations } from "next-intl";

import { useOfficialDownload } from "@/lib/hooks/useOfficialDownload";
import { cn } from "@/lib/utils/cn";

interface DownloadIconProps {
  brand: string;
  product: string;
  doc: string;
  filename: string;
  /** Same-origin URL for a locally-hosted file; when set, it's fetched directly
   *  instead of via the proxy. */
  href?: string;
  /** Accessible label, e.g. "Download NP5 User Guide". */
  ariaLabel: string;
  /** Tooltip copy, e.g. "Download · official source". */
  tooltip: string;
}

const RING_R = 15;
const RING_C = 2 * Math.PI * RING_R;

/**
 * The single, minimal download control — no "DOWNLOAD" button. A quiet circular
 * glyph that, on click, streams the official file through our proxy and reflects
 * the REAL transfer: idle arrow → determinate progress ring → success check (or
 * a soft error). Never navigates; the user stays in the Download Center.
 */
export function DownloadIcon({
  brand,
  product,
  doc,
  filename,
  href,
  ariaLabel,
  tooltip,
}: DownloadIconProps) {
  const t = useTranslations("downloads");
  const { status, progress, download } = useOfficialDownload();
  const busy = status === "loading";
  const pct = progress ?? 0;
  const statusMessage =
    status === "loading"
      ? t("dlStatus.loading")
      : status === "success"
        ? t("dlStatus.success")
        : status === "error"
          ? t("dlStatus.error")
          : "";

  return (
    <span className="group/ic relative inline-flex">
      <button
        type="button"
        aria-label={ariaLabel}
        aria-busy={busy}
        disabled={busy}
        onClick={() => download({ brand, product, doc, filename, href })}
        className={cn(
          "relative inline-flex h-11 w-11 items-center justify-center rounded-full border transition-[color,background-color,border-color,transform] duration-500 ease-[var(--ease-premium)]",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-gold)]/60 focus-visible:ring-offset-2 focus-visible:ring-offset-black",
          status === "success"
            ? "border-[color:var(--color-gold)]/60 bg-[color:var(--color-gold)]/[0.08] text-[color:var(--color-gold-soft)]"
            : status === "error"
              ? "border-red-400/40 bg-red-400/[0.06] text-red-300"
              : "border-white/12 bg-white/[0.03] text-zinc-300 hover:border-[color:var(--color-gold)]/55 hover:bg-white/[0.06] hover:text-white active:scale-95"
        )}
      >
        {/* Progress ring (visible while loading). */}
        <svg
          viewBox="0 0 36 36"
          className={cn(
            "pointer-events-none absolute inset-0 h-full w-full -rotate-90",
            busy ? "opacity-100" : "opacity-0"
          )}
          aria-hidden="true"
        >
          <circle cx="18" cy="18" r={RING_R} fill="none" stroke="currentColor" strokeOpacity="0.12" strokeWidth="1.5" />
          {progress === null ? (
            <circle
              cx="18"
              cy="18"
              r={RING_R}
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeDasharray={`${RING_C * 0.28} ${RING_C}`}
              className="origin-center text-[color:var(--color-gold-soft)] motion-safe:animate-spin"
            />
          ) : (
            <circle
              cx="18"
              cy="18"
              r={RING_R}
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeDasharray={RING_C}
              strokeDashoffset={RING_C * (1 - pct)}
              className="text-[color:var(--color-gold-soft)] transition-[stroke-dashoffset] duration-200 ease-linear"
            />
          )}
        </svg>

        {/* Glyph */}
        <span className="relative inline-flex h-5 w-5 items-center justify-center">
          {status === "success" ? (
            <svg viewBox="0 0 24 24" fill="none" className="h-[18px] w-[18px]" aria-hidden="true">
              <path
                d="M20 6L9 17l-5-5"
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          ) : status === "error" ? (
            <svg viewBox="0 0 24 24" fill="none" className="h-[18px] w-[18px]" aria-hidden="true">
              <path d="M12 8v5" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
              <circle cx="12" cy="16.5" r="0.9" fill="currentColor" />
              <path
                d="M10.3 3.9 2.6 17.4A1.9 1.9 0 0 0 4.3 20.2h15.4a1.9 1.9 0 0 0 1.7-2.8L13.7 3.9a1.9 1.9 0 0 0-3.4 0Z"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinejoin="round"
              />
            </svg>
          ) : (
            <svg
              viewBox="0 0 24 24"
              fill="none"
              className={cn(
                "h-[18px] w-[18px] transition-transform duration-500 ease-[var(--ease-premium)]",
                !busy && "motion-safe:group-hover/ic:translate-y-[2px]"
              )}
              aria-hidden="true"
            >
              <path d="M12 3.5v11" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              <path
                d="M7.5 10.5 12 15l4.5-4.5"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M5 19.5h14"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                className="opacity-70"
              />
            </svg>
          )}
        </span>
      </button>

      {/* Tooltip — quiet, appears on hover/focus, hidden on touch/coarse pointers. */}
      <span
        role="tooltip"
        className={cn(
          "pointer-events-none absolute bottom-[calc(100%+10px)] left-1/2 z-20 hidden -translate-x-1/2 whitespace-nowrap rounded-full border border-white/10 bg-black/80 px-3 py-1.5 text-[11px] tracking-wide text-zinc-200 opacity-0 backdrop-blur transition-opacity duration-300 ease-[var(--ease-premium)]",
          "sm:block group-hover/ic:opacity-100 group-focus-within/ic:opacity-100"
        )}
      >
        {tooltip}
      </span>

      {/* Screen-reader-only live announcement of the real download state. */}
      <span role="status" aria-live="polite" className="sr-only">
        {statusMessage}
      </span>
    </span>
  );
}
