"use client";

import { motion, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";

import {
  featCanvasSrc,
  featConnectorsSrc,
  featExploreSrc,
  featGraphSrc,
  featObservabilitySrc,
  featPaperSrc,
} from "@/lib/assets";

type Pillar = {
  title: string;
  body: string;
  image: string;
};

const pillars: Pillar[] = [
  {
    title: "Mind Mesh",
    body: "Teach the system how you think. In Shape, share beliefs by voice, text, or build the mesh manually. Talk with agents the way you normally would, and they learn how you think and where you stand. In Brainstorm, stress-test theses with agents that already know your perspective. Agents use your mesh as intuition, not a blank prompt each time.",
    image: featGraphSrc,
  },
  {
    title: "Retrace",
    body: "On each agent, open Trace for every run. See step latency, what was looked up, what came back, what failed or returned unusable output, and whether evidence supported or contradicted the thesis. Open vs skipped markets, entry thesis, and exit plan sit in one place, so you can debug the decision path instead of guessing.",
    image: featObservabilitySrc,
  },
  {
    title: "Agent Studio",
    body: "Create an orchestrator, then load it out with tools for markets, news, wallets, and X, triggers that wake it when conditions hit, and graphs in priority order. Drag to reorder so P1 is consulted first, including your Mind Mesh. Agents also run with time awareness, so belief validity from your mesh stays temporally coherent. No code. Compose the loadout and go.",
    image: featCanvasSrc,
  },
  {
    title: "Explore",
    body: "Browse every tool to see when to use it, what to set, what you get back, and how agents benefit, plus a Test playground. Monitor triggers you created, including which watcher is active, which events fired, and which runs they woke. Research Polymarket, Twitter/X, and recent news across markets, wallets, profiles, and detailed analysis before a thesis hardens.",
    image: featExploreSrc,
  },
  {
    title: "Connectors",
    body: "Want full control over every agent decision? Connect Telegram or Discord and verify each decision before it executes. Or wire in the tools you already use daily to monitor and control agents from where you already work. Your judgment stays in the loop when you want it.",
    image: featConnectorsSrc,
  },
  {
    title: "Simulator",
    body: "Deploy agents in Paper mode against live market data without risking capital. Validate edge, inspect open and skipped markets and P&L, tune tools, triggers, and graphs, then go live when the path looks right.",
    image: featPaperSrc,
  },
];

const DURATION = 7000;

export function Pillars() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { amount: 0.45 });
  const isInViewRef = useRef(false);
  const hasActivatedRef = useRef(false);

  const [active, setActive] = useState(0);
  const [progress, setProgress] = useState(0);
  const [carouselActive, setCarouselActive] = useState(false);
  const isPausedRef = useRef(false);
  const isActiveRowHoveredRef = useRef(false);

  const syncPause = () => {
    isPausedRef.current = isActiveRowHoveredRef.current;
  };

  useEffect(() => {
    isInViewRef.current = isInView;

    if (isInView && !hasActivatedRef.current) {
      hasActivatedRef.current = true;
      setCarouselActive(true);
      setActive(0);
      setProgress(0);
    }
  }, [isInView]);

  useEffect(() => {
    isActiveRowHoveredRef.current = false;
    syncPause();
  }, [active]);

  useEffect(() => {
    if (!carouselActive || !isInView) return;

    setProgress(0);
    let accumulatedPause = 0;
    let pauseStarted = 0;
    let wasPaused = false;
    const start = performance.now();
    let raf = 0;

    const tick = (now: number) => {
      if (!isInViewRef.current) return;

      const paused = isPausedRef.current;
      if (paused) {
        if (!wasPaused) {
          pauseStarted = now;
          wasPaused = true;
        }
        raf = requestAnimationFrame(tick);
        return;
      }
      if (wasPaused) {
        accumulatedPause += now - pauseStarted;
        wasPaused = false;
      }
      const elapsed = now - start - accumulatedPause;
      const p = Math.min(1, elapsed / DURATION);
      setProgress(p);
      if (p < 1) raf = requestAnimationFrame(tick);
      else setActive((a) => (a + 1) % pillars.length);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [active, carouselActive, isInView]);

  return (
    <section
      ref={sectionRef}
      id="pillars"
      className="relative w-full bg-white px-[5%] pb-section pt-0 text-black"
    >
      <div className="relative z-10 mx-auto grid w-full min-w-0 max-w-[1480px] grid-cols-12 gap-x-0 gap-y-[clamp(1.25rem,3vw,2rem)] md:gap-x-[clamp(1.25rem,3vw,3.5rem)]">
        <div className="@container col-span-12 flex min-w-0 flex-col overflow-hidden md:col-span-5">
          <p className="text-kicker mb-[clamp(1.1rem,2.5vw,2rem)] flex items-center gap-2.5 uppercase tracking-[0.34em] text-black">
            <span aria-hidden className="h-px w-[clamp(1rem,2vw,1.5rem)] shrink-0 bg-black" />
            Product Features
          </p>
          <h2
            className="w-full min-w-0 text-[clamp(1.2rem,7.2cqw,2.55rem)] font-normal leading-[1.12] tracking-[-0.03em] [font-family:var(--font-display),Georgia,serif]"
            aria-label="Everything you need to ship agents that trade."
          >
            <span className="block whitespace-nowrap">Everything you need to</span>
            <span className="block whitespace-nowrap">
              ship agents that <span className="italic text-black/55">trade</span>.
            </span>
          </h2>

          <ul className="mt-[clamp(2.25rem,5vw,4rem)] hidden w-full min-w-0 flex-col md:flex">
            <li className="h-px w-5/6 bg-black/10" aria-hidden />
            {pillars.map((p, i) => {
              const isActive = i === active;
              return (
                <li
                  key={p.title}
                  className="relative min-w-0"
                  onPointerEnter={() => {
                    if (isActive) {
                      isActiveRowHoveredRef.current = true;
                      syncPause();
                    }
                  }}
                  onPointerLeave={() => {
                    if (isActive) {
                      isActiveRowHoveredRef.current = false;
                      syncPause();
                    }
                  }}
                >
                  <button
                    type="button"
                    onClick={() => setActive(i)}
                    className="grid w-5/6 min-w-0 grid-cols-[2.75rem_minmax(0,1fr)] items-center gap-3 py-[clamp(0.9rem,2.2cqw,1.35rem)] text-left"
                  >
                    <span
                      className={`font-mono text-[clamp(0.7rem,2.3cqw,0.8rem)] tracking-[0.2em] transition-colors ${
                        isActive ? "text-black" : "text-black/35"
                      }`}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span
                      className={`min-w-0 text-[clamp(1.05rem,3.4cqw,1.25rem)] transition-colors ${
                        isActive ? "font-semibold text-black" : "font-medium text-black/55"
                      }`}
                    >
                      {p.title}
                    </span>
                  </button>
                  <div className="relative h-px w-5/6 bg-black/10">
                    {isActive && (
                      <>
                        <div
                          className="absolute inset-y-0 left-0 bg-black"
                          style={{ width: `${progress * 100}%` }}
                        />
                        <span
                          aria-hidden
                          className="absolute top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 bg-black"
                          style={{ left: `${progress * 100}%` }}
                        />
                      </>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>

          {/* Mobile — numbered bubble nav */}
          <div className="mt-[clamp(1.5rem,4vw,2rem)] md:hidden">
            <div className="flex w-full flex-nowrap items-center justify-center gap-[clamp(0.3rem,1vw,0.5rem)]">
              {pillars.map((p, i) => {
                const isActive = i === active;
                return (
                  <button
                    key={p.title}
                    type="button"
                    onClick={() => setActive(i)}
                    aria-label={`${String(i + 1).padStart(2, "0")} ${p.title}`}
                    aria-current={isActive ? "true" : undefined}
                    className={`flex h-[clamp(2rem,7vw,2.5rem)] w-[clamp(2rem,7vw,2.5rem)] shrink-0 items-center justify-center rounded-full border font-mono text-[clamp(0.5rem,1.8vw,0.625rem)] tracking-[0.12em] transition-all duration-300 ${
                      isActive
                        ? "border-black bg-black text-white shadow-[0_0_0_3px_rgba(0,0,0,0.06)]"
                        : "border-black/14 bg-white text-black/38 hover:border-black/28 hover:text-black/55"
                    }`}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </button>
                );
              })}
            </div>

            <div className="mt-[clamp(1rem,3vw,1.25rem)] text-center">
              <p className="text-body-fluid font-semibold tracking-[-0.02em] text-black">
                {pillars[active].title}
              </p>
              <div className="mx-auto mt-3 h-px max-w-[min(12rem,40vw)] overflow-hidden bg-black/10">
                <div className="h-full bg-black" style={{ width: `${progress * 100}%` }} />
              </div>
            </div>
          </div>
        </div>

        <div className="col-span-12 flex min-w-0 flex-col md:col-span-7 md:mt-[clamp(1.5rem,3vw,2.5rem)] md:min-h-full">
          <div className="relative w-full min-w-0 overflow-hidden">
            {pillars.map((pillar, i) => {
              const isActive = i === active;
              return (
                <motion.div
                  key={pillar.title}
                  initial={false}
                  animate={{
                    opacity: isActive ? 1 : 0,
                    y: isActive ? 0 : 12,
                  }}
                  transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                  aria-hidden={!isActive}
                  className={`w-full min-w-0 ${
                    isActive ? "relative z-10" : "pointer-events-none absolute inset-x-0 top-0"
                  }`}
                >
                  <div className="relative aspect-[16/11] w-full max-w-[min(100%,clamp(18rem,52vw,46rem))] min-w-0 overflow-hidden rounded-sm border border-black/10 bg-white sm:aspect-[16/8.55]">
                    <div
                      className="pointer-events-none absolute inset-0 opacity-[0.4]"
                      style={{
                        backgroundImage:
                          "linear-gradient(to right, rgba(0,0,0,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(0,0,0,0.05) 1px, transparent 1px)",
                        backgroundSize: "clamp(1.25rem,3vw,2rem) clamp(1.25rem,3vw,2rem)",
                      }}
                    />
                    <img
                      src={pillar.image}
                      alt={pillar.title}
                      loading="lazy"
                      width={1280}
                      height={720}
                      className="absolute inset-0 h-full w-full max-w-full object-contain p-[clamp(0.6rem,1.5vw,1rem)]"
                    />
                    {[
                      "top-[clamp(0.4rem,1vw,0.625rem)] left-[clamp(0.4rem,1vw,0.625rem)]",
                      "top-[clamp(0.4rem,1vw,0.625rem)] right-[clamp(0.4rem,1vw,0.625rem)]",
                      "bottom-[clamp(0.4rem,1vw,0.625rem)] left-[clamp(0.4rem,1vw,0.625rem)]",
                      "bottom-[clamp(0.4rem,1vw,0.625rem)] right-[clamp(0.4rem,1vw,0.625rem)]",
                    ].map((pos) => (
                      <span
                        key={pos}
                        className={`absolute ${pos} h-[clamp(0.2rem,0.4vw,0.25rem)] w-[clamp(0.2rem,0.4vw,0.25rem)] bg-black/40`}
                      />
                    ))}
                  </div>

                  <div className="mt-[clamp(1rem,2.5vw,1.5rem)]">
                    <h3 className="hidden text-display-pillar font-normal tracking-tight [font-family:var(--font-display),Georgia,serif] md:block">
                      {pillar.title}
                    </h3>
                    <p className="text-body-fluid mt-0 max-w-full break-words leading-relaxed text-black/85 md:mt-[clamp(0.75rem,1.5vw,1rem)] md:max-w-[60ch]">
                      {pillar.body}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
