import type { MetadataRoute } from "next";

import { siteTagline } from "@/lib/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "CONDUENCE",
    short_name: "CONDUENCE",
    description: siteTagline,
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#000000",
    icons: [
      {
        src: "/images/brand_logo.png",
        sizes: "720x720",
        type: "image/png",
      },
      {
        src: "/favicon-dark.png",
        sizes: "32x32",
        type: "image/png",
      },
    ],
  };
}
