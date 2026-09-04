import { cache } from "react";
import { publicClient } from "@/lib/supabase/public";
import { applyCopy, type Override } from "./copy";

/** ข้อความฉบับเผยแพร่ของหน้านั้น — เว็บหน้าบ้านอ่านชุดนี้ */
const publishedCopy = cache(async (page: string): Promise<Map<string, Override>> => {
  const sb = publicClient();
  if (!sb) return new Map();

  const { data, error } = await sb
    .from("site_copy")
    .select("key, published_value, source_hash")
    .eq("page", page);

  if (error) {
    console.error(`[cms] อ่านข้อความหน้า ${page} ไม่สำเร็จ:`, error.message);
    return new Map();
  }

  return new Map(
    (data ?? [])
      .filter((r) => r.published_value != null)
      .map((r) => [
        r.key as string,
        { value: r.published_value as string, hash: (r.source_hash as string) ?? null },
      ]),
  );
});

/**
 * ทะเบียนหน้าที่แก้ข้อความได้จากหลังบ้าน
 *
 * แต่ละหน้าชี้ไปที่ไฟล์ข้อมูลของตัวเอง ซึ่งเป็น "ค่าตั้งต้นในโค้ด"
 * ฐานข้อมูลเก็บเฉพาะจุดที่ลูกค้าแก้ ไม่ได้เก็บข้อความทั้งหน้า
 * ถ้าต่อฐานข้อมูลไม่ได้ หน้าเว็บก็ยังขึ้นครบด้วยค่าตั้งต้น
 */
export const COPY_PAGES = {
  neocoat: {
    label: "สีกันไฟ Neocoat",
    path: "/neocoat",
    group: "หน้า Landing (ยิงแอด)",
    note: null,
    load: () => import("@/data/fire-paint-lp"),
  },
  thinner: {
    label: "ทินเนอร์และน้ำมันสน",
    path: "/thinner",
    group: "หน้า Landing (ยิงแอด)",
    note: null,
    load: () => import("@/data/thinner-lp"),
  },
  "four-plus": {
    label: "สีน้ำ Four Plus",
    path: "/four-plus",
    group: "หน้า Landing (ยิงแอด)",
    note: null,
    load: () => import("@/data/four-plus-lp"),
  },
  "fire-blanket": {
    label: "ผ้ากันไฟ",
    path: "/fire-blanket",
    group: "หน้า Landing (ยิงแอด)",
    note: null,
    load: () => import("@/data/fire-blanket-lp"),
  },
  engineering: {
    label: "งานวิศวกรรมรับรอง",
    path: "/engineering",
    group: "หน้า Landing (ยิงแอด)",
    // หน้า /fireproofing หยิบบล็อกขั้นตอน เอกสาร ขอบเขต และ FAQ ชุดเดียวกันนี้ไปใช้
    note: "ใช้ร่วมกับหน้า /fireproofing ด้วย",
    load: () => import("@/data/engineering-lp"),
  },
} as const;

export type CopyPage = keyof typeof COPY_PAGES;

export const copyPageList = Object.entries(COPY_PAGES).map(([key, v]) => ({
  key: key as CopyPage,
  ...v,
}));

/**
 * ข้อความของหน้านั้นหลังทับด้วยค่าที่ลูกค้าแก้แล้ว
 *
 * คืนหน้าตาเหมือน namespace ของไฟล์ต้นฉบับเป๊ะ หน้าเว็บจึง destructure
 * ชื่อเดิมออกมาใช้ได้เลย ไม่ต้องแก้ JSX แม้แต่บรรทัดเดียว
 */
export async function copyFor<K extends CopyPage>(
  page: K,
): Promise<Awaited<ReturnType<(typeof COPY_PAGES)[K]["load"]>>> {
  const [defaults, overrides] = await Promise.all([
    COPY_PAGES[page].load(),
    publishedCopy(page),
  ]);

  /* COPY_PAGES[page] ยังเป็น union ของทุกหน้าในสายตา TypeScript จึงผูกกับ K
     ไม่ได้เอง — ต้องบอกชนิดตรงนี้ ตัว applyCopy คืนก้อนที่มีรูปร่างเดียวกับที่รับเข้าไป
     อยู่แล้ว (ทับเฉพาะข้อความ ไม่แตะโครงสร้าง) การประกาศจึงตรงกับของจริง */
  return applyCopy(defaults, overrides) as Awaited<
    ReturnType<(typeof COPY_PAGES)[K]["load"]>
  >;
}
