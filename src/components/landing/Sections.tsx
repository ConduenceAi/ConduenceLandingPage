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
    body: "Shape and Brainstorm turn how you think into a second brain—stress-test theses with agents that already know your perspective, then lock the final version so it compounds across every future decision.",
  },
  {
    title: "One surface for every tool",
    body: "Conduence aggregates research inputs, market data, execution surfaces, and the tools you already rely on into one place, so you don’t have to stitch them together. Your agents operate with the full context at their fingertips.",
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
      className="relative overflow-hidden bg-white px-[5%] pt-[clamp(3rem,7vw,6rem)] pb-0 text-black"
    >
      <div className="mx-auto grid max-w-[1480px] gap-[clamp(2rem,4vw,4rem)] lg:grid-cols-2 lg:items-start">
        {/* Left half — title + cube */}
        <div>
          <h2 className="max-w-3xl text-display-lede font-normal leading-[1.12] tracking-[-0.03em] [font-family:var(--font-display),Georgia,serif]">
            The unified platform
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
      className="relative flex flex-col overflow-hidden bg-black px-[clamp(1rem,4vw,1.5rem)] pb-[clamp(2rem,4vw,2.5rem)] pt-[clamp(3.5rem,8vw,8rem)] text-white sm:min-h-svh sm:pb-0"
    >
      <div className="mx-auto w-full max-w-4xl shrink-0 text-center">
        <h2 className="text-display-cta font-display tracking-tight text-balance">
          Trade with the agents.
          <br />
          <span className="text-white/40">Not against them.</span>
        </h2>
        <p className="text-body-large mx-auto mt-[clamp(1.25rem,3vw,2rem)] max-w-xl text-white/85">
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
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="flex-1 rounded-full border border-white/30 bg-transparent px-[clamp(1rem,2vw,1.25rem)] py-[clamp(0.65rem,1.2vw,0.75rem)] text-[clamp(0.8rem,0.3vw+0.7rem,0.875rem)] text-white placeholder:text-white/40 focus:outline-none focus:ring-1 focus:ring-white"
          />
          <button
            type="submit"
            disabled={status === "loading"}
            className="rounded-full bg-white px-[clamp(1.25rem,2.5vw,1.5rem)] py-[clamp(0.65rem,1.2vw,0.75rem)] text-[clamp(0.8rem,0.3vw+0.7rem,0.875rem)] font-semibold text-black transition hover:bg-white/90 disabled:cursor-not-allowed disabled:opacity-70"
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

      <div className="mt-[clamp(2rem,5vw,3rem)] w-full leading-none sm:mt-auto sm:px-section sm:pb-0">
        <div className="mx-auto max-w-[1600px]">
          <img
            src={logoWhiteSrc}
            alt="CONDUENCE"
            className="mx-auto block h-auto w-full max-w-[clamp(10rem,40vw,15rem)] select-none sm:max-w-[min(1400px,92vw)]"
            draggable={false}
          />
        </div>
      </div>
    </section>
  );
}
