"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const groups: { title: string; items: { href: string; label: string; exact?: boolean }[] }[] = [
  {
    title: "ภาพรวม",
    items: [{ href: "/admin", label: "แดชบอร์ด", exact: true }],
  },
  {
    title: "เนื้อหา",
    items: [
      { href: "/admin/products", label: "สินค้า" },
      { href: "/admin/categories", label: "หมวดหมู่สินค้า" },
      { href: "/admin/articles", label: "บทความ" },
      { href: "/admin/projects", label: "ผลงาน" },
      { href: "/admin/services", label: "หน้าบริการรับรอง" },
      { href: "/admin/faqs", label: "คำถามที่พบบ่อย" },
    ],
  },
  {
    title: "ทั้งเว็บไซต์",
    items: [
      { href: "/admin/settings", label: "ข้อมูลบริษัท" },
      { href: "/admin/menu", label: "เมนูและมาตรฐาน" },
      { href: "/admin/home", label: "หน้าแรก" },
      { href: "/admin/media", label: "คลังรูป" },
    ],
  },
];

export function Nav() {
  const path = usePathname();

  return (
    <nav className="flex-1 space-y-5 overflow-y-auto p-3">
      {groups.map((g) => (
        <div key={g.title}>
          <p className="px-3 pb-1.5 text-[11px] font-semibold tracking-wider text-slate-400 uppercase">
            {g.title}
          </p>
          <div className="space-y-0.5">
            {g.items.map((n) => {
              const active = n.exact ? path === n.href : path.startsWith(n.href);
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
          </div>
        </div>
      ))}
    </nav>
  );
}
