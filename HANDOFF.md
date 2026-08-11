# Session Handoff — 2026-08-09 → 2026-08-10

Chronological record of this session for a fresh Claude Code instance.
**Read `CLAUDE.md` first** — it is the operating manual. This file is the story and the
hard-won context that isn't obvious from the code.

Session start: `master` @ `dca6a07`, no git remote, 3 uncommitted WIP files.
Session end: `master` @ `e7e6f5e`, clean tree, deployed to production at `57fe106`.

---

## 1. Connected the repo to GitHub (safely)

The local repo had **no remote**. The GitHub repo already existed with an unrelated history
(an initial `README.md` commit + an open Claude-Actions PR branch).

- Created restore points, then reconciled with `git merge --allow-unrelated-histories` in an
  **isolated worktree** so the working tree (and its 3 uncommitted WIP files) was never touched.
- Resolved the single `README.md` conflict in favour of the real project README; the remote's
  initial commit is preserved as a merge parent.
- Pushed `main` (fast-forward), then `master`, all 4 `archive/*` branches, the `claude/*`
  worktree branch, and all 37 tags. **No force-push, no history rewrite** — this held for the
  entire session.
- Left the `add-claude-github-actions-…` PR branch **untouched** (it still needs a
  `CLAUDE_CODE_OAUTH_TOKEN` secret before it can be merged).

## 2. Built the permanent 15-agent team

Created `.claude/agents/` (15 specialists), `.claude/skills/` (`team`, `validate`,
`safe-checkpoint`), and `.claude/hooks/guard-bash.mjs` — a fail-open PreToolUse guard that
blocks force-push, history rewrites, working-tree discards, and deletion of protected
assets/branches/tags/recovery files. Tested 25/25 block-and-allow cases.

**Gotcha discovered:** newly-written agent definitions are **not selectable in the session that
creates them** — the registry loads at session start. Until reload, orchestrate via the built-in
`Explore`/`general-purpose` agents with a role prompt. (They *are* available now.)

**Second gotcha:** the guard blocked two of my own legitimate commands because the script text
contained `rm -rf` near a `.git` reference. Working as designed — I rephrased with explicit
paths and no wildcards rather than defeating it.

## 3. Full 15-agent read-only audit

Ran all 15 specialists in parallel over the running site and produced one deduplicated P0–P3
backlog. Independent QA confirmed 54/54 tests green; security returned APPROVE-WITH-CONDITIONS.

## 4. Fixed every code-fixable P0/P1

Commit `7db2c82`:
- **P0 soft-404** — invalid `/products/[slug]` and `/brands/[slug]` returned HTTP **200**, not
  404. Root cause: `dynamicParams` defaults to `true`, committing a 200 before `notFound()` runs.
  Fixed with `export const dynamicParams = false` + `generateStaticParams()`. Verified in a real
  production build.
- **Contact form a11y** — `contact.form.validation` existed in both locale files but was **never
  referenced**; the submit button silently disabled itself with no explanation. Wired up with
  `aria-required`/`aria-invalid`/`role="alert"`.
- **Security** — the contact API rate-limit keyed off the *leftmost* `X-Forwarded-For` hop, which
  is client-spoofable (rotate it → unlimited buckets). Now prefers `CF-Connecting-IP`, else the
  *rightmost* XFF hop. Independent security review flagged the Cloudflare case; I closed it.
- **A11y contrast** (`text-zinc-600` at 2.72:1 → AA), **mobile-nav dialog semantics** +`inert`
  background, **≥44px touch targets**, **iOS scroll-lock** (`position:fixed` + restore),
  **LCP** (hero H1 was `opacity:0` until hydration → now a CSS on-load animation), **About coda
  i18n**.

Then `67c0979`: restored `LOGO_LIGHTEN = {borresen, aavik}`. The owner's WIP had removed logo
lightening entirely — correct for 24 marks and for Davis (a self-contained black badge that
inversion destroys), but it made Borresen (navy) and Aavik's maroon icon **invisible** on the
near-black tiles. Minimal allowlist restored; verified via computed style.

## 5. Downloads rebuild (owner-directed, several steps)

1. **`43e6394`** — cleared every brand's products/documents **except AudioVector** (192 products
   / 321 documents removed) so the owner could supply correct files. All 26 brand entries and
   metadata kept.
2. **`f3437df`** — expanded the Downloads brand list from 17 to **all 26** brands. Official
   domains came from the existing `brand-document-index/` research; `audioflight` and
   `mastersound` genuinely have **no confirmed domain**, so `officialDomain` became optional
   rather than inventing one. This deliberately re-added TEAC and Marten, which an old test had
   asserted were excluded.
3. **`3abdb16`** — normalized Downloads logo sizes to a balanced grid keyed to AUDES
   (`DOWNLOAD_LOGO_SCALE`), derived from each asset's measured aspect ratio.
4. **`7c08956`** — imported AudioVector from the owner's `Download-site` folder.
5. **`8e38b2f`** — applied the new permanent standard (see below).
6. **`8171017`** — real cover images for all 4 models.
7. **`c89a207` / `80f5dc9`** — mobile centering (see §7).

### The AudioVector import — important forensics
Source: `asset-library/Master Assets/audiovector/Download-site/` — 4 model folders, each with
`Photo/` and `PDF/`.

**I validated magic bytes, not extensions — and that mattered enormously:**
- 3 of 4 "Photo" `.jpg`/`.htm` files were actually **HTML bot-challenge pages** ("One moment,
  please…"). I inspected them for recoverable image URLs at the owner's request: no `og:image`,
  no CDN URL, no embedded data. **0 images recoverable** — so those models used the branded
  placeholder rather than fabricating anything. The owner later supplied 3 valid JPEGs, which
  I imported (`8171017`).
- One `Audiovector_QRSE_Brochure (1).pdf` was a **12 KB HTML-as-PDF** — excluded. It later
  **vanished from the owner's source folder**; I only ever ran `cp`/read commands, so the cause
  is almost certainly antivirus quarantine of a suspicious HTML-as-PDF. Reported, not hidden.

**PDF rule correction:** my first import sanitized PDF filenames (`qr-se-manual-2023.pdf`) and
prettified their display. When the owner issued the strict byte-for-byte rule, I re-imported all
9 PDFs under their **exact original filenames** (git recorded them as pure renames) and reverted
the display cleanup. Local links are `encodeURI()`d so names with spaces/parens work.

**Local vs remote documents:** `officialUrl` (remote, proxied) and `localPath` (local, static)
are now mutually exclusive per document; `app/api/download/route.ts` **404s** local docs since
the proxy exists only for remote files. The proxy test suite was rewritten to mock
`findDocument`, so full remote-path security coverage survives even though the live catalogue is
now 100% local.

## 6. Deployed to production

Commit `57fe106` is live. The deploy had one **real blocker**: `npm ci` failed on the server
because the VPS ran **npm 10.8.2** while the repo declares `packageManager: npm@11.17.0`, and
npm 10 rejected the v11 lockfile (`Missing: @swc/helpers`). I fixed the lockfile in the repo
(`npm install --package-lock-only`, `package.json` untouched) and made `/root/deploy-now.sh`
self-align npm. **No downtime** — the old build kept serving until the new one succeeded.

Verified the **real public site** (not localhost) with Desktop/iPhone-Safari/iPhone-Chrome/
Android/iPad user-agents: all 200, 26 brand tiles, AudioVector "4 products · 9 documents", all
covers and byte-exact PDFs 200.

**The site returns 401 publicly** — pre-existing nginx Basic Auth (`admin`/`731`), not something
this session introduced. I did **not** remove it; that's the owner's call.

## 7. The mobile-centering bug — worth reading

The owner reported product cards stuck to the left on iPhone. My **first fix was wrong**: I
centered text, wrappers and grids, which didn't help because the card box itself was narrow.

**Actual root cause:** `ProductTile`'s root is a `<button>`, which is **shrink-to-fit**. With no
explicit width it collapsed to its intrinsic content width and sat at the *start* of its grid
cell — percentage-width children (the aspect-ratio image stage) contribute nothing to intrinsic
width. `BrandTile` already had `w-full`, which is exactly why brand tiles looked fine and only
product cards were broken.

Fix: `w-full` on the button + `justify-items-center` on the mobile grid. **Proven with a static
HTML probe** against the real production CSS: before → card 121px, left 15 / right 254; after →
360px, left 15 / right 15. Tablet unchanged (2 × 350.25px tracks, `justify-items: stretch`).

**This probe technique is the workaround for this environment** (see §9) — build a static page
that includes the built CSS plus the exact markup, load it in the pane, and measure. Layout
computes even though React state does not.

## 8. Menu Lab (the current task)

The owner wants the mobile menu completely rethought — "too basic, conventional, flat,
template-like". I scaffolded an isolated `/menu-lab` route and ran **six `ui-luxury-design-engineer`
agents in parallel**, each owning one concept and its own prefixed stylesheet (disjoint files, so
no collisions). Commit `e7e6f5e`, **local-only, not pushed, not deployed**.

Two lint issues I fixed after integration (React Compiler `react-hooks/immutability` +
`react-hooks/refs`): Orbital mutated a cross-render cache during render — rewritten as a pure
derivation where a filtered-out brand inherits the nearest preceding visible seat; Editorial
mutated `linesRef.current` elements via an iterator — switched to the indexed-access pattern the
linter already accepts elsewhere in that file.

Notable engineering from the agents:
- **Glass** structurally avoids the Safari 3D-transform + `backdrop-filter` bug: exactly one
  `backdrop-filter`, on a flat untransformed sheet; every rotated fin is gradients + inset
  shadows; `transform-style: preserve-3d` avoided entirely.
- **Aperture** numerically verified blade coverage at 8 viewport sizes (closed = 100.0%, no
  corner light leak; open = 0.0%) before shipping.
- **Acoustic** implements a genuine damped-string simulation (leapfrog integration of
  `u_tt = c²u_xx − γu_t`, frame-rate independent, 4 `setAttribute` calls/frame, loop halts when
  settled or the tab is hidden).
- **Editorial** treats Persian as its own setting (own size ramp, leading, Persian numerals,
  mirrored wipe) rather than a swap; **Glass** rotates the whole louvre 90° in `fa` instead of
  rotating Persian glyphs.

**Status: awaiting the owner's verdict. No winner chosen, nothing integrated.**

## 9. Environment quirks a fresh session must know

- **The in-app browser pane does not composite and runs tabs `hidden`.** Consequences: React
  state updates never commit (the scheduler needs rAF), `offsetWidth`/`getBoundingClientRect`
  read 0, lazy images never load, and navigation often bounces back to the site root. You
  **cannot** click through an interactive prototype here. Use: LAN URL on a real device, static
  HTML probes for layout, `curl` for status/HTML, and grep of the built CSS/JS for "did this
  actually ship".
- **Git Bash eats backslashes** in `node -e "…"` one-liners — CSS-escaping checks (`.sm\:flex-row`)
  silently false-negative. Write the script to a file and run it instead.
- **Dev CSS is split**, so a class missing from the initial stylesheet proves nothing. Check
  `.next/static/**/*.css` after a production build.
- Combining `lint`, `typecheck` and `test` in one Bash call can exceed the 2-minute default
  timeout — run tests separately with a longer timeout.
- LAN IP is **192.168.1.6**; "LAN unreachable" has always meant the dev server stopped, never a
  firewall problem.

## 10. Owner's standing rules (learned this session)

- **SAFE FAST EXECUTION** — speed is a top priority, never at the cost of correctness, safety,
  design, mobile, a11y, security or data integrity. Batch edits, full validation before commits,
  brief messages, keep going autonomously.
- **Never push or deploy without explicit approval.** Every commit this session waited for a
  "push it" before reaching GitHub.
- **PDFs are sacred** — byte-for-byte, exact filenames, always (§13 of CLAUDE.md).
- **Persian is UI-only** — do not translate the product catalogue or download copy.
- **Downloads standard is permanent** — apply it automatically to future brand batches
  (~5–6 brands at a time) without being re-told.

## 11. Where things stand

- Working tree **clean**. `master` = `e7e6f5e`; `origin/master` = `57fe106`; `main` = `968ee12`.
- **`e7e6f5e` (menu lab) is the only unpushed commit.** Production runs `57fe106`.
- Dev server was left running on port 3000 (localhost + LAN) for the owner's menu-lab review.
- Immediate next step: **wait for the owner to name an approved concept**, then follow the
  integration steps in CLAUDE.md §16.
