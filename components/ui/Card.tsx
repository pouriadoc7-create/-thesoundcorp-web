import type { ElementType, ReactNode } from "react";

import { cn } from "@/lib/utils/cn";

interface CardProps {
  children: ReactNode;
  as?: ElementType;
  /** Adds the luxe lift-on-hover treatment (for links/buttons). */
  interactive?: boolean;
  className?: string;
}

/**
 * The shared elevated surface: matte glass panel, hairline border, panel
 * radius. `interactive` adds the luxury lift/shadow on hover. Everything that
 * reads as a "card" should build on this so borders, radius and depth match.
 */
export function Card({ children, as: Tag = "div", interactive = false, className }: CardProps) {
  return (
    <Tag
      className={cn(
        "rounded-[var(--radius-panel)] border border-white/[0.08] bg-white/[0.02]",
        interactive && "card-lux",
        className
      )}
    >
      {children}
    </Tag>
  );
}
