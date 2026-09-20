import { Pillars } from "@/components/landing/Pillars";
import { ProblemSection } from "@/components/landing/ProblemSection";
import { Reasoning } from "@/components/landing/Sections";
import { SharedEdge } from "@/components/landing/SharedEdge";
import { TheProblem } from "@/components/landing/TheProblem";
import { UnfairAdvantage } from "@/components/landing/UnfairAdvantage";

export function PlatformSections() {
  return (
    <div className="relative w-full bg-white">
      <SharedEdge />
      <Reasoning />
      <UnfairAdvantage />
      <ProblemSection />
      <TheProblem />
      <Pillars />
    </div>
  );
}
