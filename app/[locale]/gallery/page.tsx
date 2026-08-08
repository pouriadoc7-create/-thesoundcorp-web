import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { GalleryClient } from "@/components/gallery/GalleryClient";
import { Reveal } from "@/components/motion/Reveal";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { SITE_NAME } from "@/lib/constants/site";
import { buildPageMetadata } from "@/lib/utils/metadata";

interface GalleryPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: GalleryPageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata.gallery" });

  return buildPageMetadata({
    locale,
    path: "/gallery",
    title: t("title"),
    description: t("description", { siteName: SITE_NAME }),
  });
}

export default async function GalleryPage({ params }: GalleryPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("gallery");

  return (
    <Section>
      <Container>
        <SectionHeader eyebrow={t("eyebrow")} title={t("title")} description={t("description")} />

        <Reveal delayMs={240} className="mt-14">
          <GalleryClient />
        </Reveal>

        <p className="mt-12 text-center text-xs text-zinc-400">{t("sampleNote")}</p>
      </Container>
    </Section>
  );
}
