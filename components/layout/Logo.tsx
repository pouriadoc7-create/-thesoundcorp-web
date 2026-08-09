import Image from "next/image";

import { Link } from "@/i18n/navigation";
import { SITE_NAME } from "@/lib/constants/site";
import { cn } from "@/lib/utils/cn";

interface LogoProps {
  className?: string;
  /** Overrides the default image height per breakpoint (set by the header). */
  imageClassName?: string;
  /** When the mobile nav opens, replays a subtle logo micro-reveal. */
  menuOpen?: boolean;
}

/**
 * The original approved brand mark (public/logo.png) — the yellow crescents and
 * "THE SOUND" wordmark on the black ground — rendered exactly as designed. No
 * outline, ring, or other overlay is applied.
 *
 * Motion (GPU-only transform/opacity, each plays once, all disabled under
 * prefers-reduced-motion — see the "Logo reveal" block in globals.css):
 *   - `.logo-reveal` — a cinematic fade + settle once on initial page load.
 *   - `.logo-sweep`  — one extremely subtle platinum light sweep just after it
 *      settles (a single reflection across brushed metal, then gone).
 *   - `[data-menu-open]` — a shorter micro-reveal replayed each time the mobile
 *      nav opens, timed to the drawer's own open animation.
 * The default heights below are the fallback; the header passes an
 * `imageClassName` that sets the real responsive size (30% larger than before).
 */
export function Logo({ className, imageClassName, menuOpen }: LogoProps) {
  return (
    <Link
      href="/"
      className={cn(
        "flex shrink-0 items-center rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60",
        className
      )}
    >
      <span
        className="logo-reveal relative inline-flex isolate"
        data-menu-open={menuOpen ? "true" : undefined}
      >
        <Image
          src="/logo.png"
          alt={SITE_NAME}
          width={1701}
          height={1701}
          priority
          className={cn(
            "logo-img block h-[44.2px] w-auto transition-transform duration-700 ease-[var(--ease-premium)] hover:scale-[1.03] md:h-[54.6px]",
            imageClassName
          )}
        />
        <span className="logo-sweep pointer-events-none absolute inset-0" aria-hidden="true" />
      </span>
    </Link>
  );
}
