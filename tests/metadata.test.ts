import { describe, expect, it } from "vitest";

import { SITE_NAME, SITE_URL } from "@/lib/constants/site";
import { buildLanguageAlternates } from "@/lib/utils/alternates";
import { buildPageMetadata } from "@/lib/utils/metadata";

describe("buildLanguageAlternates", () => {
  it("returns en, fa and x-default for a path", () => {
    const alt = buildLanguageAlternates("/about");
    expect(alt.en).toBe(`${SITE_URL}/en/about`);
    expect(alt.fa).toBe(`${SITE_URL}/fa/about`);
    expect(alt["x-default"]).toBe(`${SITE_URL}/en/about`);
  });

  it("handles the empty (home) path", () => {
    expect(buildLanguageAlternates("").en).toBe(`${SITE_URL}/en`);
  });
});

describe("buildPageMetadata", () => {
  it("emits self-canonical, hreflang, OpenGraph and Twitter", () => {
    const md = buildPageMetadata({ locale: "en", path: "/downloads", title: "Downloads", description: "desc" });
    const url = `${SITE_URL}/en/downloads`;
    expect(md.title).toBe("Downloads");
    expect(md.alternates?.canonical).toBe(url);
    expect(md.alternates?.languages).toMatchObject({ en: url, fa: `${SITE_URL}/fa/downloads` });
    expect(md.openGraph).toMatchObject({ url, siteName: SITE_NAME, type: "website", locale: "en_US" });
    expect(md.twitter).toMatchObject({ card: "summary_large_image", title: "Downloads" });
  });

  it("maps fa → fa_IR and honours ogType + custom images", () => {
    const md = buildPageMetadata({
      locale: "fa",
      path: "/products/x",
      title: "T",
      description: "D",
      ogType: "article",
      images: [{ url: "/p.jpg" }],
    });
    expect(md.openGraph).toMatchObject({ locale: "fa_IR", type: "article" });
    expect(md.twitter).toMatchObject({ images: ["/p.jpg"] });
  });
});
