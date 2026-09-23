"use client";

import { Fragment, useEffect, useRef, useState, type CSSProperties } from "react";

import { ProblemSection } from "@/components/landing/ProblemSection";
import {
  GATES,
  INITIAL_SCRIPT,
  LANES_Y,
  NODES,
  QUEUE_X,
  RUN_COPY,
  computeScene,
  money,
  orderCount,
  scriptFor,
  signedMoney,
  type RunScene,
  type Side,
} from "@/components/landing/conduence-run";

const BLOCKS = [
  { title: "Getting in", conduenceTitle: "The Memory" },
  { title: "The feed tier", conduenceTitle: "The Trigger" },
  { title: "Place in line", conduenceTitle: "The Agent" },
  { title: "The fee", conduenceTitle: "The Decision" },
  { title: "The sold order", conduenceTitle: "The Execution" },
] as const;

const TABS: Record<Side, string> = {
  elsewhere: "Elsewhere",
  conduence: "On Conduence",
};

const TITLE = "Your experience depends on who you are.";

const MAP = {
  h: (x: number, y: number): [number, number] => [x, y],
  v: (x: number, y: number): [number, number] => [y + 110, (x - 130) * 0.8],
};

const VIEW = {
  h: "0 0 1200 380",
  v: "0 0 500 830",
};

function vars(entries: Record<string, string | number>): CSSProperties {
  return entries as CSSProperties;
}

function SplitTitle({ text, accent }: { text: string; accent: string }) {
  const words = text.split(" ");
  let index = 0;
  return (
    <>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
        {words.map((word, wordIndex) => {
          const chars = [...word].map((char) => {
            const node = (
              <span key={index} className="rv rv-char" style={vars({ "--i": index })}>
                {char}
              </span>
            );
            index += 1;
            return node;
          });
          return (
            <Fragment key={word}>
              {wordIndex > 0 ? " " : null}
              <span className="rv-word">
                {word === accent ? <em className="accent">{chars}</em> : chars}
              </span>
            </Fragment>
          );
        })}
      </span>
    </>
  );
}

function RunDiagram({
  orient,
  scene,
  names,
}: {
  orient: "h" | "v";
  scene: RunScene;
  names: readonly string[];
}) {
  const map = MAP[orient];
  const wide = orient === "h";
  const hatch = `ob-run-hatch-${orient}`;
  const bend = 34 * (1 - scene.k[0]);
  const sold = 40 * (1 - scene.k[4]);

  const box = (x0: number, y0: number, x1: number, y1: number) => {
    const [ax, ay] = map(x0, y0);
    const [bx, by] = map(x1, y1);
    return {
      x: Math.min(ax, bx),
      y: Math.min(ay, by),
      width: Math.abs(bx - ax),
      height: Math.abs(by - ay),
    };
  };

  const line = (x0: number, y0: number, x1: number, y1: number) => {
    const [ax, ay] = map(x0, y0);
    const [bx, by] = map(x1, y1);
    return { x1: ax, y1: ay, x2: bx, y2: by };
  };

  const square = (x: number, y: number, size: number, scale = 1) => {
    const [mx, my] = map(x, y);
    return {
      x: -size / 2,
      y: -size / 2,
      width: size,
      height: size,
      transform: `translate(${mx} ${my}) scale(${scale})`,
    };
  };

  return (
    <svg
      className={`run-svg run-svg--${orient}`}
      viewBox={VIEW[orient]}
      data-mode={scene.omni ? "conduence" : "elsewhere"}
      role="img"
      aria-label={RUN_COPY[scene.mode]}
    >
      <defs>
        <pattern id={hatch} width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <line x1="0" y1="0" x2="0" y2="6" className="run-hatch" />
        </pattern>
      </defs>

      {GATES.map((gate, index) => {
        const [gx, gy] = map(gate.u0, 40);
        return (
          <g
            key={gate.u0}
            className="run-gate"
            data-omni={scene.k[index] >= 0.5 ? true : undefined}
            style={vars({ "--i": index })}
          >
            <rect {...box(gate.u0, 40, gate.u1, 370)} className="run-gate-box rv run-gate-in" />
            <text
              {...(wide ? { x: gx + 12, y: gy + 20 } : { x: 8, y: gy + 16 })}
              className="run-text run-num rv run-gate-mark"
            >
              {String(index + 1).padStart(2, "0")}
            </text>
            <text
              {...(wide ? { x: gx + 12, y: gy + 36 } : { x: 8, y: gy + 30 })}
              className="run-text run-name rv run-gate-mark"
            >
              {names[index]}
            </text>

            {index === 0 ? (
              <g className="rv run-detail">
                <g opacity={1 - scene.k[0]}>
                  {NODES.map((node) => {
                    const y = LANES_Y[0] + node.side * bend;
                    const [nx, ny] = map(node.u, y);
                    const label = wide
                      ? {
                          x: nx,
                          y: node.side === 1 ? ny + 18 : ny - (node.side ? 10 : 13),
                          textAnchor: "middle" as const,
                        }
                      : node.side === -1
                        ? { x: nx - 9, y: ny + 3.5, textAnchor: "end" as const }
                        : { x: nx + 9, y: ny + 3.5 };
                    return (
                      <Fragment key={node.label}>
                        <rect {...square(node.u, y, 8)} className="run-node" />
                        <text {...label} className="run-text run-tag">
                          {node.label}
                        </text>
                      </Fragment>
                    );
                  })}
                  {(() => {
                    const [cx, cy] = map(300, LANES_Y[1]);
                    return (
                      <text
                        className="run-text run-tag"
                        {...(wide
                          ? { x: cx, y: cy - 14, textAnchor: "middle" as const }
                          : { x: cx + 12, y: cy + 3.5 })}
                      >
                        colocated
                      </text>
                    );
                  })()}
                </g>
              </g>
            ) : null}

            {index === 1
              ? (["bid", "ask"] as const).map((side) =>
                  scene.depth[side].map((depth, level) => {
                    const dir = side === "bid" ? -1 : 1;
                    const inner = (gate.u0 + gate.u1) / 2 + (4 * dir) / 2;
                    const outer = inner + dir * depth * 0.58;
                    const top = LANES_Y[0] - 11 - 9 * level;
                    const bottom = LANES_Y[1] + 11 + 9 * level;
                    const klass = `run-bar run-bar--${side}`;
                    return (
                      <g key={`${side}-${level}`} className="rv run-detail">
                        {level === 0 ? (
                          <rect {...box(inner, top - 6, outer, top)} className={klass} />
                        ) : (
                          <>
                            <rect {...box(inner, top - 6, outer, top)} fill={`url(#${hatch})`} className="run-bar-hatch" />
                            <rect {...box(inner, top - 6, outer, top)} className={klass} opacity={scene.k[1]} />
                          </>
                        )}
                        <rect {...box(inner, bottom, outer, bottom + 6)} className={klass} />
                      </g>
                    );
                  }),
                )
              : null}

            {index === 3 ? (
              <g className="rv run-detail">
                <g opacity={1 - scene.k[3]}>
                  <line {...line(712, LANES_Y[0] - 30, 812, LANES_Y[0] - 30)} className="run-rung" />
                  <line {...line(712, LANES_Y[1] + 30, 812, LANES_Y[1] + 30)} className="run-rung" />
                </g>
              </g>
            ) : null}
          </g>
        );
      })}

      {scene.lanes.map((lane, index) => (
        <path
          key={index}
          d={lane.path.pts.map((pt, i) => `${i ? "L" : "M"} ${map(pt[0], pt[1]).join(" ")}`).join(" ")}
          data-lane={index === 0 ? "retail" : "institution"}
          className="run-pipe rv run-pipe-in"
          style={vars({ "--i": index, "--len": lane.path.cum[lane.path.cum.length - 1] })}
        />
      ))}

      {QUEUE_X.map((x, index) =>
        scene.line[index] > 0.01 ? (
          <rect
            key={x}
            {...square(x, LANES_Y[0], 10, scene.line[index])}
            className="run-queued rv run-detail"
            style={vars({ "--i": 2 })}
          />
        ) : null,
      )}

      {scene.charges.map((charge) => {
        if (charge.pop <= 0) return null;
        const [x, y] = map(
          GATES[charge.gate].u1 - 10,
          charge.lane === 0 ? LANES_Y[0] - 52 : LANES_Y[1] + 56,
        );
        return (
          <text
            key={`${charge.gate}-${charge.lane}`}
            x={x}
            y={y + (1 - charge.pop) * 6 - 2 * charge.pulse}
            opacity={charge.pop * (0.55 + 0.45 * charge.pulse)}
            textAnchor="end"
            className={`run-charge run-charge--${charge.amount < 0 ? "loss" : "gain"}`}
          >
            {signedMoney(charge.amount)}
          </text>
        );
      })}

      {scene.lanes.map((lane, laneIndex) =>
        lane.orders.map((order) => {
          const [x, y] = map(order.at[0], order.at[1]);
          return (
            <g
              key={`${laneIndex}-${order.n}`}
              data-lane={laneIndex === 0 ? "retail" : "institution"}
              transform={`translate(${x} ${y})`}
              opacity={order.alpha}
            >
              <rect x={-9} y={-6.5} width={18} height={13} className="run-order" />
              <text y={3.2} textAnchor="middle" className="run-order-label">
                {order.label}
              </text>
            </g>
          );
        }),
      )}

      {sold > 0.5 ? (
        <g className="rv run-detail" style={vars({ "--i": 4 })}>
          <rect {...box(915 - sold, LANES_Y[0] - 22, 915 + sold, LANES_Y[0] + 22)} className="run-box" />
          <rect
            {...box(915 - sold, LANES_Y[0] - 22, 915 + sold, LANES_Y[0] + 22)}
            fill={`url(#${hatch})`}
            className="run-box-edge"
          />
        </g>
      ) : null}

      {scene.lanes.map((lane, laneIndex) =>
        lane.results.map((result) => {
          const [x, y] = map(1010, LANES_Y[laneIndex]);
          return (
            <text
              key={`r${laneIndex}-${result.n}`}
              {...(wide
                ? { x, y: y - 16 - result.rise, textAnchor: "middle" as const }
                : { x: x + 14, y: y + 4 - result.rise })}
              opacity={result.alpha}
              className={`run-charge run-charge--${result.value < 0 ? "loss" : "gain"}`}
            >
              {signedMoney(result.value)}
            </text>
          );
        }),
      )}

      {LANES_Y.map((y, index) => {
        const [ox, oy] = map(170, y);
        const [px] = map(1030, y);
        const lane = scene.lanes[index];
        return (
          <g key={y} style={vars({ "--i": index })}>
            <g className="rv run-origin-in">
              <rect {...square(170, y, 12)} className="run-origin" />
            </g>
            <text
              className="run-text run-lane rv run-lane-in"
              {...(wide ? { x: 0, y: oy + 4.5 } : { x: ox, y: oy - 16, textAnchor: "middle" as const })}
            >
              {index === 0 ? "Retail trader" : "Institution"}
            </text>
            {wide ? (
              <>
                <text x={px} y={y - 32} className="run-text run-tag rv run-profit-mark">
                  Profit{orderCount(lane.count)}
                </text>
                <rect
                  {...box(1030, y - 24, 1190, y + 24)}
                  data-lane={index === 0 ? "retail" : "institution"}
                  className="run-profit-box rv run-profit-in"
                />
                <text
                  x={px + 16}
                  y={y + 8}
                  data-lane={index === 0 ? "retail" : "institution"}
                  className={`run-profit rv run-profit-mark ${lane.profit < 0 ? "run-profit--loss" : "run-profit--gain"}`}
                >
                  {money(lane.profit)}
                </text>
              </>
            ) : (
              <>
                <rect
                  x={ox - 60}
                  y={716}
                  width={120}
                  height={50}
                  data-lane={index === 0 ? "retail" : "institution"}
                  className="run-profit-box rv run-profit-in"
                />
                <text
                  x={ox}
                  y={748}
                  textAnchor="middle"
                  data-lane={index === 0 ? "retail" : "institution"}
                  className={`run-profit rv run-profit-mark ${lane.profit < 0 ? "run-profit--loss" : "run-profit--gain"}`}
                >
                  {money(lane.profit)}
                </text>
                <text x={ox} y={784} textAnchor="middle" className="run-text run-tag rv run-profit-mark">
                  Profit{orderCount(lane.count)}
                </text>
              </>
            )}
          </g>
        );
      })}

      {scene.readout && scene.readout.alpha > 0 ? (
        <text
          {...(wide
            ? { x: 1110, y: (LANES_Y[0] + LANES_Y[1]) / 2 + 4 }
            : { x: (LANES_Y[0] + LANES_Y[1]) / 2 + 110, y: 818 })}
          textAnchor="middle"
          opacity={scene.readout.alpha}
          className="run-text run-readout"
        >
          {scene.readout.text}
        </text>
      ) : null}
    </svg>
  );
}

export function ConduenceProblemClient() {
  const rootRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const timeRef = useRef(0);
  const scriptRef = useRef(INITIAL_SCRIPT);
  const [script, setScript] = useState(INITIAL_SCRIPT);
  const [time, setTime] = useState(0);
  const [reveal, setReveal] = useState<"wait" | "in" | undefined>("wait");
  const [started, setStarted] = useState(false);
  const [stageInView, setStageInView] = useState(false);
  const [reduced, setReduced] = useState(false);
  const [capped, setCapped] = useState(false);
  const [spotOn, setSpotOn] = useState(false);
  const [spotIn, setSpotIn] = useState(false);
  const [spotLive, setSpotLive] = useState(false);
  const [spotRun, setSpotRun] = useState(0);

  useEffect(() => {
    scriptRef.current = script;
  }, [script]);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const timeouts: number[] = [];
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || !("IntersectionObserver" in window)) {
      const frame = requestAnimationFrame(() => {
        timeRef.current = 5.5;
        setScript(scriptFor("elsewhere", "elsewhere"));
        setReduced(true);
        setReveal(undefined);
        setTime(5.5);
      });
      return () => cancelAnimationFrame(frame);
    }

    const revealObserver = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        revealObserver.disconnect();
        setReveal("in");
        timeouts.push(window.setTimeout(() => setStarted(true), 1500));
        timeouts.push(window.setTimeout(() => setReveal(undefined), 2500));
      },
      { rootMargin: "0px 0px -25% 0px" },
    );
    const stageObserver = new IntersectionObserver(([entry]) => {
      setStageInView(entry.isIntersecting);
      if (!entry.isIntersecting) {
        timeRef.current = 0;
        setScript(INITIAL_SCRIPT);
        setTime(0);
        setCapped(false);
      }
    });

    revealObserver.observe(root);
    if (stageRef.current) stageObserver.observe(stageRef.current);
    return () => {
      revealObserver.disconnect();
      stageObserver.disconnect();
      timeouts.forEach((id) => window.clearTimeout(id));
    };
  }, []);

  useEffect(() => {
    if (!started || !stageInView || reduced || capped) return;
    const profitAt = (t: number) => Math.max(...computeScene(script, t).lanes.map((lane) => lane.profit));
    let frame = 0;
    let last = performance.now();
    const tick = (now: number) => {
      const dt = Math.min(now - last, 50) / 1000;
      last = now;
      let next = timeRef.current + dt;
      if (profitAt(next) >= 999_000) {
        let lo = timeRef.current;
        for (let i = 0; i < 12; i++) {
          const mid = (lo + next) / 2;
          if (profitAt(mid) >= 999_000) next = mid;
          else lo = mid;
        }
        timeRef.current = next;
        setTime(next);
        setCapped(true);
        return;
      }
      timeRef.current = next;
      setTime(next);
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [started, stageInView, reduced, capped, script]);

  const closeSpot = () => {
    setSpotIn(false);
    setSpotLive(false);
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.setTimeout(() => setSpotOn(false), reduce ? 0 : 700);
  };

  useEffect(() => {
    if (!spotOn) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let frame = 0;
    let liveTimer = 0;
    if (reduce) {
      setSpotIn(true);
      setSpotLive(true);
    } else {
      frame = requestAnimationFrame(() => setSpotIn(true));
      liveTimer = window.setTimeout(() => setSpotLive(true), 720);
    }
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeSpot();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      cancelAnimationFrame(frame);
      window.clearTimeout(liveTimer);
      window.removeEventListener("keydown", onKey);
    };
  }, [spotOn]);

  const startSpot = () => {
    setSpotRun((n) => n + 1);
    setSpotOn(true);
  };

  const choose = (side: Side) => {
    const current = computeScene(scriptRef.current, timeRef.current).omni ? "conduence" : "elsewhere";
    timeRef.current = reduced ? 5.5 : 0;
    setCapped(false);
    setScript(scriptFor(side, current));
    setTime(timeRef.current);
  };

  const scene = computeScene(script, time);
  const names = BLOCKS.map((block, index) =>
    scene.k[index] >= 0.5 ? block.conduenceTitle : block.title,
  );

  return (
    <>
    <section className="ob-problem" aria-label="The problem">
    <div className="ob-wrap">
    <div className="run" ref={rootRef} data-reveal={reveal}>
      <div className="problem-head">
        <p className="eyebrow rv rv-eyebrow">The problem</p>
        <button type="button" className="try-it rv rv-eyebrow" onClick={startSpot}>
          Feel the problem firsthand
        </button>
      </div>
      <h2 className="h2 h2--lg">
        <SplitTitle text={TITLE} accent="who" />
      </h2>
      <p className="lede lede--lg rv rv-lede">
        Two traders, same order, same second. One gets in first, sees more, pays less.
      </p>
      <div className="rv run-cells">
        <div className="run-stage" ref={stageRef}>
          <div className="run-toolbar">
            <div className="run-tabs rv" role="group" aria-label="Compare">
              {(["elsewhere", "conduence"] as const).map((side) => (
                <button
                  key={side}
                  type="button"
                  data-side={side}
                  aria-pressed={scene.mode === side}
                  className={scene.mode === side ? "is-on" : undefined}
                  onClick={() => choose(side)}
                >
                  {TABS[side]}
                </button>
              ))}
            </div>
            <p className="run-note rv">Illustrative · $100 potential profit per order</p>
          </div>
          <RunDiagram orient="h" scene={scene} names={names} />
          <RunDiagram orient="v" scene={scene} names={names} />
        </div>
      </div>
    </div>
    </div>
    </section>
    {spotOn ? (
      <div
        className="ob-spot"
        data-open={spotIn || undefined}
        role="dialog"
        aria-modal="true"
        aria-label="Feel the problem firsthand"
      >
        <button type="button" className="ob-spot-close" onClick={closeSpot}>
          Close
        </button>
        <ProblemSection key={spotRun} forceActive={spotLive} />
      </div>
    ) : null}
    </>
  );
}
