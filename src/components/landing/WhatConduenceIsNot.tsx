"use client";

import { AnimatePresence, motion, useInView, useReducedMotion } from "framer-motion";
import { useCallback, useRef, useState } from "react";

import { cn } from "@/lib/utils";

const EASE = [0.22, 1, 0.36, 1] as const;

const ITEMS = [
  {
    label: "Not another tool.",
    body: "An orchestration layer that learns you. Unlike other platforms, we don’t compete by building another standalone tool. We integrate the best models, protocols, and workflows into our orchestration layer, evolving alongside the ecosystem.",
  },
  {
    label: "Not another LLM.",
    body: "Every platform out there is already returning answers from the query you typed. That can be done by GPT. We are not another chatbot that stops at a successful response.",
  },
  {
    label: "Not another workflow.",
    body: "We are not a canvas where you manually place every piece together, only to get lost the moment new trade rules arrive and the graph no longer fits how you think.",
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
        className="grid w-full grid-cols-[auto_minmax(0,1fr)_auto] items-baseline gap-x-[clamp(0.85rem,2vw,1.5rem)] py-[clamp(1.15rem,2.4vw,1.65rem)] text-left"
      >
        <span
          className={cn(
            "font-mono text-[clamp(0.65rem,0.2vw+0.6rem,0.75rem)] tracking-[0.22em] transition-colors",
            isOpen ? "text-black/55" : "text-black/30",
          )}
        >
          {String(index + 1).padStart(2, "0")}
        </span>
        <span
          className={cn(
            "text-[clamp(1.15rem,2.2vw,1.65rem)] leading-tight tracking-[-0.03em] transition-colors [font-family:var(--font-display),Georgia,serif]",
            isOpen ? "text-black" : "text-black/70",
          )}
        >
          {label}
        </span>
        <motion.span
          aria-hidden
          className="justify-self-end font-mono text-[clamp(1rem,1.5vw,1.25rem)] font-light leading-none text-black/35"
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
            <p className="text-body-fluid max-w-xl pb-[clamp(1.15rem,2.4vw,1.65rem)] pl-[clamp(2.1rem,4vw,3.25rem)] leading-relaxed text-black/85">
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
      className="relative overflow-hidden bg-white px-[5%] pt-[clamp(2rem,5vw,3.5rem)] pb-[clamp(3.5rem,10vw,10rem)] text-black"
      aria-label="What Conduence is not"
    >
      <div className="mx-auto grid w-full max-w-[1480px] gap-[clamp(2.5rem,5vw,4.5rem)] lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.2fr)] lg:items-start lg:gap-[clamp(3rem,6vw,7rem)]">
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
            Before you map it to something familiar: Conduence is none of these. It is the
            judgment layer agents run on.
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
