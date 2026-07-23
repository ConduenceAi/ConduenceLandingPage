import type { Metadata } from "next";
import Script from "next/script";

import { TalkToFounderPage } from "@/components/landing/TalkToFounderPage";
import { absoluteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "Talk to the founder",
  description:
    "Book a 30-minute call with the CONDUENCE founder to discuss agent orchestration, private beta, or early access.",
  alternates: {
    canonical: absoluteUrl("/talk-to-founder"),
  },
  openGraph: {
    title: "Talk to the founder | CONDUENCE",
    description:
      "Book a 30-minute call with the CONDUENCE founder to discuss agent orchestration, private beta, or early access.",
    url: absoluteUrl("/talk-to-founder"),
  },
};

export default function TalkToFounderRoute() {
  return (
    <>
      <link
        rel="stylesheet"
        href="https://assets.calendly.com/assets/external/widget.css"
      />
      <Script
        src="https://assets.calendly.com/assets/external/widget.js"
        strategy="afterInteractive"
      />
      <TalkToFounderPage />
    </>
  );
}
