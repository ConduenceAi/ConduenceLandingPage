"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState, type ReactNode } from "react";

import { POST_LOGIN_PATH } from "@/lib/login";

const ACCENT = "#48A8D0";
const INK = "#140206";
const BEIGE = "#F6F3EE";
const BEIGE_LINE = "#E4DDD4";

const STORIES = [
  {
    quote:
      "I am your reasoning and your perception, scaled past every limit.",
    name: "Conduence",
    role: "The trading layer for agents",
    stats: [
      { value: "850 ms", label: "from market event to agent awake" },
      { value: "1.3%", label: "divergence from how you decide" },
    ],
  },
  {
    quote:
      "Agents wake inside your rules, keep diversion under 1.3%, and spend far fewer tokens on the way there.",
    name: "Execution runtime",
    role: "From event to execution",
    stats: [
      { value: "1,250 ms", label: "event to execution" },
      { value: "72.5%", label: "lower token usage" },
    ],
  },
  {
    quote:
      "Teach the system how you think. The mesh is what agents read, not a blank prompt each time.",
    name: "Mind mesh",
    role: "Shape it, then let agents run",
    stats: [
      { value: "70.5%", label: "lower cost to run" },
      { value: "No code", label: "compose the loadout and go" },
    ],
  },
] as const;

const TOP_PIXELS = [
  { right: 0, top: 0, width: 28, height: 28 },
  { right: 56, top: 0, width: 56, height: 28 },
  { right: 28, top: 28, width: 28, height: 28 },
  { right: 112, top: 28, width: 28, height: 28 },
  { right: 0, top: 56, width: 56, height: 28 },
  { right: 84, top: 56, width: 28, height: 28 },
  { right: 28, top: 84, width: 28, height: 28 },
  { right: 0, top: 112, width: 28, height: 28 },
  { right: 56, top: 112, width: 28, height: 28 },
  { right: 0, top: 168, width: 28, height: 28 },
] as const;

const BOTTOM_PIXELS = [
  { right: 28, bottom: 0, width: 28, height: 28 },
  { right: 0, bottom: 28, width: 56, height: 28 },
  { right: 84, bottom: 28, width: 28, height: 28 },
  { right: 28, bottom: 56, width: 28, height: 28 },
  { right: 0, bottom: 84, width: 56, height: 28 },
  { right: 56, bottom: 84, width: 28, height: 28 },
  { right: 0, bottom: 140, width: 28, height: 28 },
] as const;

function Dash() {
  return (
    <div
      className="h-3 flex-1"
      style={{
        backgroundImage: `repeating-linear-gradient(90deg, transparent 0px, transparent 2px, ${BEIGE_LINE} 2px, ${BEIGE_LINE} 3px)`,
      }}
    />
  );
}

function EyeIcon({ open }: { open: boolean }) {
  if (open) {
    return (
      <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
        <path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12Z" />
        <circle cx="12" cy="12" r="2.5" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
      <path d="M3 3l18 18" />
      <path d="M10.6 6.2A10.7 10.7 0 0 1 12 6c6.5 0 10 6 10 6a18 18 0 0 1-3.2 3.8" />
      <path d="M6.1 6.7C3.6 8.4 2 12 2 12s3.5 6 10 6c1.5 0 2.8-.3 4-.8" />
    </svg>
  );
}

export function LoginScreen() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [story, setStory] = useState(0);
  const active = STORIES[story];

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (media.matches) return;

    const timer = window.setInterval(() => {
      setStory((current) => (current + 1) % STORIES.length);
    }, 7000);

    return () => window.clearInterval(timer);
  }, []);

  function continueIn(event?: FormEvent) {
    event?.preventDefault();
    router.push(POST_LOGIN_PATH);
  }

  return (
    <main className="min-h-svh w-full lg:grid lg:grid-cols-2" style={{ background: BEIGE, color: INK }}>
      <section className="flex min-h-svh flex-col px-6 pb-16 pt-28 sm:px-10 sm:pt-32">
        <div className="mx-auto flex w-full max-w-sm flex-1 flex-col justify-center gap-6">
          <div className="grid gap-3">
            <h1 className="font-normal leading-none tracking-[-0.03em] text-[2.6rem] [font-family:var(--font-display),Georgia,serif]">
              Log in
            </h1>
            <p className="mb-1 text-[13px] leading-relaxed text-black/55 [font-family:var(--font-ui),system-ui,sans-serif]">
              Enter your email and password below to log in to your account
            </p>
          </div>

          <form className="w-full space-y-4" onSubmit={continueIn}>
            <input
              className="h-12 w-full border-0 bg-white px-3 text-sm outline-none placeholder:text-black/40 focus-visible:ring-2 focus-visible:ring-[#48A8D0] [font-family:var(--font-ui),system-ui,sans-serif]"
              autoComplete="username"
              placeholder="Email"
              aria-label="Email"
              type="email"
              name="email"
            />
            <div className="relative">
              <input
                className="h-12 w-full border-0 bg-white px-3 pr-10 text-sm outline-none placeholder:text-black/40 focus-visible:ring-2 focus-visible:ring-[#48A8D0] [font-family:var(--font-ui),system-ui,sans-serif]"
                autoComplete="current-password"
                placeholder="Password"
                aria-label="Password"
                type={showPassword ? "text" : "password"}
                name="password"
              />
              <button
                className="absolute inset-y-0 right-0 flex items-center px-3 text-black/35 hover:text-black"
                type="button"
                onClick={() => setShowPassword((open) => !open)}
              >
                <EyeIcon open={showPassword} />
                <span className="sr-only">{showPassword ? "Hide password" : "Show password"}</span>
              </button>
            </div>
            <p className="pt-1 text-center">
              <a
                className="text-[12px] uppercase tracking-[0.08em] text-black/50 underline underline-offset-2 hover:text-black [font-family:var(--font-ui),system-ui,sans-serif]"
                href="mailto:contact@conduence.xyz?subject=Password%20reset"
              >
                Forgot your password?
              </a>
            </p>
            <button
              className="h-10 w-full border-[2.5px] border-[#140206] text-[12px] font-medium uppercase tracking-[0.14em] text-[#140206] shadow-[5px_5px_0_0_#140206] transition-colors hover:bg-[#3b96bc] [font-family:var(--font-ui),system-ui,sans-serif]"
              style={{ background: ACCENT }}
              type="submit"
            >
              Log in
            </button>
          </form>

          <div className="flex items-center gap-3">
            <Dash />
            <span className="text-[11px] uppercase tracking-[0.16em] text-black/45 [font-family:var(--font-ui),system-ui,sans-serif]">
              or
            </span>
            <Dash />
          </div>

          <div className="grid gap-3">
            <ProviderButton label="Continue with Google" onClick={() => continueIn()}>
              <GoogleMark />
            </ProviderButton>
            <ProviderButton label="Continue with Apple" onClick={() => continueIn()}>
              <AppleMark />
            </ProviderButton>
            <ProviderButton label="Continue with SSO" onClick={() => continueIn()}>
              <SsoMark />
            </ProviderButton>
          </div>

          <p className="text-center text-[12px] uppercase tracking-[0.08em] text-black/50 [font-family:var(--font-ui),system-ui,sans-serif]">
            Don’t have an account?{" "}
            <button
              type="button"
              onClick={() => continueIn()}
              className="uppercase underline underline-offset-2 text-[#12597A]"
            >
              Sign up
            </button>
          </p>
        </div>
      </section>

      <section className="relative hidden min-h-svh border-l lg:block" style={{ borderColor: BEIGE_LINE, background: BEIGE }}>
        <div className="pointer-events-none absolute inset-0" aria-hidden>
          {TOP_PIXELS.map((pixel) => (
            <span
              key={`t-${pixel.top}-${pixel.right}`}
              className="absolute"
              style={{ right: pixel.right, top: pixel.top, width: pixel.width, height: pixel.height, background: ACCENT }}
            />
          ))}
          {BOTTOM_PIXELS.map((pixel) => (
            <span
              key={`b-${pixel.bottom}-${pixel.right}`}
              className="absolute"
              style={{ right: pixel.right, bottom: pixel.bottom, width: pixel.width, height: pixel.height, background: ACCENT }}
            />
          ))}
        </div>

        <div className="relative mx-auto flex h-full w-full max-w-xl flex-col justify-center gap-6 px-10 py-12">
          <p className="max-w-md text-[11px] uppercase leading-relaxed tracking-[0.14em] text-black/50 [font-family:var(--font-ui),system-ui,sans-serif]">
            The fastest agentic operating system for traders and agents
          </p>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-[1.15rem] text-black/75 [font-family:var(--font-display),Georgia,serif]">
            <span>Microsoft</span>
            <span>Amazon</span>
            <span>NVIDIA</span>
          </div>

          <section className="flex flex-col border-[2.5px] border-[#140206] bg-white p-8 pb-6 shadow-[5px_5px_0_0_#140206]" aria-label="Platform stories">
            <p
              key={active.name}
              className="min-h-[7.5rem] text-[1.35rem] font-normal leading-relaxed [font-family:var(--font-display),Georgia,serif]"
            >
              “{active.quote}”
            </p>
            <div className="mt-4">
              <p className="text-[11px] uppercase tracking-[0.14em] [font-family:var(--font-ui),system-ui,sans-serif]">
                {active.name}
              </p>
              <p className="mt-0.5 text-[12px] text-black/50 [font-family:var(--font-ui),system-ui,sans-serif]">
                {active.role}
              </p>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3">
              {active.stats.map((stat) => (
                <div key={stat.value} className="flex h-[4.5rem] flex-col justify-center border border-dashed border-black/30 px-4">
                  <p className="text-[1.65rem] font-normal leading-none [font-family:var(--font-display),Georgia,serif]">
                    {stat.value}
                  </p>
                  <p className="mt-1.5 text-[11px] leading-snug text-black/50 [font-family:var(--font-ui),system-ui,sans-serif]">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
            <div className="mt-4 flex items-center gap-2">
              {STORIES.map((item, index) => (
                <button
                  key={item.name}
                  type="button"
                  aria-label={`${item.name} story`}
                  aria-current={index === story}
                  onClick={() => setStory(index)}
                  className="size-3 border border-black"
                  style={{ background: index === story ? ACCENT : "#EFEAE3" }}
                />
              ))}
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}

function ProviderButton({
  label,
  onClick,
  children,
}: {
  label: string;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex h-10 w-full items-center justify-center gap-2 border-[2.5px] border-[#140206] bg-white text-[12px] font-medium uppercase tracking-[0.12em] text-black shadow-[5px_5px_0_0_#140206] transition-colors hover:bg-[#f4f1ea] [font-family:var(--font-ui),system-ui,sans-serif]"
    >
      {children}
      <span>{label}</span>
    </button>
  );
}

function GoogleMark() {
  return (
    <svg viewBox="0 0 24 24" className="size-4" aria-hidden>
      <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.4h6.5c-.3 1.5-1.1 2.8-2.4 3.6v3h3.9c2.3-2.1 3.5-5.2 3.5-8.7z" />
      <path fill="#34A853" d="M12 24c3.2 0 5.9-1.1 7.9-2.9l-3.9-3c-1.1.7-2.4 1.2-4 1.2-3.1 0-5.7-2.1-6.6-4.9H1.4v3.1C3.4 21.3 7.4 24 12 24z" />
      <path fill="#FBBC05" d="M5.4 14.4A7.2 7.2 0 0 1 5 12c0-.8.1-1.6.4-2.4V6.5H1.4A12 12 0 0 0 0 12c0 1.9.5 3.8 1.4 5.5l4-3.1z" />
      <path fill="#EA4335" d="M12 4.8c1.7 0 3.3.6 4.5 1.8l3.4-3.4C17.9 1.1 15.2 0 12 0 7.4 0 3.4 2.7 1.4 6.5l4 3.1C6.3 6.8 8.9 4.8 12 4.8z" />
    </svg>
  );
}

function AppleMark() {
  return (
    <svg viewBox="0 0 24 24" className="size-4" fill="currentColor" aria-hidden>
      <path d="M16.4 12.6c0-2.3 1.9-3.4 2-3.5-1.1-1.6-2.8-1.8-3.4-1.8-1.4-.2-2.8.9-3.5.9s-1.8-.8-3-.8c-1.5 0-3 .9-3.8 2.3-1.6 2.8-.4 7 1.2 9.3.8 1.1 1.7 2.3 2.9 2.3 1.2 0 1.6-.7 3-.7s1.8.7 3 .7 2-.1 2.9-2.2c1.1-1.5 1.5-3 1.5-3.1-.1 0-2.8-1.1-2.8-4.4zM14.7 6.2c.6-.8 1.1-1.9.9-3-1 .1-2.1.6-2.8 1.4-.6.7-1.2 1.8-.9 2.9 1.1.1 2.1-.5 2.8-1.3z" />
    </svg>
  );
}

function SsoMark() {
  return (
    <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden>
      <path d="M12 3l7 3v6c0 4.2-2.8 7.2-7 8.5C7.8 19.2 5 16.2 5 12V6l7-3z" />
      <path d="M9 12l2 2 4-4" />
    </svg>
  );
}
