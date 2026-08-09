import { describe, expect, it } from "vitest";

import { slugify } from "@/lib/utils/slugify";

describe("slugify", () => {
  it("lowercases and hyphenates spaces / non-alphanumerics", () => {
    expect(slugify("VAN DEN HUL")).toBe("van-den-hul");
    expect(slugify("VIENNA ACOUSTICS")).toBe("vienna-acoustics");
    expect(slugify("ACOUSTIC ARTS")).toBe("acoustic-arts");
    expect(slugify("SOULNOTE")).toBe("soulnote");
  });

  it("trims, collapses runs and strips edge hyphens", () => {
    expect(slugify("  Acoustic   Arts!!  ")).toBe("acoustic-arts");
    expect(slugify("--Marten / Dexter--")).toBe("marten-dexter");
    expect(slugify("N-05XD")).toBe("n-05xd");
  });

  it("is idempotent on already-slug values", () => {
    for (const s of ["primare", "van-den-hul", "n-05xd"]) expect(slugify(s)).toBe(s);
  });
});
