import { defineConfig, devices } from "@playwright/test";

/**
 * End-to-end / accessibility / visual-regression config.
 *
 * Tests run against a PRODUCTION build (`next start`) rather than `next dev`,
 * because the dev server splits CSS differently and injects HMR scripts — both
 * of which make visual baselines and console-error assertions unreliable.
 * Port 3100 mirrors production and keeps `npm run dev` (3000) free.
 *
 * `npm run test:e2e` assumes a build already exists. Use `npm run test:e2e:build`
 * for a cold run that builds first.
 */
const PORT = 3100;
const BASE_URL = `http://127.0.0.1:${PORT}`;

export default defineConfig({
  testDir: "./e2e",
  // Visual baselines are opt-in (`npm run test:visual`) — they are the only
  // suite that fails on legitimate design changes, so they must not gate a
  // normal e2e run.
  testIgnore: ["**/visual/**"],
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 2 : undefined,
  reporter: process.env.CI
    ? [["github"], ["html", { open: "never" }]]
    : [["list"], ["html", { open: "never" }]],
  timeout: 30_000,
  expect: {
    timeout: 10_000,
    toHaveScreenshot: {
      // Font hinting and sub-pixel AA differ slightly between runs/machines.
      maxDiffPixelRatio: 0.01,
      animations: "disabled",
      caret: "hide",
    },
  },
  use: {
    baseURL: BASE_URL,
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
  },

  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
    { name: "firefox", use: { ...devices["Desktop Firefox"] } },
    { name: "webkit", use: { ...devices["Desktop Safari"] } },
    // Mobile is the majority of real traffic — it is a first-class target here,
    // not an afterthought.
    { name: "mobile-safari", use: { ...devices["iPhone 15 Pro"] } },
    { name: "mobile-chrome", use: { ...devices["Pixel 7"] } },
    // Visual baselines: Chromium only. Cross-engine font rendering differs far
    // more than any real regression would, so multi-engine baselines are noise.
    {
      name: "visual",
      testDir: "./e2e/visual",
      testIgnore: [],
      use: { ...devices["Desktop Chrome"] },
    },
  ],

  webServer: {
    command: `npx next start -p ${PORT}`,
    url: BASE_URL,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
    stdout: "ignore",
    stderr: "pipe",
  },
});
