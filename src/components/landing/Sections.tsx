"use client";

import type { FormEvent } from "react";
import { useState } from "react";
import { logoWhiteSrc } from "@/lib/assets";
import { CubeAssembly } from "@/components/landing/CubeAssembly";

/* ============================================================
   REASONING  — platform overview
   ============================================================ */
const REASONING_ITEMS = [
  {
    title: "Mind Mesh",
    body: "Use voice to interact with your second brain, explore opportunities, monitor workflows, and deploy AI agents through natural commands instead of manual coordination.",
  },
  {
    title: "One surface for every tool",
    body: "Bring research inputs, market data, execution surfaces, and the tools you already rely on into one place, so your agents can operate with the full context at their fingertips.",
  },
  {
    title: "Logic that compounds",
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
            <article key={item.title} className="relative border-black/10 py-6 not-last:border-b">
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

      let data: { error?: string } = {};
      const contentType = response.headers.get("content-type") ?? "";

      if (contentType.includes("application/json")) {
        data = (await response.json()) as { error?: string };
      }

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
      className="relative flex flex-col overflow-hidden bg-black px-6 pb-10 pt-20 text-white sm:min-h-svh sm:pb-0 sm:pt-28 md:pt-32"
    >
      <div className="mx-auto w-full max-w-4xl shrink-0 text-center">
        <h2 className="text-4xl font-display tracking-tight text-balance sm:text-5xl md:text-7xl">
          Trade with the agents.
          <br />
          <span className="text-white/40">Not against them.</span>
        </h2>
        <p className="mt-6 text-base text-white/60 max-w-xl mx-auto sm:mt-8 sm:text-lg">
          CONDUENCE is in private beta. Join the waitlist for early access to the Agent Studio and
          Mind Mesh.
        </p>
        <form
          className="mt-8 flex flex-col sm:mt-10 sm:flex-row gap-3 max-w-md mx-auto"
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

      <div className="mt-12 w-full leading-none sm:mt-auto sm:px-section sm:pb-0">
        <div className="mx-auto max-w-[1600px]">
          <img
            src={logoWhiteSrc}
            alt="CONDUENCE"
            className="mx-auto block h-auto w-full max-w-[15rem] select-none sm:max-w-[1400px]"
            draggable={false}
          />
        </div>
      </div>
    </section>
  );
}
