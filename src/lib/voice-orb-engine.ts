/**
 * Conduence voice orb — ember aurora sphere.
 * Ported from app/static/voice-orb.js
 */

const RES = 122;

const COLOR_FALLBACK = {
  cloud: "#E4E5E5",
  skyTop: "#B0A9A1",
  skyBottom: "#131211",
  rim: "#252220",
  highlight: "#C4BEB6",
  deep: "#343029",
  mid: "#7A7268",
  warm: "#958C82",
} as const;

type Rgb = [number, number, number];

type OrbColors = {
  cloud: Rgb;
  skyTop: Rgb;
  void: Rgb;
  rim: Rgb;
  highlight: Rgb;
  deep: Rgb;
  mid: Rgb;
  warm: Rgb;
};

type OrbState = "idle" | "listening" | "thinking" | "speaking";

export type VoiceState =
  | OrbState
  | "connected"
  | "processing"
  | "disconnecting"
  | "connecting"
  | "disconnected";

const STATES = {
  idle: { speed: 1.0, glow: 0.12 },
  listening: { speed: 1.85, glow: 0.34 },
  thinking: { speed: 1.0, glow: 0.2 },
  speaking: { speed: 1.85, glow: 0.34 },
} as const;

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

function ridgedFbm(x: number, y: number, octaves: number) {
  let val = 0;
  let amp = 0.55;
  let freq = 1;
  let prev = 1;
  for (let i = 0; i < octaves; i++) {
    const n = 1 - Math.abs(noise2d(x * freq, y * freq));
    const ridge = n * n * prev;
    val += ridge * amp;
    prev = ridge;
    amp *= 0.48;
    freq *= 2.05;
  }
  return val;
}

function clamp(v: number, lo: number, hi: number) {
  return v < lo ? lo : v > hi ? hi : v;
}

function hexToRgb(hex: string): Rgb | null {
  const normalized = String(hex || "")
    .trim()
    .replace("#", "");
  const expanded =
    normalized.length === 3
      ? normalized
          .split("")
          .map((ch) => ch + ch)
          .join("")
      : normalized;
  if (expanded.length !== 6) return null;
  return [
    parseInt(expanded.slice(0, 2), 16),
    parseInt(expanded.slice(2, 4), 16),
    parseInt(expanded.slice(4, 6), 16),
  ];
}

function parseCssColor(raw: string): Rgb | null {
  const value = String(raw || "").trim();
  if (!value) return null;

  const hex = hexToRgb(value);
  if (hex) return hex;

  const rgbMatch = value.match(/^rgba?\(\s*([\d.]+)(?:[,\s]+)([\d.]+)(?:[,\s]+)([\d.]+)/i);
  if (rgbMatch) {
    return [
      clamp(Number(rgbMatch[1]), 0, 255),
      clamp(Number(rgbMatch[2]), 0, 255),
      clamp(Number(rgbMatch[3]), 0, 255),
    ];
  }

  return null;
}

function cssRgb(varName: string, fallbackHex: string): Rgb {
  if (typeof window === "undefined") {
    return hexToRgb(fallbackHex) || [0, 0, 0];
  }
  const raw = getComputedStyle(document.documentElement).getPropertyValue(varName).trim();
  return parseCssColor(raw) || hexToRgb(fallbackHex) || [0, 0, 0];
}

function readOrbColors(): OrbColors {
  return {
    cloud: cssRgb("--orb-cloud", COLOR_FALLBACK.cloud),
    skyTop: cssRgb("--orb-sky-top", COLOR_FALLBACK.skyTop),
    void: cssRgb("--orb-sky-bottom", COLOR_FALLBACK.skyBottom),
    rim: cssRgb("--orb-rim", COLOR_FALLBACK.rim),
    highlight: cssRgb("--orb-highlight", COLOR_FALLBACK.highlight),
    deep: cssRgb("--orb-deep", COLOR_FALLBACK.deep),
    mid: cssRgb("--orb-mid", COLOR_FALLBACK.mid),
    warm: cssRgb("--orb-warm", COLOR_FALLBACK.warm),
  };
}

function lerpColor(a: Rgb, b: Rgb, t: number): Rgb {
  return [lerp(a[0], b[0], t), lerp(a[1], b[1], t), lerp(a[2], b[2], t)];
}

function buildPalette(colors: OrbColors) {
  return [
    { t: 0.0, c: colors.void },
    { t: 0.18, c: colors.rim },
    { t: 0.32, c: colors.deep },
    { t: 0.46, c: colors.warm },
    { t: 0.6, c: colors.mid },
    { t: 0.74, c: colors.skyTop },
    { t: 0.88, c: colors.highlight },
    { t: 1.0, c: colors.cloud },
  ];
}

function samplePalette(stops: ReturnType<typeof buildPalette>, t: number): Rgb {
  const v = clamp(t, 0, 1);
  for (let i = 0; i < stops.length - 1; i++) {
    const a = stops[i];
    const b = stops[i + 1];
    if (v >= a.t && v <= b.t) {
      const u = (v - a.t) / (b.t - a.t);
      return lerpColor(a.c, b.c, u);
    }
  }
  return stops[stops.length - 1].c;
}

function domainWarp(x: number, y: number, time: number) {
  const qx = fbm(x + time * 0.11, y + time * 0.08, 3);
  const qy = fbm(x + 4.8, y + time * 0.1, 3);
  const rx = x + qx * 0.32;
  const ry = y + qy * 0.28;
  const wx = fbm(rx + 1.6 + time * 0.06, ry + time * 0.07, 3);
  const wy = fbm(rx + time * 0.05, ry + 1.9 - time * 0.04, 3);
  return { x: rx + wx * 0.48, y: ry + wy * 0.48 };
}

function turbulentPoint(nx: number, ny: number, time: number, energy: number) {
  const spin = time * (0.15 + energy * 0.13);
  const counter = time * -(0.06 + energy * 0.04);
  const c1 = Math.cos(spin);
  const s1 = Math.sin(spin);
  const c2 = Math.cos(counter);
  const s2 = Math.sin(counter);

  const r1x = nx * c1 - ny * s1;
  const r1y = nx * s1 + ny * c1;
  const rx = r1x * 0.72 + (nx * c2 - ny * s2) * 0.28;
  const ry = r1y * 0.72 + (nx * s2 + ny * c2) * 0.28;

  const flow = fbm(rx * 1.4 + time * 0.18, ry * 1.2 - time * 0.14, 2);
  return {
    rx: rx + Math.cos(flow * Math.PI * 2) * 0.08,
    ry: ry + Math.sin(flow * Math.PI * 2) * 0.08 + time * 0.04,
  };
}

function auroraField(nx: number, ny: number, time: number, energy: number, glowAmt: number) {
  const { rx, ry } = turbulentPoint(nx, ny, time, energy);
  const warp = domainWarp(rx * 1.35, ry * 1.15 - time * 0.05, time);
  const wx = warp.x;
  const wy = warp.y;
  const depth = (ny + 1) * 0.5;

  const curtainMask = clamp(Math.pow(Math.max(0, -ny * 0.72 + 0.62), 1.15), 0, 1);
  const horizonFade = clamp(1 - Math.pow(Math.max(0, ny - 0.35) / 0.65, 1.4), 0, 1);

  const broad = ridgedFbm(wx * 1.05 + time * 0.05, wy * 0.88 - time * 0.04, 4);
  const mid = ridgedFbm(wx * 1.75 - time * 0.07, wy * 1.55 + time * 0.06, 4);
  const fine = ridgedFbm(wx * 2.85 + time * 0.1, wy * 2.45 - time * 0.09, 3);

  const c1 = Math.pow(broad, 1.55) * curtainMask * horizonFade;
  const c2 = Math.pow(mid, 1.95) * curtainMask * horizonFade;
  const c3 = Math.pow(fine, 2.55) * curtainMask * (0.65 + energy * 0.35);

  const mist = fbm(wx * 0.55 + time * 0.02, wy * 0.5 - time * 0.018, 2) * 0.5 + 0.5;
  const haze = fbm(rx * 1.8 - time * 0.04, ry * 1.6 + time * 0.03, 2) * curtainMask * 0.5;

  const coreDx = nx;
  const coreDy = ny + 0.1;
  const coreDist = Math.sqrt(coreDx * coreDx + coreDy * coreDy);
  const core = Math.max(0, 1 - coreDist / (0.76 - energy * 0.16));
  const coreGlow = Math.pow(core, 2.2) * (0.18 + energy * 0.55 + glowAmt);

  let baseShade = depth * 0.26 + mist * 0.1 + haze * 0.06;
  baseShade += c1 * 0.06;
  baseShade = Math.pow(clamp(baseShade, 0, 1), 0.92);

  const shimmer = Math.pow(fine * curtainMask, 3.6) * (0.35 + energy * 0.65);
  const bloom = Math.max(c1, c2 * 0.9, c3 * 0.75);

  return { baseShade, c1, c2, c3, coreGlow, shimmer, bloom, curtainMask };
}

function normalizeLevel(v: unknown) {
  if (v != null && typeof v === "object") {
    const obj = v as { audioLevel?: number; level?: number; value?: number };
    v = obj.audioLevel ?? obj.level ?? obj.value ?? 0;
  }
  const n = Number(v);
  if (!Number.isFinite(n) || n <= 0) return 0;
  return n > 1 ? clamp(n / 100, 0, 1) : clamp(n, 0, 1);
}

class AudioEnvelope {
  value = 0;

  constructor(
    private attackAlpha: number,
    private releaseAlpha: number,
  ) {}

  push(v: unknown) {
    const x = normalizeLevel(v);
    const alpha = x > this.value ? this.attackAlpha : this.releaseAlpha;
    this.value = alpha * x + (1 - alpha) * this.value;
    return this.value;
  }

  reset() {
    this.value = 0;
  }
}

function smoothDamp(
  current: number,
  target: number,
  velRef: { v: number },
  smoothTime: number,
  dt: number,
) {
  const st = Math.max(0.0001, smoothTime);
  const omega = 2 / st;
  const x = omega * dt;
  const exp = 1 / (1 + x + 0.48 * x * x + 0.235 * x * x * x);
  const change = current - target;
  const temp = (velRef.v + omega * change) * dt;
  velRef.v = (velRef.v - omega * temp) * exp;
  return target + (change + temp) * exp;
}

const ORB_SCALE = {
  min: 1.0,
  max: 1.12,
  micGain: 3.0,
  micCurve: 0.58,
  riseTime: 0.09,
  fallTime: 0.13,
} as const;

function micScaleLevel(micValue: number) {
  const boosted = clamp(micValue * ORB_SCALE.micGain, 0, 1);
  return Math.pow(boosted, ORB_SCALE.micCurve);
}

function orbScaleTarget(state: OrbState, micValue: number, speakPulse: number) {
  if (state === "thinking") return ORB_SCALE.min;
  if (state === "speaking") {
    return ORB_SCALE.min + speakPulse * (ORB_SCALE.max - ORB_SCALE.min);
  }
  if (state === "listening") {
    return ORB_SCALE.min + micScaleLevel(micValue) * (ORB_SCALE.max - ORB_SCALE.min);
  }
  return ORB_SCALE.min;
}

export function mapVoiceState(state: VoiceState): OrbState {
  if (state === "processing") return "thinking";
  if (state === "speaking") return "speaking";
  if (state === "listening" || state === "connected") return "listening";
  return "idle";
}

export type VoiceOrbHandle = {
  setVoiceState: (state: VoiceState) => void;
  setMicLevel: (level: number) => void;
  setBotLevel: (level: number) => void;
  start: () => void;
  stop: () => void;
};

export function mountVoiceOrb(
  host: HTMLElement,
  canvas: HTMLCanvasElement,
  scaleEl: HTMLElement | null,
): VoiceOrbHandle {
  host.classList.add("voice-orb");

  const ctx = canvas.getContext("2d", { alpha: true });
  if (!ctx) {
    return {
      setVoiceState() {},
      setMicLevel() {},
      setBotLevel() {},
      start() {},
      stop() {},
    };
  }

  const context = ctx;
  const cx = RES / 2;
  const cy = RES / 2;
  const radius = RES / 2 - 1;

  let running = false;
  let raf = 0;
  let t = 0;
  let lastFrameMs = 0;
  let orbState: OrbState = "idle";

  const micLevel = new AudioEnvelope(0.32, 0.1);
  let auroraEnergy = 0.18;
  const VOICE_SPEED = STATES.listening.speed;
  const VOICE_GLOW = STATES.listening.glow;
  let scaleValue = 1;
  const scaleVel = { v: 0 };
  let speakPulse = 0;
  let speakPulseTarget = 0.45;
  let speakPulseTimer = 0;

  const img = context.createImageData(RES, RES);
  const px = img.data;
  const reducedMotion =
    typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let colors = readOrbColors();

  const HL_CX = -0.32;
  const HL_CY = -0.44;

  function isVoiceSessionState() {
    return orbState === "listening" || orbState === "thinking" || orbState === "speaking";
  }

  function syncAuroraEnergy() {
    if (orbState === "listening") {
      auroraEnergy = micLevel.value;
    }
  }

  function updateSpeakPulse(dt: number) {
    if (orbState !== "speaking") {
      speakPulse = 0;
      speakPulseTarget = 0.45;
      speakPulseTimer = 0;
      return 0;
    }

    speakPulseTimer -= dt;
    if (speakPulseTimer <= 0) {
      speakPulseTarget = 0.22 + Math.random() * 0.78;
      speakPulseTimer = 0.07 + Math.random() * 0.17;
    }

    const alpha = 1 - Math.exp(-dt * 11);
    speakPulse += (speakPulseTarget - speakPulse) * alpha;
    return speakPulse;
  }

  function drawOrb() {
    colors = readOrbColors();
    const palette = buildPalette(colors);
    const cfg = STATES[orbState] || STATES.idle;
    const inVoiceSession = isVoiceSessionState();
    const energy = inVoiceSession ? auroraEnergy : 0.12;
    const glow = inVoiceSession ? VOICE_GLOW : cfg.glow;
    const speed = inVoiceSession ? VOICE_SPEED : cfg.speed;
    const time = t * 0.014 * speed;
    const r2 = radius * radius;

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
        const vert = (ny + 1) * 0.5;

        const aurora = auroraField(nx, ny, time, energy, glow);
        let rgb = samplePalette(palette, aurora.baseShade);

        rgb = lerpColor(rgb, colors.warm, aurora.c1 * (0.28 + energy * 0.14));
        rgb = lerpColor(rgb, colors.skyTop, aurora.c2 * (0.38 + energy * 0.18));
        rgb = lerpColor(rgb, colors.highlight, aurora.c3 * (0.48 + energy * 0.22));
        rgb = lerpColor(rgb, colors.cloud, aurora.coreGlow * 0.44);
        rgb = lerpColor(rgb, colors.cloud, aurora.bloom * 0.12 * aurora.curtainMask);
        rgb = lerpColor(rgb, colors.cloud, aurora.shimmer * 0.14);

        const hlDx = nx - HL_CX;
        const hlDy = ny - HL_CY;
        const hlDist = Math.sqrt(hlDx * hlDx + hlDy * hlDy);
        const specular = Math.max(0, 1 - hlDist / 0.82);
        rgb = lerpColor(rgb, colors.cloud, Math.pow(specular, 3.0) * (0.12 + energy * 0.1));

        const lowerRim = Math.max(0, vert - 0.52) / 0.48;
        rgb = lerpColor(rgb, colors.void, Math.pow(lowerRim, 1.5) * (0.62 - aurora.bloom * 0.15));
        const crown = Math.max(0, -ny - 0.12) / 0.58;
        rgb = lerpColor(rgb, colors.highlight, Math.pow(crown, 2.2) * (0.1 + aurora.c2 * 0.08));

        const edge = (dist - (radius - 1.4)) / 1.4;
        const alpha = edge > 0 ? Math.max(0, 1 - edge) * 255 : 255;

        px[i] = clamp(rgb[0], 8, 255) | 0;
        px[i + 1] = clamp(rgb[1], 8, 255) | 0;
        px[i + 2] = clamp(rgb[2], 8, 255) | 0;
        px[i + 3] = alpha | 0;
      }
    }

    context.clearRect(0, 0, RES, RES);
    context.putImageData(img, 0, 0);
  }

  function tick(now: number) {
    if (!running) return;
    const frameMs = typeof now === "number" ? now : performance.now();
    const dt = lastFrameMs ? Math.min((frameMs - lastFrameMs) / 1000, 0.05) : 0.016;
    lastFrameMs = frameMs;

    if (!reducedMotion) {
      t += 1;
    }
    syncAuroraEnergy();
    drawOrb();

    const speakPulseValue = updateSpeakPulse(dt);
    const targetScale = orbScaleTarget(orbState, micLevel.value, speakPulseValue);
    const smoothTime = targetScale > scaleValue ? ORB_SCALE.riseTime : ORB_SCALE.fallTime;
    scaleValue = smoothDamp(scaleValue, targetScale, scaleVel, smoothTime, dt);

    if (scaleEl) {
      scaleEl.style.transform = `scale(${scaleValue.toFixed(4)})`;
    }

    raf = requestAnimationFrame(tick);
  }

  function start() {
    if (running) return;
    running = true;
    drawOrb();
    raf = requestAnimationFrame(tick);
  }

  function stop() {
    running = false;
    if (raf) cancelAnimationFrame(raf);
    raf = 0;
    lastFrameMs = 0;
    micLevel.reset();
    auroraEnergy = 0.18;
    scaleValue = 1;
    scaleVel.v = 0;
    speakPulse = 0;
    speakPulseTarget = 0.45;
    speakPulseTimer = 0;
    if (scaleEl) scaleEl.style.transform = "";
    context.clearRect(0, 0, RES, RES);
  }

  return {
    setVoiceState(state: VoiceState) {
      orbState = mapVoiceState(state);
    },
    setMicLevel(level: number) {
      if (orbState === "listening") {
        micLevel.push(level);
      }
    },
    setBotLevel() {},
    start,
    stop,
  };
}

export const VOICE_ORB_RES = RES;
