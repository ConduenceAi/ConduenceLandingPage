import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";

import { JsonLd } from "@/components/seo/JsonLd";
import { siteTagline, siteUrl } from "@/lib/site";

import { Providers } from "./providers";
import "./globals.css";

const sans = Inter({
  subsets: ["latin"],
  variable: "--font-ui",
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
  height: 570,
  alt: "CONDUENCE. Your edge. Running on agents",
};

const googleVerification = process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION?.trim();

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "CONDUENCE",
    template: "%s | CONDUENCE",
  },
  description: siteTagline,
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    // SVG follows system/browser light|dark theme. PNGs are fallbacks for older clients.
    // Naming: favicon-dark = black mark (for light UI); favicon-light = white mark (for dark UI).
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      {
        url: "/favicon-dark.png",
        type: "image/png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/favicon-light.png",
        type: "image/png",
        media: "(prefers-color-scheme: dark)",
      },
    ],
    apple: [
      {
        url: "/favicon-dark.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/favicon-light.png",
        media: "(prefers-color-scheme: dark)",
      },
    ],
  },
  openGraph: {
    title: "CONDUENCE. Agents that trade like you",
    description: siteTagline,
    type: "website",
    url: siteUrl,
    siteName: "CONDUENCE",
    locale: "en_US",
    images: [ogImage],
  },
  twitter: {
    card: "summary_large_image",
    title: "CONDUENCE. Agents that trade like you",
    description: siteTagline,
    images: [ogImage.url],
  },
  ...(googleVerification
    ? { verification: { google: googleVerification } }
    : {}),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${sans.variable} ${display.variable}`}>
        <JsonLd />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
