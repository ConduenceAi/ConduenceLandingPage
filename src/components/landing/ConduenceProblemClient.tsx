"use client";

import { Fragment, useEffect, useRef, useState } from "react";

import { ProblemSection } from "@/components/landing/ProblemSection";
import {
  CATALYST_NODES,
  ELSEWHERE_LEN,
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
  { title: "Catalyst", conduenceTitle: "Catalyst" },
  { title: "Thesis", conduenceTitle: "Thesis" },
  { title: "Opportunity", conduenceTitle: "Opportunity" },
  { title: "Size", conduenceTitle: "Size" },
  { title: "Fill", conduenceTitle: "Fill" },
] as const;

const TABS: Record<Side, string> = {
  elsewhere: "Elsewhere",
  conduence: "On Conduence",
};

const TITLE = "Your experience depends on where you are.";

const MAP = {
  h: (x: number, y: number): [number, number] => [x, y],
  v: (x: number, y: number): [number, number] => [y + 110, (x - 130) * 0.8],
};

const VIEW = {
  h: "0 0 1200 260",
  v: "0 0 380 830",
};

const GATE_TOP = 40;
const GATE_BOTTOM = 240;

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
  const late = 34 * (1 - scene.k[0]);
  const bend = 34 * (1 - scene.k[1]);
  const sold = 40 * (1 - scene.k[4]);
  const fillSlide = scene.fillShift;

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

  const hops = (
    nodes: readonly { u: number; side: -1 | 0 | 1; label: string }[],
    hop: number,
  ) =>
    nodes.map((node) => {
      const y = LANES_Y[0] + node.side * hop;
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
    });

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
        const [gx, gy] = map(gate.u0, GATE_TOP);
        return (
          <g
            key={gate.u0}
            className="run-gate"
            data-omni={scene.k[index] >= 0.5 ? true : undefined}
          >
            <rect {...box(gate.u0, GATE_TOP, gate.u1, GATE_BOTTOM)} className="run-gate-box" />
            <text
              {...(wide ? { x: gx + 12, y: gy + 20 } : { x: 8, y: gy + 16 })}
              className="run-text run-num"
            >
              {String(index + 1).padStart(2, "0")}
            </text>
            <text
              {...(wide ? { x: gx + 12, y: gy + 36 } : { x: 8, y: gy + 30 })}
              className="run-text run-name"
            >
              {names[index]}
            </text>

            {index === 0 ? <g>{hops(CATALYST_NODES, late)}</g> : null}

            {index === 1 ? <g>{hops(NODES, bend)}</g> : null}

            {index === 3 ? (
              <g>
                {( ["bid", "ask"] as const).map((side) =>
                  scene.depth[side].map((depth, level) => {
                    const dir = side === "bid" ? -1 : 1;
                    const inner = (gate.u0 + gate.u1) / 2 + (4 * dir) / 2;
                    const outer = inner + dir * depth * 0.58;
                    const top = LANES_Y[0] - 11 - 9 * level;
                    return (
                      <rect
                        key={`${side}-${level}`}
                        {...box(inner, top - 6, outer, top)}
                        className={`run-bar run-bar--${side}`}
                      />
                    );
                  }),
                )}
                <g opacity={1 - scene.k[3]}>
                  <line {...line(712, LANES_Y[0] + 30, 812, LANES_Y[0] + 30)} className="run-rung" />
                </g>
              </g>
            ) : null}
          </g>
        );
      })}

      {scene.lanes.map((lane, index) =>
        index === 0 ? (
          <path
            key={index}
            d={lane.path.pts.map((pt, i) => `${i ? "L" : "M"} ${map(pt[0], pt[1]).join(" ")}`).join(" ")}
            data-lane="retail"
            className="run-pipe"
          />
        ) : null,
      )}

      {QUEUE_X.map((x, index) =>
        scene.line[index] > 0.01 ? (
          <rect
            key={x}
            {...square(x, LANES_Y[0], 10, scene.line[index])}
            className="run-queued"
          />
        ) : null,
      )}

      {scene.charges.map((charge) => {
        if (charge.lane !== 0 || charge.pop <= 0) return null;
        const [x, y] = map(GATES[charge.gate].u1 - 10, LANES_Y[0] - 52);
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
        laneIndex === 0
          ? lane.orders.map((order) => {
          const [x, y] = map(order.at[0], order.at[1]);
          return (
            <g
              key={`${laneIndex}-${order.n}`}
              data-lane="retail"
              transform={`translate(${x} ${y})`}
              opacity={order.alpha}
            >
              <rect x={-9} y={-6.5} width={18} height={13} className="run-order" />
              <text y={3.2} textAnchor="middle" className="run-order-label">
                {order.label}
              </text>
            </g>
          );
        })
          : null,
      )}

      {sold > 0.5 ? (
        <g>
          <rect
            {...box(915 - sold + fillSlide, LANES_Y[0] - 22, 915 + sold + fillSlide, LANES_Y[0] + 22)}
            className="run-box"
          />
          <rect
            {...box(915 - sold + fillSlide, LANES_Y[0] - 22, 915 + sold + fillSlide, LANES_Y[0] + 22)}
            fill={`url(#${hatch})`}
            className="run-box-edge"
          />
        </g>
      ) : null}

      {scene.lanes.map((lane, laneIndex) =>
        laneIndex === 0
          ? lane.results.map((result) => {
          const [x, y] = map(1010, LANES_Y[0]);
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
        })
          : null,
      )}

      {LANES_Y.map((y, index) => {
        if (index !== 0) return null;
        const [ox, oy] = map(170, y);
        const [px] = map(1030, y);
        const lane = scene.lanes[0];
        return (
          <g key={y}>
            <rect {...square(170, y, 12)} className="run-origin" />
            <text
              className="run-text run-lane"
              {...(wide ? { x: 0, y: oy + 4.5 } : { x: ox, y: oy - 16, textAnchor: "middle" as const })}
            >
              Retail trader
            </text>
            {wide ? (
              <>
                <text x={px} y={y - 32} className="run-text run-tag">
                  Profit{orderCount(lane.count)}
                </text>
                <rect
                  {...box(1030, y - 24, 1190, y + 24)}
                  data-lane="retail"
                  className="run-profit-box"
                />
                <text
                  x={px + 16}
                  y={y + 8}
                  data-lane="retail"
                  className={`run-profit ${lane.profit < 0 ? "run-profit--loss" : "run-profit--gain"}`}
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
                  data-lane="retail"
                  className="run-profit-box"
                />
                <text
                  x={ox}
                  y={748}
                  textAnchor="middle"
                  data-lane="retail"
                  className={`run-profit ${lane.profit < 0 ? "run-profit--loss" : "run-profit--gain"}`}
                >
                  {money(lane.profit)}
                </text>
                <text x={ox} y={784} textAnchor="middle" className="run-text run-tag">
                  Profit{orderCount(lane.count)}
                </text>
              </>
            )}
          </g>
        );
      })}
    </svg>
  );
}

export function ConduenceProblemClient() {
  const stageRef = useRef<HTMLDivElement>(null);
  const timeRef = useRef(0);
  const scriptRef = useRef(INITIAL_SCRIPT);
  const [script, setScript] = useState(INITIAL_SCRIPT);
  const [time, setTime] = useState(0);
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
    const stage = stageRef.current;
    if (!stage) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || !("IntersectionObserver" in window)) {
      const frame = requestAnimationFrame(() => {
        timeRef.current = ELSEWHERE_LEN;
        setScript(scriptFor("elsewhere", "elsewhere"));
        setReduced(true);
        setTime(ELSEWHERE_LEN);
      });
      return () => cancelAnimationFrame(frame);
    }

    const stageObserver = new IntersectionObserver(([entry]) => {
      setStageInView(entry.isIntersecting);
      if (entry.isIntersecting) {
        setStarted(true);
      } else {
        timeRef.current = 0;
        setScript(INITIAL_SCRIPT);
        setTime(0);
        setCapped(false);
      }
    });

    stageObserver.observe(stage);
    return () => stageObserver.disconnect();
  }, []);

  useEffect(() => {
    if (!started || !stageInView || reduced || capped) return;
    const profitAt = (t: number) => computeScene(script, t).lanes[0].profit;
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
    timeRef.current = reduced ? ELSEWHERE_LEN : 0;
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
    <div className="run">
      <div className="problem-head">
        <h2 className="h2 h2--lg">{TITLE}</h2>
        <button type="button" className="try-it" onClick={startSpot}>
          Feel the problem firsthand
        </button>
      </div>
      <p className="lede lede--lg">
        The gap between institutions and retail traders is not talent, it's Infrastructure.
      </p>
      <div className="run-cells">
        <div className="run-stage" ref={stageRef}>
          <div className="run-toolbar">
            <div className="run-tabs" role="group" aria-label="Compare">
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
