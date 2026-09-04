"use server";

import { publishEntity, withCms, type ActionResult } from "@/lib/cms/actions";

/**
 * ค่าตั้งค่าเว็บไซต์ทุกคีย์ใช้ทางเดินเดียวกัน — บันทึกลง draft_value
 * แล้วค่อยคัดขึ้น published_value ตอนกดเผยแพร่
 */
export async function saveSetting(key: string, value: unknown): Promise<ActionResult> {
  const res = await withCms(async (sb, userId) => {
    const { error } = await sb
      .from("site_settings")
      .upsert({ key, draft_value: value, updated_by: userId }, { onConflict: "key" });
    if (error) return { ok: false as const, error: error.message };
    return { ok: true as const };
  });
  return res as ActionResult;
}

export async function publishSetting(key: string) {
  return publishEntity("setting", key);
}
