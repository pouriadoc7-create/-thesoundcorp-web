"use client";

import "./conceptStrata.css";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { CSSProperties, MouseEvent as ReactMouseEvent, PointerEvent as ReactPointerEvent } from "react";

import type { ConceptProps, LabLocale } from "../types";

/**
 * CONCEPT 01 — HOLOGRAPHIC STRATA
 *
 * The menu is not a panel: it is a stack of thin glass sheets suspended at
 * different depths inside one perspective. Opening ASSEMBLES the stack (sheets
 * arrive from deep z, staggered, resolving from blur with a chromatic edge
 * flare); closing runs the same choreography in reverse, last sheet first.
 *
 * The user drags vertically to travel through the stack. Parallax is real, not
 * simulated: every sheet is placed with translateZ inside a `perspective`
 * container, so near sheets sweep further across the screen than far ones and
 * scale/vignette fall out of the projection.
 *
 * Rendering contract (performance):
 *   ONE rAF loop, started on interaction and self-cancelling when the stack
 *   settles. It writes four custom properties per sheet — --t (transform),
 *   --o (opacity), --f (focus 0..1), --b (defocus blur) — and one --cst-sheen
 *   on the root. Everything the CSS does is expressed in terms of those four,
 *   including the keyframes, so an animation that is still playing while the
 *   user drags keeps tracking the live geometry. Nothing else is animated.
 */

type Phase = "closed" | "open" | "closing";

/** Depth unit (px) applied along the compressed distance curve. */
const DEPTH = 152;
/** Max sheet tilt in degrees — enough to read as a physical plane, not a wall. */
const TILT = 3.2;
const DEFAULT_STEP = 74;

const CLOSE_MS = 500;
const CHOOSE_MS = 620;
const BRANDS_CLOSE_MS = 390;
const PICK_MS = 540;

const HINT: Record<LabLocale, string> = {
  en: "Drag to travel the strata",
  fa: "برای حرکت میان لایه‌ها بکشید",
};

const clamp = (v: number, lo: number, hi: number) => (v < lo ? lo : v > hi ? hi : v);

/**
 * Resting geometry of a sheet, given its signed distance `p` from the focus
 * depth. Both offsets use a hyperbolic compression so the far end of the stack
 * converges toward a horizon instead of marching off-screen.
 */
function geometry(p: number, step: number) {
  const a = Math.abs(p);
  const y = Math.sign(p) * (a / (1 + 0.14 * a)) * step;
  const z = -(a / (1 + 0.3 * a)) * DEPTH;
  const rx = clamp(-p * TILT, -12, 12);
  return {
    t: `translate3d(0,${y.toFixed(2)}px,${z.toFixed(2)}px) rotateX(${rx.toFixed(2)}deg)`,
    o: clamp(1 - 0.28 * Math.pow(a, 0.9), 0.18, 1).toFixed(3),
    f: Math.max(0, 1 - a * 1.15).toFixed(3),
    // quantised so the (small, text-only) blur does not repaint every frame
    b: `${(Math.round(Math.min(2.4, a * 0.95) * 4) / 4).toFixed(2)}px`,
  };
}

export default function ConceptStrata({
  data,
  locale,
  onLocaleChange,
  onExit,
  reduced,
}: ConceptProps) {
  const { nav, brands, copy } = data;
  const count = nav.length;
  const lastIndex = count - 1;
  const rtl = locale === "fa";

  const [phase, setPhase] = useState<Phase>("closed");
  const [brandsPhase, setBrandsPhase] = useState<Phase>("closed");
  const [chosen, setChosen] = useState<string | null>(null);
  const [picked, setPicked] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [showHint, setShowHint] = useState(true);

  const rootRef = useRef<HTMLDivElement | null>(null);
  const planeRefs = useRef<(HTMLDivElement | null)[]>([]);
  const cacheRef = useRef<{ t: string; o: string; f: string; b: string }[]>([]);

  const focusRef = useRef(0);
  const targetRef = useRef(0);
  const stepRef = useRef(DEFAULT_STEP);
  const sheenRef = useRef(0);

  const rafRef = useRef<number | null>(null);
  const lastTimeRef = useRef(0);

  const draggingRef = useRef(false);
  const pointerIdRef = useRef<number | null>(null);
  const startYRef = useRef(0);
  const startFocusRef = useRef(0);
  const velocityRef = useRef(0);
  const lastMoveRef = useRef({ y: 0, t: 0 });
  const suppressClickRef = useRef(false);

  const timersRef = useRef<Set<number>>(new Set());

  const after = useCallback((ms: number, fn: () => void) => {
    const id = window.setTimeout(() => {
      timersRef.current.delete(id);
      fn();
    }, ms);
    timersRef.current.add(id);
  }, []);

  useEffect(() => {
    const timers = timersRef.current;
    return () => {
      timers.forEach((id) => window.clearTimeout(id));
      timers.clear();
    };
  }, []);

  /* --- the single write pass ---------------------------------------------- */
  const paint = useCallback(() => {
    const step = stepRef.current;
    const f = focusRef.current;
    const cache = cacheRef.current;

    for (let i = 0; i < count; i += 1) {
      const el = planeRefs.current[i];
      if (!el) continue;
      const g = geometry(i - f, step);
      let c = cache[i];
      if (!c) {
        c = { t: "", o: "", f: "", b: "" };
        cache[i] = c;
      }
      if (c.t !== g.t) {
        el.style.setProperty("--t", g.t);
        c.t = g.t;
      }
      if (c.o !== g.o) {
        el.style.setProperty("--o", g.o);
        c.o = g.o;
      }
      if (c.f !== g.f) {
        el.style.setProperty("--f", g.f);
        c.f = g.f;
      }
      if (c.b !== g.b) {
        el.style.setProperty("--b", g.b);
        c.b = g.b;
      }
    }

    // Sheen travels with the stack — transform only, so it stays compositor-side.
    const sheen = Math.round((f - lastIndex / 2) * -14);
    if (sheen !== sheenRef.current) {
      sheenRef.current = sheen;
      rootRef.current?.style.setProperty("--cst-sheen", `${sheen}px`);
    }
  }, [count, lastIndex]);

  /* --- the single rAF loop ------------------------------------------------- */
  const startLoop = useCallback(() => {
    if (rafRef.current !== null) return;
    const root = rootRef.current;
    if (root) root.dataset.live = "true";
    lastTimeRef.current = performance.now();

    const tick = (now: number) => {
      const dt = clamp(now - lastTimeRef.current, 1, 64);
      lastTimeRef.current = now;

      if (!draggingRef.current) {
        const d = targetRef.current - focusRef.current;
        if (Math.abs(d) < 0.0008) {
          focusRef.current = targetRef.current;
          paint();
          rafRef.current = null;
          if (root) delete root.dataset.live;
          return;
        }
        focusRef.current += d * (1 - Math.exp(-dt / 96));
      }

      paint();
      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
  }, [paint]);

  useEffect(() => {
    const raf = rafRef;
    return () => {
      if (raf.current !== null) {
        cancelAnimationFrame(raf.current);
        raf.current = null;
      }
    };
  }, []);

  const goTo = useCallback(
    (index: number) => {
      targetRef.current = clamp(index, 0, lastIndex);
      if (reduced) {
        focusRef.current = targetRef.current;
        paint();
        return;
      }
      startLoop();
    },
    [lastIndex, paint, reduced, startLoop],
  );

  /* --- viewport-derived step ---------------------------------------------- */
  useEffect(() => {
    const measure = () => {
      const h = window.innerHeight || 700;
      stepRef.current = clamp(h * 0.104, 62, 88);
      paint();
    };
    measure();
    window.addEventListener("resize", measure, { passive: true });
    window.addEventListener("orientationchange", measure);
    return () => {
      window.removeEventListener("resize", measure);
      window.removeEventListener("orientationchange", measure);
    };
  }, [paint]);

  // Place the sheets the moment the deck mounts (before the assemble settles).
  useEffect(() => {
    if (phase === "closed") return;
    paint();
  }, [phase, paint]);

  /* --- open / close -------------------------------------------------------- */
  const resetStack = useCallback(() => {
    focusRef.current = 0;
    targetRef.current = 0;
    cacheRef.current = [];
    planeRefs.current = [];
    sheenRef.current = 0;
  }, []);

  const openMenu = useCallback(() => {
    resetStack();
    setChosen(null);
    setPicked(null);
    setQuery("");
    setShowHint(true);
    setPhase("open");
  }, [resetStack]);

  const closeMenu = useCallback(() => {
    setBrandsPhase((b) => (b === "closed" ? "closed" : "closing"));
    setPhase("closing");
    after(reduced ? 0 : CLOSE_MS, () => {
      setPhase("closed");
      setBrandsPhase("closed");
      setChosen(null);
      setPicked(null);
      setQuery("");
      resetStack();
    });
  }, [after, reduced, resetStack]);

  const openBrands = useCallback(() => {
    setQuery("");
    setPicked(null);
    setBrandsPhase("open");
  }, []);

  const closeBrands = useCallback(() => {
    setBrandsPhase("closing");
    after(reduced ? 0 : BRANDS_CLOSE_MS, () => {
      setBrandsPhase("closed");
      setPicked(null);
      setQuery("");
    });
  }, [after, reduced]);

  const onTrigger = useCallback(() => {
    if (phase === "closed") {
      openMenu();
      return;
    }
    if (brandsPhase === "open") {
      closeBrands();
      return;
    }
    closeMenu();
  }, [brandsPhase, closeBrands, closeMenu, openMenu, phase]);

  useEffect(() => {
    if (phase === "closed") return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      if (brandsPhase === "open") closeBrands();
      else closeMenu();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [brandsPhase, closeBrands, closeMenu, phase]);

  /* --- drag ---------------------------------------------------------------- */
  const onPointerDown = (e: ReactPointerEvent<HTMLElement>) => {
    if (brandsPhase !== "closed" || chosen) return;
    suppressClickRef.current = false;
    pointerIdRef.current = e.pointerId;
    startYRef.current = e.clientY;
    startFocusRef.current = focusRef.current;
    velocityRef.current = 0;
    draggingRef.current = false;
    lastMoveRef.current = { y: e.clientY, t: performance.now() };
  };

  const onPointerMove = (e: ReactPointerEvent<HTMLElement>) => {
    if (pointerIdRef.current !== e.pointerId) return;
    const dy = e.clientY - startYRef.current;

    if (!draggingRef.current) {
      if (Math.abs(dy) < 7) return;
      draggingRef.current = true;
      setShowHint(false);
      e.currentTarget.setPointerCapture(e.pointerId);
      rootRef.current?.setAttribute("data-drag", "true");
      startLoop();
    }

    const unit = stepRef.current * 0.92;
    let next = startFocusRef.current - dy / unit;
    if (next < 0) next *= 0.34;
    else if (next > lastIndex) next = lastIndex + (next - lastIndex) * 0.34;
    focusRef.current = next;
    targetRef.current = next;

    const now = performance.now();
    const dt = now - lastMoveRef.current.t;
    if (dt > 4) {
      const dIndex = -(e.clientY - lastMoveRef.current.y) / unit;
      velocityRef.current = velocityRef.current * 0.7 + (dIndex / dt) * 0.3;
      lastMoveRef.current = { y: e.clientY, t: now };
    }
  };

  const endDrag = (e: ReactPointerEvent<HTMLElement>) => {
    if (pointerIdRef.current !== e.pointerId) return;
    pointerIdRef.current = null;
    if (!draggingRef.current) return;
    draggingRef.current = false;
    suppressClickRef.current = true;

    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
    rootRef.current?.removeAttribute("data-drag");

    const from = focusRef.current;
    const projected = clamp(from + velocityRef.current * 130, from - 2.2, from + 2.2);
    targetRef.current = clamp(Math.round(projected), 0, lastIndex);
    if (reduced) focusRef.current = targetRef.current;
    startLoop();
  };

  /* --- selection ----------------------------------------------------------- */
  const onItemClick = (e: ReactMouseEvent<HTMLAnchorElement>, index: number) => {
    // The lab never navigates.
    e.preventDefault();
    if (suppressClickRef.current) {
      suppressClickRef.current = false;
      return;
    }
    if (chosen) return;

    setShowHint(false);

    const focused = Math.round(focusRef.current);
    if (index !== focused) {
      goTo(index);
      return;
    }

    const item = nav[index];
    if (item.key === "brands") {
      openBrands();
      return;
    }

    setChosen(item.key);
    after(reduced ? 0 : CHOOSE_MS, () => {
      setPhase("closed");
      setChosen(null);
      setBrandsPhase("closed");
      resetStack();
    });
  };

  const onBrandClick = (e: ReactMouseEvent<HTMLAnchorElement>, slug: string) => {
    e.preventDefault();
    if (picked) return;
    setPicked(slug);
    after(reduced ? 0 : PICK_MS, closeMenu);
  };

  /* --- brands filter ------------------------------------------------------- */
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return brands;
    return brands.filter((b) => b.name.toLowerCase().includes(q) || b.slug.includes(q));
  }, [brands, query]);

  const open = phase !== "closed";

  return (
    <div
      ref={rootRef}
      className="cst-root"
      dir={rtl ? "rtl" : "ltr"}
      data-reduced={reduced ? "true" : "false"}
    >
      <div className="cst-atmos" aria-hidden="true" />

      <button type="button" className="mlab-back" onClick={onExit}>
        <svg viewBox="0 0 12 12" fill="none" aria-hidden="true">
          <path
            d="M7.6 1.6 3.2 6l4.4 4.4"
            stroke="currentColor"
            strokeWidth="1.25"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        {copy.back[locale]}
      </button>

      <div className="cst-lang" role="group" aria-label={copy.language[locale]}>
        <button
          type="button"
          className="cst-lang-btn"
          data-active={locale === "en"}
          aria-pressed={locale === "en"}
          onClick={() => onLocaleChange("en")}
        >
          EN
        </button>
        <span className="cst-lang-sep" aria-hidden="true" />
        <button
          type="button"
          className="cst-lang-btn cst-lang-fa"
          data-active={locale === "fa"}
          aria-pressed={locale === "fa"}
          onClick={() => onLocaleChange("fa")}
        >
          فارسی
        </button>
      </div>

      {/* Closed state — the strata mark, seen edge-on. */}
      <div className="cst-idle" data-hidden={open} aria-hidden={open}>
        <div className="cst-mark" aria-hidden="true">
          <span className="cst-mark-gold" />
          <span className="cst-mark-stack">
            <span className="cst-mark-ln" />
            <span className="cst-mark-ln" />
            <span className="cst-mark-ln" />
            <span className="cst-mark-ln" />
            <span className="cst-mark-ln" />
          </span>
        </div>
        <p className="cst-idle-word" dir="ltr">
          The Sound Corp
        </p>
      </div>

      {open && (
        <div
          className="cst-deck"
          id="cst-deck"
          data-phase={phase}
          data-pushed={brandsPhase !== "closed"}
          data-chosen={chosen ? "true" : "false"}
        >
          <div className="cst-marks" aria-hidden="true">
            <span className="cst-marks-tick" />
            <span className="cst-marks-tick" />
          </div>

          <nav
            className="cst-stack"
            aria-label={copy.menu[locale]}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={endDrag}
            onPointerCancel={endDrag}
          >
            {nav.map((item, i) => {
              const g = geometry(i, DEFAULT_STEP);
              const isBrands = item.key === "brands";
              return (
                <div
                  key={item.key}
                  className="cst-plane"
                  style={
                    {
                      "--i": String(i),
                      "--r": String(lastIndex - i),
                    } as CSSProperties
                  }
                >
                  <div
                    className="cst-plane-inner"
                    ref={(el) => {
                      planeRefs.current[i] = el;
                    }}
                    data-state={chosen ? (chosen === item.key ? "chosen" : "away") : "rest"}
                    style={
                      {
                        "--t": g.t,
                        "--o": g.o,
                        "--f": g.f,
                        "--b": g.b,
                      } as CSSProperties
                    }
                  >
                    <a
                      className="cst-plane-face"
                      href={item.href}
                      draggable={false}
                      tabIndex={brandsPhase === "closed" ? 0 : -1}
                      aria-haspopup={isBrands ? "true" : undefined}
                      aria-expanded={isBrands ? brandsPhase !== "closed" : undefined}
                      onClick={(e) => onItemClick(e, i)}
                    >
                      <span className="cst-sheet" aria-hidden="true">
                        <span className="cst-sheet-lit" />
                        <span className="cst-sheen" />
                        <span className="cst-edge" />
                      </span>
                      <span className="cst-rule" aria-hidden="true" />
                      <span className="cst-idx" aria-hidden="true">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="cst-label">{item.label[locale]}</span>
                      {isBrands && (
                        <span className="cst-chev" aria-hidden="true">
                          <svg viewBox="0 0 12 12" fill="none">
                            <path
                              d="M4.4 1.6 8.8 6l-4.4 4.4"
                              stroke="currentColor"
                              strokeWidth="1.25"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </span>
                      )}
                    </a>
                  </div>
                </div>
              );
            })}
          </nav>

          <p className="cst-hint" data-hidden={!showHint} aria-hidden="true">
            {HINT[locale]}
          </p>
        </div>
      )}

      {brandsPhase !== "closed" && (
        <>
          <div className="cst-scrim" data-phase={brandsPhase} aria-hidden="true" />
          <section className="cst-brands" data-phase={brandsPhase} aria-label={copy.brands[locale]}>
            <div className="cst-brands-sheet">
              <span className="cst-panel-edge" aria-hidden="true" />
              <span className="cst-panel-sheen" aria-hidden="true" />

              <header className="cst-brands-head">
                <div className="cst-brands-row">
                  <h2 className="cst-brands-title">{copy.brands[locale]}</h2>
                  <span className="cst-count">{filtered.length}</span>
                  <button
                    type="button"
                    className="cst-brands-close"
                    onClick={closeBrands}
                    aria-label={copy.close[locale]}
                  >
                    <svg viewBox="0 0 14 14" fill="none" aria-hidden="true">
                      <path
                        d="M2.6 2.6 11.4 11.4M11.4 2.6 2.6 11.4"
                        stroke="currentColor"
                        strokeWidth="1.25"
                        strokeLinecap="round"
                      />
                    </svg>
                  </button>
                </div>

                <div className="cst-search">
                  <svg className="cst-search-icon" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                    <circle cx="6.2" cy="6.2" r="4.2" stroke="currentColor" strokeWidth="1.2" />
                    <path
                      d="M9.4 9.4 12.4 12.4"
                      stroke="currentColor"
                      strokeWidth="1.2"
                      strokeLinecap="round"
                    />
                  </svg>
                  <input
                    className="cst-search-input"
                    type="search"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder={copy.search[locale]}
                    aria-label={copy.search[locale]}
                    autoComplete="off"
                    autoCorrect="off"
                    autoCapitalize="none"
                    spellCheck={false}
                    enterKeyHint="search"
                  />
                </div>
              </header>

              <div className="cst-brands-scroll">
                {filtered.length === 0 ? (
                  <p className="cst-empty">{copy.noResults[locale]}</p>
                ) : (
                  <div className="cst-brands-grid" data-picking={picked ? "true" : "false"}>
                    {filtered.map((brand, i) => (
                      <a
                        key={brand.slug}
                        className={picked === brand.slug ? "cst-brand is-picked" : "cst-brand"}
                        href={`/brands/${brand.slug}`}
                        draggable={false}
                        onClick={(e) => onBrandClick(e, brand.slug)}
                        style={
                          {
                            "--cst-d": `${Math.min(i, 11) * 22}ms`,
                          } as CSSProperties
                        }
                      >
                        <span className="cst-brand-name">{brand.name}</span>
                      </a>
                    ))}
                  </div>
                )}
              </div>

              <div className="cst-brands-fade" aria-hidden="true" />
            </div>
          </section>
        </>
      )}

      <div className="cst-trigger-dock">
        <button
          type="button"
          className="cst-trigger"
          data-open={open}
          aria-expanded={open}
          aria-controls="cst-deck"
          onClick={onTrigger}
        >
          <span className="cst-trigger-glyph" aria-hidden="true">
            <span className="cst-tl" />
            <span className="cst-tl" />
            <span className="cst-tl" />
          </span>
          <span className="cst-trigger-label">
            {open ? copy.close[locale] : copy.menu[locale]}
          </span>
        </button>
      </div>
    </div>
  );
}
