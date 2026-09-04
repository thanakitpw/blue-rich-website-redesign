"use server";

import { redirect } from "next/navigation";
import type { ProductRow } from "@/lib/cms/admin";
import {
  publishAllOf,
  publishEntity,
  revalidateSite,
  withCms,
  type ActionResult,
} from "@/lib/cms/actions";

/** ฟิลด์ที่หลังบ้านเขียนได้ — ไม่รวม id/published/has_draft ที่ฐานข้อมูลดูแลเอง */
export type ProductDraft = Omit<ProductRow, "id" | "has_draft" | "published_at" | "updated_at">;

export async function saveProduct(slug: string, draft: ProductDraft): Promise<ActionResult> {
  const res = await withCms(async (sb, userId) => {
    const { error } = await sb
      .from("products")
      .update({ ...draft, updated_by: userId })
      .eq("slug", slug);
    if (error) return { ok: false as const, error: error.message };

    /* เนื้อหาที่แก้ยังเป็นฉบับร่าง เว็บจริงยังไม่เปลี่ยน จึงไม่ต้องล้างแคช
       ยกเว้นกรณีเปลี่ยน slug ซึ่งกระทบเส้นทางของหน้า */
    if (draft.slug !== slug) revalidateSite();
    return { ok: true as const };
  });
  return res as ActionResult;
}

export async function createProduct(draft: ProductDraft): Promise<ActionResult> {
  const res = await withCms(async (sb, userId) => {
    const { error } = await sb.from("products").insert({ ...draft, updated_by: userId });
    if (error) {
      return {
        ok: false as const,
        error: error.code === "23505" ? "มีสินค้าที่ใช้ slug นี้อยู่แล้ว" : error.message,
      };
    }
    return { ok: true as const };
  });
  return res as ActionResult;
}

export async function publishProduct(slug: string) {
  return publishEntity("product", slug);
}

export async function publishAllProducts() {
  return publishAllOf("product");
}

export async function deleteProduct(slug: string): Promise<ActionResult> {
  const res = await withCms(async (sb) => {
    const { error } = await sb.from("products").delete().eq("slug", slug);
    if (error) return { ok: false as const, error: error.message };
    revalidateSite();
    return { ok: true as const };
  });
  if ((res as ActionResult).ok) redirect("/admin/products");
  return res as ActionResult;
}

/** ลากเรียงลำดับในหน้ารายการ */
export async function reorderProducts(slugs: string[]): Promise<ActionResult> {
  const res = await withCms(async (sb) => {
    for (const [i, slug] of slugs.entries()) {
      const { error } = await sb.from("products").update({ sort_order: i }).eq("slug", slug);
      if (error) return { ok: false as const, error: error.message };
    }
    return { ok: true as const };
  });
  return res as ActionResult;
}
