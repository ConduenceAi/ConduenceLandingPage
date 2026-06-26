"use client";

import { logoWhiteSrc } from "@/lib/assets";

/* ============================================================
   REASONING  — platform overview
   ============================================================ */
const REASONING_ITEMS = [
  {
    id: "01",
    title: "All your prediction market tools, ready for agents",
    body: "Bring research inputs, market data, execution surfaces, and the tools you already rely on into one place, so your agents can operate with the full context at their fingertips.",
  },
  {
    id: "02",
    title: "Voice as the control layer",
    body: "Use voice to interact with your second brain, explore opportunities, monitor workflows, and deploy AI agents through natural commands instead of manual coordination.",
  },
  {
    id: "03",
    title: "A second brain that keeps your edge intact",
    body: "Capture your memory, perspective, and reasoning so the system does not forget how you think. Your logic compounds over time instead of getting lost between trades.",
  },
];

export function Reasoning() {
  return (
    <section id="core-insight" className="relative overflow-hidden bg-white px-section py-section text-black">
      <div className="mx-auto grid max-w-[1480px] gap-12 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:items-start lg:gap-16">
        <div className="lg:pl-8">
          <h2 className="mt-5 max-w-3xl font-sans text-[clamp(2rem,3.8vw,3.95rem)] font-semibold leading-[0.96] tracking-[-0.045em]">
            The unified platform
          </h2>

          <div className="mt-12">
            {REASONING_ITEMS.map((item) => (
              <article key={item.id} className="border-black/10 py-6 not-last:border-b">
                <div className="max-w-2xl">
                  <span className="mb-3 block font-mono text-xs font-semibold tracking-[0.28em] text-black/45">
                    {item.id}
                  </span>
                  <h3 className="max-w-2xl text-[1.35rem] font-medium leading-tight tracking-[-0.035em] text-black sm:text-[1.75rem]">
                    {item.title}
                  </h3>
                  <p className="mt-3 max-w-2xl text-[0.95rem] leading-relaxed text-black/60 sm:text-[1rem]">
                    {item.body}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>

        <div className="relative mx-auto hidden w-full max-w-[34rem] lg:block">
          <svg
            viewBox="0 0 520 640"
            className="h-auto w-full text-black/28"
            aria-hidden="true"
            fill="none"
          >
            <defs>
              <pattern id="reasoning-horizontal" width="16" height="16" patternUnits="userSpaceOnUse">
                <path d="M0 8H16" stroke="currentColor" strokeWidth="1" />
              </pattern>
              <pattern id="reasoning-vertical" width="18" height="18" patternUnits="userSpaceOnUse">
                <path d="M9 0V18" stroke="currentColor" strokeWidth="1" />
              </pattern>
              <pattern id="reasoning-grid" width="22" height="22" patternUnits="userSpaceOnUse">
                <path d="M0 22L22 0M-5.5 5.5L5.5 -5.5M16.5 27.5L27.5 16.5" stroke="currentColor" strokeWidth="0.9" />
                <path d="M0 0L22 22M-5.5 16.5L5.5 27.5M16.5 -5.5L27.5 5.5" stroke="currentColor" strokeWidth="0.9" />
              </pattern>
              <pattern id="reasoning-dots" width="6" height="6" patternUnits="userSpaceOnUse">
                <circle cx="3" cy="3" r="0.75" fill="currentColor" />
              </pattern>
            </defs>

            <g stroke="currentColor" strokeWidth="1.6">
              <polygon points="120,520 290,420 460,520 290,620" fill="white" />
              <polyline points="120,520 120,565 290,665 290,620" />
              <polyline points="460,520 460,565 290,665 290,620" />
              <path d="M154 540V585M188 560V605M222 580V625M256 600V645M324 600V645M358 580V625M392 560V605M426 540V585" />

              <polygon points="120,420 290,320 460,420 290,520" fill="url(#reasoning-dots)" />

              <polygon points="120,420 290,320 460,420 290,520" fill="url(#reasoning-grid)" />

              <polygon points="150,350 320,250 490,350 320,450" fill="white" />
              <polyline points="320,250 320,450 490,350" />
              <polygon points="150,350 320,250 490,350 320,450" fill="url(#reasoning-grid)" />

              <polygon points="250,270 420,170 420,295 250,395" fill="white" />
              <polygon points="250,270 420,170 420,295 250,395" fill="url(#reasoning-vertical)" />
              <polyline points="250,270 250,395 80,495" opacity="0.25" />

              <polygon points="90,240 260,140 430,240 260,340" fill="white" opacity="0.7" />
              <polyline points="260,140 260,340 430,240" opacity="0.32" />
              <polygon points="90,240 260,140 430,240 260,340" fill="url(#reasoning-horizontal)" />

              <path d="M90 240V420M260 140V320M430 240V420" opacity="0.18" />
            </g>
          </svg>
        </div>
      </div>
    </section>
  );
}

const AGENT_FEATURES = [
  {
    title: "Make the most out of Voice",
    body: "Monitor agents, explore markets, train your system, and orchestrate execution from one voice-native surface.",
  },
  {
    title: "A trading assistant in your pocket",
    body: "Conduence is a voice-first trading app that lets you monitor agents, review performance, and track open trades from anywhere.",
  },
  {
    title: "Talk your way from idea to execution",
    body: "Ask about markets, evaluate opportunities together, and execute trades on platforms like Polymarket or Kalshi — all through voice.",
  },
  {
    title: "Train the system with your own thinking",
    body: "Use voice to teach Conduence your reasoning, preferences, and trading approach so it can better mirror how you make decisions.",
  },
  {
    title: "Create automated agent workflows by voice",
    body: "Build and orchestrate powerful AI agent systems, connect tools and APIs, and automate workflows without needing anything beyond your voice.",
  },
];

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
];

/* ============================================================
   AGENTS FEATURES
   ============================================================ */
export function AgentsScroll() {
  return (
    <section id="agents" className="relative overflow-hidden bg-white pt-14 text-black sm:pt-20">
      <div className="relative mx-auto max-w-[1480px] px-section pb-20 sm:pb-44">
        <div className="grid gap-4 pb-6">
          <div className="mx-auto text-center">
            <h2 className="mt-3 max-w-4xl font-display text-[clamp(2.3rem,4.8vw,4.8rem)] font-normal leading-[0.94] tracking-[-0.04em]">
              <span className="block text-black">Make the most</span>
              <span className="block font-normal italic text-black/35">out of Voice</span>
            </h2>
          </div>
        </div>

        <div className="relative mt-4 grid grid-cols-1 gap-px border border-black/8 bg-black/8 lg:grid-cols-3">
          <div className="pointer-events-none absolute left-1/2 top-0 h-px w-screen -translate-x-1/2 bg-black/8" />
          <div className="pointer-events-none absolute bottom-0 left-1/2 h-px w-screen -translate-x-1/2 bg-black/8" />
          <div className="pointer-events-none absolute left-1/2 top-1/2 hidden h-px w-screen -translate-x-1/2 -translate-y-1/2 bg-black/8 lg:block" />
          <div className="grid gap-px bg-black/8">
            {AGENT_FEATURES.slice(1, 3).map((feature) => (
              <article
                key={feature.title}
                className="relative min-h-[14rem] bg-white"
              >
                <div className="pointer-events-none absolute left-0 top-0 h-2 w-2 -translate-x-1/2 -translate-y-1/2 bg-black/18" />
                <div className="pointer-events-none absolute right-0 bottom-0 h-2 w-2 translate-x-1/2 translate-y-1/2 bg-black/18" />
                <div className="flex h-full flex-col justify-end p-5 sm:p-6">
                  <div>
                    <h3 className="max-w-sm font-medium text-[1.35rem] leading-tight tracking-[-0.03em] text-black sm:text-[1.55rem]">
                      {feature.title}
                    </h3>
                    <p className="mt-3 max-w-md text-sm leading-relaxed text-black/62 sm:text-[15px]">
                      {feature.body}
                    </p>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <div className="relative min-h-[28rem] overflow-hidden bg-white">
            <div className="pointer-events-none absolute left-0 top-0 h-2 w-2 -translate-x-1/2 -translate-y-1/2 bg-black/18" />
            <div className="pointer-events-none absolute right-0 top-0 h-2 w-2 translate-x-1/2 -translate-y-1/2 bg-black/18" />
            <div className="pointer-events-none absolute left-0 bottom-0 h-2 w-2 -translate-x-1/2 translate-y-1/2 bg-black/18" />
            <div className="pointer-events-none absolute right-0 bottom-0 h-2 w-2 translate-x-1/2 translate-y-1/2 bg-black/18" />
            <div className="absolute inset-0 opacity-[0.08]">
              <div className="h-full w-full bg-[radial-gradient(circle,rgba(0,0,0,0.12)_1px,transparent_1px)] bg-[size:16px_16px]" />
            </div>
            <div className="relative flex h-full items-center justify-center p-5 sm:p-6">
              <div className="relative aspect-square w-full max-w-[21rem]">
                <div className="absolute inset-[10%] rounded-[2.5rem] border border-black/8" />
                <div className="absolute inset-[18%] rounded-[2rem] border border-black/8" />

                <div className="absolute left-1/2 top-1/2 h-[76%] w-px -translate-x-1/2 -translate-y-1/2 bg-black/10" />
                <div className="absolute left-1/2 top-1/2 h-px w-[76%] -translate-x-1/2 -translate-y-1/2 bg-black/10" />
                <div className="absolute left-1/2 top-1/2 h-px w-[88%] -translate-x-1/2 -translate-y-1/2 rotate-[42deg] bg-black/16" />
                <div className="absolute left-1/2 top-1/2 h-px w-[88%] -translate-x-1/2 -translate-y-1/2 -rotate-[42deg] bg-black/16" />

                {[
                  "left-[12%] top-[22%]",
                  "right-[14%] top-[18%]",
                  "left-[20%] bottom-[18%]",
                  "right-[18%] bottom-[24%]",
                ].map((position) => (
                  <div
                    key={position}
                    className={`absolute ${position} grid h-10 w-10 place-items-center rounded-full border border-black/10 bg-white shadow-[0_8px_24px_rgba(0,0,0,0.06)]`}
                  >
                    <span className="h-2.5 w-2.5 rounded-full bg-black/70" />
                  </div>
                ))}

                <div className="absolute inset-0 grid place-items-center">
                  <div className="grid h-24 w-24 place-items-center rounded-[2rem] border border-black/10 bg-white shadow-[0_20px_50px_rgba(0,0,0,0.08)]">
                    <div className="grid h-12 w-12 place-items-center rounded-[1rem] bg-black/[0.05]">
                      <div className="h-4 w-4 rounded-full bg-black/70" />
                    </div>
                  </div>
                </div>

                <div className="pointer-events-none absolute inset-x-[18%] top-1/2 h-px -translate-y-1/2 bg-gradient-to-r from-transparent via-black/8 to-transparent" />
                <div className="pointer-events-none absolute inset-y-[18%] left-1/2 w-px -translate-x-1/2 bg-gradient-to-b from-transparent via-black/8 to-transparent" />
              </div>
            </div>
          </div>

          <div className="grid gap-px bg-black/8">
            {AGENT_FEATURES.slice(3).map((feature) => (
              <article
                key={feature.title}
                className="relative min-h-[14rem] bg-white"
              >
                <div className="pointer-events-none absolute left-0 top-0 h-2 w-2 -translate-x-1/2 -translate-y-1/2 bg-black/18" />
                <div className="pointer-events-none absolute right-0 bottom-0 h-2 w-2 translate-x-1/2 translate-y-1/2 bg-black/18" />
                <div className="flex h-full flex-col justify-end p-5 sm:p-6">
                  <div>
                    <h3 className="max-w-sm font-medium text-[1.35rem] leading-tight tracking-[-0.03em] text-black sm:text-[1.55rem]">
                      {feature.title}
                    </h3>
                    <p className="mt-3 max-w-md text-sm leading-relaxed text-black/62 sm:text-[15px]">
                      {feature.body}
                    </p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   FAQ
   ============================================================ */
export function FAQ() {
  return (
    <section id="faq" className="bg-white px-section py-20 text-black sm:py-28">
      <div className="mx-auto grid max-w-[1480px] gap-12 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.45fr)] lg:gap-16">
        <div className="max-w-md">
          <p className="text-[10px] font-semibold tracking-[0.4em] text-black/45">[ FAQ ]</p>
          <h2 className="mt-5 text-[clamp(2.2rem,4.5vw,4.8rem)] font-display font-normal leading-[0.92] tracking-[-0.04em]">
            Frequently asked questions
          </h2>
          <p className="mt-5 max-w-sm text-body-fluid leading-relaxed text-black/60">
            Everything you need to know about why Conduence exists, who it is for, and how it
            helps you trade with more leverage.
          </p>
        </div>

        <div className="border-t border-black/10">
          {FAQ_ITEMS.map((item) => (
            <details key={item.question} className="group border-b border-black/10">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-6 text-left">
                <span className="text-base font-medium leading-snug text-black sm:text-[1.05rem]">
                  {item.question}
                </span>
                <span className="shrink-0 text-lg leading-none text-black/50 transition-transform duration-200 group-open:rotate-45">
                  +
                </span>
              </summary>
              <div className="pb-6 pr-8 text-sm leading-relaxed text-black/60 sm:text-[15px]">
                {item.answer}
              </div>
            </details>
          ))}
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
    <section id="cta" className="relative bg-black px-6 pt-32 pb-0 text-white">
      <div className="mx-auto max-w-4xl text-center">
        <h2 className="text-5xl sm:text-7xl font-display tracking-tight text-balance">
          Trade with the agents.
          <br />
          <span className="text-white/40">Not against them.</span>
        </h2>
        <p className="mt-8 text-lg text-white/60 max-w-xl mx-auto">
          CONDUENCE is in private beta. Join the waitlist for early access to the Agent Studio and
          Mind Mesh.
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
    <footer className="bg-black px-section pb-8 pt-0 text-white overflow-hidden sm:pb-10">
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

      </div>
    </footer>
  );
}
