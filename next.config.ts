import type { NextConfig } from "next";
import fs from "fs";
import path from "path";

const nextConfig: NextConfig = {
  distDir: process.env.ACEPACK_BUILD_DIR || ".next",
  images: {
    unoptimized: true,
    remotePatterns: [
      { protocol: "https", hostname: "**" }
    ],
  },
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.plugins.push({
        apply(compiler: any) {
          compiler.hooks.afterEmit.tap("LinkServerChunks", () => {
            try {
              const serverDir = path.resolve(compiler.outputPath);
              const chunksDir = path.join(serverDir, "chunks");
              if (fs.existsSync(chunksDir)) {
                const files = fs.readdirSync(chunksDir);
                for (const file of files) {
                  const src = path.join(chunksDir, file);
                  const dest = path.join(serverDir, file);
                  if (!fs.existsSync(dest) && fs.statSync(src).isFile()) {
                    fs.copyFileSync(src, dest);
                  }
                }
              }
            } catch (err) {
              // Ignore copy error
            }
          });
        },
      });
    }
    return config;
  },
};

export default nextConfig;
