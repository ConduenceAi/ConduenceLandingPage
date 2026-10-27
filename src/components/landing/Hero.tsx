"use client";

import { motion } from "framer-motion";

import { heroBgSrc } from "@/lib/assets";
import { siteTagline } from "@/lib/site";

export function Hero() {
  return (
    <section
      id="top"
      className="relative w-full overflow-hidden bg-white text-black sm:min-h-screen"
    >
      <div aria-hidden className="pointer-events-none absolute inset-0 hidden sm:block">
        <div
          className="absolute inset-y-0 left-0 w-1/2 bg-left bg-no-repeat"
          style={{
            backgroundImage: `url(${heroBgSrc})`,
            backgroundSize: "auto 100%",
            backgroundPosition: "left center",
          }}
        />
        <div
          className="absolute inset-y-0 right-0 w-1/2 bg-right bg-no-repeat"
          style={{
            backgroundImage: `url(${heroBgSrc})`,
            backgroundSize: "auto 100%",
            backgroundPosition: "right center",
          }}
        />
      </div>
      <div className="relative z-10 mx-auto flex h-full max-w-5xl flex-col items-center justify-center bg-transparent px-section pb-[clamp(2.5rem,10vw,3.5rem)] pt-[clamp(7rem,30vw,8.5rem)] text-center sm:min-h-screen sm:pb-0 sm:pt-[clamp(4.5rem,10vw,8rem)]">
        <motion.h1
          initial={false}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.05, ease: "easeOut" }}
          className="text-display-hero max-w-4xl bg-transparent text-balance font-display leading-[0.95] tracking-[-0.02em] text-black"
        >
          <span className="sr-only">CONDUENCE — </span>
          Your edge
          <br />
          <span className="font-display">Running on</span>
          <br />
          <span className="font-display">agents</span>
        </motion.h1>

        <motion.p
          initial={false}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.12, ease: "easeOut" }}
          className="text-body-large mt-[clamp(1rem,2.5vw,2rem)] max-w-xl bg-transparent leading-relaxed text-black/88"
        >
          {siteTagline}
        </motion.p>
      </div>
    </section>
  );
}
