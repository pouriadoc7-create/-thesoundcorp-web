import { getTranslations } from "next-intl/server";
import type { ComponentType } from "react";

import {
  GmailBrandIcon,
  GoogleMapsBrandIcon,
  InstagramBrandIcon,
  PhoneBrandIcon,
  WhatsAppBrandIcon,
} from "@/components/icons/BrandIcons";
import { CONTACT } from "@/lib/constants/site";
import { cn } from "@/lib/utils/cn";

/** Keys map 1:1 onto the `social` translation namespace (aria-labels/tooltips). */
type SocialKey = "whatsapp" | "instagram" | "email" | "location" | "phone";

interface SocialItem {
  key: SocialKey;
  href: string;
  Icon: ComponentType<{ className?: string }>;
  /** tel:/mailto: stay in-app; http(s) opens a new, safely-rel'd tab. */
  external: boolean;
  /** Brand-tinted glow applied on hover. */
  glow: string;
}

const SOCIAL_ITEMS: SocialItem[] = [
  {
    key: "whatsapp",
    href: CONTACT.whatsapp.href,
    Icon: WhatsAppBrandIcon,
    external: true,
    glow: "group-hover:drop-shadow-[0_0_11px_rgba(37,211,102,0.65)]",
  },
  {
    key: "instagram",
    href: CONTACT.instagram.href,
    Icon: InstagramBrandIcon,
    external: true,
    glow: "group-hover:drop-shadow-[0_0_11px_rgba(214,41,118,0.6)]",
  },
  {
    key: "email",
    href: CONTACT.email.href,
    Icon: GmailBrandIcon,
    external: false,
    glow: "group-hover:drop-shadow-[0_0_11px_rgba(234,67,53,0.55)]",
  },
  {
    key: "location",
    href: CONTACT.map.href,
    Icon: GoogleMapsBrandIcon,
    external: true,
    glow: "group-hover:drop-shadow-[0_0_11px_rgba(234,67,53,0.55)]",
  },
  {
    key: "phone",
    href: CONTACT.phone.href,
    Icon: PhoneBrandIcon,
    external: false,
    glow: "group-hover:drop-shadow-[0_0_10px_rgba(255,255,255,0.55)]",
  },
];

interface SocialLinksProps {
  className?: string;
}

export async function SocialLinks({ className }: SocialLinksProps) {
  const t = await getTranslations("social");

  return (
    <ul
      aria-label={t("sectionLabel")}
      className={cn("flex items-center gap-4 sm:gap-5", className)}
    >
      {SOCIAL_ITEMS.map(({ key, href, Icon, external, glow }) => {
        const label = t(key);
        return (
          <li key={key}>
            <a
              href={href}
              title={label}
              aria-label={label}
              {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              className="group inline-flex h-11 w-11 cursor-pointer items-center justify-center rounded-full transition-transform duration-300 ease-[var(--ease-premium)] hover:scale-110 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 motion-reduce:transition-none motion-reduce:hover:scale-100"
            >
              <Icon
                className={cn(
                  "h-6 w-6 transition-[filter,transform] duration-300 ease-[var(--ease-premium)] group-hover:scale-105",
                  glow
                )}
              />
            </a>
          </li>
        );
      })}
    </ul>
  );
}
