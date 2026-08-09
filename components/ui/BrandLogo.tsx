import Image from "next/image";

import { cn } from "@/lib/utils/cn";

interface BrandLogoProps {
  name: string;
  /** Path/URL to an official SVG/PNG logo. Absent → elegant wordmark fallback. */
  logoUrl?: string;
  /** Sizing box for the logo image (e.g. "h-12 w-full"). */
  className?: string;
  /** Extra classes for the <Image> (object-fit is applied automatically). */
  imgClassName?: string;
  /** Styling for the wordmark fallback text. */
  wordmarkClassName?: string;
  /** Responsive `sizes` hint for the optimizer. */
  sizes?: string;
  priority?: boolean;
}

/**
 * Single source of truth for rendering a brand's mark. Give a brand a `logoUrl`
 * (in lib/data/brands.ts) and its real SVG/PNG logo renders — optimized,
 * responsive and lazy — everywhere this component is used (homepage grid, brand
 * pages, product attribution, navigation). Until a logo file is supplied, a
 * refined typographic wordmark of the brand name is shown instead, so the UI is
 * always complete and never shows a broken image. Adding logos is data-only.
 */
export function BrandLogo({
  name,
  logoUrl,
  className,
  imgClassName,
  wordmarkClassName,
  sizes,
  priority = false,
}: BrandLogoProps) {
  if (logoUrl) {
    const isSvg = logoUrl.toLowerCase().endsWith(".svg");
    return (
      <span className={cn("relative inline-flex items-center justify-center", className)}>
        <Image
          src={logoUrl}
          alt={name}
          fill
          sizes={sizes ?? "200px"}
          priority={priority}
          // SVGs are already vector-crisp and the optimizer skips them; raster
          // logos go through the pipeline (AVIF/WebP, responsive) as normal.
          unoptimized={isSvg}
          className={cn("object-contain", imgClassName)}
        />
      </span>
    );
  }

  return (
    <span
      className={cn(
        "inline-flex items-center justify-center text-center",
        wordmarkClassName,
      )}
    >
      {name}
    </span>
  );
}
