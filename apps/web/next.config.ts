import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@hypervivid/core", "@hypervivid/ui"],
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
