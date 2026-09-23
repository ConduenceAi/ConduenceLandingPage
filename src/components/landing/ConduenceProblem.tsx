import { IBM_Plex_Mono, IBM_Plex_Sans, Instrument_Serif } from "next/font/google";

import { ConduenceProblemClient } from "@/components/landing/ConduenceProblemClient";

import "./conduence-problem.css";

const sans = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--ob-font-sans",
  display: "swap",
});

const mono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--ob-font-mono",
  display: "swap",
});

const serif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: "italic",
  variable: "--ob-font-serif",
  display: "swap",
});

export function ConduenceProblem() {
  return (
    <div className={`${sans.variable} ${mono.variable} ${serif.variable}`}>
      <ConduenceProblemClient />
    </div>
  );
}
