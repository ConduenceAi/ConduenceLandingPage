"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const EASE = [0.22, 1, 0.36, 1] as const;

const CONTRAST = [
  {
    title: "Shared skill compounds.",
    body: "A better coding model makes everyone ship faster. There is no counterparty absorbing the gain. Progress scales because the work is not a fight over a fixed pie.",
  },
  {
    title: "Shared skill cancels out.",
    body: "Every profitable trade has someone on the other side. Edge is relative. When the same intelligence is available to everyone, the advantage is not amplified. It is competed away.",
  },
] as const;

export function SharedEdge() {
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, { once: true, amount: 0.28 });

  return (
    <section
      ref={sectionRef}
      id="shared-edge"
      className="relative overflow-hidden bg-white px-[5%] py-section text-black"
      aria-label="Why a universal trading model cannot succeed"
    >
      <div className="mx-auto max-w-[1480px]">
        <div className="text-left xl:mx-auto xl:max-w-[58rem] xl:text-center">
          <motion.p
            className="text-kicker mb-[clamp(1rem,2vw,1.5rem)] font-mono uppercase tracking-[0.34em] text-black/45"
            initial={{ opacity: 0, y: 12 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
            transition={{ duration: 0.7, ease: EASE }}
          >
            The supermodel trap
          </motion.p>

          <motion.h2
            className="text-display-lede max-w-[min(36rem,100%)] font-normal leading-[1.12] tracking-[-0.03em] [font-family:var(--font-display),Georgia,serif] md:max-w-[48rem] xl:mx-auto xl:max-w-none"
            aria-label="A model that trades for everyone trades for no one."
            initial={{ opacity: 0, y: 18 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 }}
            transition={{ duration: 0.8, ease: EASE }}
          >
            A model that trades for everyone
            <span className="italic text-black/55"> trades for </span>
            no one.
          </motion.h2>

          <motion.p
            className="text-body-large mt-[clamp(1rem,2vw,1.5rem)] max-w-[min(42rem,100%)] leading-relaxed text-black/85 xl:mx-auto xl:max-w-[46rem]"
            initial={{ opacity: 0, y: 14 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 }}
            transition={{ duration: 0.75, delay: 0.1, ease: EASE }}
          >
            The roadmap that works for coding agents ends at the market. Trading is not a skill you
            can simply distribute. It is a contest over scarce opportunity. The market does not reward a public oracle. It prices it in, then erases it.
          </motion.p>
        </div>

        <div className="relative mt-[clamp(2.5rem,5vw,5rem)] border-y border-black/8">
          <div className="pointer-events-none absolute left-1/2 top-0 hidden h-full w-px -translate-x-1/2 bg-black/8 lg:block" />

          <div className="grid lg:grid-cols-2">
            {CONTRAST.map((block, index) => (
              <motion.article
                key={block.title}
                initial={{ opacity: 0, y: 22 }}
                animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 22 }}
                transition={{ duration: 0.7, delay: 0.12 + index * 0.1, ease: EASE }}
                className={`relative flex border-black/8 py-[clamp(2rem,4vw,3.5rem)] ${
                  index === 0 ? "lg:pr-[clamp(1.5rem,3vw,3rem)]" : "border-t lg:border-t-0 lg:pl-[clamp(1.5rem,3vw,3rem)]"
                }`}
              >
                <div className="pointer-events-none absolute left-0 top-0 h-[clamp(0.4rem,0.8vw,0.5rem)] w-[clamp(0.4rem,0.8vw,0.5rem)] -translate-x-1/2 -translate-y-1/2 bg-black/18" />
                <div className="pointer-events-none absolute right-0 bottom-0 h-[clamp(0.4rem,0.8vw,0.5rem)] w-[clamp(0.4rem,0.8vw,0.5rem)] translate-x-1/2 translate-y-1/2 bg-black/18" />

                <div className="relative mx-auto w-full max-w-lg text-left">
                  <h3 className="text-heading-block font-normal leading-tight tracking-[-0.035em] text-black [font-family:var(--font-display),Georgia,serif]">
                    {block.title}
                  </h3>
                  <p className="text-body-fluid mt-[clamp(0.85rem,1.5vw,1rem)] leading-relaxed text-black/85">
                    {block.body}
                  </p>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
