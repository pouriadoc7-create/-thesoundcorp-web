#!/usr/bin/env node
/**
 * Sound Corp team safety guard (PreToolUse hook for Bash / PowerShell).
 *
 * Blocks a small, well-defined set of DESTRUCTIVE or history-rewriting commands
 * that violate the team's safety contract. Everything else is allowed.
 *
 * Contract: read hook JSON on stdin; exit 2 + stderr message to BLOCK; exit 0 to ALLOW.
 * Fail-OPEN: any parsing/internal error allows the command (a guard bug must never
 * lock the user out of their own repo).
 *
 * Docs: https://code.claude.com/docs/en/hooks
 */

function allow() { process.exit(0); }
function block(reason) {
  process.stderr.write(
    "\u26D4 BLOCKED by Sound Corp safety guard:\n  " + reason +
    "\n  (Never force-push, rewrite history, or delete known-good work/assets/branches/tags/recovery files.\n" +
    "   If this is truly intended, run it yourself in a terminal outside Claude, or ask the user to authorize it explicitly.)\n"
  );
  process.exit(2);
}

let input = "";
try {
  process.stdin.setEncoding("utf8");
  for await (const chunk of process.stdin) input += chunk;
} catch { allow(); }

let cmd = "", cwd = "";
try {
  const data = JSON.parse(input || "{}");
  cmd = String(data?.tool_input?.command ?? "");
  cwd = String(data?.cwd ?? "");
} catch { allow(); }

if (!cmd.trim()) allow();

const c = cmd; // case-sensitive source
const L = cmd.toLowerCase();

// Protected paths (case-insensitive) — assets, recovery, git internals.
const PROTECTED = [
  "public/brand-logos", "public/products", "public/gallery", "public/fonts",
  "public/icons", "public/logo", "public/og-image",
  "assets/master", "asset-library", "design-archive", "brand-document-index",
  "deploy/", "disaster-recovery.md", "deploy.sh", "backup-site.sh",
  ".git/", ".github/",
].map(p => p.toLowerCase());
const hasProtected = PROTECTED.some(p => L.includes(p)) || /(^|[\s"'\/\\])\.git(\s|$|["'\/\\])/.test(L);

// Dangerous filesystem targets (root, home, wildcard, parent, current dir).
const dangerousTarget = /(^|[\s=])(\/|~|\*|\.\.|\.)(\s|$|["'])/.test(c);

const rules = [
  // --- working location ---
  { hit: () => /system32/i.test(c) || /system32/i.test(cwd),
    why: "operating in or referencing C:\\WINDOWS\\system32 — work only inside the thesoundcorp-web repo." },

  // --- git history rewrite / force ---
  { hit: () => /\bgit\b[^\n]*\bpush\b[^\n]*(--force(-with-lease)?|(^|\s)-f(\s|$))/i.test(c),
    why: "force-push is forbidden (`git push --force`/`-f`)." },
  { hit: () => /\bgit\b[^\n]*\bpush\b[^\n]*\s\+[^\s:]+:/.test(c),
    why: "force-push via a `+refspec` is forbidden." },
  { hit: () => /\bgit\b[^\n]*\bpush\b[^\n]*(--mirror|--prune)/i.test(c),
    why: "`git push --mirror`/`--prune` can delete remote refs — forbidden." },
  { hit: () => /\bgit\b[^\n]*\breset\b[^\n]*--hard/i.test(c),
    why: "`git reset --hard` discards work — forbidden. Use a new commit or `git revert`." },
  { hit: () => /\bgit\b[^\n]*\brebase\b/i.test(c) && !/--(abort|quit)/i.test(c),
    why: "rebase rewrites history — forbidden. Reconcile with a merge instead." },
  { hit: () => /\bgit\b[^\n]*\bcommit\b[^\n]*--amend/i.test(c),
    why: "`git commit --amend` rewrites history — forbidden. Make a new commit." },
  { hit: () => /\bgit\b[^\n]*\bfilter-branch\b/i.test(c) || /\bgit[-\s]filter-repo\b/i.test(c),
    why: "history filtering is forbidden." },
  { hit: () => /\bgit\b[^\n]*\breflog\b[^\n]*expire/i.test(c) || /\bgit\b[^\n]*\bgc\b[^\n]*prune=/i.test(c),
    why: "expiring the reflog / pruning now can destroy recovery points — forbidden." },

  // --- discarding uncommitted work ---
  { hit: () => /\bgit\b[^\n]*\bcheckout\b[^\n]*(--force|(^|\s)-f(\s|$))/i.test(c),
    why: "`git checkout --force`/`-f` discards uncommitted changes — forbidden." },
  { hit: () => /\bgit\s+checkout\s+(--\s+)?\.(\s|$)/.test(c) || /\bgit\s+checkout\s+--\s+\S/.test(c),
    why: "`git checkout -- <path>`/`checkout .` discards uncommitted changes — forbidden. Preserve local work." },
  { hit: () => /\bgit\s+restore\b/.test(c) && (!/--staged/.test(c) || /(--worktree|(^|\s)-W\b)/.test(c)),
    why: "`git restore` on the working tree discards uncommitted changes — forbidden (only `git restore --staged` is allowed)." },
  { hit: () => /\bgit\s+clean\b/i.test(c) && /-[a-z]*[fdx]/i.test(c),
    why: "`git clean -f/-d/-x` deletes untracked/ignored files (incl. uncommitted new work) — forbidden." },

  // --- deleting protected branches / tags (local or remote) ---
  { hit: () => /\bgit\s+branch\s+(-D|-d|--delete)\b[^\n]*(archive\/|backup\/|\bmain\b|\bmaster\b)/i.test(c),
    why: "deleting a protected branch (archive/*, backup/*, main, master) is forbidden." },
  { hit: () => /\bgit\s+push\b[^\n]*(--delete|:\s*refs\/heads\/|\s:)[^\n]*(archive\/|backup\/|\bmain\b|\bmaster\b)/i.test(c),
    why: "deleting a protected branch on the remote is forbidden." },
  { hit: () => /\bgit\s+tag\s+(-d|--delete)\b[^\n]*(PRE-|FULL-SITE-|RECOVERY|-V\d)/i.test(c),
    why: "deleting a restore-point tag (PRE-*, *-V<n>, *RECOVERY*) is forbidden." },
  { hit: () => /\bgit\s+push\b[^\n]*(--delete|:refs\/tags\/)[^\n]*(PRE-|FULL-SITE-|RECOVERY|-V\d)/i.test(c),
    why: "deleting a restore-point tag on the remote is forbidden." },

  // --- filesystem deletion (bash) ---
  { hit: () => /\brm\b[^\n]*\s-[a-z]*[rf]/i.test(c) && (hasProtected || dangerousTarget),
    why: "recursive/force `rm` targeting a protected path, the repo root, or a wildcard — forbidden." },

  // --- filesystem deletion (PowerShell) ---
  { hit: () => /(remove-item|\bri\b|\brmdir\b|\brd\b|\bdel\b|\berase\b)/i.test(c) &&
               (hasProtected || (/-recurse/i.test(c) && dangerousTarget)),
    why: "PowerShell delete (Remove-Item/rd/del ...) targeting a protected path or recursively at a dangerous root — forbidden." },
];

for (const r of rules) {
  let matched = false;
  try { matched = r.hit(); } catch { matched = false; }
  if (matched) block(r.why);
}

allow();
