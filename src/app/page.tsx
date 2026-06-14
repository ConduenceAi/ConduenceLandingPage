import type { Metadata } from "next";

import { Nav } from "@/components/landing/Nav";
import { Hero } from "@/components/landing/Hero";
import { Pillars } from "@/components/landing/Pillars";
import { Reasoning, AgentsScroll, Workflow, CTA, Footer } from "@/components/landing/Sections";
import { Manifesto } from "@/components/landing/Manifesto";
import { MatrixMantras } from "@/components/landing/MatrixMantras";

export const metadata: Metadata = {
  title: "CONDUENCE — AI agents that think with you",
  description:
    "Prediction market orchestration at whale speed. Drag-and-drop agents, tools, and Mind Agents — with you in control.",
  openGraph: {
    title: "CONDUENCE — AI agents that think with you",
    description: "Prediction market orchestration at whale speed, human in the loop.",
  },
};

export default function HomePage() {
  return (
    <main className="bg-background text-foreground">
      <Nav />
      <Hero />
      <Reasoning />
      <Manifesto />
      <MatrixMantras />
      <AgentsScroll />
      <Workflow />
      <Pillars />
      <CTA />
      <Footer />
    </main>
  );
}
