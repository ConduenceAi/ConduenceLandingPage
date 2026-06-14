"use client";

import { motion, useMotionValueEvent, useScroll } from "framer-motion";
import { useRef, useState } from "react";

import { pillarFlowSrc, pillarGraphSrc, pillarMindSrc } from "@/lib/assets";

type Pillar = {
  title: string;
  body: string;
  help: string;
  image: { url: string };
};

const pillars: Pillar[] = [
  {
    title: "Agentic Recall",
    body: "Agents traverse their own history at low latency — past calls, live positions, the reasoning behind every move. Paired with a relation graph you author together with an LLM, mapping how real-world events influence each other. Positive weights mean directly proportional. Negative weights mean inversely proportional.",
    help: "Agents stop guessing cause and effect. Less assumption, more informed decisions.",
    image: pillarGraphSrc,
  },
  {
    title: "Mind",
    body: "Creators deploy their strategies and heavy daily work — news analysis, arbitrage scouting, mispricing detection — as Mind Agents. Plug them into your workflow instead of spinning up your own compute for the same task.",
    help: "Specialist intelligence, on tap. Pay for the edge, not the GPU bill.",
    image: pillarMindSrc,
  },
  {
    title: "Canvas",
    body: "Generate a complete workflow from a single prompt with the AI builder, or compose it block by block on the drag-and-drop canvas. Wire data, agents, tools, and execution without writing a single line of code. We also provide a simulator for paper trading so you can test strategies risk-free before going live.",
    help: "From idea to live agent in minutes, not weeks.",
    image: pillarFlowSrc,
  },
];

export function Pillars() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const [active, setActive] = useState(0);

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    const idx = v < 0.34 ? 0 : v < 0.67 ? 1 : 2;
    if (idx !== active) setActive(idx);
  });

  return (
    <section ref={ref} className="relative bg-black text-white" style={{ height: "340vh" }}>
      <div className="sticky top-0 h-screen overflow-hidden flex items-center">
        {pillars.map((p, i) => (
          <Spread key={p.title} pillar={p} active={i === active} />
        ))}

        {/* step indicators */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex items-center gap-3">
          {pillars.map((_, i) => (
            <div
              key={i}
              className={`h-1 transition-all duration-500 ${
                i === active ? "w-10 bg-white" : "w-4 bg-white/25"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function Spread({ pillar, active }: { pillar: Pillar; active: boolean }) {
  return (
    <motion.div
      initial={false}
      animate={{ opacity: active ? 1 : 0 }}
      transition={{ duration: 0.55, ease: "easeOut" }}
      className="absolute inset-0 flex items-center"
      style={{ pointerEvents: active ? "auto" : "none" }}
    >
      <div className="relative h-full w-full max-w-[1500px] mx-auto px-6 sm:px-10 grid grid-cols-12 gap-x-8 items-center">
        {/* LEFT — text */}
        <motion.div
          initial={false}
          animate={{ y: active ? 0 : 30, opacity: active ? 1 : 0 }}
          transition={{ duration: 0.7, ease: "easeOut", delay: 0.05 }}
          className="col-span-12 md:col-span-5 flex flex-col gap-6"
        >
          <h3 className="font-display text-4xl md:text-5xl lg:text-6xl leading-[1.02] tracking-tight">
            {pillar.title}
          </h3>
          <p className="text-base md:text-lg text-white/70 leading-relaxed max-w-[48ch]">
            {pillar.body}
          </p>
          <div className="mt-2 pt-5 border-t border-white/20 max-w-[48ch]">
            <p className="font-mono text-[10px] tracking-[0.3em] text-white/50 mb-2">
              HOW IT HELPS THE AGENT
            </p>
            <p className="text-base md:text-lg font-medium leading-snug text-white">
              {pillar.help}
            </p>
          </div>
        </motion.div>

        {/* RIGHT — image */}
        <motion.div
          initial={false}
          animate={{
            y: active ? 0 : 60,
            opacity: active ? 1 : 0,
            scale: active ? 1 : 0.96,
          }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="hidden md:flex col-span-7 items-center justify-center"
        >
          <img
            src={pillar.image.url}
            alt={pillar.title}
            loading="lazy"
            width={1024}
            height={1024}
            className="object-contain drop-shadow-[0_30px_60px_rgba(0,0,0,0.5)]"
            style={{ maxHeight: "75vh", maxWidth: "100%" }}
            draggable={false}
          />
        </motion.div>
      </div>
    </motion.div>
  );
}
