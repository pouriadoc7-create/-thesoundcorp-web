import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { ContactHero } from "@/components/contact/ContactHero";
import { ContactMap } from "@/components/contact/ContactMap";
import { JsonLd } from "@/components/seo/JsonLd";
import { Container } from "@/components/ui/Container";
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
    <>
      <JsonLd data={contactPageJsonLd} />
      <ContactHero />
      <Container className="pb-24">
        <ContactMap />
      </Container>
    </>
  );
}
