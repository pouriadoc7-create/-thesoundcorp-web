import { getTranslations } from "next-intl/server";

import { Link } from "@/i18n/navigation";
import { NAV_LINKS, SITE_NAME } from "@/lib/constants/site";

import { SocialLinks } from "./SocialLinks";

export async function Footer() {
  const year = new Date().getFullYear();
  const t = await getTranslations("footer");
  const tNav = await getTranslations("nav");

  return (
    <footer className="border-t border-zinc-800 bg-black">
      {/* Extra bottom padding reserves a clear zone for the fixed floating
          WhatsApp button (bottom-right in LTR / bottom-left in RTL) so it never
          overlaps the footer's own social icons when scrolled to the end. */}
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-10 px-4 pt-12 pb-24 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
        <div className="flex flex-col items-center gap-5 lg:items-start">
          <nav
            aria-label="Footer"
            className="flex flex-wrap items-center justify-center gap-x-7 gap-y-2 lg:justify-start"
          >
            {NAV_LINKS.map((link) => (
              <Link
                key={link.key}
                href={link.href}
                className="rounded-md text-sm text-zinc-400 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
              >
                {tNav(link.key)}
              </Link>
            ))}
          </nav>
          <p className="text-sm text-zinc-500">{t("rights", { year, siteName: SITE_NAME })}</p>
        </div>

        <SocialLinks className="lg:justify-end" />
      </div>
    </footer>
  );
}
