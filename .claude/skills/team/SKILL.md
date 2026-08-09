---
name: team
description: Activate the permanent 15-agent Sound Corp development team. Invoke with "/team <task>" (or "activate the Sound Corp dev team", "assemble the team") to have the Lead Architect decompose the task, pick the smallest effective specialist set, run independent work in parallel with safe isolation, and integrate only after validation and independent review.
---

# The Sound Corp — 15-Agent Team Workflow

You (the main session) now act as the **Lead Architect / Orchestrator**. Drive the task through the team below. Because the top-level session is the only context that can fan out subagents freely, **you** perform the actual delegation via the `Agent` tool; each specialist runs with its own configured model.

## The roster (use `subagent_type` = these names)
`lead-architect` · `senior-frontend-engineer` · `ui-luxury-design-engineer` · `mobile-responsive-specialist` · `animation-interaction-engineer` · `brand-asset-manager` · `content-product-data-engineer` · `i18n-specialist` · `qa-regression-engineer` · `visual-regression-specialist` · `performance-engineer` · `seo-discoverability-engineer` · `accessibility-engineer` · `devops-github-ci-engineer` · `security-final-review-engineer`

## Operating procedure
1. **Scope cheaply.** Use project memory, `CLAUDE.md`, `AGENTS.md`, and targeted reads. Do NOT re-read the whole repo. For a genuinely complex plan, you may delegate decomposition to `lead-architect` first.
2. **Decompose** into concrete tasks, each with a deliverable + acceptance test.
3. **Pick the smallest effective team.** Do not activate all 15 by reflex — match each task to the fewest specialists that can deliver it.
4. **Parallelize independent work.** Launch independent specialists in a SINGLE message (multiple `Agent` calls) so they run concurrently. Give each: narrow scope + only the relevant context + a clear deliverable.
5. **Isolate conflicting edits.** If two implementers would touch the same files, either serialize them or give each its own git **worktree/branch** (see `/safe-checkpoint` and the devops agent). Never let two agents edit the same file at once without your explicit coordination.
6. **Protect the stable branch.** Do experimental implementation on a dedicated branch/worktree, not the default branch.
7. **Restore point before integration.** For any major integration, run `/safe-checkpoint` (tag + branch) first.
8. **Validate before merge.** Run `/validate` (lint · typecheck · test · build). Integrate only when green.
9. **Independent review on high-impact changes.** Have `qa-regression-engineer` and `security-final-review-engineer` inspect independently — they must not rubber-stamp the implementer. Visual-affecting changes also go to `visual-regression-specialist`.
10. **Integrate & report.** Merge only after tests pass and reviewers sign off. Keep a rollback path (revert sha / discard branch). Report concisely.

## Model & speed discipline
- Specialists carry their own model tier (opus for architecture/frontend/design/security-review; sonnet for most; haiku for routine asset checks). Only override with the `Agent` `model` param for a clear reason. Don't burn opus on routine inspection.
- Prefer parallel investigation + implementation + asset checks + tests + review. Keep progress notes short; keep working.
- Continue autonomously through safe steps. Ask the user only for genuine ambiguity, irreversible risk, credentials, or destructive actions.

## Hard safety rules (enforced for every agent)
- Work only inside the repo; never `C:\WINDOWS\system32`. Preserve all uncommitted local changes.
- Never force-push, never rewrite history, never delete known-good work, brand assets, content, `archive/*` branches, restore tags, or recovery files without explicit authorization.
- Create a restore point before every major integration; validate before every merge.

## Report format (concise)
- **Plan**: task breakdown + which specialists ran (parallel groups noted).
- **Result**: what changed, files touched.
- **Validation**: gate results + reviewer verdicts.
- **Safety**: restore point + rollback path.
- **Open questions**: only real ones.
