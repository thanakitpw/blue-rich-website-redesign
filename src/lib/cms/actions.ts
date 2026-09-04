import { revalidatePath } from "next/cache";
import { currentCmsUser, serverClient } from "@/lib/supabase/server";

/**
 * ตัวช่วยที่ทุก server action ของหลังบ้านใช้ร่วมกัน
 *
 * ── ทำไมต้องเช็คสิทธิ์ซ้ำในทุก action ──
 * proxy.ts กันคนที่ยังไม่ล็อกอิน และ (dash)/layout.tsx กันคนที่ไม่ใช่ทีมงาน
 * แต่ server action ถูกยิงตรงได้โดยไม่ผ่าน layout — การเช็คที่ layout จึงเป็น
 * แค่เรื่อง UI ไม่ใช่เรื่องความปลอดภัย ด่านจริงคือตรงนี้กับ RLS ในฐานข้อมูล
 */
export type ActionResult = { ok: true } | { ok: false; error: string };

export async function withCms<T>(
  fn: (sb: NonNullable<Awaited<ReturnType<typeof serverClient>>>, userId: string) => Promise<T>,
): Promise<T | { ok: false; error: string }> {
  const user = await currentCmsUser();
  if (!user) return { ok: false, error: "ไม่มีสิทธิ์แก้ไขเนื้อหา" };

  const sb = await serverClient();
  if (!sb) return { ok: false, error: "ยังไม่ได้ตั้งค่าการเชื่อมต่อฐานข้อมูล" };

  return fn(sb, user.id);
}

/**
 * ล้างแคชหน้าเว็บทั้งเว็บ
 *
 * ข้อมูลเกือบทุกชิ้นโผล่หลายหน้าพร้อมกัน (สินค้าตัวเดียวอยู่ทั้งหน้าแรก หน้าหมวด
 * หน้าสินค้า และหน้าบริการ) การไล่ระบุทีละ path จึงพลาดง่ายและพลาดแบบเงียบๆ
 * เว็บนี้มี 42 หน้า การสร้างใหม่ทั้งหมดถูกกว่าการมีหน้าที่ข้อมูลค้าง
 */
export function revalidateSite() {
  revalidatePath("/", "layout");
}

/** กดเผยแพร่ผ่าน RPC ตัวเดียวกับที่ seed ใช้ แล้วล้างแคช */
export async function publishEntity(entity: string, key: string): Promise<ActionResult> {
  const res = await withCms(async (sb) => {
    const { error } = await sb.rpc("cms_publish", { p_entity: entity, p_key: key });
    if (error) return { ok: false as const, error: error.message };
    revalidateSite();
    return { ok: true as const };
  });
  return res as ActionResult;
}

/** เผยแพร่ทุกรายการที่มีร่างค้างของชนิดนั้น */
export async function publishAllOf(entity: string): Promise<ActionResult> {
  const res = await withCms(async (sb) => {
    const { error } = await sb.rpc("cms_publish_all", { p_entity: entity });
    if (error) return { ok: false as const, error: error.message };
    revalidateSite();
    return { ok: true as const };
  });
  return res as ActionResult;
}

/**
 * แปลงข้อความเป็น slug ที่ใช้เป็น URL ได้
 * ภาษาไทยใช้เป็น slug ไม่ได้ในทางปฏิบัติ จึงคืนค่าว่างให้ผู้เรียกบังคับกรอกเอง
 */
export const toSlug = (s: string) =>
  s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
