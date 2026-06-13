"use client";

import { useEffect, useRef, useState } from "react";
import DecryptedText from "@/components/DecryptedText";

const MANTRAS = [
  "I act.",
  "I think.",
  "I question.",
  "I read.",
  "I ask.",
  "I adapt.",
  "I decide.",
  "I execute.",
];

function MatrixCanvas() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    let w = (canvas.width = canvas.offsetWidth);
    let h = (canvas.height = canvas.offsetHeight);
    const fontSize = 14;
    let cols = Math.floor(w / fontSize);
    let drops = new Array(cols).fill(1);
    const glyphs =
      "アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホ0123456789ABCDEF<>/?*+-";

    const onResize = () => {
      w = canvas.width = canvas.offsetWidth;
      h = canvas.height = canvas.offsetHeight;
      cols = Math.floor(w / fontSize);
      drops = new Array(cols).fill(1);
    };
    window.addEventListener("resize", onResize);

    let raf = 0;
    const draw = () => {
      ctx.fillStyle = "rgba(0,0,0,0.08)";
      ctx.fillRect(0, 0, w, h);
      ctx.fillStyle = "rgba(180,255,210,0.85)";
      ctx.font = `${fontSize}px monospace`;
      for (let i = 0; i < drops.length; i++) {
        const text = glyphs[Math.floor(Math.random() * glyphs.length)];
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);
        if (drops[i] * fontSize > h && Math.random() > 0.975) drops[i] = 0;
        drops[i]++;
      }
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return <canvas ref={ref} className="absolute inset-0 h-full w-full opacity-40" aria-hidden />;
}

export function MatrixMantras() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const handler = () => {
      const el = sectionRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const total = rect.height - window.innerHeight;
      const scrolled = Math.min(Math.max(-rect.top, 0), total);
      const ratio = total > 0 ? scrolled / total : 0;
      const idx = Math.min(MANTRAS.length - 1, Math.floor(ratio * MANTRAS.length));
      setActiveIndex(idx);
    };
    handler();
    window.addEventListener("scroll", handler, { passive: true });
    window.addEventListener("resize", handler);
    return () => {
      window.removeEventListener("scroll", handler);
      window.removeEventListener("resize", handler);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative bg-black text-white"
      style={{ height: `${MANTRAS.length * 80}vh` }}
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        <MatrixCanvas />
        {/* vignette */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse at center, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.85) 70%, rgba(0,0,0,1) 100%)",
          }}
        />

        <div className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center">
          <p
            className="mb-10 text-[10px] tracking-[0.4em] text-emerald-200/70"
            style={{ fontFamily: '"Michroma", sans-serif' }}
          >
            [ AGENT VOICE · {String(activeIndex + 1).padStart(2, "0")} /{" "}
            {String(MANTRAS.length).padStart(2, "0")} ]
          </p>

          <h2
            className="font-black uppercase tracking-[-0.03em] leading-none"
            style={{ fontSize: "clamp(3.5rem, 14vw, 14rem)" }}
          >
            <DecryptedText
              key={activeIndex}
              text={MANTRAS[activeIndex]}
              animateOn="view"
              sequential
              revealDirection="start"
              speed={45}
              maxIterations={20}
              useOriginalCharsOnly={false}
              characters="アイウエオカキクケコ01<>/?*+-ABCDEF"
              className="text-white"
              encryptedClassName="text-emerald-300/70"
              parentClassName="inline-flex"
            />
          </h2>

          <p className="mt-10 max-w-xl text-base text-white/55">
            Not a script. Not a rule. A reasoning loop —
            <br className="hidden sm:block" />
            agents that perceive, weigh, and move.
          </p>

          {/* progress dots */}
          <div className="absolute bottom-12 left-0 right-0 flex justify-center gap-2">
            {MANTRAS.map((_, i) => (
              <span
                key={i}
                className={`h-1.5 w-6 rounded-full transition-all ${
                  i === activeIndex ? "bg-emerald-300" : "bg-white/15"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
