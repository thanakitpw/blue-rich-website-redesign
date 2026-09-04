import Image from "next/image";
import Link from "next/link";
import { listCategories, listProducts, timeAgo } from "@/lib/cms/admin";
import { ActionButton } from "@/components/admin/SaveBar";
import { publishAllProducts } from "./actions";

export const dynamic = "force-dynamic";

export default async function ProductsPage() {
  const [products, categories] = await Promise.all([listProducts(), listCategories()]);
  const byCategory = categories.map((c) => ({
    category: c,
    items: products.filter((p) => p.category_slug === c.slug),
  }));
  const orphans = products.filter((p) => !categories.some((c) => c.slug === p.category_slug));
  const dirty = products.filter((p) => p.has_draft).length;

  return (
    <div className="max-w-5xl px-8 py-8">
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex-1">
          <h1 className="admin-title">สินค้า</h1>
          <p className="mt-1 text-sm text-slate-500">
            {products.length} รายการ
            {dirty > 0 && ` · ${dirty} รายการมีร่างที่ยังไม่เผยแพร่`}
          </p>
        </div>
        {dirty > 0 && (
          <ActionButton action={publishAllProducts} label={`เผยแพร่ทั้งหมด (${dirty})`} okText="เผยแพร่แล้ว" />
        )}
        <Link href="/admin/products/new" className="btn-solid">+ เพิ่มสินค้า</Link>
      </div>

      <div className="mt-6 space-y-6">
        {[...byCategory, ...(orphans.length ? [{ category: null, items: orphans }] : [])].map(
          ({ category, items }) => (
            <section key={category?.slug ?? "orphans"} className="card-admin">
              <h2 className="flex items-center gap-2 border-b border-slate-200 px-5 py-3.5 text-[14px] font-semibold text-slate-900">
                {category?.name ?? "ไม่มีหมวดหมู่"}
                <span className="text-[12px] font-normal text-slate-500">{items.length} รายการ</span>
              </h2>

              {items.length === 0 ? (
                <p className="px-5 py-6 text-sm text-slate-500">ยังไม่มีสินค้าในหมวดนี้</p>
              ) : (
                <ul className="divide-y divide-slate-100">
                  {items.map((p) => (
                    <li key={p.slug}>
                      <Link
                        href={`/admin/products/${p.slug}`}
                        className="flex items-center gap-3 px-5 py-3 transition hover:bg-slate-50"
                      >
                        <span className="relative size-10 shrink-0 overflow-hidden rounded-md border border-slate-200 bg-slate-50">
                          {p.image && (
                            <Image src={p.image} alt="" fill sizes="40px" className="object-contain p-0.5" />
                          )}
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-[14px] text-slate-900">{p.name}</span>
                          <span className="block truncate font-mono text-[11.5px] text-slate-400">{p.slug}</span>
                        </span>
                        {p.featured && <span className="chip-live">แนะนำ</span>}
                        {p.has_draft && <span className="chip-draft">มีร่าง</span>}
                        <span className="shrink-0 text-[12px] text-slate-400">{timeAgo(p.updated_at)}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          ),
        )}
      </div>
    </div>
  );
}
