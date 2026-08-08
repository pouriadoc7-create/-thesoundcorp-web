import { setRequestLocale } from "next-intl/server";

import { BrandsGrid } from "@/components/sections/BrandsGrid";
import { Hero } from "@/components/sections/Hero";
import { HomeExplore } from "@/components/sections/HomeExplore";
import { HomeStatement } from "@/components/sections/HomeStatement";

interface HomePageProps {
  params: Promise<{ locale: string }>;
}

export default async function HomePage({ params }: HomePageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  // Single root element (not a bare Fragment): on a client route transition React 19
  // calls scrollIntoView on the new page, and with a multi-child Fragment it lands on
  // the LAST child — so the page opens scrolled instead of at the top. Navigating
  // onward (e.g. to Contact) then fires a big scroll correction that collides with
  // the header's height transition and makes it jitter. One wrapping element makes
  // React scroll to the page top. (No visual change.)
  return (
    <div>
      <Hero />
      <HomeStatement />
      <BrandsGrid />
      <HomeExplore />
    </div>
  );
}
