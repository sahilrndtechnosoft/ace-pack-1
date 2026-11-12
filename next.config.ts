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
  // Same 301s as www.acepack.co.in: old hinge-container posts were merged into one article.
  async redirects() {
    return [
      'hinge-cups-for-food-packaging-uses-and-benefits',
      'maximizing-kitchen-efficiency-with-hinge-containers',
      'the-role-of-hinge-containers-in-food-packaging',
      'hinged-plastic-sauce-containers',
      'three-perks-of-hinge-containers',
    ].map((slug) => ({
      source: `/blog/${slug}`,
      destination: '/blog/why-hinge-cups-are-useful-for-sauce-and-topping-packaging',
      statusCode: 301 as const,
    }));
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
