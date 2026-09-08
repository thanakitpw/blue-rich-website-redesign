import type { MetadataRoute } from "next";
import { getArticles, getNav, getProducts, getSiteInfo } from "@/lib/cms/content";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [site, nav, products, articles] = await Promise.all([
    getSiteInfo(),
    getNav(),
    getProducts(),
    getArticles(),
  ]);

  /* เมนูแก้ได้จากหลังบ้าน sitemap จึงต้องแบนเมนูชุดที่ใช้จริงตอนนั้น
     ไม่ใช่ navRoutes ที่คำนวณจากค่าตั้งต้นในไฟล์ */
  const navRoutes = nav.flatMap((item) => [
    item.href,
    ...(item.children ?? []).map((c) => c.href),
  ]);

  /* Everything reachable from the main menu, plus the catalogue index. The
   * menu links straight to some product pages — those are de-duplicated
   * against the product loop below. */
  const menuRoutes = navRoutes
    .filter((path) => !path.includes("#") && !path.startsWith("/products/"))
    .map((path) => (path === "/" ? "" : path));

  /* หน้าที่ไม่ได้อยู่ในเมนูแล้ว แต่ยังต้องอยู่ใน sitemap
       /standards    — ลิงก์มาจากการ์ดมาตรฐานหน้าแรก
       /intumescent  — หน้าหมวดสีกันไฟ ถูกถอดออกจากเมนูตอนยกสองสูตรขึ้นเป็นเมนูหลัก
                       ยังลิงก์จากการ์ดหน้าแรกและหน้า /paint */
  const staticRoutes = Array.from(
    new Set([...menuRoutes, "/products", "/standards", "/intumescent"]),
  );

  /* หน้า landing อยู่นอกเมนู (ตั้งใจไม่ให้มีทางออกจากหน้า) แต่เป็นหน้าที่ตั้งใจ
     ให้ติดอันดับด้วยคำค้นระดับหมวด จึงต้องอยู่ใน sitemap และให้น้ำหนักสูงกว่า
     หน้าทั่วไป — คำค้นรายรุ่นยังเป็นของหน้าสินค้าเหมือนเดิม */
  const landingRoutes = ["/neocoat", "/engineering", "/four-plus", "/thinner", "/fire-blanket"];

  return [
    ...staticRoutes.map((path) => ({
      url: `${site.url}${path}`,
      changeFrequency: "monthly" as const,
      priority: path === "" ? 1 : 0.8,
    })),
    ...landingRoutes.map((path) => ({
      url: `${site.url}${path}`,
      changeFrequency: "monthly" as const,
      priority: 0.9,
    })),
    ...products.map((p) => ({
      url: `${site.url}/products/${p.slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
    ...articles.map((a) => ({
      url: `${site.url}/news/${a.slug}`,
      lastModified: new Date(a.date),
      changeFrequency: "yearly" as const,
      priority: 0.5,
    })),
  ];
}
