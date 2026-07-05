"use client";

import { useEffect, useRef } from "react";

const RES = 256;

const STATES = {
  idle: { speed: 1.0, swirl: 0.1, scaleMax: 0.05, lift: 0.0 },
  listening: { speed: 1.9, swirl: 0.28, scaleMax: 0.17, lift: 0.1 },
  thinking: { speed: 3.0, swirl: 0.95, scaleMax: 0.04, lift: 0.06 },
  speaking: { speed: 2.2, swirl: 0.55, scaleMax: 0.21, lift: 0.16 },
} as const;

type OrbState = keyof typeof STATES;

const PERM = new Uint8Array(512);
(function initPerm() {
  const src = new Uint8Array(256);
  for (let i = 0; i < 256; i++) src[i] = i;
  for (let i = 255; i > 0; i--) {
    const j = (Math.random() * (i + 1)) | 0;
    const tmp = src[i];
    src[i] = src[j];
    src[j] = tmp;
  }
  for (let i = 0; i < 512; i++) PERM[i] = src[i & 255];
})();

function fade(t: number) {
  return t * t * t * (t * (t * 6 - 15) + 10);
}

function lerp(a: number, b: number, t: number) {
  return a + t * (b - a);
}

function grad(h: number, x: number, y: number) {
  const v = h & 3;
  const u = v < 2 ? x : y;
  const w = v < 2 ? y : x;
  return (v & 1 ? -u : u) + (v & 2 ? -w : w);
}

function noise2d(x: number, y: number) {
  const xi = Math.floor(x) & 255;
  const yi = Math.floor(y) & 255;
  const xf = x - Math.floor(x);
  const yf = y - Math.floor(y);
  const u = fade(xf);
  const v = fade(yf);
  const aa = PERM[xi] + yi;
  const ab = PERM[xi + 1] + yi;
  return lerp(
    lerp(grad(PERM[aa], xf, yf), grad(PERM[ab], xf - 1, yf), u),
    lerp(grad(PERM[aa + 1], xf, yf - 1), grad(PERM[ab + 1], xf - 1, yf - 1), u),
    v,
  );
}

function fbm(x: number, y: number, octaves: number) {
  let val = 0;
  let amp = 0.6;
  let freq = 1;
  for (let i = 0; i < octaves; i++) {
    val += amp * noise2d(x * freq, y * freq);
    amp *= 0.52;
    freq *= 2.1;
  }
  return val;
}

function smoothstep(e0: number, e1: number, x: number) {
  const t = Math.min(1, Math.max(0, (x - e0) / (e1 - e0)));
  return t * t * (3 - 2 * t);
}

function clamp(v: number, lo: number, hi: number) {
  return v < lo ? lo : v > hi ? hi : v;
}

class LowPass {
  value = 0;

  constructor(private alpha: number) {}

  push(v: number) {
    const x = Math.max(0, Math.min(1, v || 0));
    this.value = this.alpha * x + (1 - this.alpha) * this.value;
    return this.value;
  }

  reset() {
    this.value = 0;
  }
}

class Spring {
  value: number;
  target: number;
  velocity = 0;

  constructor(
    value: number,
    private stiffness: number,
    private damping: number,
  ) {
    this.value = value;
    this.target = value;
  }

  setTarget(t: number) {
    this.target = t;
  }

  step() {
    const force = (this.target - this.value) * this.stiffness;
    this.velocity = (this.velocity + force) * this.damping;
    this.value += this.velocity;
    return this.value;
  }

  snap(t: number) {
    this.value = t;
    this.target = t;
    this.velocity = 0;
  }
}

type VoiceOrbProps = {
  className?: string;
  state?: OrbState;
  /** Gentle synthetic motion for marketing / landing display */
  demo?: boolean;
};

export function VoiceOrb({ className, state = "idle", demo = false }: VoiceOrbProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const scaleRef = useRef<HTMLDivElement>(null);
  const orbStateRef = useRef<OrbState>(state);

  useEffect(() => {
    if (!demo) orbStateRef.current = state;
  }, [state, demo]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const scaleEl = scaleRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const context = ctx;

    const cx = RES / 2;
    const cy = RES / 2;
    const radius = RES / 2 - 1;

    let running = false;
    let raf = 0;
    let t = 0;

    const micLevel = new LowPass(0.16);
    const botLevel = new LowPass(0.18);
    const scaleSpring = new Spring(1, 0.12, 0.72);

    const img = context.createImageData(RES, RES);
    const px = img.data;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const HL_CX = -0.3;
    const HL_CY = -0.42;

    function energyForState() {
      const orbState = orbStateRef.current;
      if (orbState === "speaking") return botLevel.value;
      if (orbState === "listening") return micLevel.value;
      if (orbState === "thinking") return 0.4 + 0.15 * Math.sin(t * 0.05);
      return 0.15 + 0.06 * Math.sin(t * 0.02);
    }

    function drawClouds() {
      const orbState = orbStateRef.current;
      const cfg = STATES[orbState] || STATES.idle;
      const energy = energyForState();
      const time = t * 0.014 * cfg.speed;
      const swirlAmt = cfg.swirl;
      const r2 = radius * radius;
      const liftShift = -(cfg.lift * energy) * 0.9;

      for (let y = 0; y < RES; y++) {
        for (let x = 0; x < RES; x++) {
          const dx = x - cx;
          const dy = y - cy;
          const dist2 = dx * dx + dy * dy;
          const i = (y * RES + x) * 4;

          if (dist2 > r2) {
            px[i + 3] = 0;
            continue;
          }

          const dist = Math.sqrt(dist2);
          const nx = dx / radius;
          const ny = dy / radius;
          const vert = (ny + 1) / 2;

          const sky = lerp(248, 22, Math.pow(vert, 0.88));

          const wave1 = Math.sin(nx * 2.3 + time * 1.7) * 0.28;
          const wave2 = Math.sin(nx * 4.0 - time * 1.15 + 1.3) * 0.14;
          const wave3 = Math.sin(nx * 6.2 + time * 2.3) * 0.07;
          const waveLine =
            ny + wave1 + wave2 + wave3 + liftShift + swirlAmt * Math.sin(time * 1.2) * 0.08;

          let cloudEdge = smoothstep(0.28, -0.38, waveLine);

          const detail = fbm(nx * 3.4 + time * 0.9, ny * 3.4 - time * 0.7, 3);
          cloudEdge = clamp(cloudEdge + detail * 0.14 * cloudEdge, 0, 1);

          let grey = lerp(sky, 255, cloudEdge);

          const puff = fbm(nx * 2.1 + time * 0.55, ny * 2.1 - time * 0.42, 3);
          const wisp = fbm(nx * 4.6 - time * 0.85, ny * 4.6 + time * 1.05, 3);
          const texture = puff * 0.55 + wisp * 0.45;
          grey -= texture * 16 * (0.2 + cloudEdge * 0.65);

          const hlDx = nx - HL_CX;
          const hlDy = ny - HL_CY;
          const hlDist = Math.sqrt(hlDx * hlDx + hlDy * hlDy);
          const highlight = Math.max(0, 1 - hlDist / 0.9);
          grey += Math.pow(highlight, 2.4) * (28 + energy * 12);

          const lowerRim = Math.max(0, vert - 0.6) / 0.4;
          grey -= Math.pow(lowerRim, 1.5) * 22 * (1 - cloudEdge * 0.6);

          grey = clamp(grey, 8, 255) | 0;

          const edge = (dist - (radius - 1.4)) / 1.4;
          const alpha = edge > 0 ? Math.max(0, 1 - edge) * 255 : 255;

          px[i] = grey;
          px[i + 1] = grey;
          px[i + 2] = grey;
          px[i + 3] = alpha | 0;
        }
      }

      context.clearRect(0, 0, RES, RES);
      context.putImageData(img, 0, 0);
    }

    function tick() {
      if (!running) return;
      t += reducedMotion ? 0 : 1;

      if (demo) {
        orbStateRef.current = "listening";
        micLevel.push(0.32 + 0.24 * Math.sin(t * 0.032));
      }

      const orbState = orbStateRef.current;
      const cfg = STATES[orbState] || STATES.idle;
      const energy = energyForState();

      scaleSpring.setTarget(1 + energy * cfg.scaleMax);
      const scale = scaleSpring.step();

      drawClouds();

      if (scaleEl) {
        scaleEl.style.transform = `scale(${scale.toFixed(4)})`;
      }

      raf = requestAnimationFrame(tick);
    }

    running = true;
    drawClouds();
    raf = requestAnimationFrame(tick);

    return () => {
      running = false;
      if (raf) cancelAnimationFrame(raf);
      micLevel.reset();
      botLevel.reset();
      scaleSpring.snap(1);
      if (scaleEl) scaleEl.style.transform = "";
      context.clearRect(0, 0, RES, RES);
    };
  }, [demo]);

  return (
    <div className={`voice-orb ${className ?? ""}`} aria-hidden="true">
      <div ref={scaleRef} className="voice-orb__scale h-full w-full">
        <canvas
          ref={canvasRef}
          className="voice-orb__canvas h-full w-full"
          width={RES}
          height={RES}
        />
      </div>
    </div>
  );
}
