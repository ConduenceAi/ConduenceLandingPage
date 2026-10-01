"use client";

import { motion, useInView } from "framer-motion";
import { useCallback, useEffect, useId, useLayoutEffect, useRef, useState, type KeyboardEvent, type PointerEvent as ReactPointerEvent, type Ref } from "react";

import { cn } from "@/lib/utils";

const EASE = [0.22, 1, 0.36, 1] as const;
const ACCENT = "#48A8D0";
const MIN_FEEDS = 4;
const MAX_FEEDS = 8;
const SIGNALS_PER_FEED = 10;

const PREDICTION = [
  { id: "fed", name: "Fed cut by June", meta: "64¢" },
  { id: "btc", name: "BTC above 100k", meta: "41¢" },
  { id: "election", name: "Election night", meta: "52¢" },
  { id: "recession", name: "Recession odds", meta: "28¢" },
] as const;

const ANALYSIS = [
  { id: "news", name: "News wire", meta: "headlines" },
  { id: "wallets", name: "Wallet flow", meta: "3 flows" },
  { id: "social", name: "X / social", meta: "142" },
  { id: "filings", name: "Filings", meta: "2 notes" },
] as const;

const HARNESS = [
  { name: "Agents", hint: "Wake on the event" },
  { name: "Tools", hint: "Markets, news, wallets" },
  { name: "Loops", hint: "Run until it holds" },
  { name: "Reasoning", hint: "Your thesis, applied" },
] as const;

const BRIEF = [
  { k: "Thesis", v: "Still holds" },
  { k: "Skipped", v: "The rest of the tape" },
  { k: "Exit", v: "Plan unchanged" },
] as const;

const NOISE = ["Fed 64¢", "BTC +2.4%", "Funding −0.04%", "“Sources say”", "Wallet moved", "Oil bid lifted"] as const;

type Mode = "with" | "without";
type Lane = "prediction" | "analysis";

type Wire = { d: string; route: number };

function curve(x1: number, y1: number, x2: number, y2: number, bend = 0) {
  const dx = Math.max(28, (x2 - x1) * 0.5);
  return `M ${x1.toFixed(1)} ${y1.toFixed(1)} C ${(x1 + dx).toFixed(1)} ${(y1 + bend).toFixed(1)}, ${(x2 - dx).toFixed(1)} ${(y2 - bend * 0.35).toFixed(1)}, ${x2.toFixed(1)} ${y2.toFixed(1)}`;
}

function Mark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden>
      <circle cx="16" cy="16" r="11" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <path d="M16 6.2v8.2M16 17.6v8.2M6.2 16h8.2M17.6 16h8.2" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="16" cy="16" r="1.6" fill="currentColor" />
      <circle cx="16" cy="5" r="1.35" fill="currentColor" />
      <circle cx="16" cy="27" r="1.35" fill="currentColor" />
      <circle cx="5" cy="16" r="1.35" fill="currentColor" />
      <circle cx="27" cy="16" r="1.35" fill="currentColor" />
    </svg>
  );
}

function LaneIcon({ lane }: { lane: Lane }) {
  if (lane === "prediction") {
    return (
      <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" aria-hidden>
        <path d="M2.5 12.5 6 8l2.2 2.2L13.5 4" fill="none" stroke={ACCENT} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M10 4h3.5V7.5" fill="none" stroke={ACCENT} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" aria-hidden>
      <path d="M3 4.5h10M3 8h7M3 11.5h10" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function HarnessIcon({ name }: { name: (typeof HARNESS)[number]["name"] }) {
  const common = { fill: "none", stroke: ACCENT, strokeWidth: 1.5, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  if (name === "Agents") {
    return (
      <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" aria-hidden>
        <circle cx="5" cy="5.5" r="1.7" {...common} />
        <circle cx="11" cy="5.5" r="1.7" {...common} />
        <path d="M2.8 12.2c.4-1.8 1.5-2.7 2.7-2.7s2.3.9 2.7 2.7M8.6 12.2c.4-1.8 1.4-2.7 2.6-2.7 1.1 0 2.1.9 2.5 2.7" {...common} />
      </svg>
    );
  }
  if (name === "Tools") {
    return (
      <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" aria-hidden>
        <path d="M9.2 3.2a2.4 2.4 0 0 0-3.2 3.1L3 9.3l1.6 1.6 3-3a2.4 2.4 0 0 0 3.1-3.2L9.4 6 8 4.6l1.2-1.4Z" {...common} />
      </svg>
    );
  }
  if (name === "Loops") {
    return (
      <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" aria-hidden>
        <path d="M12.5 6.2A4.2 4.2 0 1 0 12 10" {...common} />
        <path d="M12.6 3.4v3h-3" {...common} />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" aria-hidden>
      <path d="M8 2.4 9.3 6h3.8L10.2 8.2l1.2 3.6L8 9.7 4.6 11.8 5.8 8.2 3 6h3.7L8 2.4Z" {...common} />
    </svg>
  );
}

function moveBefore(order: string[], from: string, to: string) {
  const fromIndex = order.indexOf(from);
  const toIndex = order.indexOf(to);
  if (fromIndex < 0 || toIndex < 0 || fromIndex === toIndex) return order;
  const next = order.filter((id) => id !== from);
  const index = next.indexOf(to);
  next.splice(fromIndex < toIndex ? index + 1 : index, 0, from);
  return next;
}

function CardBody({ lane, name, meta, draggable }: { lane: Lane; name: string; meta: string; draggable: boolean }) {
  return (
    <>
      <span
        className={cn(
          "grid h-7 w-7 shrink-0 place-items-center rounded-lg",
          lane === "prediction" ? "bg-[#48A8D0]/12 text-[#48A8D0]" : "bg-black/[0.04] text-black/70",
        )}
      >
        <LaneIcon lane={lane} />
      </span>
      <span className="min-w-0 flex-1 text-[12.5px] leading-tight tracking-[-0.01em] text-black">{name}</span>
      <span className="shrink-0 text-[11px] tabular-nums text-black/45">{meta}</span>
      {draggable ? (
        <span aria-hidden className="shrink-0 text-[13px] leading-none tracking-[-0.2em] text-black/35">
          ⋮⋮
        </span>
      ) : null}
    </>
  );
}

const cardClass =
  "flex w-full items-center gap-2 rounded-xl border bg-white px-2 py-1.5 text-left shadow-[0_1px_2px_rgba(20,2,6,0.04)] [font-family:var(--font-ui),system-ui,sans-serif]";

function FeedsColumn({
  prediction,
  analysis,
  active,
  onHover,
  onReorder,
  columnRef,
}: {
  prediction: { route: number; name: string; meta: string }[];
  analysis: { id: string; route: number; name: string; meta: string }[];
  active: number | null;
  onHover: (route: number | null) => void;
  onReorder: (from: string, to: string) => void;
  columnRef?: Ref<HTMLDivElement>;
}) {
  const [dragId, setDragId] = useState<string | null>(null);

  const onPointerDown = (event: ReactPointerEvent<HTMLDivElement>, id: string) => {
    if (event.button !== 0) return;
    event.preventDefault();
    const list = event.currentTarget.parentElement;
    if (!list) return;
    const startY = event.clientY;
    let moved = false;

    const move = (pointer: PointerEvent) => {
      if (!moved && Math.abs(pointer.clientY - startY) < 5) return;
      if (!moved) {
        moved = true;
        setDragId(id);
      }
      const cards = [...list.querySelectorAll<HTMLElement>("[data-analysis-id]")];
      const target = cards.find((card) => {
        if (card.dataset.analysisId === id) return false;
        const rect = card.getBoundingClientRect();
        const movingDown = pointer.clientY > startY;
        const line = rect.top + rect.height * (movingDown ? 0.55 : 0.45);
        return movingDown ? pointer.clientY > line && pointer.clientY < rect.bottom : pointer.clientY < line && pointer.clientY > rect.top;
      });
      if (target?.dataset.analysisId) onReorder(id, target.dataset.analysisId);
    };

    const up = () => {
      setDragId(null);
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
    };

    event.currentTarget.setPointerCapture(event.pointerId);
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
  };

  return (
    <div ref={columnRef} data-column="feeds" className="grid gap-4 sm:grid-cols-2 sm:gap-x-3 sm:gap-y-2">
      <div className="flex flex-col gap-2">
        <p className="min-h-[2.5em] text-[10px] font-medium uppercase leading-snug tracking-[0.12em] text-black/40 [font-family:var(--font-ui),system-ui,sans-serif]">
          Prediction market
        </p>
        {prediction.map((feed) => (
          <div
            key={feed.route}
            data-feed={feed.route}
            draggable={false}
            onMouseEnter={() => onHover(feed.route)}
            onMouseLeave={() => onHover(null)}
            className={cn(cardClass, "cursor-default border-black/10", active === feed.route && "border-[#48A8D0] bg-[#48A8D0]/10")}
          >
            <CardBody lane="prediction" name={feed.name} meta={feed.meta} draggable={false} />
          </div>
        ))}
      </div>
      <div className="flex flex-col gap-2" role="list" aria-label="Information analysis layer, drag to reorder">
        <p className="min-h-[2.5em] text-[10px] font-medium uppercase leading-snug tracking-[0.12em] text-black/40 [font-family:var(--font-ui),system-ui,sans-serif]">
          Information analysis layer
        </p>
        {analysis.map((feed) => (
          <div
            key={feed.id}
            role="listitem"
            data-feed={feed.route}
            data-analysis-id={feed.id}
            draggable={false}
            tabIndex={0}
            aria-roledescription="Draggable"
            aria-label={`${feed.name}, drag to reorder`}
            onMouseEnter={() => onHover(feed.route)}
            onMouseLeave={() => onHover(null)}
            onFocus={() => onHover(feed.route)}
            onBlur={() => onHover(null)}
            onPointerDown={(event) => onPointerDown(event, feed.id)}
            onKeyDown={(event) => {
              const index = analysis.findIndex((item) => item.id === feed.id);
              if (event.key === "ArrowUp" && index > 0) {
                event.preventDefault();
                onReorder(feed.id, analysis[index - 1].id);
              }
              if (event.key === "ArrowDown" && index >= 0 && index < analysis.length - 1) {
                event.preventDefault();
                onReorder(feed.id, analysis[index + 1].id);
              }
            }}
            className={cn(
              cardClass,
              "cursor-grab touch-none select-none border-black/10 hover:border-[#48A8D0]/55 active:cursor-grabbing",
              active === feed.route && "border-[#48A8D0] bg-[#48A8D0]/10",
              dragId === feed.id && "border-[#48A8D0] opacity-70",
            )}
          >
            <CardBody lane="analysis" name={feed.name} meta={feed.meta} draggable />
          </div>
        ))}
      </div>
    </div>
  );
}

function HubCard() {
  return (
    <div
      data-hub
      className="w-[12.75rem] rounded-2xl border border-[#48A8D0]/35 bg-white px-3 py-3 shadow-[0_16px_40px_-20px_rgba(72,168,208,0.85)]"
    >
      <div className="flex items-center gap-2 border-b border-black/8 pb-2.5">
        <Mark className="h-6 w-6 shrink-0 text-[#48A8D0]" />
        <p className="text-[13px] leading-tight tracking-[-0.02em] text-black [font-family:var(--font-display),Georgia,serif]">
          Conduence harness
        </p>
      </div>
      <ul className="mt-2.5 space-y-1.5">
        {HARNESS.map((item) => (
          <li key={item.name} className="flex items-center gap-2">
            <span className="grid h-6 w-6 shrink-0 place-items-center rounded-md bg-[#48A8D0]/10">
              <HarnessIcon name={item.name} />
            </span>
            <span className="min-w-0">
              <span className="block text-[12.5px] leading-tight text-black [font-family:var(--font-ui),system-ui,sans-serif]">
                {item.name}
              </span>
              <span className="block text-[10px] leading-tight text-black/40 [font-family:var(--font-ui),system-ui,sans-serif]">
                {item.hint}
              </span>
            </span>
          </li>
        ))}
      </ul>
      <p className="mt-2.5 text-center text-[10px] tracking-[0.08em] text-black/35 [font-family:var(--font-ui),system-ui,sans-serif]">
        memory · triggers · traces
      </p>
    </div>
  );
}

function Person({ calm }: { calm: boolean }) {
  return (
    <svg viewBox="0 0 72 64" className="h-16 w-[4.5rem]" aria-hidden>
      <circle cx="36" cy="16" r="9" fill="none" stroke={calm ? ACCENT : "#140206"} strokeWidth="1.7" />
      <path
        d="M16 56c2.2-12 9.2-18 20-18s17.8 6 20 18"
        fill="none"
        stroke={calm ? ACCENT : "#140206"}
        strokeWidth="1.7"
        strokeLinecap="round"
      />
      {calm ? (
        <circle cx="56" cy="14" r="3" fill={ACCENT} />
      ) : (
        <>
          <circle cx="14" cy="18" r="2" fill="#140206" opacity="0.35" />
          <circle cx="58" cy="12" r="2" fill="#140206" opacity="0.45" />
          <circle cx="60" cy="28" r="1.6" fill="#140206" opacity="0.3" />
        </>
      )}
    </svg>
  );
}

function HumanFace({ mode }: { mode: Mode }) {
  const calm = mode === "with";
  return (
    <div
      className={cn(
        "flex h-full w-[15.5rem] flex-col rounded-2xl border bg-white px-3.5 py-3.5",
        calm
          ? "border-[#48A8D0]/40 shadow-[0_16px_40px_-22px_rgba(72,168,208,0.9)]"
          : "border-black/10 shadow-[0_10px_28px_-20px_rgba(20,2,6,0.35)]",
      )}
    >
      <div className="flex items-center gap-3">
        <Person calm={calm} />
        <div>
          <p
            className={cn(
              "text-[10px] font-medium uppercase tracking-[0.16em] [font-family:var(--font-ui),system-ui,sans-serif]",
              calm ? "text-[#48A8D0]" : "text-black/40",
            )}
          >
            {calm ? "Filtered" : "Unfiltered"}
          </p>
          <p className="text-[1.35rem] leading-none tracking-[-0.03em] text-black [font-family:var(--font-display),Georgia,serif]">
            You
          </p>
        </div>
      </div>
      {calm ? (
        <ul className="mt-3 space-y-1.5 border-t border-black/8 pt-3">
          {BRIEF.map((line) => (
            <li key={line.k} className="flex items-baseline justify-between gap-3">
              <span className="text-[10px] uppercase tracking-[0.14em] text-black/40 [font-family:var(--font-ui),system-ui,sans-serif]">
                {line.k}
              </span>
              <span className="text-right text-[12.5px] text-black [font-family:var(--font-ui),system-ui,sans-serif]">{line.v}</span>
            </li>
          ))}
        </ul>
      ) : (
        <ul className="mt-3 space-y-1 border-t border-black/8 pt-3">
          {NOISE.map((line) => (
            <li key={line} className="text-[12px] leading-tight text-black/55 [font-family:var(--font-ui),system-ui,sans-serif]">
              {line}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function edgeClip(local: number, width: number) {
  const leftInset = Math.min(width, Math.max(0, local));
  const rightInset = Math.min(width, Math.max(0, width - local));
  return {
    with: `inset(0px 0px 0px ${leftInset}px)`,
    without: `inset(0px ${rightInset}px 0px 0px)`,
  };
}

export function MarketBrief() {
  const sectionRef = useRef<HTMLElement>(null);
  const boardRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<HTMLDivElement>(null);
  const feedsRef = useRef<HTMLDivElement>(null);
  const inView = useInView(sectionRef, { once: true, amount: 0.2 });
  const uid = useId().replace(/:/g, "");
  const splitRef = useRef(36);
  const gapRef = useRef(36);
  const humanEdgeRef = useRef(94);
  const userMoved = useRef(false);
  const frameRef = useRef(0);

  const [count, setCount] = useState(6);
  const [split, setSplit] = useState(36);
  const [mode, setMode] = useState<Mode>("with");
  const [hover, setHover] = useState<number | null>(null);
  const [analysisOrder, setAnalysisOrder] = useState<string[]>(() => ANALYSIS.map((item) => item.id));
  const [dragging, setDragging] = useState(false);
  const [wires, setWires] = useState<{ w: number; h: number; calm: Wire[]; raw: Wire[]; label: { x: number; y: number } | null }>({
    w: 0,
    h: 0,
    calm: [],
    raw: [],
    label: null,
  });
  const [clips, setClips] = useState({ hubWith: "inset(0px 0px 0px 0px)", humanWith: "inset(0px 0px 0px 0px)", humanWithout: "inset(0px 100% 0px 0px)" });

  const active = hover;
  const predictionCount = Math.ceil(count / 2);
  const analysisCount = Math.floor(count / 2);
  const prediction = PREDICTION.slice(0, predictionCount).map((item, index) => ({ ...item, route: index }));
  const analysis = analysisOrder
    .map((id) => ANALYSIS.find((item) => item.id === id))
    .filter((item): item is (typeof ANALYSIS)[number] => Boolean(item))
    .slice(0, analysisCount)
    .map((item) => ({ ...item, route: 10 + ANALYSIS.findIndex((entry) => entry.id === item.id) }));
  const signals = count * SIGNALS_PER_FEED;

  const applySplit = useCallback((next: number, nextMode?: Mode) => {
    const clamped = Math.min(100, Math.max(4, next));
    splitRef.current = clamped;
    setSplit(clamped);
    setMode(nextMode ?? (clamped > 62 ? "without" : "with"));
  }, []);

  const animateTo = useCallback(
    (target: number) => {
      cancelAnimationFrame(frameRef.current);
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduce) {
        applySplit(target);
        return;
      }
      const start = splitRef.current;
      const t0 = performance.now();
      const step = (now: number) => {
        const p = Math.min(1, (now - t0) / 560);
        const eased = 1 - (1 - p) ** 3;
        applySplit(start + (target - start) * eased);
        if (p < 1) frameRef.current = requestAnimationFrame(step);
      };
      frameRef.current = requestAnimationFrame(step);
    },
    [applySplit],
  );

  useEffect(() => () => cancelAnimationFrame(frameRef.current), []);

  useLayoutEffect(() => {
    const scene = sceneRef.current;
    const board = boardRef.current;
    const feedsEl = feedsRef.current;
    if (!scene || !board) return;

    const measure = () => {
      const box = scene.getBoundingClientRect();
      const boardBox = board.getBoundingClientRect();
      if (box.width < 8 || boardBox.width < 8) return;
      if (!window.matchMedia("(min-width: 1024px)").matches) return;

      if (feedsEl) {
        const feedsBox = feedsEl.getBoundingClientRect();
        gapRef.current = Math.min(68, Math.max(16, ((feedsBox.right - boardBox.left) / boardBox.width) * 100));
        if (!userMoved.current && Math.abs(splitRef.current - gapRef.current) > 0.8 && mode === "with" && !dragging) {
          applySplit(gapRef.current, "with");
        }
      }

      const rel = (el: HTMLElement) => {
        const r = el.getBoundingClientRect();
        return {
          left: r.left - box.left,
          right: r.right - box.left,
          top: r.top - box.top,
          cy: r.top - box.top + r.height / 2,
          height: r.height,
          width: r.width,
          pageLeft: r.left,
        };
      };

      const feedEls = [...scene.querySelectorAll<HTMLElement>("[data-feed]")];
      const hub = scene.querySelector<HTMLElement>("[data-hub]");
      const human = scene.querySelector<HTMLElement>("[data-human]");
      if (!hub || !human || feedEls.length === 0) return;

      const hubBox = rel(hub);
      const humanBox = rel(human);
      humanEdgeRef.current = ((boardBox.width - 28) / boardBox.width) * 100;
      const calm: Wire[] = [];
      const raw: Wire[] = [];

      feedEls.forEach((el, domIndex) => {
        const index = Number(el.dataset.feed);
        const feed = rel(el);
        calm.push({ route: index, d: curve(feed.right, feed.cy, hubBox.left, hubBox.cy) });
        const y2 = humanBox.top + ((domIndex + 1) / (feedEls.length + 1)) * humanBox.height;
        const bend = (domIndex % 2 === 0 ? 1 : -1) * (16 + (domIndex % 3) * 12);
        raw.push({ route: index, d: curve(feed.right, feed.cy, humanBox.left, y2, bend) });
      });
      calm.push({ route: -1, d: curve(hubBox.right, hubBox.cy, humanBox.left, humanBox.cy) });

      const splitX = boardBox.left + (splitRef.current / 100) * boardBox.width;
      const hubClip = edgeClip(splitX - hubBox.pageLeft, hubBox.width);
      const humanClip = edgeClip(splitX - humanBox.pageLeft, humanBox.width);

      setWires({
        w: box.width,
        h: box.height,
        calm,
        raw,
        label: { x: (hubBox.right + humanBox.left) / 2, y: Math.min(hubBox.cy, humanBox.cy) - 18 },
      });
      setClips({
        hubWith: hubClip.with,
        humanWith: humanClip.with,
        humanWithout: humanClip.without,
      });
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(scene);
    window.addEventListener("resize", measure);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [analysisOrder, applySplit, count, dragging, mode]);

  useLayoutEffect(() => {
    const scene = sceneRef.current;
    const board = boardRef.current;
    if (!scene || !board || wires.w === 0) return;
    const boardBox = board.getBoundingClientRect();
    const splitX = boardBox.left + (split / 100) * boardBox.width;
    const hub = scene.querySelector<HTMLElement>("[data-hub]");
    const human = scene.querySelector<HTMLElement>("[data-human]");
    if (!hub || !human) return;
    const hubRect = hub.getBoundingClientRect();
    const humanRect = human.getBoundingClientRect();
    const hubClip = edgeClip(splitX - hubRect.left, hubRect.width);
    const humanClip = edgeClip(splitX - humanRect.left, humanRect.width);
    setClips({
      hubWith: hubClip.with,
      humanWith: humanClip.with,
      humanWithout: humanClip.without,
    });
  }, [split, wires.w]);

  const draggingRef = useRef(false);

  const onPointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    userMoved.current = true;
    draggingRef.current = true;
    cancelAnimationFrame(frameRef.current);
    setDragging(true);
    event.currentTarget.setPointerCapture(event.pointerId);
    moveSplit(event.clientX);
  };

  const moveSplit = (clientX: number) => {
    const board = boardRef.current;
    if (!board) return;
    const rect = board.getBoundingClientRect();
    applySplit(((clientX - rect.left) / rect.width) * 100);
  };

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight" && event.key !== "Home" && event.key !== "End") return;
    event.preventDefault();
    userMoved.current = true;
    if (event.key === "Home") animateTo(gapRef.current);
    else if (event.key === "End") animateTo(humanEdgeRef.current);
    else if (event.key === "ArrowLeft") animateTo(splitRef.current - 6);
    else animateTo(splitRef.current + 6);
  };

  const reorderAnalysis = (from: string, to: string) => {
    setAnalysisOrder((order) => moveBefore(order, from, to));
  };

  return (
    <section
      ref={sectionRef}
      aria-label="From the whole market to one filtered brief"
      className="relative overflow-hidden bg-white px-[5%] pt-[clamp(0.5rem,2vw,1.25rem)] pb-[clamp(4rem,9vw,8rem)] text-black"
    >
      <style>{`
        @keyframes brief-flow { to { stroke-dashoffset: -52; } }
        .brief-flow { stroke-dasharray: 7 16; animation: brief-flow 1.5s linear infinite; }
        @media (prefers-reduced-motion: reduce) {
          .brief-flow { animation: none; }
        }
      `}</style>

      <div className="mx-auto flex max-w-[1100px] flex-col items-center">
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 22 }}
          transition={{ duration: 0.8, ease: EASE }}
          className="mb-[clamp(1.5rem,3vw,2.25rem)] max-w-[38rem] text-center"
        >
          <h2 className="text-display-lede font-normal leading-[1.05] tracking-[-0.04em] [font-family:var(--font-display),Georgia,serif]">
            The whole market.
            <span className="mt-1 block italic text-black/55">One brief.</span>
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 }}
          transition={{ duration: 0.8, delay: 0.08, ease: EASE }}
          className="w-full rounded-[1.35rem] border border-black/10 bg-white shadow-[0_24px_60px_-36px_rgba(20,2,6,0.35)]"
        >
          <p className="hidden px-4 pt-4 text-center text-[12px] text-black/45 lg:block [font-family:var(--font-ui),system-ui,sans-serif]">
            <span aria-hidden>↔ </span>Drag to compare
          </p>

          <div ref={boardRef} className="relative mx-3 mt-3 overflow-hidden rounded-2xl border border-black/[0.06] bg-white">
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 hidden lg:block"
              style={{
                backgroundImage: "radial-gradient(rgba(72,168,208,0.4) 1px, transparent 1px)",
                backgroundSize: "18px 18px",
                clipPath: `inset(0 0 0 ${split}%)`,
              }}
            />

            <div ref={sceneRef} className="relative px-4 py-8 sm:px-6 lg:py-10 lg:pr-16 lg:pl-5">
              {wires.w > 0 ? (
                <svg
                  className="pointer-events-none absolute inset-0 hidden h-full w-full lg:block"
                  viewBox={`0 0 ${wires.w} ${wires.h}`}
                  aria-hidden
                >
                  <defs>
                    <clipPath id={`${uid}-raw`}>
                      <rect x="0" y="0" width={(wires.w * split) / 100} height={wires.h} />
                    </clipPath>
                    <clipPath id={`${uid}-calm`}>
                      <rect x={(wires.w * split) / 100} y="0" width={wires.w * (1 - split / 100)} height={wires.h} />
                    </clipPath>
                  </defs>
                  <g clipPath={`url(#${uid}-raw)`}>
                    {wires.raw.map((wire) => (
                      <path
                        key={`raw-${wire.route}`}
                        d={wire.d}
                        fill="none"
                        stroke="#140206"
                        strokeOpacity={active === null || active === wire.route ? 0.28 : 0.08}
                        strokeWidth="1.6"
                        strokeLinecap="round"
                      />
                    ))}
                  </g>
                  <g clipPath={`url(#${uid}-calm)`}>
                    {wires.calm.map((wire) => {
                      const dim = active !== null && wire.route !== active && wire.route !== -1;
                      return (
                        <g key={`calm-${wire.route}`} opacity={dim ? 0.16 : 1}>
                          <path d={wire.d} fill="none" stroke={ACCENT} strokeWidth="2" strokeLinecap="round" />
                          <path d={wire.d} fill="none" stroke="#f5fbfe" strokeWidth="2" strokeLinecap="round" className="brief-flow" style={{ animationDelay: `${wire.route * -0.18}s` }} />
                        </g>
                      );
                    })}
                  </g>
                </svg>
              ) : null}

              {wires.label && split < 78 ? (
                <span
                  className="pointer-events-none absolute hidden -translate-x-1/2 text-[11px] whitespace-nowrap text-[#48A8D0] lg:block [font-family:var(--font-ui),system-ui,sans-serif]"
                  style={{ left: wires.label.x, top: wires.label.y }}
                >
                  one brief
                </span>
              ) : null}

              <div className="relative grid items-center gap-6 lg:grid-cols-[minmax(0,1.15fr)_auto_minmax(0,0.82fr)] lg:gap-x-16">
                <FeedsColumn
                  prediction={prediction}
                  analysis={analysis}
                  active={active}
                  onHover={setHover}
                  onReorder={reorderAnalysis}
                  columnRef={feedsRef}
                />

                <div className="relative hidden justify-self-center lg:block">
                  <div className="invisible" aria-hidden>
                    <HubCard />
                  </div>
                  <div className="absolute inset-0" style={{ clipPath: clips.hubWith }}>
                    <HubCard />
                  </div>
                </div>

                <div className="mx-auto flex w-full max-w-sm flex-col items-center gap-3 lg:hidden">
                  <span className="h-7 w-px bg-[#48A8D0]" aria-hidden />
                  {mode === "with" ? (
                    <HubCard />
                  ) : (
                    <p className="text-[10px] font-medium tracking-[0.16em] text-black/40 uppercase [font-family:var(--font-ui),system-ui,sans-serif]">
                      Straight to you
                    </p>
                  )}
                  <span className="h-7 w-px bg-[#48A8D0]" aria-hidden />
                </div>

                <div data-human className="relative hidden justify-self-end lg:block">
                  <div className="invisible" aria-hidden>
                    <HumanFace mode="without" />
                  </div>
                  <div className="absolute inset-0" style={{ clipPath: clips.humanWithout }} aria-hidden={mode !== "without"}>
                    <HumanFace mode="without" />
                  </div>
                  <div className="absolute inset-0" style={{ clipPath: clips.humanWith }} aria-hidden={mode !== "with"}>
                    <HumanFace mode="with" />
                  </div>
                </div>

                <div className="mx-auto lg:hidden">
                  <HumanFace mode={mode} />
                </div>
              </div>
            </div>

            <div
              role="slider"
              tabIndex={0}
              aria-label="Drag left for With Conduence, right for Without."
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={Math.round(100 - split)}
              aria-valuetext={`${Math.round(100 - split)} percent with Conduence`}
              onPointerDown={onPointerDown}
              onPointerMove={(event) => {
                if (!draggingRef.current) return;
                moveSplit(event.clientX);
              }}
              onPointerUp={() => {
                draggingRef.current = false;
                setDragging(false);
              }}
              onPointerCancel={() => {
                draggingRef.current = false;
                setDragging(false);
              }}
              onKeyDown={onKeyDown}
              className="absolute inset-y-0 z-20 hidden w-10 -translate-x-1/2 cursor-col-resize touch-none lg:block"
              style={{ left: `${split}%` }}
            >
              <span aria-hidden className="absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-[#48A8D0]" />
              <span
                aria-hidden
                className="absolute top-1/2 left-1/2 grid h-10 w-10 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-xl bg-[#48A8D0] text-[#140206] shadow-[0_10px_24px_-10px_rgba(72,168,208,0.95)]"
              >
                <svg viewBox="0 0 24 24" className="h-5 w-5">
                  <path d="M9 7 5 12l4 5M15 7l4 5-4 5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
            </div>
          </div>

          <div className="grid items-center gap-4 px-4 py-4 sm:px-6 sm:py-5 lg:grid-cols-[1fr_auto_1fr]">
            <div className={cn("transition-opacity", mode === "with" && "opacity-45")}>
              <p className="font-display text-[clamp(1.35rem,2vw,1.85rem)] font-normal leading-none tracking-[-0.04em] text-black tabular-nums">
                {count} × {SIGNALS_PER_FEED} = {signals}
              </p>
              <p className="mt-1 text-[10px] font-medium tracking-[0.16em] text-black/40 uppercase [font-family:var(--font-ui),system-ui,sans-serif]">
                Raw signals
              </p>
            </div>

            <div className="flex flex-col items-center gap-2">
              <div className="inline-flex items-center rounded-full border border-black/10 bg-white p-1 [font-family:var(--font-ui),system-ui,sans-serif]">
                <button
                  type="button"
                  aria-label="Remove a feed"
                  disabled={count <= MIN_FEEDS}
                  onClick={() => setCount((value) => Math.max(MIN_FEEDS, value - 1))}
                  className="grid h-8 w-8 place-items-center rounded-full text-lg leading-none text-black/70 transition-colors hover:bg-black/[0.04] disabled:opacity-30"
                >
                  −
                </button>
                <span className="px-2 text-[13px] text-black tabular-nums">{count} feeds</span>
                <button
                  type="button"
                  disabled={count >= MAX_FEEDS}
                  onClick={() => setCount((value) => Math.min(MAX_FEEDS, value + 1))}
                  className="inline-flex items-center gap-1 rounded-full bg-[#48A8D0] px-3 py-1.5 text-[13px] font-medium text-[#140206] transition-colors hover:bg-[#3b96bc] disabled:opacity-40"
                >
                  <span aria-hidden>＋</span> Add feed
                </button>
              </div>
            </div>

            <div className={cn("lg:text-right transition-opacity", mode === "without" && "opacity-45")}>
              <p className="font-display text-[clamp(1.7rem,2.4vw,2.25rem)] font-normal leading-none tracking-[-0.04em] text-[#48A8D0]">
                1
              </p>
              <p className="mt-1 text-[10px] font-medium tracking-[0.16em] text-black/40 uppercase [font-family:var(--font-ui),system-ui,sans-serif]">
                Filtered brief
              </p>
            </div>
          </div>
        </motion.div>
        <p className="sr-only">Figures on the market cards are illustrative, not live prices.</p>
      </div>
    </section>
  );
}
