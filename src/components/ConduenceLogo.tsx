"use client";

import { useEffect, useState } from "react";

import { logoBlackSrc, logoWhiteSrc } from "@/lib/assets";
import { cn } from "@/lib/utils";

/** Light-background sections where the nav uses the black logo. */
const BLACK_LOGO_SECTION_IDS = new Set([
  "top",
  "core-insight",
  "pillars",
  "agents",
  "we-move-as-one",
]);

function useLogoOnDarkBackground(defaultOnDark = true) {
  const [onDarkBackground, setOnDarkBackground] = useState(defaultOnDark);

  useEffect(() => {
    const findSectionAtProbe = (x: number, y: number): HTMLElement | null => {
      for (const el of document.elementsFromPoint(x, y)) {
        if (!(el instanceof HTMLElement)) continue;
        if (el.closest("header")) continue;

        let node: Element | null = el;
        while (node && node !== document.body) {
          if (node instanceof HTMLElement && node.tagName === "SECTION") {
            return node;
          }
          node = node.parentElement;
        }
      }
      return null;
    };

    const detect = () => {
      const probeY = 48;
      const section = findSectionAtProbe(window.innerWidth / 2, probeY);
      if (!section) {
        setOnDarkBackground(true);
        return;
      }

      setOnDarkBackground(!BLACK_LOGO_SECTION_IDS.has(section.id));
    };

    detect();
    window.addEventListener("scroll", detect, { passive: true });
    window.addEventListener("resize", detect);
    return () => {
      window.removeEventListener("scroll", detect);
      window.removeEventListener("resize", detect);
    };
  }, []);

  return onDarkBackground;
}

type ConduenceLogoProps = {
  className?: string;
  variant?: "auto" | "on-dark" | "on-light";
};

export function ConduenceLogo({ className, variant = "auto" }: ConduenceLogoProps) {
  const detectedOnDark = useLogoOnDarkBackground(variant !== "on-light");
  const onDarkBackground =
    variant === "on-dark" ? true : variant === "on-light" ? false : detectedOnDark;

  return (
    <img
      src={onDarkBackground ? logoWhiteSrc : logoBlackSrc}
      alt="CONDUENCE"
      draggable={false}
      className={cn("block h-full w-auto select-none transition-opacity duration-300", className)}
    />
  );
}
