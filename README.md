# TheSoundCorp — Web

Marketing & catalogue site for **TheSoundCorp**, an official importer/distributor
of premium Hi‑Fi / Hi‑End audio brands in Iran. Bilingual **English / Persian
(RTL)**, built on the Next.js App Router.

## Stack

- **Next.js 16** (App Router, Turbopack) · **React 19** · **TypeScript** (strict)
- **Tailwind CSS v4** design tokens (`app/globals.css`)
- **next-intl** for i18n + locale routing (`/en`, `/fa`)
- `next/image` optimization (AVIF/WebP)

## Prerequisites

- **Node.js ≥ 20.9** (see `engines`) · npm 11 (`packageManager`)

## Getting started

```bash
npm ci
cp .env.example .env.local   # optional; the app defaults to the prod domain
npm run dev                  # http://localhost:3000  (binds 0.0.0.0 for LAN)
```

## Scripts

| Script | Purpose |
| --- | --- |
| `npm run dev` | Dev server (HMR), bound to `0.0.0.0` for phone/LAN testing |
| `npm run build` | Production build (static prerender of all routes) |
| `npm start` | Serve the production build |
| `npm run lint` | ESLint |
| `npm run typecheck` | `tsc --noEmit` |

## Environment variables

| Variable | Required | Default | Notes |
| --- | --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | No | `https://thesoundcorp.ir` | Absolute origin for canonical/OG/sitemap/robots/JSON‑LD. Override only for a staging origin. No trailing slash. |

There is **no localhost dependency** in build output — absolute URLs default to
the production domain.

## Content model (data‑driven)

- **Products** — `lib/data/products.ts`. Add real photography by setting a
  product's `imageUrl` (+ per‑view `gallery[].src`) — no component changes.
  Products without images fall back to a premium branded placeholder.
- **Brands** — `lib/data/brands.ts`. Set a brand's `logoUrl` and its logo
  renders everywhere via `components/ui/BrandLogo.tsx`; otherwise a refined
  wordmark is shown.
- **Copy** — all UI strings live in `messages/en.json` + `messages/fa.json`
  (keep the two at key parity).

## Asset staging

`asset-library/` is a working store of source brand media (git‑ignores the heavy
binaries; keeps manifests). Ship‑ready images are copied into `public/` and
referenced from the data files (see the Marten Dexter reference wiring).

## Project structure

```
app/[locale]/        routes (home, brands, products, gallery, downloads, about, contact)
app/{sitemap,robots,manifest}.ts   generated SEO/PWA routes
components/          layout, sections, products, gallery, ui, seo, icons, motion
lib/                 data, types, constants, utils (metadata/alternates helpers)
i18n/                next-intl routing/request config   ·   proxy.ts = middleware
messages/            en.json / fa.json
```

## Deploy

Static‑prerendered; deploys to any Node host or Vercel. Set
`NEXT_PUBLIC_SITE_URL` for non‑production origins, run `npm ci && npm run build`,
then `npm start` (or the platform's Next.js runtime).
