import type { Metadata } from "next";

import { Nav } from "@/components/landing/Nav";
import { Hero } from "@/components/landing/Hero";
import { BackedBy } from "@/components/landing/BackedBy";
import { PlatformSections } from "@/components/landing/PlatformSections";
import { CTA } from "@/components/landing/Sections";
import { WeMoveAsOne } from "@/components/landing/WeMoveAsOne";
import { absoluteUrl, siteTagline } from "@/lib/site";

export const metadata: Metadata = {
  title: "CONDUENCE. Agents that trade like you",
  description: siteTagline,
  alternates: {
    canonical: absoluteUrl("/"),
  },
  openGraph: {
    title: "CONDUENCE. Agents that trade like you",
    description: siteTagline,
    url: absoluteUrl("/"),
  },
};

export default function HomePage() {
  return (
    <main className="bg-background text-foreground">
      <Nav />
      <Hero />
      <BackedBy />
      <PlatformSections />
      <WeMoveAsOne />
      <CTA />
    </main>
  );
}
