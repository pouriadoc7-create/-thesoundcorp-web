import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

// A Content-Security-Policy is applied in PRODUCTION only. It is deliberately
// omitted in development because `next dev` needs 'unsafe-eval' (HMR) and http
// (localhost/LAN), which `upgrade-insecure-requests` would break. The prod
// policy allowlists the app's real sources: self + inline (Next hydration and
// static JSON-LD), data:/blob: images (blur LQIPs), and the Google Maps embed.
// 'unsafe-inline' for scripts is the pragmatic tradeoff for a statically
// prerendered site with only trusted inline scripts; a nonce-based policy is
// the next hardening step.
const isProd = process.env.NODE_ENV === "production";

const CSP = [
  "default-src 'self'",
  "base-uri 'self'",
  "object-src 'none'",
  "form-action 'self'",
  "frame-ancestors 'self'",
  "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self'",
  "connect-src 'self'",
  "frame-src https://www.google.com https://maps.google.com",
  "upgrade-insecure-requests",
].join("; ");

const securityHeaders = [
  { key: "X-DNS-Prefetch-Control", value: "on" },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
  ...(isProd ? [{ key: "Content-Security-Policy", value: CSP }] : []),
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  images: {
    // Serve modern formats (AVIF first, WebP fallback) for real photography.
    formats: ["image/avif", "image/webp"],
  },
  // Lets phones/other devices on the LAN load dev-mode HMR assets when
  // testing via the machine's local network IP (e.g. http://192.168.1.6:3000).
  // Dev-only setting — has no effect on `next build`/`next start`.
  allowedDevOrigins: ["192.168.1.6"],
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
};

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

export default withNextIntl(nextConfig);
