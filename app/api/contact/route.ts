import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

/**
 * Contact form endpoint. Receives { name, email, message } from the Contact page
 * form and emails it to the site owner via SMTP. All credentials come from
 * environment variables — nothing is hard-coded:
 *
 *   SMTP_HOST        e.g. smtp.gmail.com
 *   SMTP_PORT        465 (SSL) or 587 (STARTTLS)
 *   SMTP_USER        the sending mailbox / SMTP username
 *   SMTP_PASS        the SMTP password / app password (NEVER commit this)
 *   CONTACT_TO       inbox that should receive enquiries (defaults to SMTP_USER)
 *   CONTACT_FROM     From address (defaults to SMTP_USER)
 *
 * Until those are set the route returns 503 { code: "not_configured" } and the
 * client falls back to opening the visitor's mail app — so the form is never dead.
 */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Lightweight in-memory per-IP rate limit. Bounds how often a single client can
// trigger an actual email send (single PM2 instance → one shared map; resets on
// restart, which is fine for a contact form). Genuine visitors send once or twice.
const RATE_LIMIT = 5;
const RATE_WINDOW_MS = 10 * 60 * 1000; // 10 minutes
const hits = new Map<string, number[]>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < RATE_WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) {
    for (const [k, v] of hits) {
      if (v.every((t) => now - t >= RATE_WINDOW_MS)) hits.delete(k);
    }
  }
  return recent.length > RATE_LIMIT;
}

function clientIp(request: Request): string {
  const fwd = request.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0]!.trim();
  return request.headers.get("x-real-ip") ?? "unknown";
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ code: "bad_request" }, { status: 400 });
  }

  const data = (body ?? {}) as Record<string, unknown>;
  const name = String(data.name ?? "").trim();
  const email = String(data.email ?? "").trim();
  const message = String(data.message ?? "").trim();
  // Honeypot: real users leave this hidden field empty; bots tend to fill it.
  const honeypot = String(data.company ?? "").trim();

  if (honeypot) {
    // Silently accept and drop — don't tip off the bot.
    return NextResponse.json({ ok: true });
  }
  if (!name || !isValidEmail(email) || !message) {
    return NextResponse.json({ code: "invalid" }, { status: 422 });
  }
  if (name.length > 200 || email.length > 200 || message.length > 5000) {
    return NextResponse.json({ code: "too_long" }, { status: 422 });
  }

  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT ?? 0);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const to = process.env.CONTACT_TO || user;
  const from = process.env.CONTACT_FROM || user;

  if (!host || !port || !user || !pass || !to) {
    return NextResponse.json({ code: "not_configured" }, { status: 503 });
  }

  if (isRateLimited(clientIp(request))) {
    return NextResponse.json({ code: "rate_limited" }, { status: 429 });
  }

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465, // implicit TLS on 465
    requireTLS: port !== 465, // force STARTTLS on 587/others (no cleartext fallback)
    auth: { user, pass },
  });

  const subject = `New enquiry from ${name} — TheSoundCorp`;
  const text = `New enquiry from the website contact form\n\nName: ${name}\nEmail: ${email}\n\nMessage:\n${message}\n`;
  const html = `
    <div style="font-family:Arial,Helvetica,sans-serif;font-size:15px;color:#111;line-height:1.6">
      <h2 style="margin:0 0 12px">New enquiry — TheSoundCorp</h2>
      <p style="margin:0"><strong>Name:</strong> ${escapeHtml(name)}</p>
      <p style="margin:0"><strong>Email:</strong> <a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a></p>
      <p style="margin:16px 0 4px"><strong>Message:</strong></p>
      <p style="white-space:pre-wrap;margin:0;padding:12px 14px;background:#f6f6f6;border-radius:8px">${escapeHtml(message)}</p>
    </div>`;

  try {
    await transporter.sendMail({
      from: `"TheSoundCorp Website" <${from}>`,
      to,
      replyTo: `"${name}" <${email}>`,
      subject,
      text,
      html,
    });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[contact] sendMail failed:", err);
    return NextResponse.json({ code: "send_failed" }, { status: 502 });
  }
}
