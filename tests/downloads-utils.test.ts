import { describe, expect, it } from "vitest";

import { DOWNLOAD_BRANDS } from "@/lib/data/downloads";
import {
  DOC_GROUPS,
  OFFICIAL_DOMAINS,
  brandDomains,
  buildSearchIndex,
  countAllDocuments,
  countBrandDocuments,
  findDocument,
  getDownloadBrand,
  getDownloadProduct,
  groupDocuments,
  groupKeyForType,
  isAllowedOfficialUrl,
  isUrlOnBrandDomains,
} from "@/lib/utils/downloads";

describe("isAllowedOfficialUrl", () => {
  it("accepts https on the exact domain and its subdomains", () => {
    expect(isAllowedOfficialUrl("https://primare.net/a.pdf", "primare.net")).toBe(true);
    expect(isAllowedOfficialUrl("https://www.esoteric.jp/x.pdf", "esoteric.jp")).toBe(true);
  });

  it("rejects http, other domains, look-alikes and junk", () => {
    expect(isAllowedOfficialUrl("http://primare.net/a.pdf", "primare.net")).toBe(false);
    expect(isAllowedOfficialUrl("https://evil.com/a.pdf", "primare.net")).toBe(false);
    // A suffix that is not a dot-boundary must not pass (notprimare.net).
    expect(isAllowedOfficialUrl("https://notprimare.net/a.pdf", "primare.net")).toBe(false);
    expect(isAllowedOfficialUrl("not-a-url", "primare.net")).toBe(false);
  });
});

describe("isUrlOnBrandDomains / brandDomains", () => {
  it("honours a brand's alternate domains", () => {
    const soulnote = getDownloadBrand("soulnote")!;
    expect(soulnote.altDomains).toContain("soulnote.link");
    expect(isUrlOnBrandDomains("https://www.soulnote.link/m.pdf", soulnote)).toBe(true);
    expect(isUrlOnBrandDomains("https://www.soulnote.co.jp/m.pdf", soulnote)).toBe(true);
    expect(isUrlOnBrandDomains("https://drive.google.com/m.pdf", soulnote)).toBe(false);
  });

  it("brandDomains lists primary + alternates", () => {
    const merason = getDownloadBrand("merason")!;
    expect(brandDomains(merason)).toEqual(expect.arrayContaining(["merason.com", "squarespace.com"]));
  });

  it("OFFICIAL_DOMAINS is the union of every brand's domains", () => {
    expect(OFFICIAL_DOMAINS).toEqual(expect.arrayContaining(["primare.net", "soulnote.link", "squarespace.com"]));
  });
});

describe("document grouping", () => {
  it("maps every DownloadDocType to a defined group", () => {
    const groupKeys = new Set(DOC_GROUPS.map((g) => g.key));
    for (const t of ["user-manual", "quick-start", "datasheet", "technical", "brochure", "firmware", "software", "other"] as const) {
      expect(groupKeys.has(groupKeyForType(t))).toBe(true);
    }
    expect(groupKeyForType("software")).toBe("firmware"); // firmware+software share a group
  });

  it("groupDocuments returns only non-empty groups in canonical order", () => {
    const np5 = getDownloadProduct("primare", "np5")!;
    const groups = groupDocuments(np5.documents);
    expect(groups.length).toBeGreaterThan(0);
    for (const g of groups) expect(g.docs.length).toBeGreaterThan(0);
    const order = DOC_GROUPS.map((g) => g.key);
    const positions = groups.map((g) => order.indexOf(g.key));
    expect(positions).toEqual([...positions].sort((a, b) => a - b));
  });
});

describe("lookups & counts", () => {
  it("findDocument resolves valid ids and rejects invalid ones", () => {
    const found = findDocument("primare", "np5", "user-guide");
    expect(found?.brand.slug).toBe("primare");
    expect(found?.doc.officialUrl).toMatch(/^https:\/\/primare\.net\//);
    expect(findDocument("primare", "np5", "nope")).toBeUndefined();
    expect(findDocument("nope", "np5", "user-guide")).toBeUndefined();
  });

  it("countAllDocuments equals the sum of per-brand counts", () => {
    const sum = DOWNLOAD_BRANDS.reduce((n, b) => n + countBrandDocuments(b), 0);
    expect(countAllDocuments()).toBe(sum);
  });
});

describe("buildSearchIndex", () => {
  it("covers every document with a lowercase haystack", () => {
    const rows = buildSearchIndex();
    expect(rows.length).toBe(countAllDocuments());
    for (const r of rows.slice(0, 25)) {
      expect(r.haystack).toBe(r.haystack.toLowerCase());
      expect(r.haystack).toContain(r.doc.title.toLowerCase());
    }
  });

  it("finds NP5 by model code", () => {
    const rows = buildSearchIndex().filter((r) => r.haystack.includes("np5"));
    expect(rows.length).toBeGreaterThan(0);
    expect(rows.every((r) => r.brandSlug === "primare")).toBe(true);
  });
});
