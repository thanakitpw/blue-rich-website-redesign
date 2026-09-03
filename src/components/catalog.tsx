"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo, useState } from "react";
import { Icon } from "@/components/ui";
import { ProductCard } from "@/components/cards";
import type { Product } from "@/data/products";
import { nav } from "@/data/site";

/* --------------------------------------------------------------- Sidebar
 * Category rail modelled on the reference archive page: every product group
 * the site sells, with the current branch highlighted and its children
 * listed underneath.
 */

const groups = nav.filter((i) => i.children);

export function CatalogSidebar({ extra }: { extra?: React.ReactNode }) {
  const pathname = usePathname();
  const isActive = (href: string) => {
    const base = href.split("#")[0];
    return base === "/" ? pathname === "/" : pathname.startsWith(base);
  };

  return (
    <aside className="lg:sticky lg:top-20 lg:self-start">
      <nav aria-label="หมวดหมู่สินค้า" className="overflow-hidden rounded-3xl border border-slate-200 bg-white">
        <p className="rule-bar border-b border-slate-200 px-5 py-3.5 text-[17px] font-semibold text-brand-700">
          หมวดหมู่สินค้า
        </p>
        <ul className="p-2">
          {groups.map((g) => {
            const branch = isActive(g.href) || (g.children ?? []).some((c) => isActive(c.href));
            return (
              <li key={g.href} className="mb-0.5">
                <Link
                  href={g.href}
                  className={`flex items-center justify-between gap-2 rounded-2xl px-3.5 py-2.5 text-[15.5px] transition ${
                    branch
                      ? "bg-brand-600 font-medium text-white"
                      : "text-brand-800 hover:bg-brand-50"
                  }`}
                >
                  {g.label}
                  <Icon.arrow className={`size-4 ${branch ? "" : "opacity-40"}`} />
                </Link>
                {branch && g.children && (
                  <ul className="mt-1 mb-1.5 ml-3.5 border-l border-slate-200 pl-3">
                    {g.children.map((c) => (
                      <li key={c.href}>
                        <Link
                          href={c.href}
                          className={`block rounded-xl px-2.5 py-1.5 text-[14.5px] transition hover:bg-brand-50 ${
                            isActive(c.href) ? "font-medium text-brand-600" : "text-slate-600"
                          }`}
                        >
                          {c.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            );
          })}
          <li className="mt-1 border-t border-slate-200 pt-2">
            <Link
              href="/products"
              className={`flex items-center justify-between gap-2 rounded-2xl px-3.5 py-2.5 text-[15.5px] transition ${
                pathname === "/products"
                  ? "bg-brand-600 font-medium text-white"
                  : "text-brand-800 hover:bg-brand-50"
              }`}
            >
              สินค้าทั้งหมด
              <Icon.arrow className="size-4 opacity-40" />
            </Link>
          </li>
        </ul>
      </nav>

      {extra}
    </aside>
  );
}

/* ------------------------------------------------------------ Sorted grid
 * The reference page pairs the grid with a "เรียงโดย" control. There are no
 * prices or publish dates in this catalogue, so the options are the ones the
 * data can actually honour.
 */

type SortKey = "recommended" | "name-asc" | "name-desc" | "category";

const sorts: { key: SortKey; label: string }[] = [
  { key: "recommended", label: "แนะนำ" },
  { key: "name-asc", label: "ชื่อสินค้า ก → ฮ" },
  { key: "name-desc", label: "ชื่อสินค้า ฮ → ก" },
  { key: "category", label: "จัดกลุ่มตามหมวดหมู่" },
];

export function CatalogGrid({
  products,
  columns = 3,
}: {
  products: Product[];
  columns?: 2 | 3;
}) {
  const [sort, setSort] = useState<SortKey>("recommended");

  const list = useMemo(() => {
    const copy = [...products];
    if (sort === "name-asc") copy.sort((a, b) => a.name.localeCompare(b.name, "th"));
    if (sort === "name-desc") copy.sort((a, b) => b.name.localeCompare(a.name, "th"));
    if (sort === "category")
      copy.sort(
        (a, b) =>
          a.category.localeCompare(b.category) || a.name.localeCompare(b.name, "th"),
      );
    return copy;
  }, [products, sort]);

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-4">
        <p className="text-[15px] text-slate-500">
          แสดง <b className="font-semibold text-brand-700">{list.length}</b> รายการ
        </p>
        <label className="flex items-center gap-2.5 text-[15px] text-slate-500">
          เรียงโดย
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortKey)}
            className="rounded-full border border-slate-200 bg-white px-4 py-2 text-[15px] font-medium text-brand-700 outline-none transition hover:border-brand-200 focus:border-brand-600"
          >
            {sorts.map((s) => (
              <option key={s.key} value={s.key}>
                {s.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div
        className={`grid gap-[18px] sm:grid-cols-2 ${
          columns === 3 ? "xl:grid-cols-3" : ""
        }`}
      >
        {list.map((p) => (
          <ProductCard key={p.slug} product={p} />
        ))}
      </div>

      {list.length === 0 && (
        <p className="rounded-3xl border border-slate-200 bg-white px-6 py-12 text-center text-slate-500">
          ยังไม่มีสินค้าในหมวดนี้ — สอบถามทีมงานได้โดยตรง
        </p>
      )}
    </div>
  );
}
