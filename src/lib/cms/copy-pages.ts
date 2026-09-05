import { cache } from "react";
import { draftMode } from "next/headers";
import { publicClient } from "@/lib/supabase/public";
import { serverClient } from "@/lib/supabase/server";
import { applyCopy, type Override } from "./copy";

/**
 * โหมดพรีวิวเปิดอยู่ไหม
 *
 * เปิดผ่าน /api/admin/preview ซึ่งกันด้วย proxy.ts + เช็ค cms_users ซ้ำอีกชั้น
 * ต่อให้ใครตั้งคุกกี้เองก็ยังอ่านฉบับร่างไม่ได้ เพราะ RLS กันคอลัมน์ draft_* ไว้
 */
export const inPreview = cache(async () => (await draftMode()).isEnabled);

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

/** ฉบับร่างต้องอ่านด้วยสิทธิ์ของคนที่ล็อกอิน เพราะ anon ถูกกันคอลัมน์ draft_* ไว้ */
const draftCopy = cache(async (page: string): Promise<Map<string, Override>> => {
  const sb = await serverClient();
  if (!sb) return new Map();

  const { data } = await sb
    .from("site_copy")
    .select("key, draft_value, published_value, source_hash")
    .eq("page", page);

  return new Map(
    (data ?? [])
      .map(
        (r) =>
          [
            r.key as string,
            {
              value: (r.draft_value ?? r.published_value) as string,
              hash: (r.source_hash as string) ?? null,
            },
          ] as const,
      )
      .filter(([, v]) => v.value != null),
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
  home: {
    label: "หน้าแรก",
    path: "/",
    group: "หน้าเว็บหลัก",
    note: null,
    load: () => import("@/data/pages/home"),
  },
  about: {
    label: "เกี่ยวกับเรา",
    path: "/about",
    group: "หน้าเว็บหลัก",
    note: null,
    load: () => import("@/data/pages/about"),
  },
  contact: {
    label: "ติดต่อเรา",
    path: "/contact",
    group: "หน้าเว็บหลัก",
    note: null,
    load: () => import("@/data/pages/contact"),
  },
  standards: {
    label: "มาตรฐานและผลทดสอบ",
    path: "/standards",
    group: "หน้าเว็บหลัก",
    note: null,
    load: () => import("@/data/pages/standards"),
  },
  intumescent: {
    label: "สีกันไฟ Neocoat (หน้าหมวด)",
    path: "/intumescent",
    group: "หน้าเว็บหลัก",
    note: null,
    load: () => import("@/data/pages/intumescent"),
  },
  paint: {
    label: "สีน้ำ / สีน้ำมัน",
    path: "/paint",
    group: "หน้าเว็บหลัก",
    note: null,
    load: () => import("@/data/pages/paint"),
  },
  hardware: {
    label: "ฮาร์ดแวร์",
    path: "/hardware",
    group: "หน้าเว็บหลัก",
    note: null,
    load: () => import("@/data/pages/hardware"),
  },
  fireproofing: {
    label: "รับรองสีกันไฟ (หน้าหลัก)",
    path: "/fireproofing",
    group: "หน้าเว็บหลัก",
    note: "บล็อกขั้นตอน เอกสาร ขอบเขต และ FAQ ใช้ชุดเดียวกับหน้า “งานวิศวกรรมรับรอง”",
    load: () => import("@/data/pages/fireproofing"),
  },
  "product-detail": {
    label: "หน้าสินค้า (โครงร่วมทุกตัว)",
    path: "/products/neocoat-intumescent-paint-s",
    group: "หน้าที่ใช้โครงร่วมกัน",
    note: "หัวข้อและแถบการันตีที่ทุกหน้าสินค้าใช้ร่วมกัน · เนื้อหาของสินค้าแต่ละตัวแก้ที่หน้า “สินค้า”",
    load: () => import("@/data/pages/product-detail"),
  },
  "article-detail": {
    label: "หน้าบทความ (โครงร่วมทุกชิ้น)",
    path: "/news/ministerial-regulation-2567",
    group: "หน้าที่ใช้โครงร่วมกัน",
    note: "เนื้อหาบทความแต่ละชิ้นแก้ที่หน้า “บทความ”",
    load: () => import("@/data/pages/article-detail"),
  },
  "service-detail": {
    label: "หน้าบริการรับรอง (โครงร่วม)",
    path: "/fireproofing/certification",
    group: "หน้าที่ใช้โครงร่วมกัน",
    note: "เนื้อหาของแต่ละบริการแก้ที่ ตั้งค่าเว็บไซต์ → หน้าบริการรับรอง",
    load: () => import("@/data/pages/service-detail"),
  },
  news: {
    label: "บทความ (หน้ารวม)",
    path: "/news",
    group: "หน้าเว็บหลัก",
    note: null,
    load: () => import("@/data/pages/news"),
  },
  products: {
    label: "สินค้าทั้งหมด",
    path: "/products",
    group: "หน้าเว็บหลัก",
    note: null,
    load: () => import("@/data/pages/products"),
  },
  projects: {
    label: "ผลงานของเรา",
    path: "/projects",
    group: "หน้าเว็บหลัก",
    note: null,
    load: () => import("@/data/pages/projects"),
  },
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
  const preview = await inPreview();
  const [defaults, overrides] = await Promise.all([
    COPY_PAGES[page].load(),
    preview ? draftCopy(page) : publishedCopy(page),
  ]);

  /* COPY_PAGES[page] ยังเป็น union ของทุกหน้าในสายตา TypeScript จึงผูกกับ K
     ไม่ได้เอง — ต้องบอกชนิดตรงนี้ ตัว applyCopy คืนก้อนที่มีรูปร่างเดียวกับที่รับเข้าไป
     อยู่แล้ว (ทับเฉพาะข้อความ ไม่แตะโครงสร้าง) การประกาศจึงตรงกับของจริง */
  return applyCopy(defaults, overrides, "", preview) as Awaited<
    ReturnType<(typeof COPY_PAGES)[K]["load"]>
  >;
}
