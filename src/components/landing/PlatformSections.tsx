import { Pillars } from "@/components/landing/Pillars";
import { Reasoning } from "@/components/landing/Sections";
import { SharedEdge } from "@/components/landing/SharedEdge";
import { TheProblem } from "@/components/landing/TheProblem";

export function PlatformSections() {
  return (
    <div className="relative w-full bg-white">
      <SharedEdge />
      <Reasoning />
      <TheProblem />
      <Pillars />
    </div>
  );
}
