"use client";

import { type FormEvent, useState } from "react";

import { CONTACT } from "@/lib/constants/site";

/**
 * Contact hero — the approved "Concept B": a deep-dark stage with a champagne-gold
 * signal waveform flowing seamlessly across it (see .contact-flow in globals.css),
 * a glass contact form, and the brand's contact channels. The waveform is a purely
 * decorative background (aria-hidden, pointer-events:none). On mobile it is lifted
 * up over the headline/copy — a deliberate overlap that mirrors the desktop feel.
 *
 * The form composes the visitor's message into an email to the official inbox and
 * opens their mail client (works with no server/credentials). A WhatsApp shortcut
 * is always offered as an instant alternative.
 */

// Periodic waveform: y(x) has period 1440 (harmonics are integer multiples of the
// fundamental), so drawing it across two periods (0..2880) tiles seamlessly and can
// scroll left by exactly one period for an endless, jump-free flow.
function periodicWave(yb: number, amp: number): string {
  const pts: string[] = [];
  for (let x = 0; x <= 2880; x += 5) {
    const t = (2 * Math.PI * x) / 1440;
    const f =
      0.5 * Math.sin(t) +
      0.28 * Math.sin(2 * t + 1.1) +
      0.34 * Math.sin(3 * t + 0.4) +
      0.16 * Math.sin(5 * t + 2.2);
    pts.push(`${x} ${(yb + amp * f).toFixed(1)}`);
  }
  return "M " + pts.join(" L ");
}
const WAVE = periodicWave(432, 118);
const WAVE_ECHO = periodicWave(596, 58);

const goldIcon = "h-[18px] w-[18px] flex-none text-[color:var(--color-gold-soft)]/90";

function PhoneGlyph() {
  return (
    <svg className={goldIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2 4.2 2 2 0 0 1 4 2h3a2 2 0 0 1 2 1.7c.1.9.3 1.8.6 2.6a2 2 0 0 1-.5 2.1L7.6 9.8a16 16 0 0 0 6 6l1.4-1.1a2 2 0 0 1 2.1-.5c.8.3 1.7.5 2.6.6a2 2 0 0 1 1.7 2Z" />
    </svg>
  );
}
function WhatsAppGlyph() {
  return (
    <svg className={goldIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5Z" />
    </svg>
  );
}
function InstagramGlyph() {
  return (
    <svg className={goldIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.4" cy="6.6" r="1.05" fill="currentColor" stroke="none" />
    </svg>
  );
}
function PinGlyph() {
  return (
    <svg className={goldIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

const fieldClass =
  "mt-2 w-full rounded-xl border border-white/10 bg-white/[0.035] px-4 py-3 text-sm text-white placeholder:text-zinc-500 outline-none transition-colors focus:border-[color:var(--color-gold)]/50 focus-visible:ring-2 focus-visible:ring-[color:var(--color-gold)]/30";
const labelClass = "block text-[10.5px] font-medium uppercase tracking-[0.16em] text-zinc-500";

export function ContactHero() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);

  const valid = name.trim().length > 0 && email.includes("@") && message.trim().length > 0;

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!valid) return;
    const subject = encodeURIComponent(`New enquiry from ${name.trim()}`);
    const body = encodeURIComponent(
      `Name: ${name.trim()}\nEmail: ${email.trim()}\n\n${message.trim()}\n`
    );
    // Opens the visitor's mail client, pre-addressed to the official inbox.
    window.location.href = `${CONTACT.email.href}?subject=${subject}&body=${body}`;
    setSent(true);
  }

  return (
    <section
      dir="ltr"
      className="relative flex min-h-[86vh] items-center overflow-hidden bg-[radial-gradient(135%_120%_at_50%_45%,#0d0e12,#06070a_60%)]"
    >
      {/* Flowing golden signal waveform (decorative). */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <svg
          className="contact-wave absolute inset-0 h-full w-full"
          viewBox="0 0 1440 900"
          preserveAspectRatio="xMidYMid slice"
        >
          <defs>
            <linearGradient id="contactWaveGrad" x1="0" x2="1">
              <stop offset="0" stopColor="#b8912e" stopOpacity="0.2" />
              <stop offset="0.3" stopColor="#d4af37" stopOpacity="0.9" />
              <stop offset="0.5" stopColor="#f4e3b4" />
              <stop offset="0.7" stopColor="#d4af37" stopOpacity="0.9" />
              <stop offset="1" stopColor="#b8912e" stopOpacity="0.2" />
            </linearGradient>
            <filter id="contactWaveGlow" x="-10%" y="-40%" width="120%" height="180%">
              <feGaussianBlur stdDeviation="7" />
            </filter>
          </defs>
          <g className="contact-flow">
            <path d={WAVE} fill="none" stroke="#d4af37" strokeOpacity="0.42" strokeWidth="8" filter="url(#contactWaveGlow)" />
            <path d={WAVE} fill="none" stroke="url(#contactWaveGrad)" strokeWidth="2.3" />
            <path d={WAVE_ECHO} fill="none" stroke="url(#contactWaveGrad)" strokeWidth="1.4" strokeOpacity="0.13" />
          </g>
        </svg>
      </div>
      {/* Vignette for depth. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_95%_at_50%_42%,transparent_52%,rgba(0,0,0,0.62)_100%)]"
      />

      <div className="relative z-10 mx-auto grid w-full max-w-6xl grid-cols-1 items-center gap-12 px-6 py-24 md:grid-cols-[1.05fr_0.9fr] md:gap-16 lg:px-10">
        {/* Left — copy + channels */}
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.3em] text-[color:var(--color-gold-soft)]/90">
            Get in touch
          </p>
          <h1 className="mt-6 text-[34px] font-medium leading-[1.05] tracking-[-0.02em] text-[#f4f5f7] sm:text-5xl lg:text-[3.4rem]">
            For Those
            <br />
            <span className="bg-[linear-gradient(96deg,#efdcac,var(--color-gold)_52%,var(--color-gold-deep))] bg-clip-text text-transparent">
              Who Listen.
            </span>
          </h1>
          <p className="mt-6 max-w-md text-[15px] font-light leading-relaxed text-zinc-400">
            Great sound begins with knowing what matters.
            <br className="hidden sm:block" /> We&rsquo;d be pleased to hear from you.
          </p>

          <div className="mt-9 flex flex-col gap-4 text-[14.5px] text-zinc-300">
            <a className="inline-flex w-fit items-center gap-3 transition-colors hover:text-white" href={CONTACT.phone.href}>
              <PhoneGlyph />
              <span>{CONTACT.phone.display}</span>
            </a>
            <a className="inline-flex w-fit items-center gap-3 transition-colors hover:text-white" href={CONTACT.whatsapp.href} target="_blank" rel="noopener noreferrer">
              <WhatsAppGlyph />
              <span>WhatsApp</span>
            </a>
            <a className="inline-flex w-fit items-center gap-3 transition-colors hover:text-white" href={CONTACT.instagram.href} target="_blank" rel="noopener noreferrer">
              <InstagramGlyph />
              <span>{CONTACT.instagram.display}</span>
            </a>
            <div className="inline-flex w-fit items-center gap-3">
              <PinGlyph />
              <span>Manzariyeh, Tehran</span>
            </div>
          </div>
        </div>

        {/* Right — glass form */}
        <form
          onSubmit={handleSubmit}
          className="rounded-[22px] border border-white/[0.09] bg-[rgba(15,17,22,0.52)] p-8 shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_40px_80px_-40px_rgba(0,0,0,0.9)] backdrop-blur-xl backdrop-saturate-150"
        >
          {sent ? (
            <div className="flex min-h-[300px] flex-col items-center justify-center text-center">
              <span className="grid h-14 w-14 place-items-center rounded-full border border-[color:var(--color-gold)]/40 text-[color:var(--color-gold-soft)]">
                <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M20 6 9 17l-5-5" />
                </svg>
              </span>
              <p className="mt-5 text-lg font-medium text-white">Thank you.</p>
              <p className="mt-2 max-w-xs text-sm font-light text-zinc-400">
                Your message is ready in your email app. We&rsquo;ll be in touch shortly.
              </p>
              <a
                href={CONTACT.whatsapp.href}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-[color:var(--color-gold-soft)] transition-opacity hover:opacity-80"
              >
                <WhatsAppGlyph /> Or reach us instantly on WhatsApp
              </a>
            </div>
          ) : (
            <>
              <div className="mb-[18px]">
                <label className={labelClass} htmlFor="c-name">Name</label>
                <input id="c-name" className={fieldClass} placeholder="Your name" value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" />
              </div>
              <div className="mb-[18px]">
                <label className={labelClass} htmlFor="c-email">Email</label>
                <input id="c-email" type="email" className={fieldClass} placeholder="you@email.com" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" />
              </div>
              <div className="mb-[18px]">
                <label className={labelClass} htmlFor="c-message">Message</label>
                <textarea id="c-message" className={`${fieldClass} min-h-[92px] resize-none`} placeholder="How can we help you?" value={message} onChange={(e) => setMessage(e.target.value)} />
              </div>
              <button
                type="submit"
                disabled={!valid}
                className="btn-lux mt-1 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[linear-gradient(100deg,var(--color-gold),#ecd6a0)] px-6 py-4 text-sm font-semibold tracking-[0.02em] text-[#231a05] shadow-[0_14px_34px_-12px_rgba(212,175,55,0.5)] transition-opacity disabled:cursor-not-allowed disabled:opacity-45 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-gold)]/60 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
              >
                Send message
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </button>
            </>
          )}
        </form>
      </div>
    </section>
  );
}
