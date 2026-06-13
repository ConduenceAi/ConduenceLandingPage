import type { Metadata } from "next";
import { Inter } from "next/font/google";

import { Providers } from "./providers";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
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
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,300;1,400&family=Inter:wght@300;400;500;600;700;800;900&family=Michroma&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={inter.variable}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
