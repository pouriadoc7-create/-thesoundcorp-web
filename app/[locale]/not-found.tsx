import { getTranslations } from "next-intl/server";

import { Link } from "@/i18n/navigation";

export default async function NotFound() {
  const t = await getTranslations("notFound");

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-6 text-center">
      <p className="text-sm font-medium uppercase tracking-[0.2em] text-zinc-500">
        {t("eyebrow")}
      </p>
      <h1 className="mt-4 text-3xl font-bold">{t("title")}</h1>
      <p className="mt-4 max-w-md text-gray-500">{t("description")}</p>
      <Link
        href="/"
        className="mt-8 rounded-full bg-white px-6 py-3 font-semibold text-black transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
      >
        {t("cta")}
      </Link>
    </div>
  );
}
