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

const ogImage =
  "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/ed46baa3-270e-4643-94be-75c1e06cdac6/id-preview-44fc04e7--f27dad1e-1bc7-4ac4-b39e-deaf67c3a1bf.lovable.app-1781295377573.png";

export const metadata: Metadata = {
  title: {
    default: "CONDUENCE",
    template: "%s | CONDUENCE",
  },
  description: "AI agents that think with you.",
  icons: {
    icon: [
      { url: "/favicon-dark.png", media: "(prefers-color-scheme: light)" },
      { url: "/favicon-light.png", media: "(prefers-color-scheme: dark)" },
    ],
    shortcut: "/favicon.ico",
    apple: "/favicon-dark.png",
  },
  openGraph: {
    title: "CONDUENCE",
    description: "AI agents that think with you.",
    type: "website",
    images: [ogImage],
  },
  twitter: {
    card: "summary",
    title: "CONDUENCE",
    description: "AI agents that think with you.",
    images: [ogImage],
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
