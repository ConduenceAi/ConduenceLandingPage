"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const EASE = [0.22, 1, 0.36, 1] as const;

const BLOCKS = [
  {
    title: "Map the Mind.",
    body: "Conduence helps traders encode how they believe real world events move markets. Agents follow that map, not a generic model’s guess.",
    callout:
      "Two agents. One question. Same answer, because both read from the belief map you authored, not from a model inventing its own.",
  },
  {
    title: "Edge in motion.",
    body: "Agents fuse your map with lightning fast news on world events, so every move is filtered through how you actually think markets respond.",
    callout:
      "A rate cut headline drops at 2:14am. Your agent doesn’t just summarize it. It checks mind mesh, weights the paths you care about, and acts on them.",
  },
  {
    title: "Voice that commands.",
    body: "Want full command? Keep it. Speak the rules and agents obey. Guardrails update in language, not dashboards.",
    callout:
      "“Stop trading.” The agents stand down. “Do not trade Bitcoin or Bitcoin related markets.” Those parameters lock out until you say otherwise.",
  },
  {
    title: "Night watcher.",
    body: "Want agents to run on their own? Set the authority and step away. Markets do not sleep. Agents make rational decisions, inside your rules, while you rest.",
    callout:
      "Same judgment. Different mode. Autonomously when you want leverage, under your command when you want the final say.",
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
      aria-label="The problem Conduence solves"
    >
      <div className="mx-auto max-w-[1480px]">
        <div className="text-left xl:mx-auto xl:max-w-[58rem] xl:text-center">
          <motion.h2
            className="text-display-lede max-w-[min(36rem,100%)] font-normal leading-[1.12] tracking-[-0.03em] [font-family:var(--font-display),Georgia,serif] md:max-w-[48rem] xl:mx-auto xl:max-w-none"
            aria-label="Every trading agent decides without your beliefs."
            initial={{ opacity: 0, y: 18 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 }}
            transition={{ duration: 0.8, ease: EASE }}
          >
            Every trading agent decides
            <span className="italic text-black/55"> without your </span>
            beliefs.
          </motion.h2>
          <motion.p
            className="text-body-large mt-[clamp(1rem,2vw,1.5rem)] max-w-[min(42rem,100%)] leading-relaxed text-black/85 xl:mx-auto xl:max-w-[46rem]"
            initial={{ opacity: 0, y: 14 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 }}
            transition={{ duration: 0.75, delay: 0.1, ease: EASE }}
          >
            Conduence turns your trading mind into the source of truth that agents read from. Keep
            full command of every trade, or let agents act autonomously with rational decisions
            inside your rules. Same mind. You choose the authority.
          </motion.p>
        </div>

        <div className="relative mt-[clamp(2.5rem,5vw,5rem)] border-y border-black/8">
          <div className="pointer-events-none absolute left-1/2 top-0 hidden h-full w-px -translate-x-1/2 bg-black/8 lg:block" />

          <div className="grid lg:grid-cols-2">
            {BLOCKS.map((block, index) => {
              const isLeft = index % 2 === 0;

              return (
                <motion.article
                  key={block.title}
                  initial={{ opacity: 0, y: 22 }}
                  animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 22 }}
                  transition={{ duration: 0.7, delay: 0.12 + index * 0.08, ease: EASE }}
                  className={`relative flex border-black/8 py-[clamp(2rem,4vw,3.5rem)] ${
                    index > 0 ? "border-t" : ""
                  } ${index === 1 ? "lg:border-t-0" : ""} ${
                    isLeft
                      ? "lg:pr-[clamp(1.5rem,3vw,3rem)]"
                      : "lg:pl-[clamp(1.5rem,3vw,3rem)]"
                  }`}
                >
                  <div className="pointer-events-none absolute left-0 top-0 h-[clamp(0.4rem,0.8vw,0.5rem)] w-[clamp(0.4rem,0.8vw,0.5rem)] -translate-x-1/2 -translate-y-1/2 bg-black/18" />
                  <div className="pointer-events-none absolute right-0 bottom-0 h-[clamp(0.4rem,0.8vw,0.5rem)] w-[clamp(0.4rem,0.8vw,0.5rem)] translate-x-1/2 translate-y-1/2 bg-black/18" />

                  <div className="relative mx-auto w-full max-w-lg text-left">
                    <h3 className="text-heading-block text-center font-medium leading-tight tracking-[-0.035em] text-black [font-family:var(--font-display),Georgia,serif]">
                      {block.title}
                    </h3>

                    <p className="text-body-fluid mt-[clamp(0.85rem,1.5vw,1rem)] leading-relaxed text-black/85">
                      {block.body}
                    </p>

                    <div className="mt-[clamp(1.25rem,2.5vw,1.75rem)] border-l border-black/15 pl-[clamp(0.85rem,1.5vw,1rem)]">
                      <p className="text-body-callout italic leading-relaxed text-black/80">
                        {block.callout}
                      </p>
                    </div>
                  </div>
                </motion.article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
