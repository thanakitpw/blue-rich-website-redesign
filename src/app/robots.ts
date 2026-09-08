import type { MetadataRoute } from "next";
import { getSiteInfo } from "@/lib/cms/content";

/**
 * robots.txt
 *
 * เพิ่มตอนเปิดให้หน้า landing ทั้ง 5 ติดอันดับ — เดิมเว็บไม่มีไฟล์นี้เลย
 * บอตจึงคลานได้ทุกอย่างรวมถึงของที่ไม่ควรติดอันดับ
 *
 *   /admin, /api  — หลังบ้าน กันด้วยล็อกอินอยู่แล้ว แต่ไม่ควรโผล่ในผลค้นหา
 *   /concept-*    — ไฟล์ HTML ดีไซน์ต้นแบบใน public/ ที่ยังเสิร์ฟอยู่
 *                   เนื้อหาซ้ำกับหน้าจริง ปล่อยไว้จะแย่งอันดับกันเอง
 */
export default async function robots(): Promise<MetadataRoute.Robots> {
  const site = await getSiteInfo();

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/api/", "/concept-b/", "/concept-c/", "/concept-d/"],
    },
    sitemap: `${site.url}/sitemap.xml`,
    host: site.url,
  };
}
