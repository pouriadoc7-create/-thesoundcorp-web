"use client";

import { useRef, type ReactNode } from "react";

import { cn } from "@/lib/utils/cn";

interface MagneticButtonProps {
  children: ReactNode;
  className?: string;
  /** How strongly the element is pulled toward the cursor (0–0.4 is tasteful). */
  strength?: number;
}

/**
 * Wraps a control so it drifts gently toward the cursor on hover, then eases
 * back on leave — a subtle "magnetic" pull. Disabled on touch/coarse pointers
 * and under prefers-reduced-motion. Transform-only, so it stays on the GPU.
 */
export function MagneticButton({ children, className, strength = 0.28 }: MagneticButtonProps) {
  const ref = useRef<HTMLDivElement>(null);

  const onMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    if (
      window.matchMedia("(pointer: coarse)").matches ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    )
      return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - (r.left + r.width / 2)) * strength;
    const y = (e.clientY - (r.top + r.height / 2)) * strength;
    el.style.transform = `translate(${x.toFixed(1)}px, ${y.toFixed(1)}px)`;
  };

  const reset = () => {
    const el = ref.current;
    if (el) el.style.transform = "";
  };

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={reset}
      className={cn(
        "inline-block will-change-transform transition-transform duration-300 ease-[var(--ease-premium)]",
        className
      )}
    >
      {children}
    </div>
  );
}
