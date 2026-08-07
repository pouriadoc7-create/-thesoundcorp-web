import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { ContactChannels } from "@/components/contact/ContactChannels";
import { ContactMap } from "@/components/contact/ContactMap";
import { JsonLd } from "@/components/seo/JsonLd";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { CONTACT, SITE_NAME, SITE_URL } from "@/lib/constants/site";
import { buildPageMetadata } from "@/lib/utils/metadata";

interface ContactPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: ContactPageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata.contact" });

  return buildPageMetadata({
    locale,
    path: "/contact",
    title: t("title"),
    description: t("description", { siteName: SITE_NAME }),
  });
}

export default async function ContactPage({ params }: ContactPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("contact");

  const contactPageJsonLd = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    name: t("title"),
    url: `${SITE_URL}/${locale}/contact`,
    mainEntity: {
      "@type": "Organization",
      name: SITE_NAME,
      telephone: CONTACT.phone.display,
      email: CONTACT.email.display,
      address: { "@type": "PostalAddress", addressLocality: "Tehran", addressCountry: "IR" },
    },
  };

  return (
    <Section>
      <JsonLd data={contactPageJsonLd} />
      <Container className="flex flex-col items-center">
        <SectionHeader eyebrow={t("eyebrow")} title={t("title")} description={t("description")} />

        <ContactChannels />
        <ContactMap />
      </Container>
    </Section>
  );
}
