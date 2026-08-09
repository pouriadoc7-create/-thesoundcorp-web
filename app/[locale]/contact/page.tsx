import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { ContactHero } from "@/components/contact/ContactHero";
import { ContactMap } from "@/components/contact/ContactMap";
import { JsonLd } from "@/components/seo/JsonLd";
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

  // Single wrapping element (not a bare Fragment): on a route transition React 19
  // calls scrollIntoView on EACH top-level child of the page it renders. With a bare
  // Fragment that meant it scrolled through to the last child — the Find Us section
  // near the page bottom — yanking the page down ~725px on navigation, which then
  // collided with the header's height transition and made the header jump/loop. One
  // root element makes React scroll to the page top instead. (Full-width layout is
  // unchanged: the div is a plain block and both sections stay full-bleed.)
  return (
    <div>
      <JsonLd data={contactPageJsonLd} />
      <ContactHero />
      <ContactMap />
    </div>
  );
}
