"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

/* ============================================================
   WE MOVE AS ONE — statement + compounding timeline
   ============================================================ */
const EASE = [0.22, 1, 0.36, 1] as const;

const COMPOUNDING_STEPS = [
  {
    label: "Day 1",
    body: "Conduence is a blank slate, ready to learn how you think.",
  },
  {
    label: "Month 1",
    body: "After enough sessions, it already mirrors how you size and decide.",
  },
  {
    label: "Year 1",
    body: "It knows your trading mind better than you do.",
  },
] as const;

export function WeMoveAsOne() {
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, { once: true, amount: 0.35 });

  return (
    <section
      ref={sectionRef}
      id="we-move-as-one"
      className="relative flex h-svh min-h-svh overflow-hidden bg-white px-[5%] text-black"
      aria-label="Reasoning that compounds over time"
    >
      <div className="mx-auto flex h-full w-full max-w-[1480px] flex-col justify-center gap-8 py-[clamp(5rem,11vh,7.5rem)] sm:gap-10">
        <motion.h2
          className="mx-auto max-w-[20ch] text-center text-[clamp(1.75rem,4vw+0.35rem,3.5rem)] font-medium leading-[1.15] tracking-[-0.03em] text-balance [font-family:var(--font-display),Georgia,serif] sm:max-w-[24ch]"
          aria-label="I am your reasoning and your perception, scaled past every limit."
          initial={{ opacity: 0, y: 18 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 }}
          transition={{ duration: 0.85, ease: EASE }}
        >
          I am your{" "}
          <span className="font-black tracking-[-0.038em]">reasoning</span>
          <span className="font-normal italic text-black/55"> and your </span>
          <span className="font-black tracking-[-0.038em]">perception,</span>
          <span className="font-normal italic text-black/42"> scaled past every limit.</span>
        </motion.h2>

        <div className="grid gap-4 sm:grid-cols-3 sm:gap-5 lg:gap-6">
          {COMPOUNDING_STEPS.map((step, index) => (
            <motion.article
              key={step.label}
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
              transition={{ duration: 0.7, delay: 0.2 + index * 0.1, ease: EASE }}
              className="rounded-xl border border-black/8 bg-white px-6 py-8 text-center sm:px-7 sm:py-10 lg:px-8 lg:py-11"
            >
              <h3 className="font-display text-[clamp(1.85rem,3.5vw,2.5rem)] leading-none tracking-[-0.04em] text-black">
                {step.label}
              </h3>
              <p className="mx-auto mt-4 max-w-[22ch] text-[0.95rem] leading-relaxed text-black/55 sm:mt-5 sm:text-[1.05rem]">
                {step.body}
              </p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
