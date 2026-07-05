import type { Metadata } from "next";

import { Nav } from "@/components/landing/Nav";
import { Hero } from "@/components/landing/Hero";
import { PlatformSections } from "@/components/landing/PlatformSections";
import { AgentsScroll, CTA } from "@/components/landing/Sections";
import { FAQ } from "@/components/landing/FAQ";
import { ComputationalConviction } from "@/components/landing/ComputationalConviction";
import { WeMoveAsOne } from "@/components/landing/WeMoveAsOne";

export const metadata: Metadata = {
  title: "CONDUENCE. AI agents that think with you",
  description:
    "Prediction market orchestration at whale speed. Drag and drop agents, tools, and Mind Agents, with you in control.",
  openGraph: {
    title: "CONDUENCE. AI agents that think with you",
    description: "Prediction market orchestration at whale speed, human in the loop.",
  },
};

export default function HomePage() {
  return (
    <main className="bg-background text-foreground">
      <Nav />
      <Hero />
      <PlatformSections />
      <AgentsScroll />
      <WeMoveAsOne />
      <ComputationalConviction />
      <FAQ />
      <CTA />
    </main>
  );
}
