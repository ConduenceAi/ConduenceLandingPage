"use client";

import Link from "next/link";
import { useCallback } from "react";

import { ConduenceLogo } from "@/components/ConduenceLogo";
import { CornerArrow } from "@/components/landing/CornerArrow";
import { Footer } from "@/components/landing/Footer";
import { CALENDLY_URL } from "@/lib/calendly";

declare global {
  interface Window {
    Calendly?: {
      initPopupWidget: (options: { url: string }) => void;
    };
  }
}

export function TalkToFounderPage() {
  const openCalendly = useCallback(() => {
    if (!CALENDLY_URL) {
      console.error("Missing NEXT_PUBLIC_CALENDLY_URL");
      return;
    }

    if (typeof window !== "undefined" && window.Calendly?.initPopupWidget) {
      window.Calendly.initPopupWidget({ url: CALENDLY_URL });
      return;
    }

    window.open(CALENDLY_URL, "_blank", "noopener,noreferrer");
  }, []);

  return (
    <main className="relative flex min-h-svh flex-col bg-white text-black">
      <header className="absolute inset-x-0 top-[clamp(0.85rem,2vw,1.25rem)] z-20 flex items-center justify-center px-[clamp(1rem,3vw,2rem)]">
        <Link
          href="/"
          className="flex h-[clamp(2.5rem,5vw,3.5rem)] items-center justify-center"
          aria-label="CONDUENCE home"
        >
          <ConduenceLogo className="h-full scale-110" variant="on-light" />
        </Link>
      </header>

      <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col items-center justify-center px-[clamp(1.25rem,4vw,2rem)] py-[clamp(6rem,12vw,8rem)] text-center">
        <h1 className="text-[clamp(2.25rem,5vw+0.5rem,3.75rem)] font-normal leading-[1.05] tracking-[-0.03em] text-black [font-family:var(--font-display),Georgia,serif]">
          Talk to the founder.
        </h1>

        <p className="mt-[clamp(1rem,2.5vw,1.35rem)] max-w-md text-[clamp(0.9375rem,0.35vw+0.85rem,1.0625rem)] leading-relaxed text-black/55 [font-family:var(--font-ui),system-ui,sans-serif]">
          Book a 30-minute call to discuss agent orchestration, private beta, or early access.
        </p>

        <button
          type="button"
          onClick={openCalendly}
          disabled={!CALENDLY_URL}
          className="mt-[clamp(1.75rem,4vw,2.5rem)] rounded-full bg-[#14161A] px-[clamp(1.5rem,3vw,1.85rem)] py-[clamp(0.7rem,1.4vw,0.85rem)] text-[clamp(0.875rem,0.25vw+0.8rem,0.9375rem)] font-medium text-white transition hover:bg-black disabled:cursor-not-allowed disabled:opacity-50 [font-family:var(--font-ui),system-ui,sans-serif]"
        >
          Talk to founder
        </button>

        <Link
          href="/"
          className="mt-[clamp(1.35rem,3vw,1.75rem)] inline-flex items-center gap-1.5 text-[clamp(0.8125rem,0.2vw+0.75rem,0.9375rem)] font-medium tracking-[-0.01em] text-black/70 transition hover:text-black [font-family:var(--font-ui),system-ui,sans-serif]"
        >
          <CornerArrow direction="left" />
          Back to home
        </Link>
      </div>

      <Footer variant="light" />
    </main>
  );
}
