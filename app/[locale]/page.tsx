import { setRequestLocale } from "next-intl/server";

import { BrandsGrid } from "@/components/sections/BrandsGrid";
import { Hero } from "@/components/sections/Hero";

interface HomePageProps {
  params: Promise<{ locale: string }>;
}

export default async function HomePage({ params }: HomePageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <Hero />
      <BrandsGrid />
    </>
  );
}
