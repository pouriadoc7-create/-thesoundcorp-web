#!/usr/bin/env node
/**
 * External link checker.
 *
 * Deliberately SEPARATE from the Playwright suite: it depends on other
 * people's servers, so it must never be able to fail CI. Third-party hosts
 * rate-limit, block datacentre IPs and dislike HEAD — a failure here is a
 * prompt to look, not proof of a broken link.
 *
 * Usage
 *   npm run build && npx next start -p 3101   # in one terminal
 *   npm run check:links:external
 *
 * Exits 0 always. Read the report.
 */
import { setTimeout as sleep } from "node:timers/promises";

const ORIGIN = process.env.CHECK_ORIGIN ?? "http://127.0.0.1:3101";
const PAGES = [
  "/en",
  "/fa",
  "/en/brands",
  "/en/products",
  "/en/gallery",
  "/en/downloads",
  "/en/about",
  "/en/contact",
  "/en/brands/audiovector",
  "/en/products/marten-dexter",
];
const CONCURRENCY = 6;
const TIMEOUT_MS = 15_000;
const UA = "Mozilla/5.0 (compatible; TheSoundCorp-LinkCheck/1.0)";

const HREF_RE = /href="(https?:\/\/[^"]+)"/gi;

async function collect() {
  const map = new Map(); // url -> Set(pages)
  for (const p of PAGES) {
    let html;
    try {
      const res = await fetch(`${ORIGIN}${p}`);
      if (!res.ok) {
        console.warn(`  ! ${p} -> HTTP ${res.status} (skipped)`);
        continue;
      }
      html = await res.text();
    } catch {
      console.error(`  ! ${p} unreachable — is the server running on ${ORIGIN}?`);
      return map;
    }
    for (const m of html.matchAll(HREF_RE)) {
      const url = m[1].replace(/&amp;/g, "&");
      if (url.startsWith(ORIGIN)) continue;
      if (!map.has(url)) map.set(url, new Set());
      map.get(url).add(p);
    }
  }
  return map;
}

async function check(url) {
  const ctl = AbortSignal.timeout(TIMEOUT_MS);
  const opts = { redirect: "follow", signal: ctl, headers: { "user-agent": UA } };
  try {
    // Try HEAD first (cheap); many hosts answer 405/403 to HEAD, so fall back.
    let res = await fetch(url, { ...opts, method: "HEAD" });
    if (res.status === 405 || res.status === 403 || res.status === 501) {
      res = await fetch(url, { ...opts, method: "GET" });
    }
    return { url, status: res.status, ok: res.status < 400 };
  } catch (e) {
    return { url, status: 0, ok: false, error: e.name === "TimeoutError" ? "timeout" : e.message };
  }
}

async function main() {
  console.log(`Collecting external links from ${ORIGIN} …`);
  const map = await collect();
  const urls = [...map.keys()].sort();
  if (!urls.length) {
    console.log("No external links found (or the server is not running).");
    return;
  }
  console.log(`${urls.length} unique external links.\n`);

  const results = [];
  for (let i = 0; i < urls.length; i += CONCURRENCY) {
    results.push(...(await Promise.all(urls.slice(i, i + CONCURRENCY).map(check))));
    await sleep(200); // be a polite crawler
  }

  const bad = results.filter((r) => !r.ok);
  const good = results.filter((r) => r.ok);

  console.log(`OK        : ${good.length}`);
  console.log(`Suspect   : ${bad.length}\n`);
  for (const r of bad) {
    console.log(`  ${r.status || "ERR"}  ${r.url}`);
    console.log(`        error: ${r.error ?? "-"}`);
    console.log(`        linked from: ${[...map.get(r.url)].join(", ")}`);
  }
  if (bad.length) {
    console.log(
      "\nNote: 403/429/timeout usually means bot protection, not a dead link.\n" +
        "Open the URL in a browser before changing any data file.",
    );
  }
}

main();
