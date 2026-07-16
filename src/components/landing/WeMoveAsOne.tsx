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
    body: "It is a version of you. Same mind, same instincts.",
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
      <div className="mx-auto flex h-full w-full max-w-[1480px] flex-col justify-center gap-[clamp(1.5rem,4vw,2.5rem)] py-[clamp(4rem,11vh,7.5rem)]">
        <motion.h2
          className="text-display-lede mx-auto max-w-full text-center font-normal leading-[1.12] tracking-[-0.03em] [font-family:var(--font-display),Georgia,serif]"
          aria-label="I am your reasoning and your perception, scaled past every limit."
          initial={{ opacity: 0, y: 18 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 }}
          transition={{ duration: 0.85, ease: EASE }}
        >
          <span className="block">
            I am your reasoning
            <span className="italic text-black/55"> and your </span>
          </span>
          <span className="block">perception, scaled past every limit.</span>
        </motion.h2>

        <div className="grid gap-[clamp(0.85rem,2vw,1.5rem)] sm:grid-cols-3">
          {COMPOUNDING_STEPS.map((step, index) => (
            <motion.article
              key={step.label}
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
              transition={{ duration: 0.7, delay: 0.2 + index * 0.1, ease: EASE }}
              className="rounded-xl border border-black/8 bg-white px-[clamp(1.15rem,2.5vw,2rem)] py-[clamp(1.5rem,3.5vw,2.75rem)] text-center"
            >
              <h3 className="font-display text-[clamp(1.5rem,3.2vw,2.5rem)] leading-none tracking-[-0.04em] text-black">
                {step.label}
              </h3>
              <p className="text-body-fluid mx-auto mt-[clamp(0.85rem,1.8vw,1.25rem)] max-w-[22ch] leading-relaxed text-black/85">
                {step.body}
              </p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
