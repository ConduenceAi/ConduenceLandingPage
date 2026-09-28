import Link from "next/link";

import { siteTagline } from "@/lib/site";

const ACCENT = "#48A8D0";
const INK = "#140206";
const MUTED = "#6B6B6B";
const LINE = "rgba(20,2,6,0.12)";
const CREAM = "#F5F4F1";
const FRAME = "border-[2.5px] border-[#140206] shadow-[5px_5px_0_0_#140206]";

const PLANS = [
  {
    name: "Beta",
    eyebrow: "Starter",
    tone: "accent" as const,
    summary: "A seat in the private beta. No payment method. You train the mesh and run agents in paper.",
    cta: "Join the waitlist",
    href: "#cta",
    includesLabel: "Includes",
    includes: [
      "Mind mesh for your reasoning",
      "Agent Studio, no code",
      "Paper simulator on live data",
      "Trace for every run",
      "Voice, text, or manual mesh",
      "Library of tools and triggers",
    ],
    extraLabel: "Runtime",
    extra: ["Event to awake in about 850 ms", "User-scoped memory", "Guardrails you author"],
  },
  {
    name: "Founder access",
    eyebrow: "Operator",
    tone: "plain" as const,
    summary: "A working session with the founder to wire a real workflow, from thesis to paper to live.",
    cta: "Talk to the founder",
    href: "/talk-to-founder",
    includesLabel: "Everything in beta, plus",
    includes: [
      "30-minute founder call",
      "Loadout review for your book",
      "Telegram or Discord approvals",
      "Priority on the early runtime",
    ],
    extraLabel: "Support",
    extra: ["Help shaping the first agents", "A path from paper to live"],
  },
  {
    name: "Custom",
    eyebrow: "Enterprise",
    tone: "plain" as const,
    shimmer: true,
    summary: "For a desk that needs its own bounds, connectors, and a runtime shaped around the book.",
    cta: "Talk to us",
    href: "/talk-to-founder",
    includesLabel: "Everything in founder access, plus",
    includes: [
      "Org-level authority and approvals",
      "Custom connectors",
      "Dedicated onboarding",
      "Runtime shaped to your constraints",
    ],
    extraLabel: "Controls",
    extra: ["Your data stays in your scope", "A single place to audit the path"],
  },
] as const;

function Check() {
  return (
    <svg viewBox="0 0 24 24" className="mt-0.5 size-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

function FeatureList({ label, items }: { label: string; items: readonly string[] }) {
  return (
    <div className="mt-6 border-t pt-5" style={{ borderColor: LINE }}>
      <p className="m-0 text-[0.95rem] text-[#8A8A8A] [font-family:var(--font-ui),system-ui,sans-serif]">{label}</p>
      <ul className="m-0 mt-3 flex list-none flex-col gap-2 p-0">
        {items.map((item) => (
          <li key={item} className="flex items-start gap-3 text-[0.98rem] leading-snug">
            <Check />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function PricingPage() {
  return (
    <main className="bg-white text-black">
      <div className="mx-auto w-full max-w-7xl px-6 pb-8 pt-28 md:pt-36 lg:px-8">
        <h1 className="m-0 text-center text-[2.45rem] font-normal leading-[0.98] tracking-[-0.02em] [font-family:var(--font-display),Georgia,serif] md:text-left md:text-[3rem]">
          Agents that trade like you
        </h1>
        <p className="m-0 mt-4 max-w-2xl text-center text-[1.15rem] leading-[1.35] md:text-left" style={{ color: MUTED }}>
          {siteTagline}
        </p>
        <Link
          href="#cta"
          className={`mt-6 inline-flex min-w-[12rem] items-center justify-center px-7 py-2.5 text-[0.92rem] font-medium transition-colors hover:bg-[#3b96bc] [font-family:var(--font-ui),system-ui,sans-serif] ${FRAME}`}
          style={{ background: ACCENT, color: INK }}
        >
          Get started
        </Link>
      </div>

      <div className="mx-auto w-full max-w-7xl px-6 pb-20 lg:px-8">
        <section id="plans" className="scroll-mt-28">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {PLANS.map((plan) => (
              <article key={plan.name} className={`flex flex-col bg-white p-4 ${FRAME}`}>
                <div
                  className="relative min-h-[12rem] overflow-hidden p-5 md:px-6 md:py-7"
                  style={{
                    background: plan.tone === "accent" ? "linear-gradient(165deg, #d7f0f8 0%, #48A8D0 100%)" : CREAM,
                  }}
                >
                  {"shimmer" in plan && plan.shimmer ? <Shimmer /> : null}
                  <p className="relative m-0 mb-2 text-[0.8rem] font-medium uppercase tracking-[0.08em] text-black/55 [font-family:var(--font-ui),system-ui,sans-serif]">
                    {plan.eyebrow}
                  </p>
                  <h2 className="relative m-0 text-[2.15rem] font-normal leading-none tracking-[-0.04em] [font-family:var(--font-display),Georgia,serif] md:text-[2.35rem]">
                    {plan.name}
                  </h2>
                  <p className="relative m-0 mt-3 max-w-[22rem] text-[0.9rem] leading-[1.45] text-black/70 [font-family:var(--font-ui),system-ui,sans-serif]">
                    {plan.summary}
                  </p>
                </div>
                <Link
                  href={plan.href}
                  className={`mt-4 inline-flex w-full items-center justify-center px-5 py-2.5 text-center text-[0.9rem] font-medium transition-colors hover:bg-[#3b96bc] [font-family:var(--font-ui),system-ui,sans-serif] ${FRAME}`}
                  style={{ background: ACCENT, color: INK }}
                >
                  {plan.cta}
                </Link>
                <FeatureList label={plan.includesLabel} items={plan.includes} />
                <FeatureList label={plan.extraLabel} items={plan.extra} />
              </article>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}

function Shimmer() {
  return (
    <span
      aria-hidden
      className="pointer-events-none absolute inset-0"
      style={{
        padding: 2,
        background: CREAM,
        WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
        WebkitMaskComposite: "xor",
        maskComposite: "exclude",
        overflow: "hidden",
      }}
    >
      <span
        className="absolute -left-1/2 -top-1/2 h-[200%] w-[200%] motion-reduce:hidden"
        style={{
          background: "linear-gradient(135deg, transparent 40%, rgba(72,168,208,0.85) 58%, transparent 74%)",
          animation: "cdn-price-shimmer 5.2s ease-in-out infinite",
        }}
      />
      <style>{`
        @keyframes cdn-price-shimmer {
          0%, 8% { transform: translate(-58%, -58%); }
          92%, 100% { transform: translate(58%, 58%); }
        }
      `}</style>
    </span>
  );
}
