"use client";

/**
 * Conduence — "Problem" section (interactive)
 * ---------------------------------------------------------------
 * The visitor lives the problem first, then reads it.
 *
 *   ready    5s countdown replaces the cards
 *   select   cards appear showing their move and stay visible for 3s
 *   picked   brief acknowledgement of the click
 *   zoom     other markets fade, the matching one grows to 50% of the
 *            grid; the right column says what happened
 *   statement  full-screen centred "The problem / Markets move
 *            simultaneously. Human attention doesn't."  (+ reload)
 *
 * React + CSS only. Animated properties are transform / opacity.
 * Pauses when off-screen. prefers-reduced-motion → static grid, the
 * statement is shown immediately and one market is quietly outlined.
 *
 * Usage: <ProblemSection />
 * Theming: override the --cdn-* custom properties on .cdn-problem.
 */

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
  type ReactNode,
  type RefObject,
  type SVGProps,
} from "react";

/* ------------------------------------------------------------------ */
/* Data — fictional markets, no live data.                             */
/* yes = probability on the calm card · d = move shown on the back     */
/* Index 6 is the market that matches "Buy momentum" (strongest rise). */
/* ------------------------------------------------------------------ */
const WINNER = 6;

type Market = {
  name: string;
  tag: string;
  yes: number;
  d: number;
  vol: string;
};

type Phase = "ready" | "select" | "picked" | "zoom" | "statement";
type Outcome = "caught" | "wrong" | "missed" | null;
type Zoom = { dx: number; dy: number; s: number } | null;

type RunState = {
  phase: Phase;
  flipped: boolean;
  hidden: boolean;
  outcome: Outcome;
  picked: number | null;
  reaction: number | null;
  zoom: Zoom;
};

const MARKETS: Market[] = [
  { name: "Fed cuts rates", tag: "Macro", yes: 61, d: 3, vol: "820 WETH" },
  { name: "ETH ETF inflows", tag: "ETH / USD", yes: 47, d: -2, vol: "380 WETH" },
  { name: "Oil above $80", tag: "OIL / USD", yes: 38, d: 5, vol: "290 WETH" },
  { name: "Gold above $3,500", tag: "XAU / USD", yes: 72, d: -4, vol: "590 WETH" },
  { name: "S&P closes higher", tag: "Equities", yes: 58, d: 1, vol: "1,100 WETH" },
  { name: "BTC dominance", tag: "Crypto", yes: 54, d: -3, vol: "320 WETH" },
  { name: "BTC above $115K", tag: "BTC / USD", yes: 68, d: 14, vol: "1,930 WETH" },
  { name: "ETH above $4K", tag: "ETH / USD", yes: 44, d: 6, vol: "710 WETH" },
  { name: "US unemployment", tag: "Macro", yes: 33, d: -1, vol: "210 WETH" },
  { name: "Tech earnings", tag: "Equities", yes: 65, d: 2, vol: "450 WETH" },
  { name: "Treasury yields", tag: "Rates", yes: 51, d: -5, vol: "680 WETH" },
  { name: "Crypto ETF flows", tag: "Crypto", yes: 59, d: 4, vol: "520 WETH" },
];

// Extra detail shown only on the zoomed card.
const SPOT = { network: "Sepolia testnet", tvl: "412 WETH", fees: "8.50%" };

/* ------------------------------------------------------------------ */
/* Timing (ms) — tune here                                              */
/* ------------------------------------------------------------------ */
const PREP_MS = 5000; // 5s countdown in place of the cards
const SELECT_MS = 3000; // time to pick while the moves stay visible
const PICK_HOLD_MS = 500; // acknowledge the click before revealing
const RESULT_MS = 2600; // outcome message on screen before the statement
const SELECT_S = SELECT_MS / 1000;
const COLS = 4;

const READY: RunState = {
  phase: "ready",
  flipped: false,
  hidden: false,
  outcome: null, // "caught" | "wrong" | "missed"
  picked: null,
  reaction: null,
  zoom: null, // { dx, dy, s } — where the spotlight grows from
};

const STATUS: Record<"ready" | "select" | "picked", string> = {
  ready: "Get ready",
  select: "Pick now",
  picked: "Locked in",
};

const seconds = (ms: number) => (ms / 1000).toFixed(1);

function resultCopy(outcome: Outcome, reaction: number | null) {
  const winner = MARKETS[WINNER].name;
  if (outcome === "caught")
    return {
      title: "You caught it.",
      sub: `In ${seconds(reaction ?? 0)} seconds, with only twelve markets to watch.`,
    };
  if (outcome === "wrong")
    return { title: "Not that one.", sub: `The edge was in ${winner}.` };
  return { title: "You missed it.", sub: `The edge lasted ${SELECT_S} seconds.` };
}

/* ------------------------------------------------------------------ */
/* Hooks                                                                */
/* ------------------------------------------------------------------ */
function useReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  return reduced;
}

function useActive(ref: RefObject<HTMLElement | null>, threshold = 0.6) {
  const [inView, setInView] = useState(false);
  const [tabVisible, setTabVisible] = useState(true);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") {
      setInView(true);
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting && entry.intersectionRatio >= threshold),
      { threshold: [0, threshold, 0.8, 1], rootMargin: "-12% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [ref, threshold]);

  useEffect(() => {
    const onVis = () => setTabVisible(!document.hidden);
    onVis();
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, []);

  return inView && tabVisible;
}

/* ------------------------------------------------------------------ */
/* Countdown — writes to the DOM directly, no re-renders                */
/* ------------------------------------------------------------------ */
function Countdown({ phase }: { phase: Phase }) {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (phase === "select") {
      const t0 = performance.now();
      const tick = () => {
        const left = Math.max(0, SELECT_MS - (performance.now() - t0));
        el.textContent = seconds(left);
      };
      tick();
      const id = setInterval(tick, 50);
      return () => clearInterval(id);
    }
    el.textContent = seconds(SELECT_MS);
  }, [phase]);
  return (
    <span ref={ref} className="cdn-count">
      {seconds(SELECT_MS)}
    </span>
  );
}

function PrepCountdown({ active }: { active: boolean }) {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!active) {
      el.textContent = "5";
      return;
    }
    const t0 = performance.now();
    const tick = () => {
      const left = Math.max(0, PREP_MS - (performance.now() - t0));
      el.textContent = String(Math.max(1, Math.ceil(left / 1000)));
    };
    tick();
    const id = setInterval(tick, 80);
    return () => clearInterval(id);
  }, [active]);
  return (
    <div className="cdn-prep" data-run={active ? "true" : undefined}>
      <svg className="cdn-prep-ring" viewBox="0 0 100 100" aria-hidden="true">
        <circle className="cdn-prep-track" cx="50" cy="50" r="46" />
        <circle
          className="cdn-prep-arc"
          cx="50"
          cy="50"
          r="46"
          style={{ animationDuration: `${PREP_MS}ms` }}
        />
      </svg>
      <span ref={ref} className="cdn-prep-count">
        5
      </span>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Card                                                                 */
/* ------------------------------------------------------------------ */
const Svg = ({ children, ...p }: SVGProps<SVGSVGElement> & { children: ReactNode }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    {...p}
  >
    {children}
  </svg>
);
const IconUp = () => (
  <Svg>
    <path d="M3 17l6-6 4 4 8-8" />
    <path d="M14 7h7v7" />
  </Svg>
);
const IconDown = () => (
  <Svg>
    <path d="M3 7l6 6 4-4 8 8" />
    <path d="M14 17h7v-7" />
  </Svg>
);
const IconLayers = () => (
  <Svg>
    <path d="M12 3l9 5-9 5-9-5 9-5z" />
    <path d="M3 13l9 5 9-5" />
  </Svg>
);
const IconActivity = () => (
  <Svg>
    <path d="M3 12h4l3-8 4 16 3-8h4" />
  </Svg>
);
const IconZap = () => (
  <Svg>
    <path d="M13 2L4 14h7l-1 8 9-12h-7l1-8z" />
  </Svg>
);
const IconReload = () => (
  <Svg>
    <path d="M21 12a9 9 0 1 1-3.18-6.87" />
    <path d="M21 3v6h-6" />
  </Svg>
);

function Split({ pct }: { pct: number }) {
  return (
    <span className="cdn-split" aria-hidden="true">
      <span style={{ transform: `scaleX(${pct / 100})` }} />
    </span>
  );
}

function Card({
  market,
  index,
  flipped,
  picked,
  match,
  selectable,
  onSelect,
  cellRef,
}: {
  market: Market;
  index: number;
  flipped: boolean;
  picked: boolean;
  match: boolean;
  selectable: boolean;
  onSelect: (index: number) => void;
  cellRef: (el: HTMLDivElement | null) => void;
}) {
  const col = index % COLS;
  const row = Math.floor(index / COLS);
  const now = market.yes + market.d;
  const up = market.d >= 0;

  return (
    <div
      ref={cellRef}
      className="cdn-cell"
      role="button"
      tabIndex={selectable ? 0 : -1}
      aria-disabled={!selectable}
      aria-label={market.name}
      data-match={match ? "true" : undefined}
      data-picked={picked ? "true" : undefined}
      onClick={() => onSelect(index)}
      onKeyDown={(e: KeyboardEvent<HTMLDivElement>) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onSelect(index);
        }
      }}
    >
      <div
        className="cdn-flip"
        data-flipped={flipped ? "true" : undefined}
        style={{ "--d": `${(row + col) * 9}ms` } as CSSProperties}
      >
        {/* FRONT — calm state */}
        <div className="cdn-face cdn-front">
          <span className="cdn-name">{market.name}</span>
          <span className="cdn-hint">24h vol {market.vol}</span>
          <div className="cdn-probs">
            <div className="cdn-probs-real">
              <div className="cdn-vals">
                <span>
                  <i>Bull</i> {market.yes}%
                </span>
                <span>
                  <i>Bear</i> {100 - market.yes}%
                </span>
              </div>
              <Split pct={market.yes} />
            </div>
            <div className="cdn-probs-mask" aria-hidden="true">
              <div className="cdn-vals">
                <span>
                  <i>Bull</i> ––
                </span>
                <span>
                  <i>Bear</i> ––
                </span>
              </div>
              <Split pct={0} />
            </div>
          </div>
        </div>

        {/* BACK — the fleeting glimpse */}
        <div className="cdn-face cdn-back" aria-hidden="true">
          <span className="cdn-name cdn-name-dim">{market.name}</span>
          <div>
            <div className="cdn-vals">
              <span>
                <i>Bull</i> {now}%
              </span>
              <span className={up ? "cdn-delta" : "cdn-delta cdn-delta-down"}>
                {up ? "▲" : "▼"} {Math.abs(market.d)}
              </span>
            </div>
            <Split pct={now} />
          </div>
        </div>
      </div>

      <span className="cdn-ring" aria-hidden="true" />
      <span className="cdn-pick" aria-hidden="true" />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Section                                                              */
/* ------------------------------------------------------------------ */
export function ProblemSection({ forceActive = false }: { forceActive?: boolean }) {
  const rootRef = useRef<HTMLElement>(null);
  const spotRef = useRef<HTMLDivElement>(null);
  const cellRefs = useRef<(HTMLDivElement | null)[]>([]);
  const timers = useRef(new Set<ReturnType<typeof setTimeout>>());
  const selectTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const selectAt = useRef(0);

  const reduced = useReducedMotion();
  const viewed = useActive(rootRef);
  const active = forceActive || viewed;

  const [s, setS] = useState<RunState>(READY);
  const [runId, setRunId] = useState(0);
  const sRef = useRef(s);
  sRef.current = s;

  const later = useCallback((ms: number, fn: () => void) => {
    const id = setTimeout(() => {
      timers.current.delete(id);
      fn();
    }, ms);
    timers.current.add(id);
    return id;
  }, []);

  const clearAll = useCallback(() => {
    timers.current.forEach(clearTimeout);
    timers.current.clear();
  }, []);

  /* other markets fade, the matching one grows out of its own cell */
  const enterZoom = useCallback(
    (outcome: Exclude<Outcome, null>, picked: number | null, reaction: number | null) => {
      let zoom: Zoom = null;
      const spot = spotRef.current;
      const cell = cellRefs.current[WINNER];
      if (spot && cell) {
        const a = spot.getBoundingClientRect(); // final size, centred in the grid
        const b = cell.getBoundingClientRect();
        if (a.width > 0) {
          zoom = {
            dx: b.left + b.width / 2 - (a.left + a.width / 2),
            dy: b.top + b.height / 2 - (a.top + a.height / 2),
            s: b.width / a.width,
          };
        }
      }
      setS((p) => ({ ...p, phase: "zoom", outcome, picked, reaction, zoom }));
      later(RESULT_MS, () => setS((p) => ({ ...p, phase: "statement" })));
    },
    [later],
  );

  /* the run: starts when visible, stops (and resets) when not */
  useEffect(() => {
    if (reduced || !active) return;
    if (sRef.current.phase !== "ready") return; // finished runs stay finished

    later(PREP_MS, () => {
      selectAt.current = performance.now();
      setS((p) => ({ ...p, phase: "select", flipped: true }));
      selectTimer.current = later(SELECT_MS, () => {
        if (sRef.current.phase === "select") enterZoom("missed", null, null);
      });
    });

    return () => {
      clearAll();
      setS((p) => (p.phase === "statement" ? p : READY));
    };
  }, [active, reduced, runId, later, clearAll, enterZoom]);

  const choose = (i: number) => {
    if (sRef.current.phase !== "select") return;
    sRef.current = { ...sRef.current, phase: "picked" }; // guard double clicks
    if (selectTimer.current != null) {
      clearTimeout(selectTimer.current);
      timers.current.delete(selectTimer.current);
    }

    const reaction = performance.now() - selectAt.current;
    const outcome = i === WINNER ? "caught" : "wrong";
    setS((p) => ({ ...p, phase: "picked", picked: i, outcome, reaction }));
    later(PICK_HOLD_MS, () => enterZoom(outcome, i, reaction));
  };

  const replay = () => {
    clearAll();
    setS(READY);
    setRunId((n) => n + 1);
  };

  const phase = s.phase;
  const selectable = phase === "select";
  const dim = !reduced && (phase === "zoom" || phase === "statement");
  const showTask = !reduced && ["ready", "select", "picked"].includes(phase);
  const showResult = !reduced && phase === "zoom";
  const showFinale = !reduced && phase === "statement";
  const showProblem = reduced;
  const running = phase === "select" || phase === "picked";

  const result = resultCopy(s.outcome, s.reaction);
  const z = s.zoom;
  const win = MARKETS[WINNER];
  const statusLabel =
    phase === "ready" || phase === "select" || phase === "picked" ? STATUS[phase] : STATUS.ready;

  return (
    <section
      id="problem"
      ref={rootRef}
      className="cdn-problem bg-white"
      aria-label="The problem: markets move simultaneously, human attention doesn't"
      data-phase={phase}
      data-dim={dim ? "true" : undefined}
      data-hidden={s.hidden ? "true" : undefined}
      data-static={reduced ? "true" : undefined}
      data-finale={showFinale ? "true" : undefined}
    >
      <style>{CSS}</style>

      <div className="cdn-inner" aria-hidden={showFinale || undefined}>
        {/* TOP — instructions → outcome */}
        <div className="cdn-copy" aria-live="polite">
          {/* 1 · instructions */}
          <div className="cdn-panel" data-on={showTask ? "true" : undefined}>
            <p className="cdn-eyebrow">Can you spot it?</p>
            <p className="cdn-task-title">
              <span className="cdn-dot" aria-hidden="true" />
              Buy momentum.
            </p>
            <p className="cdn-support cdn-task-body">
              Pick the market with the strongest upward move within {SELECT_S} seconds.
            </p>

            {phase !== "ready" && (
              <>
                <div className="cdn-status">
                  <span className="cdn-status-label">{statusLabel}</span>
                  <Countdown phase={phase} />
                </div>
                <span className="cdn-bar" aria-hidden="true">
                  <span
                    className="cdn-bar-fill"
                    data-run={running ? "true" : undefined}
                    data-paused={phase === "picked" ? "true" : undefined}
                    style={{ animationDuration: `${SELECT_MS}ms` }}
                  />
                </span>
              </>
            )}
          </div>

          {/* 2 · what just happened */}
          <div className="cdn-panel" data-on={showResult ? "true" : undefined}>
            <p className="cdn-heading cdn-result-title">{result.title}</p>
            <p className="cdn-support cdn-result-sub">{result.sub}</p>
          </div>

          {/* 3 · the problem (reduced-motion) */}
          <div className="cdn-panel" data-on={showProblem ? "true" : undefined}>
            <p className="cdn-eyebrow">The problem</p>
            <h2 className="cdn-heading">
              <span className="cdn-h-a">Markets move simultaneously.</span>
              <span className="cdn-h-b">Human attention doesn&rsquo;t.</span>
            </h2>
            <p className="cdn-support">
              Edges expire in seconds. One trader can only watch so many markets at once.
            </p>
          </div>
        </div>

        {/* GRID — countdown first, then 4 × 3 cards stay visible */}
        <div className="cdn-stage">
          {phase === "ready" ? (
            <PrepCountdown active={active} />
          ) : (
          <div className="cdn-grid" role="group" aria-label="Twelve prediction markets">
            {MARKETS.map((m, i) => (
              <Card
                key={m.name}
                market={m}
                index={i}
                flipped={s.flipped}
                picked={s.picked === i}
                match={i === WINNER}
                selectable={selectable}
                onSelect={choose}
                cellRef={(el) => {
                  cellRefs.current[i] = el;
                }}
              />
            ))}

            {/* the matching market, grown to 50% of the grid */}
            <div className="cdn-spot-wrap" aria-hidden="true">
              <div
                ref={spotRef}
                className="cdn-spot"
                data-on={dim ? "true" : undefined}
                style={
                  z
                    ? ({ "--dx": `${z.dx}px`, "--dy": `${z.dy}px`, "--s": z.s } as CSSProperties)
                    : undefined
                }
              >
                <div className="cdn-spot-body">
                  <div className="cdn-spot-top">
                    <span className="cdn-chips">
                      <span className="cdn-chip">{SPOT.network}</span>
                      <span className="cdn-chip cdn-chip-tag">{win.tag}</span>
                    </span>
                    <span className="cdn-live">
                      <i />
                      Live
                    </span>
                  </div>

                  <p className="cdn-spot-title">{win.name}</p>

                  <div className="cdn-tiles">
                    <div className="cdn-tile cdn-tile-bull">
                      <span className="cdn-tile-head">
                        <span className="cdn-tile-ico">
                          <IconUp />
                        </span>
                        Bull
                      </span>
                      <span className="cdn-tile-pct">{(win.yes + win.d).toFixed(1)}%</span>
                    </div>
                    <div className="cdn-tile">
                      <span className="cdn-tile-head">
                        <span className="cdn-tile-ico">
                          <IconDown />
                        </span>
                        Bear
                      </span>
                      <span className="cdn-tile-pct">{(100 - win.yes - win.d).toFixed(1)}%</span>
                    </div>
                  </div>

                  <span className="cdn-slider">
                    <span className="cdn-slider-fill" style={{ width: `${win.yes + win.d}%` }} />
                    <span className="cdn-slider-thumb" style={{ left: `${win.yes + win.d}%` }} />
                  </span>

                  <div className="cdn-stats">
                    <span>
                      <em>
                        <IconLayers />
                        TVL
                      </em>
                      <b>{SPOT.tvl}</b>
                    </span>
                    <span>
                      <em>
                        <IconActivity />
                        Vol 24h
                      </em>
                      <b>{win.vol}</b>
                    </span>
                    <span>
                      <em>
                        <IconZap />
                        Fees
                      </em>
                      <b>{SPOT.fees}</b>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          )}
        </div>
      </div>

      {/* full-screen close: the problem, centred */}
      <div className="cdn-finale" data-on={showFinale ? "true" : undefined} aria-live="polite">
        <p className="cdn-eyebrow">The problem</p>
        <h2 className="cdn-heading">
          <span className="cdn-h-a">Markets move simultaneously.</span>
          <span className="cdn-h-b">Human attention doesn&rsquo;t.</span>
        </h2>
        <p className="cdn-support">
          Edges expire in seconds. One trader can only watch so many markets at once.
        </p>
        <button type="button" className="cdn-replay" onClick={replay} aria-label="Try again">
          <IconReload />
        </button>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Styles (scoped by .cdn- prefix)                                      */
/* ------------------------------------------------------------------ */
const CSS = `
.cdn-problem {
  --cdn-bg: #ffffff;
  --cdn-card: #f4f4f5;
  --cdn-card-back: #ececee;
  --cdn-border: rgba(0,0,0,.08);
  --cdn-border-hi: rgba(0,0,0,.18);
  --cdn-text: #111113;
  --cdn-text-2: #3f3f46;
  --cdn-muted: #8a8a93;
  --cdn-accent: #3a7dd9;
  --cdn-ease: cubic-bezier(.35,.05,.2,1);

  position: relative;
  height: 100vh;
  max-height: 100vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: center;
  background: var(--cdn-bg);
  color: var(--cdn-text);
  font-family: var(--font-display), Georgia, "Times New Roman", serif;
  padding: clamp(64px, 9vh, 88px) clamp(20px, 5vw, 56px) clamp(20px, 4vh, 36px);
  -webkit-font-smoothing: antialiased;
}
.cdn-problem *, .cdn-problem *::before, .cdn-problem *::after { box-sizing: border-box; }

.cdn-inner {
  max-width: 1120px;
  width: 100%;
  margin: 0 auto;
  flex: 1;
  min-height: 0;
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  grid-template-rows: auto minmax(0, 1fr);
  gap: clamp(16px, 2.5vh, 28px);
  align-items: stretch;
  justify-items: center;
  transition: opacity .55s ease;
}
.cdn-problem[data-phase="ready"] .cdn-inner {
  align-items: center;
}
.cdn-problem[data-finale="true"] .cdn-inner {
  opacity: 0;
  pointer-events: none;
}

.cdn-stage {
  width: 100%;
  min-height: 0;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: opacity .55s ease;
}
.cdn-problem[data-phase="zoom"] .cdn-stage,
.cdn-problem[data-phase="zoom"] .cdn-grid {
  overflow: visible;
}

/* ---------- grid: 4 columns × 3 rows ---------- */
.cdn-grid {
  position: relative;
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  grid-template-rows: repeat(3, minmax(0, 1fr));
  gap: clamp(6px, 1vw, 12px);
  width: 100%;
  height: 100%;
  min-height: 0;
}

.cdn-cell {
  position: relative;
  min-height: 0;
  height: 100%;
  perspective: 900px;
  cursor: default;
  outline: none;
  -webkit-tap-highlight-color: transparent;
  transition: transform .35s var(--cdn-ease), opacity .6s ease;
}
.cdn-problem[data-phase="select"] .cdn-cell { cursor: pointer; }
.cdn-cell:focus-visible { outline: 1px solid rgba(0,0,0,.45); outline-offset: 3px; }

.cdn-flip {
  position: absolute; inset: 0;
  transform-style: preserve-3d;
}
.cdn-flip[data-flipped="true"] { transform: rotateY(180deg); }

.cdn-face {
  position: absolute; inset: 0;
  display: flex; flex-direction: column; justify-content: space-between;
  padding: clamp(9px, 1.15vw, 15px);
  border-radius: 10px;
  border: 1px solid var(--cdn-border);
  background: var(--cdn-card);
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
  transition: border-color .3s ease;
}
.cdn-back {
  background: var(--cdn-card-back);
  transform: rotateY(180deg);
  border-color: rgba(0,0,0,.12);
}

.cdn-name {
  font-size: clamp(0.82rem, 0.25vw + 0.75rem, 0.95rem);
  line-height: 1.25;
  font-weight: 400;
  letter-spacing: -.02em;
  color: var(--cdn-text-2);
}
.cdn-name-dim { color: var(--cdn-muted); }

.cdn-hint {
  font-size: 9.5px;
  letter-spacing: .02em;
  color: var(--cdn-muted);
  opacity: 0;
  transform: translateY(2px);
  transition: opacity .3s ease, transform .3s ease;
}

/* probabilities: real values and a masked twin share one slot */
.cdn-probs { display: grid; }
.cdn-probs > * { grid-area: 1 / 1; }
.cdn-vals {
  display: flex; justify-content: space-between; align-items: baseline;
  font-size: 12px;
  font-variant-numeric: tabular-nums;
  color: var(--cdn-text);
}
.cdn-vals i {
  font-style: normal;
  font-size: 9px;
  letter-spacing: .1em;
  text-transform: uppercase;
  color: var(--cdn-muted);
  margin-right: 3px;
}
.cdn-split {
  display: block;
  height: 2px;
  margin-top: 7px;
  border-radius: 2px;
  background: rgba(0,0,0,.08);
  overflow: hidden;
}
.cdn-split > span {
  display: block; height: 100%;
  background: rgba(0,0,0,.5);
  transform-origin: left center;
}
.cdn-probs-real { transition: opacity .7s ease; }
.cdn-probs-mask { opacity: 0; color: var(--cdn-muted); transition: opacity .7s ease; }
.cdn-probs-mask .cdn-vals { color: var(--cdn-muted); }
.cdn-problem[data-hidden="true"] .cdn-front .cdn-probs-real { opacity: 0; transition-duration: .2s; }
.cdn-problem[data-hidden="true"] .cdn-probs-mask { opacity: 1; transition-duration: .2s; }

.cdn-delta { color: var(--cdn-text); font-size: 11px; }
.cdn-delta-down { color: var(--cdn-muted); }

/* rings: quiet white for the visitor's pick, blue for the match (static mode) */
.cdn-ring, .cdn-pick {
  position: absolute; inset: -1px;
  border-radius: 11px;
  opacity: 0;
  pointer-events: none;
  transition: opacity .35s ease;
}
.cdn-ring { border: 1px solid var(--cdn-accent); box-shadow: 0 0 0 1px rgba(58,125,217,.16); }
.cdn-pick { border: 1px solid rgba(0,0,0,.55); }
.cdn-cell[data-picked="true"] .cdn-pick { opacity: 1; }
.cdn-problem[data-static="true"] .cdn-cell[data-match="true"] .cdn-ring { opacity: 1; }

/* ---------- zoom: others fade, the match grows to 50% ---------- */
.cdn-problem[data-dim="true"] .cdn-cell { opacity: .14; pointer-events: none; }
.cdn-problem[data-dim="true"] .cdn-pick { opacity: 0; }
.cdn-problem[data-dim="true"] .cdn-cell[data-match="true"] {
  opacity: 0;
  transition: transform .35s var(--cdn-ease), opacity 0s;
}

.cdn-spot-wrap {
  position: absolute; inset: 0;
  display: grid; place-items: center;
  pointer-events: none;
  z-index: 4;
  overflow: visible;
  padding: 4px;
}
.cdn-spot {
  --cdn-bull: #3a7dd9;
  position: relative;
  width: min(26rem, 92%);
  max-height: 100%;
  container-type: inline-size;
  border-radius: 22px;
  border: 1px solid rgba(0,0,0,.06);
  box-shadow: 0 12px 40px rgba(15, 23, 42, .08);
  background: #fff;
  opacity: 0;
  transition: opacity .45s ease;
}
.cdn-spot[data-on="true"] {
  opacity: 1;
  transition: none;
  animation: cdn-zoom .8s var(--cdn-ease) both;
}
@keyframes cdn-zoom {
  from { transform: translate(var(--dx, 0px), var(--dy, 0px)) scale(var(--s, 1)); }
  to   { transform: none; }
}
@keyframes cdn-fade { from { opacity: 0; } to { opacity: 1; } }

.cdn-spot-body {
  padding: clamp(16px, 5.2cqw, 22px);
  display: flex;
  flex-direction: column;
  gap: clamp(12px, 3.6cqw, 18px);
}
.cdn-spot[data-on="true"] .cdn-spot-body { animation: cdn-fade .5s ease .3s both; }

.cdn-spot-top { display: flex; align-items: center; justify-content: space-between; gap: 2cqw; }
.cdn-chips { display: flex; gap: 1.6cqw; min-width: 0; flex-wrap: wrap; }
.cdn-chip {
  font-size: clamp(8px, 2.6cqw, 10px);
  font-weight: 600;
  letter-spacing: .06em;
  text-transform: uppercase;
  white-space: nowrap;
  padding: .4em .75em;
  border-radius: 7px;
  color: #6b7280;
  background: #f3f4f6;
  border: 1px solid #e5e7eb;
}
.cdn-chip-tag {
  color: #3a7dd9;
  background: #e7f0fb;
  border-color: #c9dcf6;
}
.cdn-live {
  display: inline-flex; align-items: center; gap: .5em;
  font-size: clamp(8px, 2.6cqw, 10px);
  font-weight: 600;
  letter-spacing: .08em;
  text-transform: uppercase;
  padding: .4em .8em;
  border-radius: 99px;
  color: var(--cdn-bull);
  background: rgba(58,125,217,.08);
  border: 1px solid rgba(58,125,217,.28);
}
.cdn-live i { width: .55em; height: .55em; border-radius: 50%; background: var(--cdn-bull); }

.cdn-spot-title {
  margin: 0;
  font-size: clamp(1.25rem, 6.2cqw, 1.85rem);
  font-weight: 400;
  letter-spacing: -.03em;
  line-height: 1.12;
  color: var(--cdn-text);
}

.cdn-tiles { display: grid; grid-template-columns: 1fr 1fr; gap: 2.4cqw; }
.cdn-tile {
  display: flex; flex-direction: column; gap: 1.4cqw;
  padding: 3.2cqw 3.4cqw 3.6cqw;
  border-radius: clamp(10px, 3.2cqw, 14px);
  background: #f7f7f8;
  border: 1px solid #ececee;
}
.cdn-tile-bull { background: #e7f0fb; border-color: #c9dcf6; }
.cdn-tile-head {
  display: flex; align-items: center; gap: 2cqw;
  font-size: clamp(8px, 3cqw, 11px);
  font-weight: 600;
  letter-spacing: .12em;
  text-transform: uppercase;
  color: #6b7280;
}
.cdn-tile-ico {
  display: grid; place-items: center;
  width: clamp(18px, 6.6cqw, 26px);
  aspect-ratio: 1;
  border-radius: 8px;
  color: #9ca3af;
  background: #ececee;
}
.cdn-tile-ico svg { width: 58%; height: 58%; }
.cdn-tile-bull .cdn-tile-ico { color: var(--cdn-bull); background: #d6e7f8; }
.cdn-tile-pct {
  font-size: clamp(1.35rem, 8.5cqw, 2.15rem);
  font-weight: 400;
  letter-spacing: -.03em;
  font-variant-numeric: tabular-nums;
  color: #9ca3af;
}
.cdn-tile-bull .cdn-tile-pct { color: var(--cdn-bull); }

.cdn-slider {
  position: relative; display: block;
  height: clamp(6px, 1.8cqw, 8px);
  margin: 0.5cqw 0 1cqw;
  border-radius: 99px;
  background: #e7f0fb;
}
.cdn-slider-fill {
  position: absolute; left: 0; top: 0; bottom: 0;
  border-radius: inherit;
  background: #3a7dd9;
}
.cdn-slider-thumb {
  position: absolute; top: 50%;
  width: clamp(12px, 3.8cqw, 16px);
  aspect-ratio: 1;
  border-radius: 50%;
  background: #3a7dd9;
  border: 2px solid #fff;
  box-shadow: 0 1px 4px rgba(0,0,0,.12);
  transform: translate(-50%, -50%);
}

.cdn-stats {
  display: flex; justify-content: space-between; gap: 2cqw;
  padding-top: 1cqw;
}
.cdn-stats span { display: flex; flex-direction: column; gap: 1cqw; min-width: 0; }
.cdn-stats em {
  display: inline-flex; align-items: center; gap: 1.2cqw;
  font-style: normal;
  font-size: clamp(8px, 2.9cqw, 11px);
  color: #9ca3af;
  white-space: nowrap;
}
.cdn-stats em svg { width: 1.15em; height: 1.15em; flex: none; }
.cdn-stats b {
  font-size: clamp(11px, 3.8cqw, 15px);
  font-weight: 600;
  font-variant-numeric: tabular-nums;
  color: var(--cdn-text);
  white-space: nowrap;
}

/* ---------- hover (CSS only; never touches the timeline) ---------- */
@media (hover: hover) {
  .cdn-problem[data-phase="select"] .cdn-cell:hover { transform: translateY(-3px); z-index: 2; }
  .cdn-problem[data-phase="select"] .cdn-cell:hover .cdn-face { border-color: var(--cdn-border-hi); }
  .cdn-problem[data-phase="select"] .cdn-cell:hover .cdn-hint { opacity: 1; transform: none; }
}
@media (hover: none) { .cdn-hint { display: none; } }

/* ---------- copy: stacked in the same column, centred ---------- */
.cdn-copy {
  display: grid;
  align-items: center;
  justify-items: center;
  text-align: center;
  width: 100%;
}
.cdn-panel {
  grid-area: 1 / 1;
  opacity: 0;
  visibility: hidden;
  transform: translateY(8px);
  pointer-events: none;
  transition: opacity .45s ease, transform .45s var(--cdn-ease), visibility 0s .45s;
}
.cdn-panel[data-on="true"] {
  opacity: 1;
  visibility: visible;
  transform: none;
  pointer-events: auto;
  transition-delay: .25s, .25s, 0s;
}

.cdn-eyebrow {
  margin: 0 0 14px;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
  font-size: clamp(0.5625rem, 0.15vw + 0.5rem, 0.625rem);
  font-weight: 500;
  letter-spacing: .34em;
  text-transform: uppercase;
  color: var(--cdn-muted);
}
.cdn-heading {
  margin: 0;
  font-size: clamp(1.5rem, 3.6vw + 0.4rem, 3.5rem);
  line-height: 1.12;
  letter-spacing: -.03em;
  font-weight: 400;
  hyphens: none;
}
.cdn-heading span { display: block; }
.cdn-h-a { color: var(--cdn-muted); }
.cdn-h-b { color: var(--cdn-text); margin-top: .12em; }
.cdn-support {
  margin: 16px auto 0;
  max-width: 36ch;
  font-size: clamp(0.95rem, 0.55vw + 0.8rem, 1.25rem);
  line-height: 1.5;
  color: var(--cdn-muted);
}
.cdn-result-title {
  font-size: clamp(1.25rem, 1.4vw + 0.85rem, 2rem);
  letter-spacing: -.03em;
  line-height: 1.12;
}
.cdn-result-sub { margin-top: 10px; }

/* instructions */
.cdn-task-title {
  margin: 0;
  display: flex; align-items: center; justify-content: center; gap: .32em;
  font-size: clamp(1.5rem, 3.6vw + 0.4rem, 3.5rem);
  line-height: 1.12;
  letter-spacing: -.03em;
  font-weight: 400;
  color: var(--cdn-text);
}
.cdn-prep {
  position: relative;
  width: clamp(6.5rem, 14vw, 9.5rem);
  aspect-ratio: 1;
  display: grid;
  place-items: center;
}
.cdn-prep-ring {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  transform: rotate(-90deg);
}
.cdn-prep-track,
.cdn-prep-arc {
  fill: none;
  stroke-width: 1.75;
}
.cdn-prep-track { stroke: rgba(0,0,0,.1); }
.cdn-prep-arc {
  stroke: var(--cdn-text);
  stroke-linecap: round;
  stroke-dasharray: 289;
  stroke-dashoffset: 0;
}
.cdn-prep[data-run="true"] .cdn-prep-arc {
  animation: cdn-prep-drain linear forwards;
}
@keyframes cdn-prep-drain {
  from { stroke-dashoffset: 0; }
  to { stroke-dashoffset: 289; }
}
.cdn-prep-count {
  position: relative;
  z-index: 1;
  font-size: clamp(1.75rem, 3.2vw, 2.75rem);
  font-weight: 400;
  line-height: 1;
  letter-spacing: -.04em;
  font-variant-numeric: tabular-nums;
  color: var(--cdn-text);
}
.cdn-dot {
  flex: none;
  width: .2em; height: .2em; border-radius: 50%;
  background: var(--cdn-accent);
}
.cdn-task-body { margin-top: 12px; max-width: 36ch; }

.cdn-status {
  display: flex; justify-content: space-between; align-items: baseline;
  width: 100%;
  max-width: 340px;
  margin-top: 18px;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
  font-size: clamp(0.5625rem, 0.15vw + 0.5rem, 0.625rem);
  letter-spacing: .34em;
  text-transform: uppercase;
}
.cdn-status-label { color: var(--cdn-text); }
.cdn-count {
  font-size: inherit;
  letter-spacing: .02em;
  font-variant-numeric: tabular-nums;
  color: var(--cdn-muted);
  opacity: 0;
  transition: opacity .3s ease;
}
.cdn-problem[data-phase="select"] .cdn-count,
.cdn-problem[data-phase="picked"] .cdn-count { opacity: 1; }

.cdn-bar {
  display: block;
  position: relative;
  width: 100%;
  max-width: 340px;
  height: 1px;
  margin-top: 12px;
  background: rgba(0,0,0,.1);
  overflow: hidden;
}
.cdn-bar-fill {
  position: absolute; inset: 0;
  background: rgba(0,0,0,.75);
  transform-origin: left center;
}
.cdn-bar-fill[data-run="true"] { animation: cdn-drain linear both; }
.cdn-bar-fill[data-paused="true"] { animation-play-state: paused; }
@keyframes cdn-drain { from { transform: scaleX(1); } to { transform: scaleX(0); } }

.cdn-finale {
  position: absolute;
  inset: 0;
  z-index: 6;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: clamp(80px, 12vh, 140px) clamp(24px, 6vw, 80px);
  background: var(--cdn-bg);
  opacity: 0;
  visibility: hidden;
  pointer-events: none;
  transition: opacity .7s ease, visibility 0s .7s;
}
.cdn-finale[data-on="true"] {
  opacity: 1;
  visibility: visible;
  pointer-events: auto;
  transition: opacity .7s ease .08s, visibility 0s 0s;
}
.cdn-finale .cdn-eyebrow { margin-bottom: 18px; }
.cdn-finale .cdn-heading {
  font-size: clamp(1.5rem, 3.6vw + 0.4rem, 3.5rem);
  max-width: 18ch;
}
.cdn-finale .cdn-support {
  margin-left: auto;
  margin-right: auto;
  margin-top: 18px;
  max-width: 36ch;
  font-size: clamp(0.95rem, 0.55vw + 0.8rem, 1.25rem);
}

.cdn-replay {
  margin: 44px 0 0;
  width: 44px;
  height: 44px;
  padding: 0;
  display: grid;
  place-items: center;
  background: none;
  border: 0;
  color: var(--cdn-muted);
  cursor: pointer;
  border-radius: 50%;
  transition: color .25s ease, transform .4s var(--cdn-ease);
}
.cdn-replay svg { width: 22px; height: 22px; }
.cdn-replay:hover, .cdn-replay:focus-visible {
  color: var(--cdn-text);
  transform: rotate(-45deg);
  outline: none;
}

/* ---------- reduced motion ---------- */
.cdn-problem[data-static="true"] .cdn-flip,
.cdn-problem[data-static="true"] .cdn-cell,
.cdn-problem[data-static="true"] .cdn-ring,
.cdn-problem[data-static="true"] .cdn-panel,
.cdn-problem[data-static="true"] .cdn-inner { transition: none; }
@media (prefers-reduced-motion: reduce) {
  .cdn-cell, .cdn-flip, .cdn-ring, .cdn-pick, .cdn-hint, .cdn-panel, .cdn-inner, .cdn-stage, .cdn-finale, .cdn-replay { transition: none; }
  .cdn-spot[data-on="true"], .cdn-spot[data-on="true"] .cdn-spot-body,
  .cdn-prep-arc { animation: none; }
}

/* ---------- responsive ---------- */
@media (max-width: 1100px) {
  .cdn-name { font-size: clamp(0.75rem, 0.2vw + 0.7rem, 0.875rem); }
}
@media (max-width: 900px) {
  .cdn-inner { gap: 20px; }
}
@media (max-width: 640px) {
  .cdn-cell { min-height: 0; }
  .cdn-face { border-radius: 8px; padding: 7px; }
  .cdn-ring, .cdn-pick { border-radius: 9px; }
  .cdn-name { font-size: clamp(0.7rem, 2.4vw, 0.82rem); line-height: 1.2; }
  .cdn-vals { flex-direction: column; gap: 1px; font-size: 8.5px; }
  .cdn-vals i { font-size: 7px; letter-spacing: .06em; margin-right: 2px; }
  .cdn-split { margin-top: 5px; }
  .cdn-delta { font-size: 8.5px; }
  .cdn-spot { width: min(22rem, 96%); }
  .cdn-support { font-size: 14px; }
  .cdn-status { margin-top: 16px; }
  .cdn-eyebrow { margin-bottom: 12px; }
  .cdn-grid { gap: 5px; }
}
`;
