"use client";

import { motion } from "framer-motion";
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
  const [active, setActive] = useState(0);
  const [progress, setProgress] = useState(0);
  const isPausedRef = useRef(false);
  const isActiveRowHoveredRef = useRef(false);

  const syncPause = () => {
    isPausedRef.current = isActiveRowHoveredRef.current;
  };

  useEffect(() => {
    isActiveRowHoveredRef.current = false;
    syncPause();
  }, [active]);

  useEffect(() => {
    setProgress(0);
    let accumulatedPause = 0;
    let pauseStarted = 0;
    let wasPaused = false;
    const start = performance.now();
    let raf = 0;

    const tick = (now: number) => {
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
  }, [active]);

  return (
    <section
      id="pillars"
      className="relative overflow-hidden bg-white px-[5%] pb-section pt-0 text-black"
    >
      <div className="relative z-10 mx-auto grid max-w-[1480px] grid-cols-12 gap-x-10 gap-y-8 sm:gap-x-16 lg:gap-x-24">
        <div className="col-span-12 flex flex-col md:col-span-5">
          <p className="mb-6 flex items-center gap-2.5 text-[10px] uppercase tracking-[0.34em] text-black sm:mb-8">
            <span aria-hidden className="h-1.5 w-1.5 shrink-0 rounded-full bg-black" />
            Product Catalog
          </p>
          <h2 className="text-display-pillar font-display leading-[1.05] tracking-tight">
            Everything you need to
            <br />
            <span className="font-normal text-black/45">ship agents that trade</span>
          </h2>

          <ul className="mt-12 flex flex-col sm:mt-16">
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
        </div>

        <div className="col-span-12 flex min-h-full flex-col md:col-span-7 md:mt-8 lg:mt-10">
          <div className="grid">
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
                  className={`col-start-1 row-start-1 flex flex-col ${
                    isActive ? "z-10" : "pointer-events-none"
                  }`}
                >
                  <div className="relative aspect-[16/8.55] w-full max-w-sm overflow-hidden rounded-sm border border-black/10 bg-white sm:max-w-md md:max-w-xl lg:max-w-2xl">
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
                      className="absolute inset-0 h-full w-full object-contain p-4"
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

                  <div className="mt-6">
                    <p className="mb-3 font-mono text-[10px] tracking-[0.34em] text-black/50">
                      {String(i + 1).padStart(2, "0")} &middot; {pillar.kicker}
                    </p>
                    <h3 className="text-display-pillar font-display tracking-tight">
                      {pillar.title}
                    </h3>
                    <p className="text-body-fluid mt-4 max-w-[60ch] leading-relaxed text-black/60">
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
