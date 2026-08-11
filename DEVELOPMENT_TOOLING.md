# Development Tooling

> Local quality tooling for TheSoundCorp. Installed and verified 2026-08-11.
> Companion to **CLAUDE.md** (operating manual) and **HANDOFF.md** (session history).

Everything here is **project-local** (`devDependencies` + `scripts/`). Nothing was
installed globally, and no application behaviour changed.

---

## 1. Command reference

| Command | What it does | Needs a build first? |
|---|---|---|
| `npm run dev` | Dev server on `0.0.0.0:3000` (+ LAN) | no |
| `npm run build` | Production build (Turbopack, 98 static pages) | — |
| `npm run start` | Serve the production build | yes |
| `npm run lint` | ESLint (Next core-web-vitals + TS + **full jsx-a11y**) | no |
| `npm run typecheck` | `tsc --noEmit` | no |
| `npm run test` | vitest — 56 unit tests | no |
| `npm run validate` | lint · typecheck · test · build (the full gate) | no |
| `npm run test:e2e` | Playwright: smoke · a11y · responsive · links | **yes** |
| `npm run test:e2e:build` | build, then the above (cold run) | no |
| `npm run test:e2e:ui` | Playwright's interactive UI runner | yes |
| `npm run test:visual` | Visual-regression baselines | yes |
| `npm run test:visual:update` | **Accept** visual changes as the new baseline | yes |
| `npm run audit:lighthouse` | Lighthouse on 6 pages, mobile (add `-- --desktop`) | yes |
| `npm run analyze` | Turbopack bundle treemap | no (builds itself) |
| `npm run check:links:external` | External link sweep (never fails CI) | yes + server |
| `npm run format` / `format:check` | Prettier — **see §7 before running `format`** | no |

Ports in use: **3000** dev · **3100** Playwright · **3101** Lighthouse / link check.
They are deliberately distinct so the three can run without colliding.

---

## 2. Playwright (e2e, a11y, responsive, visual)

Installed: `@playwright/test` + Chromium, Firefox, WebKit browsers.

Tests run against a **production build** (`next start`), never `next dev` — dev
splits CSS differently and injects HMR, which makes console-error assertions and
visual baselines unreliable.

```
e2e/
  routes.ts            shared page list + the 8 overflow widths
  smoke.spec.ts        200s, one <h1>, no console errors, locale dir/lang, real 404s
  a11y.spec.ts         axe-core WCAG 2.1 AA sweep + keyboard/focus-ring checks
  responsive.spec.ts   horizontal-overflow guard, 44px touch targets
  links.spec.ts        internal link graph + every local PDF resolves
  visual/pages.spec.ts pixel baselines, 2 viewports × 9 pages × 2 locales
```

**Projects:** `chromium`, `firefox`, `webkit`, `mobile-safari` (iPhone 15 Pro),
`mobile-chrome` (Pixel 7), and `visual`.

Suites that measure engine-independent facts (layout overflow, the link graph)
run on **chromium only** — running them five times would cost wall-clock without
adding signal. The a11y sweep runs on chromium + mobile-safari.

**Current status: 130 passed, 0 failed** across all engines (~9 min full sweep).

### Visual regression

36 baselines live in `e2e/visual/pages.spec.ts-snapshots/` and **are committed** —
they are the regression contract, not build output. They exist because the
Borresen/Aavik logo regression (removing `LOGO_LIGHTEN` made two dark marks
invisible on near-black tiles) shipped once and was caught only by eye.

Baselines were verified reproducible: a second consecutive run passed **37/37**.

> A failing visual test is not automatically a bug — an intentional redesign
> fails it too. Open `playwright-report/` and look at the diff image, then run
> `npm run test:visual:update` only once you have accepted the change.

Note the snapshots are named `…-win32.png`. Baselines are **platform-specific**;
a Linux CI runner would need its own set.

---

## 3. Accessibility

Two layers, deliberately:

1. **Static** — `eslint-plugin-jsx-a11y` is now an explicit devDependency with
   its full `recommended` ruleset on `app/**` and `components/**`.
   `eslint-config-next` only enables 6 of its rules; the full set is ~30.
2. **Runtime** — `@axe-core/playwright` scans the rendered DOM of all 18
   representative pages against `wcag2a, wcag2aa, wcag21a, wcag21aa`.

**Result: 0 axe violations** across every page in both locales.

The full ruleset surfaced 12 pre-existing findings in `Lightbox.tsx` and
`CommandPalette.tsx`. All 12 are the same false positive: a backdrop
click-to-close handler, and `stopPropagation` plumbing on presentational
wrappers. Both components already have `role="dialog"`, `aria-modal`, a focus
trap, Escape handling and real focusable buttons — a keyboard user loses
nothing. They carry a targeted `eslint-disable-next-line` **with the
justification written next to it**, not a blanket file-level disable.

Automated tooling catches roughly a third of real WCAG issues. It is a floor,
not a certificate — screen-reader flow and focus order still need a human.

---

## 4. Lighthouse

`npm run audit:lighthouse` builds nothing, starts the production server on 3101,
audits 6 pages and writes HTML + JSON to `.lighthouse/` (gitignored).

**Baseline captured 2026-08-11 (mobile):**

| Page | Perf | A11y | Best practices | SEO | LCP | CLS | TBT |
|---|---|---|---|---|---|---|---|
| `/en` | 90 | 98 | 100 | 92 | 3.3 s | 0 | 180 ms |
| `/fa` | **78** | 98 | 100 | 92 | 3.3 s | **0.265** | 120 ms |
| `/en/brands` | 90 | 100 | 100 | 92 | 3.5 s | 0 | 110 ms |
| `/en/products` | 92 | 100 | 100 | 92 | 3.0 s | 0 | 160 ms |
| `/en/downloads` | 93 | 100 | 100 | 92 | 3.1 s | 0 | 110 ms |
| `/en/contact` | 94 | 100 | 100 | 92 | 3.0 s | 0 | 100 ms |

> **Real finding: `/fa` has CLS 0.265** while every other page measures 0.
> That is a genuine layout shift on the Persian home page and the single
> clearest performance defect on the site. It is consistent with the already-
> noted "preload the FA Vazirmatn font" item in CLAUDE.md §10 — the Persian
> face swaps in after first paint and reflows the hero. **Not fixed here**
> (this session was tooling only).

### Browser selection — why it is not simply "Chrome"

`findChrome()` in `scripts/lighthouse.mjs` resolves, in order: `CHROME_PATH` →
Google Chrome → **Microsoft Edge** → Playwright's Chromium. Two hard-won
reasons for that order:

- **Google Chrome is not installed on this machine.** `npx playwright install
  chrome` runs the official installer and **failed — it needs Administrator**.
  (It still exits 0, so the exit code lies; read its output.) To get real
  Chrome, run from an elevated terminal:
  ```bash
  npx playwright install chrome
  ```
- **Playwright's Chromium cannot be launched standalone** on this machine — it
  fails with *"side-by-side configuration is incorrect"* because it depends on
  the environment Playwright's own launcher sets up. It works perfectly *under*
  Playwright, which is why the e2e suite is unaffected.

So the script launches the browser **through Playwright** and hands Lighthouse
the CDP port (`--port`). This also sidesteps a Windows-specific
`chrome-launcher` bug where it creates a temp profile it then cannot delete
(`EPERM`), failing the audit *after* measurement completed.

Lighthouse finds its browser via the `CHROME_PATH` **environment variable**;
there is no `--chrome-path` flag. Passing one is silently ignored.

---

## 5. Bundle analysis

`npm run analyze` → `.next/diagnostics/analyze/index.html`

**`@next/bundle-analyzer` is deliberately NOT used and has been uninstalled.**
It is a webpack plugin, and this project builds with **Turbopack** — wiring it
in produces no output while appearing to be configured, which is worse than not
having it. `next build --experimental-analyze` is Turbopack's own analyzer and
reports on the bundler that actually ships.

`npm run analyze` performs a full production build and overwrites `.next`. Run
`npm run build` afterwards if you need a clean tree for `npm start`/Playwright.

Known target from the audit backlog: `CommandPalette` is globally mounted and
pulls `PRODUCTS` + `BRANDS` into every client bundle. The analyzer will show it.

---

## 6. Link checking

- **Internal** — `e2e/links.spec.ts`, part of `npm run test:e2e`. Crawls every
  anchor on the representative pages and asserts each in-site target resolves.
  Also asserts **every local download returns HTTP 200 with a PDF content-type**,
  which protects the byte-for-byte document rule in CLAUDE.md §13.
- **External** — `npm run check:links:external`, a separate script that **always
  exits 0**. Third-party hosts rate-limit and block datacentre traffic, so a
  failure there is a prompt to look, not proof of a dead link. Requires a server
  on 3101.

---

## 7. Prettier — installed, NOT applied

Prettier is installed with a config matching the codebase's existing style
(double quotes, semicolons, trailing commas, 2-space, **printWidth 100**).

**`npm run format` has deliberately not been run across the repo.**
`prettier --check .` reports **212 of 215 tracked files** would be reformatted.
That is a whole-codebase rewrite in a single commit: it destroys `git blame` for
every line, makes any in-flight work conflict, and reviews as noise.

Only the files created in this session were formatted.

Your call, and it is genuinely a choice:

- **Leave as-is** (current state) — use `format:check` on new files only. Zero risk.
- **Adopt fully** — run `npm run format`, commit it *alone* with no other change,
  and add its SHA to `.git-blame-ignore-revs` so blame stays readable.

Do not half-adopt it: a formatter that runs on some files is worse than none.

---

## 8. Obsidian ↔ Claude Code (MCP)

`C:\Projects\obsidian-mcp\obsidian-mcp.mjs` — a zero-dependency, **read-only**
MCP stdio server exposing the local vault at `C:\thesoundcorp` to Claude Code.

Registered at **user scope** (`claude mcp add --scope user obsidian`), not in
this repo — vault access is personal and does not belong in version control.

| Tool | Purpose |
|---|---|
| `obsidian_search` | Full-text vault search (Persian/UTF-8 verified) |
| `obsidian_tree` | Depth-limited folder tree, for orienting |
| `obsidian_list` | List one folder |
| `obsidian_read` | Read one note |
| `obsidian_active_note` | The note currently open in Obsidian |

**Security properties**

- **No second copy of any secret.** The API key and certificate are read at
  startup from the Local REST API plugin's own `data.json`. There is no new
  credential file to protect, and a key rotation is picked up automatically.
- **TLS verification is enabled, not bypassed.** The plugin's certificate is the
  CA anchor *and* the connection is pinned by SHA-256 fingerprint.
- **Read-only by construction.** No write/delete/move/patch/command endpoint is
  implemented at all. This is not a flag that could be flipped — the capability
  does not exist in the process.
- Nothing but MCP protocol frames goes to stdout; no secret is ever logged.

**Verified**, not assumed — `node C:\Projects\obsidian-mcp\verify.mjs` runs 11
checks end-to-end (handshake, tool filtering, real note read, Persian search,
missing-file handling, write rejection). **11/11 passing.** `claude mcp list`
reports `✓ Connected`.

This is separate from, and does not touch, the ChatGPT OAuth bridge documented
in the vault at `19_AUTOMATION/CHATGPT_OBSIDIAN_BRIDGE.md`.

### Using the vault as the project brain

The point of this connection is that Claude Code can consult your own notes
before touching code, instead of you re-explaining context each session.

Ask in plain language — the tools resolve automatically:

- *"Search my vault for what we decided about the Downloads card ratios."*
- *"Read `19_AUTOMATION/CHATGPT_OBSIDIAN_BRIDGE.md` and tell me what's outstanding."*
- *"What's in my vault about the AudioVector import?"*

Practical notes:

- Start with `obsidian_search`; use `obsidian_tree` first only when you don't
  know what exists. Reading a whole folder note-by-note wastes context.
- **Writing back is not possible by design.** When a session produces something
  worth keeping, Claude will give you the markdown to paste in yourself. That is
  the intended trade-off: an automated agent can't silently rewrite your notes.
- Obsidian must be **running** — the plugin serves the API from inside the app.
  If the tools start failing, check Obsidian is open before debugging anything else.
- The repo's own long-term memory stays in `CLAUDE.md` / `HANDOFF.md`. The vault
  is for cross-project context; the repo files are for repo truth. Keep decisions
  that constrain the code in the repo, so they survive without the vault.

---

## 9. Figma — blocked, needs a human

**Not connected.** Figma desktop is running, but its Dev Mode MCP server is not
listening on `127.0.0.1:3845`.

The official server is enabled inside the app: **Figma → Preferences → Enable
local MCP server**, which requires a **Dev or Full seat on a paid Figma plan**.
Once it is listening:

```bash
claude mcp add --scope user --transport http figma http://127.0.0.1:3845/mcp
```

No third-party Figma MCP was installed. Every one of them requires a Figma
personal access token — a credential, on a paid account, from an unvetted
package. That is not a decision to make on your behalf.

---

## 10. Deployment impact

CI (`.github/workflows/ci.yml`) and `deploy.sh` both run `npm ci`, which installs
`devDependencies` — Next needs TypeScript and Tailwind at build time, so
`--omit=dev` is not an option.

**Consequence: Playwright, Lighthouse and Prettier now install on the VPS and in
CI**, adding roughly 126 packages to every deploy. Concretely:

- **Deploys still work** — nothing here changes the build or runtime.
- Browser binaries are **not** downloaded by `npm ci`; they need an explicit
  `npx playwright install`. The heavy part (~500 MB) stays off the server.
- Install time grows by a few tens of seconds.

If that ever matters, the clean fix is to move e2e tooling into its own
workspace package rather than trimming `npm ci`. Not needed today.

CI was **not** modified to run Playwright. Doing so needs a deliberate decision
about runners and Linux-specific visual baselines (§2).

---

## 11. Deliberately not installed

`Storybook` (excluded by request) · Docker · WSL · Python · any database ·
`cross-env` (a 12-line Node wrapper does the job on Windows) ·
`@next/bundle-analyzer` (webpack-only — see §5) · any paid service ·
any third-party Figma MCP (see §9).
