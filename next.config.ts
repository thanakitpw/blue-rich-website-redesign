import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Pin the workspace root — a lockfile higher up the tree would otherwise be picked.
  turbopack: { root: path.resolve(".") },
  experimental: {
    /* ปิดแคชไฟล์ระบบของ Turbopack ตอน dev (เปิดเป็นค่าเริ่มต้นตั้งแต่ 16.1)
       เครื่องที่แรม 8 GB โดนระบบ kill ระหว่างใช้งานเพราะขั้นตอน compaction
       ของแคชนี้กินแรมหนัก — log ขึ้น "filesystem cache database compaction"
       นาน 15–31 วินาทีก่อนตาย แลกกับ dev เริ่มช้าลงตอนเปิดครั้งแรก */
    turbopackFileSystemCacheForDev: false,
  },
  images: {
    formats: ["image/avif", "image/webp"],
    /* รูปที่ลูกค้าอัปโหลดเองอยู่ใน Supabase Storage ไม่ได้อยู่ใน public/
       จึงต้องอนุญาตโดเมนนั้นให้ next/image ไปดึงได้ */
    remotePatterns: [
      { protocol: "https", hostname: "*.supabase.co", pathname: "/storage/v1/object/public/**" },
    ],
  },
  /* บทความชุดเดิม 7 บทถูกถอดเมื่อ 26 ต.ค. 2569 แทนด้วยบทความ SEO ชุดใหม่ (seo/blog)
     URL เก่าที่ Google เก็บไว้ส่งไปบทใหม่ที่ตอบเรื่องเดียวกัน ที่เหลือไปหน้ารวมบทความ
     (ministerial-regulation-2567 ใช้ slug เดิมต่อ ไม่ต้อง redirect) */
  async redirects() {
    return [
      { source: "/news/fire-protection-law", destination: "/news/ministerial-regulation-2567", permanent: true },
      { source: "/news/neocoat-fireproof-painting-project", destination: "/news/fireproof-coating-system-3-layers", permanent: true },
      ...["8-house-painting-tools", "5-ways-to-remove-rust", "heat-insulation-materials", "choosing-waterproofing"].map(
        (slug) => ({ source: `/news/${slug}`, destination: "/news", permanent: true }),
      ),
    ];
  },
};

export default nextConfig;
