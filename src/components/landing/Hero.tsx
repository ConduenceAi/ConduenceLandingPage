"use client";

import { motion } from "framer-motion";

import { heroBgSrc } from "@/lib/assets";

export function Hero() {
  return (
    <section
      id="top"
      className="relative h-svh w-full overflow-hidden bg-white text-black sm:min-h-screen sm:h-auto"
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
      <div className="relative z-10 mx-auto flex h-full max-w-5xl flex-col items-center justify-center bg-transparent px-section pb-6 pt-20 text-center sm:min-h-screen sm:pb-0 sm:pt-32">
        <motion.h1
          initial={false}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.05, ease: "easeOut" }}
          className="text-display-hero max-w-4xl bg-transparent text-balance font-display leading-[0.95] tracking-[-0.02em] text-black"
        >
          Agents
          <br />
          <span className="font-display">that trade like</span>
          <br />
          <span className="font-display">you</span>
        </motion.h1>

        <motion.p
          initial={false}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.12, ease: "easeOut" }}
          className="text-body-fluid mt-5 max-w-xl bg-transparent leading-relaxed text-black/70 sm:mt-8"
        >
          Orchestrate AI agents that learn your perspective, mirror your reasoning, from your voice.
        </motion.p>
      </div>
    </section>
  );
}
