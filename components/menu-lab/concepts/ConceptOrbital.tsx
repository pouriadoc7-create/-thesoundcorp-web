"use client";

import "./conceptOrbital.css";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type FocusEvent as ReactFocusEvent,
  type MouseEvent as ReactMouseEvent,
  type PointerEvent as ReactPointerEvent,
} from "react";

import type { ConceptProps } from "../types";

/* ==========================================================================
   CONCEPT 02 — ORBITAL RESONANCE
   A weighted precision dial. The destinations ride a large circle whose centre
   sits off-screen toward the inline-start, so only a right-hand arc is visible.
   Drag vertically to rotate; momentum + friction carry the wheel; a magnetic
   detent captures the item crossing the horizontal focus axis.

   One rAF loop integrates the physics and writes a single rotation custom
   property per ring — every node position is derived in CSS from that value.
   ========================================================================== */

type Phase = "closed" | "opening" | "open" | "closing";
type RingId = "nav" | "brands";
type Vars = CSSProperties & Record<string, string | number>;

interface Geom {
  apex: number;
  r: number;
  step: number;
  r2: number;
  step2: number;
  cx: number;
  shift: number;
}

interface Dial {
  rot: number;
  vel: number;
  count: number;
  step: number;
  drag: boolean;
  free: boolean;
  goal: number | null;
}

/* --- Physics constants ----------------------------------------------------
   Tuned for a heavy, machined feel: a low free-running friction (the flywheel
   coasts) and a spring that only engages once the wheel has slowed — that late
   engagement is what reads as "magnetic detent" rather than "snap-to-grid". */
const K_DETENT = 96; // detent spring stiffness
const D_FREE = 2; // coasting friction (flywheel inertia)
const D_SNAP = 8.8; // extra damping once the magnet engages (zeta ~0.55)
const V_MAGNET = 2.4; // rad/s below which the detent starts to pull
const K_EDGE = 175; // end-stop stiffness
const D_EDGE = 16;
const D_SPINDOWN = 3.4; // powering-down friction on close
const V_MAX = 9; // fling clamp
const GEAR = 0.34; // outer bezel : inner ring reduction ratio
const NAV_FADE = 4.6; // proximity window, in detents
const BRAND_FADE = 5;
const SUB_STEP = 1 / 120; // fixed integration sub-step (stability, zero jitter)
const EDGE_GIVE = 0.55; // detents of compliance past each end stop

/* Track arcs live in a constant 1000×1000 user space (centre 500,500) and are
   scaled by the rendered SVG size, so nothing is regenerated on resize.
   vector-effect keeps every stroke an exact hairline at any scale. */
const ARC_OUTER = "M848.35 141.32 A500 500 0 0 1 848.35 858.68";
const ARC_MID = "M842.78 147.06 A492 492 0 0 1 842.78 852.94";
const ARC_INNER = "M769.90 122.58 A464 464 0 0 1 769.90 877.42";

const clamp = (v: number, lo: number, hi: number) => (v < lo ? lo : v > hi ? hi : v);
const smooth = (x: number) => {
  const t = clamp(x, 0, 1);
  return t * t * (3 - 2 * t);
};

const DEFAULT_GEOM: Geom = {
  apex: 84,
  r: 470,
  step: 0.1319,
  r2: 348,
  step2: 0.1379,
  cx: -386,
  shift: 122,
};

function measure(w: number, h: number): Geom {
  const apex = Math.round(clamp(w * 0.22, 62, 104));
  const r = Math.round(clamp(h * 0.76, 330, 560));
  const spacing = clamp(h * 0.094, 56, 74);
  const spacing2 = clamp(spacing * 0.74, 44, 54);
  const r2 = Math.round(r * 0.74);
  return { apex, r, step: spacing / r, r2, step2: spacing2 / r2, cx: apex - r, shift: r - r2 };
}

function makeDial(step: number, count: number): Dial {
  return { rot: 0, vel: 0, count, step, drag: false, free: false, goal: null };
}

function lowBound(d: Dial): number {
  return -(Math.max(1, d.count) - 1) * d.step;
}

/** One fixed-timestep integration sub-step for a single dial. */
function integrate(d: Dial, h: number): void {
  if (d.drag) return;
  const min = lowBound(d);
  const give = EDGE_GIVE * d.step;
  let a: number;

  if (d.rot > give) {
    a = (0 - d.rot) * K_EDGE - d.vel * D_EDGE;
  } else if (d.rot < min - give) {
    a = (min - d.rot) * K_EDGE - d.vel * D_EDGE;
  } else if (d.free) {
    a = -d.vel * D_SPINDOWN;
  } else {
    const target = d.goal !== null ? d.goal : Math.round(d.rot / d.step) * d.step;
    // The magnet fades in as the wheel slows — momentum first, capture last.
    const w = d.goal !== null ? 1 : 1 - Math.min(1, Math.abs(d.vel) / V_MAGNET);
    a = (target - d.rot) * K_DETENT * w - d.vel * (D_FREE + D_SNAP * w);
  }

  d.vel = clamp(d.vel + a * h, -V_MAX * 2, V_MAX * 2);
  d.rot += d.vel * h;
}

/** True once the dial is at rest on a detent (loop can stop). */
function rest(d: Dial): boolean {
  if (d.drag) return false;
  const min = lowBound(d);
  if (d.free) {
    if (Math.abs(d.vel) < 0.012) {
      d.vel = 0;
      return true;
    }
    return false;
  }
  const raw = d.goal !== null ? d.goal : Math.round(d.rot / d.step) * d.step;
  const target = clamp(raw, min, 0);
  if (Math.abs(d.vel) < 0.004 && Math.abs(target - d.rot) < 0.0012) {
    d.rot = target;
    d.vel = 0;
    d.goal = null;
    return true;
  }
  return false;
}

/* --- Static track (bezel) ------------------------------------------------- */
function OrbitTrack({ variant }: { variant: RingId }) {
  return (
    <svg
      className={`cor-track cor-track--${variant}`}
      viewBox="0 0 1000 1000"
      fill="none"
      aria-hidden="true"
      focusable="false"
      shapeRendering="geometricPrecision"
    >
      <path className="cor-track-hint" d={ARC_OUTER} pathLength={1} vectorEffect="non-scaling-stroke" />
      <path className="cor-track-line cor-track-line--a" d={ARC_OUTER} pathLength={1} vectorEffect="non-scaling-stroke" />
      <path className="cor-track-line cor-track-line--b" d={ARC_MID} pathLength={1} vectorEffect="non-scaling-stroke" />
      <path className="cor-track-line cor-track-line--c" d={ARC_INNER} pathLength={1} vectorEffect="non-scaling-stroke" />
    </svg>
  );
}

export default function ConceptOrbital({
  data,
  locale,
  onLocaleChange,
  onExit,
  reduced,
}: ConceptProps) {
  const rtl = locale === "fa";
  const dirMul = rtl ? -1 : 1;

  const [phase, setPhase] = useState<Phase>("closed");
  const [brandsOpen, setBrandsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [geom, setGeom] = useState<Geom>(DEFAULT_GEOM);
  const [navFocus, setNavFocus] = useState(0);
  const [brandFocus, setBrandFocus] = useState(0);
  const [pulse, setPulse] = useState<{ ring: RingId; key: string } | null>(null);
  const [confirming, setConfirming] = useState(false);
  const [picked, setPicked] = useState<{ label: string; href: string } | null>(null);

  /* --- element refs ------------------------------------------------------ */
  const rootRef = useRef<HTMLDivElement | null>(null);
  const stageRef = useRef<HTMLDivElement | null>(null);
  const dialRef = useRef<HTMLDivElement | null>(null);
  const navRingRef = useRef<HTMLDivElement | null>(null);
  const brandRingRef = useRef<HTMLDivElement | null>(null);
  const markRef = useRef<SVGSVGElement | null>(null);
  const navLifts = useRef<(HTMLDivElement | null)[]>([]);
  const brandLifts = useRef<(HTMLDivElement | null)[]>([]);

  /* --- physics / mirror refs (read by the rAF loop) ---------------------- */
  const navDial = useRef<Dial>(makeDial(DEFAULT_GEOM.step, data.nav.length));
  const brandDial = useRef<Dial>(makeDial(DEFAULT_GEOM.step2, data.brands.length));
  const gearRef = useRef({ navBase: 0, brandBase: 0 });
  const navP = useRef<number[]>([]);
  const brandP = useRef<number[]>([]);
  const brandIdx = useRef<number[]>([]);
  const brandVis = useRef<boolean[]>([]);
  const navFocusRef = useRef(0);
  const brandFocusRef = useRef(0);
  const geomRef = useRef<Geom>(DEFAULT_GEOM);
  const reducedRef = useRef(reduced);
  const dirRef = useRef(dirMul);
  const phaseRef = useRef<Phase>("closed");
  const brandsOpenRef = useRef(false);
  const busyRef = useRef(false);
  const rafRef = useRef(0);
  const runningRef = useRef(false);
  const lastTs = useRef(0);
  const frameRef = useRef<(ts: number) => void>(() => {});
  const timers = useRef<number[]>([]);
  const drag = useRef({
    id: -1,
    active: false,
    ring: "nav" as RingId,
    cx: 0,
    cy: 0,
    startA: 0,
    startRot: 0,
    lastA: 0,
    lastT: 0,
    moved: 0,
    sx: 0,
    sy: 0,
    target: null as Element | null,
  });

  useEffect(() => {
    reducedRef.current = reduced;
  }, [reduced]);
  useEffect(() => {
    dirRef.current = dirMul;
  }, [dirMul]);

  const after = useCallback((fn: () => void, ms: number) => {
    const id = window.setTimeout(() => {
      const at = timers.current.indexOf(id);
      if (at >= 0) timers.current.splice(at, 1);
      fn();
    }, ms);
    timers.current.push(id);
  }, []);

  /* --- the single rAF loop ---------------------------------------------- */
  const stop = useCallback(() => {
    runningRef.current = false;
    lastTs.current = 0;
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = 0;
    }
    stageRef.current?.classList.remove("is-live");
  }, []);

  const tick = useCallback((ts: number) => {
    frameRef.current(ts);
  }, []);

  const frame = useCallback(
    (ts: number) => {
      const prev = lastTs.current;
      lastTs.current = ts;
      const dt = clamp(prev ? (ts - prev) / 1000 : 1 / 60, 0, 0.05);
      const steps = Math.max(1, Math.ceil(dt / SUB_STEP));
      const h = dt / steps;

      const nav = navDial.current;
      const brand = brandDial.current;
      const geared = brandsOpenRef.current;

      for (let s = 0; s < steps; s += 1) {
        if (geared) {
          integrate(brand, h);
          // Reduction gearing: the outer bezel creeps at a fraction of the
          // inner ring's travel, exactly like a real geared control wheel.
          nav.rot = gearRef.current.navBase + (brand.rot - gearRef.current.brandBase) * GEAR;
        } else {
          integrate(nav, h);
        }
      }

      // ONE rotation custom property per ring drives every node position.
      navRingRef.current?.style.setProperty("--cor-rot", nav.rot.toFixed(4));
      brandRingRef.current?.style.setProperty("--cor-rot", brand.rot.toFixed(4));
      const mark = markRef.current;
      if (mark) {
        mark.style.setProperty("--cor-rot-nav", nav.rot.toFixed(4));
        mark.style.setProperty("--cor-rot-brand", brand.rot.toFixed(4));
      }

      // Continuous proximity (opacity) + the discrete detent focus. classList
      // .toggle with an explicit force is a no-op when unchanged, so nothing is
      // invalidated on a steady frame.
      if (!geared) {
        const els = navLifts.current;
        const win = nav.step * NAV_FADE;
        const focus = clamp(Math.round(-nav.rot / nav.step), 0, Math.max(0, nav.count - 1));
        for (let i = 0; i < els.length; i += 1) {
          const el = els[i];
          if (!el) continue;
          const p = smooth(1 - Math.abs(nav.rot + i * nav.step) / win);
          if (Math.abs(p - (navP.current[i] ?? -1)) > 0.004) {
            navP.current[i] = p;
            el.style.setProperty("--p", p.toFixed(3));
            el.classList.toggle("is-near", p > 0.06);
          }
          el.classList.toggle("is-focus", i === focus);
        }
        navFocusRef.current = focus;
      }

      if (geared || phaseRef.current === "closing") {
        const els = brandLifts.current;
        const win = brand.step * BRAND_FADE;
        const focus =
          brand.count > 0 ? clamp(Math.round(-brand.rot / brand.step), 0, brand.count - 1) : -1;
        for (let k = 0; k < els.length; k += 1) {
          const el = els[k];
          if (!el) continue;
          const shown = brandVis.current[k] ?? false;
          const seat = brandIdx.current[k] ?? 0;
          const p = shown ? smooth(1 - Math.abs(brand.rot + seat * brand.step) / win) : 0;
          if (Math.abs(p - (brandP.current[k] ?? -1)) > 0.004) {
            brandP.current[k] = p;
            el.style.setProperty("--p", p.toFixed(3));
            el.classList.toggle("is-near", p > 0.06);
          }
          el.classList.toggle("is-focus", shown && seat === focus);
        }
        brandFocusRef.current = Math.max(0, focus);
      }

      const settled = geared ? rest(brand) : rest(nav);
      if (settled && !drag.current.active) {
        if (!geared && navFocusRef.current !== navFocus) setNavFocus(navFocusRef.current);
        if (geared && brandFocusRef.current !== brandFocus) setBrandFocus(brandFocusRef.current);
        stop();
        return;
      }
      rafRef.current = requestAnimationFrame(tick);
    },
    [brandFocus, navFocus, stop, tick],
  );

  useEffect(() => {
    frameRef.current = frame;
  }, [frame]);

  const start = useCallback(() => {
    if (runningRef.current) return;
    runningRef.current = true;
    lastTs.current = 0;
    stageRef.current?.classList.add("is-live");
    rafRef.current = requestAnimationFrame(tick);
  }, [tick]);

  useEffect(() => {
    const raf = rafRef;
    const pending = timers;
    return () => {
      if (raf.current) cancelAnimationFrame(raf.current);
      pending.current.forEach((t) => window.clearTimeout(t));
      pending.current.length = 0;
    };
  }, []);

  /* --- geometry ---------------------------------------------------------- */
  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    let w = 0;
    let h = 0;
    const sync = () => {
      const nw = el.clientWidth || 360;
      const nh = el.clientHeight || 640;
      if (Math.abs(nw - w) < 8 && Math.abs(nh - h) < 8) return;
      w = nw;
      h = nh;
      const next = measure(nw, nh);
      geomRef.current = next;
      setGeom(next);
    };
    sync();
    const ro = new ResizeObserver(sync);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    const nav = navDial.current;
    const brand = brandDial.current;
    const ni = nav.step > 0 ? Math.round(-nav.rot / nav.step) : 0;
    const bi = brand.step > 0 ? Math.round(-brand.rot / brand.step) : 0;
    nav.step = geom.step;
    nav.rot = -ni * geom.step;
    nav.vel = 0;
    brand.step = geom.step2;
    brand.rot = -bi * geom.step2;
    brand.vel = 0;
    gearRef.current = { navBase: nav.rot, brandBase: brand.rot };
    start();
  }, [geom, start]);

  /* --- brands: filtering + stable node order ----------------------------- */
  // Pure derivation — no cross-render cache, so nothing is mutated during render.
  // A filtered-out brand keeps the angular seat of the nearest preceding VISIBLE
  // brand, so it collapses toward its neighbour instead of jumping to seat 0.
  const { nodes: brandNodes, hits } = useMemo(() => {
    const q = query.trim().toLowerCase();
    const matched = q ? data.brands.filter((b) => b.name.toLowerCase().includes(q)) : data.brands;
    const order = new Map<string, number>();
    matched.forEach((b, i) => order.set(b.slug, i));
    const list: { brand: (typeof matched)[number]; index: number; visible: boolean }[] = [];
    let seat = 0;
    for (const b of data.brands) {
      const vi = order.get(b.slug);
      if (vi !== undefined) seat = vi;
      list.push({ brand: b, index: vi ?? seat, visible: vi !== undefined });
    }
    return { nodes: list, hits: matched };
  }, [data.brands, query]);

  useEffect(() => {
    brandIdx.current = brandNodes.map((n) => n.index);
    brandVis.current = brandNodes.map((n) => n.visible);
    const d = brandDial.current;
    d.count = hits.length;
    d.free = false;
    // A new result set winds the ring back to its first entry.
    d.goal = brandsOpenRef.current ? 0 : null;
    if (reducedRef.current && brandsOpenRef.current) {
      d.rot = 0;
      d.goal = null;
    }
    start();
  }, [brandNodes, hits.length, start]);

  /* --- open / close choreography ----------------------------------------- */
  const openMenu = useCallback(() => {
    if (phaseRef.current !== "closed" || busyRef.current) return;
    busyRef.current = true;
    setPicked(null);
    phaseRef.current = "opening";
    setPhase("opening");
    const nav = navDial.current;
    nav.count = data.nav.length;
    nav.step = geomRef.current.step;
    nav.free = false;
    if (reducedRef.current) {
      nav.rot = 0;
      nav.vel = 0;
      nav.goal = null;
    } else {
      // Spins up from stillness and settles into the first detent with a
      // single, elegant overshoot (zeta ~0.55 against the end-stop compliance).
      nav.rot = -3.1 * nav.step;
      nav.vel = 0.6;
      nav.goal = 0;
    }
    start();
    after(
      () => {
        phaseRef.current = "open";
        setPhase("open");
        busyRef.current = false;
      },
      reducedRef.current ? 20 : 720,
    );
  }, [after, data.nav.length, start]);

  const closeMenu = useCallback(() => {
    if (phaseRef.current === "closed" || phaseRef.current === "closing") return;
    busyRef.current = true;
    phaseRef.current = "closing";
    setPhase("closing");
    brandsOpenRef.current = false;
    setBrandsOpen(false);
    const nav = navDial.current;
    const brand = brandDial.current;
    if (!reducedRef.current) {
      // Reverse choreography: the wheel powers down (free friction, no detent)
      // instead of fading out. It always coasts toward the roomier half of the
      // travel so it can never slam into an end stop on the way out.
      nav.free = true;
      nav.goal = null;
      nav.vel = nav.rot > lowBound(nav) / 2 ? -1.4 : 1.4;
      brand.free = false;
      brand.goal = null;
    }
    start();
    after(
      () => {
        phaseRef.current = "closed";
        setPhase("closed");
        setConfirming(false);
        setPulse(null);
        setQuery("");
        nav.free = false;
        nav.rot = 0;
        nav.vel = 0;
        nav.goal = null;
        brand.free = false;
        brand.rot = 0;
        brand.vel = 0;
        brand.goal = null;
        navFocusRef.current = 0;
        setNavFocus(0);
        navLifts.current.forEach((el, i) => el?.classList.toggle("is-focus", i === 0));
        busyRef.current = false;
        start();
      },
      reducedRef.current ? 60 : 660,
    );
  }, [after, start]);

  const openBrands = useCallback(() => {
    if (brandsOpenRef.current) return;
    const nav = navDial.current;
    const brand = brandDial.current;
    brand.count = hits.length;
    brand.step = geomRef.current.step2;
    brand.free = false;
    if (reducedRef.current) {
      brand.rot = 0;
      brand.vel = 0;
      brand.goal = null;
    } else {
      brand.rot = -3.6 * brand.step;
      brand.vel = 0.5;
      brand.goal = 0;
    }
    gearRef.current = { navBase: nav.rot, brandBase: brand.rot };
    brandsOpenRef.current = true;
    setBrandsOpen(true);
    start();
  }, [hits.length, start]);

  const closeBrands = useCallback(() => {
    if (!brandsOpenRef.current) return;
    const nav = navDial.current;
    const brand = brandDial.current;
    const brandsIdx = data.nav.findIndex((n) => n.key === "brands");
    brandsOpenRef.current = false;
    setBrandsOpen(false);
    setQuery("");
    // The bezel keeps the momentum it inherited through the gear, then the
    // magnet walks it back to the Brands detent.
    nav.vel = reducedRef.current ? 0 : brand.vel * GEAR;
    nav.goal = -Math.max(0, brandsIdx) * nav.step;
    nav.free = false;
    if (reducedRef.current && nav.goal !== null) {
      nav.rot = nav.goal;
      nav.goal = null;
      nav.vel = 0;
    }
    start();
  }, [data.nav, start]);

  /* --- selection --------------------------------------------------------- */
  const confirmPick = useCallback(
    (ring: RingId, key: string, label: string, href: string) => {
      if (busyRef.current) return;
      busyRef.current = true;
      setPulse({ ring, key });
      setConfirming(true);
      after(
        () => {
          setPicked({ label, href });
          busyRef.current = false;
          closeMenu();
        },
        reducedRef.current ? 160 : 720,
      );
    },
    [after, closeMenu],
  );

  const choose = useCallback(
    (ring: RingId, index: number) => {
      if (ring === "nav") {
        const item = data.nav[index];
        if (!item) return;
        if (item.key === "brands") {
          openBrands();
          return;
        }
        confirmPick("nav", item.key, item.label[locale], item.href);
        return;
      }
      const brand = hits[index];
      if (!brand) return;
      confirmPick("brands", brand.slug, brand.name, `/brands/${brand.slug}`);
    },
    [confirmPick, data.nav, hits, locale, openBrands],
  );

  const activate = useCallback(
    (ring: RingId, index: number) => {
      const d = ring === "brands" ? brandDial.current : navDial.current;
      if (d.count === 0) return;
      const focus = clamp(Math.round(-d.rot / d.step), 0, d.count - 1);
      if (index !== focus) {
        // Off-axis items are brought to focus first — never selected by mistake.
        d.goal = -index * d.step;
        d.free = false;
        if (reducedRef.current) {
          d.rot = d.goal;
          d.goal = null;
          d.vel = 0;
        }
        start();
        return;
      }
      choose(ring, index);
    },
    [choose, start],
  );

  /* --- pointer (drag) ---------------------------------------------------- */
  const onPointerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (phaseRef.current !== "open" || busyRef.current) return;
    const el = dialRef.current;
    if (!el) return;
    const ring: RingId = brandsOpenRef.current ? "brands" : "nav";
    const d = ring === "brands" ? brandDial.current : navDial.current;
    if (d.count === 0) return;
    // The 0×0 dial box reports the exact (off-screen) rotation centre,
    // transforms and RTL mirroring included.
    const rect = el.getBoundingClientRect();
    const mul = dirRef.current;
    const a = Math.atan2(e.clientY - rect.top, (e.clientX - rect.left) * mul);
    drag.current = {
      id: e.pointerId,
      active: true,
      ring,
      cx: rect.left,
      cy: rect.top,
      startA: a,
      startRot: d.rot,
      lastA: a,
      lastT: e.timeStamp,
      moved: 0,
      sx: e.clientX,
      sy: e.clientY,
      target: e.target instanceof Element ? e.target.closest("[data-idx]") : null,
    };
    d.drag = true;
    d.free = false;
    d.goal = null;
    e.currentTarget.setPointerCapture(e.pointerId);
    start();
  };

  const onPointerMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    const dr = drag.current;
    if (!dr.active || e.pointerId !== dr.id) return;
    const d = dr.ring === "brands" ? brandDial.current : navDial.current;
    const a = Math.atan2(e.clientY - dr.cy, (e.clientX - dr.cx) * dirRef.current);
    const raw = dr.startRot + (a - dr.startA);
    const min = lowBound(d);
    d.rot = raw > 0 ? raw * 0.34 : raw < min ? min + (raw - min) * 0.34 : raw;
    const dt = Math.max(0.008, (e.timeStamp - dr.lastT) / 1000);
    const inst = clamp((a - dr.lastA) / dt, -V_MAX, V_MAX);
    d.vel = d.vel * 0.6 + inst * 0.4;
    dr.lastA = a;
    dr.lastT = e.timeStamp;
    dr.moved = Math.max(dr.moved, Math.hypot(e.clientX - dr.sx, e.clientY - dr.sy));
  };

  const endDrag = (e: ReactPointerEvent<HTMLDivElement>, tapped: boolean) => {
    const dr = drag.current;
    if (!dr.active || e.pointerId !== dr.id) return;
    dr.active = false;
    const d = dr.ring === "brands" ? brandDial.current : navDial.current;
    d.drag = false;
    // A finger that paused before lifting must not fling.
    if (e.timeStamp - dr.lastT > 90 || reducedRef.current) d.vel = 0;
    if (reducedRef.current) {
      d.rot = clamp(Math.round(d.rot / d.step) * d.step, lowBound(d), 0);
    }
    if (e.currentTarget.hasPointerCapture(dr.id)) e.currentTarget.releasePointerCapture(dr.id);
    if (tapped && dr.moved < 9 && dr.target) {
      const raw = dr.target.getAttribute("data-idx");
      if (raw !== null) activate(dr.ring, Number(raw));
    }
    start();
  };

  const onItemClick = (e: ReactMouseEvent<HTMLAnchorElement>) => {
    e.preventDefault(); // never leave the lab
    if (e.detail !== 0) return; // pointer taps are handled on pointerup
    const el = e.currentTarget;
    const ring = (el.getAttribute("data-ring") as RingId | null) ?? "nav";
    const raw = el.getAttribute("data-idx");
    if (raw !== null) activate(ring, Number(raw));
  };

  const onItemFocus = (e: ReactFocusEvent<HTMLAnchorElement>) => {
    if (drag.current.active) return;
    const el = e.currentTarget;
    const ring = (el.getAttribute("data-ring") as RingId | null) ?? "nav";
    const raw = el.getAttribute("data-idx");
    if (raw === null) return;
    const d = ring === "brands" ? brandDial.current : navDial.current;
    const index = Number(raw);
    if (Math.round(-d.rot / d.step) === index) return;
    d.goal = -index * d.step;
    d.free = false;
    if (reducedRef.current) {
      d.rot = d.goal;
      d.goal = null;
    }
    start();
  };

  /* --- keyboard ---------------------------------------------------------- */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      if (brandsOpenRef.current) closeBrands();
      else if (phaseRef.current === "open") closeMenu();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [closeBrands, closeMenu]);

  /* --- render ------------------------------------------------------------ */
  const open = phase === "opening" || phase === "open";
  const navIn = open && !brandsOpen;
  const brandsIn = open && brandsOpen;
  const copy = data.copy;

  const rootVars: Vars = {
    "--cor-d": dirMul,
    "--cor-r": geom.r,
    "--cor-r2": geom.r2,
    "--cor-step": geom.step.toFixed(5),
    "--cor-step2": geom.step2.toFixed(5),
    "--cor-cx": geom.cx,
    "--cor-apex": geom.apex,
    "--cor-shift": geom.shift,
    "--cor-org": rtl ? "right" : "left",
  };

  return (
    <div
      ref={rootRef}
      className={`cor-root${reduced ? " is-reduced" : ""}`}
      dir={rtl ? "rtl" : "ltr"}
      style={rootVars}
      data-phase={phase}
    >
      <div className="cor-field" aria-hidden="true" />

      {/* ---- closed cover ---- */}
      <div className="cor-intro" data-on={phase === "closed"} aria-hidden={phase !== "closed"}>
        <p className="cor-wordmark">THE SOUND CORP</p>
        <span className="cor-rule" />
        {picked ? (
          <p className="cor-picked">
            <span className="cor-picked-label">{picked.label}</span>
            <span className="cor-picked-href" dir="ltr">
              {picked.href}
            </span>
          </p>
        ) : null}
      </div>

      {/* ---- the dial ---- */}
      <div
        ref={stageRef}
        className="cor-stage"
        data-phase={phase}
        data-level={brandsOpen ? "brands" : "nav"}
        data-nav={navIn ? "in" : "out"}
        data-brands={brandsIn ? "in" : "out"}
        data-confirm={confirming ? "true" : "false"}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={(e) => endDrag(e, true)}
        onPointerCancel={(e) => endDrag(e, false)}
      >
        <div ref={dialRef} className="cor-dial">
          <OrbitTrack variant="nav" />
          <OrbitTrack variant="brands" />

          <div ref={navRingRef} className="cor-ring cor-ring--nav" style={{ "--cor-n": data.nav.length } as Vars}>
            {data.nav.map((item, i) => (
              <div
                key={item.key}
                className={`cor-node${pulse?.ring === "nav" && pulse.key === item.key ? " is-picked" : ""}`}
                style={{ "--i": i } as Vars}
              >
                <div className="cor-arm">
                  <div
                    className={`cor-lift${i === 0 ? " is-focus is-near" : ""}`}
                    ref={(el) => {
                      navLifts.current[i] = el;
                    }}
                  >
                    <a
                      className="cor-item cor-item--nav"
                      href={item.href}
                      draggable={false}
                      data-idx={i}
                      data-ring="nav"
                      onClick={onItemClick}
                      onFocus={onItemFocus}
                      aria-current={navFocus === i ? "true" : undefined}
                      tabIndex={navIn ? 0 : -1}
                    >
                      <span className="cor-tick" aria-hidden="true" />
                      <span className="cor-plate">
                        <span className="cor-label cor-label--nav">{item.label[locale]}</span>
                      </span>
                    </a>
                    {pulse?.ring === "nav" && pulse.key === item.key ? (
                      <span className="cor-pulse" aria-hidden="true">
                        <span className="cor-pulse-ring" />
                        <span className="cor-pulse-ring" />
                        <span className="cor-pulse-ring" />
                      </span>
                    ) : null}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div
            ref={brandRingRef}
            className="cor-ring cor-ring--brand"
            style={{ "--cor-n": data.brands.length } as Vars}
          >
            {brandNodes.map((node, k) => (
              <div
                key={node.brand.slug}
                className={`cor-node${pulse?.ring === "brands" && pulse.key === node.brand.slug ? " is-picked" : ""}`}
                style={{ "--i": node.index } as Vars}
                data-vis={node.visible ? "1" : "0"}
              >
                <div className="cor-arm">
                  <div
                    className="cor-lift"
                    ref={(el) => {
                      brandLifts.current[k] = el;
                    }}
                  >
                    <a
                      className="cor-item cor-item--brand"
                      href={`/brands/${node.brand.slug}`}
                      draggable={false}
                      data-idx={node.visible ? node.index : undefined}
                      data-ring="brands"
                      onClick={onItemClick}
                      onFocus={onItemFocus}
                      aria-current={brandsIn && brandFocus === node.index ? "true" : undefined}
                      tabIndex={brandsIn && node.visible ? 0 : -1}
                      aria-hidden={node.visible ? undefined : true}
                    >
                      <span className="cor-tick" aria-hidden="true" />
                      <span className="cor-plate">
                        <span className="cor-label cor-label--brand">{node.brand.name}</span>
                      </span>
                    </a>
                    {pulse?.ring === "brands" && pulse.key === node.brand.slug ? (
                      <span className="cor-pulse" aria-hidden="true">
                        <span className="cor-pulse-ring" />
                        <span className="cor-pulse-ring" />
                        <span className="cor-pulse-ring" />
                      </span>
                    ) : null}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="cor-axis" aria-hidden="true">
          <span className="cor-axis-line" />
          <span className="cor-axis-mark" />
        </div>

        {brandsIn && hits.length === 0 ? <p className="cor-empty">{copy.noResults[locale]}</p> : null}
      </div>

      {/* ---- chrome ---- */}
      <button className="mlab-back" onClick={onExit} type="button">
        <svg className="cor-back-icon" viewBox="0 0 12 12" fill="none" aria-hidden="true" focusable="false">
          <path
            d="M7.4 2.2 3.6 6l3.8 3.8"
            stroke="currentColor"
            strokeWidth="1.3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        {copy.back[locale]}
      </button>

      <div className="cor-lang" role="group" aria-label={copy.language[locale]}>
        <button
          type="button"
          className="cor-lang-btn"
          data-on={locale === "en"}
          aria-pressed={locale === "en"}
          onClick={() => onLocaleChange("en")}
        >
          EN
        </button>
        <span className="cor-lang-sep" aria-hidden="true" />
        <button
          type="button"
          className="cor-lang-btn cor-lang-btn--fa"
          data-on={locale === "fa"}
          aria-pressed={locale === "fa"}
          onClick={() => onLocaleChange("fa")}
        >
          فارسی
        </button>
      </div>

      <div className="cor-head" data-on={open ? "true" : "false"} data-level={brandsOpen ? "brands" : "nav"}>
        <p className="cor-eyebrow">{copy.menu[locale]}</p>

        <div className="cor-search">
          <button
            type="button"
            className="cor-sub-back"
            onClick={closeBrands}
            aria-label={copy.menu[locale]}
            tabIndex={brandsIn ? 0 : -1}
          >
            <svg className="cor-back-icon" viewBox="0 0 12 12" fill="none" aria-hidden="true" focusable="false">
              <path
                d="M7.4 2.2 3.6 6l3.8 3.8"
                stroke="currentColor"
                strokeWidth="1.3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          <span className="cor-search-field">
            <svg className="cor-search-icon" viewBox="0 0 16 16" fill="none" aria-hidden="true" focusable="false">
              <circle cx="7" cy="7" r="4.6" stroke="currentColor" strokeWidth="1.2" />
              <path d="m10.6 10.6 3 3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
            </svg>
            <input
              className="cor-search-input"
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={copy.search[locale]}
              aria-label={`${copy.search[locale]} — ${copy.brands[locale]}`}
              inputMode="search"
              enterKeyHint="search"
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck={false}
              tabIndex={brandsIn ? 0 : -1}
            />
            <span className="cor-search-count" dir="ltr">
              {hits.length}
            </span>
          </span>
        </div>
      </div>

      <div className="cor-dock">
        <button
          type="button"
          className="cor-mark"
          aria-expanded={open}
          aria-label={open ? copy.close[locale] : copy.menu[locale]}
          onClick={() => (open ? closeMenu() : openMenu())}
        >
          <span className="cor-mark-face">
            <svg ref={markRef} className="cor-mark-svg" viewBox="0 0 100 100" fill="none" aria-hidden="true" focusable="false">
              <g className="cor-mark-orbit cor-mark-orbit--outer">
                <circle cx="50" cy="50" r="45" vectorEffect="non-scaling-stroke" />
              </g>
              <circle className="cor-mark-mid" cx="50" cy="50" r="35" vectorEffect="non-scaling-stroke" />
              <g className="cor-mark-orbit cor-mark-orbit--inner">
                <circle cx="50" cy="50" r="25" vectorEffect="non-scaling-stroke" />
              </g>
              <path className="cor-mark-index" d="M50 2.5v7" vectorEffect="non-scaling-stroke" />
              <circle className="cor-mark-core" cx="50" cy="50" r="2.4" />
              <path className="cor-mark-cross" d="M44 44l12 12M56 44l-12 12" vectorEffect="non-scaling-stroke" />
            </svg>
          </span>
          <span className="cor-mark-label">{open ? copy.close[locale] : copy.menu[locale]}</span>
        </button>
      </div>
    </div>
  );
}
