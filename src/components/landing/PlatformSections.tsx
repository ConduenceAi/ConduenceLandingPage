import { Pillars } from "@/components/landing/Pillars";
import { Reasoning } from "@/components/landing/Sections";

export function PlatformSections() {
  return (
    <div className="relative w-full overflow-x-hidden bg-white">
      <Reasoning />
      <Pillars />
    </div>
  );
}
