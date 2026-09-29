/**
 * Order-flow simulation from the Conduence "The problem" section.
 * Two lanes send orders through five gates; profit is illustrative.
 */

export type Side = "elsewhere" | "conduence";

type Step =
  | { kind: "act"; side: Side; len?: number }
  | { kind: "flip"; to: Side };

type Pt = [number, number];

type Path = { pts: Pt[]; cum: number[] };

export type RunOrder = {
  n: number;
  at: Pt;
  local: number;
  alpha: number;
  label: "A" | "S";
};

export type RunResult = {
  n: number;
  value: number;
  rise: number;
  alpha: number;
};

export type RunLane = {
  path: Path;
  orders: RunOrder[];
  results: RunResult[];
  profit: number;
  count: number;
  lead: number;
};

export type RunCharge = {
  gate: number;
  lane: number;
  u: number;
  amount: number;
  pop: number;
  pulse: number;
};

export type RunScene = {
  mode: Side;
  omni: boolean;
  k: number[];
  depth: { bid: number[]; ask: number[] };
  fillShift: number;
  lanes: RunLane[];
  charges: RunCharge[];
  line: number[];
  readout: { text: string; alpha: number } | null;
};

export const LANES_Y = [150, 290] as const;
export const LANE_NAMES = ["Retail trader", "Institution"] as const;
export const GATES = [230, 384, 538, 692, 846].map((u0) => ({ u0, u1: u0 + 140 }));
export const CATALYST_NODES = [
  { u: 269, side: -1 as const, label: "event" },
  { u: 315, side: 1 as const, label: "hear" },
] as const;
export const NODES = [
  { u: 424, side: -1 as const, label: "price" },
  { u: 464, side: 1 as const, label: "flow" },
  { u: 504, side: 0 as const, label: "read" },
] as const;
export const QUEUE_X = [621, 603, 585] as const;

const DEPTH_FIRST = [20, 14] as const;
const DEPTH_REST = [5, 12] as const;

const RETAIL_WAYPOINTS: Pt[] = [
  [0.15, 170],
  [0.42, 269],
  [0.95, 269],
  [1.85, 315],
  [2.4, 315],
  [2.65, 424],
  [3.15, 424],
  [3.35, 454],
  [3.85, 454],
  [4.05, 504],
  [4.55, 504],
  [4.85, 568],
  [5.65, 568],
  [5.95, 670],
  [6.18, 762],
  [6.65, 762],
  [7.0, 900],
  [7.25, 1010],
];

const DIRECT_WAYPOINTS: Pt[] = [
  [0.15, 170],
  [1.55, 1010],
];

const CHARGE_TABLE: Record<Side, { gate: number; lane: number; u: number; amount: number }[]> = {
  elsewhere: [
    { gate: 0, lane: 0, u: 345, amount: -4 },
    { gate: 1, lane: 0, u: 530, amount: -6 },
    { gate: 2, lane: 0, u: 620, amount: -5 },
    { gate: 3, lane: 0, u: 748, amount: -3 },
    { gate: 3, lane: 1, u: 770, amount: -1 },
    { gate: 4, lane: 0, u: 940, amount: -2 },
  ],
  conduence: [
    { gate: 3, lane: 0, u: 770, amount: -1 },
    { gate: 3, lane: 1, u: 770, amount: -1 },
  ],
};

export const ELSEWHERE_LEN = 9.4;

export const INITIAL_SCRIPT: Step[] = [
  { kind: "act", side: "elsewhere", len: ELSEWHERE_LEN },
  { kind: "flip", to: "conduence" },
  { kind: "act", side: "conduence" },
];

const schedules = new Map<string, { times: number[]; bursts: number }>();

function hash(a: number, b: number, c: number) {
  let n =
    Math.imul(a + 1, 0x9e3779b1) ^ Math.imul(b + 1, 0x85ebca77) ^ Math.imul(c + 1, 0xc2b2ae3d);
  n = Math.imul(n ^ (n >>> 15), 0x2c1b3c6d);
  n = Math.imul(n ^ (n >>> 12), 0x297a2d39);
  return ((n ^ (n >>> 15)) >>> 0) / 0x100000000;
}

function clamp(n: number) {
  return Math.min(1, Math.max(0, n));
}

function easeOut(n: number) {
  const t = clamp(n);
  return 1 - (1 - t) ** 3;
}

function depthBars(seed: number, salt: number) {
  const noise = (i: number) => {
    const x = seed * (1.6 + 0.3 * i);
    const cell = Math.floor(x);
    const f = x - cell;
    const left = hash(cell, i, salt);
    return left + (hash(cell + 1, i, salt) - left) * f * f * (3 - 2 * f);
  };
  const bars: number[] = [];
  for (let i = 0; i < 5; i++) {
    const [base, range] = i === 0 ? DEPTH_FIRST : DEPTH_REST;
    bars.push((i ? bars[i - 1] : 0) + base + range * noise(i));
  }
  return bars;
}

function orderProfit(mode: Side, lane: number, index: number) {
  return mode === "conduence" || lane === 1 ? 99 : Math.round(-50 + 120 * hash(index, 0, 1));
}

function orderLabel(mode: Side, lane: number, index: number): "A" | "S" {
  return hash(index, lane, mode === "conduence" ? 3 : 2) < 0.5 ? "A" : "S";
}

function stepDuration(step: Step) {
  if (step.kind === "act") return step.len ?? Number.POSITIVE_INFINITY;
  return step.to === "conduence" ? 0.5 : 0.3;
}

export function scriptFor(target: Side, current: Side): Step[] {
  const act: Step = { kind: "act", side: target };
  return target === current ? [act] : [{ kind: "flip", to: target }, act];
}

function polyline(pts: Pt[]): Path {
  const cum = [0];
  for (let i = 1; i < pts.length; i++) {
    cum.push(cum[i - 1] + Math.abs(pts[i][0] - pts[i - 1][0]) + Math.abs(pts[i][1] - pts[i - 1][1]));
  }
  return { pts, cum };
}

function lanePoints(lane: number, k: number[]): Pt[] {
  const y = LANES_Y[lane];
  const pts: Pt[] = [[170, y]];
  if (lane === 0) {
    const late = 34 * (1 - k[0]);
    pts.push([246, y], [246, y - late], [292, y - late], [292, y + late], [338, y + late], [338, y]);
    const bend = 34 * (1 - k[1]);
    pts.push([404, y], [404, y - bend], [444, y - bend], [444, y + bend], [484, y + bend], [484, y]);
  }
  // Institution keeps the Elsewhere route when the view switches to On Conduence.
  const opened = lane === 1 ? 0 : k[3];
  const fee = 30 * (1 - opened);
  pts.push([730, y], [730, y + fee], [795, y + fee], [795, y], [1010, y]);
  return pts;
}

function pointAlong(path: Path, dist: number): Pt {
  const s = Math.min(Math.max(dist, 0), path.cum[path.cum.length - 1]);
  let i = 1;
  while (i < path.cum.length - 1 && path.cum[i] < s) i++;
  const span = path.cum[i] - path.cum[i - 1] || 1;
  const t = (s - path.cum[i - 1]) / span;
  const a = path.pts[i - 1];
  const b = path.pts[i];
  return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
}

function xToDist(path: Path, x: number) {
  for (let i = 1; i < path.pts.length; i++) {
    const a = path.pts[i - 1];
    const b = path.pts[i];
    if (a[1] === b[1] && x >= a[0] && x <= b[0]) return path.cum[i - 1] + (x - a[0]);
  }
  return path.cum[path.cum.length - 1];
}

function timeToDist(path: Path, waypoints: Pt[], time: number) {
  const mapped = waypoints.map(([t, x]) => [t, xToDist(path, x)] as Pt);
  const last = mapped.length - 1;
  if (time <= mapped[0][0]) return mapped[0][1];
  for (let i = 1; i < mapped.length; i++) {
    const [t, dist] = mapped[i];
    if (time > t) continue;
    const [prevT, prevDist] = mapped[i - 1];
    const c = (time - prevT) / (t - prevT);
    const flatStart = i === 1 || mapped[i - 2][1] === prevDist;
    const flatEnd = i === last || mapped[i + 1][1] === dist;
    let h = c;
    if (flatStart && flatEnd) h = c * c * (3 - 2 * c);
    else if (flatStart) h = c * c * (2 - c);
    else if (flatEnd) h = 1 - (1 - c) ** 2 * (1 + c);
    return prevDist + (dist - prevDist) * h;
  }
  return mapped[last][1];
}

function orderTimes(mode: Side, lane: number, clock: number) {
  const retail = mode === "elsewhere" && lane === 0;
  const key = mode === "conduence" ? "conduence" : `elsewhere-${lane}`;
  let entry = schedules.get(key);
  if (!entry) {
    entry = { times: [], bursts: 0 };
    schedules.set(key, entry);
  }
  const { times } = entry;
  while (!times.length || times[times.length - 1] <= clock) {
    const burst = entry.bursts++;
    const last = times.length ? times[times.length - 1] : null;
    if (retail) {
      times.push(last === null ? 0 : last + 3.1 + 0.4 * hash(burst, 0, 11));
    } else {
      const start = last === null ? 0 : last + 0.4 + 0.8 * hash(burst, 1, 13);
      const roll = hash(burst, 1, 12);
      const count = roll < 0.4 ? 1 : roll < 0.7 ? 2 : 3;
      for (let i = 0; i < count; i++) times.push(start + 0.12 * i);
    }
  }
  return times;
}

function activeStep(script: Step[], time: number) {
  let step = script[script.length - 1];
  let local = time;
  let remaining = time;
  for (const next of script) {
    const dur = stepDuration(next);
    if (remaining < dur) {
      step = next;
      local = remaining;
      break;
    }
    remaining -= dur;
  }
  return { step, local };
}

export function money(n: number) {
  const rounded = Math.round(n);
  return `${rounded < 0 ? "\u2212" : ""}$${Math.abs(rounded).toLocaleString("en-US")}`;
}

export function signedMoney(n: number) {
  return `${n < 0 ? "\u2212" : "+"}$${Math.abs(n).toLocaleString("en-US")}`;
}

export function orderCount(n: number) {
  return n ? ` \u00b7 ${n} order${n === 1 ? "" : "s"}` : "";
}

export const RUN_COPY: Record<Side, string> = {
  elsewhere:
    "Elsewhere, an event happens and the retail trader hears it much later. The trader then builds a view from price, flow, and a read, and that takes time. Finding the setup takes longer. Sizing hesitates. The fill lands on a price that has already moved, so profit leaks at every step.",
  conduence:
    "On Conduence, catalyst, thesis, opportunity, size, and fill are already in line. You state the thesis, set the trigger, and own the agent. On trigger it decides against your rules, then the trade fires live or in demo.",
};

function newestOrder(orders: RunOrder[], from: number, to: number) {
  let chosen: RunOrder | null = null;
  for (const order of orders) {
    if (order.alpha < 0.08 || order.local < from || order.local > to) continue;
    if (!chosen || order.local < chosen.local) chosen = order;
  }
  return chosen;
}

export function computeScene(script: Step[], time: number): RunScene {
  const { step, local } = activeStep(script, time);
  let k = [0, 0, 0, 0, 0];
  let acting: Side | null = null;
  if (step.kind === "flip") {
    k =
      step.to === "conduence"
        ? k.map((_, i) => easeOut((local - 0.065 * i) / 0.21))
        : k.map((_, i) => 1 - easeOut((local - 0.025 * i) / 0.175));
  } else {
    acting = step.side;
    if (acting === "conduence") k = [1, 1, 1, 1, 1];
  }

  const mode: Side = step.kind === "flip" ? step.to : step.side;
  const clock = 1.1 * local;
  const fade = acting ? clamp((stepDuration(step) - local) / 0.2) : 0;

  const lanes = [0, 1].map((lane) => {
    const path = polyline(lanePoints(lane, k));
    if (!acting) {
      return { path, orders: [], results: [], profit: 0, count: 0, lead: 170 };
    }
    const laneMode: Side = lane === 1 ? "elsewhere" : acting;
    const waypoints = laneMode === "elsewhere" && lane === 0 ? RETAIL_WAYPOINTS : DIRECT_WAYPOINTS;
    const travel = waypoints[waypoints.length - 1][0];
    const times = orderTimes(laneMode, lane, clock);
    const at = (t: number) => pointAlong(path, timeToDist(path, waypoints, t));

    const orders: RunOrder[] = [];
    let count = 0;
    let profit = 0;
    for (let i = 0; times[i] <= clock; i++) {
      const age = clock - times[i];
      if (age >= travel) {
        count += 1;
        profit += orderProfit(laneMode, lane, i) * clamp((age - travel) / 0.25);
      }
      const alpha = clamp(age / 0.15) * (1 - clamp((age - travel) / 0.2)) * fade;
      if (alpha > 0) {
        orders.push({
          n: i,
          at: at(age),
          local: age,
          alpha,
          label: orderLabel(laneMode, lane, i),
        });
      }
    }

    const results: RunResult[] = [];
    for (let i = Math.max(0, count - 6); i < count; i++) {
      const since = clock - times[i] - travel;
      const rise = 16 * since;
      const alpha = (1 - clamp((since - 0.5) / 0.4)) * fade;
      const value = orderProfit(laneMode, lane, i);
      const prev = results[results.length - 1];
      if (i > 0 && prev && times[i] - times[i - 1] < 0.2) {
        prev.value += value;
        prev.rise = rise;
        prev.alpha = alpha;
      } else {
        results.push({ n: i, value, rise, alpha });
      }
    }

    return {
      path,
      orders,
      results: results.filter((item) => item.alpha > 0),
      profit,
      count,
      lead: at(clock)[0],
    };
  });

  const charges = (acting ? CHARGE_TABLE[acting] : []).map((charge) => {
    const lane = lanes[charge.lane];
    let pulse = 0;
    for (const order of lane.orders) {
      const dx = order.at[0] - charge.u;
      if (dx >= 0) pulse = Math.max(pulse, (1 - clamp(dx / 60)) * order.alpha);
    }
    return {
      ...charge,
      pop: clamp((lane.lead - charge.u) / 24) * fade,
      pulse,
    };
  });

  let fillShift = 0;
  if (acting === "elsewhere") {
    for (const order of lanes[0].orders) {
      if (order.alpha < 0.05) continue;
      const on = clamp((order.local - 6.8) / 0.2);
      const off = clamp((order.local - 7.15) / 0.18);
      fillShift = Math.max(fillShift, on * (1 - off) * 20);
    }
  }

  const open = 1 - k[2];
  const line = QUEUE_X.map((_, index) => {
    if (acting !== "elsewhere") return open;
    const order = newestOrder(lanes[0].orders, 4.75, 5.85);
    if (!order) return open;
    const start = 4.95 + 0.22 * (2 - index);
    return (0.18 + 0.82 * clamp((order.local - start) / 0.14)) * open;
  });

  const gap = Math.abs(lanes[1].profit - lanes[0].profit);
  return {
    mode,
    omni: k.every((value) => value >= 0.5),
    k,
    depth: { bid: depthBars(time, 7), ask: depthBars(time, 8) },
    fillShift,
    lanes,
    charges,
    line,
    readout: acting
      ? {
          text: `${money(gap)} apart`,
          alpha: clamp((clock - DIRECT_WAYPOINTS[DIRECT_WAYPOINTS.length - 1][0]) / 0.2) * fade,
        }
      : null,
  };
}
