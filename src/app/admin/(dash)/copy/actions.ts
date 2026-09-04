"use server";

import { hashText } from "@/lib/cms/copy";
import { COPY_PAGES, type CopyPage } from "@/lib/cms/copy-pages";
import { publishEntity, withCms, type ActionResult } from "@/lib/cms/actions";

export type CopyEdit = { key: string; value: string; sourceHash: string };

/**
 * บันทึกเฉพาะจุดที่ต่างจากค่าตั้งต้น
 *
 * จุดที่ลูกค้าแก้กลับไปเหมือนเดิมจะถูกลบแถวทิ้ง ไม่ใช่เก็บไว้เป็นค่าซ้ำ
 * ฐานข้อมูลจึงมีแต่ "สิ่งที่ต่างจากโค้ด" ทำให้ตอบได้เสมอว่าลูกค้าแก้อะไรไปบ้าง
 */
export async function saveCopy(page: CopyPage, edits: CopyEdit[]): Promise<ActionResult> {
  const res = await withCms(async (sb, userId) => {
    const rows = edits.map((e) => ({
      page,
      key: e.key,
      draft_value: e.value,
      source_hash: e.sourceHash,
      updated_by: userId,
    }));

    if (rows.length) {
      const { error } = await sb.from("site_copy").upsert(rows, { onConflict: "page,key" });
      if (error) return { ok: false as const, error: error.message };
    }

    const keep = new Set(edits.map((e) => e.key));
    const { data: existing, error: readError } = await sb
      .from("site_copy")
      .select("key")
      .eq("page", page);
    if (readError) return { ok: false as const, error: readError.message };

    const drop = (existing ?? []).map((r) => r.key as string).filter((k) => !keep.has(k));
    if (drop.length) {
      const { error } = await sb.from("site_copy").delete().eq("page", page).in("key", drop);
      if (error) return { ok: false as const, error: error.message };
    }

    return { ok: true as const };
  });
  return res as ActionResult;
}

export async function publishCopy(page: CopyPage) {
  return publishEntity("copy_page", page);
}

/**
 * นับจุดที่แก้แล้วของแต่ละหน้า สำหรับหน้ารายการ
 * เดินผ่าน COPY_PAGES เพื่อให้แน่ใจว่าคีย์ที่นับยังมีอยู่จริงในโค้ดปัจจุบัน
 */
export async function copyCounts() {
  const res = await withCms(async (sb) => {
    const { data } = await sb.from("site_copy").select("page, draft_value, published_value, key, source_hash");
    return data ?? [];
  });
  const rows = Array.isArray(res) ? res : [];

  const out: Record<string, { edited: number; dirty: number }> = {};
  for (const key of Object.keys(COPY_PAGES)) out[key] = { edited: 0, dirty: 0 };
  for (const r of rows) {
    const p = r.page as string;
    if (!out[p]) continue;
    out[p].edited++;
    if (r.draft_value !== r.published_value) out[p].dirty++;
  }
  return out;
}

/** hash ของข้อความตั้งต้น ใช้ตอนบันทึกเพื่อกันข้อความไปโผล่ผิดที่ทีหลัง */
export async function hashOf(text: string) {
  return hashText(text);
}
