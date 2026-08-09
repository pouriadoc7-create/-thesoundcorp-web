---
name: safe-checkpoint
description: Create a safe, non-destructive restore point (git tag + backup branch) before a major integration on The Sound Corp site, without touching uncommitted work. Use before merging experimental work into a protected branch.
allowed-tools: Bash(git *), Read
---

# Safe checkpoint — restore point before integration

Create a durable rollback point **without** disturbing the working tree or history. This never stashes, resets, or discards anything.

## Steps
1. Confirm location is the repo (not `C:\WINDOWS\system32`): `pwd` / `git rev-parse --show-toplevel`.
2. Note the current tip and record uncommitted changes (leave them untouched): `git status -sb`.
3. Pick a name: `PRE-<CHANGE>-V<N>` (e.g. `PRE-HERO-REDESIGN-V1`). Ensure it doesn't already exist (`git tag -l`, `git branch --list`).
4. Create the restore point at the branch you're about to integrate INTO (default: current stable tip):
   - `git tag PRE-<CHANGE>-V<N> <ref>`
   - `git branch backup/pre-<change> <ref>`
5. Verify: `git show-ref --tags PRE-<CHANGE>-V<N>` and `git show-ref refs/heads/backup/pre-<change>`.

## Rules
- **Never** force-push, rewrite history, reset, or delete existing tags/branches.
- **Never** stash/checkout/clean to create the checkpoint — uncommitted changes must remain exactly as they were.
- Backups are additive and local by default; push them only if the user wants an off-machine copy (no force).

## Output
- The restore point name(s) + the sha they point to.
- The exact **rollback command** to use if the integration must be undone (e.g. `git reset --keep <tag>` on a throwaway branch, or `git revert <merge-sha>` — prefer `revert` to preserve history).
- Confirmation that uncommitted changes are untouched.
