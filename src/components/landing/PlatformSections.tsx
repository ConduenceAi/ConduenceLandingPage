import { Pillars } from "@/components/landing/Pillars";
import { Reasoning } from "@/components/landing/Sections";

export function PlatformSections() {
  return (
    <div className="relative bg-white">
      <Reasoning />
      <Pillars />
    </div>
  );
}
