import Link from "next/link";

const ACCENT = "#48A8D0";
const INK = "#140206";
const LINE = "rgba(20,2,6,0.12)";
const CREAM = "#F5F4F1";
const FRAME = "border-[2.5px] border-[#140206] shadow-[5px_5px_0_0_#140206]";

const PLANS = [
  {
    name: "Beta",
    eyebrow: "Starter",
    tone: "accent" as const,
    summary: "Open with $100 in credits, then $20 every month.",
    cta: "Get started",
    href: "/#cta",
    includesLabel: "Includes:",
    includes: [
      "$100 in credits to start",
      "$20 each month after that",
      "Mind mesh for your reasoning",
      "Agent Studio, no code",
      "Paper simulator on live data",
      "Trace for every run",
      "Voice, text, or manual mesh",
      "Library of tools and triggers",
    ],
  },
  {
    name: "Pay as you go",
    eyebrow: "Usage",
    tone: "plain" as const,
    summary: "Billed for what you run, with a direct line when the book needs it.",
    cta: "Book an onboarding call",
    href: "/talk-to-founder",
    includesLabel: "Everything in beta, plus:",
    includes: [
      "Usage-based billing",
      "Telegram or Discord",
      "One-on-one onboarding",
      "Priority support",
    ],
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
        <h1 className="m-0 text-center text-[2.45rem] font-normal leading-[0.98] tracking-[-0.02em] [font-family:var(--font-display),Georgia,serif] md:text-[3rem]">
          Pay as you Go
        </h1>
        <p className="m-0 mx-auto mt-4 max-w-4xl text-balance text-center text-[1.15rem] leading-[1.35] text-[#6B6B6B] [font-family:var(--font-display),Georgia,serif] md:text-[1.35rem]">
          Start creating your Second Brain running on the fastest agentic Trading Operating System for Agents
        </p>
      </div>

      <div className="mx-auto w-full max-w-5xl px-6 pb-20 lg:px-8">
        <section id="plans" className="scroll-mt-28">
          <div className="grid grid-cols-1 items-stretch gap-8 md:grid-cols-2">
            {PLANS.map((plan) => (
              <article key={plan.name} className={`flex h-full flex-col bg-white p-4 ${FRAME}`}>
                <div
                  className="relative min-h-[12rem] overflow-hidden p-5 md:px-6 md:py-7"
                  style={{
                    background: plan.tone === "accent" ? "linear-gradient(165deg, #d7f0f8 0%, #48A8D0 100%)" : CREAM,
                  }}
                >
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
              </article>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
