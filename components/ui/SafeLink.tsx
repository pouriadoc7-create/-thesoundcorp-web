import type { ComponentProps } from "react";

import { Link } from "@/i18n/navigation";

type SafeLinkProps = ComponentProps<typeof Link>;

function isExternalHref(href: string): boolean {
  return /^([a-z][a-z0-9+.-]*:)?\/\//i.test(href) && !href.startsWith("/");
}

/**
 * Drop-in replacement for the locale-aware Link. External hrefs
 * automatically get target="_blank" + rel="noopener noreferrer" so a
 * future external link (partner site, social profile, etc.) can't
 * accidentally ship without it.
 */
export function SafeLink({ href, ...props }: SafeLinkProps) {
  const hrefString = typeof href === "string" ? href : href.toString();
  const external = isExternalHref(hrefString);

  return (
    <Link href={href} {...props} {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})} />
  );
}
