"use client";

import { useId } from "react";

type FlowingOrbProps = {
  className?: string;
};

export function FlowingOrb({ className }: FlowingOrbProps) {
  const id = useId().replace(/:/g, "");
  const cx = 200;
  const cy = 200;
  const r = 132;

  return (
    <div className={className}>
      <svg viewBox="0 0 400 400" className="h-full w-full" aria-hidden="true" role="presentation">
        <defs>
          <clipPath id={`${id}-clip`}>
            <circle cx={cx} cy={cy} r={r} />
          </clipPath>

          <linearGradient
            id={`${id}-base`}
            x1="200"
            y1="68"
            x2="200"
            y2="332"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="42%" stopColor="#eef6ff" />
            <stop offset="78%" stopColor="#5da8ff" />
            <stop offset="100%" stopColor="#2b78f5" />
            <animate
              attributeName="x1"
              dur="26s"
              values="200;188;212;200"
              repeatCount="indefinite"
            />
            <animate attributeName="y1" dur="26s" values="68;82;58;68" repeatCount="indefinite" />
            <animate
              attributeName="x2"
              dur="30s"
              values="200;214;186;200"
              repeatCount="indefinite"
            />
            <animate
              attributeName="y2"
              dur="30s"
              values="332;318;346;332"
              repeatCount="indefinite"
            />
          </linearGradient>

          <filter
            id={`${id}-mist`}
            x="-40%"
            y="-40%"
            width="180%"
            height="180%"
            colorInterpolationFilters="sRGB"
          >
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.008 0.012"
              numOctaves="2"
              seed="3"
              result="noise"
            >
              <animate
                attributeName="baseFrequency"
                dur="32s"
                values="0.008 0.012;0.014 0.009;0.01 0.015;0.008 0.012"
                repeatCount="indefinite"
              />
              <animate attributeName="seed" dur="40s" values="3;9;15;3" repeatCount="indefinite" />
            </feTurbulence>
            <feGaussianBlur in="noise" stdDeviation="10" result="softNoise" />
            <feColorMatrix
              in="softNoise"
              type="matrix"
              values="0 0 0 0 0.18
                      0 0 0 0 0.42
                      0 0 0 0 0.95
                      0 0 0 0.28 0"
              result="blueMist"
            />
            <feBlend in="SourceGraphic" in2="blueMist" mode="soft-light" />
          </filter>
        </defs>

        <g clipPath={`url(#${id}-clip)`}>
          <g filter={`url(#${id}-mist)`}>
            <circle cx={cx} cy={cy} r={r * 1.4} fill={`url(#${id}-base)`} />

            <circle cx="168" cy="248" r="78" fill="rgba(43,120,245,0.35)">
              <animate
                attributeName="cx"
                dur="28s"
                values="168;192;154;168"
                repeatCount="indefinite"
              />
              <animate
                attributeName="cy"
                dur="28s"
                values="248;232;258;248"
                repeatCount="indefinite"
              />
            </circle>

            <circle cx="238" cy="168" r="64" fill="rgba(255,255,255,0.42)">
              <animate
                attributeName="cx"
                dur="34s"
                values="238;218;246;238"
                repeatCount="indefinite"
              />
              <animate
                attributeName="cy"
                dur="34s"
                values="168;182;152;168"
                repeatCount="indefinite"
              />
            </circle>

            <circle cx="210" cy="290" r="52" fill="rgba(70,145,255,0.28)">
              <animate
                attributeName="cx"
                dur="36s"
                values="210;228;196;210"
                repeatCount="indefinite"
              />
              <animate
                attributeName="cy"
                dur="36s"
                values="290;276;298;290"
                repeatCount="indefinite"
              />
            </circle>
          </g>
        </g>
      </svg>
    </div>
  );
}
