import { getTranslations } from "next-intl/server";

import { Link } from "@/i18n/navigation";

export default async function NotFound() {
  const t = await getTranslations("notFound");

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-6 text-center">
      <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-muted xl:text-sm">
        {t("eyebrow")}
      </p>
      <h1 className="mt-4 text-holo text-[22px] font-medium xl:text-3xl">{t("title")}</h1>
      <p className="mt-3 max-w-md text-[13.5px] text-muted xl:text-base">{t("description")}</p>
      <Link
        href="/"
        className="mt-6 rounded-full bg-white px-5 py-2.5 text-[13px] font-medium text-black transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 xl:px-6 xl:py-3 xl:text-base"
      >
        {t("cta")}
      </Link>
    </div>
  );
}
