"use server";

import { revalidateSite, withCms, type ActionResult } from "@/lib/cms/actions";

/**
 * บันทึกรูปที่เพิ่งอัปโหลดลงตาราง media
 *
 * ไฟล์ถูกอัปโหลดจากเบราว์เซอร์ตรงเข้า Supabase Storage ไม่ผ่านเซิร์ฟเวอร์ Next
 * เพราะ server action มีเพดานขนาด body และการส่งไฟล์ผ่านสองต่อไม่ได้อะไรเพิ่ม
 * — สิทธิ์เขียน bucket ถูกคุมด้วย storage policy ที่เช็ค is_cms_user() อยู่แล้ว
 */
export async function registerMedia(input: {
  path: string;
  url: string;
  filename: string;
  mime: string | null;
  bytes: number | null;
  folder: string;
}): Promise<ActionResult> {
  const res = await withCms(async (sb, userId) => {
    const { error } = await sb.from("media").insert({ ...input, created_by: userId });
    if (error) return { ok: false as const, error: error.message };
    return { ok: true as const };
  });
  return res as ActionResult;
}

export async function deleteMedia(id: string, path: string): Promise<ActionResult> {
  const res = await withCms(async (sb) => {
    /* ลบไฟล์ก่อนแล้วค่อยลบแถว ถ้าสลับกันแล้วลบไฟล์พลาด จะเหลือไฟล์กำพร้าที่ไม่มี
       ใครรู้ว่ามีอยู่ ส่วนทางนี้ถ้าพลาดจะเหลือแถวที่ชี้ไปไฟล์ที่ไม่มี ซึ่งเห็นได้ */
    const { error: fileError } = await sb.storage.from("media").remove([path]);
    if (fileError) return { ok: false as const, error: fileError.message };

    const { error } = await sb.from("media").delete().eq("id", id);
    if (error) return { ok: false as const, error: error.message };

    revalidateSite();
    return { ok: true as const };
  });
  return res as ActionResult;
}
