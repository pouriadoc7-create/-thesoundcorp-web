import type { ReactNode } from "react";

import { Reveal } from "@/components/motion/Reveal";
import { cn } from "@/lib/utils/cn";

interface SectionHeaderProps {
  eyebrow?: string;
  title: string;
  description?: ReactNode;
  /** h1 for a page's primary heading, h2 for sub-sections. */
  titleAs?: "h1" | "h2";
  align?: "center" | "start";
  className?: string;
}

/**
 * The shared page/section heading: a gold eyebrow, a title, and an optional
 * lead paragraph — each with a staggered reveal. Replaces the eyebrow/title/
 * description block that was copy-pasted across products, gallery, brands and
 * the placeholder pages, so they can never drift apart.
 */
export function SectionHeader({
  eyebrow,
  title,
  description,
  titleAs = "h1",
  align = "center",
  className,
}: SectionHeaderProps) {
  const centered = align === "center";
  return (
    <div className={cn("flex flex-col", centered ? "items-center text-center" : "items-start", className)}>
      {eyebrow ? (
        <Reveal
          as="p"
          className="text-[10px] font-medium uppercase tracking-[0.24em] text-[color:var(--color-gold-soft)]/90 sm:text-[10.5px] xl:text-sm"
        >
          {eyebrow}
        </Reveal>
      ) : null}
      <Reveal
        as={titleAs}
        delayMs={eyebrow ? 80 : 0}
        className="mt-4 text-holo text-balance text-[22px] font-medium leading-[1.12] sm:text-[26px] lg:text-[30px] xl:text-[3.25rem]"
      >
        {title}
      </Reveal>
      {description ? (
        <Reveal
          as="p"
          delayMs={160}
          className={cn("mt-4 max-w-2xl text-[13.5px] leading-relaxed text-gray-400 sm:text-[14px] xl:text-lg", centered && "mx-auto")}
        >
          {description}
        </Reveal>
      ) : null}
    </div>
  );
}
