"use client";

import { AnimatePresence, motion, useInView, useReducedMotion } from "framer-motion";
import { useCallback, useRef, useState } from "react";

import { cn } from "@/lib/utils";

const EASE = [0.22, 1, 0.36, 1] as const;

const FAQ_ITEMS = [
  {
    question: "What is Conduence?",
    answer:
      "Conduence is a voice-first platform for building, training, and orchestrating AI trading agents. It helps you move from market understanding to action without stitching together disconnected tools.",
  },
  {
    question: "Why not just use a chatbot or copy-trading tool?",
    answer:
      "Chatbots can answer questions, but they do not hold your market framework, manage workflows, or stay accountable to a decision process. Copy trading is even further removed. Conduence is built to preserve your reasoning and turn it into repeatable execution.",
  },
  {
    question: "Who is Conduence designed for?",
    answer:
      "It is designed for traders, researchers, and operators who already have judgment but need leverage. If you think in frameworks, track signals across platforms, and want agents that work like extensions of your own mind, Conduence is for you.",
  },
  {
    question: "What makes Conduence different?",
    answer:
      "Instead of giving you a single assistant, Conduence lets you orchestrate systems of agents. You can train them on your reasoning, connect them to tools, monitor their decision path, and stay in control of execution.",
  },
  {
    question: "Do I need to know how to code?",
    answer:
      "No. Conduence is being designed so you can build workflows, train agents, and coordinate execution through voice and visual interfaces rather than writing code from scratch.",
  },
  {
    question: "Can I stay in control of trades?",
    answer:
      "Yes. Conduence is built around human control, not black-box automation. You can review outputs, adjust rules, intervene when needed, and decide how much authority each workflow should have.",
  },
] as const;

function FaqRow({
  question,
  answer,
  isOpen,
  onToggle,
  index,
  reducedMotion,
}: {
  question: string;
  answer: string;
  isOpen: boolean;
  onToggle: () => void;
  index: number;
  reducedMotion: boolean;
}) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: reducedMotion ? 0 : 20 },
        show: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.55, ease: EASE },
        },
      }}
      className="group"
    >
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        className={cn(
          "relative flex w-full items-start justify-between gap-6 py-6 text-left transition-[background-color,box-shadow,border-color] duration-300 ease-out sm:py-7",
          "border-b border-white/[0.08]",
          "hover:border-white/[0.14] hover:bg-white/[0.025]",
          "hover:shadow-[0_0_30px_rgba(255,255,255,0.05)]",
          isOpen && "border-white/[0.16] bg-white/[0.025]",
        )}
      >
        <span className="pr-4 text-[0.98rem] font-medium leading-snug tracking-[-0.02em] text-white/92 sm:text-[1.05rem]">
          {question}
        </span>
        <motion.span
          aria-hidden
          className="mt-0.5 shrink-0 text-lg font-light leading-none text-white/45"
          animate={{ rotate: isOpen ? 45 : 0 }}
          transition={{ duration: 0.35, ease: EASE }}
        >
          +
        </motion.span>
      </button>

      <AnimatePresence initial={false}>
        {isOpen ? (
          <motion.div
            key={`answer-${index}`}
            initial={reducedMotion ? false : { height: 0, opacity: 0, filter: "blur(4px)" }}
            animate={{
              height: "auto",
              opacity: 1,
              filter: "blur(0px)",
            }}
            exit={reducedMotion ? { opacity: 0 } : { height: 0, opacity: 0, filter: "blur(4px)" }}
            transition={{ duration: 0.42, ease: EASE }}
            className="overflow-hidden"
          >
            <div className="pb-7 pr-10 sm:pb-8">
              <p className="max-w-xl text-[0.92rem] leading-[1.75] text-white/48 sm:text-[0.98rem]">
                {answer}
              </p>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </motion.div>
  );
}

export function FAQ() {
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, { once: true, amount: 0.18 });
  const reducedMotion = useReducedMotion();
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const handleToggle = useCallback((index: number) => {
    setOpenIndex((current) => (current === index ? null : index));
  }, []);

  return (
    <section
      ref={sectionRef}
      id="faq"
      className="relative min-h-screen overflow-hidden bg-[#050505] text-white"
    >
      {/* Subtle grid */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.025]"
        aria-hidden="true"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)
          `,
          backgroundSize: "64px 64px",
        }}
      />

      <div className="relative mx-auto max-w-[1480px] px-section py-[clamp(5rem,12vw,9rem)]">
        <div className="mx-auto grid max-w-[1320px] gap-14 lg:grid-cols-[minmax(0,0.88fr)_minmax(0,1.12fr)] lg:gap-[5.25rem] xl:gap-[6rem]">
          {/* Left — editorial column */}
          <div className="relative flex min-h-[22rem] flex-col lg:min-h-[28rem]">
            <motion.div
              initial={reducedMotion ? false : { opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, ease: EASE }}
            >
              <p className="font-mono text-[0.68rem] font-medium tracking-[0.32em] text-white/35">
                FAQ
              </p>
            </motion.div>

            <motion.h2
              className="mt-8 max-w-md text-[clamp(2.35rem,4.8vw,4.25rem)] leading-[0.98] tracking-[-0.04em]"
              initial={reducedMotion ? false : { opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.75, delay: 0.08, ease: EASE }}
            >
              <span className="block font-display font-black text-white">Frequently</span>
              <span className="mt-1 block font-sans text-[0.92em] font-light text-white/88">
                asked
              </span>
              <span className="mt-1 block font-sans text-[0.92em] font-light italic text-white/72">
                questions
              </span>
            </motion.h2>

            <motion.p
              className="mt-8 max-w-sm text-body-fluid leading-[1.8] text-white/42"
              initial={reducedMotion ? false : { opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.16, ease: EASE }}
            >
              Everything you need to know about why Conduence exists, who it is for, and how it
              helps you trade with more leverage.
            </motion.p>
          </div>

          {/* Right — accordion */}
          <motion.div
            className="lg:pt-2"
            initial="hidden"
            animate={inView ? "show" : "hidden"}
            variants={{
              hidden: {},
              show: {
                transition: {
                  staggerChildren: reducedMotion ? 0 : 0.1,
                  delayChildren: reducedMotion ? 0 : 0.22,
                },
              },
            }}
          >
            {FAQ_ITEMS.map((item, index) => (
              <FaqRow
                key={item.question}
                question={item.question}
                answer={item.answer}
                isOpen={openIndex === index}
                onToggle={() => handleToggle(index)}
                index={index}
                reducedMotion={!!reducedMotion}
              />
            ))}
          </motion.div>
        </div>

        <motion.div
          className="mt-[clamp(3.5rem,8vw,6rem)] text-center"
          initial={reducedMotion ? false : { opacity: 0, y: 12 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.65, delay: 0.45, ease: EASE }}
        >
          <a
            href="mailto:contact@conduence.xyz"
            className="group inline-flex flex-col items-center gap-1.5 sm:flex-row sm:gap-2"
          >
            <span className="font-mono text-[0.82rem] font-light tracking-[0.28em] text-white/45 transition-colors duration-300 group-hover:text-white/58 sm:text-[0.875rem]">
              STILL CURIOUS?
            </span>
            <span className="font-mono text-[0.875rem] font-light tracking-[0.22em] text-white/58 transition-colors duration-300 group-hover:text-white/78 sm:text-[0.95rem]">
              LET&apos;S TALK ↗
            </span>
          </a>
        </motion.div>
      </div>
    </section>
  );
}
