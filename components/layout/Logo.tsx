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
 * The original approved brand mark (public/logo.png) — the yellow crescents and
 * "THE SOUND" wordmark on the black ground — rendered exactly as designed. No
 * outline, ring, or other overlay is applied.
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
      <Image
        src="/logo.png"
        alt={SITE_NAME}
        width={1701}
        height={1701}
        priority
        className={cn(
          "h-[34px] w-auto transition-transform duration-700 ease-[var(--ease-premium)] hover:scale-[1.03] md:h-[42px]",
          imageClassName
        )}
      />
    </Link>
  );
}
