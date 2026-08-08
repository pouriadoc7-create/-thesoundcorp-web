"use client";

import { useLocale, useTranslations } from "next-intl";
import { useEffect, useRef } from "react";

/**
 * About — "Some things are better heard than explained."
 *
 * The approved dark editorial concept for The Sound: a near-full-screen hero with a
 * loudspeaker driver emerging from darkness under a single warm-platinum light, an
 * editorial statement set in generous negative space, one full-bleed material moment
 * (machined heat-sink fins under raking light), a quiet signature, and a coda whisper.
 *
 * The two artworks are bespoke, procedurally-composed SVG (no stock, no branding) so the
 * whole page reads as art-directed rather than assembled. Motion is transform/opacity only
 * (GPU): slow parallax, soft scroll reveals, and one hairline that draws itself in — all
 * disabled under prefers-reduced-motion. All styles are scoped under `.about-page`
 * (globals.css) and every SVG id is `ab-`-prefixed, so nothing here touches the rest of
 * the site. Bilingual: English/LTR for `en`, Persian/RTL for `fa` (content from the
 * `about.content` messages; the RTL variant mirrors the composition in globals.css).
 */

/* Hero — a loudspeaker driver, precise, emerging from darkness (single light, upper-left). */
function driverSVG(): string {
  const cx = 600, cy = 600;
  let bolts = "";
  for (let i = 0; i < 8; i++) {
    const a = (Math.PI * 2 * i) / 8 - Math.PI / 2;
    const r = 528, x = cx + r * Math.cos(a), y = cy + r * Math.sin(a);
    bolts += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="6.5" fill="#050607"/><circle cx="${x.toFixed(1)}" cy="${(y - 1.4).toFixed(1)}" r="2.6" fill="#48453f" opacity="0.75"/>`;
  }
  let ribs = "";
  for (let r = 360; r >= 190; r -= 44) ribs += `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="#15161a" stroke-width="2" opacity="0.6"/>`;
  return `<svg class="ab-art" viewBox="0 0 1200 1200" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><defs>
    <linearGradient id="ab-frame" x1="0.14" y1="0.1" x2="0.9" y2="0.94"><stop offset="0" stop-color="#4b4841"/><stop offset="0.32" stop-color="#211f1c"/><stop offset="0.66" stop-color="#0b0b0d"/><stop offset="1" stop-color="#040506"/></linearGradient>
    <radialGradient id="ab-cone" cx="0.42" cy="0.4" r="0.6"><stop offset="0" stop-color="#0a0a0c"/><stop offset="0.5" stop-color="#101115"/><stop offset="0.85" stop-color="#1e1f24"/><stop offset="1" stop-color="#0a0a0d"/></radialGradient>
    <radialGradient id="ab-cap" cx="0.38" cy="0.34" r="0.78"><stop offset="0" stop-color="#d7cfb9"/><stop offset="0.16" stop-color="#8b8578"/><stop offset="0.44" stop-color="#26262b"/><stop offset="0.8" stop-color="#0a0a0d"/><stop offset="1" stop-color="#050506"/></radialGradient>
    <radialGradient id="ab-surr" cx="0.42" cy="0.4" r="0.5"><stop offset="0" stop-color="#1b1c20"/><stop offset="0.8" stop-color="#0c0c0f"/><stop offset="1" stop-color="#070708"/></radialGradient>
    <linearGradient id="ab-rimS" x1="0.08" y1="0.06" x2="0.7" y2="0.72"><stop offset="0" stop-color="#f2ead6" stop-opacity="0.95"/><stop offset="0.24" stop-color="#d9caa8" stop-opacity="0.42"/><stop offset="0.46" stop-color="#cdbfa1" stop-opacity="0"/></linearGradient>
    <radialGradient id="ab-litTL" cx="0.34" cy="0.3" r="0.62"><stop offset="0" stop-color="#efe6d1" stop-opacity="0.14"/><stop offset="0.62" stop-color="#efe6d1" stop-opacity="0"/></radialGradient>
    <radialGradient id="ab-vig" cx="0.5" cy="0.5" r="0.5"><stop offset="0.62" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#040506" stop-opacity="1"/></radialGradient>
    <filter id="ab-b3" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="3"/></filter>
    <filter id="ab-b6" x="-40%" y="-40%" width="180%" height="180%"><feGaussianBlur stdDeviation="6"/></filter>
    <filter id="ab-b24" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="24"/></filter>
    <clipPath id="ab-disc"><circle cx="600" cy="600" r="560"/></clipPath></defs>
    <circle cx="${cx}" cy="${cy}" r="560" fill="url(#ab-frame)"/>
    <g clip-path="url(#ab-disc)"><circle cx="360" cy="330" r="560" fill="url(#ab-litTL)"/></g>
    ${bolts}
    <circle cx="${cx}" cy="${cy}" r="472" fill="none" stroke="url(#ab-rimS)" stroke-width="3" filter="url(#ab-b3)"/>
    <circle cx="${cx}" cy="${cy}" r="470" fill="url(#ab-surr)"/>
    <circle cx="${cx}" cy="${cy}" r="470" fill="none" stroke="#040405" stroke-width="9" opacity="0.9" filter="url(#ab-b6)"/>
    <circle cx="${cx}" cy="${cy}" r="408" fill="url(#ab-cone)"/>
    ${ribs}
    <circle cx="${cx}" cy="${cy}" r="408" fill="none" stroke="#040405" stroke-width="8" opacity="0.85" filter="url(#ab-b6)"/>
    <circle cx="${cx}" cy="${cy}" r="150" fill="url(#ab-cap)"/>
    <circle cx="${cx}" cy="${cy}" r="150" fill="none" stroke="url(#ab-rimS)" stroke-width="2.4" filter="url(#ab-b3)"/>
    <circle cx="${cx}" cy="${cy}" r="150" fill="none" stroke="#050506" stroke-width="6" opacity="0.7" filter="url(#ab-b6)"/>
    <ellipse cx="540" cy="544" rx="40" ry="30" fill="#efe7d2" opacity="0.5" filter="url(#ab-b6)"/>
    <circle cx="${cx}" cy="${cy}" r="556" fill="none" stroke="url(#ab-rimS)" stroke-width="3.2" filter="url(#ab-b3)"/>
    <g clip-path="url(#ab-disc)"><ellipse cx="900" cy="910" rx="540" ry="540" fill="#040506" opacity="0.55" filter="url(#ab-b24)"/></g>
    <circle cx="600" cy="600" r="600" fill="url(#ab-vig)"/></svg>`;
}

/* Detail — machined heat-sink fins under raking champagne light. */
function finsSVG(): string {
  const W = 1600, H = 1000, finW = 46, gap = 44, start = 84;
  let fins = "";
  let i = 0;
  for (let x = start; x + finW < W - 40; x += finW + gap, i++) {
    const b = Math.max(0.16, 1 - i * 0.052);
    const top = 96 + i * 3;
    fins += `<rect x="${x}" y="${top}" width="${finW}" height="${H - top}" fill="url(#ab-fin)"/>`;
    fins += `<rect x="${x}" y="${top}" width="${finW}" height="${H - top}" fill="#050506" opacity="${(1 - b).toFixed(2)}"/>`;
    fins += `<rect x="${x}" y="${top}" width="3" height="${H - top}" fill="url(#ab-edge)" opacity="${(0.9 * b).toFixed(2)}"/>`;
    fins += `<rect x="${x}" y="${top}" width="${finW}" height="5" fill="#c9c1ac" opacity="${(0.5 * b).toFixed(2)}"/>`;
    fins += `<rect x="${x + finW - 2}" y="${top}" width="2" height="${H - top}" fill="#020203" opacity="0.8"/>`;
  }
  return `<svg class="ab-art" viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><defs>
    <linearGradient id="ab-fin" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3d3a34"/><stop offset="0.28" stop-color="#22201d"/><stop offset="0.7" stop-color="#0d0d0f"/><stop offset="1" stop-color="#060607"/></linearGradient>
    <linearGradient id="ab-edge" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f0e8d4"/><stop offset="0.4" stop-color="#cdbfa1"/><stop offset="1" stop-color="#cdbfa1" stop-opacity="0"/></linearGradient>
    <radialGradient id="ab-wash" cx="0.28" cy="0.16" r="0.7"><stop offset="0" stop-color="#efe6d1" stop-opacity="0.16"/><stop offset="0.66" stop-color="#efe6d1" stop-opacity="0"/></radialGradient>
    <linearGradient id="ab-rl" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#050506" stop-opacity="0"/><stop offset="0.72" stop-color="#050506" stop-opacity="0.2"/><stop offset="1" stop-color="#040405" stop-opacity="0.9"/></linearGradient>
    <linearGradient id="ab-bd" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#050506" stop-opacity="0.55"/><stop offset="0.3" stop-color="#050506" stop-opacity="0"/><stop offset="0.72" stop-color="#050506" stop-opacity="0"/><stop offset="1" stop-color="#040405" stop-opacity="0.92"/></linearGradient>
    <radialGradient id="ab-fvig" cx="0.5" cy="0.5" r="0.62"><stop offset="0.55" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#040506" stop-opacity="1"/></radialGradient></defs>
    <rect width="${W}" height="${H}" fill="#050506"/>
    ${fins}
    <rect width="${W}" height="${H}" fill="url(#ab-wash)" style="mix-blend-mode:screen"/>
    <rect width="${W}" height="${H}" fill="url(#ab-rl)"/>
    <rect width="${W}" height="${H}" fill="url(#ab-bd)"/>
    <rect width="${W}" height="${H}" fill="url(#ab-fvig)"/></svg>`;
}

const DRIVER = driverSVG();
const FINS = finsSVG();

export function AboutConcept() {
  const rootRef = useRef<HTMLDivElement>(null);
  const t = useTranslations("about.content");
  const locale = useLocale();

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    root.classList.add("motion");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.18, rootMargin: "0px 0px -8% 0px" }
    );
    root.querySelectorAll<HTMLElement>("[data-r]").forEach((el) => io.observe(el));

    const hair = root.querySelector<HTMLElement>("#ab-hair");
    const hairTimer = window.setTimeout(() => hair?.classList.add("in"), 260);

    const detail = root.querySelector<HTMLElement>("#ab-detail");
    let dio: IntersectionObserver | undefined;
    if (detail) {
      dio = new IntersectionObserver(
        (entries) => entries.forEach((e) => e.isIntersecting && detail.classList.add("in")),
        { threshold: 0.3 }
      );
      dio.observe(detail);
    }

    if (reduce) {
      return () => {
        io.disconnect();
        dio?.disconnect();
        window.clearTimeout(hairTimer);
      };
    }

    const pars = Array.from(root.querySelectorAll<HTMLElement>("[data-par]"));
    let ticking = false;
    const frame = () => {
      ticking = false;
      const vh = window.innerHeight;
      pars.forEach((el) => {
        const host = el.closest("section");
        if (!host) return;
        const r = host.getBoundingClientRect();
        const f = parseFloat(el.getAttribute("data-par") || "0.15");
        const prog = r.top + r.height / 2 - vh / 2;
        el.style.transform = `translate3d(0,${(-prog * f).toFixed(1)}px,0)`;
      });
    };
    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(frame);
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", frame, { passive: true });
    frame();

    return () => {
      io.disconnect();
      dio?.disconnect();
      window.clearTimeout(hairTimer);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", frame);
    };
  }, []);

  return (
    // Locale-aware direction: English keeps its left-aligned composition; Persian
    // mirrors to a right-aligned RTL composition (see .about-page[dir="rtl"]).
    <div className="about-page" dir={locale === "fa" ? "rtl" : "ltr"} ref={rootRef}>
      <noscript>
        {/* Without JS the reveal transitions never run — show everything. */}
        <style>{`.about-page [data-r]{opacity:1 !important;transform:none !important}`}</style>
      </noscript>
      <div className="ab-grain" aria-hidden="true" />

      <section className="ab-hero" id="ab-hero">
        <div className="ab-stage" data-par="0.2" aria-hidden="true" dangerouslySetInnerHTML={{ __html: DRIVER }} />
        <div className="ab-glow" data-par="0.1" aria-hidden="true" />
        <div className="ab-fade" aria-hidden="true" />
        <div className="ab-inner">
          <p className="ab-kicker" data-r>{t("kicker")}</p>
          <h1 className="ab-headline" data-r data-d="1">
            {t("headline1")}
            <br />
            {t("headline2")}
          </h1>
          <div className="ab-hair" id="ab-hair" />
        </div>
        <div className="ab-cue" aria-hidden="true"><span className="ab-ln" />{t("cue")}</div>
      </section>

      <section className="ab-statement">
        <p className="ab-lead" data-r>{t("lead")}</p>
        <div className="ab-body">
          <p data-r>{t("body1")}</p>
          <p data-r data-d="1">{t("body2")}</p>
        </div>
      </section>

      <section className="ab-detail" id="ab-detail">
        <div className="ab-stage" data-par="0.14" aria-hidden="true" dangerouslySetInnerHTML={{ __html: FINS }} />
        <div className="ab-cover" aria-hidden="true" />
        <div className="ab-veil" aria-hidden="true" />
      </section>

      <section className="ab-sign">
        <div className="ab-div" data-r aria-hidden="true" />
        <div className="ab-mark" data-r data-d="1">{t("mark")}</div>
        <div className="ab-sub" data-r data-d="2">{t("sub")}</div>
      </section>

      <section className="ab-coda">
        <span data-r>Listen first.</span>
      </section>
    </div>
  );
}
