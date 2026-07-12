import { Pillars } from "@/components/landing/Pillars";
import { Reasoning } from "@/components/landing/Sections";
import { TheProblem } from "@/components/landing/TheProblem";

export function PlatformSections() {
  return (
    <div className="relative w-full bg-white">
      <Reasoning />
      <TheProblem />
      <Pillars />
    </div>
  );
}
