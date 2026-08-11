#!/usr/bin/env node
/**
 * Bundle-size analysis.
 *
 * Uses Turbopack's built-in analyzer (`next build --experimental-analyze`),
 * NOT `@next/bundle-analyzer`. That package is a webpack plugin, and this
 * project builds with Turbopack — it would silently produce nothing while
 * looking like it worked. This reports on the bundler that actually ships.
 *
 * Usage: npm run analyze
 * Output: .next/diagnostics/analyze/index.html
 *
 * Note: this is a full production build, so it takes as long as `npm run build`
 * and overwrites .next. Re-run `npm run build` afterwards if you need a clean
 * build tree for `npm start` / Playwright.
 */
import { spawn } from "node:child_process";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const REPORT = path.join(ROOT, ".next", "diagnostics", "analyze", "index.html");

const child = spawn("npx", ["next", "build", "--experimental-analyze"], {
  cwd: ROOT,
  stdio: "inherit",
  shell: process.platform === "win32",
});

child.on("close", (code) => {
  if (code !== 0) process.exit(code ?? 1);
  console.log("\n" + "=".repeat(70));
  if (existsSync(REPORT)) {
    console.log("Bundle analysis ready. Open:");
    console.log(`  ${REPORT}`);
    console.log("\nIt breaks down every route's client bundle by module, so you can");
    console.log("see exactly which imports are pulling weight into the browser.");
  } else {
    console.log("Build succeeded but no analyzer report was found at:");
    console.log(`  ${REPORT}`);
    console.log("The --experimental-analyze flag may have changed in this Next version.");
  }
  console.log("=".repeat(70));
});
