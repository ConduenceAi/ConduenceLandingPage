import type { Metadata } from "next";

import { Nav } from "@/components/landing/Nav";
import { CTA } from "@/components/landing/Sections";
import { PricingPage } from "@/components/pricing/PricingPage";
import { absoluteUrl, siteTagline } from "@/lib/site";

export const metadata: Metadata = {
  title: "Pricing",
  description: siteTagline,
  alternates: {
    canonical: absoluteUrl("/pricing"),
  },
  openGraph: {
    title: "Pricing | CONDUENCE",
    description: siteTagline,
    url: absoluteUrl("/pricing"),
  },
};

export default function PricingRoute() {
  return (
    <>
      <Nav />
      <PricingPage />
      <CTA />
    </>
  );
}
