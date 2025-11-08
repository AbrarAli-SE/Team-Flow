import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // outside image integrate
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "ik.imagekit.io",
      },
    ],
  },
};

export default nextConfig;
