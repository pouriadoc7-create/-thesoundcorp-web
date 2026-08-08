#!/usr/bin/env bash
# =============================================================================
# TheSoundCorp — make a timestamped backup archive of the deployable source.
#
# Produces one .tar.gz containing everything needed to rebuild the site, and
# NOTHING that is rebuildable or secret:
#   - EXCLUDED: node_modules, .next, .git, logs  (rebuilt from package-lock.json)
#   - EXCLUDED: .env / .env.local / .env.production  (real secrets — never archived)
#   - KEPT: all source, public assets, fonts, configs, .env.example, deploy files
#
# USAGE (from inside the project folder):
#     bash backup-site.sh                 # writes to ../thesoundcorp-backups/
#     bash backup-site.sh /path/to/dir    # or a folder you choose (e.g. a USB drive)
#
# Works on Windows (Git Bash), Linux and macOS. Restore = unpack, then follow
# DISASTER-RECOVERY.md (npm ci + npm run build re-creates node_modules/.next).
# =============================================================================
set -euo pipefail

PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
OUT_DIR="${1:-$PROJECT_DIR/../thesoundcorp-backups}"
mkdir -p "$OUT_DIR"

TS="$(date +%Y%m%d-%H%M%S)"
OUT="$OUT_DIR/thesoundcorp-web_${TS}.tar.gz"

# --force-local: allow a Windows path like C:/... as the output file (harmless on Linux).
tar --force-local -czf "$OUT" \
  --exclude='./node_modules' \
  --exclude='./.next' \
  --exclude='./.git' \
  --exclude='./out' \
  --exclude='./build' \
  --exclude='./coverage' \
  --exclude='*.log' \
  --exclude='./.env' \
  --exclude='./.env.local' \
  --exclude='./.env.*.local' \
  --exclude='./.env.production' \
  --exclude='./.env.development' \
  -C "$PROJECT_DIR" .

SIZE="$(du -h "$OUT" 2>/dev/null | cut -f1 || echo '?')"
printf "\n\033[1;32m✓ backup created:\033[0m %s  (%s)\n" "$OUT" "$SIZE"
echo "  Restore: unpack it, then follow DISASTER-RECOVERY.md (sudo bash deploy.sh)."
echo "  Reminder: real secrets are NOT in this archive — re-enter them in .env.local after restore."
