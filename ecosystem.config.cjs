// PM2 process configuration for the production Next.js server.
//
// Server-independent by design:
//   - cwd follows THIS file (__dirname), so the project can live anywhere.
//   - PORT is overridable via the environment; defaults to 3100. nginx
//     reverse-proxies to 127.0.0.1:$PORT (see deploy/nginx/*.template).
//   - NEXT_PUBLIC_SITE_URL is intentionally NOT set here: it is a build-time
//     value that already defaults to https://thesoundcorp.ir in the code
//     (lib/constants/site.ts). Only override it at BUILD time for staging.
//
// Used by deploy.sh via `pm2 startOrReload ecosystem.config.cjs`.
module.exports = {
  apps: [
    {
      name: "thesoundcorp",
      script: "npm",
      args: "start", // -> "next start", which honours the PORT env var
      cwd: __dirname,
      env: {
        NODE_ENV: "production",
        PORT: process.env.PORT || "3100",
      },
      max_memory_restart: "600M",
      autorestart: true,
      time: true,
    },
  ],
};
