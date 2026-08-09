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
