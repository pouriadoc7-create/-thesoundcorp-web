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
        <Reveal as="p" className="eyebrow">
          {eyebrow}
        </Reveal>
      ) : null}
      <Reveal
        as={titleAs}
        delayMs={eyebrow ? 80 : 0}
        className="mt-4 text-holo text-balance display-2 font-medium"
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
