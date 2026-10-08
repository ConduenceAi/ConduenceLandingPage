"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const EASE = [0.22, 1, 0.36, 1] as const;

const METRICS = [
  {
    value: "850 ms",
    label: "to wake an agent after a dedicated event trigger",
  },
  {
    value: "1.3%",
    label: "divergence for immediate contextual awareness",
  },
  {
    value: "70.5%",
    label: "lower cost to run on a well formed memory",
  },
] as const;

export function UnfairAdvantage() {
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, { once: true, amount: 0.25 });

  return (
    <section
      ref={sectionRef}
      aria-label="Your unfair advantage"
      className="relative bg-white px-[5%] pt-[clamp(4rem,9vw,8rem)] pb-[clamp(3rem,6vw,8rem)] text-black"
    >
      <div className="pointer-events-none absolute inset-0 overflow-hidden opacity-60 [background-image:linear-gradient(rgba(0,0,0,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.05)_1px,transparent_1px)] [background-size:clamp(3.75rem,7vw,7rem)_clamp(3.75rem,7vw,7rem)]" />
      <div className="relative mx-auto w-full max-w-[1100px]">
        <div className="flex flex-col items-stretch gap-[clamp(1.75rem,4vw,2.5rem)] lg:flex-row lg:items-center lg:gap-[clamp(3.5rem,6vw,5.5rem)]">
          <motion.div
            initial={{ opacity: 0, y: 22 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 22 }}
            transition={{ duration: 0.8, ease: EASE }}
            className="lg:shrink-0"
          >
            <h2 className="text-display-lede max-w-[11ch] font-normal leading-[1.04] tracking-[-0.04em] [font-family:var(--font-display),Georgia,serif]">
              Your Unfair Advantage
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 22 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 22 }}
            transition={{ duration: 0.8, delay: 0.08, ease: EASE }}
            className="w-full lg:min-w-0 lg:flex-1"
          >
            <div className="mr-[5px] mb-[5px] flex w-full flex-col sm:flex-row sm:items-stretch border-[2.5px] border-[#140206] bg-white text-[#140206] shadow-[5px_5px_0_0_#140206]">
              {METRICS.map((metric, index) => (
                <motion.article
                  key={metric.value}
                  initial={{ opacity: 0, y: 16 }}
                  animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
                  transition={{ duration: 0.65, delay: 0.18 + index * 0.1, ease: EASE }}
                  className={[
                    "flex flex-1 flex-col items-center justify-center px-[clamp(0.7rem,1vw,1.15rem)] py-[clamp(1.5rem,3vw,2.25rem)] text-center",
                    index > 0 ? "border-t-[2.5px] border-[#140206] sm:border-t-0 sm:border-l-[2.5px]" : "",
                  ].join(" ")}
                >
                  <p className="font-display text-[clamp(2.15rem,3.4vw,3.15rem)] font-normal leading-none tracking-[-0.05em]">
                    {metric.value}
                  </p>
                  <p className="mt-4 w-full max-w-[14rem] text-balance text-[0.9rem] leading-snug text-black/55 [font-family:var(--font-ui),system-ui,sans-serif]">
                    {metric.label}
                  </p>
                </motion.article>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
