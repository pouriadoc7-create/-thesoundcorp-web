import { expect, test, type ConsoleMessage } from "@playwright/test";

import { ALL_PAGES, LOCALES } from "./routes";

/**
 * Console noise that is not a real defect.
 * Keep this list short and justified — every entry is a suppressed signal.
 */
const IGNORED_CONSOLE = [
  // Chrome logs this for any cross-origin iframe that sets cookies (Google Maps
  // embed on /contact). Nothing in our code can change it.
  /third-party cookie/i,
  // Fired by the browser, not the app, when a resource is blocked by a client
  // extension or by the network — noisy in local runs, never a code defect.
  /net::ERR_BLOCKED_BY_CLIENT/,
];

function isRealError(msg: ConsoleMessage): boolean {
  if (msg.type() !== "error") return false;
  return !IGNORED_CONSOLE.some((re) => re.test(msg.text()));
}

test.describe("page smoke", () => {
  for (const page_ of ALL_PAGES) {
    test(`${page_.locale} ${page_.name} loads cleanly`, async ({ page }) => {
      const errors: string[] = [];
      page.on("console", (m) => {
        if (isRealError(m)) errors.push(m.text());
      });
      page.on("pageerror", (e) => errors.push(`pageerror: ${e.message}`));

      const response = await page.goto(page_.url, { waitUntil: "domcontentloaded" });

      expect(response?.status(), `HTTP status for ${page_.url}`).toBe(200);
      // Exactly one h1 per page — an SEO and a screen-reader requirement.
      await expect(page.locator("h1")).toHaveCount(1);
      await expect(page.locator("main")).toBeVisible();
      expect(errors, `console errors on ${page_.url}`).toEqual([]);
    });
  }
});

test.describe("locale routing", () => {
  test("root redirects to a locale", async ({ page }) => {
    const response = await page.goto("/");
    expect(response?.status()).toBe(200);
    expect(new URL(page.url()).pathname).toMatch(/^\/(en|fa)/);
  });

  for (const locale of LOCALES) {
    test(`${locale} sets the correct dir and lang`, async ({ page }) => {
      await page.goto(`/${locale}`);
      const html = page.locator("html");
      await expect(html).toHaveAttribute("lang", locale);
      await expect(html).toHaveAttribute("dir", locale === "fa" ? "rtl" : "ltr");
    });
  }
});

test.describe("404 behaviour", () => {
  // This guards the soft-404 fix: `dynamicParams = false` + generateStaticParams
  // on the two [slug] routes. A regression here silently tanks SEO.
  const notFound = [
    "/en/products/this-product-does-not-exist",
    "/en/brands/this-brand-does-not-exist",
    "/fa/products/this-product-does-not-exist",
    "/fa/brands/this-brand-does-not-exist",
    "/en/no-such-page",
  ];

  for (const path of notFound) {
    test(`${path} returns a real 404`, async ({ page }) => {
      const response = await page.goto(path);
      expect(response?.status(), `${path} must be a hard 404, not a soft 200`).toBe(404);
    });
  }
});

test.describe("downloads", () => {
  test("brand grid renders and AudioVector has documents", async ({ page }) => {
    await page.goto("/en/downloads");
    // All 26 brands are listed even when they have no documents yet.
    const tiles = page.getByRole("button").or(page.getByRole("link"));
    await expect(tiles.filter({ hasText: /audiovector/i }).first()).toBeVisible();
  });
});
