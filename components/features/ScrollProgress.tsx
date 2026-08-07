"use client";

import { useEffect, useRef } from "react";

/**
 * A hairline gold reading-progress bar pinned to the very top of the viewport.
 * Updates via a single rAF-throttled scroll handler and writes straight to the
 * DOM (no per-frame React state) so it stays at 60fps and adds no re-renders.
 */
export function ScrollProgress() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      const doc = document.documentElement;
      const max = doc.scrollHeight - doc.clientHeight;
      const p = max > 0 ? Math.min(1, doc.scrollTop / max) : 0;
      el.style.transform = `scaleX(${p})`;
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
  }, []);

  return (
    <div
      aria-hidden="true"
      ref={ref}
      className="pointer-events-none fixed inset-x-0 top-0 z-[var(--z-toast)] h-0.5 origin-left bg-gradient-to-r from-[color:var(--color-gold-deep)] via-[color:var(--color-gold)] to-[color:var(--color-gold-soft)]"
      style={{ transform: "scaleX(0)", willChange: "transform" }}
    />
  );
}
