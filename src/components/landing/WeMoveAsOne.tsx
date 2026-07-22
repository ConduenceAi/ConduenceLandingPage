"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

/* ============================================================
   WE MOVE AS ONE — statement + compounding timeline
   ============================================================ */
const EASE = [0.22, 1, 0.36, 1] as const;

const COMPOUNDING_STEPS = [
  {
    label: "Day One",
    body: "I am a blank slate, ready to learn how you think.",
  },
  {
    label: "First Month",
    body: "After enough sessions, I already mirror how you size and decide.",
  },
  {
    label: "One Day",
    body: "I am a version of you. Same mind, same instincts.",
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
        <div className="mx-auto max-w-full text-center">
          <motion.h2
            className="text-display-lede font-normal leading-[1.12] tracking-[-0.03em] [font-family:var(--font-display),Georgia,serif]"
            aria-label="I am your reasoning and your perception, scaled past every limit."
            initial={{ opacity: 0, y: 18 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 }}
            transition={{ duration: 0.85, ease: EASE }}
          >
            <span className="block">
              <span className="text-black/35" aria-hidden="true">
                “
              </span>
              I am your <span className="italic text-black/55">reasoning</span> and your{" "}
            </span>
            <span className="block">
              <span className="italic text-black/55">perception</span>, scaled past every limit.
              <span className="text-black/35" aria-hidden="true">
                ”
              </span>
            </span>
          </motion.h2>
          <motion.p
            className="mt-[clamp(0.85rem,1.6vw,1.15rem)] text-[clamp(0.8rem,1.1vw,0.95rem)] tracking-[0.08em] text-black/45 [font-family:var(--font-display),Georgia,serif]"
            initial={{ opacity: 0, y: 10 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
            transition={{ duration: 0.7, delay: 0.08, ease: EASE }}
          >
            - Conduence
          </motion.p>
        </div>

        <div className="mx-auto grid w-full max-w-[80rem] gap-[clamp(0.75rem,1.5vw,1.1rem)] sm:grid-cols-3">
          {COMPOUNDING_STEPS.map((step, index) => (
            <motion.article
              key={step.label}
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
              transition={{ duration: 0.7, delay: 0.2 + index * 0.1, ease: EASE }}
              className="rounded-xl border border-black/8 bg-white px-[clamp(0.95rem,1.8vw,1.35rem)] py-[clamp(1.1rem,2.2vw,1.65rem)] text-center"
            >
              <h3 className="font-display text-[clamp(1.35rem,2.6vw,2rem)] font-normal leading-none tracking-[-0.04em] text-black">
                {step.label}
              </h3>
              <p className="text-body-fluid mx-auto mt-[clamp(0.55rem,1.2vw,0.85rem)] max-w-[22ch] leading-relaxed text-black/85">
                {step.body}
              </p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
