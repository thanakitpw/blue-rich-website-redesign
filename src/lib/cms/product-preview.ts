import { cache } from "react";
import type { Product } from "@/data/products";
import { getProductRow } from "./admin";
import { getProduct } from "./content";
import { inPreview } from "./copy-pages";
import { markRow, productFromRow } from "./product-shape";

/**
 * หน้าสินค้าในโหมดพรีวิวของหลังบ้าน
 *
 * ── ทำไมต้องมีทางแยกจาก getProduct ──
 * เว็บหน้าบ้านอ่านคอลัมน์ published (สแนปช็อตตอนกดเผยแพร่) ส่วนหน้าจอแก้ไขต้อง
 * เห็น "ฉบับร่าง" ที่กำลังพิมพ์อยู่ จึงอ่านคอลัมน์ร่างตรงๆ ด้วยสิทธิ์ของผู้ใช้
 * หลังบ้าน (RLS กันคนอื่นอ่านไว้แล้ว) แล้วประกอบเป็นรูป Product เดียวกับที่
 * private.product_snapshot ใน SQL ให้ — สองที่นี้ต้องแปลงเหมือนกัน ไม่งั้นพรีวิว
 * กับเว็บจริงจะหน้าตาไม่ตรงกัน (ดู supabase/migrations/0002_cms_snapshots.sql)
 *
 * ── เครื่องหมายบนข้อความ ──
 * ทุกข้อความที่แก้ได้ถูกห่อด้วยเครื่องหมายมองไม่เห็น (ดู copy.ts) กุญแจคือชื่อคอลัมน์
 * ตามด้วยเส้นทางในก้อนข้อมูล เช่น tagline · specs.1.value · faq.0.a
 * ฟอร์มสินค้าในหลังบ้านติด data-cms-key ชุดเดียวกันไว้ที่ช่องกรอก
 * คลิกข้อความบนพรีวิวจึงเด้งไปช่องที่ถูกต้องได้ (ดู ProductForm.tsx)
 */

/**
 * สินค้าที่หน้า /products/[slug] จะแสดง
 * พรีวิว → ฉบับร่างพร้อมเครื่องหมาย (สินค้าที่ยังไม่เคยเผยแพร่ก็เปิดดูได้)
 * เว็บจริง → ฉบับเผยแพร่ตามปกติ
 */
export const getProductForPage = cache(async (slug: string): Promise<Product | undefined> => {
  if (!(await inPreview())) return getProduct(slug);
  const row = await getProductRow(slug);
  /* อ่านฉบับร่างไม่ได้ (เช่นคุกกี้พรีวิวค้างแต่เซสชันหลังบ้านหมดแล้ว) → ถอยไปฉบับเผยแพร่ */
  return row ? productFromRow(markRow(row)) : getProduct(slug);
});
