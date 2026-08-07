"use client";

import { useEffect, useRef, useState, type CSSProperties, type ElementType, type ReactNode } from "react";

import { cn } from "@/lib/utils/cn";

interface RevealProps {
  children: ReactNode;
  /** Element to render (h1, p, div, li…). Defaults to div. */
  as?: ElementType;
  className?: string;
  /** Stagger delay in ms for cascading neighbours. */
  delayMs?: number;
  /** Cinematic blur-to-sharp entrance instead of the default fade-up. */
  blur?: boolean;
}

/**
 * Fade-up-on-scroll primitive. React owns the `is-visible` class via state, so
 * the hidden→shown flip happens strictly AFTER hydration — no classList race,
 * no hydration mismatch (SSR and the first client render both omit it). Content
 * already in view reveals on mount; the rest reveals when scrolled into view.
 * Honours prefers-reduced-motion and degrades to instantly-visible without an
 * IntersectionObserver. Motion itself is disabled in CSS under reduced-motion.
 */
export function Reveal({ children, as: Tag = "div", className, delayMs = 0, blur = false }: RevealProps) {
  const ref = useRef<HTMLElement | null>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Defer the reveal to the next frame rather than setting state synchronously
    // in the effect body — same imperceptible timing, no cascading-render warning,
    // and it lets the hidden initial state paint first so the transition plays.
    let raf = 0;
    const reveal = () => {
      raf = requestAnimationFrame(() => setShown(true));
    };

    if (
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      !("IntersectionObserver" in window)
    ) {
      reveal();
      return () => cancelAnimationFrame(raf);
    }

    // Already in view on mount → reveal now (still animates from hidden state).
    const rect = el.getBoundingClientRect();
    const vh = window.innerHeight || document.documentElement.clientHeight;
    if (rect.top < vh * 0.92 && rect.bottom > 0) {
      reveal();
      return () => cancelAnimationFrame(raf);
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setShown(true);
            io.disconnect();
          }
        }
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.12 }
    );
    io.observe(el);
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
    };
  }, []);

  const style = delayMs ? ({ "--reveal-delay": `${delayMs}ms` } as CSSProperties) : undefined;
  const attr = blur ? { "data-reveal-blur": "" } : { "data-reveal": "" };

  return (
    <Tag ref={ref as never} {...attr} className={cn(shown && "is-visible", className)} style={style}>
      {children}
    </Tag>
  );
}
