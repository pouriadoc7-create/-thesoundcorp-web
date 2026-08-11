"use client";

import "./conceptGlass.css";

import { useCallback, useEffect, useId, useMemo, useRef, useState } from "react";
import type {
  CSSProperties,
  MouseEvent as ReactMouseEvent,
  PointerEvent as ReactPointerEvent,
} from "react";

import type { ConceptProps, LabNavItem } from "../types";

/**
 * CONCEPT 04 — OPTICAL GLASS ARCHITECTURE
 *
 * The menu is an architectural louvre. Closed, seven optical fins stand
 * edge-on (~88°) and read as hairlines. Opening pivots them face-on in a
 * cascade while a raking specular sweeps the array and the names resolve.
 * Dragging horizontally rakes the light (a single --rake custom property) and
 * pivots the fins under the finger; tapping a fin turns it flat, fans its
 * neighbours away and resolves it into a glass panel — a grid of brand tiles
 * for Brands, a destination confirmation for everything else.
 *
 * Persian is never set vertically: locale "fa" turns the louvre through 90°,
 * so the blades run horizontally and the labels stay upright and joined.
 *
 * Safari: the fins carry 3D transforms, so they carry NO backdrop-filter. The
 * blur lives on one flat, never-transformed sheet beneath them (.cgl-diffuse).
 */

type StyleVars = CSSProperties & Record<`--${string}`, string | number>;

const CLOSED_SWEEP_MS = 900;
const OPEN_SWEEP_MS = 1120;
const PANEL_OUT_MS = 340;

function clamp(value: number, min: number, max: number): number {
  return value < min ? min : value > max ? max : value;
}

function easeInOut(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

/** Forgiving match: "vienna ac" finds "VIENNA ACOUSTICS". */
function fold(value: string): string {
  return value.toLowerCase().replace(/\s+/g, "");
}

function Chevron({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 12 12" fill="none" aria-hidden="true">
      <path
        d="M7.6 2.2 3.8 6l3.8 3.8"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function ConceptGlass({
  data,
  locale,
  onLocaleChange,
  onExit,
  reduced,
}: ConceptProps) {
  const isFa = locale === "fa";
  const axis = isFa ? "x" : "y";
  const copy = data.copy;
  const uid = useId();
  const arrayId = `cgl-array-${uid}`;
  const searchId = `cgl-search-${uid}`;

  const [open, setOpen] = useState(false);
  const [panelKey, setPanelKey] = useState<string | null>(null);
  const [panelOut, setPanelOut] = useState(false);
  const [query, setQuery] = useState("");
  const [picked, setPicked] = useState<string | null>(null);

  const rootRef = useRef<HTMLDivElement | null>(null);
  const arrayRef = useRef<HTMLElement | null>(null);
  const timersRef = useRef<number[]>([]);
  const dragRef = useRef({ id: -1, x0: 0, left: 0, width: 1, moved: false });
  const animRef = useRef({
    rake: 0.5,
    rakeTarget: 0.5,
    tilt: 0,
    tiltTarget: 0,
    sweeping: false,
    sweepFrom: 0.5,
    sweepTo: 0.5,
    sweepStart: 0,
    sweepDur: 1,
    dragging: false,
    running: false,
    frame: 0,
  });

  const after = useCallback((ms: number, run: () => void) => {
    timersRef.current.push(window.setTimeout(run, ms));
  }, []);

  useEffect(() => {
    const timers = timersRef.current;
    const anim = animRef.current;
    return () => {
      timers.forEach((id) => window.clearTimeout(id));
      timers.length = 0;
      window.cancelAnimationFrame(anim.frame);
      anim.running = false;
    };
  }, []);

  /* ---- the single rAF loop: light position + drag pivot ------------------ */
  const startLoop = useCallback(() => {
    const anim = animRef.current;
    if (anim.running) return;
    anim.running = true;
    rootRef.current?.setAttribute("data-anim", "1");

    const step = () => {
      const root = rootRef.current;
      if (!root) {
        anim.running = false;
        return;
      }

      if (anim.sweeping) {
        const t = clamp((performance.now() - anim.sweepStart) / anim.sweepDur, 0, 1);
        anim.rake = anim.sweepFrom + (anim.sweepTo - anim.sweepFrom) * easeInOut(t);
        if (t >= 1) {
          anim.sweeping = false;
          anim.rakeTarget = 0.5;
        }
      } else {
        anim.rake += (anim.rakeTarget - anim.rake) * (anim.dragging ? 0.34 : 0.075);
      }
      anim.tilt += (anim.tiltTarget - anim.tilt) * (anim.dragging ? 0.3 : 0.11);

      const rested =
        !anim.sweeping &&
        !anim.dragging &&
        Math.abs(anim.rakeTarget - anim.rake) < 0.0015 &&
        Math.abs(anim.tiltTarget - anim.tilt) < 0.015;

      if (rested) {
        anim.rake = anim.rakeTarget;
        anim.tilt = anim.tiltTarget;
      }

      root.style.setProperty("--rake", anim.rake.toFixed(4));
      root.style.setProperty("--tilt", anim.tilt.toFixed(3));

      if (rested) {
        root.removeAttribute("data-anim");
        root.removeAttribute("data-drag");
        anim.running = false;
        return;
      }
      anim.frame = window.requestAnimationFrame(step);
    };

    anim.frame = window.requestAnimationFrame(step);
  }, []);

  /** Scripted rake of the specular across the array, used by open + close. */
  const sweep = useCallback(
    (from: number, to: number, duration: number) => {
      if (reduced) return;
      const anim = animRef.current;
      anim.sweeping = true;
      anim.sweepFrom = from;
      anim.sweepTo = to;
      anim.sweepStart = performance.now();
      anim.sweepDur = duration;
      anim.rake = from;
      startLoop();
    },
    [reduced, startLoop],
  );

  /* ---- state choreography ------------------------------------------------ */
  const openMenu = useCallback(() => {
    setOpen(true);
    sweep(-0.28, 1.28, OPEN_SWEEP_MS);
  }, [sweep]);

  const closeMenu = useCallback(() => {
    setOpen(false);
    setPanelOut(true);
    setPicked(null);
    sweep(1.28, -0.28, CLOSED_SWEEP_MS);
    after(PANEL_OUT_MS, () => {
      setPanelKey(null);
      setPanelOut(false);
      setQuery("");
    });
  }, [after, sweep]);

  const toggle = useCallback(() => {
    if (open) closeMenu();
    else openMenu();
  }, [open, closeMenu, openMenu]);

  const closePanel = useCallback(() => {
    setPanelOut(true);
    setPicked(null);
    after(PANEL_OUT_MS, () => {
      setPanelKey(null);
      setPanelOut(false);
      setQuery("");
    });
  }, [after]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      if (panelKey !== null) closePanel();
      else if (open) closeMenu();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [panelKey, open, closePanel, closeMenu]);

  /* ---- raking drag (Pointer Events, capture only once it IS a drag) ------ */
  const onPointerDown = useCallback(
    (event: ReactPointerEvent<HTMLElement>) => {
      if (!open || panelKey !== null || reduced) return;
      const host = arrayRef.current;
      if (!host) return;
      const rect = host.getBoundingClientRect();
      const drag = dragRef.current;
      drag.id = event.pointerId;
      drag.x0 = event.clientX;
      drag.left = rect.left;
      drag.width = rect.width || 1;
      drag.moved = false;

      const anim = animRef.current;
      anim.dragging = true;
      anim.rakeTarget = clamp((event.clientX - rect.left) / drag.width, 0, 1);
      rootRef.current?.setAttribute("data-drag", "1");
      startLoop();
    },
    [open, panelKey, reduced, startLoop],
  );

  const onPointerMove = useCallback(
    (event: ReactPointerEvent<HTMLElement>) => {
      const drag = dragRef.current;
      const anim = animRef.current;
      if (drag.id !== event.pointerId || !anim.dragging) return;

      const dx = event.clientX - drag.x0;
      if (!drag.moved && Math.abs(dx) > 7) {
        drag.moved = true;
        // Capture only now, so a plain tap still lands its click on the fin.
        try {
          arrayRef.current?.setPointerCapture(event.pointerId);
        } catch {
          /* capture unsupported for this pointer — dragging still works */
        }
      }
      anim.rakeTarget = clamp((event.clientX - drag.left) / drag.width, 0, 1);
      if (drag.moved) anim.tiltTarget = clamp((dx / drag.width) * 30, -13, 13);
      startLoop();
    },
    [startLoop],
  );

  const onPointerEnd = useCallback(
    (event: ReactPointerEvent<HTMLElement>) => {
      const drag = dragRef.current;
      const anim = animRef.current;
      if (drag.id !== event.pointerId) return;
      drag.id = -1;
      anim.dragging = false;
      anim.tiltTarget = 0;
      anim.rakeTarget = 0.5;

      const host = arrayRef.current;
      if (host?.hasPointerCapture(event.pointerId)) host.releasePointerCapture(event.pointerId);
      // A tap has nothing to settle — hand the transitions back immediately.
      if (!drag.moved) rootRef.current?.removeAttribute("data-drag");
      startLoop();
    },
    [startLoop],
  );

  /* ---- selection --------------------------------------------------------- */
  const handleFin = useCallback(
    (event: ReactMouseEvent<HTMLAnchorElement>, item: LabNavItem) => {
      event.preventDefault();
      // detail === 0 means a keyboard-generated click, which is never a drag.
      if (event.detail !== 0 && dragRef.current.moved) return;
      setPicked(null);
      setQuery("");
      setPanelOut(false);
      setPanelKey(item.key);
    },
    [],
  );

  const handleBrand = useCallback(
    (event: ReactMouseEvent<HTMLAnchorElement>, slug: string) => {
      event.preventDefault();
      setPicked(slug);
      after(1900, () => setPicked((current) => (current === slug ? null : current)));
    },
    [after],
  );

  /* ---- derived ----------------------------------------------------------- */
  const last = Math.max(1, data.nav.length - 1);

  const panelItem = useMemo(
    () => (panelKey === null ? null : (data.nav.find((item) => item.key === panelKey) ?? null)),
    [data.nav, panelKey],
  );
  const panelIndex = panelItem ? data.nav.indexOf(panelItem) : -1;
  const isBrands = panelItem?.key === "brands";

  const needle = fold(query);
  const flags = useMemo(
    () => data.brands.map((brand) => needle.length === 0 || fold(brand.name).includes(needle)),
    [data.brands, needle],
  );
  const anyMatch = flags.some(Boolean);

  const panelP = panelIndex < 0 ? 0.5 : panelIndex / last;
  const panelVars: StyleVars = {
    "--ox": axis === "y" ? `${((panelP - 0.5) * 74).toFixed(1)}%` : "0%",
    "--oy": axis === "x" ? `${((panelP - 0.5) * 58).toFixed(1)}%` : "0%",
  };

  return (
    <div
      ref={rootRef}
      className="cgl-root"
      dir={isFa ? "rtl" : "ltr"}
      lang={isFa ? "fa" : "en"}
      data-axis={axis}
      data-phase={open ? "open" : "closed"}
      data-panel={panelItem ? "1" : undefined}
      data-reduced={reduced ? "1" : undefined}
    >
      <div className="cgl-field" aria-hidden="true" />
      <div className="cgl-lattice" aria-hidden="true" />
      <div className="cgl-diffuse" aria-hidden="true" />
      <div className="cgl-veil" aria-hidden="true" />

      <button type="button" className="mlab-back" onClick={onExit}>
        <Chevron />
        {copy.back[locale]}
      </button>

      <div className="cgl-locale" role="group" aria-label={copy.language[locale]}>
        <button
          type="button"
          className="cgl-locale-btn"
          data-on={isFa ? undefined : "1"}
          aria-pressed={!isFa}
          onClick={() => onLocaleChange("en")}
        >
          EN
        </button>
        <span className="cgl-locale-sep" aria-hidden="true" />
        <button
          type="button"
          className="cgl-locale-btn"
          lang="fa"
          data-on={isFa ? "1" : undefined}
          aria-pressed={isFa}
          onClick={() => onLocaleChange("fa")}
        >
          فارسی
        </button>
      </div>

      <div className="cgl-column">
        <div className="cgl-caption">
          <span className="cgl-caption-mark">The Sound Corp</span>
          <span className="cgl-caption-rule" aria-hidden="true" />
          <span className="cgl-caption-sub">Concept 04 — Optical Glass</span>
        </div>

        <nav
          ref={arrayRef}
          id={arrayId}
          className="cgl-array"
          aria-label={copy.menu[locale]}
          aria-hidden={open && panelItem === null ? undefined : true}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerEnd}
          onPointerCancel={onPointerEnd}
        >
          {data.nav.map((item, index) => {
            const p = index / last;
            const finVars: StyleVars = {
              "--i": index,
              "--ri": last - index,
              "--p": p.toFixed(4),
              "--base": ((0.5 - p) * 19).toFixed(2),
              "--fan": panelIndex < 0 ? 0 : Math.sign(index - panelIndex),
            };
            const isOn = panelItem !== null && panelItem.key === item.key;
            return (
              <a
                key={item.key}
                href={item.href}
                className="cgl-fin"
                style={finVars}
                data-on={isOn ? "1" : undefined}
                tabIndex={open && panelItem === null ? undefined : -1}
                onClick={(event) => handleFin(event, item)}
              >
                <span className="cgl-fin-face" aria-hidden="true" />
                <span className="cgl-fin-caustic" aria-hidden="true" />
                <span className="cgl-fin-sheen" aria-hidden="true" />
                <span className="cgl-fin-edge" aria-hidden="true" />
                <span className="cgl-fin-body">
                  <span className="cgl-fin-num">{String(index + 1).padStart(2, "0")}</span>
                  <span className="cgl-fin-label">{item.label[locale]}</span>
                </span>
              </a>
            );
          })}
        </nav>
      </div>

      {panelItem !== null && (
        <section
          className="cgl-panel"
          style={panelVars}
          data-out={panelOut ? "1" : undefined}
          aria-label={isBrands ? copy.brands[locale] : panelItem.label[locale]}
        >
          <header className="cgl-panel-head">
            <button type="button" className="cgl-panel-back" onClick={closePanel}>
              <Chevron className="cgl-chev" />
              {copy.close[locale]}
            </button>
            <span className="cgl-panel-title">
              {isBrands ? copy.brands[locale] : panelItem.label[locale]}
            </span>
            {isBrands && <span className="cgl-panel-count">{data.brands.length}</span>}
          </header>

          {isBrands ? (
            <>
              <div className="cgl-search">
                <svg className="cgl-search-icon" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <circle cx="7" cy="7" r="4.6" stroke="currentColor" strokeWidth="1.2" />
                  <path d="m10.6 10.6 3 3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                </svg>
                <label className="cgl-sr" htmlFor={searchId}>
                  {copy.search[locale]}
                </label>
                <input
                  id={searchId}
                  className="cgl-search-input"
                  type="search"
                  value={query}
                  placeholder={copy.search[locale]}
                  autoComplete="off"
                  autoCorrect="off"
                  spellCheck={false}
                  enterKeyHint="search"
                  onChange={(event) => setQuery(event.target.value)}
                />
                {query.length > 0 && (
                  <button
                    type="button"
                    className="cgl-search-clear"
                    aria-label={copy.close[locale]}
                    onClick={() => setQuery("")}
                  >
                    <svg viewBox="0 0 12 12" fill="none" aria-hidden="true">
                      <path
                        d="M2.5 2.5 9.5 9.5M9.5 2.5 2.5 9.5"
                        stroke="currentColor"
                        strokeWidth="1.2"
                        strokeLinecap="round"
                      />
                    </svg>
                  </button>
                )}
              </div>

              <p className="cgl-pick" data-on={picked ? "1" : undefined} aria-live="polite">
                {picked ? `/brands/${picked}` : ""}
              </p>

              <div className="cgl-tiles">
                {!anyMatch && <p className="cgl-empty">{copy.noResults[locale]}</p>}
                {data.brands.map((brand, index) => {
                  const match = flags[index];
                  const tileVars: StyleVars = { "--i": index };
                  return (
                    <a
                      key={brand.slug}
                      href={`/brands/${brand.slug}`}
                      className="cgl-tile"
                      style={tileVars}
                      data-dim={match ? undefined : "1"}
                      data-on={picked === brand.slug ? "1" : undefined}
                      tabIndex={match ? undefined : -1}
                      onClick={(event) => handleBrand(event, brand.slug)}
                    >
                      <span className="cgl-tile-edge" aria-hidden="true" />
                      <span className="cgl-tile-name">{brand.name}</span>
                    </a>
                  );
                })}
              </div>
            </>
          ) : (
            <div className="cgl-dest">
              <span className="cgl-dest-num">{String(panelIndex + 1).padStart(2, "0")}</span>
              <h2 className="cgl-dest-title">{panelItem.label[locale]}</h2>
              <span className="cgl-dest-rule" aria-hidden="true" />
              <span className="cgl-dest-href">{panelItem.href}</span>
            </div>
          )}
        </section>
      )}

      <button
        type="button"
        className="cgl-trigger"
        aria-expanded={open}
        aria-controls={arrayId}
        onClick={toggle}
      >
        <span className="cgl-trigger-blades" aria-hidden="true">
          {Array.from({ length: 7 }, (_, index) => {
            const bladeVars: StyleVars = { "--i": index, "--ri": 6 - index };
            return <span key={index} className="cgl-blade" style={bladeVars} />;
          })}
        </span>
        <span className="cgl-trigger-label">{open ? copy.close[locale] : copy.menu[locale]}</span>
      </button>
    </div>
  );
}
