import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils/cn";

export interface Crumb {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: Crumb[];
  /** Accessible name for the nav landmark (localised). */
  label: string;
  className?: string;
}

/**
 * Visible, accessible breadcrumb trail. Renders an ordered list inside a
 * labelled nav, marks the final crumb with aria-current="page", and mirrors its
 * separator under RTL. Pair with a matching BreadcrumbList JSON-LD on the page.
 */
export function Breadcrumbs({ items, label, className }: BreadcrumbsProps) {
  return (
    <nav aria-label={label} className={cn("text-sm", className)}>
      <ol className="flex flex-wrap items-center gap-2 text-zinc-500">
        {items.map((crumb, i) => {
          const last = i === items.length - 1;
          return (
            <li key={`${crumb.label}-${i}`} className="flex items-center gap-2">
              {i > 0 ? (
                <span aria-hidden="true" className="text-zinc-600 rtl:-scale-x-100">
                  /
                </span>
              ) : null}
              {crumb.href && !last ? (
                <Link
                  href={crumb.href}
                  className="rounded-md transition-colors hover:text-[color:var(--color-gold-soft)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
                >
                  {crumb.label}
                </Link>
              ) : (
                <span aria-current={last ? "page" : undefined} className={last ? "text-zinc-300" : ""}>
                  {crumb.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
