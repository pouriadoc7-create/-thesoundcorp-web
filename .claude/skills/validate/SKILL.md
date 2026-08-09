---
name: validate
description: Run the project quality gates (lint, typecheck, tests, and optionally the production build) and report pass/fail with real output. Use before merging or integrating any change on The Sound Corp site.
allowed-tools: Bash(npm run *), Bash(npx *), Read, Grep, Glob
---

# Validate — quality gates

Run the same gates CI runs, locally, and report honestly with the actual output. Never claim green without evidence.

## Steps
Run in order; capture results for each (a later gate failing does not erase earlier results):

1. **Lint** — `npm run lint`
2. **Typecheck** — `npm run typecheck`
3. **Tests** — `npm run test`
4. **Build** (for high-impact changes / before integration) — `npm run build`

For a fast pre-check you may run 1–3 and skip the build; always run the build before a **major integration**.

## Rules
- Do not modify source to force a gate to pass — report failures to the Lead / implementer.
- If a gate fails, include the exact failing output (test name, file:line, error) so it can be fixed.
- Preserve all uncommitted local changes; run read-only where possible.

## Output
- A short table: `gate` · `PASS/FAIL` · key detail.
- Overall verdict: **GREEN** (safe to integrate) or **RED** (blockers listed).
