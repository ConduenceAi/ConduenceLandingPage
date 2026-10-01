import { ConduenceProblem } from "@/components/landing/ConduenceProblem";
import { Pillars } from "@/components/landing/Pillars";
import { Reasoning } from "@/components/landing/Sections";
import { SharedEdge } from "@/components/landing/SharedEdge";
// Temporarily hidden; retain the component for a future re-enable.
// import { TheProblem } from "@/components/landing/TheProblem";
import { MarketBrief } from "@/components/landing/MarketBrief";
import { UnfairAdvantage } from "@/components/landing/UnfairAdvantage";

export function PlatformSections() {
  return (
    <div className="relative w-full bg-white">
      <SharedEdge />
      <ConduenceProblem />
      <Reasoning />
      <UnfairAdvantage />
      <MarketBrief />
      {/* <TheProblem /> */}
      <Pillars />
    </div>
  );
}
