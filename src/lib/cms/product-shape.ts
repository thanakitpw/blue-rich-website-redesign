import type { Product } from "@/data/products";
import type { ProductRow } from "./admin";
import { markCopy } from "./copy";

/**
 * แปลงแถวสินค้าในฐานข้อมูล ↔ รูป Product ที่หน้าเว็บใช้ และห่อเครื่องหมายสำหรับพรีวิว
 *
 * ไฟล์นี้ตั้งใจให้เป็นฟังก์ชันล้วน ไม่แตะ Supabase หรือ next/headers เพื่อให้ทดสอบ
 * ตรงๆ ด้วย node ได้ ส่วนที่อ่านฐานข้อมูลอยู่ใน product-preview.ts
 */

/** คอลัมน์ที่ข้อความข้างในโผล่บนหน้าสินค้าและแก้ได้จากฟอร์ม
    slug/รูป/สินค้าที่เกี่ยวข้อง เป็นโครงสร้าง ไม่ใช่ข้อความ จึงไม่อยู่ในนี้ */
const MARKED_COLUMNS = [
  "name",
  "tagline",
  "badges",
  "quick_specs",
  "description",
  "lists",
  "specs",
  "spec_note",
  "spec_table",
  "downloads",
  "download_note",
  "faq",
  "legal_standards",
] as const satisfies readonly (keyof ProductRow)[];

/** คีย์ในก้อนข้อมูลที่เป็นลิงก์ไฟล์ ไม่ใช่ข้อความให้คนอ่าน */
const STRUCTURAL = new Set(["href"]);

function markDeep(node: unknown, path: string): unknown {
  if (typeof node === "string") return node.trim() ? markCopy(path, node) : node;
  if (Array.isArray(node)) return node.map((v, i) => markDeep(v, `${path}.${i}`));
  if (node && typeof node === "object") {
    return Object.fromEntries(
      Object.entries(node).map(([k, v]) => [k, STRUCTURAL.has(k) ? v : markDeep(v, `${path}.${k}`)]),
    );
  }
  return node;
}

/** ห่อข้อความในแถวฉบับร่างด้วยเครื่องหมาย กุญแจตรงกับชื่อคอลัมน์ในฟอร์ม */
export function markRow(row: ProductRow): ProductRow {
  const out: Record<string, unknown> = { ...row };
  for (const col of MARKED_COLUMNS) out[col] = markDeep(row[col], col);
  return out as ProductRow;
}

/** แถวในฐานข้อมูล → รูป Product ที่หน้าเว็บใช้ (แปลงเหมือน private.product_snapshot) */
export function productFromRow(r: ProductRow): Product {
  return {
    slug: r.slug,
    name: r.name,
    category: r.category_slug,
    tagline: r.tagline,
    cardSummary: r.card_summary,
    badges: r.badges ?? [],
    quickSpecs: r.quick_specs ?? [],
    image: r.image,
    gallery: r.gallery ?? [],
    downloads: r.downloads?.length ? r.downloads : undefined,
    downloadNote: r.download_note || undefined,
    description: r.description ?? [],
    lists: r.lists?.length ? r.lists : undefined,
    specs: r.specs ?? [],
    specNote: r.spec_note || undefined,
    table: r.spec_table ?? undefined,
    installation: r.installation || undefined,
    legalStandards: r.legal_standards || undefined,
    faq: r.faq ?? [],
    related: r.related ?? [],
    featured: r.featured || undefined,
    bestSeller: r.best_seller || undefined,
  };
}
