import Image from "next/image";

import { cn } from "@/lib/utils/cn";

interface ProductImageProps {
  brand: string;
  name: string;
  /** Real photo path/URL. When set, renders next/image; when absent, the placeholder. */
  src?: string;
  /** Tiny base64 LQIP for the blur-up (only used when `src` is set). */
  blurDataURL?: string;
  /** Angle label shown as a corner chip (Front, Rear, Detail…). */
  viewLabel?: string;
  /** "full" shows brand + name; "compact" shows only the view label (thumbnails). */
  variant?: "full" | "compact";
  /** How a real photo fills its box. Cards use "cover"; the large gallery view "contain". */
  fit?: "cover" | "contain";
  /** Responsive `sizes` hint for the optimizer. */
  sizes?: string;
  /** Eager-load above-the-fold images (skips lazy loading). */
  priority?: boolean;
  className?: string;
}

const DEFAULT_SIZES =
  "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 420px";

/**
 * Product image with a real → placeholder fallback baked in.
 *
 * • With `src`: renders an optimized, lazy, responsive next/image (AVIF/WebP via
 *   next.config), with a blur-up placeholder when `blurDataURL` is provided.
 * • Without `src`: renders the premium branded placeholder — a dark radial panel
 *   with a faint concentric-soundwave motif and the brand/product wordmark — so
 *   there is never a broken-image state.
 *
 * Real photography is therefore enabled purely from the data source (set a
 * product's `imageUrl` / gallery `src`); no markup change is required.
 */
export function ProductImage({
  brand,
  name,
  src,
  blurDataURL,
  viewLabel,
  variant = "full",
  fit = "cover",
  sizes,
  priority = false,
  className,
}: ProductImageProps) {
  const chip =
    variant === "full" && viewLabel ? (
      <span className="absolute bottom-3 z-10 rounded-full border border-white/10 bg-black/50 px-2.5 py-1 text-[10px] uppercase tracking-wider text-white/70 backdrop-blur ltr:left-3 rtl:right-3">
        {viewLabel}
      </span>
    ) : null;

  // ---- Real photography ------------------------------------------------
  if (src) {
    const alt = viewLabel ? `${brand} ${name} — ${viewLabel}` : `${brand} ${name}`;
    return (
      <div
        className={cn(
          "relative overflow-hidden bg-[radial-gradient(120%_120%_at_30%_18%,#1c1e24,#0a0b0d)]",
          className
        )}
      >
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes ?? DEFAULT_SIZES}
          quality={90}
          priority={priority}
          {...(priority ? {} : { loading: "lazy" as const })}
          {...(blurDataURL ? { placeholder: "blur" as const, blurDataURL } : {})}
          className={cn(
            "select-none",
            fit === "contain" ? "object-contain" : "object-cover",
            "transition-transform duration-700 ease-[var(--ease-premium)] group-hover:scale-[1.03]"
          )}
        />
        {chip}
      </div>
    );
  }

  // ---- Branded placeholder (no photo supplied yet) ---------------------
  return (
    <div
      className={cn(
        "relative flex items-center justify-center overflow-hidden border border-white/[0.06] bg-[radial-gradient(120%_120%_at_30%_18%,#1c1e24,#0a0b0d)]",
        className
      )}
    >
      {/* Faint concentric soundwave — pure decoration. */}
      <svg
        aria-hidden="true"
        viewBox="0 0 400 300"
        preserveAspectRatio="xMidYMid slice"
        className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.07]"
      >
        {[40, 78, 116, 154, 192].map((r) => (
          <circle key={r} cx="200" cy="150" r={r} fill="none" stroke="white" strokeWidth="1" />
        ))}
      </svg>

      {variant === "full" ? (
        <div className="relative z-10 px-6 text-center">
          <div className="text-[11px] font-medium uppercase tracking-[0.28em] text-white/45">
            {brand}
          </div>
          <div className="mt-2 text-sm font-semibold text-white/80 sm:text-base">{name}</div>
        </div>
      ) : (
        <div className="relative z-10 text-[10px] font-medium uppercase tracking-[0.16em] text-white/55">
          {viewLabel}
        </div>
      )}

      {chip}
    </div>
  );
}
