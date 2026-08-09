"use client";

import { useTranslations } from "next-intl";

import { DocumentRow } from "@/components/downloads/DocumentRow";
import type { DownloadDocument } from "@/lib/types/download";

interface DocumentGroupProps {
  groupKey: string;
  docs: DownloadDocument[];
  brandSlug: string;
  productSlug: string;
}

/** A titled band of documents (Manuals, Technical, …) with hairline dividers. */
export function DocumentGroup({ groupKey, docs, brandSlug, productSlug }: DocumentGroupProps) {
  const t = useTranslations("downloads");

  return (
    <section>
      {/* Centered stack on mobile; the original inline row from sm: upward. */}
      <header className="flex flex-col items-center gap-2 text-center sm:flex-row sm:gap-4 sm:text-start">
        <div className="flex items-center gap-3 sm:gap-4">
          <h3 className="text-[11px] font-medium uppercase tracking-[0.24em] text-zinc-400">
            {t(`groups.${groupKey}`)}
          </h3>
          <span className="text-[11px] tabular-nums text-muted">
            {String(docs.length).padStart(2, "0")}
          </span>
        </div>
        <span aria-hidden="true" className="hr-premium w-16 sm:w-auto sm:flex-1" />
      </header>

      <div className="mt-3 overflow-hidden rounded-[var(--radius-panel)] border border-white/[0.06] bg-white/[0.015]">
        <div className="divide-y divide-white/[0.05]">
          {docs.map((doc) => (
            <DocumentRow key={doc.id} doc={doc} brandSlug={brandSlug} productSlug={productSlug} />
          ))}
        </div>
      </div>
    </section>
  );
}
