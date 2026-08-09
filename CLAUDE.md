@AGENTS.md

# The Sound Corp — Development Team & Safety

This repo ships a **permanent 15-agent development team** for fast, safe, parallel work. Definitions live in `.claude/agents/`, reusable workflows in `.claude/skills/`, and a safety guard in `.claude/hooks/`. All of it is committed, so the team persists across sessions.

## Invoke the team

- **`/team <task>`** — activate the full team workflow (Lead Architect decomposes, picks the smallest effective specialist set, runs independent work in parallel with safe isolation, then validates + independent-reviews before integrating). Natural-language triggers like "activate the Sound Corp dev team" also work.
- **`/validate`** — run the quality gates (lint · typecheck · test · build) and report pass/fail with real output. Use before any merge.
- **`/safe-checkpoint`** — create a non-destructive restore point (tag + backup branch) before a major integration, without touching uncommitted work.

## The 15 specialists (`.claude/agents/`)

`lead-architect` (orchestrator) · `senior-frontend-engineer` · `ui-luxury-design-engineer` · `mobile-responsive-specialist` · `animation-interaction-engineer` · `brand-asset-manager` · `content-product-data-engineer` · `i18n-specialist` · `qa-regression-engineer` · `visual-regression-specialist` · `performance-engineer` · `seo-discoverability-engineer` · `accessibility-engineer` · `devops-github-ci-engineer` · `security-final-review-engineer`.

The Lead Architect coordinates; **do not activate all 15 for every task** — pick the fewest that can deliver. Reviewers (`qa-regression-engineer`, `visual-regression-specialist`, `security-final-review-engineer`) are read-only and independent — they never rubber-stamp the implementer.

## Model strategy

Strongest reasoning (opus) for `lead-architect`, `senior-frontend-engineer`, `ui-luxury-design-engineer`, `security-final-review-engineer`. Faster/cost-efficient (sonnet) for most specialists; haiku for routine asset inventory (`brand-asset-manager`). Don't burn high-cost models on routine inspection.

## Non-negotiable safety rules (enforced by `.claude/hooks/guard-bash.mjs`)

- Work only inside this repo — **never** from `C:\WINDOWS\system32` or outside paths.
- **Preserve all uncommitted local changes.** Never `stash`/`reset --hard`/`clean`/`checkout -- <path>` work you didn't create.
- **Never force-push. Never rewrite history** (`--force`, `push -f`, `reset --hard`, `rebase`, `commit --amend`, `filter-branch` are blocked by the guard).
- **Never delete** brand assets, logos, imagery, content, `archive/*` branches, restore tags, or recovery files (`DISASTER-RECOVERY.md`, `deploy.sh`, `backup-site.sh`) without explicit user authorization.
- Keep the default/stable branch protected — do experimental work on a branch/worktree.
- **Create a restore point before every major integration; validate before every merge.**
- Use branches/worktrees to isolate parallel edits; never let two agents edit the same file at once without Lead coordination.
- Speed: parallelize independent work, give specialists only the context they need, reuse memory/CLAUDE.md/skills, keep progress notes short, and continue autonomously through safe steps — ask only for genuine ambiguity, irreversible risk, credentials, or destructive actions.

# Operating mode — SAFE FAST EXECUTION (permanent project priority)

Prioritize execution speed aggressively — but NEVER at the expense of correctness, safety, design quality, mobile quality, accessibility, security, or data integrity.
- Reuse verified project knowledge, audit results, design rules, mappings, and prior decisions; don't re-inspect unchanged files or rediscover confirmed facts.
- Parallelize independent work when safe; use the 15-agent team only where parallelism genuinely saves time; skip extra review agents for small/low-risk changes.
- Batch related edits; use targeted checks while implementing, but run FULL validation — lint · typecheck · relevant tests · regression/security where applicable · production build — before every important commit or completed batch.
- Keep working messages brief; continue automatically; don't stop to explain intermediate steps unless there is a real blocker or a decision the user must make.
- Make reasonable safe decisions yourself. Preserve checkpoints/rollback. Never force-push or rewrite history. NEVER push to GitHub until the user explicitly approves.

# Downloads — permanent design standard

The approved Downloads workflow + premium visual direction is the standard for every future brand/model import.
- **Model = folder**; the model name comes from the folder name. On new brand folders: inspect automatically → identify each product type → apply the correct card ratio → import images + documents into `public/downloads/<brand>/…` → preserve this styling → validate. Don't ask the user to repeat these rules. Brands arrive in batches of ~5–6 — process in parallel where safe.
- **Card image fill:** every product image FILLS its image area via `object-cover` (aspect ratio preserved — never stretched/distorted), intelligently centered; no awkward empty space. A model without a genuine image uses the branded placeholder — never fabricate images.
- **Card ratio by type** — `cardAspectClass()` in `lib/utils/downloads-view.ts`, keyed off `product.category`, used by `ProductTile` + `ProductHero`: SPEAKERS/default → portrait `aspect-[4/5]`; AMPLIFIERS/ELECTRONICS → `aspect-square`. Every card of the same type has identical dimensions; image areas, borders, spacing, titles, metadata, and document rows align consistently.
- **Mobile/tablet:** the grid + cards must be horizontally centered with equal left/right spacing and NO horizontal overflow/clipping — iPhone/iOS Safari, Android/Chrome, iPad/iPadOS, common tablet widths. Single-column cards sit centered; multi-column grids stay centered as a block. Solve structurally (`Container` mx-auto + responsive px; centered `mx-auto` grids; `grid-cols-1` on mobile), not with device hacks. Validate at multiple breakpoints.

# PDF / document files — STRICT, byte-for-byte (permanent)

Use every provided PDF/document EXACTLY as given. Do NOT rename, edit contents, compress, convert, rewrite metadata, alter version/date, generate a replacement, or change the filename for presentation. You MAY ONLY: copy the original (byte-for-byte) into the correct production-safe location under `public/`, link it to the right brand/model, and DISPLAY the exact original filename. Keep the on-disk filename identical to the source (URL-encode when linking; never sanitize/rename). If a file is corrupt/invalid/not a real document: report it, leave it untouched, and do not repair/replace/convert/rename unless the user explicitly asks.
