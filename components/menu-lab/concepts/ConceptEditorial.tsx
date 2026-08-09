"use client";

import "./conceptEditorial.css";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { MouseEvent as ReactMouseEvent, PointerEvent as ReactPointerEvent } from "react";

import type { ConceptProps, LabLocale } from "../types";

/**
 * CONCEPT 03 — CINEMATIC EDITORIAL
 *
 * No panel. The seven destinations are oversized editorial lines mapped onto a
 * vertical cylinder (rotateX per line under a shared perspective), like film
 * credits on a rotating drum or the wheel of a luxury watch. Only ~3 lines are
 * legible at once: the focused line is flat-on and sharp, its neighbours rotate
 * away, dim and take a small blur.
 *
 * Motion budget: transform/opacity/filter only, written straight to the DOM from
 * a SINGLE rAF loop (drag frames are applied inline, so the loop only runs for
 * inertia + snap). `will-change` is scoped to the spinning state.
 */

type Phase = "closed" | "opening" | "open" | "closing" | "confirm";
type Bars = "hidden" | "rest" | "shut";
type View = "nav" | "brands";
type Mode = "idle" | "drag" | "inertia" | "spring";

interface Phys {
  offset: number;
  vel: number;
  target: number;
  mode: Mode;
}

interface Drag {
  id: number;
  y0: number;
  o0: number;
  moved: boolean;
  lastY: number;
  lastT: number;
  vel: number;
}

/** Degrees between two lines on the drum. */
const STEP_DEG = 22;
/** Cylinder radius = (lineHeight / 2) / tan(STEP_DEG / 2). */
const RADIUS_K = 2.5723;
/** Android pays dearly for blurring huge glyphs — keep it small and rare. */
const MAX_BLUR = 6;
const FA_DIGITS = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"] as const;

function clamp(v: number, lo: number, hi: number): number {
  if (v < lo) return lo;
  if (v > hi) return hi;
  return v;
}

/** Two-figure editorial index, in the numerals of the active locale. */
function figure(n: number, locale: LabLocale): string {
  const s = String(n).padStart(2, "0");
  if (locale !== "fa") return s;
  return s.replace(/[0-9]/g, (d) => FA_DIGITS[Number(d)]);
}

/** Rubber-band resistance past the first / last line. */
function overshoot(v: number): number {
  return 0.85 * (1 - Math.exp(-v * 0.85));
}

function LangSwitch({
  locale,
  label,
  onLocaleChange,
}: {
  locale: LabLocale;
  label: string;
  onLocaleChange: (l: LabLocale) => void;
}) {
  return (
    <div className="ced-lang">
      <span className="ced-langlabel">{label}</span>
      <span className="ced-langset" role="group" aria-label={label}>
        <button
          type="button"
          className="ced-langbtn"
          data-on={locale === "en"}
          aria-pressed={locale === "en"}
          onClick={() => onLocaleChange("en")}
        >
          EN
        </button>
        <span className="ced-langsep" aria-hidden="true" />
        <button
          type="button"
          className="ced-langbtn ced-langbtn-fa"
          data-on={locale === "fa"}
          aria-pressed={locale === "fa"}
          onClick={() => onLocaleChange("fa")}
        >
          فارسی
        </button>
      </span>
    </div>
  );
}

export default function ConceptEditorial({
  data,
  locale,
  onLocaleChange,
  onExit,
  reduced,
}: ConceptProps) {
  const [phase, setPhase] = useState<Phase>("closed");
  const [bars, setBars] = useState<Bars>("hidden");
  const [view, setView] = useState<View>("nav");
  const [focus, setFocus] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [chosen, setChosen] = useState<string | null>(null);
  const [query, setQuery] = useState("");

  const rtl = locale === "fa";
  const navCount = data.nav.length;

  // --- refs ---------------------------------------------------------------
  const cylRef = useRef<HTMLElement | null>(null);
  const metricRef = useRef<HTMLSpanElement | null>(null);
  const stripRef = useRef<HTMLDivElement | null>(null);
  const linesRef = useRef<(HTMLAnchorElement | null)[]>([]);

  const physRef = useRef<Phys>({ offset: 0, vel: 0, target: 0, mode: "idle" });
  const dragRef = useRef<Drag | null>(null);
  const draggedRef = useRef(false);
  const frameRef = useRef<number | null>(null);
  const stepRef = useRef<() => void>(() => {});
  const lastTRef = useRef(0);
  const timersRef = useRef<number[]>([]);

  const radiusRef = useRef(180);
  const stepPxRef = useRef(70);
  const focusRef = useRef(0);
  const countRef = useRef(navCount);
  const phaseRef = useRef<Phase>("closed");
  const viewRef = useRef<View>("nav");

  useEffect(() => {
    countRef.current = navCount;
  }, [navCount]);
  useEffect(() => {
    phaseRef.current = phase;
    viewRef.current = view;
  }, [phase, view]);

  const after = useCallback((ms: number, fn: () => void) => {
    timersRef.current.push(window.setTimeout(fn, ms));
  }, []);

  const clearTimers = useCallback(() => {
    for (const id of timersRef.current) window.clearTimeout(id);
    timersRef.current = [];
  }, []);

  const stopMotion = useCallback(() => {
    if (frameRef.current !== null) {
      cancelAnimationFrame(frameRef.current);
      frameRef.current = null;
    }
  }, []);

  // --- the drum -----------------------------------------------------------
  const applyFrame = useCallback(() => {
    if (reduced) return;
    const r = radiusRef.current;
    const o = physRef.current.offset;

    const cyl = cylRef.current;
    if (cyl) cyl.style.transform = `translate3d(0, 0, ${(-r).toFixed(1)}px)`;

    const lines = linesRef.current;
    for (let i = 0; i < lines.length; i += 1) {
      const el = lines[i];
      if (!el) continue;
      const d = i - o;
      const ad = Math.abs(d);
      el.style.transform = `translateY(-50%) rotateX(${(-d * STEP_DEG).toFixed(2)}deg) translateZ(${r.toFixed(1)}px)`;
      const op = ad > 3.6 ? 0 : 1 / (1 + ad * ad * 1.55);
      el.style.opacity = op.toFixed(3);
      // Opacity + perspective carry the depth; blur is only a whisper on the
      // two rows either side of focus.
      el.style.filter =
        ad < 0.06 || op < 0.03 ? "none" : `blur(${Math.min(MAX_BLUR, ad * 1.85).toFixed(2)}px)`;
    }

    const next = clamp(Math.round(o), 0, Math.max(0, lines.length - 1));
    if (next !== focusRef.current) {
      focusRef.current = next;
      setFocus(next);
    }
  }, [reduced]);

  const step = useCallback(() => {
    const now = performance.now();
    const dt = clamp((now - lastTRef.current) / 1000, 0.001, 0.048);
    lastTRef.current = now;

    const p = physRef.current;
    const max = Math.max(0, countRef.current - 1);

    if (p.mode === "inertia") {
      p.offset += p.vel * dt;
      p.vel *= Math.pow(0.16, dt);
      if (p.offset < 0 || p.offset > max) p.vel *= Math.pow(1e-6, dt);
      if (Math.abs(p.vel) < 0.75) {
        p.mode = "spring";
        p.target = clamp(Math.round(p.offset + p.vel * 0.16), 0, max);
      }
    } else if (p.mode === "spring") {
      const k = 138;
      const c = 2 * Math.sqrt(k) * 0.95;
      p.vel += ((p.target - p.offset) * k - p.vel * c) * dt;
      p.offset += p.vel * dt;
      if (Math.abs(p.target - p.offset) < 0.0015 && Math.abs(p.vel) < 0.03) {
        p.offset = p.target;
        p.vel = 0;
        p.mode = "idle";
      }
    }

    applyFrame();

    if (p.mode === "inertia" || p.mode === "spring") {
      frameRef.current = requestAnimationFrame(() => stepRef.current());
    } else {
      frameRef.current = null;
      setSpinning(false);
    }
  }, [applyFrame]);

  useEffect(() => {
    stepRef.current = step;
  }, [step]);

  const startLoop = useCallback(() => {
    if (frameRef.current !== null) return;
    lastTRef.current = performance.now();
    setSpinning(true);
    frameRef.current = requestAnimationFrame(() => stepRef.current());
  }, []);

  const spinTo = useCallback(
    (i: number) => {
      const p = physRef.current;
      p.target = clamp(i, 0, Math.max(0, countRef.current - 1));
      p.mode = "spring";
      startLoop();
    },
    [startLoop],
  );

  /**
   * The line box drives both the drag ratio and the drum radius. A
   * ResizeObserver on the probe covers every case that can change it —
   * viewport resize, rotation, the iOS URL bar, a locale swap (the Persian
   * face runs a different size/leading ramp) and late webfont arrival.
   */
  useEffect(() => {
    const measure = () => {
      const m = metricRef.current;
      if (m) {
        const h = m.getBoundingClientRect().height;
        if (h > 8) {
          stepPxRef.current = h;
          radiusRef.current = h * RADIUS_K;
        }
      }
      applyFrame();
    };
    measure();

    const probe = metricRef.current;
    if (probe && typeof ResizeObserver !== "undefined") {
      const ro = new ResizeObserver(measure);
      ro.observe(probe);
      return () => ro.disconnect();
    }
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [applyFrame]);

  // Reduced motion can flip at runtime — drop any inline drum styling.
  useEffect(() => {
    if (!reduced) return;
    stopMotion();
    // Alias the ref array first (same pattern as applyFrame) so the elements are
    // plain locals when their inline styling is cleared.
    const lines = linesRef.current;
    for (let i = 0; i < lines.length; i += 1) {
      const el = lines[i];
      if (!el) continue;
      el.style.transform = "";
      el.style.opacity = "";
      el.style.filter = "";
    }
    const cyl = cylRef.current;
    if (cyl) cyl.style.transform = "";
  }, [reduced, stopMotion]);

  useEffect(
    () => () => {
      stopMotion();
      clearTimers();
    },
    [clearTimers, stopMotion],
  );

  // --- choreography -------------------------------------------------------
  const resetAll = useCallback(() => {
    clearTimers();
    stopMotion();
    const p = physRef.current;
    p.offset = 0;
    p.vel = 0;
    p.target = 0;
    p.mode = "idle";
    focusRef.current = 0;
    setFocus(0);
    setChosen(null);
    setQuery("");
    setView("nav");
    setBars("hidden");
    setPhase("closed");
    setSpinning(false);
    applyFrame();
  }, [applyFrame, clearTimers, stopMotion]);

  const openMenu = useCallback(() => {
    clearTimers();
    stopMotion();
    const p = physRef.current;
    p.vel = 0;
    p.mode = "idle";
    p.offset = reduced ? 0 : -2.35;
    applyFrame();
    setBars("rest");
    if (reduced) {
      setPhase("open");
      return;
    }
    setPhase("opening");
    // Bars sweep first, then the drum spins up and settles on Home.
    after(340, () => spinTo(0));
    after(1250, () => setPhase("open"));
  }, [after, applyFrame, clearTimers, reduced, spinTo, stopMotion]);

  const closeMenu = useCallback(() => {
    clearTimers();
    if (reduced) {
      resetAll();
      return;
    }
    setView("nav");
    setPhase("closing");
    // Reverse of the opening: the drum spins down, then the bars sweep back out.
    const p = physRef.current;
    p.mode = "spring";
    p.target = p.offset - 1.9;
    startLoop();
    after(300, () => setBars("hidden"));
    after(880, resetAll);
  }, [after, clearTimers, reduced, resetAll, startLoop]);

  const openBrands = useCallback(() => {
    const i = data.nav.findIndex((n) => n.key === "brands");
    if (i >= 0) {
      if (reduced) {
        physRef.current.offset = i;
        focusRef.current = i;
        setFocus(i);
      } else {
        spinTo(i);
      }
    }
    setView("brands");
  }, [data.nav, reduced, spinTo]);

  const closeBrands = useCallback(() => {
    setQuery("");
    setView("nav");
  }, []);

  const confirmChoice = useCallback(
    (key: string) => {
      clearTimers();
      stopMotion();
      setChosen(key);
      setPhase("confirm");
      if (reduced) {
        after(340, resetAll);
        return;
      }
      after(430, () => setBars("shut"));
      after(1120, resetAll);
    },
    [after, clearTimers, reduced, resetAll, stopMotion],
  );

  const activate = useCallback(
    (i: number) => {
      const item = data.nav[i];
      if (!item) return;
      if (item.key === "brands" && viewRef.current !== "brands") {
        openBrands();
        return;
      }
      confirmChoice(item.key);
    },
    [confirmChoice, data.nav, openBrands],
  );

  // --- pointer ------------------------------------------------------------
  const onPointerDown = useCallback(
    (e: ReactPointerEvent<HTMLDivElement>) => {
      if (reduced) return;
      if (phaseRef.current !== "open" && phaseRef.current !== "opening") return;
      if (viewRef.current !== "nav") return;

      e.currentTarget.setPointerCapture(e.pointerId);
      stopMotion();

      const m = metricRef.current;
      if (m) {
        const h = m.getBoundingClientRect().height;
        if (h > 8) {
          stepPxRef.current = h;
          radiusRef.current = h * RADIUS_K;
        }
      }

      const p = physRef.current;
      p.mode = "drag";
      p.vel = 0;
      draggedRef.current = false;
      dragRef.current = {
        id: e.pointerId,
        y0: e.clientY,
        o0: p.offset,
        moved: false,
        lastY: e.clientY,
        lastT: performance.now(),
        vel: 0,
      };
      setSpinning(true);
    },
    [reduced, stopMotion],
  );

  const onPointerMove = useCallback(
    (e: ReactPointerEvent<HTMLDivElement>) => {
      const d = dragRef.current;
      if (!d || d.id !== e.pointerId) return;

      const dy = e.clientY - d.y0;
      if (!d.moved && Math.abs(dy) > 4) d.moved = true;

      const max = Math.max(0, countRef.current - 1);
      const raw = d.o0 - dy / stepPxRef.current;
      physRef.current.offset =
        raw < 0 ? -overshoot(-raw) : raw > max ? max + overshoot(raw - max) : raw;

      const now = performance.now();
      const dt = (now - d.lastT) / 1000;
      if (dt > 0.008) {
        const v = -(e.clientY - d.lastY) / stepPxRef.current / dt;
        d.vel = d.vel * 0.6 + v * 0.4;
        d.lastY = e.clientY;
        d.lastT = now;
      }

      applyFrame();
    },
    [applyFrame],
  );

  const onPointerUp = useCallback(
    (e: ReactPointerEvent<HTMLDivElement>) => {
      const d = dragRef.current;
      if (!d || d.id !== e.pointerId) return;
      dragRef.current = null;
      draggedRef.current = d.moved;
      if (e.currentTarget.hasPointerCapture(e.pointerId)) {
        e.currentTarget.releasePointerCapture(e.pointerId);
      }

      const p = physRef.current;
      const max = Math.max(0, countRef.current - 1);
      if (!d.moved) {
        p.mode = "spring";
        p.target = clamp(Math.round(p.offset), 0, max);
        startLoop();
        return;
      }
      p.vel = clamp(d.vel, -8, 8);
      if (Math.abs(p.vel) > 0.9) {
        p.mode = "inertia";
      } else {
        p.mode = "spring";
        p.target = clamp(Math.round(p.offset), 0, max);
      }
      startLoop();
    },
    [startLoop],
  );

  const onLineClick = useCallback(
    (e: ReactMouseEvent<HTMLAnchorElement>, i: number) => {
      e.preventDefault();
      if (draggedRef.current) {
        draggedRef.current = false;
        return;
      }
      if (reduced) {
        activate(i);
        return;
      }
      if (i !== focusRef.current) {
        spinTo(i);
        return;
      }
      activate(i);
    },
    [activate, reduced, spinTo],
  );

  const onBrandClick = useCallback(
    (e: ReactMouseEvent<HTMLAnchorElement>, slug: string) => {
      e.preventDefault();
      confirmChoice(`brand:${slug}`);
    },
    [confirmChoice],
  );

  // Escape steps back one level, then closes.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      if (phaseRef.current === "closed" || phaseRef.current === "confirm") return;
      if (viewRef.current === "brands") closeBrands();
      else closeMenu();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [closeBrands, closeMenu]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return data.brands;
    return data.brands.filter(
      (b) => b.name.toLowerCase().includes(q) || b.slug.toLowerCase().includes(q),
    );
  }, [data.brands, query]);

  useEffect(() => {
    const strip = stripRef.current;
    if (strip) strip.scrollLeft = 0;
  }, [query]);

  const open = phase !== "closed";

  return (
    <div
      className="ced-root"
      dir={rtl ? "rtl" : "ltr"}
      lang={rtl ? "fa" : "en"}
      data-phase={phase}
      data-bars={bars}
      data-view={view}
      data-static={reduced ? "true" : "false"}
      data-spin={spinning ? "1" : "0"}
    >
      <button className="mlab-back" type="button" onClick={onExit}>
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M15 5 8 12l7 7"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        {data.copy.back[locale]}
      </button>

      {/* Letterbox shutter */}
      <div className="ced-bar ced-bar-top" aria-hidden="true" />
      <div className="ced-bar ced-bar-bot" aria-hidden="true" />

      <div className="ced-frame">
        {/* Line-box probe: same face, size and leading as a destination line. */}
        <span className="ced-metric" aria-hidden="true">
          M
        </span>

        <div
          className="ced-viewport"
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
        >
          <div className="ced-deck">
            <nav
              className="ced-cyl"
              ref={cylRef}
              aria-label={data.copy.menu[locale]}
              aria-hidden={!open}
            >
              {data.nav.map((item, i) => (
                <a
                  key={item.key}
                  href={item.href}
                  ref={(el) => {
                    linesRef.current[i] = el;
                  }}
                  className={`ced-line${i === focus ? " is-focus" : ""}${
                    chosen === item.key ? " is-chosen" : ""
                  }`}
                  aria-current={i === focus ? "true" : undefined}
                  onClick={(e) => onLineClick(e, i)}
                  onFocus={() => {
                    if (!reduced && viewRef.current === "nav" && i !== focusRef.current) spinTo(i);
                  }}
                >
                  <span className="ced-idx" aria-hidden="true">
                    {figure(i + 1, locale)}
                  </span>
                  <span className="ced-txt">{item.label[locale]}</span>
                  <span className="ced-rule" aria-hidden="true" />
                </a>
              ))}
            </nav>
          </div>
          <span className="ced-band" aria-hidden="true" />
        </div>

        <span className="ced-scrim" aria-hidden="true" />
        <span className="ced-vig ced-vig-top" aria-hidden="true" />
        <span className="ced-vig ced-vig-bot" aria-hidden="true" />

        {/* Brands filmstrip */}
        <section className="ced-sub" aria-label={data.copy.brands[locale]}>
          <div className="ced-subhead">
            <span className="ced-subtitle">
              {data.copy.brands[locale]}
              <span className="ced-subcount">{figure(filtered.length, locale)}</span>
            </span>
            <button type="button" className="ced-subclose" onClick={closeBrands}>
              {data.copy.close[locale]}
            </button>
          </div>

          <div className="ced-searchwrap">
            <svg className="ced-searchicon" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <circle cx="11" cy="11" r="6.4" stroke="currentColor" strokeWidth="1.3" />
              <path
                d="m16 16 4 4"
                stroke="currentColor"
                strokeWidth="1.3"
                strokeLinecap="round"
              />
            </svg>
            <input
              className="ced-search"
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={data.copy.search[locale]}
              aria-label={data.copy.search[locale]}
              autoComplete="off"
              autoCorrect="off"
              spellCheck={false}
              enterKeyHint="search"
            />
          </div>

          {filtered.length > 0 ? (
            <div className="ced-strip" ref={stripRef}>
              {filtered.map((brand, i) => (
                <a
                  key={brand.slug}
                  href={`/brands/${brand.slug}`}
                  className={`ced-cell${chosen === `brand:${brand.slug}` ? " is-chosen" : ""}`}
                  onClick={(e) => onBrandClick(e, brand.slug)}
                >
                  <span className="ced-cellnum" aria-hidden="true">
                    {figure(i + 1, locale)}
                  </span>
                  <span className="ced-cellname">{brand.name}</span>
                  <span className="ced-cellrule" aria-hidden="true" />
                </a>
              ))}
            </div>
          ) : (
            <p className="ced-empty">{data.copy.noResults[locale]}</p>
          )}
        </section>

        {/* Trigger (closed state) */}
        <div className="ced-triggerwrap">
          <p className="ced-kicker">The Sound Corp</p>
          <button
            type="button"
            className="ced-trigger"
            onClick={openMenu}
            aria-expanded={open}
            aria-label={data.copy.menu[locale]}
          >
            <span className="ced-reel" aria-hidden="true">
              <span className="ced-reelbar" />
              <span className="ced-reelbar" />
              <span className="ced-reelbar" />
            </span>
            <span className="ced-triggerword">{data.copy.menu[locale]}</span>
            <span className="ced-triggerrule" aria-hidden="true" />
            <span className="ced-triggermeta" aria-hidden="true">
              {figure(1, locale)}
              <span className="ced-dash">—</span>
              {figure(navCount, locale)}
            </span>
          </button>
          <LangSwitch
            locale={locale}
            label={data.copy.language[locale]}
            onLocaleChange={onLocaleChange}
          />
        </div>
      </div>

      {/* Letterbox chrome — rides the rest position of the bars, never the shutter. */}
      <div className="ced-chrome ced-chrome-top">
        <button type="button" className="ced-close" onClick={closeMenu}>
          <span className="ced-closemark" aria-hidden="true" />
          {data.copy.close[locale]}
        </button>
      </div>
      <div className="ced-chrome ced-chrome-bot">
        <span className="ced-mark">The Sound Corp</span>
        <LangSwitch
          locale={locale}
          label={data.copy.language[locale]}
          onLocaleChange={onLocaleChange}
        />
      </div>
    </div>
  );
}
