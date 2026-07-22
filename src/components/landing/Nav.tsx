"use client";

import Link from "next/link";

import { ConduenceLogo } from "@/components/ConduenceLogo";
import { CornerArrow } from "@/components/landing/CornerArrow";

export function Nav() {
  const scrollToTop = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });
    window.history.replaceState(null, "", window.location.pathname);
  };

  return (
    <header className="pointer-events-none fixed top-[clamp(0.85rem,2vw,1.25rem)] left-0 right-0 z-50 flex items-center justify-center px-[clamp(1rem,3vw,2rem)]">
      <a
        href="#top"
        onClick={scrollToTop}
        className="pointer-events-auto relative flex h-[clamp(2.5rem,5vw,3.5rem)] items-center justify-center px-[clamp(0.65rem,1.5vw,1rem)] py-1"
        aria-label="Scroll to top"
      >
        <span
          aria-hidden
          className="absolute inset-0 rounded-full border border-black/15 bg-transparent sm:border-white/[0.12] sm:bg-white/[0.08] sm:backdrop-blur-[28px] sm:supports-[backdrop-filter]:bg-white/[0.08]"
        />
        <ConduenceLogo className="relative z-10 h-full scale-110" variant="auto" />
      </a>

      <Link
        href="/talk-to-founder"
        className="pointer-events-auto absolute right-[clamp(1rem,3vw,2rem)] top-1/2 inline-flex -translate-y-1/2 items-center gap-1.5 rounded-full border border-black/12 bg-white/80 px-3.5 py-2 text-[clamp(0.75rem,0.2vw+0.7rem,0.875rem)] font-medium tracking-[-0.01em] text-black shadow-[0_1px_0_rgba(0,0,0,0.04)] backdrop-blur-md transition hover:bg-white [font-family:var(--font-ui),system-ui,sans-serif]"
      >
        <CornerArrow direction="right" className="size-[1.05em]" />
        Talk to Founder
      </Link>
    </header>
  );
}
