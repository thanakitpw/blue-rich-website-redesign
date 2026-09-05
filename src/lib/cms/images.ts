import { cache } from "react";
import { publicClient } from "@/lib/supabase/public";
import { serverClient } from "@/lib/supabase/server";
import { inPreview } from "./copy-pages";
import type { ImageOverrides } from "@/components/CmsImage";

/**
 * รูปที่ลูกค้าเปลี่ยนจากหลังบ้าน — กุญแจคือ path เดิมของรูปนั้น (ดู CmsImage)
 *
 * แยกออกมาจาก content.ts เพราะไฟล์นี้แตะ next/headers ส่วน content.ts ถูก
 * client component ลากเข้า bundle ผ่าน concept.tsx → Hero.tsx ถ้าเอามารวมกัน
 * จะพัง build ทันทีด้วย "next/headers ใช้ใน Pages Router ไม่ได้"
 *
 * ตอนพรีวิวอ่านฉบับร่างด้วยสิทธิ์ของคนที่ล็อกอิน เพื่อให้เห็นรูปที่เพิ่งเลือก
 * ก่อนกดเผยแพร่ ส่วนหน้าเว็บจริงอ่านเฉพาะฉบับที่เผยแพร่แล้วเหมือนเนื้อหาอื่น
 */
export const getImageOverrides = cache(async (): Promise<ImageOverrides> => {
  if (await inPreview()) {
    const sb = await serverClient();
    const { data } = (await sb
      ?.from("site_settings")
      .select("draft_value, published_value")
      .eq("key", "images")
      .maybeSingle()) ?? { data: null };
    return ((data?.draft_value ?? data?.published_value) as ImageOverrides) ?? {};
  }

  const sb = publicClient();
  if (!sb) return {};
  const { data, error } = await sb
    .from("site_settings")
    .select("published_value")
    .eq("key", "images")
    .maybeSingle();
  if (error) console.error("[cms] อ่านรูปที่ถูกเปลี่ยนไม่สำเร็จ:", error.message);
  return ((data?.published_value as ImageOverrides) ?? {}) as ImageOverrides;
});
