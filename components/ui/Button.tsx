import type { ComponentPropsWithoutRef, ReactNode } from "react";

import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils/cn";

export type ButtonVariant = "primary" | "gold" | "ghost" | "subtle";
export type ButtonSize = "md" | "lg";

const BASE =
  "btn-lux inline-flex items-center justify-center gap-2 rounded-full font-medium xl:font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-black disabled:pointer-events-none disabled:opacity-50";

const VARIANTS: Record<ButtonVariant, string> = {
  // Light action with a warm gold halo on hover.
  primary:
    "btn-lux--gold bg-white text-black hover:opacity-95 focus-visible:ring-[color:var(--color-gold)]/70",
  // Solid gold — reserved for the single most important action on a view.
  gold: "bg-[color:var(--color-gold)] text-black hover:brightness-105 focus-visible:ring-[color:var(--color-gold)]/70",
  // Outline that warms to gold on hover.
  ghost:
    "btn-lux--ghost border border-white/25 text-white hover:border-[color:var(--color-gold)]/70 hover:text-[color:var(--color-gold-soft)] focus-visible:ring-[color:var(--color-gold)]/60",
  // Quiet glass control for dense UI.
  subtle:
    "border border-white/10 bg-white/[0.03] text-zinc-200 hover:bg-white/[0.06] hover:text-white focus-visible:ring-white/60",
};

const SIZES: Record<ButtonSize, string> = {
  md: "px-5 py-2.5 text-[12.5px] xl:px-6 xl:py-3 xl:text-sm",
  lg: "px-6 py-3 text-[13px] xl:px-8 xl:py-4 xl:text-base",
};

interface BaseProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  children: ReactNode;
}

type AsLink = BaseProps & { href: string } & Omit<
    ComponentPropsWithoutRef<typeof Link>,
    "href" | "className" | "children"
  >;
type AsButton = BaseProps & { href?: never } & Omit<
    ComponentPropsWithoutRef<"button">,
    "className" | "children"
  >;

/**
 * The one button in the system. Renders a locale-aware <Link> when `href` is
 * given, otherwise a native <button>. Variants and sizes are the only styling
 * knobs so every call site shares the same visual language and motion.
 */
export function Button(props: AsLink | AsButton) {
  const cls = cn(BASE, VARIANTS[props.variant ?? "primary"], SIZES[props.size ?? "md"], props.className);

  if ("href" in props && props.href) {
    const { href, variant, size, className, children, ...rest } = props;
    void variant;
    void size;
    void className;
    return (
      <Link href={href} className={cls} {...rest}>
        {children}
      </Link>
    );
  }

  const { variant, size, className, children, href, ...rest } = props as AsButton;
  void variant;
  void size;
  void className;
  void href;
  return (
    <button className={cls} {...rest}>
      {children}
    </button>
  );
}
