import { BrandLogo } from "@/components/ui/BrandLogo";
import { Link } from "@/i18n/navigation";
import { BRAND_LOGOS, LOGO_SCALE } from "@/lib/data/brand-logos";
import type { Brand } from "@/lib/types/brand";
import { cn } from "@/lib/utils/cn";

interface BrandLogoTileProps {
  brand: Brand;
  /** Pre-localized "N documents" label; when provided, a documents badge shows. */
  docsLabel?: string;
  className?: string;
}

/**
 * The one brand logo tile — a card-lux link to the brand page with the official
 * logo (scaled per LOGO_SCALE) and an optional documents badge. Shared by the
 * homepage portfolio grid and the /brands index so their markup can't drift
 * (the audit flagged the two as duplicated). Layout width/reveal stays with the
 * caller; this owns the tile itself.
 */
export function BrandLogoTile({ brand, docsLabel, className }: BrandLogoTileProps) {
  const scale = LOGO_SCALE[brand.slug];

  return (
    <Link
      href={`/brands/${brand.slug}`}
      className={cn(
        "card-lux group relative flex h-full min-h-28 flex-col items-center justify-center gap-3 rounded-xl border border-white/[0.08] p-6 text-center transition-colors hover:border-white/25 hover:bg-white/[0.03] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60",
        className
      )}
    >
      <div
        className="flex flex-1 items-center justify-center"
        style={scale ? { transform: `scale(${scale})` } : undefined}
      >
        <BrandLogo
          name={brand.name}
          logoUrl={BRAND_LOGOS[brand.slug]}
          sizes="(max-width: 768px) 40vw, (max-width: 1024px) 22vw, 180px"
          className="h-11 w-full"
          imgClassName="opacity-80 transition-opacity duration-300 group-hover:opacity-100"
          wordmarkClassName="text-[15px] font-medium text-white/90 xl:text-lg"
        />
      </div>

      {docsLabel ? (
        <span className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-[0.14em] text-muted transition-colors duration-300 group-hover:text-[color:var(--color-gold-soft)]/85">
          <svg
            viewBox="0 0 24 24"
            className="h-3 w-3"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M12 3v11m0 0 4-4m-4 4-4-4" />
            <path d="M5 19h14" />
          </svg>
          {docsLabel}
        </span>
      ) : null}
    </Link>
  );
}
