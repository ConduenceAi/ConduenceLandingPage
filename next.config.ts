import type { NextConfig } from "next";

import { APP_LOGIN_URL } from "./src/lib/login";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/login",
        destination: APP_LOGIN_URL,
        permanent: false,
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev",
      },
    ],
  },
};

export default nextConfig;
