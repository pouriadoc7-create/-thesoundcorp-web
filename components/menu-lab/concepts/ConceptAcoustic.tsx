"use client";

import "./conceptAcoustic.css";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type {
  CSSProperties,
  MouseEvent as RMouseEvent,
  PointerEvent as RPointerEvent,
} from "react";

import type { ConceptProps, LabLocale } from "../types";

/* ==========================================================================
   CONCEPT 05 — ACOUSTIC RESONANCE
   ---------------------------------------------------------------------------
   A single standing wave runs down the screen. The destinations sit at its
   antinodes (mode n = 7 → seven antinodes, alternating sides by construction).
   The medium is a real damped string: a leapfrog integration of
       u_tt = c² u_xx − γ u_t
   on 96 samples, driven by the finger and read back into ONE path `d`.
   ========================================================================== */

type StyleVars = CSSProperties & Record<`--${string}`, string | number>;

const N = 96; // string samples → one path, 96 points
const DT = 1 / 120; // fixed physics step (frame-rate independent)
const C2 = 0.3; // (c·dt/dx)² — comfortably CFL-stable
const DAMP = 0.012; // velocity damping per step
const SIG = 6.5; // finger coupling width, in samples

const EASE_MS = 620; // selection confirmation before the close reverses

const clamp = (v: number, a: number, b: number) => (v < a ? a : v > b ? b : v);
const r1 = (v: number) => Math.round(v * 10) / 10;

/** Bloom-and-decay envelope for a transient partial during the build-up. */
function hump(p: number, start: number, len: number): number {
  const x = (p - start) / len;
  return x <= 0 || x >= 1 ? 0 : Math.sin(Math.PI * x);
}

interface Sim {
  prev: Float32Array;
  cur: Float32Array;
  next: Float32Array;
  acc: number;
  last: number;
  open: number;
  energy: number;
  otP: number;
  otE: number;
  otV: number;
  otC: number;
  press: boolean;
  px: number;
  py: number;
}

interface Geo {
  w: number;
  h: number;
  cx: number;
  y0: number;
  len: number;
  a0: number;
  gut: number;
  umax: number;
  nodeY: number[];
  otPitch: number;
  otAmp: number;
  otGut: number;
  otPad: number;
  otMaxH: number;
  shift: number;
}

interface Ui {
  open: boolean;
  brands: boolean;
  dir: number;
  mode: number;
  nodeS: number[];
  vis: number;
}

interface Tables {
  t1: Float32Array;
  t3: Float32Array;
  t5: Float32Array;
  tf: Float32Array;
}

export default function ConceptAcoustic({
  data,
  locale,
  onLocaleChange,
  onExit,
  reduced,
}: ConceptProps) {
  const rtl = locale === "fa";
  const dirSign = rtl ? -1 : 1;
  const navCount = data.nav.length;
  const brandCount = data.brands.length;

  const [open, setOpen] = useState(false);
  const [view, setView] = useState<"root" | "brands">("root");
  const [focus, setFocus] = useState(-1);
  const [sel, setSel] = useState<string | null>(null);
  const [brandSel, setBrandSel] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [size, setSize] = useState({ w: 0, h: 0 });

  const rootRef = useRef<HTMLDivElement | null>(null);
  const fieldRef = useRef<HTMLDivElement | null>(null);
  const waveRef = useRef<SVGPathElement | null>(null);
  const tiesRef = useRef<SVGPathElement | null>(null);
  const markRef = useRef<SVGPathElement | null>(null);
  const otRef = useRef<SVGPathElement | null>(null);
  const rectRef = useRef<DOMRect | null>(null);
  const frameRef = useRef(0);
  const runningRef = useRef(false);
  const timerRef = useRef(0);
  const reducedRef = useRef(reduced);
  const uiFocus = useRef(-1);
  const geoRef = useRef<Geo | null>(null);
  const tabRef = useRef<Tables | null>(null);
  const uiRef = useRef<Ui>({ open: false, brands: false, dir: 1, mode: 7, nodeS: [], vis: 0 });

  const simRef = useRef<Sim | null>(null);
  if (simRef.current === null) {
    simRef.current = {
      prev: new Float32Array(N),
      cur: new Float32Array(N),
      next: new Float32Array(N),
      acc: 0,
      last: 0,
      open: 0,
      energy: 0,
      otP: 0,
      otE: 0,
      otV: 0,
      otC: 0,
      press: false,
      px: 0,
      py: 0,
    };
  }

  /* --- geometry ---------------------------------------------------------- */
  const nodeS = useMemo(
    () => Array.from({ length: navCount }, (_, k) => (2 * k + 1) / (2 * navCount)),
    [navCount],
  );

  const tables = useMemo<Tables>(() => {
    const build = (m: number) => {
      const a = new Float32Array(N);
      for (let i = 0; i < N; i++) a[i] = Math.sin(m * Math.PI * (i / (N - 1)));
      return a;
    };
    return { t1: build(1), t3: build(3), t5: build(5), tf: build(navCount) };
  }, [navCount]);

  const geo = useMemo<Geo>(() => {
    const w = Math.max(1, Math.round(size.w));
    const h = Math.max(1, Math.round(size.h));
    const y0 = clamp(h * 0.135, 82, 132);
    const len = Math.max(140, h - clamp(h * 0.15, 92, 148) - y0);
    const a0 = clamp(w * 0.1, 22, 44);
    const otPitch = clamp(len / (navCount * 2), 34, 52);
    const otAmp = a0 * 0.44;
    return {
      w,
      h,
      cx: w / 2,
      y0,
      len,
      a0,
      gut: a0 * 1.8 + 12,
      umax: a0 * 0.8,
      nodeY: nodeS.map((s) => y0 + len * s),
      otPitch,
      otAmp,
      otGut: otAmp + 14,
      otPad: 10,
      otMaxH: 20 + brandCount * otPitch,
      shift: h - 38 - (y0 + len / 2),
    };
  }, [size.w, size.h, nodeS, navCount, brandCount]);

  /* --- brand rows: visible ones re-index, hidden ones collapse in place ---- */
  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    let vis = 0;
    const out = data.brands.map((b) => {
      const on = q.length === 0 || b.name.toLowerCase().includes(q);
      const idx = vis;
      if (on) vis += 1;
      return { slug: b.slug, name: b.name, idx, on };
    });
    return { out, count: vis };
  }, [data.brands, query]);

  /* ======================================================================
     THE LOOP — one rAF, one path `d` for the fundamental (+ ties, marks and
     the overtone), one CSS var. Nothing is created per frame.
     ====================================================================== */
  const draw = useCallback(function frame(tms: number) {
    const geoNow = geoRef.current;
    const sim = simRef.current;
    const tab = tabRef.current;
    const wave = waveRef.current;
    if (!geoNow || !sim || !tab || !wave) {
      runningRef.current = false;
      return;
    }
    const ui = uiRef.current;
    const red = reducedRef.current;

    const t = tms / 1000;
    let dt = sim.last === 0 ? 1 / 60 : t - sim.last;
    sim.last = t;
    if (!(dt > 0)) dt = 1 / 60;
    if (dt > 0.1) dt = 0.1;

    /* open parameter — playing it backwards replays the choreography exactly */
    const target = ui.open ? 1 : 0;
    if (red) sim.open = target;
    else if (sim.open !== target) {
      const d = dt / (ui.open ? 1.02 : 0.78);
      sim.open =
        target > sim.open ? Math.min(target, sim.open + d) : Math.max(target, sim.open - d);
    }
    const r = sim.open;
    const p = r * r * r * (r * (6 * r - 15) + 10); // smootherstep, symmetric

    /* overtone envelope — the second harmonic rises out of silence */
    const otT = ui.brands ? 1 : 0;
    if (red) sim.otP = otT;
    else if (sim.otP !== otT) {
      const d = dt / 0.6;
      sim.otP = otT > sim.otP ? Math.min(otT, sim.otP + d) : Math.max(otT, sim.otP - d);
    }
    const q = sim.otP * sim.otP * (3 - 2 * sim.otP);

    /* harmonic build-up: partials 1, 3, 5 bloom and decay; the fundamental settles */
    const breath = red ? 1 : 1 + 0.055 * Math.sin(t * 0.74); // ~0.12 Hz, ±5.5%
    const sub = 1 - 0.52 * q; // the fundamental recedes beneath its overtone
    const A0 = geoNow.a0;
    const Af = A0 * p * breath * sub;
    const A5 = A0 * 0.24 * hump(p, 0.32, 0.58) * sub;
    const A3 = A0 * 0.32 * hump(p, 0.15, 0.56) * sub;
    const A1 = A0 * 0.4 * hump(p, 0.0, 0.48) * sub;
    const dir = ui.dir;
    const { t1, t3, t5, tf } = tab;

    /* ---- damped wave equation, fixed substeps ---------------------------- */
    if (red) {
      sim.cur.fill(0);
      sim.prev.fill(0);
      sim.energy = 0;
    } else {
      const umax = geoNow.umax;
      sim.acc += dt;
      let steps = 0;
      while (sim.acc >= DT && steps < 4) {
        sim.acc -= DT;
        steps += 1;
        const cur = sim.cur;
        const prev = sim.prev;
        const next = sim.next;
        for (let i = 1; i < N - 1; i++) {
          const lap = cur[i - 1] - 2 * cur[i] + cur[i + 1];
          const vel = cur[i] - prev[i];
          let v = (cur[i] + vel * (1 - DAMP) + C2 * lap) * 0.9994;
          if (v > umax) v = umax;
          else if (v < -umax) v = -umax;
          next[i] = v;
        }
        next[0] = 0;
        next[N - 1] = 0;
        sim.prev = cur;
        sim.cur = next;
        sim.next = prev;

        /* the finger pulls the medium toward itself; releasing lets the bulge
           split into two pulses that travel out, reflect and damp away */
        if (sim.press) {
          const c2 = sim.cur;
          const sPos = clamp((sim.py - geoNow.y0) / geoNow.len, 0, 1);
          const j = sPos * (N - 1);
          const lim = geoNow.gut - 10;
          const want = clamp(sim.px - geoNow.cx, -lim, lim);
          const lo = Math.max(1, Math.floor(j - 3 * SIG));
          const hi = Math.min(N - 2, Math.ceil(j + 3 * SIG));
          for (let i = lo; i <= hi; i++) {
            const dd = (i - j) / SIG;
            const g = Math.exp(-dd * dd);
            const modal = dir * (A1 * t1[i] + A3 * t3[i] + A5 * t5[i] + Af * tf[i]);
            let v = c2[i] + (want - modal - c2[i]) * 0.28 * g;
            if (v > umax) v = umax;
            else if (v < -umax) v = -umax;
            c2[i] = v;
          }
        }
      }

      let e = 0;
      for (let i = 1; i < N - 1; i++) {
        const v = sim.cur[i] - sim.prev[i];
        e += v * v;
      }
      e = Math.min(1, Math.sqrt(e / N) / (A0 * 0.055));
      sim.energy += (e - sim.energy) * 0.18;

      /* overtone excitation: a genuine damped harmonic oscillator (ζ ≈ 0.63) */
      sim.otV += (-46 * sim.otE - 8.5 * sim.otV) * dt;
      sim.otE += sim.otV * dt;
    }

    /* ---- the single path -------------------------------------------------- */
    const cx = geoNow.cx;
    const y0 = geoNow.y0;
    const len = geoNow.len;
    const cur = sim.cur;
    let d = "";
    for (let i = 0; i < N; i++) {
      const x = cx + dir * (A1 * t1[i] + A3 * t3[i] + A5 * t5[i] + Af * tf[i]) + cur[i];
      d += `${i === 0 ? "M" : "L"}${r1(x)} ${r1(y0 + (len * i) / (N - 1))}`;
    }
    wave.setAttribute("d", d);

    /* ---- ties + node marks (one path each) -------------------------------- */
    const mode = ui.mode;
    let td = "";
    let md = "";
    const focusIdx = uiFocus.current;
    for (let k = 0; k < ui.nodeS.length; k++) {
      const s = ui.nodeS[k];
      const modal =
        dir *
        (A1 * Math.sin(Math.PI * s) +
          A3 * Math.sin(3 * Math.PI * s) +
          A5 * Math.sin(5 * Math.PI * s) +
          Af * Math.sin(mode * Math.PI * s));
      const f = s * (N - 1);
      const i0 = Math.floor(f);
      const i1 = Math.min(N - 1, i0 + 1);
      const uu = cur[i0] + (cur[i1] - cur[i0]) * (f - i0);
      const y = geoNow.nodeY[k];
      const xw = cx + modal + uu;
      const side = (k % 2 === 0 ? 1 : -1) * dir;
      const xg = cx + side * geoNow.gut;
      td += `M${r1(xw)} ${r1(y)}L${r1(xg)} ${r1(y)}`;
      const tick = k === focusIdx ? 9 : 5;
      const seg = `M${r1(xw)} ${r1(y - tick)}L${r1(xw)} ${r1(y + tick)}`;
      if (k === focusIdx) md += seg;
      else td += seg;
    }
    tiesRef.current?.setAttribute("d", td);
    markRef.current?.setAttribute("d", md);

    /* ---- the overtone: sine half-arches as exact cubic Béziers ------------ */
    const ot = otRef.current;
    if (ot) {
      if (q < 0.002 || ui.vis === 0) ot.setAttribute("d", "");
      else {
        const P = geoNow.otPitch;
        const pad = geoNow.otPad;
        const ob = red ? 1 : 1 + 0.05 * Math.sin(t * 1.15);
        let od = `M${r1(cx)} ${pad}`;
        for (let m = 0; m < ui.vis; m++) {
          const ya = pad + m * P;
          const gmid = Math.exp(-Math.pow((ya + P / 2 - sim.otC) / (P * 3.2), 2));
          const amp =
            geoNow.otAmp * q * ob * (1 + sim.otE * gmid) * dir * (m % 2 === 0 ? 1 : -1);
          const K = r1(cx + amp * 1.3333);
          od += `C${K} ${r1(ya + P / 3)} ${K} ${r1(ya + (2 * P) / 3)} ${r1(cx)} ${r1(ya + P)}`;
        }
        ot.setAttribute("d", od);
      }
    }

    rootRef.current?.style.setProperty("--cac-e", sim.energy.toFixed(3));

    const busy =
      !red &&
      (sim.open !== target ||
        ui.open ||
        sim.otP !== otT ||
        sim.energy > 0.004 ||
        Math.abs(sim.otE) > 0.002 ||
        Math.abs(sim.otV) > 0.004);
    if (busy && runningRef.current) frameRef.current = requestAnimationFrame(frame);
    else runningRef.current = false;
  }, []);

  const wake = useCallback(() => {
    if (reducedRef.current || runningRef.current) return;
    if (typeof document !== "undefined" && document.hidden) return;
    const sim = simRef.current;
    if (sim) sim.last = 0;
    runningRef.current = true;
    frameRef.current = requestAnimationFrame(draw);
  }, [draw]);

  const paint = useCallback(() => {
    if (runningRef.current) return;
    const sim = simRef.current;
    if (sim) sim.last = 0;
    draw(0);
  }, [draw]);

  const excite = useCallback((sNorm: number, amp: number) => {
    const sim = simRef.current;
    if (!sim || reducedRef.current) return;
    const j = clamp(sNorm, 0, 1) * (N - 1);
    const lo = Math.max(1, Math.floor(j - 3 * SIG));
    const hi = Math.min(N - 2, Math.ceil(j + 3 * SIG));
    for (let i = lo; i <= hi; i++) {
      const dd = (i - j) / SIG;
      const g = Math.exp(-dd * dd);
      sim.cur[i] += amp * g;
      sim.prev[i] = sim.cur[i]; // zero velocity → the bump splits and travels out
    }
  }, []);

  /* --- refs kept in sync -------------------------------------------------- */
  useEffect(() => {
    reducedRef.current = reduced;
    if (reduced) {
      cancelAnimationFrame(frameRef.current);
      runningRef.current = false;
    }
    paint();
  }, [reduced, paint]);

  useEffect(() => {
    tabRef.current = tables;
    geoRef.current = geo;
    paint();
  }, [tables, geo, paint]);

  useEffect(() => {
    uiFocus.current = focus;
  }, [focus]);

  useEffect(() => {
    uiRef.current = {
      open,
      brands: open && view === "brands",
      dir: dirSign,
      mode: navCount,
      nodeS,
      vis: rows.count,
    };
    if (reduced) paint();
    else wake();
  }, [open, view, dirSign, navCount, nodeS, rows.count, reduced, wake, paint]);

  /* --- measurement -------------------------------------------------------- */
  useEffect(() => {
    const el = fieldRef.current;
    if (!el) return;
    const read = () => {
      const rect = el.getBoundingClientRect();
      rectRef.current = rect;
      setSize((s) =>
        Math.abs(s.w - rect.width) < 0.5 && Math.abs(s.h - rect.height) < 0.5
          ? s
          : { w: rect.width, h: rect.height },
      );
    };
    read();
    const ro = new ResizeObserver(read);
    ro.observe(el);
    window.addEventListener("orientationchange", read);
    return () => {
      ro.disconnect();
      window.removeEventListener("orientationchange", read);
    };
  }, []);

  useEffect(() => {
    const onVis = () => {
      if (document.hidden) {
        cancelAnimationFrame(frameRef.current);
        runningRef.current = false;
      } else {
        wake();
      }
    };
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, [wake]);

  useEffect(
    () => () => {
      cancelAnimationFrame(frameRef.current);
      window.clearTimeout(timerRef.current);
      runningRef.current = false;
    },
    [],
  );

  /* --- interaction -------------------------------------------------------- */
  const nearest = useCallback(
    (py: number) => {
      const g = geoRef.current;
      if (!g) return -1;
      let best = 0;
      let bd = Infinity;
      for (let k = 0; k < g.nodeY.length; k++) {
        const dd = Math.abs(py - g.nodeY[k]);
        if (dd < bd) {
          bd = dd;
          best = k;
        }
      }
      return best;
    },
    [],
  );

  const onDown = useCallback(
    (e: RPointerEvent<HTMLDivElement>) => {
      const el = fieldRef.current;
      const sim = simRef.current;
      if (!el || !sim) return;
      e.currentTarget.setPointerCapture(e.pointerId);
      const rect = el.getBoundingClientRect();
      rectRef.current = rect;
      sim.press = true;
      sim.px = e.clientX - rect.left;
      sim.py = e.clientY - rect.top;
      const k = nearest(sim.py);
      if (k !== uiFocus.current) setFocus(k);
      wake();
    },
    [nearest, wake],
  );

  const onMove = useCallback(
    (e: RPointerEvent<HTMLDivElement>) => {
      const sim = simRef.current;
      const rect = rectRef.current;
      if (!sim || !sim.press || !rect) return;
      sim.px = e.clientX - rect.left;
      sim.py = e.clientY - rect.top;
      const k = nearest(sim.py);
      if (k !== uiFocus.current) setFocus(k);
    },
    [nearest],
  );

  const onUp = useCallback((e: RPointerEvent<HTMLDivElement>) => {
    const sim = simRef.current;
    if (sim) sim.press = false;
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
  }, []);

  const toggle = useCallback(() => {
    const next = !open;
    if (next) {
      setView("root");
      setQuery("");
      setSel(null);
      setBrandSel(null);
      setFocus(-1);
    }
    setOpen(next);
    const g = geoRef.current;
    excite(0.5, g ? g.a0 * (next ? 0.5 : 0.8) : 0);
    wake();
  }, [open, excite, wake]);

  const onNav = useCallback(
    (e: RMouseEvent<HTMLAnchorElement>, k: number, key: string) => {
      e.preventDefault();
      const g = geoRef.current;
      setFocus(k);
      excite(nodeS[k], g ? g.a0 * 0.95 * (k % 2 === 0 ? 1 : -1) * dirSign : 0);
      wake();
      if (key === "brands") {
        setView("brands");
        return;
      }
      setSel(key);
      window.clearTimeout(timerRef.current);
      timerRef.current = window.setTimeout(() => {
        setSel(null);
        setOpen(false);
      }, EASE_MS);
    },
    [nodeS, dirSign, excite, wake],
  );

  const onBrand = useCallback(
    (e: RMouseEvent<HTMLAnchorElement>, slug: string, idx: number) => {
      e.preventDefault();
      const g = geoRef.current;
      const sim = simRef.current;
      setBrandSel(slug);
      if (sim && g) {
        sim.otV += 6.4;
        sim.otC = g.otPad + (idx + 0.5) * g.otPitch;
      }
      excite(0.5, g ? g.a0 * 0.3 : 0);
      wake();
      window.clearTimeout(timerRef.current);
      timerRef.current = window.setTimeout(() => {
        setBrandSel(null);
        setView("root");
        setOpen(false);
      }, EASE_MS);
    },
    [excite, wake],
  );

  const pickLocale = useCallback(
    (l: LabLocale) => {
      if (l === locale) return;
      onLocaleChange(l);
      const g = geoRef.current;
      // re-tuning the medium: a small symmetric ripple as the wave mirrors
      excite(0.33, g ? g.a0 * 0.35 : 0);
      excite(0.67, g ? -g.a0 * 0.35 : 0);
      wake();
    },
    [locale, onLocaleChange, excite, wake],
  );

  /* --- render ------------------------------------------------------------- */
  const fieldStyle: StyleVars = {
    "--cac-gut": `${r1(geo.gut)}px`,
    "--cac-og": `${r1(geo.otGut)}px`,
    "--cac-shift": `${r1(Math.max(0, geo.shift))}px`,
    "--cac-y0": `${r1(geo.y0)}px`,
    "--cac-len": `${r1(geo.len)}px`,
    "--n": navCount,
  };

  const otHeight = geo.otPad * 2 + rows.count * geo.otPitch;

  return (
    <div
      ref={rootRef}
      className="cac-root"
      dir={rtl ? "rtl" : "ltr"}
      data-open={open ? "1" : "0"}
      data-view={view}
      data-sel={sel ? "1" : "0"}
      data-red={reduced ? "1" : "0"}
      data-ready={size.w > 1 ? "1" : "0"}
    >
      <button type="button" className="mlab-back" onClick={onExit}>
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M15 5L8 12l7 7"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        {data.copy.back[locale]}
      </button>

      <div className="cac-plane">
        <div className="cac-field" ref={fieldRef} style={fieldStyle}>
          <svg
            className="cac-svg"
            viewBox={`0 0 ${geo.w} ${geo.h}`}
            preserveAspectRatio="none"
            aria-hidden="true"
            focusable="false"
          >
            <defs>
              <path id="cacWavePath" ref={waveRef} />
            </defs>
            <line
              className="cac-axis"
              x1={geo.cx}
              y1={geo.y0}
              x2={geo.cx}
              y2={geo.y0 + geo.len}
            />
            <use href="#cacWavePath" className="cac-wave-halo" />
            <use href="#cacWavePath" className="cac-wave" />
            <path className="cac-ties" ref={tiesRef} />
            <path className="cac-focus" ref={markRef} />
          </svg>

          <div
            className="cac-medium"
            onPointerDown={onDown}
            onPointerMove={onMove}
            onPointerUp={onUp}
            onPointerCancel={onUp}
          />

          <nav className="cac-nodes" aria-label={data.copy.menu[locale]}>
            {data.nav.map((item, k) => (
              <a
                key={item.key}
                href={item.href}
                className={`cac-node ${k % 2 === 0 ? "cac-node--end" : "cac-node--start"}`}
                style={{ "--y": `${r1(geo.nodeY[k])}px`, "--i": k } as StyleVars}
                data-focus={focus === k ? "1" : "0"}
                data-sel={sel === item.key ? "1" : "0"}
                tabIndex={open && view === "root" ? 0 : -1}
                aria-hidden={!open || view !== "root"}
                aria-haspopup={item.key === "brands" ? "true" : undefined}
                onClick={(e) => onNav(e, k, item.key)}
                onPointerDown={() => setFocus(k)}
              >
                <span className="cac-node-in">
                  <span className="cac-node-idx">{String(k + 1).padStart(2, "0")}</span>
                  <span className="cac-node-label">{item.label[locale]}</span>
                </span>
                <span className="cac-node-bar" />
              </a>
            ))}
          </nav>

          <div className="cac-brands">
            <div className="cac-bhead">
              <button
                type="button"
                className="cac-bback"
                onClick={() => {
                  setView("root");
                  const g = geoRef.current;
                  excite(0.5, g ? g.a0 * 0.4 : 0);
                  wake();
                }}
                tabIndex={open && view === "brands" ? 0 : -1}
                aria-label={data.copy.close[locale]}
              >
                <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path
                    d="M15 5L8 12l7 7"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
              <p className="cac-btitle">{data.copy.brands[locale]}</p>
              <span className="cac-bcount">{String(rows.count).padStart(2, "0")}</span>
            </div>

            <div className="cac-search">
              <svg className="cac-search-i" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <circle cx="11" cy="11" r="6.5" stroke="currentColor" strokeWidth="1.5" />
                <path
                  d="M16 16l4.5 4.5"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
              <input
                className="cac-search-in"
                type="text"
                inputMode="search"
                enterKeyHint="search"
                autoComplete="off"
                autoCorrect="off"
                spellCheck={false}
                value={query}
                placeholder={data.copy.search[locale]}
                aria-label={data.copy.search[locale]}
                tabIndex={open && view === "brands" ? 0 : -1}
                onChange={(e) => setQuery(e.target.value)}
              />
              {query.length > 0 ? (
                <button
                  type="button"
                  className="cac-search-x"
                  onClick={() => setQuery("")}
                  aria-label={data.copy.close[locale]}
                >
                  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path
                      d="M5 5l14 14M19 5L5 19"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                    />
                  </svg>
                </button>
              ) : null}
            </div>

            <div className="cac-scroll">
              <p className="cac-empty" data-on={rows.count === 0 ? "1" : "0"}>
                {data.copy.noResults[locale]}
              </p>
              <div className="cac-otclip" style={{ height: `${r1(otHeight)}px` }}>
                <svg
                  className="cac-otsvg"
                  height={geo.otMaxH}
                  viewBox={`0 0 ${geo.w} ${geo.otMaxH}`}
                  preserveAspectRatio="none"
                  aria-hidden="true"
                  focusable="false"
                >
                  <path className="cac-ot" ref={otRef} />
                </svg>
                {rows.out.map((b) => (
                  <a
                    key={b.slug}
                    href={`/brands/${b.slug}`}
                    className={`cac-brand ${b.idx % 2 === 0 ? "cac-brand--end" : "cac-brand--start"}`}
                    style={
                      {
                        "--y": `${r1(geo.otPad + (b.idx + 0.5) * geo.otPitch)}px`,
                      } as StyleVars
                    }
                    data-on={b.on ? "1" : "0"}
                    data-sel={brandSel === b.slug ? "1" : "0"}
                    tabIndex={open && view === "brands" && b.on ? 0 : -1}
                    aria-hidden={!b.on}
                    onClick={(e) => onBrand(e, b.slug, b.idx)}
                  >
                    <span className="cac-brand-name">{b.name}</span>
                  </a>
                ))}
              </div>
            </div>
          </div>

          <div className="cac-lang" role="group" aria-label={data.copy.language[locale]}>
            <button
              type="button"
              data-on={locale === "en" ? "1" : "0"}
              onClick={() => pickLocale("en")}
            >
              EN
            </button>
            <button
              type="button"
              data-on={locale === "fa" ? "1" : "0"}
              onClick={() => pickLocale("fa")}
            >
              فارسی
            </button>
          </div>

          <button type="button" className="cac-key" onClick={toggle} aria-expanded={open}>
            <svg className="cac-key-g" viewBox="0 0 26 12" aria-hidden="true">
              <path className="cac-key-flat" d="M1 6H25" />
              <path
                className="cac-key-sine"
                d="M1 6C3.6 -0.6 8.4 12.6 13 6C17.6 -0.6 22.4 12.6 25 6"
              />
            </svg>
            <span className="cac-key-slot">
              <span className="cac-key-txt cac-key-txt--a">{data.copy.menu[locale]}</span>
              <span className="cac-key-txt cac-key-txt--b">{data.copy.close[locale]}</span>
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
