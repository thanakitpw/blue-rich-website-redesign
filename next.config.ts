import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Pin the workspace root — a lockfile higher up the tree would otherwise be picked.
  turbopack: { root: path.resolve(".") },
  images: {
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
