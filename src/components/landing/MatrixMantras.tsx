"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const MANTRAS = ["I\u2002recall",
  "I\u2002think",
  "I\u2002decide",
  "I\u2002execute", "Now, I remember"];

export function MatrixMantras() {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % MANTRAS.length);
    }, 1800);

    return () => window.clearInterval(interval);
  }, []);

  return (
    <section id="matrix-mantras" className="relative overflow-hidden bg-white px-section pt-4 pb-24 text-black sm:pt-6 sm:pb-16">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0,0,0,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.6) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
          maskImage: "radial-gradient(ellipse at center, black 20%, transparent 75%)",
        }}
      />

      <div className="relative mx-auto flex max-w-6xl flex-col justify-start pt-8 sm:pt-12">
        <div className="flex flex-col items-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, ease: "easeOut" }}
            className="flex flex-col items-center text-center text-display-medium font-display tracking-tight leading-[1.12]"
          >
            <span className="whitespace-nowrap">I am your reasoning and your perception,</span>
            <span className="font-normal italic text-black/55">scaled past every limit.</span>
            <span className="mt-3 sm:mt-4">We move as one.</span>
          </motion.h2>
        </div>

        <div className="mx-auto mt-16 grid w-full max-w-6xl items-center gap-10 pb-6 sm:mt-20 sm:pb-0 lg:grid-cols-[minmax(0,0.72fr)_minmax(0,1.28fr)] lg:gap-16">
          <div className="flex justify-center lg:justify-start">
            <div className="flex flex-col gap-4 text-center lg:text-left">
              {MANTRAS.map((mantra, index) => {
                const isActive = index === activeIndex;

                return (
                  <motion.div
                    key={mantra}
                    initial={false}
                    animate={{
                      opacity: isActive ? 0.42 : 0.78,
                      x: isActive ? 10 : 0,
                    }}
                    transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                    className="flex items-center justify-center gap-3 lg:justify-start"
                  >
                    <span className="font-mono text-[10px] tracking-[0.32em] text-black/28">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span
                      className={`font-display text-[clamp(1.15rem,1vw+0.95rem,1.7rem)] italic leading-none tracking-[-0.03em] ${
                        isActive ? "text-black/38" : "text-black/72"
                      }`}
                    >
                      {mantra}
                    </span>
                  </motion.div>
                );
              })}
            </div>
          </div>

          <div className="relative grid w-full items-center justify-center lg:justify-start lg:pl-10">
            {MANTRAS.map((mantra, index) => {
              const isActive = index === activeIndex;
              const isRemember = mantra === "Now, I remember";

              return (
                <motion.h2
                  key={mantra}
                  initial={false}
                  animate={{
                    opacity: isActive ? 1 : 0,
                    x: isActive ? 0 : 28,
                    filter: isActive ? "blur(0px)" : "blur(4px)",
                  }}
                  transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                  aria-hidden={!isActive}
                  className={`col-start-1 row-start-1 self-center font-display text-[clamp(3rem,8vw,8rem)] font-bold italic leading-[0.92] tracking-[-0.05em] text-black ${
                    isActive ? "z-10" : "pointer-events-none"
                  } ${
                    isRemember
                      ? "inline-grid justify-items-center text-center"
                      : "max-w-[8ch] text-center lg:text-left"
                  }`}
                >
                  {isRemember ? (
                    <>
                      <span className="px-[0.22em]">Now, I</span>
                      <span>remember</span>
                    </>
                  ) : (
                    mantra
                  )}
                </motion.h2>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   AGENT VOICE — coda after agents scroll
   ============================================================ */
export function AgentVoice() {
  return null;
}
