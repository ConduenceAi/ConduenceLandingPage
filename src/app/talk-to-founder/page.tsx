import type { Metadata } from "next";
import Script from "next/script";

import { TalkToFounderPage } from "@/components/landing/TalkToFounderPage";

export const metadata: Metadata = {
  title: "Talk to the founder",
  description:
    "Book a 15-minute call with the CONDUENCE founder to discuss agent orchestration, private beta, or early access.",
};

export default function TalkToFounderRoute() {
  return (
    <>
      <link rel="stylesheet" href="https://assets.calendly.com/assets/external/widget.css" />
      <Script src="https://assets.calendly.com/assets/external/widget.js" strategy="lazyOnload" />
      <TalkToFounderPage />
    </>
  );
}
