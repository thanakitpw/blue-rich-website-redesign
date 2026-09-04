import Link from "next/link";
import { dashboardStats, listArticles, listProducts, timeAgo } from "@/lib/cms/admin";

export const dynamic = "force-dynamic";

function Stat({ label, value, href }: { label: string; value: number; href: string }) {
  return (
    <Link href={href} className="card-admin block p-5 transition hover:border-accent-300">
      <span className="block text-[13px] text-slate-500">{label}</span>
      <span className="mt-2 block text-[26px] font-bold text-slate-900 tabular-nums">{value}</span>
    </Link>
  );
}

export default async function DashboardPage() {
  const [stats, products, articles] = await Promise.all([
    dashboardStats(),
    listProducts(),
    listArticles(),
  ]);

  const pending =
    stats.dirtyProducts + stats.dirtyArticles + stats.dirtyProjects +
    stats.dirtyFaqs + stats.dirtyServices + stats.dirtyCategories + stats.dirtySettings;

  /* รวมสินค้ากับบทความเข้าด้วยกันแล้วเรียงตามเวลาแก้ล่าสุด
     ลูกค้าคิดเป็น "อะไรที่เพิ่งแตะ" ไม่ได้คิดแยกเป็นชนิดเนื้อหา */
  const recent = [
    ...products.map((p) => ({ kind: "สินค้า", name: p.name, href: `/admin/products/${p.slug}`, at: p.updated_at, draft: p.has_draft })),
    ...articles.map((a) => ({ kind: "บทความ", name: a.title, href: `/admin/articles/${a.slug}`, at: a.updated_at, draft: a.has_draft })),
  ]
    .sort((a, b) => b.at.localeCompare(a.at))
    .slice(0, 8);

  const pendingRows: { label: string; count: number; href: string }[] = [
    { label: "สินค้า", count: stats.dirtyProducts, href: "/admin/products" },
    { label: "บทความ", count: stats.dirtyArticles, href: "/admin/articles" },
    { label: "ผลงาน", count: stats.dirtyProjects, href: "/admin/projects" },
    { label: "คำถามที่พบบ่อย", count: stats.dirtyFaqs, href: "/admin/faqs" },
    { label: "หน้าบริการรับรอง", count: stats.dirtyServices, href: "/admin/services" },
    { label: "หมวดหมู่สินค้า", count: stats.dirtyCategories, href: "/admin/categories" },
    { label: "ค่าตั้งค่าเว็บไซต์", count: stats.dirtySettings, href: "/admin/settings" },
  ].filter((r) => r.count > 0);

  return (
    <div className="max-w-4xl px-8 py-8">
      <h1 className="admin-title">แดชบอร์ด</h1>
      <p className="mt-1 text-sm text-slate-500">
        {pending === 0
          ? "เนื้อหาทุกอย่างตรงกับที่เผยแพร่อยู่บนเว็บแล้ว"
          : `มีร่างที่ยังไม่เผยแพร่ ${pending} จุด — เว็บจริงยังเป็นเนื้อหาชุดเดิม`}
      </p>

      <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Stat label="สินค้า" value={stats.products} href="/admin/products" />
        <Stat label="บทความ" value={stats.articles} href="/admin/articles" />
        <Stat label="ผลงาน" value={stats.projects} href="/admin/projects" />
        <Stat label="คำถามที่พบบ่อย" value={stats.faqs} href="/admin/faqs" />
      </div>

      {pendingRows.length > 0 && (
        <section className="card-admin mt-8">
          <h2 className="border-b border-slate-200 px-5 py-4 text-[15px] font-semibold text-slate-900">
            รอเผยแพร่
          </h2>
          <ul className="divide-y divide-slate-100">
            {pendingRows.map((r) => (
              <li key={r.href}>
                <Link href={r.href} className="flex items-center gap-3 px-5 py-3 text-sm transition hover:bg-slate-50">
                  <span className="flex-1 text-slate-900">{r.label}</span>
                  <span className="chip-draft">{r.count} จุด</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="card-admin mt-8">
        <h2 className="border-b border-slate-200 px-5 py-4 text-[15px] font-semibold text-slate-900">
          แก้ไขล่าสุด
        </h2>
        <ul className="divide-y divide-slate-100">
          {recent.map((r) => (
            <li key={r.href}>
              <Link href={r.href} className="flex items-center gap-3 px-5 py-3 text-sm transition hover:bg-slate-50">
                <span className="w-14 shrink-0 text-[12px] text-slate-400">{r.kind}</span>
                <span className="min-w-0 flex-1 truncate text-slate-900">{r.name}</span>
                {r.draft && <span className="chip-draft">มีร่าง</span>}
                <span className="shrink-0 text-[12px] text-slate-400">{timeAgo(r.at)}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
