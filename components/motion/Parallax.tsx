"use client";

import { useEffect, useRef, type ReactNode } from "react";

interface ParallaxProps {
  children: ReactNode;
  className?: string;
  /** Fraction of the element's distance-from-centre to translate. Keep small
   *  (0.05–0.2) for a soft, tasteful drift rather than an obvious slide. */
  speed?: number;
}

/**
 * Soft, GPU-friendly parallax: translates its content vertically in proportion
 * to how far the element sits from the viewport centre, updated on scroll via a
 * single rAF-throttled handler. Inert under prefers-reduced-motion.
 */
export function Parallax({ children, className, speed = 0.12 }: ParallaxProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let raf = 0;
    const update = () => {
      raf = 0;
      const rect = el.getBoundingClientRect();
      const fromCentre = rect.top + rect.height / 2 - window.innerHeight / 2;
      el.style.transform = `translate3d(0, ${(-fromCentre * speed).toFixed(2)}px, 0)`;
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [speed]);

  return (
    <div ref={ref} className={className} style={{ willChange: "transform" }}>
      {children}
    </div>
  );
}
