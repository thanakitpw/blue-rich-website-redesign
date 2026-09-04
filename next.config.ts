import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Pin the workspace root — a lockfile higher up the tree would otherwise be picked.
  turbopack: { root: path.resolve(".") },
  images: {
    formats: ["image/avif", "image/webp"],
    /* รูปที่ลูกค้าอัปโหลดเองอยู่ใน Supabase Storage ไม่ได้อยู่ใน public/
       จึงต้องอนุญาตโดเมนนั้นให้ next/image ไปดึงได้ */
    remotePatterns: [
      { protocol: "https", hostname: "*.supabase.co", pathname: "/storage/v1/object/public/**" },
    ],
  },
};

export default nextConfig;
