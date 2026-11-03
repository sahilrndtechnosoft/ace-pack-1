import type { NextConfig } from "next";
import fs from "fs";
import path from "path";

const isExport = process.env.NEXT_EXPORT === 'true';

const nextConfig: NextConfig = {
  serverExternalPackages: ['mysql2', 'bcryptjs'],
  ...(isExport ? { output: 'export' } : {}),
  distDir: process.env.ACEPACK_BUILD_DIR || ".next",
  images: {
    unoptimized: true,
    remotePatterns: [
      { protocol: "https", hostname: "**" }
    ],
  },
  async headers() {
    return [
      {
        source: "/admin/:path*",
        headers: [
          {
            key: "X-Robots-Tag",
            value: "noindex, nofollow, noarchive, nosnippet",
          },
        ],
      },
      {
        source: "/api/admin/:path*",
        headers: [
          {
            key: "X-Robots-Tag",
            value: "noindex, nofollow, noarchive, nosnippet",
          },
        ],
      },
    ];
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
