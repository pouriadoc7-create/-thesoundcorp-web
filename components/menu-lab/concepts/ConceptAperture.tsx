"use client";

import "./conceptAperture.css";

import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent as ReactKeyboardEvent,
  type MouseEvent as ReactMouseEvent,
  type PointerEvent as ReactPointerEvent,
} from "react";

import type { ConceptProps } from "../types";

/* ==========================================================================
   CONCEPT 06 — SPATIAL APERTURE
   --------------------------------------------------------------------------
   The screen is a lens.

   · CLOSED  an 8-blade iris sits shut across the frame — it IS the trigger.
   · OPEN    the blades hinge out (rotate about a pivot on the housing circle
             + slide along their own radius) and reveal the FOCUS PLANE: the
             destinations sit at different virtual depths on the optical axis.
   · FOCUS   a knurled ring at the bottom is dragged horizontally, with
             detents. Scrubbing racks focus through the depth stack; the
             destination at the focal plane resolves sharp while everything
             nearer/farther falls off along a circle-of-confusion curve
             (scale + opacity + a small, capped blur).
   · SELECT  the aperture stops down, the AF bracket snaps hard and gold,
             then the iris shuts — the exact reverse of the opening.
   · BRANDS  confirming Brands drops into a MACRO field: 26 brands as a
             depth-sorted cloud at very shallow depth of field, scrubbed by
             the same ring, reduced live by search.

   PERFORMANCE CONTRACT
   · ONE rAF loop, only alive while the ring is being scrubbed or settling.
   · Item depth is written imperatively (transform / opacity / filter) — React
     only re-renders when the detented index changes.
   · Iris blades are static SVG circles moved by CSS transforms; no path is
     ever recomputed, and they are deliberately NOT promoted (their bounding
     box is viewport-sized, so a compositor layer would be far more expensive
     than repainting eight solid fills).
   · blur() is capped at BLUR_MAX and only ever touches a single-line text
     span — never a container, never a full-screen layer.
   ========================================================================== */

type Phase = "closed" | "opening" | "open" | "commit" | "closing";
type View = "nav" | "brands";
type CSSVars = CSSProperties & Record<`--${string}`, string | number>;

interface StackEntry {
  key: string;
  label: string;
  href: string;
}

interface DragState {
  id: number;
  x0: number;
  f0: number;
  lastX: number;
  lastT: number;
  v: number;
}

interface Metrics {
  spacing: number;
  lateral: number;
  macro: boolean;
}

/* --- Optical / motion constants ------------------------------------------ */
const BLADES = 8;
/** Hard blur ceiling (px). Android Chrome degrades badly past ~8px. */
const BLUR_MAX = 7;
const OPEN_MS = 1080;
const CLOSE_MS = 900;
const COMMIT_MS = 360;
const SUB_MS = 240;
/** Finger travel (px) per depth step. */
const DRAG_PITCH = 62;
/** Distance (px) between marks on the sliding focus scale. */
const TICK_PITCH = 26;
/** Knurl texture period — must match the CSS repeating gradient. */
const KNURL_PERIOD = 8;
/** Detent magnetism while dragging (0 = free, 1 = hard snap). */
const DETENT = 0.16;
/* Detent spring, tuned in frame units: damping ratio ≈ 0.71 (a small,
   mechanical 4% overshoot — the "click") and a ~340ms settle. */
const SPRING_K = 0.15;
const SPRING_D = 0.45;
const SPRING_EPS = 0.004;

/** Photographic distance scale for the 7 destinations. */
const FOCUS_STOPS = [0.3, 0.45, 0.7, 1, 1.6, 3.2, 8];

const clamp = (v: number, lo: number, hi: number) => (v < lo ? lo : v > hi ? hi : v);

/** Deterministic −1..1 lateral offset so the macro cloud is stable per brand. */
function scatter(key: string): number {
  let h = 2166136261;
  for (let i = 0; i < key.length; i += 1) {
    h ^= key.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return ((h >>> 0) % 2000) / 1000 - 1;
}

function formatDistance(f: number, macro: boolean, count: number): string {
  if (count === 0) return "—";
  if (macro) return `${(0.085 + f * 0.0165).toFixed(2)}m`;
  if (f > count - 1.14) return "∞";
  const last = Math.min(count, FOCUS_STOPS.length) - 1;
  const i = clamp(Math.floor(f), 0, Math.max(0, last - 1));
  const t = clamp(f - i, 0, 1);
  const a = FOCUS_STOPS[i];
  const b = FOCUS_STOPS[Math.min(i + 1, last)];
  return `${Math.exp(Math.log(a) * (1 - t) + Math.log(b) * t).toFixed(2)}m`;
}

/* --- Iconography (hairline, 1px, instrument-grade) ------------------------ */
function ChevronLeft() {
  return (
    <svg viewBox="0 0 12 12" fill="none" aria-hidden="true" focusable="false">
      <path d="M7.6 1.6 3.2 6l4.4 4.4" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function ConceptAperture({ data, locale, onLocaleChange, onExit, reduced }: ConceptProps) {
  const rtl = locale === "fa";
  const uid = useId().replace(/[^a-zA-Z0-9]/g, "");

  const [phase, setPhase] = useState<Phase>("closed");
  const [view, setView] = useState<View>("nav");
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const [scrub, setScrub] = useState(false);
  const [commitKey, setCommitKey] = useState<string | null>(null);

  /* --- The depth stack ---------------------------------------------------- */
  const stack = useMemo<StackEntry[]>(() => {
    if (view === "brands") {
      const q = query.trim().toLowerCase();
      const list = q
        ? data.brands.filter((b) => b.name.toLowerCase().includes(q) || b.slug.toLowerCase().includes(q))
        : data.brands;
      return list.map((b) => ({ key: b.slug, label: b.name, href: `/brands/${b.slug}` }));
    }
    return data.nav.map((n) => ({ key: n.key, label: n.label[locale], href: n.href }));
  }, [view, query, data.brands, data.nav, locale]);

  /* --- Refs: everything the rAF loop touches ------------------------------ */
  const planeRef = useRef<HTMLDivElement | null>(null);
  const itemRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const labelRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const bracketRef = useRef<HTMLDivElement | null>(null);
  const readoutRef = useRef<HTMLSpanElement | null>(null);
  const knurlRef = useRef<HTMLSpanElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);

  const focusRef = useRef(0);
  const rawRef = useRef(0);
  const velRef = useRef(0);
  const targetRef = useRef(0);
  const maxRef = useRef(0);
  const countRef = useRef(0);
  const activeRef = useRef(0);
  const dirRef = useRef(1);
  const scrubRef = useRef(false);
  const dragRef = useRef<DragState | null>(null);
  const rafRef = useRef<number | null>(null);
  const lastTRef = useRef(0);
  const latRef = useRef<number[]>([]);
  const metricsRef = useRef<Metrics>({ spacing: 74, lateral: 72, macro: false });
  const timersRef = useRef<number[]>([]);
  const seqRef = useRef(0);

  /**
   * Schedules the next beat of a choreography. Every user-initiated transition
   * bumps the sequence, so a pending beat from an abandoned choreography (e.g.
   * Close pressed mid-confirmation) is dropped instead of fighting the new one.
   */
  const after = useCallback((ms: number, fn: () => void) => {
    seqRef.current += 1;
    const mine = seqRef.current;
    timersRef.current.push(
      window.setTimeout(() => {
        if (seqRef.current !== mine) return;
        fn();
      }, ms),
    );
  }, []);

  /* ------------------------------------------------------------------------
     applyFocus — the single write path.
     Depends on refs only, so it is referentially stable for the rAF loop.
     ------------------------------------------------------------------------ */
  const applyFocus = useCallback((f: number) => {
    const { spacing, lateral, macro } = metricsRef.current;
    const items = itemRefs.current;
    const labels = labelRefs.current;

    for (let i = 0; i < items.length; i += 1) {
      const el = items[i];
      if (!el) continue;
      const d = i - f;
      const a = Math.abs(d);

      if (a > 5.2) {
        if (el.dataset.off !== "1") {
          el.dataset.off = "1";
          el.style.opacity = "0";
          el.style.visibility = "hidden";
          el.style.pointerEvents = "none";
        }
        continue;
      }
      if (el.dataset.off === "1") {
        el.dataset.off = "0";
        el.style.visibility = "visible";
      }

      // Depth → screen: a compressed offset, a perspective-ish scale and a
      // circle-of-confusion falloff for opacity.
      const y = Math.sign(d) * Math.pow(a, 0.88) * spacing;
      const scale = 1 / (1 + (macro ? 0.2 : 0.155) * a);
      const cut = clamp((4.6 - a) / 1.3, 0, 1);
      const opacity = (1 / (1 + 1.35 * Math.pow(a, 1.6))) * cut;
      const x = macro ? (latRef.current[i] ?? 0) * lateral * Math.min(1, a) : 0;

      el.style.transform = `translate3d(${x.toFixed(2)}px, ${y.toFixed(2)}px, 0) scale(${scale.toFixed(4)})`;
      el.style.opacity = opacity.toFixed(3);
      el.style.zIndex = String(200 - Math.round(a * 20));
      el.style.pointerEvents = a <= 2.4 ? "auto" : "none";

      const label = labels[i];
      if (label) {
        const blur = Math.min(BLUR_MAX, (macro ? 3.6 : 2.9) * Math.pow(a, 1.05));
        label.style.filter = blur > 0.45 ? `blur(${blur.toFixed(2)}px)` : "";
      }
    }

    // Instrument readout.
    const readout = readoutRef.current;
    if (readout) readout.textContent = formatDistance(f, metricsRef.current.macro, countRef.current);

    // Ring: the knurl follows the finger continuously (wrapped to the texture
    // period so one tiny element carries an infinite grip); the scale slides
    // with the detents.
    const sign = dirRef.current;
    const knurl = knurlRef.current;
    if (knurl) {
      const k = -((rawRef.current * DRAG_PITCH * sign) % KNURL_PERIOD);
      knurl.style.transform = `translate3d(${k.toFixed(2)}px, 0, 0)`;
    }
    const track = trackRef.current;
    if (track) track.style.transform = `translate3d(${(-f * TICK_PITCH * sign).toFixed(2)}px, 0, 0)`;

    // React only hears about detent crossings.
    const nearest = clamp(Math.round(f), 0, maxRef.current);
    if (nearest !== activeRef.current) {
      activeRef.current = nearest;
      setActive(nearest);
    }
  }, []);

  /* --- The one rAF loop (momentum + detent spring) ------------------------ */
  const startLoop = useCallback(() => {
    if (rafRef.current !== null) return;
    if (!scrubRef.current) {
      scrubRef.current = true;
      setScrub(true);
    }
    lastTRef.current = performance.now();

    const step = (t: number) => {
      const dt = clamp(t - lastTRef.current, 1, 50);
      lastTRef.current = t;

      if (dragRef.current) {
        applyFocus(focusRef.current);
        rafRef.current = requestAnimationFrame(step);
        return;
      }

      const frames = dt / 16.6667;
      const target = targetRef.current;
      let f = focusRef.current;
      let v = velRef.current;

      v += (target - f) * SPRING_K * frames;
      v *= Math.pow(SPRING_D, frames);
      f += v * frames;

      if (Math.abs(target - f) < SPRING_EPS && Math.abs(v) < SPRING_EPS * 1.5) {
        focusRef.current = target;
        rawRef.current = target;
        velRef.current = 0;
        applyFocus(target);
        rafRef.current = null;
        scrubRef.current = false;
        setScrub(false);
        return;
      }

      focusRef.current = f;
      rawRef.current = f;
      velRef.current = v;
      applyFocus(f);
      rafRef.current = requestAnimationFrame(step);
    };

    rafRef.current = requestAnimationFrame(step);
  }, [applyFocus]);

  const rackTo = useCallback(
    (index: number) => {
      targetRef.current = clamp(index, 0, maxRef.current);
      velRef.current = 0;
      startLoop();
    },
    [startLoop],
  );

  const resetFocus = useCallback(
    (to: number) => {
      focusRef.current = to;
      rawRef.current = to;
      velRef.current = 0;
      targetRef.current = to;
      activeRef.current = to;
      setActive(to);
    },
    [],
  );

  /* --- Phase machine ------------------------------------------------------ */
  const openIris = useCallback(() => {
    setPhase("opening");
    after(reduced ? 0 : OPEN_MS, () => setPhase("open"));
  }, [after, reduced]);

  const closeIris = useCallback(() => {
    setCommitKey(null);
    setPhase("closing");
    after(reduced ? 0 : CLOSE_MS, () => {
      setPhase("closed");
      setView("nav");
      setQuery("");
      resetFocus(0);
    });
  }, [after, reduced, resetFocus]);

  const select = useCallback(
    (index: number) => {
      const entry = stack[index];
      if (!entry) return;
      setCommitKey(entry.key);
      setPhase("commit");
      after(reduced ? 200 : COMMIT_MS, () => {
        if (view === "nav" && entry.key === "brands") {
          setCommitKey(null);
          setView("brands");
          setQuery("");
          resetFocus(0);
          openIris();
          return;
        }
        // Real destination: confirm, then run the opening in reverse.
        closeIris();
      });
    },
    [after, closeIris, openIris, reduced, resetFocus, stack, view],
  );

  const backToNav = useCallback(() => {
    setPhase("commit");
    after(reduced ? 0 : SUB_MS, () => {
      setView("nav");
      setQuery("");
      resetFocus(1); // land back on "Brands"
      openIris();
    });
  }, [after, openIris, reduced, resetFocus]);

  /* --- Sync: stack size, lateral scatter, direction ----------------------- */
  useEffect(() => {
    itemRefs.current.length = stack.length;
    labelRefs.current.length = stack.length;
    latRef.current = stack.map((s) => scatter(s.key));
    countRef.current = stack.length;
    maxRef.current = Math.max(0, stack.length - 1);
    const f = clamp(focusRef.current, 0, maxRef.current);
    focusRef.current = f;
    rawRef.current = f;
    targetRef.current = clamp(Math.round(f), 0, maxRef.current);
    applyFocus(f);
  }, [stack, applyFocus]);

  useEffect(() => {
    dirRef.current = rtl ? -1 : 1;
    applyFocus(focusRef.current);
  }, [rtl, applyFocus]);

  /* --- Metrics: depth spacing scales with the available plane ------------- */
  useEffect(() => {
    const measure = () => {
      const el = planeRef.current;
      if (!el) return;
      const h = el.clientHeight;
      const w = el.clientWidth;
      const macro = view === "brands";
      metricsRef.current = {
        spacing: macro ? clamp(h * 0.118, 44, 66) : clamp(h * 0.152, 52, 84),
        lateral: Math.min(w * 0.19, 86),
        macro,
      };
      applyFocus(focusRef.current);
    };
    measure();
    window.addEventListener("resize", measure);
    window.addEventListener("orientationchange", measure);
    return () => {
      window.removeEventListener("resize", measure);
      window.removeEventListener("orientationchange", measure);
    };
  }, [applyFocus, view, phase, reduced]);

  /* --- AF bracket tracks the in-focus label ------------------------------- */
  useEffect(() => {
    const bracket = bracketRef.current;
    const label = labelRefs.current[active];
    if (!bracket || !label) return;
    const w = clamp(label.offsetWidth + 52, 120, window.innerWidth - 48);
    const h = clamp(label.offsetHeight + 18, 52, 120);
    bracket.style.width = `${Math.round(w)}px`;
    bracket.style.height = `${Math.round(h)}px`;
  }, [active, stack, locale, view, phase]);

  /* --- Teardown ------------------------------------------------------------ */
  useEffect(() => {
    const timers = timersRef.current;
    return () => {
      timers.forEach((id) => window.clearTimeout(id));
      timers.length = 0;
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };
  }, []);

  /* --- Escape closes the menu --------------------------------------------- */
  useEffect(() => {
    if (phase !== "open") return;
    // The React KeyboardEvent type is imported under an alias, so the DOM
    // global is still the one referenced here.
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeIris();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [phase, closeIris]);

  /* --- Focus-ring pointer handling (Pointer Events, capture-based) -------- */
  const onRingDown = useCallback(
    (e: ReactPointerEvent<HTMLDivElement>) => {
      if (maxRef.current <= 0) return;
      e.currentTarget.setPointerCapture(e.pointerId);
      dragRef.current = {
        id: e.pointerId,
        x0: e.clientX,
        f0: focusRef.current,
        lastX: e.clientX,
        lastT: performance.now(),
        v: 0,
      };
      velRef.current = 0;
      startLoop();
    },
    [startLoop],
  );

  const onRingMove = useCallback((e: ReactPointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    if (!drag || drag.id !== e.pointerId) return;
    const max = maxRef.current;
    const dx = (e.clientX - drag.x0) * dirRef.current;

    let raw = drag.f0 - dx / DRAG_PITCH;
    if (raw < 0) raw *= 0.3;
    else if (raw > max) raw = max + (raw - max) * 0.3;

    rawRef.current = raw;
    // Detents: the stack lags very slightly toward each stop, the grip does not.
    focusRef.current = raw + (Math.round(raw) - raw) * DETENT;

    const now = performance.now();
    const dt = Math.max(8, now - drag.lastT);
    drag.v = (-(e.clientX - drag.lastX) * dirRef.current) / DRAG_PITCH / dt;
    drag.lastX = e.clientX;
    drag.lastT = now;
  }, []);

  const onRingUp = useCallback(
    (e: ReactPointerEvent<HTMLDivElement>) => {
      const drag = dragRef.current;
      if (!drag || drag.id !== e.pointerId) return;
      dragRef.current = null;
      const max = maxRef.current;
      const f = focusRef.current;
      // Momentum decides which detent we land on; the spring drives us there.
      const projected = clamp(f + drag.v * 130, f - 6, f + 6);
      targetRef.current = clamp(Math.round(projected), 0, max);
      velRef.current = clamp(drag.v * 16.6667, -1.6, 1.6);
      startLoop();
    },
    [startLoop],
  );

  const onRingKey = useCallback(
    (e: ReactKeyboardEvent<HTMLDivElement>) => {
      const max = maxRef.current;
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        select(activeRef.current);
        return;
      }
      let step = 0;
      if (e.key === "ArrowRight") step = rtl ? -1 : 1;
      else if (e.key === "ArrowLeft") step = rtl ? 1 : -1;
      else if (e.key === "ArrowDown") step = 1;
      else if (e.key === "ArrowUp") step = -1;
      else if (e.key === "Home") {
        e.preventDefault();
        rackTo(0);
        return;
      } else if (e.key === "End") {
        e.preventDefault();
        rackTo(max);
        return;
      } else return;
      e.preventDefault();
      rackTo(activeRef.current + step);
    },
    [rackTo, rtl, select],
  );

  const onItemClick = useCallback(
    (e: ReactMouseEvent<HTMLAnchorElement>, index: number) => {
      e.preventDefault();
      if (phase !== "open") return;
      if (Math.abs(focusRef.current - index) < 0.45) select(index);
      else rackTo(index);
    },
    [phase, rackTo, select],
  );

  /* --- Derived ------------------------------------------------------------ */
  const opened = phase !== "closed";
  const iris: "closed" | "open" | "stop" =
    phase === "closed" || phase === "closing" ? "closed" : phase === "commit" ? "stop" : "open";
  const activeLabel = stack[active]?.label ?? "";
  const stackLabel = view === "brands" ? data.copy.brands[locale] : data.copy.menu[locale];

  return (
    <div
      className="cap-root"
      dir={rtl ? "rtl" : "ltr"}
      data-phase={phase}
      data-view={view}
      data-iris={iris}
      data-reduced={reduced ? "1" : "0"}
      data-scrub={scrub ? "1" : "0"}
    >
      {/* ---------------- FOCUS PLANE (behind the iris) ---------------- */}
      {opened && (
        <div className="cap-plane" ref={planeRef}>
          {reduced ? (
            <ul className="cap-list">
              {stack.map((entry, i) => (
                <li key={entry.key}>
                  <a
                    className="cap-list-item"
                    href={entry.href}
                    data-commit={commitKey === entry.key ? "1" : "0"}
                    onClick={(e) => {
                      e.preventDefault();
                      select(i);
                    }}
                  >
                    {entry.label}
                  </a>
                </li>
              ))}
            </ul>
          ) : (
            stack.map((entry, i) => (
              <a
                key={entry.key}
                className="cap-item"
                href={entry.href}
                ref={(el) => {
                  itemRefs.current[i] = el;
                }}
                data-commit={commitKey === entry.key ? "1" : "0"}
                aria-current={i === active ? "true" : undefined}
                onClick={(e) => onItemClick(e, i)}
              >
                <span
                  className="cap-item-label"
                  ref={(el) => {
                    labelRefs.current[i] = el;
                  }}
                >
                  {entry.label}
                </span>
              </a>
            ))
          )}

          {stack.length === 0 && <p className="cap-empty">{data.copy.noResults[locale]}</p>}

          {/* AF confirmation bracket + distance readout */}
          {stack.length > 0 && !reduced && (
            <>
              <div className="cap-bracket" ref={bracketRef} aria-hidden="true">
                <span className="cap-cnr cap-cnr-a" />
                <span className="cap-cnr cap-cnr-b" />
                <span className="cap-cnr cap-cnr-c" />
                <span className="cap-cnr cap-cnr-d" />
              </div>
              <div className="cap-readout" aria-hidden="true">
                <span className="cap-readout-tag">{view === "brands" ? "MACRO" : "FOCUS"}</span>
                <span className="cap-dist" ref={readoutRef} />
              </div>
            </>
          )}
        </div>
      )}

      {/* ---------------- THE IRIS ---------------- */}
      <svg className="cap-lens" viewBox="0 0 200 200" aria-hidden="true" focusable="false">
        <defs>
          <linearGradient id={`${uid}blade`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#0c0e13" />
            <stop offset="0.52" stopColor="#050609" />
            <stop offset="1" stopColor="#010203" />
          </linearGradient>
        </defs>
        {Array.from({ length: BLADES }, (_, i) => (
          <circle
            key={i}
            className="cap-blade"
            cx="149.6"
            cy="65.3"
            r="65.84"
            fill={`url(#${uid}blade)`}
            stroke="rgba(255,255,255,0.055)"
            strokeWidth="1"
            vectorEffect="non-scaling-stroke"
            style={{ "--i": i } as CSSVars}
          />
        ))}
      </svg>

      <div className="cap-vig" aria-hidden="true" />

      {/* ---------------- CLOSED: the iris is the trigger ---------------- */}
      {!opened && (
        <button type="button" className="cap-trigger" onClick={openIris} aria-label={data.copy.menu[locale]}>
          <span className="cap-trigger-mark" aria-hidden="true">
            <svg viewBox="0 0 100 100" fill="none" focusable="false">
              <circle className="cap-tr-ring" cx="50" cy="50" r="34" />
              <circle className="cap-tr-ring-inner" cx="50" cy="50" r="25" />
              <path className="cap-tr-arc" d="M50 8 A42 42 0 0 1 79.7 20.3" />
              {Array.from({ length: BLADES }, (_, i) => (
                <line key={i} className="cap-tr-tick" x1="50" y1="16.5" x2="50" y2="21" transform={`rotate(${i * 45} 50 50)`} />
              ))}
            </svg>
          </span>
          <span className="cap-trigger-label">{data.copy.menu[locale]}</span>
          <span className="cap-trigger-meta">{"ƒ / 1.4"}</span>
        </button>
      )}

      {/* ---------------- TOP CHROME ---------------- */}
      {opened && (
        <div className="cap-top">
          <div className="cap-lang" role="group" aria-label={data.copy.language[locale]}>
            <button
              type="button"
              className="cap-lang-btn"
              aria-pressed={locale === "en"}
              onClick={() => onLocaleChange("en")}
            >
              EN
            </button>
            <button
              type="button"
              className="cap-lang-btn"
              aria-pressed={locale === "fa"}
              onClick={() => onLocaleChange("fa")}
            >
              فارسی
            </button>
          </div>
          <button type="button" className="cap-close" onClick={closeIris} aria-label={data.copy.close[locale]}>
            <svg viewBox="0 0 12 12" fill="none" aria-hidden="true" focusable="false">
              <path d="M1.6 1.6 10.4 10.4M10.4 1.6 1.6 10.4" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" />
            </svg>
          </button>
        </div>
      )}

      {/* ---------------- BRANDS: search row ---------------- */}
      {opened && view === "brands" && (
        <div className="cap-search-row">
          <button type="button" className="cap-sub-back" onClick={backToNav} aria-label={data.copy.menu[locale]}>
            <ChevronLeft />
          </button>
          <label className="cap-search">
            <svg viewBox="0 0 14 14" fill="none" aria-hidden="true" focusable="false">
              <circle cx="6" cy="6" r="4.3" stroke="currentColor" strokeWidth="1.1" />
              <path d="M9.2 9.2 12.6 12.6" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" />
            </svg>
            <input
              className="cap-search-input"
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                resetFocus(0);
              }}
              placeholder={data.copy.search[locale]}
              aria-label={data.copy.search[locale]}
              inputMode="search"
              enterKeyHint="search"
              autoComplete="off"
              autoCorrect="off"
              spellCheck={false}
            />
          </label>
        </div>
      )}

      {/* ---------------- FOCUS RING ---------------- */}
      {opened && !reduced && (
        <div className="cap-ring-wrap">
          <span className="cap-stack-label">{stackLabel}</span>

          <div className="cap-scale" aria-hidden="true">
            <div className="cap-scale-track" ref={trackRef}>
              {stack.map((entry, i) => (
                <span key={entry.key} className="cap-tick" data-major={i % 5 === 0 ? "1" : "0"} />
              ))}
            </div>
          </div>

          <div
            className="cap-ring"
            role="slider"
            tabIndex={0}
            aria-label={stackLabel}
            aria-valuemin={0}
            aria-valuemax={Math.max(0, stack.length - 1)}
            aria-valuenow={active}
            aria-valuetext={activeLabel}
            data-disabled={stack.length === 0 ? "1" : "0"}
            onPointerDown={onRingDown}
            onPointerMove={onRingMove}
            onPointerUp={onRingUp}
            onPointerCancel={onRingUp}
            onKeyDown={onRingKey}
          >
            <span className="cap-knurl" ref={knurlRef} aria-hidden="true" />
            <span className="cap-index" aria-hidden="true" />
          </div>

          <div className="cap-ring-cue" aria-hidden="true">
            <svg viewBox="0 0 42 8" fill="none" focusable="false">
              <path
                d="M5.4 1.4 2 4l3.4 2.6M11.4 1.4 8 4l3.4 2.6M30.6 1.4 34 4l-3.4 2.6M36.6 1.4 40 4l-3.4 2.6"
                stroke="currentColor"
                strokeWidth="1"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path d="M18 4h6" stroke="currentColor" strokeWidth="1" strokeLinecap="round" opacity="0.5" />
            </svg>
          </div>
        </div>
      )}

      {/* ---------------- BACK TO LAB (every state) ---------------- */}
      <button className="mlab-back" onClick={onExit}>
        <ChevronLeft />
        {data.copy.back[locale]}
      </button>
    </div>
  );
}
