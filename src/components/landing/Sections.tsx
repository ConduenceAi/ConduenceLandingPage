"use client";

import type { FormEvent } from "react";
import { useState } from "react";
import { logoWhiteSrc } from "@/lib/assets";
import { CubeAssembly } from "@/components/landing/CubeAssembly";
import { VoiceOrb } from "@/components/landing/VoiceOrb";

/* ============================================================
   REASONING  — platform overview
   ============================================================ */
const REASONING_ITEMS = [
  {
    title: "MCP Server - Unified Tools",
    body: "Bring research inputs, market data, execution surfaces, and the tools you already rely on into one place, so your agents can operate with the full context at their fingertips.",
  },
  {
    title: "Mind Mesh - Second Brain",
    body: "Use voice to interact with your second brain, explore opportunities, monitor workflows, and deploy AI agents through natural commands instead of manual coordination.",
  },
  {
    title: "Post-mortem",
    body: "Capture your memory, perspective, and reasoning so the system does not forget how you think. Your logic compounds over time instead of getting lost between trades.",
  },
];

export function Reasoning() {
  return (
    <section
      id="core-insight"
      className="relative overflow-hidden bg-white px-[5%] pt-16 pb-0 text-black sm:pt-20 md:pt-24"
    >
      <div className="mx-auto grid max-w-[1480px] gap-12 lg:grid-cols-2 lg:items-start lg:gap-16">
        {/* Left half — title + cube */}
        <div>
          <h2 className="max-w-3xl text-display-pillar font-display leading-[1.05] tracking-tight">
            The unif<span className="ml-[0.05em] inline-block">ied</span> platform
          </h2>

          <div className="relative mx-auto mt-8 w-full max-w-[34rem] lg:mx-0">
            <CubeAssembly className="aspect-[13/16] w-full min-h-[22rem] sm:min-h-[28rem]" />
          </div>
        </div>

        {/* Right half — feature texts */}
        <div className="lg:pt-5">
          {REASONING_ITEMS.map((item, index) => (
            <article
              key={item.title}
              className="relative border-black/10 py-6 not-last:border-b"
            >
              <span
                className="pointer-events-none absolute -left-1 top-3 select-none font-display text-[clamp(3.5rem,7vw,5.5rem)] font-medium leading-none tracking-[-0.06em] text-black/[0.055] sm:-left-2 sm:top-2"
                aria-hidden="true"
              >
                {index + 1}
              </span>
              <div className="relative max-w-2xl pl-[clamp(2.75rem,5.5vw,4.25rem)]">
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
    </section>
  );
}

const AGENT_FEATURES = [
  {
    title: "Make the most out of Voice",
    body: "Monitor agents, explore markets, train your system, and orchestrate execution from one voice-native surface.",
  },
  {
    title: "Trading in your pocket",
    body: "Conduence is a voice-first trading app that lets you monitor agents, review performance, and track open trades from anywhere.",
  },
  {
    title: "Idea to execution",
    body: "Ask about markets, evaluate opportunities together, and execute trades on platforms like Polymarket or Kalshi — all through voice.",
  },
  {
    title: "Teach it how you think",
    body: "Use voice to teach Conduence your reasoning, preferences, and trading approach so it can better mirror how you make decisions.",
  },
  {
    title: "Workflows by voice",
    body: "Build and orchestrate powerful AI agent systems, connect tools and APIs, and automate workflows without needing anything beyond your voice.",
  },
];

/* ============================================================
   AGENTS FEATURES
   ============================================================ */
export function AgentsScroll() {
  return (
    <section id="agents" className="relative overflow-hidden bg-white px-[5%] pt-14 text-black sm:pt-20">
      <div className="relative mx-auto max-w-[1480px] pb-20 sm:pb-44">
        <div className="grid gap-4 pb-6">
          <div className="mx-auto text-center">
            <h2 className="mt-3 max-w-4xl text-display-pillar font-display leading-[1.05] tracking-tight">
              <span className="block text-black">Make the most</span>
              <span className="block font-display text-black/35">out of Voice</span>
            </h2>
          </div>
        </div>

        <div className="relative mt-4 grid grid-cols-1 gap-px border border-black/8 bg-black/8 lg:grid-cols-3">
          <div className="pointer-events-none absolute left-1/2 top-0 h-px w-screen -translate-x-1/2 bg-black/8" />
          <div className="pointer-events-none absolute bottom-0 left-1/2 h-px w-screen -translate-x-1/2 bg-black/8" />
          <div className="pointer-events-none absolute left-1/2 top-1/2 hidden h-px w-screen -translate-x-1/2 -translate-y-1/2 bg-black/8 lg:block" />
          <div className="grid gap-px bg-black/8">
            {AGENT_FEATURES.slice(1, 3).map((feature) => (
              <article key={feature.title} className="relative min-h-[14rem] bg-white">
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
              <VoiceOrb demo className="relative aspect-square w-full max-w-[14rem]" />
            </div>
          </div>

          <div className="grid gap-px bg-black/8">
            {AGENT_FEATURES.slice(3).map((feature) => (
              <article key={feature.title} className="relative min-h-[14rem] bg-white">
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
   CTA
   ============================================================ */
export function CTA() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");
    setMessage("");

    try {
      const response = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = (await response.json()) as { error?: string };

      if (!response.ok) {
        throw new Error(data.error ?? "Unable to join the waitlist right now.");
      }

      setStatus("success");
      setMessage("You're on the waitlist. Check your inbox for confirmation.");
      setEmail("");
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Unable to join the waitlist right now.");
    }
  }

  return (
    <section
      id="cta"
      className="relative flex min-h-svh flex-col bg-black px-6 pb-0 pt-24 text-white sm:pt-28 md:pt-32"
    >
      <div className="mx-auto w-full max-w-4xl shrink-0 text-center">
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
          onSubmit={handleSubmit}
        >
          <input
            type="email"
            name="email"
            placeholder="you@strategy.io"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="flex-1 rounded-full border border-white/30 bg-transparent px-5 py-3 text-sm text-white placeholder:text-white/40 focus:outline-none focus:ring-1 focus:ring-white"
          />
          <button
            type="submit"
            disabled={status === "loading"}
            className="rounded-full bg-white text-black px-6 py-3 text-sm font-semibold transition hover:bg-white/90 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {status === "loading" ? "Reserving..." : "Reserve seat"}
          </button>
        </form>
        {message ? (
          <p
            className={`mt-4 text-sm ${status === "success" ? "text-emerald-300" : "text-red-300"}`}
          >
            {message}
          </p>
        ) : null}
      </div>

      <div className="mt-auto w-full px-section leading-none">
        <div className="mx-auto max-w-[1600px] overflow-hidden">
          <img
            src={logoWhiteSrc}
            alt="CONDUENCE"
            className="mx-auto block h-auto w-full max-w-[1400px] -mb-8 select-none sm:-mb-10"
            draggable={false}
          />
        </div>
      </div>
    </section>
  );
}
