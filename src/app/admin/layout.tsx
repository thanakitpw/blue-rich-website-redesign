import type { Metadata } from "next";

/**
 * หลังบ้านอยู่นอกกลุ่ม (site) จึงไม่มีเมนู/ส่วนท้ายของเว็บมารบกวน
 * ปิด index ทุกหน้าในนี้ ไม่ให้ Google เก็บ
 */
export const metadata: Metadata = {
  title: "ระบบจัดการเนื้อหา",
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <div className="min-h-screen bg-slate-50 text-slate-900">{children}</div>;
}
