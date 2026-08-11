@AGENTS.md

# TheSoundCorp — Project Handoff & Operating Manual

> Single source of truth for any Claude Code session working on this repo.
> Written 2026-08-10. Verified against the repository and git history, not memory.
> See **HANDOFF.md** for the chronological story of how we got here.

---

# 1. What this project is

**TheSoundCorp** (thesoundcorp.ir) — the marketing + catalogue website for an official
importer/distributor of premium Hi‑Fi / Hi‑End audio brands in Iran. It is a brand
showcase and a **Download Center** for official product documentation, not an e‑commerce
store (no cart, no checkout, no payments).

**Goals**
- Present 26 luxury audio brands with the restraint and material quality the brands expect.
- Serve official product documents (manuals, brochures, whitepapers) reliably and legally.
- Work flawlessly on phones — the majority of real traffic.
- Bilingual **English (LTR)** + **Persian (RTL)** *for the UI*. See the Persian scope rule in §7.

---

# 2. Tech stack & architecture

- **Next.js 16.3.0** — App Router, Turbopack, React **19.2.8**, TypeScript **strict**
- **Tailwind CSS v4** with design tokens in `app/globals.css` (`@theme`, CSS custom properties)
- **next-intl 4.x** — locale routing `/en` + `/fa`, messages in `messages/{en,fa}.json`
- **vitest 2.x** — 9 test files, 56 tests
- **nodemailer** — contact form SMTP
- **sharp** — image processing (used in tooling/LQIP generation, not at runtime)
- Node **>= 20.9**, `packageManager: npm@11.17.0` (**this matters** — see §10)

**Rendering model:** almost everything is a Server Component and prerendered (98 static
pages). Client components are deliberate and few (`DownloadsExplorer`, `MobileNav`,
`CommandPalette`, `Lightbox`, motion primitives, menu‑lab concepts). The 157 KB downloads
catalogue is passed as a **prop** from the server page so it never enters the client bundle.

**Important architectural facts**
- `proxy.ts` is the next-intl middleware. Its matcher excludes `api`, `_next`, `_vercel`,
  **`menu-lab`**, and any path with a file extension.
- `app/[locale]/products/[slug]` and `app/[locale]/brands/[slug]` set
  `export const dynamicParams = false` + `generateStaticParams()` so unknown slugs return a
  **real 404** (this fixed a soft‑404 bug — do not remove).
- `app/menu-lab/` has its **own** `<html>`/`<body>` layout, outside the `[locale]` tree and
  outside the next-intl provider. It is a temporary design lab (§8).

---

# 3. Directory map

```
app/
  [locale]/            home, about, brands, brands/[slug], products, products/[slug],
                       gallery, downloads, contact, layout, template, loading, error, not-found
  api/contact/route.ts   contact form → SMTP (rate-limited)
  api/download/route.ts  SSRF-safe streaming proxy for REMOTE official files
  menu-lab/            TEMPORARY design lab (own layout + lab.css)  ← not linked from the site
  globals.css          Tailwind v4 tokens + global design system
  sitemap.ts robots.ts manifest.ts icon.png apple-icon.png
components/
  layout/    Header, MobileNav, LocaleSwitcher, Footer, Logo, FloatingWhatsApp, SocialLinks
  downloads/ DownloadsExplorer, BrandTile, ProductTile, ProductHero, DocumentGroup,
             DocumentRow, DownloadIcon
  products/  ProductCard, ProductCatalog, ProductGallery, ProductImage, WhatsAppInquiry
  brands/BrandLogoTile · sections/ · ui/ · motion/ · features/ · gallery/ · about/ ·
  contact/ · seo/JsonLd · icons/
  menu-lab/  types.ts, data.ts, concepts/Concept{Strata,Orbital,Editorial,Glass,Acoustic,Aperture}.tsx (+ CSS)
lib/
  data/      brands.ts (26), brand-logos.ts (+LOGO_SCALE, LOGO_LIGHTEN),
             download-logo-scale.ts, downloads.ts (Download Center catalogue),
             products.ts, contact-channels.ts, gallery.ts
  utils/     downloads.ts (data-bound + proxy allowlist), downloads-view.ts (pure helpers +
             cardAspectClass), metadata.ts, cn.ts, slugify.ts, alternates.ts
  hooks/     useMobileMenu, useFocusTrap, useHoverDropdown, useOfficialDownload, useIsMounted
  types/     brand.ts, download.ts, product.ts, gallery.ts, nav.ts
  constants/ site.ts (NAV_LINKS, SITE_URL, contact details), seo.ts
messages/en.json · messages/fa.json          i18n strings (keys must stay in parity)
public/
  brand-logos/         26 brand logos (SVG/PNG)  ← NEVER delete
  downloads/audiovector/{qr-series,r-5,r-series,trapeze}/   imported PDFs + cover.jpg
  products/ gallery/ fonts/Satoshi-Variable.woff2 icons/ logo.png og-image.jpg
tests/                 9 vitest files, 56 tests
.claude/               agents/ (15), skills/ (team, validate, safe-checkpoint), hooks/guard-bash.mjs, settings.json
deploy/nginx/          nginx templates    ·   deploy.sh backup-site.sh DISASTER-RECOVERY.md
asset-library/         master asset sources (heavy binaries gitignored; manifests committed)
  Master Assets/audiovector/Download-site/   ← OWNER'S MASTER SOURCE, untracked, read-only
brand-document-index/  688 official-doc URLs across 26 brands (research output)
```

---

# 4. Current production state

- **Live:** https://thesoundcorp.ir — behind **nginx HTTP Basic Auth** (`admin` / `731`),
  a pre-existing staging lock on BOTH the `:80` and `:8443` server blocks. Cloudflare fronts
  the origin (edge IPs 104.21.x). Removing the two `auth_basic*` lines would make the site
  fully public — **owner's decision, do not do it unprompted.**
- **Deployed commit:** `57fe106` (= `origin/master`). Verified live: 26 brand tiles,
  AudioVector "4 products · 9 documents", all covers + byte-exact PDFs return 200.
- **Server:** `ssh tsc-vps` → 45.91.169.245, root. App at `/var/www/thesoundcorp`
  (a **non-git deployed tree**), pm2 process `thesoundcorp` on **port 3100**,
  node v20.20.2, npm 11.17.0.
- **NOT deployed / not pushed:** `e7e6f5e` (the menu lab). It is local-only by design.

---

# 5. What is implemented

**Pages** — Home, About (bilingual editorial), Brands index + 26 brand pages, Products index
+ 12 product pages, Gallery (lightbox), Downloads (Download Center), Contact (Concept B with
GPU-smooth waveform + working form), localized 404/error.

**Download Center** (`/[locale]/downloads`) — Brands → Product → Documents explorer with
cross-cutting search and doc-type filters. **All 26 brands** are listed. Only **AudioVector**
currently has content: 4 models (QR-Series, R-5, R-Series, TRAPEZE), 4 real cover photos,
**9 PDFs served locally** from `public/downloads/audiovector/…` with their **exact original
filenames**. The other 25 brands are present with metadata but zero products (cleared on
owner instruction, awaiting their files).

**Two document delivery paths** (`lib/types/download.ts` — exactly one per document):
- `officialUrl` → REMOTE, streamed through `app/api/download/route.ts` (https-only,
  brand-domain allowlist re-checked on redirects, content-type validation, size cap,
  connect + stall timeouts). SSRF-safe: the client only ever sends ids.
- `localPath` → LOCAL file under `/public`, fetched directly (the proxy **404s** these).
  Links are `encodeURI()`d so filenames with spaces/parens work.

**Infrastructure** — 15-agent team + skills + safety-guard hook (`.claude/`), GitHub Actions CI
(lint · typecheck · test · build), one-command Ubuntu deploy (`deploy.sh`), dated backups
(`backup-site.sh`), `DISASTER-RECOVERY.md`, 56 tests, 25+ restore tags.

---

# 6. Design & UI decisions (and why)

- **Editorial/architectural luxury, not "web template".** Near-black surfaces (#000–#0a0b0d),
  white/near-white type, **one** gold accent `#f0b000` used sparingly as an accent — never a
  fill. No neon, no cyberpunk, no gaming UI, no rainbow iridescence.
- **Satoshi** self-hosted display face, preloaded per locale. Persian gets
  `letter-spacing: normal !important` (tracking breaks cursive joins) and display negative
  tracking is scoped to `[dir="ltr"]`.
- **Brand logos are normalized, not raw.** Two independent systems, deliberately separate:
  - `LOGO_SCALE` + `LOGO_LIGHTEN` (`lib/data/brand-logos.ts`) for the site-wide *Our Brands* grid.
    `LOGO_LIGHTEN = {borresen, aavik}` renders those two dark mono marks as reversed white via
    `brightness-0 invert` — **without it they are invisible on the near-black tiles.** Davis is
    deliberately NOT in the set (its PNG is a self-contained black badge that inversion destroys).
  - `DOWNLOAD_LOGO_SCALE` (`lib/data/download-logo-scale.ts`) for the Downloads brand grid only.
    Per-logo scale derived from each asset's true aspect ratio (equal-area target keyed to
    AUDES, the widest wordmark) over a fixed object-contain envelope box. Editing it affects
    Downloads only.
- **Downloads card standard** — see §12 (permanent rule).
- **Motion** is restrained and GPU-friendly: transform/opacity only, `prefers-reduced-motion`
  honoured everywhere, hero headline paints on first server render (CSS on-load animation, not
  a JS-gated reveal — that was an LCP bug).
- **Accessibility**: WCAG AA contrast (`text-muted` token = 5.6:1), real dialog semantics +
  `inert` background for overlays, ≥44px touch targets, focus traps, localized landmarks.

---

# 7. Persian (i18n) scope — IMPORTANT

Persian is for the **website UI and already-localized pages only** (nav, header, home, About,
Contact, Downloads chrome, gallery UI, error/404, metadata).

**Do NOT create or translate a Persian product catalogue.** Product data in
`lib/data/products.ts` (tagline, description, spec labels/values) and the Download Center
brand/category copy in `lib/data/downloads.ts` **stay English by design.** Do not add
`{en, fa}` variants for them. This was an explicit owner decision — any earlier audit item
saying "product catalogue is English-only (P0)" is **superseded and closed**.

Message-key parity between `messages/en.json` and `messages/fa.json` must be maintained
(currently 100%, ~250 leaf keys each, 19 top-level groups).

---

# 8. Menu Lab — current design exploration (ACTIVE TASK)

Route: **`/menu-lab`** (dev/LAN only, never linked from the site, `robots: noindex`).
Commit `e7e6f5e`, local-only. Purpose: the owner finds the production mobile menu "too basic,
conventional, flat, template-like" and asked for six radically different concepts to review
before anything is integrated.

Six independent, fully working prototypes — each owns its trigger, open **and reverse-close**
choreography, all 7 destinations, the 26-brand submenu, live search, EN/فارسی with RTL
mirroring, and a back-to-lab control in every state:

| # | Concept | File | Interaction philosophy |
|---|---------|------|------------------------|
| 01 | Holographic Strata | `ConceptStrata.tsx` `.cst-` | 7 glass sheets at different z-depths; drag travels through the stack with true parallax |
| 02 | Orbital Resonance | `ConceptOrbital.tsx` `.cor-` | Weighted dial, centre off-screen; momentum + friction + magnetic detents; geared inner ring for brands |
| 03 | Cinematic Editorial | `ConceptEditorial.tsx` `.ced-` | Oversized type on a rotating drum; letterbox shutter; mask-wipe reveals; brands filmstrip |
| 04 | Optical Glass | `ConceptGlass.tsx` `.cgl-` | 7 optical fins pivot from edge-on; drag rakes specular light across the array |
| 05 | Acoustic Resonance | `ConceptAcoustic.tsx` `.cac-` | Real damped-string sim (mode n=7); destinations at antinodes; touch excites the medium |
| 06 | Spatial Aperture | `ConceptAperture.tsx` `.cap-` | 8-blade iris + knurled focus ring; focus-pull through a depth stack with CoC falloff |

Shared: `components/menu-lab/{types.ts,data.ts}` (real nav + real 26 brands),
`app/menu-lab/{layout,page}.tsx` (+ `lab.css`). Concepts are **code-split** — only the opened
one downloads. Class prefixes are unique; no collisions.

**Status: awaiting the owner's verdict. Nothing has been integrated. Do not pick a winner.**

---

# 9. Tested & verified

- `npm run lint` · `npm run typecheck` · `npm run test` (**56/56**) · `npm run build` — all green
  at `e7e6f5e`.
- **Production build:** 98 static pages; `/menu-lab` builds as a static route.
- **Soft-404 fix** verified in a real production build: invalid product/brand slugs → 404 (en+fa),
  valid → 200.
- **Downloads assets:** all 4 covers + 9 PDFs return 200 with correct content-types and exact
  byte sizes, including filenames containing spaces and parentheses.
- **Mobile:** no horizontal overflow measured at **360, 375, 390, 430, 440, 768, 810, 1024**.
  The product-card centering fix was proven with a static probe against the real production CSS
  (before: card 121px wide, left 15 / right 254 — after: 360px, left 15 / right 15).
- **Live public site** verified over the internet with Desktop Chrome, iPhone Safari, iPhone
  Chrome, Android Chrome and iPad Safari user-agents — all 200, all showing the new version.
- **Menu lab:** all six concepts confirmed shipping (CSS + JS) in the production build output;
  platform-hazard sweep passed (no `filter: blur()` on large layers, `@supports`-guarded
  `backdrop-filter`, safe-area insets, `svh`+`vh` fallback, reduced-motion in all six).

---

# 10. Known bugs, limitations & unfinished work

**Content (needs the owner — not code)**
- Product photos: only 1/12 products has real images (`marten-dexter`).
- Product specs: 0/12 verified. Brand descriptions: 0/26. Gallery: 18 placeholder images.
- Downloads: 25 of 26 brands have no documents yet (intentionally cleared, awaiting files).

**Known issues**
- Two brands have **no confirmed official domain** in the research index (`audioflight`,
  `mastersound`) — `officialDomain` is optional and omitted for them.
- One source file, `Audiovector_QRSE_Brochure (1).pdf` (12 KB HTML-as-PDF), **disappeared from
  the owner's source folder** during the session — almost certainly antivirus quarantine of a
  suspicious HTML-as-PDF. It was invalid and deliberately excluded from the import. All 13 real
  source files are intact.
- Three AudioVector "Photo" files were originally bot-challenge HTML ("One moment, please…");
  the owner later replaced them with valid JPEGs. If new brand folders arrive, **always verify
  magic bytes**, never trust file extensions.
- The in-app browser pane in this environment **does not composite and runs tabs hidden**, so
  React state updates never commit and layout metrics read 0. Verify visually via LAN on a real
  device, or with a static HTML probe against the built CSS (see HANDOFF.md).
- `npm ci` on the server fails if `package-lock.json` drifts from `package.json` — the VPS was
  on npm 10.8.2 and rejected the v11 lockfile. The deploy script now self-upgrades npm to match
  `packageManager`. Keep the lockfile in sync (`npm install --package-lock-only`).

**Deferred / advisory (from the 15-agent audit, P2/P3)**
- Code-split the globally-mounted `CommandPalette` (it pulls PRODUCTS+BRANDS into every bundle).
- Add `sizes` to the header logo; preload the FA Vazirmatn font; add `Cache-Control`/`minimumCacheTTL`.
- Add a visual-regression baseline (Playwright) — it would have caught the logo bug automatically.
- Dead code: `SafeLink`, `PlaceholderSection`, `MagneticButton`, orphaned `contact-channels.ts` usage.
- Dependabot + `npm audit` in CI; enforce npm via corepack.
- The Claude GitHub Actions PR branch (`add-claude-github-actions-…`) is still open and needs a
  `CLAUDE_CODE_OAUTH_TOKEN` secret before merging.

---

# 11. Deployment, server & proxy configuration

**Topology:** Cloudflare → nginx (`/etc/nginx/sites-enabled/thesoundcorp.ir`, basic auth,
`proxy_pass http://127.0.0.1:3100`) → pm2 `thesoundcorp` → `next start` in `/var/www/thesoundcorp`.

**Proven repeatable deploy** — `/root/deploy-now.sh` on the VPS (already installed):
1. `git clone --depth 1 -b master <repo>` into `/tmp/tsc-deploy-<ts>`
2. Align npm to the repo's `packageManager` (`npm i -g npm@11.17.0`)
3. `rsync -a --delete` into `/var/www/thesoundcorp`, **excluding**
   `.git/ node_modules/ .next/ .env.local .env.production`
4. `npm ci` (falls back to `npm install`) → `npm run build`
5. `pm2 restart thesoundcorp --update-env && pm2 save`

Run it detached and watch the log:
```bash
ssh tsc-vps 'nohup setsid /root/deploy-now.sh >/dev/null 2>&1 & sleep 3; head -5 /root/deploy-now.log'
ssh tsc-vps 'tail -30 /root/deploy-now.log'
```
Backups land in `/root/backups/`. `.env.local` (SMTP secrets) and `.env.production` live **only
on the server** and are never overwritten by deploys.

**App env:** `ecosystem.config.cjs` sets `NODE_ENV=production`, `PORT=3100`,
`NEXT_PUBLIC_SITE_URL=https://thesoundcorp.ir`.

---

# 12. Downloads — permanent design standard

The approved Downloads workflow + premium visual direction is the standard for every future
brand/model import.
- **Model = folder**; the model name comes from the folder name. On new brand folders: inspect
  automatically → identify each product type → apply the correct card ratio → import images +
  documents into `public/downloads/<brand>/…` → preserve this styling → validate. Don't ask the
  user to repeat these rules. Brands arrive in batches of ~5–6 — process in parallel where safe.
- **Card image fill:** every product image FILLS its image area via `object-cover` (aspect ratio
  preserved — never stretched/distorted), intelligently centered; no awkward empty space. A model
  without a genuine image uses the branded placeholder — **never fabricate images.**
- **Card ratio by type** — `cardAspectClass()` in `lib/utils/downloads-view.ts`, keyed off
  `product.category`, used by `ProductTile` + `ProductHero`: SPEAKERS/default → portrait
  `aspect-[4/5]`; AMPLIFIERS/ELECTRONICS → `aspect-square`. Every card of the same type has
  identical dimensions; image areas, borders, spacing, titles, metadata and document rows align.
- **`w-full` on the ProductTile button is load-bearing** — a `<button>` is shrink-to-fit, so
  without it cards collapse to content width and sit left in their grid cell. Do not remove.
- **Mobile/tablet:** grid + cards horizontally centered with equal left/right spacing and NO
  horizontal overflow — iPhone/iOS Safari, Android/Chrome, iPad, common tablet widths. Solve
  structurally (`Container` mx-auto + responsive px; `mx-auto` grids; `grid-cols-1` on mobile),
  not with device hacks. Validate at multiple breakpoints.

# 13. PDF / document files — STRICT, byte-for-byte (permanent)

Use every provided PDF/document EXACTLY as given. Do NOT rename, edit contents, compress,
convert, rewrite metadata, alter version/date, generate a replacement, or change the filename
for presentation. You MAY ONLY: copy the original (byte-for-byte) into the correct
production-safe location under `public/`, link it to the right brand/model, and DISPLAY the
exact original filename. Keep the on-disk filename identical to the source (URL-encode when
linking — `encodeURI(localPath)`; never sanitize/rename). If a file is corrupt/invalid/not a
real document: report it, leave it untouched, and do not repair/replace/convert/rename unless
the user explicitly asks. **Always verify magic bytes (`%PDF`, `ffd8` JPEG) — never trust
extensions.**

---

# 14. Commands

```bash
npm run dev        # next dev -H 0.0.0.0  → http://localhost:3000 and http://<LAN-IP>:3000
npm run build      # production build (98 static pages)
npm run start      # serve the production build
npm run lint       # eslint
npm run typecheck  # tsc --noEmit
npm run test       # vitest run (56 tests)
npm run validate   # lint · typecheck · test · build in one command
```
Full gate before any important commit: **lint · typecheck · test · build**.

Browser-level tooling (Playwright e2e/a11y/visual, Lighthouse, bundle analysis, link
checking, Prettier, the read-only Obsidian MCP) is documented in **DEVELOPMENT_TOOLING.md**.
Two things there are load-bearing and easy to get wrong:
- `npm run analyze` uses Turbopack's `--experimental-analyze`. **Do not add
  `@next/bundle-analyzer`** — it is webpack-only and silently produces nothing here.
- `npm run format` would reformat 212 of 215 files. It has deliberately never been run;
  read §7 of that document before running it.

LAN IP is currently **192.168.1.6** (Wi-Fi). Detect it with:
```bash
powershell -NoProfile -Command "(Get-NetIPConfiguration | Where-Object { $_.IPv4DefaultGateway -ne $null -and $_.NetAdapter.Status -eq 'Up' }).IPv4Address.IPAddress"
```
If the LAN URL is unreachable it almost always means the dev server stopped — not a firewall
issue (an inbound allow rule for `node.exe` already exists for the Public profile).

---

# 15. Git — branches, commits, checkpoints

- **Remote:** `origin` = https://github.com/pouriadoc7-create/-thesoundcorp-web.git
  (note the leading `-` in the repo name).
- **`main`** = default branch, `968ee12` — content-identical to `origin/master`.
- **`master`** = working line, local `e7e6f5e`, **`origin/master` = `57fe106`**.
  → **`e7e6f5e` (menu lab) is the only unpushed commit.**
- Workflow used all session: commit on `master` → push `master` → propagate to `main` with a
  `--no-ff` merge from an isolated worktree (never rebase, never force).

**Key restore points** (tag → commit): `PRE-MENU-LAB-V1` → `57fe106` ·
`PRE-PROD-DEPLOY-V1` → `80f5dc9` · `PRE-AUDIOVECTOR-IMPORT-V1` → `3abdb16` ·
`PRE-DOWNLOADS-CLEAR-V1` → `ed874aa` · `PRE-P0P1-FIXES-V1` → `8d0a095` ·
`PRE-AGENT-TEAM-V1` / `PRE-GITHUB-SYNC-V1` → `dca6a07` · `FULL-SITE-RECOVERY-V1`.
Matching `backup/pre-*` branches exist for each. Plus 4 `archive/contact-b-*` branches.

---

# 16. Current task & recommended next steps

**Current task:** the owner is reviewing the six mobile-menu concepts at `/menu-lab` on an
iPhone 17 Pro Max and an Android phone. **Do not choose a winner, do not integrate, do not
delete the current menu.** Wait for an explicit approval naming a concept.

**When a concept is approved:**
1. `/safe-checkpoint` → tag + backup branch.
2. Port the approved concept into `components/layout/MobileNav.tsx` (or a new component the
   `Header` swaps in), wiring it to the **real** `NAV_LINKS`, `BRANDS`, next-intl `useTranslations`,
   `Link` from `@/i18n/navigation`, and the real `LocaleSwitcher` — the lab versions are
   self-contained prototypes with their own data and stubbed links.
3. Keep the production a11y contract: `role="dialog"`, `aria-modal`, `inert` background,
   focus trap, ≥44px targets, iOS scroll-lock, `prefers-reduced-motion`.
4. Full gate + real-device check, then commit. Ask before pushing/deploying.
5. Decide whether `/menu-lab` and the `proxy.ts` matcher entry stay or are removed.

**Other queued work (owner-supplied assets required):** product photos, product specs, brand
descriptions, and the remaining 25 brands' download files (batches of ~5–6 brands).

---

# 17. MUST NOT change or overwrite

- **The production mobile menu** — `components/layout/MobileNav.tsx`, `Header.tsx`,
  `lib/hooks/useMobileMenu.ts`, `LocaleSwitcher.tsx` — until a concept is explicitly approved.
- **`asset-library/Master Assets/**`** — the owner's master source files. Read/copy only.
  Never modify, rename, move or delete. (Intentionally untracked.)
- **Any PDF/document** — see §13. Byte-for-byte, exact filename, always.
- **Brand assets:** `public/brand-logos/`, `public/products/`, `public/gallery/`,
  `public/fonts/`, `public/icons/`, `public/downloads/`.
- **`LOGO_LIGHTEN`** in `lib/data/brand-logos.ts` — removing `borresen`/`aavik` makes those
  logos invisible (this regression has already happened once).
- **`dynamicParams = false`** on the two `[slug]` routes — removing it reintroduces soft-404s.
- **`w-full`** on the `ProductTile` button — removing it left-aligns every product card.
- **Recovery files:** `DISASTER-RECOVERY.md`, `deploy.sh`, `backup-site.sh`, `deploy/`.
- **Git history:** never force-push, never rewrite (`reset --hard`, `rebase`, `commit --amend`,
  `filter-branch`). Never delete `archive/*` or `backup/*` branches or `PRE-*` tags.
- **Server files:** `/var/www/thesoundcorp/.env.local` and `.env.production` (SMTP secrets).
- **`.env*`** locally — only `.env.example` is tracked.
- **nginx basic auth** — do not remove without the owner explicitly asking.

---

# 18. Development team & safety (permanent infrastructure)

This repo ships a **permanent 15-agent development team**. Definitions live in `.claude/agents/`,
reusable workflows in `.claude/skills/`, a safety guard in `.claude/hooks/`. All committed, so it
persists across sessions.

**Invoke:** `/team <task>` (Lead Architect decomposes, picks the smallest effective specialist
set, runs independent work in parallel with safe isolation, then validates + independent-reviews
before integrating) · `/validate` (lint · typecheck · test · build) · `/safe-checkpoint`
(non-destructive restore point, without touching uncommitted work).

**The 15:** `lead-architect` · `senior-frontend-engineer` · `ui-luxury-design-engineer` ·
`mobile-responsive-specialist` · `animation-interaction-engineer` · `brand-asset-manager` ·
`content-product-data-engineer` · `i18n-specialist` · `qa-regression-engineer` ·
`visual-regression-specialist` · `performance-engineer` · `seo-discoverability-engineer` ·
`accessibility-engineer` · `devops-github-ci-engineer` · `security-final-review-engineer`.

Do **not** activate all 15 for every task — pick the fewest that can deliver. Reviewers
(`qa-regression-engineer`, `visual-regression-specialist`, `security-final-review-engineer`) are
read-only and independent — they never rubber-stamp the implementer.

**Model strategy:** opus for `lead-architect`, `senior-frontend-engineer`,
`ui-luxury-design-engineer`, `security-final-review-engineer`; sonnet for most specialists;
haiku for routine asset inventory. Don't burn high-cost models on routine inspection.

**Non-negotiable safety rules (enforced by `.claude/hooks/guard-bash.mjs`):**
- Work only inside this repo — **never** from `C:\WINDOWS\system32` or outside paths.
- **Preserve all uncommitted local changes.** Never `stash`/`reset --hard`/`clean`/`checkout -- <path>`
  work you didn't create.
- **Never force-push. Never rewrite history** (`--force`, `push -f`, `reset --hard`, `rebase`,
  `commit --amend`, `filter-branch` are blocked by the guard).
- **Never delete** brand assets, logos, imagery, content, `archive/*` branches, restore tags, or
  recovery files without explicit user authorization.
- Keep the default/stable branch protected — do experimental work on a branch/worktree.
- **Create a restore point before every major integration; validate before every merge.**
- Use branches/worktrees to isolate parallel edits; never let two agents edit the same file at
  once without Lead coordination.

> The guard is fail-open and will block legitimate-looking commands that merely *mention*
> `.git` alongside `rm -rf`. Rephrase (avoid `rm -rf`; use explicit paths, no wildcards) rather
> than trying to defeat it.

# 19. Operating mode — SAFE FAST EXECUTION (permanent project priority)

Prioritize execution speed aggressively — but NEVER at the expense of correctness, safety,
design quality, mobile quality, accessibility, security, or data integrity.
- Reuse verified project knowledge, audit results, design rules, mappings, and prior decisions;
  don't re-inspect unchanged files or rediscover confirmed facts.
- Parallelize independent work when safe; use the 15-agent team only where parallelism genuinely
  saves time; skip extra review agents for small/low-risk changes.
- Batch related edits; use targeted checks while implementing, but run FULL validation —
  lint · typecheck · relevant tests · regression/security where applicable · production build —
  before every important commit or completed batch.
- Keep working messages brief; continue automatically; don't stop to explain intermediate steps
  unless there is a real blocker or a decision the user must make.
- Make reasonable safe decisions yourself. Preserve checkpoints/rollback. Never force-push or
  rewrite history. **NEVER push to GitHub or deploy until the user explicitly approves.**
