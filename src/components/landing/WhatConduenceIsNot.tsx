"use client";

import { AnimatePresence, motion, useInView, useReducedMotion } from "framer-motion";
import { useCallback, useRef, useState } from "react";

import { cn } from "@/lib/utils";

const EASE = [0.22, 1, 0.36, 1] as const;

const ITEMS = [
  {
    label: "Not another workflow.",
    body: "Conduence is not a rigid sequence of manually connected steps. It adapts to your changing perspectives and strategies, coordinating the right action at the right time.",
  },
  {
    label: "Not another rules automation.",
    body: "Conduence is not a collection of fixed triggers that execute the same action whenever a condition is met. It gives agents the context, memory, and tools to evaluate your trading rules together, and act within the limits you set.",
  },
  {
    label: "Not another orchestration of agents.",
    body: "Conduence does more than coordinate agents. It gives them shared context, memory, rules, and access to the right tools so they can work together toward one outcome.",
  },
  {
    label: "Not another disconnected system.",
    body: "The best tools and data sources are often disconnected, leaving agents to work across fragmented systems. Conduence brings them together in one connected layer, so your agents can draw on their combined capabilities.",
  },
] as const;

function ClarifierRow({
  label,
  body,
  index,
  isOpen,
  onToggle,
  reducedMotion,
}: {
  label: string;
  body: string;
  index: number;
  isOpen: boolean;
  onToggle: () => void;
  reducedMotion: boolean;
}) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: reducedMotion ? 0 : 16 },
        show: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.55, ease: EASE },
        },
      }}
      className="not-last:border-b not-last:border-black/10"
    >
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        className="flex w-full items-baseline justify-between gap-x-[clamp(0.85rem,2vw,1.5rem)] py-[clamp(1.15rem,2.4vw,1.65rem)] text-left"
      >
        <h3
          className={cn(
            "text-[clamp(1.15rem,2.2vw,1.65rem)] leading-tight tracking-[-0.03em] transition-colors [font-family:var(--font-display),Georgia,serif]",
            isOpen ? "text-black" : "text-black/70",
          )}
        >
          {label}
        </h3>
        <motion.span
          aria-hidden
          className="shrink-0 font-mono text-[clamp(1rem,1.5vw,1.25rem)] font-light leading-none text-black/35"
          animate={{ rotate: isOpen ? 45 : 0 }}
          transition={{ duration: 0.35, ease: EASE }}
        >
          +
        </motion.span>
      </button>

      <AnimatePresence initial={false}>
        {isOpen ? (
          <motion.div
            key={`body-${index}`}
            initial={reducedMotion ? false : { height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={reducedMotion ? { opacity: 0 } : { height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: EASE }}
            className="overflow-hidden"
          >
            <p className="text-body-fluid max-w-2xl pb-[clamp(1.15rem,2.4vw,1.65rem)] leading-relaxed text-black/85">
              {body}
            </p>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </motion.div>
  );
}

export function WhatConduenceIsNot() {
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, { once: true, amount: 0.2 });
  const reducedMotion = useReducedMotion();
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const handleToggle = useCallback((index: number) => {
    setOpenIndex((current) => (current === index ? null : index));
  }, []);

  return (
    <section
      ref={sectionRef}
      id="what-conduence-is-not"
      className="relative flex h-svh min-h-svh items-center overflow-hidden bg-white px-[5%] py-[clamp(2rem,6vh,4rem)] text-black"
      aria-label="What Conduence is not"
    >
      <div className="mx-auto grid w-full max-w-[1480px] gap-[clamp(2rem,4vw,3rem)] lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:items-center lg:gap-[clamp(2rem,4vw,4rem)]">
        <div className="max-w-md">
          <motion.h2
            className="text-display-lede max-w-[14ch] font-normal leading-[1.12] tracking-[-0.03em] [font-family:var(--font-display),Georgia,serif]"
            aria-label="What Conduence is not."
            initial={reducedMotion ? false : { opacity: 0, y: 18 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease: EASE }}
          >
            What Conduence is{" "}
            <span className="italic text-black/55">not</span>.
          </motion.h2>

          <motion.p
            className="text-body-large mt-[clamp(1rem,2vw,1.5rem)] max-w-[30rem] leading-relaxed text-black/85"
            initial={reducedMotion ? false : { opacity: 0, y: 14 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.75, delay: 0.08, ease: EASE }}
          >
            Before you map it to something familiar: Conduence is none of these.
          </motion.p>
        </div>

        <motion.div
          className="min-w-0"
          initial="hidden"
          animate={inView ? "show" : "hidden"}
          variants={{
            hidden: {},
            show: {
              transition: {
                staggerChildren: reducedMotion ? 0 : 0.08,
                delayChildren: reducedMotion ? 0 : 0.12,
              },
            },
          }}
        >
          {ITEMS.map((item, index) => (
            <ClarifierRow
              key={item.label}
              label={item.label}
              body={item.body}
              index={index}
              isOpen={openIndex === index}
              onToggle={() => handleToggle(index)}
              reducedMotion={!!reducedMotion}
            />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
