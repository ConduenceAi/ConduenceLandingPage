"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const EASE = [0.22, 1, 0.36, 1] as const;

const BLOCKS = [
  {
    title: "Async. Always on.",
    body: "Agents don’t wait for you to click Run. Triggers wake them, context loads, and the loop keeps moving while you’re away — so edge doesn’t wait on your calendar.",
    callout:
      "A rate cut drops at 2:14am. The agent is already up — reading the event against your mesh before the market finishes digesting the headline.",
  },
  {
    title: "Infer under command.",
    body: "Want full command? Keep it. Speak the rules and agents obey. Guardrails update in language, not dashboards.",
    callout:
      "“Stop trading.” The agents stand down. “Do not trade Bitcoin or Bitcoin related markets.” Those parameters lock out until you say otherwise.",
  },
] as const;

export function TheProblem() {
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, { once: true, amount: 0.2 });

  return (
    <section
      ref={sectionRef}
      id="the-problem"
      className="relative overflow-hidden bg-white px-[5%] py-section text-black"
      aria-label="How Conduence agents run asynchronously under your command"
    >
      <div className="mx-auto grid max-w-[1480px] gap-[clamp(2.5rem,5vw,4.5rem)] lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.15fr)] lg:items-start lg:gap-[clamp(3rem,6vw,7rem)]">
        <div className="max-w-xl lg:sticky lg:top-[clamp(5rem,12vw,7rem)]">
          <motion.h2
            className="text-display-lede max-w-[18ch] font-normal leading-[1.12] tracking-[-0.03em] [font-family:var(--font-display),Georgia,serif]"
            aria-label="Agents that stay awake. Rules you speak."
            initial={{ opacity: 0, y: 18 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 }}
            transition={{ duration: 0.8, ease: EASE }}
          >
            Agents that stay awake. Rules you speak.
          </motion.h2>

          <motion.p
            className="text-body-large mt-[clamp(1rem,2vw,1.5rem)] max-w-[34rem] leading-relaxed text-black/85"
            initial={{ opacity: 0, y: 14 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 }}
            transition={{ duration: 0.75, delay: 0.1, ease: EASE }}
          >
            Conduence agents run asynchronously — they wake on events, infer from your mind mesh
            and live context, then act inside the bounds you set. Full command stays yours.
          </motion.p>
        </div>

        <div>
          {BLOCKS.map((block, index) => (
            <motion.article
              key={block.title}
              initial={{ opacity: 0, y: 18 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 }}
              transition={{ duration: 0.7, delay: 0.14 + index * 0.1, ease: EASE }}
              className="py-[clamp(1.75rem,3.5vw,2.75rem)] not-last:border-b not-last:border-black/10"
            >
              <h3 className="text-heading-block font-normal leading-tight tracking-[-0.035em] text-black [font-family:var(--font-display),Georgia,serif]">
                {block.title}
              </h3>
              <p className="text-body-fluid mt-[clamp(0.65rem,1.2vw,0.85rem)] max-w-xl leading-relaxed text-black/85">
                {block.body}
              </p>
              <p className="text-body-callout mt-[clamp(1rem,2vw,1.35rem)] max-w-xl border-l border-black/15 pl-[clamp(0.85rem,1.5vw,1rem)] italic leading-relaxed text-black/70">
                {block.callout}
              </p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
