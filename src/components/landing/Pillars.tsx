"use client";

import { motion, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";

import {
  featCanvasSrc,
  featConnectorsSrc,
  featByosSrc,
  featGraphSrc,
  featMindSrc,
  featObservabilitySrc,
  featPaperSrc,
} from "@/lib/assets";

type Pillar = {
  kicker: string;
  title: string;
  body: string;
  image: string;
};

const pillars: Pillar[] = [
  {
    kicker: "RELATION GRAPH",
    title: "Mind Mesh",
    body: "You control the orchestrator mind. You shape its view of the world, its reasoning, the factors that matter, and how they relate. It traverses that structure in milliseconds instead of reasoning from scratch, so your perspective, your edges, and your weights become its intuition.",
    image: featGraphSrc,
  },
  {
    kicker: "Retracing trades",
    title: "Retrace",
    body: "Every trade is a path you can trace: which agent called which tool, what each returned, cost per call, cost per Mind Agent, and the full decision path. The exit rules set by the orchestrator at entry live there too, and you can change them anytime. Find something wrong? Flag it. The orchestrator's mind absorbs that correction, and its next intuition carries the lesson.",
    image: featObservabilitySrc,
  },
  {
    kicker: "BUILDER",
    title: "Agent Studio",
    body: "Compose your own agent workflow on a drag and drop canvas. Preloaded tools, sub agent templates, the orchestrator, and Mind Agents. Wire them together without writing a single line of code. Explore the strategy that works best for you.",
    image: featCanvasSrc,
  },
  {
    kicker: "MARKETPLACE",
    title: "Mind Agents",
    body: "We extract the complexity so anyone can use the final product through micropayments. Monetize your strategy or your entire workflow as a Mind Agent. Your strategy stays private while you earn from it. Subscribe to one and plug it into your own workflow, or run it standalone. With Mind Agents that emit trades, you're live within minutes.",
    image: featMindSrc,
  },
  {
    kicker: "CONNECTORS",
    title: "Connectors",
    body: "Connect Telegram and Discord to your workflow. Get trade signals and event alerts where you already are, so you can take command while away from the dashboard. When your agent finds an opportunity, verify it and execute in one tap. You stay in full control.",
    image: featConnectorsSrc,
  },
  {
    kicker: "SIMULATION",
    title: "Simulator",
    body: "Test a strategy or an entire AI agent workflow against live Polymarket and Kalshi data, without putting real money on the line. Validate edge, debug behavior, and tune parameters before going live.",
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
      className="relative w-full overflow-x-hidden bg-white px-[5%] pb-section pt-0 text-black"
    >
      <div className="relative z-10 mx-auto grid w-full min-w-0 max-w-[1480px] grid-cols-12 gap-x-0 gap-y-6 md:gap-x-10 md:gap-y-8 lg:gap-x-24">
        <div className="col-span-12 flex min-w-0 flex-col md:col-span-5">
          <p className="mb-6 flex items-center gap-2.5 text-[10px] uppercase tracking-[0.34em] text-black sm:mb-8">
            <span aria-hidden className="h-px w-6 shrink-0 bg-black" />
            Product Catalog
          </p>
          <h2 className="text-display-pillar font-display leading-[1.05] tracking-tight">
            Everything you need to
            <br />
            <span className="font-normal text-black/45">ship agents that trade</span>
          </h2>

          <ul className="mt-12 hidden flex-col sm:mt-16 md:flex">
            {pillars.map((p, i) => {
              const isActive = i === active;
              return (
                <li
                  key={p.title}
                  className="relative"
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
                    className="grid w-full grid-cols-[48px_1fr_12px] items-center gap-4 border-t border-black/10 py-[19px] text-left sm:py-[23px]"
                  >
                    <span
                      className={`font-mono text-xs tracking-[0.2em] transition-colors ${
                        isActive ? "text-black" : "text-black/35"
                      }`}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span
                      className={`text-body-fluid transition-colors ${
                        isActive ? "font-semibold text-black" : "font-medium text-black/55"
                      }`}
                    >
                      {p.title}
                    </span>
                    <span
                      aria-hidden
                      className={`h-2 w-2 justify-self-end transition-colors ${
                        isActive ? "bg-black" : "bg-transparent"
                      }`}
                    />
                  </button>
                  <div className="absolute -bottom-px left-0 right-0 h-px overflow-hidden bg-transparent">
                    {isActive && (
                      <div className="h-full bg-black" style={{ width: `${progress * 100}%` }} />
                    )}
                  </div>
                </li>
              );
            })}
            <li className="border-t border-black/10" />
          </ul>

          {/* Mobile — numbered bubble nav */}
          <div className="mt-8 md:hidden">
            <div className="flex w-full flex-nowrap items-center justify-center gap-1.5 sm:gap-2">
              {pillars.map((p, i) => {
                const isActive = i === active;
                return (
                  <button
                    key={p.title}
                    type="button"
                    onClick={() => setActive(i)}
                    aria-label={`${String(i + 1).padStart(2, "0")} ${p.title}`}
                    aria-current={isActive ? "true" : undefined}
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border font-mono text-[9px] tracking-[0.12em] transition-all duration-300 sm:h-10 sm:w-10 sm:text-[10px] sm:tracking-[0.14em] ${
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

            <div className="mt-5 text-center">
              <p className="font-mono text-[10px] tracking-[0.34em] text-black/45">
                {String(active + 1).padStart(2, "0")} &middot; {pillars[active].kicker}
              </p>
              <p className="text-body-fluid mt-1.5 font-semibold tracking-[-0.02em] text-black">
                {pillars[active].title}
              </p>
              <div className="mx-auto mt-3 h-px max-w-[12rem] overflow-hidden bg-black/10">
                <div className="h-full bg-black" style={{ width: `${progress * 100}%` }} />
              </div>
            </div>
          </div>
        </div>

        <div className="col-span-12 flex min-w-0 flex-col md:col-span-7 md:mt-8 md:min-h-full lg:mt-10">
          <div className="relative w-full min-w-0">
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
                  <div className="relative aspect-[16/11] w-full min-w-0 overflow-hidden rounded-sm border border-black/10 bg-white sm:aspect-[16/8.55] md:max-w-xl lg:max-w-2xl">
                    <div
                      className="pointer-events-none absolute inset-0 opacity-[0.4]"
                      style={{
                        backgroundImage:
                          "linear-gradient(to right, rgba(0,0,0,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(0,0,0,0.05) 1px, transparent 1px)",
                        backgroundSize: "32px 32px",
                      }}
                    />
                    <img
                      src={pillar.image}
                      alt={pillar.title}
                      loading="lazy"
                      width={1280}
                      height={720}
                      className="absolute inset-0 h-full w-full max-w-full object-contain p-3 sm:p-4"
                    />
                    {[
                      "top-2.5 left-2.5",
                      "top-2.5 right-2.5",
                      "bottom-2.5 left-2.5",
                      "bottom-2.5 right-2.5",
                    ].map((pos) => (
                      <span key={pos} className={`absolute ${pos} h-1 w-1 bg-black/40`} />
                    ))}
                  </div>

                  <div className="mt-5 md:mt-6">
                    <p className="mb-3 hidden font-mono text-[10px] tracking-[0.34em] text-black/50 md:block">
                      {String(i + 1).padStart(2, "0")} &middot; {pillar.kicker}
                    </p>
                    <h3 className="hidden text-display-pillar font-display tracking-tight md:block">
                      {pillar.title}
                    </h3>
                    <p className="text-body-fluid mt-0 max-w-full break-words leading-relaxed text-black/60 md:mt-4 md:max-w-[60ch]">
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
