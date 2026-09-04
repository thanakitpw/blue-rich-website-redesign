"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { CategoryRow } from "@/lib/cms/admin";
import type { MediaItem } from "@/lib/cms/media";
import {
  publishCategories,
  saveCategories,
  type CategoryDraft,
} from "@/app/admin/(dash)/categories/actions";
import { move, RowTools } from "./Editors";
import { ImageField } from "./ImageField";
import { SaveBar } from "./SaveBar";

let tempId = -1;

export function CategoriesForm({
  rows,
  media,
  counts,
}: {
  rows: CategoryRow[];
  media: MediaItem[];
  counts: Record<string, number>;
}) {
  const router = useRouter();
  const [items, setItems] = useState<CategoryDraft[]>(() =>
    rows.map(({ id, slug, name, short, description, image }) => ({
      id, slug, name, short, description, image,
    })),
  );

  const set = (i: number, v: CategoryDraft) => setItems(items.map((x, j) => (i === j ? v : x)));

  return (
    <div className="max-w-3xl px-8 py-8">
      <h1 className="admin-title">หมวดหมู่สินค้า</h1>
      <p className="mt-1 text-sm text-slate-500">
        {items.length} หมวด · ลำดับที่นี่คือลำดับที่แสดงในหน้ารายการสินค้า
      </p>

      <div className="mt-6 space-y-3">
        {items.map((c, i) => {
          const used = counts[c.slug] ?? 0;
          return (
            <div key={c.id} className="card-admin p-4">
              <div className="flex items-start gap-3">
                <div className="min-w-0 flex-1 space-y-3">
                  <div className="grid gap-3 sm:grid-cols-2">
                    <input value={c.name} onChange={(e) => set(i, { ...c, name: e.target.value })} placeholder="ชื่อหมวด (ไทย)" className="field font-medium" />
                    <input value={c.short} onChange={(e) => set(i, { ...c, short: e.target.value })} placeholder="ชื่ออังกฤษ เช่น Intumescent Paint" className="field" />
                  </div>
                  <input value={c.slug} onChange={(e) => set(i, { ...c, slug: e.target.value })} placeholder="slug" className="field font-mono text-[13px]" />
                  <textarea rows={2} value={c.description} onChange={(e) => set(i, { ...c, description: e.target.value })} placeholder="คำอธิบายสั้น" className="field" />
                  <ImageField label="รูปประจำหมวด" value={c.image} media={media} onChange={(v) => set(i, { ...c, image: v })} />
                  <p className="text-[12px] text-slate-500">
                    {used > 0
                      ? `มีสินค้าอยู่ ${used} รายการ — ลบหมวดนี้ไม่ได้จนกว่าจะย้ายสินค้าออกก่อน`
                      : "ยังไม่มีสินค้าในหมวดนี้"}
                  </p>
                </div>
                <RowTools
                  index={i}
                  total={items.length}
                  onMove={(a, b) => setItems(move(items, a, b))}
                  onRemove={(idx) => {
                    if ((counts[items[idx].slug] ?? 0) > 0) return;
                    setItems(items.filter((_, j) => j !== idx));
                  }}
                />
              </div>
            </div>
          );
        })}

        <button
          type="button"
          onClick={() =>
            setItems([...items, { id: tempId--, slug: "", name: "", short: "", description: "", image: "" }])
          }
          className="btn-line-admin"
        >
          + เพิ่มหมวดหมู่
        </button>
      </div>

      <SaveBar
        onSave={async () => {
          const res = await saveCategories(items);
          if (res.ok) router.refresh();
          return res;
        }}
        onPublish={async () => {
          const res = await publishCategories();
          if (res.ok) router.refresh();
          return res;
        }}
        hasDraft={rows.some((r) => r.has_draft)}
      />
    </div>
  );
}
