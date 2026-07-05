"use client";

import { motion } from "framer-motion";

import { heroBgSrc } from "@/lib/assets";

export function Hero() {
  return (
    <section id="top" className="relative min-h-screen w-full overflow-hidden bg-white text-black">
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div
          className="absolute inset-y-0 left-0 w-1/2 bg-left bg-no-repeat"
          style={{
            backgroundImage: `url(${heroBgSrc})`,
            backgroundSize: "auto 100%",
          }}
        />
        <div
          className="absolute inset-y-0 right-0 w-1/2 bg-right bg-no-repeat"
          style={{
            backgroundImage: `url(${heroBgSrc})`,
            backgroundSize: "auto 100%",
          }}
        />
      </div>
      <div className="relative z-10 mx-auto flex min-h-screen max-w-5xl flex-col items-center justify-center px-section pt-28 text-center sm:pt-32">
        <motion.h1
          initial={false}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.05, ease: "easeOut" }}
          className="text-display-hero max-w-4xl text-balance font-display leading-[0.95] tracking-[-0.02em] text-black"
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
          className="text-body-fluid mt-6 max-w-xl leading-relaxed text-black/70 sm:mt-8"
        >
          Orchestrate AI agents that learn your perspective, mirror your reasoning, from your voice.
        </motion.p>
      </div>
    </section>
  );
}
