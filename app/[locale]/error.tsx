"use client";

import { useTranslations } from "next-intl";
import { useEffect } from "react";

import { Link } from "@/i18n/navigation";

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorPageProps) {
  const t = useTranslations("error");

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-6 text-center">
      <h1 className="text-holo text-[22px] font-medium xl:text-3xl">{t("title")}</h1>
      <p className="mt-3 max-w-md text-[13.5px] text-muted xl:text-base">{t("description")}</p>
      <div className="mt-8 flex flex-wrap justify-center gap-4">
        <button
          type="button"
          onClick={reset}
          className="rounded-full bg-white px-5 py-2.5 text-[13px] font-medium text-black transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 xl:px-6 xl:py-3 xl:text-base"
        >
          {t("retry")}
        </button>
        <Link
          href="/"
          className="rounded-full border border-gray-500 px-5 py-2.5 text-[13px] text-white transition-colors hover:border-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 xl:px-6 xl:py-3 xl:text-base"
        >
          {t("goHome")}
        </Link>
      </div>
    </div>
  );
}
