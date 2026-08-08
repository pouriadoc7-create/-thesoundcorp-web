#!/usr/bin/env bash
# =============================================================================
# TheSoundCorp — one-command production deploy for a fresh Ubuntu server.
#
# Brings the site up EXACTLY as it runs today: Node 20 + `next start` on a port,
# managed by PM2 (auto-restart + start-on-boot), behind an nginx reverse proxy,
# with optional free HTTPS via Let's Encrypt.
#
# Safe to run more than once (idempotent): it checks before it installs, reloads
# instead of duplicating, and tests the nginx config before applying it.
#
# USAGE (from inside the project folder, on the new server):
#     sudo bash deploy.sh
#
# Common options (environment variables, all optional):
#     DOMAIN=thesoundcorp.ir            # site domain (default: thesoundcorp.ir)
#     PORT=3100                         # port the app listens on (default: 3100)
#     SETUP_NGINX=yes|no                # configure nginx reverse proxy (default: yes)
#     RUN_CERTBOT=yes|no                # obtain HTTPS cert via Let's Encrypt (default: no)
#     CERTBOT_EMAIL=you@example.com     # required if RUN_CERTBOT=yes
#     SKIP_APT=yes|no                   # skip system package install on re-runs (default: no)
#
# Example — full first deploy WITH HTTPS (DNS for the domain must already point here):
#     sudo DOMAIN=thesoundcorp.ir RUN_CERTBOT=yes CERTBOT_EMAIL=you@example.com bash deploy.sh
#
# See DISASTER-RECOVERY.md for the full step-by-step (including secrets + SSL).
# =============================================================================
set -euo pipefail

# ---- config (with sensible defaults) ----------------------------------------
DOMAIN="${DOMAIN:-thesoundcorp.ir}"
PORT="${PORT:-3100}"
SETUP_NGINX="${SETUP_NGINX:-yes}"
RUN_CERTBOT="${RUN_CERTBOT:-no}"
CERTBOT_EMAIL="${CERTBOT_EMAIL:-}"
SKIP_APT="${SKIP_APT:-no}"
NODE_MAJOR=20
APP_NAME="thesoundcorp"

PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$PROJECT_DIR"

# ---- pretty logging ---------------------------------------------------------
say()  { printf "\n\033[1;36m==>\033[0m \033[1m%s\033[0m\n" "$*"; }
ok()   { printf "    \033[1;32m✓\033[0m %s\n" "$*"; }
warn() { printf "    \033[1;33m!\033[0m %s\n" "$*"; }
die()  { printf "\n\033[1;31m✗ ERROR:\033[0m %s\n" "$*" >&2; exit 1; }
trap 'die "deploy failed on line $LINENO. Nothing was force-changed after this point; fix the issue and re-run — the script is safe to repeat."' ERR

[ "$(id -u)" = "0" ] || die "Please run with sudo:  sudo bash deploy.sh"
command -v apt-get >/dev/null 2>&1 || die "This script targets Ubuntu/Debian (apt-get not found)."

say "TheSoundCorp deploy"
echo "    project : $PROJECT_DIR"
echo "    domain  : $DOMAIN"
echo "    port    : $PORT"
echo "    nginx   : $SETUP_NGINX      certbot: $RUN_CERTBOT"

# ---- 1. system packages -----------------------------------------------------
if [ "$SKIP_APT" != "yes" ]; then
  say "1/9  Installing system dependencies"
  export DEBIAN_FRONTEND=noninteractive
  apt-get update -y >/dev/null
  apt-get install -y ca-certificates curl gnupg git ufw >/dev/null
  ok "base tools ready"
else
  say "1/9  Skipping apt (SKIP_APT=yes)"
fi

# ---- 2. Node.js 20 ----------------------------------------------------------
say "2/9  Ensuring Node.js ${NODE_MAJOR}.x"
need_node=yes
if command -v node >/dev/null 2>&1; then
  cur="$(node -v | sed 's/v\([0-9]*\).*/\1/')"
  [ "$cur" -ge "$NODE_MAJOR" ] && { need_node=no; ok "node $(node -v) already installed"; }
fi
if [ "$need_node" = "yes" ]; then
  [ "$SKIP_APT" = "yes" ] && die "Node ${NODE_MAJOR}+ required but SKIP_APT=yes. Re-run without SKIP_APT."
  curl -fsSL "https://deb.nodesource.com/setup_${NODE_MAJOR}.x" | bash - >/dev/null
  apt-get install -y nodejs >/dev/null
  ok "installed node $(node -v)"
fi

# ---- 3. PM2 -----------------------------------------------------------------
say "3/9  Ensuring PM2 (process manager)"
if command -v pm2 >/dev/null 2>&1; then ok "pm2 $(pm2 -v) already installed"; else
  npm install -g pm2 >/dev/null; ok "installed pm2 $(pm2 -v)"
fi

# ---- 4. secrets / env -------------------------------------------------------
say "4/9  Environment file (.env.local)"
if [ -f .env.local ]; then
  ok ".env.local already present (left untouched)"
else
  cp .env.example .env.local
  warn "created .env.local from .env.example — fill in SMTP_PASS etc. later"
  warn "the contact form falls back to a mailto link until SMTP is set (see DISASTER-RECOVERY.md)"
fi

# ---- 5. install deps + build ------------------------------------------------
say "5/9  Installing packages from lockfile (npm ci)"
npm ci >/dev/null
ok "dependencies installed reproducibly"

say "6/9  Building the site (npm run build)"
# NEXT_PUBLIC_SITE_URL is baked in at build time; default it to this domain.
export NEXT_PUBLIC_SITE_URL="${NEXT_PUBLIC_SITE_URL:-https://$DOMAIN}"
npm run build >/dev/null
ok "production build complete"

# ---- 6. start under PM2 + persist across reboot -----------------------------
say "7/9  Starting the app under PM2 (port $PORT)"
PORT="$PORT" pm2 startOrReload ecosystem.config.cjs --update-env >/dev/null
pm2 save >/dev/null
pm2 startup systemd -u root --hp /root >/dev/null 2>&1 || pm2 startup >/dev/null 2>&1 || warn "could not register pm2 startup automatically"
ok "app running as pm2 process '$APP_NAME' (auto-restart + start-on-boot)"

# ---- 7. nginx reverse proxy -------------------------------------------------
if [ "$SETUP_NGINX" = "yes" ]; then
  say "8/9  Configuring nginx reverse proxy"
  if ! command -v nginx >/dev/null 2>&1; then
    [ "$SKIP_APT" = "yes" ] && die "nginx required but SKIP_APT=yes."
    apt-get install -y nginx >/dev/null
  fi
  conf="/etc/nginx/sites-available/${DOMAIN}"
  # IDEMPOTENCY: certbot edits this same file in place to add the HTTPS (443) block.
  # Only (re)generate it from the template if it doesn't exist yet or certbot hasn't
  # touched it — otherwise a plain re-run would silently overwrite HTTPS back to HTTP.
  if [ ! -f "$conf" ] || ! grep -q "managed by Certbot" "$conf"; then
    sed -e "s/__DOMAIN__/${DOMAIN}/g" -e "s/__PORT__/${PORT}/g" \
      "$PROJECT_DIR/deploy/nginx/thesoundcorp.conf.template" > "$conf"
    ok "wrote nginx config from template"
  else
    ok "existing nginx config is certbot-managed — left untouched (HTTPS preserved)"
    warn "to change DOMAIN/PORT on an HTTPS box: edit $conf by hand, then re-run certbot"
  fi
  ln -sf "$conf" "/etc/nginx/sites-enabled/${DOMAIN}"
  # Drop the stock default site if it grabs port 80 as default_server.
  [ -e /etc/nginx/sites-enabled/default ] && rm -f /etc/nginx/sites-enabled/default || true
  nginx -t >/dev/null 2>&1 || die "nginx config test failed — run 'nginx -t' to see why."
  systemctl reload nginx
  ok "nginx proxying http://$DOMAIN -> 127.0.0.1:$PORT"

  # open the firewall if ufw is active
  if command -v ufw >/dev/null 2>&1 && ufw status 2>/dev/null | grep -q "Status: active"; then
    ufw allow 'Nginx Full' >/dev/null 2>&1 || true
  fi

  if [ "$RUN_CERTBOT" = "yes" ]; then
    say "     Adding HTTPS via Let's Encrypt (certbot)"
    [ -n "$CERTBOT_EMAIL" ] || die "RUN_CERTBOT=yes needs CERTBOT_EMAIL=you@example.com"
    command -v certbot >/dev/null 2>&1 || apt-get install -y certbot python3-certbot-nginx >/dev/null
    certbot --nginx -d "$DOMAIN" -d "www.$DOMAIN" --non-interactive --agree-tos -m "$CERTBOT_EMAIL" --redirect >/dev/null \
      && ok "HTTPS enabled for $DOMAIN" \
      || warn "certbot failed (DNS must point to this server first). Re-run: sudo certbot --nginx -d $DOMAIN -d www.$DOMAIN"
  else
    warn "HTTPS not configured. When DNS points here, run: sudo certbot --nginx -d $DOMAIN -d www.$DOMAIN"
  fi
else
  say "8/9  Skipping nginx (SETUP_NGINX=no) — app is on 127.0.0.1:$PORT"
fi

# ---- 8. health check --------------------------------------------------------
say "9/9  Health check"
code=""
for i in 1 2 3 4 5 6; do
  code="$(curl -fsS -o /dev/null -w '%{http_code}' "http://127.0.0.1:${PORT}/en" 2>/dev/null || true)"
  [ "$code" = "200" ] && break
  sleep 2
done
[ "$code" = "200" ] || die "app did not answer 200 on http://127.0.0.1:${PORT}/en (got '${code}'). Check: pm2 logs $APP_NAME"
ok "app healthy — HTTP 200 on /en"

# ---- done -------------------------------------------------------------------
printf "\n\033[1;32m========================================\033[0m\n"
printf "\033[1;32m ✓ DEPLOY SUCCESSFUL\033[0m\n"
printf "\033[1;32m========================================\033[0m\n"
echo "  Local  : http://127.0.0.1:${PORT}/en   (200 OK)"
[ "$SETUP_NGINX" = "yes" ] && echo "  Public : http://${DOMAIN}/  (add HTTPS with certbot — see above)"
echo "  Manage : pm2 status | pm2 logs ${APP_NAME} | pm2 restart ${APP_NAME}"
echo "  Secrets: edit .env.local then  pm2 restart ${APP_NAME}   (see DISASTER-RECOVERY.md)"
echo
