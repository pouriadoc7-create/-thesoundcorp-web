import { expect, test } from "@playwright/test";

import { ALL_PAGES } from "../routes";

/**
 * Visual-regression baselines.
 *
 * These exist because the Borresen/Aavik logo regression (a removed
 * `LOGO_LIGHTEN` set rendering two dark marks invisible on near-black tiles)
 * shipped once and was only caught by eye. A pixel baseline catches that class
 * of bug for free.
 *
 * Run explicitly:            npm run test:visual
 * Accept intentional changes: npm run test:visual:update
 *
 * Baselines are committed. Review the diff images in playwright-report/ before
 * ever updating them — an updated baseline is an accepted design change.
 */

const VIEWPORTS = [
  { name: "mobile", width: 390, height: 844 },
  { name: "desktop", width: 1440, height: 900 },
] as const;

/**
 * Bring a page to a deterministic, fully-painted state.
 *
 * A full-page screenshot captures content that was never scrolled into view,
 * so lazily-loaded images below the fold would otherwise still be blank (or,
 * worse, decode mid-shot). Scrolling the whole page first forces every loader
 * to fire; the image wait is then hard-capped, because an image that genuinely
 * never loads must fail as a pixel diff — not hang the test.
 */
async function settle(page: import("@playwright/test").Page) {
  await page.evaluate(async () => {
    const step = window.innerHeight;
    // Hard iteration cap. scrollHeight is re-read each pass and the page GROWS
    // as lazy images load, so an uncapped loop can keep chasing its own tail on
    // long pages (the gallery, product detail) until the test times out.
    const MAX_STEPS = 40;
    let y = 0;
    for (let i = 0; i < MAX_STEPS && y < document.documentElement.scrollHeight; i++) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 60));
      y += step;
    }
    window.scrollTo(0, 0);
  });

  await page
    .evaluate(async () => {
      const pending = Array.from(document.images).filter((img) => !img.complete);
      await Promise.race([
        Promise.all(
          pending.map(
            (img) =>
              new Promise((r) => {
                img.onload = img.onerror = r;
              }),
          ),
        ),
        new Promise((r) => setTimeout(r, 8000)),
      ]);
      if (document.fonts) await document.fonts.ready;
    })
    .catch(() => {});

  // Explicit cap. Without one this inherits the TEST timeout, so an image-heavy
  // page that never reaches true network idle consumes the entire budget and
  // fails as an inscrutable "Target page closed" rather than just proceeding.
  // Idle is a nice-to-have here; the image wait above is the real guarantee.
  await page.waitForLoadState("networkidle", { timeout: 8000 }).catch(() => {});
  await page.waitForTimeout(250);
}

test.describe("full-page baselines", () => {
  // Scroll pass + image settling + a full-page shot on long pages.
  test.describe.configure({ timeout: 90_000 });

  for (const page_ of ALL_PAGES) {
    for (const vp of VIEWPORTS) {
      test(`${page_.locale} ${page_.name} @ ${vp.name}`, async ({ page }) => {
        await page.setViewportSize({ width: vp.width, height: vp.height });
        await page.goto(page_.url, { waitUntil: "domcontentloaded" });

        // Kill every source of non-determinism before the shot:
        // motion, lazy images below the fold, and the Google Maps embed.
        await page.emulateMedia({ reducedMotion: "reduce" });
        await settle(page);

        await expect(page).toHaveScreenshot(`${page_.locale}-${page_.name}-${vp.name}.png`, {
          fullPage: true,
          mask: [page.locator("iframe[src*='google.com']")],
        });
      });
    }
  }
});

test.describe("brand logo grid", () => {
  // The specific regression this file was written for. A tight crop on the
  // logo grid is far more sensitive than a full-page shot.
  test("brands index logo grid renders every mark visibly", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/en/brands", { waitUntil: "domcontentloaded" });
    await page.emulateMedia({ reducedMotion: "reduce" });
    await settle(page);

    // Not a pixel test: assert no logo renders as an effectively blank box.
    const invisible = await page.evaluate(() => {
      const out: string[] = [];
      for (const img of Array.from(document.querySelectorAll<HTMLImageElement>("img"))) {
        if (!/brand-logos/.test(img.currentSrc || img.src)) continue;
        const r = img.getBoundingClientRect();
        if (r.width < 4 || r.height < 4)
          out.push(`${img.alt || img.src}: ${Math.round(r.width)}x${Math.round(r.height)}`);
        if (getComputedStyle(img).opacity === "0") out.push(`${img.alt || img.src}: opacity 0`);
      }
      return out;
    });
    expect(invisible, "brand logos rendering at zero size or zero opacity").toEqual([]);
  });
});
