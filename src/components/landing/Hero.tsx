"use client";

import { motion } from "framer-motion";

import { heroCloudsSrc } from "@/lib/assets";

export function Hero() {
  return (
    <section id="top" className="relative min-h-screen w-full overflow-hidden bg-black text-white">
      {/* Background image */}
      <img
        src={heroCloudsSrc.src}
        alt="Monochrome cloudscape"
        width={1920}
        height={1080}
        className="absolute inset-0 h-full w-full object-cover saturate-0"
        style={{ zIndex: 0 }}
      />

      {/* Vignette / readability gradients */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          zIndex: 1,
          background:
            "radial-gradient(ellipse at center, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.75) 60%, rgba(0,0,0,0.95) 100%)",
        }}
      />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          zIndex: 1,
          background:
            "linear-gradient(to bottom, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0) 30%, rgba(0,0,0,0) 60%, rgba(0,0,0,0.9) 100%)",
        }}
      />

      {/* Grain */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.12] mix-blend-overlay"
        style={{
          zIndex: 2,
          backgroundImage:
            "repeating-linear-gradient(0deg, rgba(255,255,255,0.5) 0px, rgba(255,255,255,0.5) 1px, transparent 1px, transparent 3px)",
        }}
      />

      {/* Content — centered */}
      <div className="relative z-10 mx-auto flex min-h-screen max-w-5xl flex-col items-center justify-center px-8 text-center">
        <motion.h1
          initial={false}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.05, ease: "easeOut" }}
          className="mt-8 max-w-4xl text-balance text-5xl leading-[0.96] tracking-tight text-white md:text-[6.5rem]"
          style={{
            fontFamily: '"Cormorant Garamond", "Playfair Display", Georgia, serif',
            fontWeight: 500,
          }}
        >
          AI agents that
          <br />
          <em className="italic font-light text-white">think with you</em>
        </motion.h1>

        <motion.p
          initial={false}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.12, ease: "easeOut" }}
          className="mt-8 max-w-xl text-base leading-relaxed text-white/78 md:text-lg"
        >
          Prediction-market orchestration at whale speed — with you in control.
        </motion.p>

        <motion.div
          initial={false}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.18, ease: "easeOut" }}
          className="mt-10 relative inline-block"
        >
          <a
            href="#cta"
            className="group relative inline-flex items-center gap-3 rounded-full border border-white/30 bg-white/10 px-7 py-3.5 text-sm font-medium tracking-wide text-white backdrop-blur-md transition hover:bg-white hover:text-black"
          >
            Join Waitlist
            <span className="transition-transform group-hover:translate-x-1">→</span>
          </a>
        </motion.div>
      </div>

      {/* Bottom edge fade into next section */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-b from-transparent to-black z-[3] pointer-events-none" />
    </section>
  );
}
