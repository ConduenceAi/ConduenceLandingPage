"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const EASE = [0.22, 1, 0.36, 1] as const;

const BLOCKS = [
  {
    title: "Say what stays off limits.",
    body: "Tell an agent what it must not do: markets to avoid, actions to freeze, lines it cannot cross. Speak the constraint once. It locks until you release it.",
    callout: (
      <>
        <span className="font-medium text-black">“Stop trading.”</span> - The agents stand down OR{" "}
        <span className="font-medium text-black">“Do not trade Bitcoin-related markets.”</span> - Those
        markets are locked out until you say otherwise.
      </>
    ),
  },
  {
    title: "Say what to check first.",
    body: "Tell an agent what must be true before it enters: liquidity, size, confirmation, or any check you care about. Speak it once. It applies on every run or for specific markets.",
    callout: (
      <>
        <span className="font-medium text-black">"Only enter liquid markets above $50k volume."</span>{" "} , 
        <span className="font-medium text-black">“Ask before risking over 7% of capital on one trade.”</span> Those rules stay in place
        until you change them.
      </>
    ),
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
      aria-label="How Conduence agents run on dedicated compute and follow spoken rules"
    >
      <div className="mx-auto grid max-w-[1480px] gap-[clamp(2.5rem,5vw,4.5rem)] lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.15fr)] lg:items-start lg:gap-[clamp(3rem,6vw,7rem)]">
        <div className="max-w-xl pt-[clamp(1rem,3vw,2rem)] lg:sticky lg:top-[clamp(5rem,12vw,7rem)] lg:pt-[clamp(2rem,5vw,4rem)]">
          <motion.h2
            className="text-display-lede max-w-[18ch] font-normal leading-[1.12] tracking-[-0.03em] [font-family:var(--font-display),Georgia,serif]"
            aria-label="Dedicated power. Rules you speak."
            initial={{ opacity: 0, y: 18 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 }}
            transition={{ duration: 0.8, ease: EASE }}
          >
            <span className="block">Dedicated power.</span>
            <span className="block">Rules you speak.</span>
          </motion.h2>
        </div>

        <div>
          {BLOCKS.map((block, index) => (
            <motion.article
              key={block.title}
              initial={{ opacity: 0, y: 18 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 }}
              transition={{ duration: 0.7, delay: 0.14 + index * 0.1, ease: EASE }}
              className="py-[clamp(1.25rem,2.5vw,2rem)]"
            >
              <h3 className="text-heading-block font-normal leading-tight tracking-[-0.035em] text-black [font-family:var(--font-display),Georgia,serif]">
                {block.title}
              </h3>
              <p className="text-body-fluid mt-[clamp(0.65rem,1.2vw,0.85rem)] max-w-xl leading-relaxed text-black/85">
                {block.body}
              </p>
              <div className="mt-[clamp(0.85rem,1.5vw,1.15rem)] w-4/5 border-l border-black/15 pl-[clamp(0.75rem,1.2vw,0.9rem)]">
                <p className="text-body-callout italic leading-snug text-black/80">
                  {block.callout}
                </p>
              </div>
              {index < BLOCKS.length - 1 ? (
                <div className="mt-[clamp(1.25rem,2.5vw,2rem)] h-px w-4/5 bg-black/8" aria-hidden="true" />
              ) : null}
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
