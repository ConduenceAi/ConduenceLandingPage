"use client";

import { useMotionValueEvent, useScroll } from "framer-motion";
import { useLayoutEffect, useRef, useState } from "react";

const SCROLL_VH = 4.2;

const SECTION_X = "clamp(1rem,4vw,2.5rem)";
const DISPLAY = '[font-family:var(--font-display),Georgia,"Times New Roman",serif]';

const TRADER_LINE = "Traders may not live forever, but how they trade will.";

type DissolveParticle = {
  char: string;
  angle: number;
  spread: number;
  delay: number;
  spin: number;
  drift: number;
};

/** Per-character burst field — radial from sentence centroid */
const DISSOLVE_PARTICLES: DissolveParticle[] = TRADER_LINE.split("").map((char, i, arr) => {
  const center = (arr.length - 1) / 2;
  const offset = (i - center) / arr.length;
  const isLastWord = i >= arr.length - 5;

  return {
    char: char === " " ? "\u00a0" : char,
    angle: offset * Math.PI * 2.15 + (i % 7) * 0.09,
    spread: 0.75 + (i % 5) * 0.14,
    delay: isLastWord ? 0.28 + (i - (arr.length - 5)) * 0.04 : (i / arr.length) * 0.22,
    spin: ((i % 6) - 2.5) * 14,
    drift: 0.35 + (i % 4) * 0.12,
  };
});

/** Hold → accelerate outward → dissolve into black */
function burstPhase(t: number) {
  if (t <= 0.1) return 0;
  const u = clamp01((t - 0.1) / 0.9);
  return 1 - Math.pow(1 - u, 3.2);
}

function dissolvePhase(t: number) {
  if (t <= 0.32) return 0;
  const u = clamp01((t - 0.32) / 0.68);
  return u * u * (3 - 2 * u);
}

function tensionPhase(t: number) {
  if (t <= 0) return 0;
  if (t >= 0.18) return 1;
  return t / 0.18;
}

function particleProgress(scatter: number, delay: number) {
  if (scatter <= delay) return 0;
  return clamp01((scatter - delay) / (1 - delay));
}

function clamp01(v: number) {
  return Math.max(0, Math.min(1, v));
}

function mapRange(p: number, inStart: number, inEnd: number, outStart: number, outEnd: number) {
  const t = clamp01((p - inStart) / (inEnd - inStart));
  return outStart + (outEnd - outStart) * t;
}

function weightFromProgress(t: number): number {
  const clamped = clamp01(t);
  if (clamped < 0.25) return 400 + (clamped / 0.25) * 100;
  if (clamped < 0.5) return 500 + ((clamped - 0.25) / 0.25) * 200;
  if (clamped < 0.75) return 700 + ((clamped - 0.5) / 0.25) * 200;
  return 900;
}

function EditorialType({
  children,
  className = "",
  style,
}: {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div
      className={`transition-[letter-spacing] duration-500 ease-out hover:tracking-[0.04em] ${className}`}
      style={style}
    >
      {children}
    </div>
  );
}

function ScatteringTraderLine({ scatter }: { scatter: number }) {
  const tension = tensionPhase(scatter);

  return (
    <p
      className="relative mt-6 max-w-2xl text-center text-[clamp(0.9375rem,0.35vw+0.875rem,1.125rem)] leading-relaxed"
      aria-label={TRADER_LINE}
    >
      {/* Soft energy bloom as sentence pressurizes */}
      <span
        className="pointer-events-none absolute left-1/2 top-1/2 h-24 w-[min(28rem,80vw)] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/[0.04] blur-2xl"
        aria-hidden="true"
        style={{
          opacity: tension * (1 - burstPhase(scatter)),
          transform: `translate(-50%, -50%) scale(${1 + tension * 0.35})`,
        }}
      />

      <span
        className="relative inline-flex flex-wrap justify-center gap-x-[0.02em]"
        style={{ letterSpacing: `${tension * 0.14}em` }}
        aria-hidden="true"
      >
        {DISSOLVE_PARTICLES.map((particle, i) => {
          const t = particleProgress(scatter, particle.delay);
          const burst = burstPhase(t);
          const dissolve = dissolvePhase(t);
          const radius = burst * particle.spread * 7.5;
          const x = Math.cos(particle.angle) * radius;
          const y = Math.sin(particle.angle) * radius + burst * particle.drift * 2.2;
          const rot = particle.spin * burst;
          const opacity = (1 - dissolve) * (1 - burst * 0.12);
          const blur = dissolve * 10 + burst * 1.5;
          const scale = 1 + tension * 0.06 - dissolve * 0.55 - burst * 0.08;

          return (
            <span key={`${particle.char}-${i}`} className="relative inline-block">
              {/* Trailing ghost — particle shedding */}
              {burst > 0.08 && (
                <span
                  className="pointer-events-none absolute inset-0 text-white/25"
                  style={{
                    opacity: (1 - dissolve) * 0.45,
                    filter: `blur(${blur * 0.6}px)`,
                    transform: `translate(${x * 0.55}px, ${y * 0.55}px) rotate(${rot * 0.5}deg) scale(${scale * 0.92})`,
                  }}
                >
                  {particle.char}
                </span>
              )}
              <span
                className="inline-block text-white/50 will-change-[transform,opacity,filter]"
                style={{
                  opacity,
                  filter: `blur(${blur}px)`,
                  transform: `translate3d(${x}vmin, ${y}vmin, 0) rotate(${rot}deg) scale(${scale})`,
                }}
              >
                {particle.char}
              </span>
            </span>
          );
        })}
      </span>
    </p>
  );
}

/* ============================================================
   COMPUTATIONAL CONVICTION — 3 pinned chapters, original copy
   ============================================================ */
export function ComputationalConviction() {
  const containerRef = useRef<HTMLElement>(null);
  const [progress, setProgress] = useState(0);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end end"],
  });

  useLayoutEffect(() => {
    setProgress(scrollYProgress.get());
  }, [scrollYProgress]);

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    setProgress(v);
  });

  const gridOpacity = mapRange(progress, 0, 0.05, 0.02, 0.06);

  const ch1HeadlineY = mapRange(progress, 0, 0.12, 22, 0);
  const ch1HeadlineOpacity = progress < 0.3 ? 1 : mapRange(progress, 0.3, 0.4, 1, 0.06);
  const ch1BodyOpacity =
    progress < 0.3 ? mapRange(progress, 0, 0.1, 0, 1) : mapRange(progress, 0.3, 0.4, 1, 0.06);
  const ch1BodyY = progress < 0.1 ? mapRange(progress, 0, 0.1, 14, 0) : 0;
  const ch1Y = progress < 0.3 ? 0 : mapRange(progress, 0.3, 0.4, 0, -90);
  const ch1ForegroundOpacity = progress < 0.3 ? 1 : ch1HeadlineOpacity;

  const ch2Opacity =
    progress < 0.3
      ? 0
      : progress < 0.4
        ? mapRange(progress, 0.3, 0.4, 0, 1)
        : progress < 0.62
          ? 1
          : progress < 0.68
            ? mapRange(progress, 0.62, 0.68, 1, 0)
            : 0;
  const ch2Y = progress < 0.62 ? 0 : progress < 0.68 ? mapRange(progress, 0.62, 0.68, 0, -72) : -72;
  const autonomousWeight = weightFromProgress(
    progress < 0.4 ? 0 : progress < 0.62 ? mapRange(progress, 0.4, 0.62, 0, 1) : 1,
  );

  const ch3Opacity =
    progress < 0.66 ? 0 : progress < 0.76 ? mapRange(progress, 0.66, 0.76, 0, 1) : 1;

  const traderScatter = mapRange(progress, 0.74, 1, 0, 1);
  const ch3HeadlineOpacity = progress < 0.9 ? 1 : mapRange(progress, 0.9, 1, 1, 0.92);
  const ch3HeadlineScale = 1 + mapRange(traderScatter, 0, 0.35, 0, 0.018);

  const ghostFollowerOpacity =
    progress >= 0.4 && progress < 0.85 ? mapRange(progress, 0.4, 0.55, 0.008, 0.004) : 0;
  const ghostAutonomousOpacity =
    progress >= 0.62 && progress < 0.85 ? mapRange(progress, 0.62, 0.78, 0.01, 0.005) : 0;

  return (
    <section
      ref={containerRef}
      id="computational-conviction"
      className="relative bg-black text-white"
      style={{ height: `${SCROLL_VH * 100}vh` }}
      aria-label="Computational conviction"
    >
      <div className="sticky top-0 h-screen overflow-hidden">
        <div
          className="cc-grid-drift pointer-events-none absolute inset-0"
          style={{ opacity: gridOpacity }}
          aria-hidden="true"
        />

        <div className="pointer-events-none absolute inset-0" aria-hidden="true">
          <p
            className={`absolute text-[clamp(3.5rem,16vw,12rem)] uppercase leading-none tracking-[-0.05em] text-white ${DISPLAY}`}
            style={{
              left: SECTION_X,
              top: "28%",
              opacity: ghostFollowerOpacity,
              fontWeight: 900,
            }}
          >
            FOLLOWER.
          </p>
          <p
            className={`absolute right-[10%] top-[42%] text-right text-[clamp(2.5rem,10vw,7rem)] uppercase leading-none tracking-[-0.04em] text-white ${DISPLAY}`}
            style={{ opacity: ghostAutonomousOpacity, fontWeight: 900 }}
          >
            AUTONOMOUS.
          </p>
        </div>

        <div className="relative z-10 flex h-full items-center px-section">
          {/* Chapter 1 */}
          <EditorialType
            className="absolute max-w-[min(46rem,92vw)]"
            style={{
              left: SECTION_X,
              opacity: ch1ForegroundOpacity,
              transform: `translateY(${ch1Y}px)`,
            }}
          >
            <h2
              className="text-display-cta font-display leading-[1.05] tracking-tight text-white"
              style={{
                opacity: ch1HeadlineOpacity,
                transform: `translateY(${ch1HeadlineY}px)`,
              }}
            >
              Don&apos;t be a follower,
              <br />
              <span className="whitespace-nowrap text-white/40">Be the signal others copy.</span>
            </h2>
            <p
              className="mt-6 max-w-2xl text-[clamp(0.9375rem,0.35vw+0.875rem,1.125rem)] leading-relaxed text-white/85 sm:mt-8"
              style={{
                opacity: ch1BodyOpacity,
                transform: `translateY(${ch1BodyY}px)`,
              }}
            >
              Copy trading puts you behind the move. Conduence puts you at the front of it,
              Orchestrate the agents others end up watching.
            </p>
          </EditorialType>

          {/* Chapter 2 — right aligned */}
          <EditorialType
            className="absolute w-[calc(100%-2*clamp(1rem,4vw,2.5rem))] max-w-[min(56rem,96vw)] text-right"
            style={{
              right: SECTION_X,
              opacity: ch2Opacity,
              visibility: ch2Opacity === 0 ? "hidden" : "visible",
              transform: `translateY(${ch2Y}px)`,
            }}
          >
            <p className="text-[clamp(0.95rem,1.6vw+0.3rem,1.35rem)] uppercase tracking-[0.28em] text-white/45 [font-family:var(--font-display),Georgia,serif]">
              Turn strategies into
            </p>
            <p className="mt-4 text-[clamp(1.5rem,3vw+0.4rem,3.5rem)] leading-[1.05] tracking-tight [font-family:var(--font-display),Georgia,serif]">
              <span className="text-white/55" style={{ fontWeight: 400 }}>
                fully independent{" "}
              </span>
              <span className="text-white" style={{ fontWeight: autonomousWeight }}>
                autonomous
              </span>
            </p>
            <p className="text-display-cta mt-2 font-display leading-[1.05] tracking-tight text-white">
              market actors.
            </p>
            <p className="mt-[clamp(1rem,2vw,1.5rem)] text-[clamp(0.625rem,1.5vw+0.4rem,1.5rem)] tracking-[0.32em] text-white/38 [font-family:var(--font-display),Georgia,serif]">
              <span className="whitespace-nowrap">No code.</span>
            </p>
          </EditorialType>

          {/* Chapter 3 — centered finale */}
          <EditorialType
            className="absolute inset-0 flex flex-col items-center justify-center px-section text-center"
            style={{ opacity: ch3Opacity }}
          >
            <p
              className="text-display-cta max-w-3xl text-balance font-display leading-[1.05] tracking-tight text-white"
              style={{
                opacity: ch3HeadlineOpacity,
                transform: `scale(${ch3HeadlineScale})`,
              }}
            >
              Many strategies.
              <br />
              <span className="text-white/40">One mind.</span>
            </p>
            <ScatteringTraderLine scatter={traderScatter} />
          </EditorialType>
        </div>
      </div>
    </section>
  );
}
