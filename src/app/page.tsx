import type { Metadata } from "next";

import { Nav } from "@/components/landing/Nav";
import { Hero } from "@/components/landing/Hero";
import { PlatformSections } from "@/components/landing/PlatformSections";
import { CTA } from "@/components/landing/Sections";
// import { FAQ } from "@/components/landing/FAQ";
import { ComputationalConviction } from "@/components/landing/ComputationalConviction";
import { WeMoveAsOne } from "@/components/landing/WeMoveAsOne";

export const metadata: Metadata = {
  title: "CONDUENCE. Agents that trade like you",
  description: "Orchestrate AI agents that learn your perspective, mirror your reasoning.",
  openGraph: {
    title: "CONDUENCE. Agents that trade like you",
    description: "Orchestrate AI agents that learn your perspective, mirror your reasoning.",
  },
};

export default function HomePage() {
  return (
    <main className="bg-background text-foreground">
      <Nav />
      <Hero />
      <PlatformSections />
      <WeMoveAsOne />
      <ComputationalConviction />
      {/* <FAQ /> */}
      <CTA />
    </main>
  );
}
