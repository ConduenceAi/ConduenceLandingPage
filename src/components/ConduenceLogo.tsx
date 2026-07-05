"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { logoBlackSrc, logoWhiteSrc } from "@/lib/assets";
import { cn } from "@/lib/utils";

/** Fallback when background color cannot be resolved from the DOM. */
const LIGHT_SECTION_IDS = new Set([
  "top",
  "core-insight",
  "pillars",
  "agents",
  "we-move-as-one",
]);

type LogoAppearance =
  | { type: "light" }
  | { type: "dark" }
  | { type: "split"; splitPercent: number };

function parseRgb(
  color: string,
): { r: number; g: number; b: number; a: number } | null {
  const match = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);
  if (!match) return null;

  return {
    r: Number(match[1]),
    g: Number(match[2]),
    b: Number(match[3]),
    a: match[4] !== undefined ? Number(match[4]) : 1,
  };
}

function luminance(r: number, g: number, b: number) {
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255;
}

function isDarkSurface(el: HTMLElement): boolean | null {
  if (el.classList.contains("bg-black")) return true;
  if (el.classList.contains("bg-white")) return false;

  const bg = getComputedStyle(el).backgroundColor;
  const rgb = parseRgb(bg);
  if (!rgb || rgb.a < 0.08) return null;

  return luminance(rgb.r, rgb.g, rgb.b) < 0.45;
}

function isDarkAtPoint(x: number, y: number): boolean {
  for (const el of document.elementsFromPoint(x, y)) {
    if (!(el instanceof HTMLElement)) continue;
    if (el.closest("header")) continue;

    const surface = isDarkSurface(el);
    if (surface !== null) return surface;

    let node: Element | null = el;
    while (node && node !== document.body) {
      if (node instanceof HTMLElement) {
        const parentSurface = isDarkSurface(node);
        if (parentSurface !== null) return parentSurface;
      }
      node = node.parentElement;
    }
  }

  const centerSection = document.elementFromPoint(window.innerWidth / 2, y);
  let section: HTMLElement | null = null;
  let node: Element | null = centerSection;
  while (node && node !== document.body) {
    if (node instanceof HTMLElement && node.tagName === "SECTION") {
      section = node;
      break;
    }
    node = node.parentElement;
  }

  if (section) return !LIGHT_SECTION_IDS.has(section.id);
  return true;
}

function detectAppearance(rect: DOMRect): LogoAppearance {
  const probeY = rect.top + rect.height / 2;
  const samples = 32;
  const darkFlags: boolean[] = [];

  for (let i = 0; i <= samples; i += 1) {
    const x = rect.left + (rect.width * i) / samples;
    darkFlags.push(isDarkAtPoint(x, probeY));
  }

  const allDark = darkFlags.every(Boolean);
  const allLight = darkFlags.every((flag) => !flag);

  if (allDark) return { type: "dark" };
  if (allLight) return { type: "light" };

  let splitPercent = 50;
  for (let i = 1; i < darkFlags.length; i += 1) {
    if (darkFlags[i] !== darkFlags[i - 1]) {
      splitPercent = (i / samples) * 100;
      break;
    }
  }

  return { type: "split", splitPercent };
}

function useLogoAppearance(enabled: boolean, defaultDark: boolean) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [appearance, setAppearance] = useState<LogoAppearance>(
    defaultDark ? { type: "dark" } : { type: "light" },
  );

  const detect = useCallback(() => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect?.width) return;

    setAppearance((current) => {
      const next = detectAppearance(rect);

      if (
        current.type === "split" &&
        next.type === "split" &&
        Math.abs(current.splitPercent - next.splitPercent) < 0.5
      ) {
        return current;
      }

      if (current.type === next.type && current.type !== "split") {
        return current;
      }

      return next;
    });
  }, []);

  useEffect(() => {
    if (!enabled) return;

    detect();
    window.addEventListener("scroll", detect, { passive: true });
    window.addEventListener("resize", detect);

    return () => {
      window.removeEventListener("scroll", detect);
      window.removeEventListener("resize", detect);
    };
  }, [detect, enabled]);

  return { containerRef, appearance };
}

type ConduenceLogoProps = {
  className?: string;
  variant?: "auto" | "on-dark" | "on-light";
};

export function ConduenceLogo({ className, variant = "auto" }: ConduenceLogoProps) {
  const isAuto = variant === "auto";
  const forcedAppearance: LogoAppearance | null =
    variant === "on-dark"
      ? { type: "dark" }
      : variant === "on-light"
        ? { type: "light" }
        : null;

  const { containerRef, appearance: detectedAppearance } = useLogoAppearance(
    isAuto,
    variant !== "on-light",
  );
  const appearance = forcedAppearance ?? detectedAppearance;

  const imageClass =
    "block h-full w-auto select-none transition-[clip-path] duration-300 ease-out";

  return (
    <div ref={containerRef} className={cn("relative h-full w-auto", className)} aria-hidden={false}>
      {appearance.type === "split" ? (
        <>
          <img
            src={logoBlackSrc}
            alt="CONDUENCE"
            draggable={false}
            className={imageClass}
            style={{ clipPath: `inset(0 ${100 - appearance.splitPercent}% 0 0)` }}
          />
          <img
            src={logoWhiteSrc}
            alt=""
            draggable={false}
            aria-hidden
            className={cn(imageClass, "absolute left-0 top-0")}
            style={{ clipPath: `inset(0 0 0 ${appearance.splitPercent}%)` }}
          />
        </>
      ) : (
        <img
          src={appearance.type === "dark" ? logoWhiteSrc : logoBlackSrc}
          alt="CONDUENCE"
          draggable={false}
          className={imageClass}
        />
      )}
    </div>
  );
}
