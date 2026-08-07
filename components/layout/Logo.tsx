import Image from "next/image";

import { Link } from "@/i18n/navigation";
import { SITE_NAME } from "@/lib/constants/site";
import { cn } from "@/lib/utils/cn";

interface LogoProps {
  className?: string;
  /** Overrides the default image height per breakpoint (set by the header). */
  imageClassName?: string;
}

/**
 * The logo mark is a crisp vector (public/logo.svg) — a faithful vectorisation
 * of the brand mark in its exact brand colours (gold #f0b000, "THE" #f0f0f0),
 * so it stays razor-sharp at any size / DPI while preserving the original's
 * proportions and transparent background. `unoptimized` serves the SVG straight
 * from /public (the image optimiser blocks SVGs by default) — no layout change.
 *
 * A very thin white bezel is added purely as a decorative overlay — centred on
 * the mark's visible content (which sits ~55%/50% within the square, with
 * generous transparent margins) at 80% diameter, so the ring hugs the logo with
 * an elegant, almost-invisible gap like a luxury watch bezel. Being absolutely
 * positioned, it changes neither the logo's size nor its position; it scales
 * with the logo on scroll and hover because it's a fraction of the wrapper.
 */
export function Logo({ className, imageClassName }: LogoProps) {
  return (
    <Link
      href="/"
      className={cn(
        "flex shrink-0 items-center rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60",
        className
      )}
    >
      <span className="relative inline-flex transition-transform duration-700 ease-[var(--ease-premium)] hover:scale-[1.03]">
        <Image
          src="/logo.svg"
          alt={SITE_NAME}
          width={1701}
          height={1701}
          priority
          unoptimized
          className={cn("h-[34px] w-auto md:h-[42px]", imageClassName)}
        />
        <span
          aria-hidden="true"
          className="pointer-events-none absolute aspect-square -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/[0.8]"
          style={{ height: "80%", left: "55%", top: "50%" }}
        />
      </span>
    </Link>
  );
}
