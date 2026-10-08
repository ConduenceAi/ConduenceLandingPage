"use client";

import type { FormEvent } from "react";
import { useState } from "react";
import { logoWhiteSrc } from "@/lib/assets";
import { CubeAssembly } from "@/components/landing/CubeAssembly";
import { SocialLinks } from "@/components/landing/SocialLinks";

/* ============================================================
   REASONING  — platform overview
   ============================================================ */
const REASONING_ITEMS = [
  {
    title: "Memory Plane",
    body: "Conduence turns your trading mind into the system agents run on. Long term memory carries reasoning across decisions. Short term instructions keep each trade sharp and on track. Your knowledge stays user-scoped and securely hosted.",
  },
  {
    title: "Capability Registry",
    body: "Conduence is the aggregation layer for your agent, bringing the best tools together, combining their strengths, and delivering richer, more actionable context. Tools are only as useful as the instructions behind them. Agent just chooses and combines the right tools for each trade.",
  },
  {
    title: "Execution Runtime",
    body: "Conduence coordinates the full path from event to execution. Agents wake within 850 ms, act within your rules, and maintain a divergence of 1.3%. Our runtime also reduces LLM token usage by 70.5%.",
  },
];

export function Reasoning() {
  return (
    <section
      id="core-insight"
      className="relative overflow-hidden bg-white px-[5%] pt-[clamp(3rem,7vw,6rem)] pb-0 text-black"
    >
      <div className="mx-auto grid max-w-[1480px] gap-[clamp(2rem,4vw,4rem)] lg:grid-cols-2 lg:items-start">
        {/* Left half — title + cube */}
        <div>
          <h2 className="max-w-3xl text-display-lede font-normal leading-[1.12] tracking-[-0.03em] [font-family:var(--font-display),Georgia,serif]">
            Trading Layer for Agents
          </h2>

          <div className="relative mx-auto mt-[clamp(1.5rem,3vw,2rem)] w-full max-w-[min(34rem,100%)] lg:mx-0">
            <CubeAssembly className="aspect-[13/16] w-full min-h-[clamp(16rem,55vw,28rem)]" />
          </div>
        </div>

        {/* Right half — feature texts */}
        <div className="lg:pt-[clamp(2rem,4vw,3.5rem)]">
          {REASONING_ITEMS.map((item, index) => (
            <article
              key={item.title}
              className="relative border-black/10 py-[clamp(1.15rem,2.5vw,1.5rem)] not-last:border-b"
            >
              <span
                className="pointer-events-none absolute -left-1 top-3 select-none font-display text-[clamp(2.75rem,6vw,5.5rem)] font-medium leading-none tracking-[-0.06em] text-black/[0.055] sm:-left-2 sm:top-2"
                aria-hidden="true"
              >
                {index + 1}
              </span>
              <div className="relative max-w-2xl pl-[clamp(2.5rem,5.5vw,4.25rem)]">
                <h3 className="text-heading-block max-w-2xl font-normal leading-tight tracking-[-0.035em] text-black [font-family:var(--font-display),Georgia,serif]">
                  {item.title}
                </h3>
                <p className="text-body-fluid mt-[clamp(0.65rem,1.2vw,0.75rem)] max-w-2xl leading-relaxed text-black/85 [font-family:var(--font-display),Georgia,serif]">
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
      className="relative flex flex-col overflow-hidden bg-black px-[clamp(1rem,4vw,1.5rem)] pb-0 pt-[clamp(3.5rem,8vw,8rem)] text-white/88 sm:min-h-svh"
    >
      <div className="mx-auto w-full max-w-4xl shrink-0 text-center">
        <h2 className="text-display-cta font-display tracking-tight text-balance">
          Trade with the agents
          <br />
          <span className="text-[#48A8D0]">Not against them</span>
        </h2>
        <p className="text-body-large mx-auto mt-[clamp(1.25rem,3vw,2rem)] max-w-xl text-white/72">
          CONDUENCE is in private beta. Join the waitlist for early access to the Agent Studio and
          Mind Mesh.
        </p>
        <form
          className="mx-auto mt-[clamp(1.5rem,3.5vw,2.5rem)] flex max-w-md flex-col gap-3 sm:flex-row"
          onSubmit={handleSubmit}
        >
          <input
            type="email"
            name="email"
            placeholder="you@strategy.io"
            aria-label="Email address"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="flex-1 border-2 border-white bg-transparent px-[clamp(1rem,2vw,1.25rem)] py-[clamp(0.65rem,1.2vw,0.75rem)] text-[clamp(0.8rem,0.3vw+0.7rem,0.875rem)] text-white/88 placeholder:text-white/40 focus:outline-none"
          />
          <button
            type="submit"
            disabled={status === "loading"}
            className="border-2 border-white bg-[#48A8D0] px-[clamp(1.25rem,2.5vw,1.5rem)] py-[clamp(0.65rem,1.2vw,0.75rem)] text-[clamp(0.8rem,0.3vw+0.7rem,0.875rem)] font-semibold text-black transition hover:bg-[#3b96bc] disabled:cursor-not-allowed disabled:opacity-70"
          >
            {status === "loading" ? "Reserving..." : "Reserve seat"}
          </button>
        </form>
        {message ? (
          <p
            className={`mt-4 text-body-fluid ${status === "success" ? "text-emerald-300" : "text-red-300"}`}
          >
            {message}
          </p>
        ) : null}
      </div>

      <div className="mt-[clamp(2.5rem,6vw,4rem)] w-full leading-none sm:mt-auto sm:px-section sm:pb-0">
        <SocialLinks className="mb-[clamp(1.75rem,5vw,3.25rem)] pt-[clamp(2rem,5vw,3.5rem)]" />
        <div className="mx-auto w-full max-w-[clamp(10rem,40vw,15rem)] overflow-hidden pb-[30px] sm:max-w-[min(1400px,92vw)]">
          <img
            src={logoWhiteSrc}
            alt="CONDUENCE"
            className="mb-[-9%] block h-auto w-full select-none"
            draggable={false}
          />
        </div>
      </div>
    </section>
  );
}
