import type { ReactNode } from "react";

import { cn } from "@/lib/utils/cn";

interface BadgeProps {
  children: ReactNode;
  tone?: "default" | "gold";
  className?: string;
}

/** Small uppercase label for categories, statuses and metadata chips. */
export function Badge({ children, tone = "default", className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.16em]",
        tone === "gold"
          ? "border-[color:var(--color-gold)]/40 text-[color:var(--color-gold-soft)]"
          : "border-white/15 text-zinc-400",
        className
      )}
    >
      {children}
    </span>
  );
}
