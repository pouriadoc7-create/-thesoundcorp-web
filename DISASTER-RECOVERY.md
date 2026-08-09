# Disaster Recovery — TheSoundCorp website

**If the current server is gone, this file tells you how to bring the exact same
site back up on a brand-new Ubuntu server.** Everything the site needs is in this
project folder (`thesoundcorp-web`). You do **not** need the old server for anything.

You do not need to be a programmer. Copy and paste the commands in order.

---

## 0. The 30-second summary

1. Get a fresh **Ubuntu 22.04 or 24.04** server (any provider, any country — including an Iran‑IP server).
2. Copy this project folder onto it.
3. Run **one command**: `sudo bash deploy.sh`
4. Point your domain's DNS to the new server, then add HTTPS with one more command.

That's it. Details below.

---

## 1. What you must have ready beforehand

| You need | Why | If you don't have it |
| --- | --- | --- |
| This project folder (`thesoundcorp-web`) | It is the master copy of the whole site | It's on this computer, in git, and in any backup you made with `backup-site.sh` |
| A new Ubuntu server + its IP + SSH login | To run the site on | Buy one from any VPS provider |
| Access to your domain's DNS (where you manage `thesoundcorp.ir`) | To point the domain at the new server | Your domain registrar / Cloudflare dashboard |
| *(optional)* Gmail **App Password** for the contact form | So the form emails you | Without it the form still works — it opens the visitor's email app instead |
| *(optional)* A username + password for the pre-launch gate | The old site sat behind a login prompt | Only needed if you want that gate again |

**Secrets are NOT stored in this project** (that's on purpose — they must never be in
git). You re-enter them on the new server in step 5. The only secret that matters for
the website itself is the **Gmail App Password**, and it's optional.

---

## 2. Put the project on the new server

Pick **one** of these. The backup-archive way is cleanest (it leaves out the huge
rebuildable folders).

### Option A — from a backup archive (recommended)

On **this computer** (Git Bash), make a fresh archive and copy it up. Replace
`NEW_SERVER_IP` with your new server's IP:

```bash
cd /c/Projects/thesoundcorp-web
bash backup-site.sh
# copy the NEWEST archive (works even when you have several dated backups):
scp "$(ls -t ../thesoundcorp-backups/*.tar.gz | head -1)" root@NEW_SERVER_IP:/tmp/site.tar.gz
```

Then on the **new server**:

```bash
sudo mkdir -p /var/www/thesoundcorp
sudo tar -xzf /tmp/site.tar.gz -C /var/www/thesoundcorp
cd /var/www/thesoundcorp
```

### Option B — copy the whole folder directly

From **this computer** (make the parent folder first, and make sure the target
doesn't already exist so the copy doesn't nest inside itself):

```bash
ssh root@NEW_SERVER_IP "sudo mkdir -p /var/www && sudo rm -rf /var/www/thesoundcorp"
scp -r /c/Projects/thesoundcorp-web root@NEW_SERVER_IP:/var/www/thesoundcorp
```

(Bigger/slower — it copies `node_modules`, `.next` and `.git` too. Harmless, just
not necessary.)

### Option C — from GitHub (only if you have pushed the repo there)

```bash
sudo git clone <your-private-repo-url> /var/www/thesoundcorp
cd /var/www/thesoundcorp
```

> Pushing this repo to a **private** GitHub repo is a good extra safety net so this
> computer isn't the only copy. Never push a public repo, and never commit `.env.local`.

---

## 3. Deploy — the one command

From inside `/var/www/thesoundcorp` on the new server:

```bash
sudo bash deploy.sh
```

This is **safe to run again** any time — it won't break a working site. It will:

1. Check the system and install **Node.js 20**, **PM2**, **nginx** if missing.
2. Install the exact package versions from `package-lock.json` (`npm ci`).
3. Build the site (`npm run build`).
4. Start it with **PM2** (auto-restarts on crash, starts on reboot).
5. Set up **nginx** to serve your domain and forward to the app.
6. Run a **health check** and print **SUCCESS** or a clear error.

If you want HTTPS set up in the same run (DNS must already point to this server —
see step 6), use:

```bash
sudo DOMAIN=thesoundcorp.ir RUN_CERTBOT=yes CERTBOT_EMAIL=you@example.com bash deploy.sh
```

Deploying under a **different domain**? Pass it: `sudo DOMAIN=example.com bash deploy.sh`.

---

## 4. Point your domain at the new server

In your DNS provider (registrar or Cloudflare), set:

- an **A record** for `thesoundcorp.ir` → your new server's IP
- an **A record** for `www` → your new server's IP

Wait a few minutes for it to take effect (`ping thesoundcorp.ir` should show the new IP).

---

## 5. Enter your secrets (contact-form email — optional)

The contact form works immediately (it opens the visitor's email app). To make it
send email straight to your inbox, add your Gmail **App Password** on the server:

```bash
cd /var/www/thesoundcorp
nano .env.local
```

Make sure these lines are present and filled in (create an App Password at
Google Account → Security → 2-Step Verification → **App passwords**):

```
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_USER=thesound1.ir@gmail.com
SMTP_PASS=your-16-character-app-password
CONTACT_TO=thesound1.ir@gmail.com
CONTACT_FROM=thesound1.ir@gmail.com
```

Save (Ctrl-O, Enter, Ctrl-X), then apply:

```bash
pm2 restart thesoundcorp
```

`.env.example` in the project lists every variable the site understands.

---

## 6. HTTPS (padlock)

The simplest, free option — **Let's Encrypt** (do this AFTER DNS points here):

```bash
sudo certbot --nginx -d thesoundcorp.ir -d www.thesoundcorp.ir
```

certbot edits the nginx config for you and auto-renews. Done.

> **⚠️ If your domain is on Cloudflare** (the original one was): with Cloudflare's
> proxy ON (orange cloud), the Let's Encrypt check above can fail or cause a
> redirect loop. Do ONE of these:
> - **Easiest:** in Cloudflare's DNS, click the orange cloud on the `A` records to
>   make it grey ("DNS only"), run the `certbot` command, then turn the orange cloud
>   back on. Set Cloudflare **SSL/TLS → Overview → Full (strict)**.
> - **Or** skip certbot and keep using a **Cloudflare Origin Certificate** like the
>   original server did — that exact nginx setup is saved for you in
>   `deploy/nginx/thesoundcorp.current-vps.conf` (put the cert at
>   `/etc/ssl/thesoundcorp/origin.crt` + `origin.key`, then run this deploy with
>   `SETUP_NGINX=no` and wire nginx to that file). Cloudflare SSL/TLS mode: **Full (strict)**.
>
> If the domain is **not** on Cloudflare (e.g. a plain Iran-IP server), just run the
> `certbot` command above — nothing extra needed.

---

## 7. Optional: the pre-launch "Restricted" login gate

The old site was hidden behind a username/password prompt. To reproduce it on the
new server:

```bash
sudo apt-get install -y apache2-utils
sudo htpasswd -c /etc/nginx/.htpasswd-thesoundcorp admin   # it will ask for a password
```

Then edit `/etc/nginx/sites-available/thesoundcorp.ir`, uncomment the two
`auth_basic` lines (they're already in the file as comments), and run:

```bash
sudo nginx -t && sudo systemctl reload nginx
```

Remove those two lines (or don't add them) to make the site fully public.

---

## 8. Verify it worked

```bash
pm2 status                                   # 'thesoundcorp' should be 'online'
curl -I http://127.0.0.1:3100/en             # should say HTTP/… 200
```

Then open `http://thesoundcorp.ir/en` (and `/fa`, `/en/about`, `/en/contact`) in a
browser. If HTTPS is set up, use `https://`.

---

## 9. Keeping backups (do this regularly)

- **Git recovery point:** this project is a git repo. The known-good, deployable
  snapshot is tagged **`FULL-SITE-RECOVERY-V1`**. To see all recovery points:
  `git tag`. To return the files to that exact snapshot: `git checkout FULL-SITE-RECOVERY-V1`.
- **Archive backup:** run `bash backup-site.sh` any time to produce a dated
  `.tar.gz` in `../thesoundcorp-backups/`. Keep copies in more than one place
  (another drive, cloud storage). It excludes rebuildable folders and secrets.
- **Offsite:** consider pushing the git repo to a **private** GitHub repo.

---

## 10. Troubleshooting

| Symptom | Fix |
| --- | --- |
| `deploy.sh` printed an ERROR | Read the line it prints, fix that, run it again (safe to repeat). |
| Site not loading, pm2 shows errors | `pm2 logs thesoundcorp` to see why; `pm2 restart thesoundcorp`. |
| nginx won't reload | `sudo nginx -t` shows the exact config error. |
| certbot failed | DNS must point to this server first (step 4). Then re-run the certbot command in step 6. |
| Contact form doesn't email | Check `.env.local` has a valid `SMTP_PASS`, then `pm2 restart thesoundcorp`. Until then it uses the mailto fallback (normal). |
| Wrong domain in links | Rebuild with the right domain: `NEXT_PUBLIC_SITE_URL=https://yourdomain npm run build && pm2 restart thesoundcorp`. |

---

## 11. What runs where (quick reference)

- **App:** Next.js 16, started with `next start` (via `npm start`), listening on
  `127.0.0.1:$PORT` (default **3100**). Managed by **PM2** (`ecosystem.config.cjs`).
- **Reverse proxy:** **nginx** forwards the public domain to `127.0.0.1:$PORT`
  (`deploy/nginx/thesoundcorp.conf.template`).
- **Contact form backend:** `app/api/contact` (nginx passes it through like any
  other route). Sends email via SMTP from `.env.local`; falls back to a mailto link
  if SMTP isn't configured.
- **Nothing is tied to the old server's IP.** Domain, port and SMTP are all config,
  not code — so this same project deploys to any server without edits.
