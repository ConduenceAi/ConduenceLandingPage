import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";

import { Providers } from "./providers";
import "./globals.css";

const sans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const display = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "700", "900"],
  style: ["normal", "italic"],
  variable: "--font-display",
  display: "swap",
});

const ogImage = {
  url: "/og.jpg",
  width: 1024,
  height: 568,
  alt: "CONDUENCE — Agents that trade like you",
};

export const metadata: Metadata = {
  metadataBase: new URL("https://www.conduence.xyz"),
  title: {
    default: "CONDUENCE",
    template: "%s | CONDUENCE",
  },
  description:
    "Orchestrate AI agents that learn your perspective, mirror your reasoning, from your voice.",
  icons: {
    icon: [
      { url: "/favicon-dark.png", media: "(prefers-color-scheme: light)" },
      { url: "/favicon-light.png", media: "(prefers-color-scheme: dark)" },
    ],
    shortcut: "/favicon.ico",
    apple: "/favicon-dark.png",
  },
  openGraph: {
    title: "CONDUENCE. Agents that trade like you",
    description: "Orchestrate AI agents that learn your perspective, mirror your reasoning.",
    type: "website",
    images: [ogImage],
  },
  twitter: {
    card: "summary_large_image",
    title: "CONDUENCE. Agents that trade like you",
    description: "Orchestrate AI agents that learn your perspective, mirror your reasoning.",
    images: [ogImage.url],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${sans.variable} ${display.variable}`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
