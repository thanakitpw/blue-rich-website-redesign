import { listCategories, listProducts } from "@/lib/cms/admin";
import { listMedia } from "@/lib/cms/media";
import { CategoriesForm } from "@/components/admin/CategoriesForm";

export const dynamic = "force-dynamic";

export default async function AdminCategoriesPage() {
  const [rows, media, products] = await Promise.all([listCategories(), listMedia(), listProducts()]);

  /* จำนวนสินค้าต่อหมวด — ใช้กันไม่ให้ลบหมวดที่ยังมีสินค้าอยู่
     (ฐานข้อมูลมี foreign key กันอยู่แล้ว แต่บอกล่วงหน้าดีกว่าให้กดแล้วเจอ error) */
  const counts: Record<string, number> = {};
  for (const p of products) counts[p.category_slug] = (counts[p.category_slug] ?? 0) + 1;

  return <CategoriesForm rows={rows} media={media} counts={counts} />;
}
