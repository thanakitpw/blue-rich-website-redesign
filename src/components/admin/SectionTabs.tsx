"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

/**
 * แท็บใต้หัวข้อหลัก — ที่อยู่ใหม่ของหน้าจอที่ถูกถอดออกจากเมนูซ้าย
 *
 * เมนูซ้ายเหลือหกข้อตามที่ลูกค้าขอ แต่เนื้อหาอย่างผลงาน คำถามที่พบบ่อย
 * หรือหมวดหมู่สินค้า ยังต้องแก้ได้อยู่ จึงย้ายมาเป็นแท็บของหัวข้อที่มันสังกัด
 */
const TABS = {
  products: [
    { href: "/admin/products", label: "สินค้า" },
    { href: "/admin/categories", label: "หมวดหมู่สินค้า" },
  ],
  settings: [
    { href: "/admin/settings", label: "ข้อมูลบริษัท" },
    { href: "/admin/menu", label: "เมนูและมาตรฐาน" },
    { href: "/admin/home", label: "หน้าแรก" },
    { href: "/admin/projects", label: "ผลงาน" },
    { href: "/admin/faqs", label: "คำถามที่พบบ่อย" },
    { href: "/admin/services", label: "หน้าบริการรับรอง" },
  ],
} as const;

export function SectionTabs({ group }: { group: keyof typeof TABS }) {
  const path = usePathname();

  return (
    <div className="border-b border-slate-200 bg-white px-8">
      <div className="-mb-px flex gap-1 overflow-x-auto">
        {TABS[group].map((t) => {
          /* /admin/products/new กับ /admin/products/[slug] ยังนับเป็นแท็บสินค้า
             แต่ /admin/settings ต้องเทียบเป๊ะ ไม่งั้นมันจะติดไฟทุกแท็บ */
          const active =
            t.href === "/admin/settings" ? path === t.href : path.startsWith(t.href);
          return (
            <Link
              key={t.href}
              href={t.href}
              aria-current={active ? "page" : undefined}
              className={`shrink-0 border-b-2 px-3.5 py-3 text-[13.5px] transition ${
                active
                  ? "border-brand-600 font-medium text-brand-700"
                  : "border-transparent text-slate-500 hover:text-slate-900"
              }`}
            >
              {t.label}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
