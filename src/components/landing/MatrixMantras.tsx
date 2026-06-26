"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const MANTRAS = [
  "I\u2002recall",
  "I\u2002think",
  "I\u2002decide",
  "I\u2002execute",
  "I\u2002 remember",
];

function getWrappedOffset(index: number, activeIndex: number, total: number) {
  const half = Math.floor(total / 2);
  let offset = index - activeIndex;

  if (offset > half) offset -= total;
  if (offset < -half) offset += total;

  return offset;
}

function getHorizontalOffset(offset: number) {
  if (offset === 0) return "0vw";
  if (Math.abs(offset) === 1) return `${offset * 34}vw`;
  return `${Math.sign(offset) * 58}vw`;
}

export function MatrixMantras() {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % MANTRAS.length);
    }, 1800);

    return () => window.clearInterval(interval);
  }, []);

  return (
    <section className="relative min-h-[72vh] overflow-hidden bg-black px-section pt-6 pb-12 text-white sm:min-h-[76vh] sm:pt-0 sm:pb-8">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.55) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.55) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
          maskImage: "radial-gradient(ellipse at center, black 15%, transparent 70%)",
        }}
      />

      <div className="relative mx-auto flex min-h-[72vh] max-w-6xl flex-col justify-center sm:min-h-[76vh]">
        <div className="mt-8 flex flex-col items-center sm:mt-30">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, ease: "easeOut" }}
            className="flex flex-col items-center text-center text-display-medium font-display tracking-tight leading-[1.12]"
          >
            <span className="whitespace-nowrap">I am your reasoning and your perception,</span>
            <span className="font-normal italic text-white/55">scaled past every limit.</span>
            <span className="mt-3 sm:mt-4">We move as one.</span>
          </motion.h2>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mt-8 flex justify-center gap-2 sm:mt-10"
          >
            {["24", "7"].map((n) => (
              <div
                key={n}
                className="grid h-14 w-14 place-items-center rounded-full border border-white font-mono text-sm font-bold"
              >
                {n}
              </div>
            ))}
          </motion.div>
        </div>

        <div className="relative mx-auto mt-8 h-[18rem] w-full max-w-6xl sm:mt-10 sm:h-[22rem]">
          {MANTRAS.map((mantra, index) => (
            <motion.div
              key={mantra}
              initial={false}
              animate={{
                x: getHorizontalOffset(getWrappedOffset(index, activeIndex, MANTRAS.length)),
                scale: index === activeIndex ? 1 : 0.84,
                opacity: index === activeIndex ? 1 : 0.14,
                filter: index === activeIndex ? "blur(0px)" : "blur(2px)",
              }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="absolute left-1/2 top-1/2 w-max max-w-none -translate-x-1/2 -translate-y-1/2 px-4"
            >
              <div className="flex items-center justify-center text-center">
                <h2
                  className={`whitespace-nowrap font-display text-[clamp(2.5rem,7vw,7rem)] font-normal leading-[0.95] text-white ${
                    mantra === "Now, I remember" ? "tracking-[-0.035em]" : "tracking-[-0.05em]"
                  }`}
                >
                  {mantra}
                </h2>
              </div>
            </motion.div>
          ))}
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
