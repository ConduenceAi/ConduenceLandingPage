"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

import { logoWhiteSrc } from "@/lib/assets";

/* ============================================================
   PROBLEM
   ============================================================ */
export function Problem() {
  return (
    <section className="relative py-32 px-6 bg-black text-white">
      <div className="mx-auto max-w-6xl">
        <p className="text-[10px] font-semibold tracking-[0.4em] text-white/50 mb-6">
          [ THE PROBLEM ]
        </p>
        <h2 className="text-4xl sm:text-6xl font-black tracking-tight text-balance max-w-3xl">
          Today, traders pick between two bad options.
        </h2>
        <div className="mt-16 grid gap-px bg-white/10 md:grid-cols-2 border border-white/10">
          {[
            {
              t: "Build your own multi-agent system",
              d: "Technical. Expensive. Out of reach for everyone except funded quant teams.",
            },
            {
              t: "Copy someone else's trades",
              d: "Blind. Late. You're trading on someone else's edge, after the price has already moved.",
            },
          ].map((c) => (
            <div key={c.t} className="bg-black p-10">
              <div className="h-10 w-10 rounded-full border border-white/40 grid place-items-center text-white/70 text-xl mb-6">
                ✕
              </div>
              <h3 className="text-2xl font-bold mb-3">{c.t}</h3>
              <p className="text-white/60">{c.d}</p>
            </div>
          ))}
        </div>
        <p className="mt-12 text-2xl font-semibold text-white/40">
          Neither puts <span className="text-white">you</span> in control.
        </p>
      </div>
    </section>
  );
}

/* ============================================================
   SOLUTION
   ============================================================ */
export function Solution() {
  const nodes = [
    { t: "Price Data", d: "Fetch real-time and historical price data for any ticker." },
    { t: "Chart Image", d: "Generate TradingView-style chart images." },
    { t: "Polymarket Data", d: "Fetch prediction market data from Polymarket." },
    { t: "Portfolio Data", d: "Positions, balances, and live P&L." },
    { t: "Coinglass", d: "Open interest, funding, and liquidations." },
  ];
  return (
    <section id="solution" className="relative py-32 px-6 bg-white text-black">
      <div className="mx-auto max-w-6xl">
        <p
          className="text-[10px] tracking-[0.4em] text-black/50 mb-6"
          style={{ fontFamily: '"Michroma", sans-serif' }}
        >
          [ THE SOLUTION ]
        </p>
        <h2
          className="text-4xl sm:text-5xl tracking-[0.02em] text-balance max-w-3xl leading-[1.1]"
          style={{ fontFamily: '"Michroma", sans-serif' }}
        >
          Orchestrate agents. Keep the human gate.
        </h2>
        <p className="mt-6 max-w-2xl text-lg text-black/60">
          A drag-and-drop builder where you define which agents exist, which tools they use, how
          they talk, where you approve, and how capital flows.
        </p>

        <div className="mt-20 grid gap-12 md:grid-cols-2 items-center">
          {/* Add Node mockup panel */}
          <div className="relative rounded-2xl border border-black/15 bg-black p-6 shadow-2xl">
            <div
              className="absolute inset-0 rounded-2xl opacity-[0.08] pointer-events-none"
              style={{
                backgroundImage: "radial-gradient(rgba(255,255,255,0.6) 1px, transparent 1px)",
                backgroundSize: "14px 14px",
              }}
            />
            <div className="relative">
              <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-4">
                <span className="text-white text-lg font-semibold">Add Node</span>
                <span className="text-white/60 text-xl leading-none">×</span>
              </div>
              <p className="text-[10px] font-mono tracking-[0.3em] text-white/40 mb-4">
                DATA SOURCES
              </p>
              <ul className="space-y-2">
                {nodes.map((n, i) => (
                  <li
                    key={n.t}
                    className={`flex items-start gap-4 rounded-lg border border-white/10 p-4 transition ${
                      i === 3 ? "bg-white/[0.06]" : "bg-white/[0.02] hover:bg-white/[0.05]"
                    }`}
                  >
                    <div className="h-9 w-9 shrink-0 rounded-md border border-white/15 bg-white/5 grid place-items-center text-white/70 text-xs">
                      ◆
                    </div>
                    <div>
                      <p className="text-white font-semibold text-sm">{n.t}</p>
                      <p className="text-white/55 text-xs mt-0.5">{n.d}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Right copy */}
          <div>
            <p
              className="text-[10px] tracking-[0.4em] text-black/40 mb-4"
              style={{ fontFamily: '"Michroma", sans-serif' }}
            >
              [ VISUAL BUILDER ]
            </p>
            <h3 className="text-4xl sm:text-5xl font-semibold leading-[1.05] tracking-tight">
              Design it.
            </h3>
            <p className="mt-6 text-lg text-black/60 max-w-md">
              Drag-and-drop strategy builder with pre-built logic blocks. Wire data sources, mind
              agents, and execution into a single canvas — then keep the human gate before capital
              moves.
            </p>
            <div className="mt-8 flex flex-wrap gap-2">
              {["Data", "Agents", "Tools", "Human Gate", "Execution"].map((c) => (
                <span
                  key={c}
                  className="rounded-full border border-black/20 px-3 py-1.5 text-xs font-mono tracking-wider"
                >
                  {c}
                </span>
              ))}
            </div>
          </div>
        </div>

        <p className="mt-20 text-3xl font-black tracking-tight text-balance max-w-2xl">
          You stay in control. <span className="text-black/40">The agents handle the scale.</span>
        </p>
      </div>
    </section>
  );
}

/* ============================================================
   REASONING  — bold typographic statement (per ref image)
   ============================================================ */
export function Reasoning() {
  return (
    <section id="core-insight" className="relative py-40 px-6 bg-white text-black overflow-hidden">
      <div className="mx-auto max-w-7xl text-center">
        <p className="text-[10px] font-semibold tracking-[0.4em] text-black/50 mb-10">
          [ CORE INSIGHT ]
        </p>

        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.9, ease: "easeOut" }}
          className="text-balance font-black uppercase leading-[0.95] tracking-[-0.02em]"
          style={{ fontSize: "clamp(2.5rem, 7vw, 7rem)" }}
        >
          The edge isn't the position.
          <br />
          It's the <span className="italic font-light">reasoning.</span>
        </motion.h2>

        {/* Crosshair divider */}
        <div className="my-20 flex justify-center">
          <svg width="40" height="40" viewBox="0 0 40 40" className="text-black">
            <line x1="20" y1="4" x2="20" y2="36" stroke="currentColor" strokeWidth="1" />
            <line x1="4" y1="20" x2="36" y2="20" stroke="currentColor" strokeWidth="1" />
          </svg>
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   DATA
   ============================================================ */
export function Data() {
  return (
    <section id="data" className="relative py-32 px-6 bg-black text-white">
      <div className="mx-auto max-w-6xl">
        <p
          className="text-[10px] tracking-[0.4em] text-white/50 mb-6"
          style={{ fontFamily: '"Michroma", sans-serif' }}
        >
          [ WHY NOW ]
        </p>
        <h2
          className="text-3xl sm:text-5xl tracking-[0.02em] text-balance max-w-4xl leading-[1.15]"
          style={{ fontFamily: '"Michroma", sans-serif' }}
        >
          Whales see it first. You see it after.
        </h2>
        <p className="mt-6 max-w-2xl text-lg text-white/60">
          Prices, news, social chatter, on-chain signals — bots ingest it before you finish reading
          the headline. By the time you click buy, the edge is already gone.
        </p>
        <div className="mt-16 grid gap-px border border-white/10 bg-white/10 md:grid-cols-3">
          {[
            "Most retail traders were directionally right, but entered too late.",
            "Automation captured pricing inefficiencies before humans could react.",
            "Execution quality mattered more than raw prediction accuracy.",
          ].map((line) => (
            <div
              key={line}
              className="bg-black px-8 py-10 text-lg font-medium leading-relaxed text-white/72"
            >
              {line}
            </div>
          ))}
        </div>
        <blockquote className="mt-20 max-w-3xl text-2xl sm:text-3xl font-semibold leading-snug text-balance">
          "The execution edge is an underrated aspect of trading."
          <footer className="mt-4 text-sm font-normal text-white/50">
            — Japan Times, on Polymarket bot research
          </footer>
        </blockquote>
        <p className="mt-12 text-3xl sm:text-4xl font-black tracking-tight">
          Speed can make you stand alongside whales.
        </p>
      </div>
    </section>
  );
}

/* ============================================================
   AGENTS SCROLL — typographic morph: dot → "AGENTS" word reveal
   ============================================================ */
export function AgentsScroll() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });

  // Dot expands into "AGENTS" wordmark
  const dotScale = useTransform(scrollYProgress, [0, 0.1, 0.35], [0, 1, 1]);
  const dotOpacity = useTransform(scrollYProgress, [0, 0.05, 0.32, 0.4], [0, 1, 1, 0]);
  const wordScale = useTransform(scrollYProgress, [0.3, 0.55], [0.05, 1]);
  const wordOpacity = useTransform(scrollYProgress, [0.3, 0.42, 0.95], [0, 1, 1]);
  const panelsOpacity = useTransform(scrollYProgress, [0.55, 0.72], [0, 1]);
  const panelsY = useTransform(scrollYProgress, [0.55, 0.72], [40, 0]);

  const concepts = [
    {
      tag: "TOOLS",
      title: "Live market inputs",
      body: "Structured feeds, news, and venue data in one reasoning layer.",
      pos: "left-[6%] top-[16%]",
    },
    {
      tag: "TEMPLATES",
      title: "Fork & remix",
      body: "Start from proven strategies. Modify. Run them as your own.",
      pos: "right-[6%] top-[16%]",
    },
    {
      tag: "MIND AGENTS",
      title: "Specialist roles",
      body: "Research, sizing, and execution agents converge on a single call.",
      pos: "left-[6%] bottom-[16%]",
    },
    {
      tag: "HUMAN GATE",
      title: "You stay in control",
      body: "Every meaningful action pauses for your approval before capital moves.",
      pos: "right-[6%] bottom-[16%]",
    },
  ];

  return (
    <>
      <section
        id="agents"
        ref={ref}
        className="relative bg-black text-white"
        style={{ height: "320vh" }}
      >
        <div className="sticky top-0 h-screen overflow-hidden">
          {/* Subtle grid */}
          <div
            className="absolute inset-0 opacity-[0.07]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,0.55) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.55) 1px, transparent 1px)",
              backgroundSize: "88px 88px",
              maskImage: "radial-gradient(circle at center, black 30%, transparent 80%)",
            }}
          />

          <div className="absolute top-8 left-0 right-0 flex justify-between px-10 text-[10px] font-mono tracking-[0.4em] text-white/40 z-20">
            <span>[ MEET YOUR ]</span>
            <span>AVAILABLE NOW</span>
          </div>

          {/* Center stage */}
          <div className="absolute inset-0 flex items-center justify-center">
            {/* Initial dot */}
            <motion.div
              style={{ scale: dotScale, opacity: dotOpacity }}
              className="absolute h-4 w-4 rounded-full bg-white shadow-[0_0_60px_rgba(255,255,255,0.6)]"
            />

            {/* AGENTS wordmark expanding from center */}
            <motion.h2
              style={{
                scale: wordScale,
                opacity: wordOpacity,
                fontSize: "20vw",
                fontFamily: '"Cormorant Garamond", "Playfair Display", Georgia, serif',
                fontWeight: 500,
                fontStyle: "italic",
              }}
              className="font-black tracking-[-0.04em] leading-none text-white select-none"
            >
              AGENTS
            </motion.h2>
          </div>

          {/* Four floating concept panels at corners */}
          <motion.div
            style={{ opacity: panelsOpacity, y: panelsY }}
            className="absolute inset-0 pointer-events-none"
          >
            {concepts.map((c, i) => (
              <motion.div
                key={c.tag}
                initial={false}
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 5 + i * 0.4, repeat: Infinity, ease: "easeInOut" }}
                className={`absolute ${c.pos} w-[22rem] border border-white/15 bg-white/[0.04] p-6 backdrop-blur-sm`}
              >
                <p className="mb-3 text-[10px] font-mono tracking-[0.34em] text-white/48">
                  {c.tag}
                </p>
                <h3 className="mb-2 text-2xl font-black tracking-tight">{c.title}</h3>
                <p className="text-sm leading-relaxed text-white/66">{c.body}</p>
              </motion.div>
            ))}
          </motion.div>

          {/* Bottom status bar */}
          <div className="absolute bottom-6 left-0 right-0 flex justify-between px-10 text-[10px] font-mono text-white/30 z-20">
            <span>CONDUENCE CORE</span>
            <span>SCROLL ↓</span>
          </div>
        </div>
      </section>

      {/* Coda: agent voice */}
      <section className="relative py-40 px-6 bg-black text-white overflow-hidden">
        <div className="mx-auto max-w-7xl text-center">
          <div className="mb-16 flex justify-center">
            <svg width="40" height="40" viewBox="0 0 40 40" className="text-white">
              <line x1="20" y1="4" x2="20" y2="36" stroke="currentColor" strokeWidth="1" />
              <line x1="4" y1="20" x2="36" y2="20" stroke="currentColor" strokeWidth="1" />
            </svg>
          </div>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9 }}
            className="mx-auto max-w-4xl text-balance text-2xl sm:text-4xl font-black uppercase tracking-tight leading-tight"
          >
            I see, I think, I move and now, I talk.
            <br />
            I'm fully autonomous. I'm alive.
          </motion.p>

          <div className="mt-12 flex justify-center gap-2">
            {["24", "7"].map((n) => (
              <div
                key={n}
                className="h-14 w-14 rounded-full border border-white grid place-items-center font-mono text-sm font-bold"
              >
                {n}
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

/* ============================================================
   WORKFLOW
   ============================================================ */
export function Workflow() {
  return (
    <section id="workflow" className="relative py-32 px-6 bg-white text-black">
      <div className="mx-auto max-w-6xl">
        <p className="text-[10px] font-semibold tracking-[0.4em] text-black/50 mb-6">
          [ WORKFLOW FREEDOM ]
        </p>
        <h2 className="text-4xl sm:text-6xl font-black tracking-tight text-balance max-w-3xl">
          Anyone can create their own workflow.
        </h2>
        <div className="mt-16 border border-black/15 p-8 sm:p-12">
          <div className="grid grid-cols-3 gap-px bg-black/10 border border-black/10">
            {["TOOLS", "TEMPLATES", "MIND AGENT"].map((l) => (
              <div
                key={l}
                className="bg-white p-8 text-center font-mono text-xs sm:text-sm tracking-[0.2em]"
              >
                {l}
              </div>
            ))}
          </div>
          <div className="my-6 text-center text-black/40 text-xs font-mono tracking-[0.3em]">
            ↓ ORCHESTRATED BY YOU ↓
          </div>
          <div className="bg-black text-white p-6 text-center font-mono text-xs sm:text-sm tracking-[0.2em]">
            HUMAN GATE → CAPITAL ALLOCATION → EXECUTION
          </div>
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   CTA
   ============================================================ */
export function CTA() {
  return (
    <section id="cta" className="relative py-32 px-6 bg-black text-white">
      <div className="mx-auto max-w-4xl text-center">
        <h2 className="text-5xl sm:text-7xl font-black tracking-tight text-balance">
          Trade with the agents.
          <br />
          <span className="text-white/40">Not against them.</span>
        </h2>
        <p className="mt-8 text-lg text-white/60 max-w-xl mx-auto">
          CONDUENCE is in private beta. Join the waitlist for early access to the Agora builder and
          Mind Agent marketplace.
        </p>
        <form
          className="mt-10 flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
          onSubmit={(e) => e.preventDefault()}
        >
          <input
            type="email"
            placeholder="you@strategy.io"
            className="flex-1 rounded-full border border-white/30 bg-transparent px-5 py-3 text-sm text-white placeholder:text-white/40 focus:outline-none focus:ring-1 focus:ring-white"
          />
          <button className="rounded-full bg-white text-black px-6 py-3 text-sm font-semibold hover:bg-white/90 transition">
            Reserve seat
          </button>
        </form>
      </div>
    </section>
  );
}

/* ============================================================
   FOOTER — Walbi-style giant wordmark
   ============================================================ */
export function Footer() {
  return (
    <footer className="bg-black text-white pt-20 pb-10 px-6 overflow-hidden">
      <div className="mx-auto max-w-[1600px]">
        {/* GIANT WORDMARK — centered logo */}
        <div className="flex justify-center">
          <img
            src={logoWhiteSrc}
            alt="CONDUENCE"
            className="w-full max-w-[1400px] h-auto select-none"
            draggable={false}
          />
        </div>

        {/* Bottom row */}
        <div className="mt-16 flex flex-col md:flex-row justify-between gap-6 text-xs text-white/40 border-t border-white/10 pt-6">
          <p className="max-w-3xl leading-relaxed">
            Trading on prediction markets involves significant risk. CONDUENCE does not provide
            financial advice; you are solely responsible for your trading decisions. Conduct your
            own research before participating.
          </p>
          <div className="flex items-center gap-6">
            <a href="#" className="hover:text-white">
              Twitter
            </a>
            <a href="#" className="hover:text-white">
              Discord
            </a>
            <a href="#" className="hover:text-white">
              GitHub
            </a>
            <span>© 2026 CONDUENCE Labs</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
