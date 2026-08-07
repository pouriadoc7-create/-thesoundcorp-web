import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { Button } from "@/components/ui/Button";
import { PlaceholderSection } from "@/components/ui/PlaceholderSection";
import { SITE_NAME } from "@/lib/constants/site";
import { buildPageMetadata } from "@/lib/utils/metadata";

interface DownloadsPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: DownloadsPageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata.downloads" });

  return buildPageMetadata({
    locale,
    path: "/downloads",
    title: t("title"),
    description: t("description", { siteName: SITE_NAME }),
  });
}

export default async function DownloadsPage({ params }: DownloadsPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("downloads");

  return (
    <PlaceholderSection eyebrow={t("eyebrow")} title={t("title")} description={t("description")}>
      <Button href="/brands" size="lg">
        {t("cta")}
      </Button>
    </PlaceholderSection>
  );
}
