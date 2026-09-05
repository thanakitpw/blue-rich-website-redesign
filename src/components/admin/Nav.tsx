"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

/**
 * เมนูหลังบ้าน — ตั้งใจให้สั้นแค่หกอย่างตามที่ลูกค้าขอ
 *
 * หน้าจอที่เคยอยู่ในเมนูไม่ได้หายไปไหน แต่ถูกยุบไปเป็นแท็บอยู่ใต้หัวข้อที่มัน
 * เป็นเจ้าของ (ดู SectionTabs) — `match` คือรายการเส้นทางที่ยังต้องทำให้เมนู
 * ข้อนี้ติดไฟอยู่ ไม่งั้นกดเข้าแท็บแล้วเมนูซ้ายจะดูเหมือนไม่ได้เลือกอะไรเลย
 */
const items: { href: string; label: string; exact?: boolean; match?: string[] }[] = [
  { href: "/admin", label: "แดชบอร์ด", exact: true },
  { href: "/admin/products", label: "สินค้า", match: ["/admin/categories"] },
  { href: "/admin/articles", label: "บทความ" },
  { href: "/admin/copy", label: "ข้อความในหน้าเว็บ" },
  { href: "/admin/media", label: "คลังรูป" },
  {
    href: "/admin/settings",
    label: "ตั้งค่าเว็บไซต์",
    match: ["/admin/menu", "/admin/home", "/admin/projects", "/admin/faqs", "/admin/services"],
  },
];

export function Nav() {
  const path = usePathname();

  return (
    <nav className="flex-1 space-y-1 overflow-y-auto p-3">
      {items.map((n) => {
        const active = n.exact
          ? path === n.href
          : [n.href, ...(n.match ?? [])].some((p) => path.startsWith(p));
        return (
          <Link
            key={n.href}
            href={n.href}
            aria-current={active ? "page" : undefined}
            className={`block rounded-lg px-3 py-2 text-[13.5px] transition ${
              active
                ? "bg-brand-50 font-medium text-brand-700"
                : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
            }`}
          >
            {n.label}
          </Link>
        );
      })}
    </nav>
  );
}
