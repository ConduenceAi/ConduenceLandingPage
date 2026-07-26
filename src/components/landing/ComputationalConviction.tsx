"use client";

import { useMotionValueEvent, useScroll } from "framer-motion";
import { useLayoutEffect, useRef, useState } from "react";

const SCROLL_VH = 1.8;

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
   COMPUTATIONAL CONVICTION — finale chapter
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

  const gridOpacity = mapRange(progress, 0, 0.12, 0.02, 0.06);
  const headlineOpacity = mapRange(progress, 0.08, 0.28, 0, 1);
  const headlineY = mapRange(progress, 0.08, 0.28, 18, 0);
  const traderScatter = mapRange(progress, 0.45, 1, 0, 1);
  const headlineScale = 1 + mapRange(traderScatter, 0, 0.35, 0, 0.018);

  return (
    <section
      ref={containerRef}
      id="computational-conviction"
      className="relative bg-black text-white/88"
      style={{ height: `${SCROLL_VH * 100}vh` }}
      aria-label="Computational conviction"
    >
      <div className="sticky top-0 h-screen overflow-hidden">
        <div
          className="cc-grid-drift pointer-events-none absolute inset-0"
          style={{ opacity: gridOpacity }}
          aria-hidden="true"
        />

        <div className="relative z-10 flex h-full items-center px-section">
          <EditorialType
            className="absolute inset-0 flex flex-col items-center justify-center px-section text-center"
            style={{ opacity: headlineOpacity }}
          >
            <p
              className="text-display-cta max-w-3xl text-balance font-display leading-[1.05] tracking-tight text-white/88"
              style={{
                transform: `translateY(${headlineY}px) scale(${headlineScale})`,
              }}
            >
              Many strategies.
              <br />
              <span className="text-white/40">One Judgment.</span>
            </p>
            <ScatteringTraderLine scatter={traderScatter} />
          </EditorialType>
        </div>
      </div>
    </section>
  );
}
