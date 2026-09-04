"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const EASE = [0.22, 1, 0.36, 1] as const;

const METRICS = [
  {
    value: "72.5%",
    label: "less token usage for sustained operation",
  },
  {
    value: "1250 ms",
    label: "to wake an agent after a dedicated event trigger",
  },
  {
    value: "1.3%",
    label: "divergence for immediate contextual awareness",
  },
] as const;

export function UnfairAdvantage() {
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, { once: true, amount: 0.25 });

  return (
    <section
      ref={sectionRef}
      aria-label="Your unfair advantage"
      className="relative overflow-hidden bg-white px-[5%] py-[clamp(4rem,9vw,8rem)] text-black"
    >
      <div className="pointer-events-none absolute inset-0 opacity-60 [background-image:linear-gradient(rgba(0,0,0,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.05)_1px,transparent_1px)] [background-size:clamp(3.75rem,7vw,7rem)_clamp(3.75rem,7vw,7rem)]" />
      <div className="relative mx-auto grid max-w-[1480px] gap-[clamp(2.5rem,6vw,6rem)] lg:-translate-x-[clamp(1rem,5vw,5rem)] lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-center">
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 22 }}
          transition={{ duration: 0.8, ease: EASE }}
          className="text-center"
        >
          <h2 className="text-display-lede mx-auto max-w-[11ch] font-normal leading-[1.04] tracking-[-0.04em] [font-family:var(--font-display),Georgia,serif]">
            Your Unfair Advantage.
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 22 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 22 }}
          transition={{ duration: 0.8, delay: 0.08, ease: EASE }}
        >
          <div className="grid gap-px overflow-hidden border border-black/10 bg-black/10 sm:grid-cols-3">
            {METRICS.map((metric, index) => (
              <motion.article
                key={metric.value}
                initial={{ opacity: 0, y: 16 }}
                animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
                transition={{ duration: 0.65, delay: 0.18 + index * 0.1, ease: EASE }}
                className="bg-white px-[clamp(1rem,2vw,1.5rem)] py-[clamp(1.25rem,2.5vw,1.8rem)] text-center"
              >
                <p className="font-display text-[clamp(2rem,4vw,3.5rem)] font-normal leading-none tracking-[-0.05em] text-black">
                  {metric.value}
                </p>
                <p className="mx-auto mt-3 max-w-[18ch] text-[clamp(0.75rem,0.25vw+0.7rem,0.875rem)] leading-relaxed text-black/55 [font-family:var(--font-ui),system-ui,sans-serif]">
                  {metric.label}
                </p>
              </motion.article>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
