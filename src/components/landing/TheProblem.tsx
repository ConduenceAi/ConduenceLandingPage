"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const EASE = [0.22, 1, 0.36, 1] as const;

const BLOCKS = [
  {
    title: "Your beliefs become the source of truth",
    body: "Conduence helps traders encode how they believe real world events move markets. Agents treat that map as gospel, not a generic model’s guess.",
    callout:
      "Two agents. One question. Same answer, because both read from the belief map you authored, not from a model inventing its own.",
  },
  {
    title: "News hits. Your edge is already wired in.",
    body: "Agents fuse your map with lightning fast news on world events, so every move is filtered through how you actually think markets respond.",
    callout:
      "A rate cut headline drops at 2:14pm. Your agent doesn’t just summarize it. It checks your event graph, weights the paths you care about, and acts inside your caps.",
  },
] as const;

export function TheProblem() {
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, { once: true, amount: 0.25 });

  return (
    <section
      ref={sectionRef}
      id="the-problem"
      className="relative overflow-hidden bg-white px-[5%] py-20 text-black sm:py-24 md:py-28"
      aria-label="The problem Conduence solves"
    >
      <div className="mx-auto max-w-[1480px]">
        <div className="text-left xl:mx-auto xl:max-w-[58rem] xl:text-center">
          <motion.h2
            className="max-w-[36rem] text-[clamp(1.75rem,4vw+0.35rem,3.5rem)] font-medium leading-[1.12] tracking-[-0.03em] [font-family:var(--font-display),Georgia,serif] md:max-w-[48rem] xl:mx-auto xl:max-w-none"
            aria-label="Every trading agent decides without your beliefs. They execute the same way for everyone."
            initial={{ opacity: 0, y: 18 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 }}
            transition={{ duration: 0.8, ease: EASE }}
          >
            Every trading agent{" "}
            <span className="font-black tracking-[-0.038em]">decides</span>
            <span className="font-normal italic text-black/55"> without your </span>
            <span className="font-black tracking-[-0.038em]">beliefs.</span>
            <span className="font-normal italic text-black/42">
              {" "}
              They execute the same way for everyone.
            </span>
          </motion.h2>
          <motion.p
            className="mt-5 max-w-[36rem] text-[1.05rem] leading-relaxed text-black/45 sm:mt-6 sm:max-w-[42rem] sm:text-[1.25rem] sm:leading-[1.5] xl:mx-auto xl:max-w-[46rem]"
            initial={{ opacity: 0, y: 14 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 }}
            transition={{ duration: 0.75, delay: 0.1, ease: EASE }}
          >
            Conduence turns your trading mind into the source of truth agents read from, so edge
            comes from how you think, running at agent speed.
          </motion.p>
        </div>

        <div className="relative mt-14 border-y border-black/8 sm:mt-16 lg:mt-20">
          <div className="pointer-events-none absolute left-1/2 top-0 hidden h-full w-px -translate-x-1/2 bg-black/8 lg:block" />

          <div className="grid lg:grid-cols-2">
            {BLOCKS.map((block, index) => (
              <motion.article
                key={block.title}
                initial={{ opacity: 0, y: 22 }}
                animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 22 }}
                transition={{ duration: 0.7, delay: 0.12 + index * 0.1, ease: EASE }}
                className={`relative flex border-black/8 py-10 sm:py-12 lg:py-14 ${
                  index === 0
                    ? "lg:pr-12"
                    : "border-t lg:border-t-0 lg:pl-12"
                }`}
              >
                <div className="pointer-events-none absolute left-0 top-0 h-2 w-2 -translate-x-1/2 -translate-y-1/2 bg-black/18" />
                <div className="pointer-events-none absolute right-0 bottom-0 h-2 w-2 translate-x-1/2 translate-y-1/2 bg-black/18" />

                <div className="relative mx-auto w-full max-w-lg text-left">
                  <h3 className="text-[1.4rem] font-medium leading-tight tracking-[-0.035em] text-black sm:text-[1.7rem]">
                    {block.title}
                  </h3>

                  <p className="mt-4 text-[0.95rem] leading-relaxed text-black/58 sm:text-[1.02rem]">
                    {block.body}
                  </p>

                  <div className="mt-7 border-l border-black/15 pl-4">
                    <p className="text-[0.9rem] italic leading-relaxed text-black/45 sm:text-[0.95rem]">
                      {block.callout}
                    </p>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
