#!/usr/bin/env node
/**
 * Lighthouse audit for TheSoundCorp.
 *
 * Audits a PRODUCTION build served locally (never `next dev` — dev ships
 * unminified bundles and HMR, which makes every score meaningless).
 *
 * Usage
 *   npm run build
 *   npm run audit:lighthouse                # default page set, mobile
 *   npm run audit:lighthouse -- --desktop
 *   npm run audit:lighthouse -- --url=/en/downloads
 *
 * Output: .lighthouse/<page>-<formFactor>.html + a summary table on stdout.
 * Reports are gitignored — they are a local diagnostic, not a build artifact.
 */
import { spawn } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { createRequire } from "node:module";
import { createServer } from "node:net";
import path from "node:path";
import { fileURLToPath } from "node:url";

const require = createRequire(import.meta.url);

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const OUT_DIR = path.join(ROOT, ".lighthouse");
const PORT = 3101; // distinct from dev (3000) and Playwright (3100)
const ORIGIN = `http://127.0.0.1:${PORT}`;

const args = process.argv.slice(2);
const desktop = args.includes("--desktop");
const urlArg = args.find((a) => a.startsWith("--url="))?.slice(6);

const PAGES = urlArg
  ? [{ name: urlArg.replace(/[^a-z0-9]+/gi, "-").replace(/^-|-$/g, "") || "root", path: urlArg }]
  : [
      { name: "home-en", path: "/en" },
      { name: "home-fa", path: "/fa" },
      { name: "brands", path: "/en/brands" },
      { name: "products", path: "/en/products" },
      { name: "downloads", path: "/en/downloads" },
      { name: "contact", path: "/en/contact" },
    ];

/**
 * Resolve a Chromium-family browser for Lighthouse.
 *
 * Order matters. Playwright's bundled Chromium is LAST because it is not a
 * standalone binary: launched outside Playwright's own launcher it fails on
 * Windows with "side-by-side configuration is incorrect" (it relies on the
 * runtime environment Playwright sets up). Edge is a full Chromium install and
 * produces valid Lighthouse results, so it outranks it.
 */
function findChrome() {
  if (process.env.CHROME_PATH && existsSync(process.env.CHROME_PATH))
    return process.env.CHROME_PATH;

  const candidates = [
    // Google Chrome — the reference browser for Lighthouse.
    process.env.ProgramFiles &&
      path.join(process.env.ProgramFiles, "Google/Chrome/Application/chrome.exe"),
    process.env["ProgramFiles(x86)"] &&
      path.join(process.env["ProgramFiles(x86)"], "Google/Chrome/Application/chrome.exe"),
    process.env.LOCALAPPDATA &&
      path.join(process.env.LOCALAPPDATA, "Google/Chrome/Application/chrome.exe"),
    "/usr/bin/google-chrome",
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    // Microsoft Edge — same engine, ships with Windows.
    process.env["ProgramFiles(x86)"] &&
      path.join(process.env["ProgramFiles(x86)"], "Microsoft/Edge/Application/msedge.exe"),
    process.env.ProgramFiles &&
      path.join(process.env.ProgramFiles, "Microsoft/Edge/Application/msedge.exe"),
  ].filter(Boolean);

  for (const c of candidates) if (existsSync(c)) return c;

  // Last resort only — see the note above.
  try {
    const { chromium } = require("playwright-core");
    const p = chromium.executablePath();
    if (existsSync(p)) return p;
  } catch {
    /* playwright-core not resolvable — fall through */
  }
  return null;
}

const portFree = (port) =>
  new Promise((resolve) => {
    const s = createServer()
      .once("error", () => resolve(false))
      .once("listening", () => s.close(() => resolve(true)))
      .listen(port, "127.0.0.1");
  });

const waitForServer = async (url, timeoutMs = 90_000) => {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    try {
      const r = await fetch(url, { redirect: "manual" });
      if (r.status > 0) return true;
    } catch {
      /* not up yet */
    }
    await new Promise((r) => setTimeout(r, 500));
  }
  return false;
};

const run = (cmd, argv, opts = {}) =>
  new Promise((resolve, reject) => {
    const p = spawn(cmd, argv, { stdio: "inherit", shell: process.platform === "win32", ...opts });
    p.on("error", reject);
    p.on("close", (code) => (code === 0 ? resolve() : reject(new Error(`${cmd} exited ${code}`))));
  });

async function main() {
  if (!existsSync(path.join(ROOT, ".next"))) {
    console.error("No .next build found. Run `npm run build` first.");
    process.exit(1);
  }

  mkdirSync(OUT_DIR, { recursive: true });

  // Launch the browser via Playwright and hand Lighthouse the CDP port, rather
  // than letting Lighthouse's own chrome-launcher do it. On Windows,
  // chrome-launcher creates a temp profile it then cannot delete (EPERM) when
  // a browser session is already running, which fails the whole audit *after*
  // it has finished measuring. Playwright owns the process lifecycle cleanly.
  const { chromium } = await import("playwright-core");
  const chromePath = findChrome();
  const CDP_PORT = 9333;

  const browser = await chromium.launch({
    ...(chromePath ? { executablePath: chromePath } : {}),
    args: [`--remote-debugging-port=${CDP_PORT}`, "--no-sandbox", "--disable-gpu"],
  });
  console.log(`Browser: ${chromePath ?? "playwright chromium"} (CDP ${CDP_PORT})\n`);

  let server = null;
  const needServer = await portFree(PORT);
  if (needServer) {
    console.log(`Starting production server on ${ORIGIN} …`);
    server = spawn("npx", ["next", "start", "-p", String(PORT)], {
      cwd: ROOT,
      stdio: "ignore",
      shell: process.platform === "win32",
      detached: false,
    });
    if (!(await waitForServer(`${ORIGIN}/en`))) {
      server.kill();
      console.error("Production server did not start in time.");
      process.exit(1);
    }
  } else {
    console.log(`Reusing the server already listening on ${ORIGIN}\n`);
  }

  const formFactor = desktop ? "desktop" : "mobile";
  const results = [];

  try {
    for (const page of PAGES) {
      const out = path.join(OUT_DIR, `${page.name}-${formFactor}`);
      console.log(`\n▸ ${page.path}  (${formFactor})`);
      await run(
        "npx",
        [
          "lighthouse",
          `${ORIGIN}${page.path}`,
          // Desktop uses Lighthouse's own preset (viewport + throttling together);
          // mobile is the tool's default, so it only needs the form factor.
          ...(desktop ? ["--preset=desktop"] : ["--form-factor=mobile", "--screenEmulation.mobile"]),
          "--output=html",
          "--output=json",
          `--output-path=${out}`,
          "--quiet",
          // Attach to the already-running Playwright browser instead of
          // launching (and then failing to clean up) a new one.
          `--port=${CDP_PORT}`,
        ],
      );

      // lighthouse writes <out>.report.json when multiple outputs are given
      const jsonPath = `${out}.report.json`;
      if (existsSync(jsonPath)) {
        const report = JSON.parse(readFileSync(jsonPath, "utf8"));
        results.push({
          page: page.path,
          performance: Math.round((report.categories.performance?.score ?? 0) * 100),
          accessibility: Math.round((report.categories.accessibility?.score ?? 0) * 100),
          bestPractices: Math.round((report.categories["best-practices"]?.score ?? 0) * 100),
          seo: Math.round((report.categories.seo?.score ?? 0) * 100),
          lcp: report.audits["largest-contentful-paint"]?.displayValue ?? "-",
          cls: report.audits["cumulative-layout-shift"]?.displayValue ?? "-",
          tbt: report.audits["total-blocking-time"]?.displayValue ?? "-",
        });
      }
    }
  } finally {
    await browser.close().catch(() => {});
    if (server) server.kill();
  }

  console.log("\n" + "=".repeat(96));
  console.log(`LIGHTHOUSE SUMMARY — ${formFactor}`);
  console.log("=".repeat(96));
  console.table(results);
  writeFileSync(path.join(OUT_DIR, `summary-${formFactor}.json`), JSON.stringify(results, null, 2));
  console.log(`\nHTML reports: ${OUT_DIR}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
