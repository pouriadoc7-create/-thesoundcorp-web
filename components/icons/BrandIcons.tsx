/**
 * Full-colour brand icons for the footer contact links. These are separate from
 * the monochrome set in ContactIcons.tsx (used by the floating button and
 * inquiry CTAs) so the footer can show official brand colours without changing
 * those. Icons are decorative — the anchor carries the accessible label — so
 * each is aria-hidden. Pass `className` to size (e.g. h-6 w-6).
 */

interface IconProps {
  className?: string;
}

const svgBase = {
  viewBox: "0 0 24 24",
  "aria-hidden": true as const,
  focusable: false as const,
  xmlns: "http://www.w3.org/2000/svg",
};

/** WhatsApp — official green (#25D366) glyph. */
export function WhatsAppBrandIcon({ className }: IconProps) {
  return (
    <svg {...svgBase} className={className}>
      <path
        fill="#25D366"
        d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.71.306 1.263.489 1.694.625.712.227 1.36.195 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.885-9.885 9.885M20.52 3.449C18.24 1.245 15.24.044 12.045.044 5.463.044.104 5.403.101 11.986c0 2.096.549 4.14 1.595 5.945L0 24l6.335-1.652a11.96 11.96 0 0 0 5.71 1.454h.006c6.585 0 11.946-5.36 11.949-11.945a11.89 11.89 0 0 0-3.48-8.418"
      />
    </svg>
  );
}

/** Instagram — official radial gradient (yellow → magenta → violet → blue). */
export function InstagramBrandIcon({ className }: IconProps) {
  return (
    <svg {...svgBase} className={className}>
      <defs>
        <radialGradient id="ig-grad" cx="30%" cy="107%" r="140%">
          <stop offset="0%" stopColor="#fdf497" />
          <stop offset="5%" stopColor="#fdf497" />
          <stop offset="45%" stopColor="#fd5949" />
          <stop offset="60%" stopColor="#d6249f" />
          <stop offset="90%" stopColor="#285aeb" />
        </radialGradient>
      </defs>
      <path
        fill="url(#ig-grad)"
        d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069M12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0m0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324M12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8m6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881"
      />
    </svg>
  );
}

/** Gmail — official multi-colour "M" envelope. */
export function GmailBrandIcon({ className }: IconProps) {
  return (
    <svg {...svgBase} className={className}>
      <path fill="#4285F4" d="M3.5 20h2.9v-7.3L2 9.3v9.3c0 .83.67 1.4 1.5 1.4Z" />
      <path fill="#34A853" d="M17.6 20h2.9c.83 0 1.5-.57 1.5-1.4V9.3l-4.4 3.4V20Z" />
      <path fill="#FBBC04" d="M17.6 5.5v7.2L22 9.3V6.2c0-2.02-2.31-3.17-3.9-1.96l-.5.38Z" />
      <path fill="#EA4335" d="M6.4 12.7V5.5L12 9.7l5.6-4.2v7.2L12 16.9 6.4 12.7Z" />
      <path fill="#C5221F" d="M2 6.2v3.1l4.4 3.4V5.5l-.5-.38C4.31 3.03 2 4.18 2 6.2Z" />
    </svg>
  );
}

/** Google Maps — iconic red pin (#EA4335) with a white centre. */
export function GoogleMapsBrandIcon({ className }: IconProps) {
  return (
    <svg {...svgBase} className={className}>
      <path
        fill="#EA4335"
        d="M12 2a7 7 0 0 0-7 7c0 4.64 6.02 12.35 6.28 12.68a.92.92 0 0 0 1.44 0C13 21.35 19 13.64 19 9a7 7 0 0 0-7-7Z"
      />
      <circle cx="12" cy="9" r="2.6" fill="#ffffff" />
    </svg>
  );
}

/** Phone — clean white handset (premium neutral against the WhatsApp green). */
export function PhoneBrandIcon({ className }: IconProps) {
  return (
    <svg {...svgBase} className={className}>
      <path
        fill="#ffffff"
        d="M19.44 13.06c-.27 0-.55-.09-.82-.15a9.5 9.5 0 0 1-1.6-.48 2 2 0 0 0-2.48 1l-.18.36a12.34 12.34 0 0 1-2.68-2 12.34 12.34 0 0 1-2-2.68l.36-.18a2 2 0 0 0 1-2.48 9.5 9.5 0 0 1-.48-1.6c-.06-.27-.11-.55-.15-.83A3 3 0 0 0 7.16 2H4.16A3 3 0 0 0 1.19 5.31 19 19 0 0 0 18.68 22.8h.34a3 3 0 0 0 3-3v-3a3 3 0 0 0-2.58-2.74Z"
      />
    </svg>
  );
}

/** YouTube — official red (#FF0000) rounded body with a white play triangle. */
export function YouTubeBrandIcon({ className }: IconProps) {
  return (
    <svg {...svgBase} className={className}>
      <path
        fill="#FF0000"
        d="M23.5 6.51a2.79 2.79 0 0 0-1.96-1.98C19.8 4.06 12 4.06 12 4.06s-7.8 0-9.54.47A2.79 2.79 0 0 0 .5 6.51 29.3 29.3 0 0 0 .02 12a29.3 29.3 0 0 0 .48 5.49 2.79 2.79 0 0 0 1.96 1.98c1.74.47 9.54.47 9.54.47s7.8 0 9.54-.47a2.79 2.79 0 0 0 1.96-1.98A29.3 29.3 0 0 0 23.98 12a29.3 29.3 0 0 0-.48-5.49Z"
      />
      <path fill="#ffffff" d="M9.6 15.6 15.82 12 9.6 8.4v7.2Z" />
    </svg>
  );
}
