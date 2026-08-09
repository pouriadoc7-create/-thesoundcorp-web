"use client";

import { useTranslations } from "next-intl";

import { DownloadIcon } from "@/components/downloads/DownloadIcon";
import type { DownloadDocument } from "@/lib/types/download";

interface DocumentRowProps {
  brandSlug: string;
  productSlug: string;
  doc: DownloadDocument;
  /** Optional context line (used in flat search results): "Primare · NP5". */
  context?: string;
}

function formatBytes(n?: number): string | null {
  if (!n || n <= 0) return null;
  const units = ["B", "KB", "MB", "GB"];
  let value = n;
  let i = 0;
  while (value >= 1024 && i < units.length - 1) {
    value /= 1024;
    i += 1;
  }
  const rounded = value >= 100 || i === 0 ? Math.round(value) : Math.round(value * 10) / 10;
  return `${rounded} ${units[i]}`;
}

/** Present the real filename cleanly on this premium surface: drop the file
 *  extension (the format chip already shows it) and turn "_" separators into
 *  spaces. Pure reformatting of the actual filename — no invented wording. */
function displayTitle(title: string): string {
  return title
    .replace(/\.(pdf|zip|exe|docx?|pptx)$/i, "")
    .replace(/_+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/** Consistent 1.5px document glyph; firmware/software get a distinct chip mark. */
function DocGlyph({ type }: { type: DownloadDocument["type"] }) {
  if (type === "firmware" || type === "software") {
    return (
      <svg viewBox="0 0 24 24" fill="none" className="h-[18px] w-[18px]" aria-hidden="true">
        <rect x="6.5" y="6.5" width="11" height="11" rx="2" stroke="currentColor" strokeWidth="1.4" />
        <path
          d="M9.5 3.5v2M14.5 3.5v2M9.5 18.5v2M14.5 18.5v2M3.5 9.5h2M3.5 14.5h2M18.5 9.5h2M18.5 14.5h2"
          stroke="currentColor"
          strokeWidth="1.3"
          strokeLinecap="round"
        />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-[18px] w-[18px]" aria-hidden="true">
      <path
        d="M7 3.5h6.5L18 8v11a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 6 19V5A1.5 1.5 0 0 1 7 3.5Z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
      <path d="M13 3.6V8h4.4" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
      <path d="M9 12.5h6M9 15.5h4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" className="opacity-70" />
    </svg>
  );
}

export function DocumentRow({ brandSlug, productSlug, doc, context }: DocumentRowProps) {
  const t = useTranslations("downloads");
  const size = formatBytes(doc.fileSize);
  const typeLabel = t(`types.${doc.type}`);
  const title = displayTitle(doc.title);
  const source = doc.localPath ?? doc.officialUrl ?? "";
  const filename = source.split("/").pop() || `${doc.id}.${doc.format.toLowerCase()}`;

  const meta = [doc.format, doc.language, doc.version, doc.date, size].filter(Boolean) as string[];

  return (
    <div className="group/row relative flex items-center gap-3 py-3.5 ps-4 pe-2 sm:gap-4 sm:ps-5">
      {/* Inline-start hairline that draws in on hover. */}
      <span
        aria-hidden="true"
        className="absolute inset-y-2 left-0 w-px origin-center scale-y-0 bg-gradient-to-b from-transparent via-[color:var(--color-gold)]/60 to-transparent transition-transform duration-500 ease-[var(--ease-premium)] group-hover/row:scale-y-100 rtl:left-auto rtl:right-0"
      />

      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-white/[0.08] bg-white/[0.02] text-zinc-400 transition-colors duration-500 group-hover/row:border-[color:var(--color-gold)]/30 group-hover/row:text-[color:var(--color-gold-soft)]">
        <DocGlyph type={doc.type} />
      </span>

      <div className="min-w-0 flex-1">
        {context ? (
          <div className="mb-0.5 text-[10px] uppercase tracking-[0.16em] text-muted">{context}</div>
        ) : null}
        <div className="line-clamp-2 text-[13.5px] font-medium text-zinc-100 transition-colors duration-500 group-hover/row:text-white sm:text-sm">
          {title}
        </div>
        <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] text-muted">
          <span className="font-medium tracking-wide text-zinc-400">{typeLabel}</span>
          {meta.map((m, i) => (
            <span key={`${m}-${i}`} className="flex items-center gap-2">
              <span aria-hidden="true" className="text-zinc-700">
                ·
              </span>
              <span className="tabular-nums">{m}</span>
            </span>
          ))}
        </div>
      </div>

      {/* Official-source marker — quiet shield, hidden on the smallest screens. */}
      <span className="hidden shrink-0 items-center gap-1.5 rounded-full border border-white/[0.06] px-2.5 py-1 text-[10px] uppercase tracking-[0.14em] text-muted sm:inline-flex">
        <svg viewBox="0 0 24 24" fill="none" className="h-3 w-3 text-[color:var(--color-gold-soft)]/80" aria-hidden="true">
          <path
            d="M12 3 5 6v5.2c0 4.2 2.9 7.4 7 9.3 4.1-1.9 7-5.1 7-9.3V6l-7-3Z"
            stroke="currentColor"
            strokeWidth="1.3"
            strokeLinejoin="round"
          />
          <path d="M9.3 12.2 11 14l3.7-3.8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        {t("official")}
      </span>

      <DownloadIcon
        brand={brandSlug}
        product={productSlug}
        doc={doc.id}
        filename={filename}
        href={doc.localPath}
        ariaLabel={t("downloadAria", { title })}
        tooltip={t("downloadTooltip")}
      />
    </div>
  );
}
