"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const EASE = [0.22, 1, 0.36, 1] as const;

const METRICS = [
  {
    value: "850 ms",
    label: "from market event to agent awake",
    note: "before the move is priced in",
  },
  {
    value: "1.3%",
    label: "divergence",
    note: "it decides like you, not like a proxy",
  },
  {
    value: "70.5%",
    label: "lower cost to run",
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
      <div className="relative mx-auto flex max-w-[1100px] flex-col items-center gap-[clamp(2.25rem,5vw,3.5rem)]">
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
          className="w-full"
        >
          <div className="grid grid-cols-1 gap-px overflow-hidden border border-black/10 bg-black/10 lg:grid-cols-3">
            {METRICS.map((metric, index) => (
              <motion.article
                key={metric.value}
                initial={{ opacity: 0, y: 16 }}
                animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
                transition={{ duration: 0.65, delay: 0.18 + index * 0.1, ease: EASE }}
                className="flex h-full flex-col items-center bg-white px-[clamp(1rem,2vw,1.75rem)] py-[clamp(1.5rem,3vw,2.25rem)] text-center"
              >
                <p className="font-display text-[clamp(2.15rem,3.4vw,3.15rem)] font-normal leading-none tracking-[-0.05em] text-black">
                  {metric.value}
                </p>
                <p className="mt-4 flex min-h-[2.75em] items-center text-[clamp(0.8rem,0.2vw+0.74rem,0.92rem)] leading-snug text-black/55 [font-family:var(--font-ui),system-ui,sans-serif]">
                  <span>
                    <span className="block">{metric.label}</span>
                    {"note" in metric ? <span className="block">{metric.note}</span> : null}
                  </span>
                </p>
              </motion.article>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
