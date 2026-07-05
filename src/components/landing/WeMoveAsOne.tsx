"use client";

import { motion, useInView, useMotionValueEvent, useScroll } from "framer-motion";
import { useRef, useState } from "react";

const STEPS = [
  {
    id: "01",
    lines: ["I recall"],
  },
  {
    id: "02",
    lines: ["I think"],
  },
  {
    id: "03",
    lines: ["I decide"],
  },
  {
    id: "04",
    lines: ["I execute"],
  },
  {
    id: "05",
    lines: ["Now, I remember"],
  },
] as const;

const SCROLL_STEPS = STEPS.length + 0.35;

/* ============================================================
   WE MOVE AS ONE — split scroll section with mantra transitions
   ============================================================ */
const EASE = [0.22, 1, 0.36, 1] as const;

export function WeMoveAsOne() {
  const containerRef = useRef<HTMLElement>(null);
  const leftHeadingRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const leftHeadingInView = useInView(leftHeadingRef, { once: true, amount: 0.45 });

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  useMotionValueEvent(scrollYProgress, "change", (progress) => {
    const nextIndex = Math.min(STEPS.length - 1, Math.floor(progress * STEPS.length));
    setActiveIndex((current) => (current === nextIndex ? current : nextIndex));
  });

  return (
    <section
      ref={containerRef}
      id="we-move-as-one"
      className="relative"
      style={{ height: `${SCROLL_STEPS * 100}vh` }}
      aria-label="Reasoning sequence"
    >
      <div className="sticky top-0 h-screen overflow-hidden">
        {/* ── Horizontal connector across the split ── */}
        <div
          className="pointer-events-none absolute inset-0 z-30 hidden lg:block"
          aria-hidden="true"
        >
          {/* Left arm — dark line on white bg */}
          <div className="absolute left-[calc(50%-3.5rem)] top-1/2 h-px w-14 -translate-y-1/2 bg-black/40" />
          {/* Left dot — glowing on white bg */}
          <span className="absolute left-[calc(50%-3.5rem)] top-1/2 h-[9px] w-[9px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-black shadow-[0_0_0_3px_rgba(0,0,0,0.08),0_0_18px_rgba(0,0,0,0.35)]" />
          {/* Right arm — white line on dark bg */}
          <div className="absolute left-1/2 top-1/2 h-px w-14 -translate-y-1/2 bg-white/45" />
          {/* Right dot */}
          <span className="absolute left-[calc(50%+3.5rem)] top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white shadow-[0_0_16px_rgba(255,255,255,0.95)]" />
        </div>

        <div className="grid h-full min-h-screen grid-cols-1 lg:grid-cols-2">
          {/* ───── LEFT — static white panel ───── */}
          <div className="relative flex h-full min-h-[46vh] flex-col overflow-hidden bg-white px-section text-black lg:min-h-0">
            {/* Heading — top half, above connector */}
            <div
              ref={leftHeadingRef}
              className="flex h-1/2 min-h-0 flex-col justify-start pb-4 pt-28 sm:pt-32 lg:pt-36"
            >
              <h2
                className="max-w-[19.5rem] text-[clamp(2rem,3.4vw+0.55rem,3.65rem)] leading-[0.97] tracking-[-0.03em] [font-family:var(--font-display),Georgia,serif]"
                aria-label="I am your reasoning and your perception, scaled past every limit."
              >
                <motion.span
                  className="block"
                  initial={{ opacity: 0, y: 20 }}
                  animate={leftHeadingInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                  transition={{ duration: 0.85, ease: EASE }}
                >
                  <span className="block font-medium text-black">I am your</span>

                  <span className="block text-[1.5em] font-black leading-[0.95] tracking-[-0.038em] text-black">
                    reasoning
                  </span>

                  <span className="block font-normal text-black/82">— and your</span>

                  <span className="block text-[1.5em] font-black leading-[0.95] tracking-[-0.038em] text-black">
                    perception,
                  </span>
                </motion.span>

                <motion.span
                  className="my-3 block h-px w-10 origin-left bg-black/14 sm:my-3.5"
                  aria-hidden="true"
                  initial={{ opacity: 0, scaleX: 0 }}
                  animate={
                    leftHeadingInView ? { opacity: 1, scaleX: 1 } : { opacity: 0, scaleX: 0 }
                  }
                  transition={{ duration: 0.55, delay: 0.35, ease: EASE }}
                />

                <motion.span
                  className="block origin-left whitespace-nowrap text-[0.84em] font-normal italic leading-[0.99] text-black/42"
                  initial={{ opacity: 0, scale: 0.82 }}
                  animate={
                    leftHeadingInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.82 }
                  }
                  transition={{ duration: 0.9, delay: 0.5, ease: EASE }}
                >
                  scaled past every limit.
                </motion.span>
              </h2>
            </div>

            {/* Footer — bottom half, below connector */}
            <div className="flex h-1/2 min-h-0 flex-col justify-end pb-8 pt-5 sm:pb-10 sm:pt-6 lg:pb-12">
              <div className="max-w-[17rem] space-y-1 font-mono text-[9.5px] leading-[1.7] tracking-[0.36em] text-black/42 sm:text-[10px] sm:leading-[1.75]">
                <p>EVERY CONVERSATION.</p>
                <p>EVERY MARKET.</p>
                <p>EVERY DECISION.</p>
                <p className="text-black/58">NEVER FORGOTTEN.</p>
              </div>
            </div>
          </div>

          {/* ───── RIGHT — scroll-driven black panel ───── */}
          <div className="relative flex h-full min-h-[54vh] flex-col bg-black text-white lg:min-h-0">
            {/* Top half — empty, keeps content below the connector line */}
            <div className="h-1/2 shrink-0" aria-hidden="true" />

            {/* Bottom half — main text only */}
            <div className="flex h-1/2 flex-col justify-start px-section pb-12 pl-[clamp(3.5rem,10vw,6.5rem)] pt-10 lg:pb-14 lg:pt-12">
              <div className="relative grid items-start">
                {STEPS.map((step, index) => {
                  const isActive = index === activeIndex;

                  return (
                    <motion.div
                      key={step.id}
                      initial={false}
                      animate={{
                        opacity: isActive ? 1 : 0,
                        y: isActive ? 0 : 22,
                        filter: isActive ? "blur(0px)" : "blur(5px)",
                      }}
                      transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
                      aria-hidden={!isActive}
                      className={`col-start-1 row-start-1 ${
                        isActive ? "z-10" : "pointer-events-none"
                      }`}
                    >
                      <h3 className="font-display text-[clamp(2.25rem,5.5vw,5.25rem)] leading-[0.94] tracking-[-0.04em] text-white">
                        {step.lines.map((line) => (
                          <span key={line} className="block">
                            {line}
                          </span>
                        ))}
                      </h3>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* ── Step indicator — anchored to right edge of the right panel ── */}
            <div
              className="pointer-events-none absolute right-[clamp(1rem,4vw,2.5rem)] top-1/2 z-50 hidden -translate-y-1/2 lg:block"
              aria-label="Reasoning sequence progress"
            >
              <div className="flex flex-col items-end gap-[1.1rem]">
                {STEPS.map((step, index) => {
                  const isActive = index === activeIndex;

                  return (
                    <div key={step.id} className="flex items-center gap-3">
                      {/* Number — right-aligned */}
                      <span
                        className={`w-6 text-right font-mono text-[10px] tabular-nums tracking-[0.28em] transition-colors ${
                          isActive ? "text-white" : "text-white/30"
                        }`}
                      >
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      {/* Dot — rightmost element */}
                      <span className="relative flex h-[10px] w-[10px] shrink-0 items-center justify-center">
                        {isActive && (
                          <span className="absolute h-[10px] w-[10px] rounded-full border border-white/35" />
                        )}
                        <span
                          className={`rounded-full transition-all duration-300 ${
                            isActive
                              ? "h-[5px] w-[5px] bg-white shadow-[0_0_10px_rgba(255,255,255,0.9)]"
                              : "h-[5px] w-[5px] bg-white/22"
                          }`}
                        />
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
