import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  distDir: process.env.ACEPACK_BUILD_DIR || ".next",
  images: {
    unoptimized: true,
    remotePatterns: [
      { protocol: "https", hostname: "**" }
    ],
  },
};

export default nextConfig;
