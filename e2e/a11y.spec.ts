import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

import { ALL_PAGES } from "./routes";

/**
 * Automated accessibility scan (axe-core) on every representative page, in both
 * locales. Automated tooling catches roughly a third of real WCAG issues — it
 * is a floor, not a certificate. Keyboard traps, focus order and screen-reader
 * flow still need the accessibility-engineer agent and manual passes.
 */
const TAGS = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"];

// Only run the a11y sweep on one desktop and one mobile engine — axe results
// are engine-independent, so five projects would just be five identical runs.
test.beforeEach(() => {
  test.skip(
    !["chromium", "mobile-safari"].includes(test.info().project.name),
    "axe results do not vary by engine",
  );
});

for (const page_ of ALL_PAGES) {
  test(`a11y: ${page_.locale} ${page_.name}`, async ({ page }) => {
    await page.goto(page_.url, { waitUntil: "domcontentloaded" });

    const results = await new AxeBuilder({ page })
      .withTags(TAGS)
      // The Google Maps embed on /contact is third-party markup we cannot fix.
      .exclude("iframe[src*='google.com']")
      .analyze();

    const violations = results.violations.map((v) => ({
      id: v.id,
      impact: v.impact,
      help: v.help,
      nodes: v.nodes.map((n) => n.target.join(" ")).slice(0, 5),
    }));

    expect(violations, `axe violations on ${page_.url}`).toEqual([]);
  });
}

test.describe("keyboard access", () => {
  test.skip(({ isMobile }) => !!isMobile, "keyboard navigation is a desktop concern");

  test("a skip/first focus target is reachable and visible", async ({ page }) => {
    await page.goto("/en");
    await page.keyboard.press("Tab");
    const focused = page.locator(":focus");
    await expect(focused).toBeVisible();
  });

  test("every focusable control shows a visible focus ring", async ({ page }) => {
    await page.goto("/en");
    await page.keyboard.press("Tab");
    const outline = await page.locator(":focus").evaluate((el) => {
      const s = getComputedStyle(el);
      return { outlineWidth: s.outlineWidth, boxShadow: s.boxShadow, outlineStyle: s.outlineStyle };
    });
    const hasRing =
      (outline.outlineStyle !== "none" && parseFloat(outline.outlineWidth) > 0) ||
      (outline.boxShadow !== "none" && outline.boxShadow !== "");
    expect(hasRing, `focus indicator missing: ${JSON.stringify(outline)}`).toBe(true);
  });
});
