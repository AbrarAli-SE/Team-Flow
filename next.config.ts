import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com", // Google user images
      },
      {
        protocol: "https", 
        hostname: "avatars.githubusercontent.com", // GitHub avatars
      },
      {
        protocol: "https",
        hostname: "avatar.vercel.sh", // Vercel avatars
      },
      {
        protocol: "https",
        hostname: "randomuser.me", // Random user images
      },
      {
        protocol: "https",
        hostname: "01mglxi4x0.ufs.sh" // Uploadthing CDN
      }
    ],
  },
};

export default nextConfig;