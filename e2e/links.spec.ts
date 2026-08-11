import { expect, test } from "@playwright/test";

import { ALL_PAGES } from "./routes";

/**
 * Internal broken-link check.
 *
 * Crawls every anchor on the representative pages and asserts each in-site
 * target resolves. External hosts are collected and reported but never
 * asserted — third-party sites rate-limit and block datacentre traffic, so
 * failing the suite on them would produce flakes, not signal. Run
 * `npm run check:links:external` for an explicit, network-dependent sweep.
 */
test.describe("internal links resolve", () => {
  test.beforeEach(() => {
    test.skip(test.info().project.name !== "chromium", "link graph is engine-independent");
  });

  test("no broken in-site links", async ({ page, request, baseURL }) => {
    const origin = new URL(baseURL!).origin;
    const seen = new Map<string, string[]>(); // href -> pages that link to it
    const external = new Set<string>();

    for (const page_ of ALL_PAGES) {
      await page.goto(page_.url, { waitUntil: "domcontentloaded" });
      const hrefs = await page.$$eval("a[href]", (as) =>
        as.map((a) => (a as HTMLAnchorElement).href),
      );

      for (const href of hrefs) {
        let u: URL;
        try {
          u = new URL(href);
        } catch {
          continue;
        }
        if (!["http:", "https:"].includes(u.protocol)) continue; // tel:, mailto:, wa.me handled below
        if (u.origin !== origin) {
          external.add(u.origin + u.pathname);
          continue;
        }
        const key = u.pathname + u.search;
        if (!seen.has(key)) seen.set(key, []);
        seen.get(key)!.push(page_.url);
      }
    }

    const broken: string[] = [];
    for (const [target, sources] of seen) {
      const res = await request.get(target, { maxRedirects: 5 });
      if (res.status() >= 400) {
        broken.push(
          `${target} -> HTTP ${res.status()}  (linked from ${[...new Set(sources)].join(", ")})`,
        );
      }
    }

    // Surface the external surface area so a human can eyeball it without
    // making the suite depend on other people's servers.
    console.log(
      `[links] ${seen.size} internal targets checked, ${external.size} external hosts referenced:`,
    );
    for (const e of [...external].sort()) console.log(`        ${e}`);

    expect(broken, "broken internal links").toEqual([]);
  });
});

test.describe("download assets resolve", () => {
  test.beforeEach(() => {
    test.skip(test.info().project.name !== "chromium", "asset check runs once");
  });

  // Every locally-served official document must return a real file. These are
  // byte-for-byte originals (CLAUDE.md §13) — a 404 here means an import broke.
  test("every local download returns a PDF", async ({ request }) => {
    const { DOWNLOAD_BRANDS } = await import("../lib/data/downloads");

    const localDocs = DOWNLOAD_BRANDS.flatMap((b) =>
      b.products.flatMap((p) => p.documents.filter((d) => d.localPath)),
    );
    expect(localDocs.length, "expected at least one locally-served document").toBeGreaterThan(0);

    const failures: string[] = [];
    for (const doc of localDocs) {
      const res = await request.get(encodeURI(doc.localPath!));
      const type = res.headers()["content-type"] ?? "";
      if (res.status() !== 200) failures.push(`${doc.localPath} -> HTTP ${res.status()}`);
      else if (!type.includes("pdf")) failures.push(`${doc.localPath} -> content-type ${type}`);
    }
    expect(failures, "unreachable or non-PDF documents").toEqual([]);
  });
});
