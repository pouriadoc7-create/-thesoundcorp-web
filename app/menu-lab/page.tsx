"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useState } from "react";

import { CONCEPTS, LAB_DATA } from "@/components/menu-lab/data";
import type { LabLocale } from "@/components/menu-lab/types";

/**
 * MENU LAB — a temporary, fully isolated design-exploration route.
 *
 * It lives outside app/[locale] (and is excluded from the i18n proxy matcher),
 * owns its own <html>/<body> via app/menu-lab/layout.tsx, and imports nothing
 * from the production header/nav. The live site's mobile menu is untouched.
 *
 * Concepts are code-split: only the one you open is downloaded.
 */
const CONCEPT_COMPONENTS = {
  strata: dynamic(() => import("@/components/menu-lab/concepts/ConceptStrata")),
  orbital: dynamic(() => import("@/components/menu-lab/concepts/ConceptOrbital")),
  editorial: dynamic(() => import("@/components/menu-lab/concepts/ConceptEditorial")),
  glass: dynamic(() => import("@/components/menu-lab/concepts/ConceptGlass")),
  acoustic: dynamic(() => import("@/components/menu-lab/concepts/ConceptAcoustic")),
  aperture: dynamic(() => import("@/components/menu-lab/concepts/ConceptAperture")),
} as const;

type ConceptId = keyof typeof CONCEPT_COMPONENTS;

export default function MenuLabPage() {
  const [active, setActive] = useState<ConceptId | null>(null);
  const [locale, setLocale] = useState<LabLocale>("en");
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduced(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  // Lock the page behind the stage (iOS-safe: position:fixed + scroll restore).
  useEffect(() => {
    if (!active) return;
    const y = window.scrollY;
    const b = document.body.style;
    const prev = { position: b.position, top: b.top, width: b.width, overflow: b.overflow };
    b.position = "fixed";
    b.top = `-${y}px`;
    b.width = "100%";
    b.overflow = "hidden";
    return () => {
      b.position = prev.position;
      b.top = prev.top;
      b.width = prev.width;
      b.overflow = prev.overflow;
      window.scrollTo(0, y);
    };
  }, [active]);

  const exit = useCallback(() => setActive(null), []);

  if (active) {
    const Concept = CONCEPT_COMPONENTS[active];
    return (
      <div className="mlab-stage">
        <Concept
          data={LAB_DATA}
          locale={locale}
          onLocaleChange={setLocale}
          onExit={exit}
          reduced={reduced}
        />
      </div>
    );
  }

  return (
    <main className="mlab-shell">
      <header className="mlab-head">
        <p className="mlab-eyebrow">TheSoundCorp · Design Exploration</p>
        <h1 className="mlab-title">Mobile Navigation Concepts</h1>
        <p className="mlab-sub">
          Six complete, independent navigation systems. Each is a working prototype — open it,
          use it, close it. Every concept carries the full site structure, the brands submenu,
          search and EN&nbsp;/&nbsp;فارسی.
        </p>
      </header>

      <div className="mlab-grid">
        {CONCEPTS.map((c) => (
          <button
            key={c.id}
            type="button"
            className="mlab-card"
            onClick={() => setActive(c.id as ConceptId)}
          >
            <span className="mlab-card-tag">{c.tagline}</span>
            <span className="mlab-card-num">CONCEPT {c.number}</span>
            <h2 className="mlab-card-title">{c.title.en}</h2>
            <p className="mlab-card-desc">{c.philosophy}</p>
          </button>
        ))}
      </div>

      <p className="mlab-foot">
        Nothing here touches the live site. The production mobile menu is unchanged.
      </p>
    </main>
  );
}
