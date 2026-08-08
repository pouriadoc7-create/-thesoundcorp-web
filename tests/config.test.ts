import { describe, expect, it } from "vitest";

import { RTL_LOCALES, getLocaleDirection, routing } from "@/i18n/routing";
import { CONTACT, NAV_LINKS } from "@/lib/constants/site";
import { CONTACT_CHANNELS } from "@/lib/data/contact-channels";
import { cn } from "@/lib/utils/cn";

describe("i18n routing", () => {
  it("configures en + fa with en default", () => {
    expect(routing.locales).toEqual(["en", "fa"]);
    expect(routing.defaultLocale).toBe("en");
    expect(RTL_LOCALES).toEqual(["fa"]);
  });

  it("getLocaleDirection maps fa→rtl, everything else→ltr", () => {
    expect(getLocaleDirection("en")).toBe("ltr");
    expect(getLocaleDirection("fa")).toBe("rtl");
    expect(getLocaleDirection("unknown")).toBe("ltr");
  });
});

describe("NAV_LINKS", () => {
  const STATIC_ROUTES = new Set(["/", "/brands", "/products", "/gallery", "/downloads", "/about", "/contact"]);

  it("has unique keys, each pointing at a real static route", () => {
    const keys = NAV_LINKS.map((l) => l.key);
    expect(new Set(keys).size).toBe(keys.length);
    for (const link of NAV_LINKS) expect(STATIC_ROUTES.has(link.href), `bad href: ${link.href}`).toBe(true);
  });
});

describe("CONTACT", () => {
  it("uses correct protocols and shares one phone/whatsapp number", () => {
    expect(CONTACT.phone.href).toMatch(/^tel:/);
    expect(CONTACT.email.href).toMatch(/^mailto:/);
    expect(CONTACT.map.href).toMatch(/^https:\/\//);
    expect(CONTACT.youtube.href).toBeNull(); // not live yet
    const digits = (s: string) => s.replace(/\D/g, "");
    expect(digits(CONTACT.phone.href)).toBe(digits(CONTACT.whatsapp.href));
  });
});

describe("CONTACT_CHANNELS", () => {
  const byKey = Object.fromEntries(CONTACT_CHANNELS.map((c) => [c.key, c]));

  it("has unique keys and a live href for every channel except YouTube", () => {
    const keys = CONTACT_CHANNELS.map((c) => c.key);
    expect(new Set(keys).size).toBe(keys.length);
    expect(byKey.youtube.href).toBeNull(); // "Coming Soon"
    for (const c of CONTACT_CHANNELS.filter((c) => c.key !== "youtube")) {
      expect(c.href, `${c.key} missing href`).toBeTruthy();
    }
  });

  it("matches href protocol and external flag to channel type", () => {
    expect(byKey.phone.href).toMatch(/^tel:/);
    expect(byKey.phone.external).toBe(false);
    expect(byKey.email.href).toMatch(/^mailto:/);
    expect(byKey.email.external).toBe(false);
    expect(byKey.whatsapp.href).toMatch(/^https:\/\//);
    expect(byKey.whatsapp.external).toBe(true);
    expect(byKey.instagram.href).toMatch(/^https:\/\//);
    expect(byKey.address.href).toMatch(/^https:\/\//);
    expect(byKey.address.value).toBeNull(); // resolved from i18n
  });
});

describe("cn", () => {
  it("merges conflicting Tailwind utilities (last wins)", () => {
    expect(cn("p-2", "p-4")).toBe("p-4");
    expect(cn("text-sm", "text-lg")).toBe("text-lg");
  });

  it("handles conditionals and falsy values", () => {
    expect(cn("a", false, null, undefined, "b")).toBe("a b");
    expect(cn("btn", { active: true, disabled: false })).toBe("btn active");
  });
});
