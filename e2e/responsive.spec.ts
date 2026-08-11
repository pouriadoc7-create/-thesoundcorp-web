import { expect, test } from "@playwright/test";

import { ALL_PAGES, OVERFLOW_WIDTHS } from "./routes";

/**
 * Horizontal-overflow regression guard.
 *
 * Mobile is the majority of real traffic and the product-card centering bug
 * (a shrink-to-fit `<button>` with no `w-full`) shipped once already. This
 * suite makes that class of bug fail the build instead of needing a human on
 * a real phone.
 *
 * Runs on one engine only — overflow is a layout fact, not an engine quirk —
 * and drives the viewport directly so all eight widths are covered.
 */
test.describe("no horizontal overflow", () => {
  // Eight viewport widths per page, on image-heavy pages — comfortably past the
  // 30s default.
  test.describe.configure({ timeout: 90_000 });

  test.beforeEach(() => {
    test.skip(
      test.info().project.name !== "chromium",
      "layout is engine-independent — checked once",
    );
  });

  for (const page_ of ALL_PAGES) {
    test(`${page_.locale} ${page_.name}`, async ({ page }) => {
      const failures: string[] = [];

      // Load once, then resize. Layout here is pure CSS on statically
      // prerendered markup, so a reload per width would only add ~8x the time
      // and a `networkidle` wait that never settles on image-heavy pages.
      await page.goto(page_.url, { waitUntil: "domcontentloaded" });
      await page.evaluate(() => (document.fonts ? document.fonts.ready : null));

      for (const width of OVERFLOW_WIDTHS) {
        await page.setViewportSize({ width, height: 900 });
        // Let the reflow (and any responsive image swap) commit.
        await page.waitForTimeout(150);

        const overflow = await page.evaluate(() => {
          const doc = document.documentElement;
          const scrollW = Math.max(doc.scrollWidth, document.body.scrollWidth);
          const clientW = doc.clientWidth;
          if (scrollW <= clientW + 1) return null;

          // Name the widest offender so the failure is actionable, not just
          // "something overflows".
          let worst = { sel: "?", right: 0 };
          for (const el of Array.from(document.querySelectorAll<HTMLElement>("body *"))) {
            const r = el.getBoundingClientRect();
            if (r.width === 0 || r.height === 0) continue;
            if (r.right > clientW + 1 && r.right > worst.right) {
              const id = el.id ? `#${el.id}` : "";
              const cls =
                el.className && typeof el.className === "string"
                  ? `.${el.className.trim().split(/\s+/).slice(0, 3).join(".")}`
                  : "";
              worst = { sel: `${el.tagName.toLowerCase()}${id}${cls}`, right: Math.round(r.right) };
            }
          }
          return { scrollW, clientW, worst };
        });

        if (overflow) {
          failures.push(
            `${width}px: scrollWidth ${overflow.scrollW} > clientWidth ${overflow.clientW} — widest offender ${overflow.worst.sel} (right ${overflow.worst.right}px)`,
          );
        }
      }

      expect(failures, `horizontal overflow on ${page_.url}`).toEqual([]);
    });
  }
});

test.describe("touch targets", () => {
  test.skip(({ isMobile }) => !isMobile, "touch-target sizing applies to touch devices");

  test("primary navigation controls are at least 44px", async ({ page }) => {
    await page.goto("/en");

    const tooSmall = await page.evaluate(() => {
      const MIN = 44;
      const out: string[] = [];
      const header = document.querySelector("header");
      if (!header) return ["no <header> found"];
      for (const el of Array.from(
        header.querySelectorAll<HTMLElement>("a, button, [role='button']"),
      )) {
        const r = el.getBoundingClientRect();
        if (r.width === 0 || r.height === 0) continue; // hidden
        if (r.height < MIN - 0.5 || r.width < MIN - 0.5) {
          out.push(
            `${el.tagName.toLowerCase()} "${(el.textContent ?? "").trim().slice(0, 24)}" ${Math.round(r.width)}x${Math.round(r.height)}`,
          );
        }
      }
      return out;
    });

    expect(tooSmall, "header controls below the 44px touch minimum").toEqual([]);
  });
});
