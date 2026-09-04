"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { ProjectRow } from "@/lib/cms/admin";
import type { MediaItem } from "@/lib/cms/media";
import { publishProjects, saveProjects, type ProjectDraft } from "@/app/admin/(dash)/projects/actions";
import { move, RowTools } from "./Editors";
import { ImageField } from "./ImageField";
import { SaveBar } from "./SaveBar";

/** id ติดลบ = แถวใหม่ที่ยังไม่มีอยู่ในฐานข้อมูล (ดู src/lib/cms/collection.ts) */
let tempId = -1;

export function ProjectsForm({ rows, media }: { rows: ProjectRow[]; media: MediaItem[] }) {
  const router = useRouter();
  const [items, setItems] = useState<ProjectDraft[]>(() =>
    rows.map(({ id, image, title, scope, span }) => ({ id, image, title, scope, span })),
  );

  const set = (i: number, v: ProjectDraft) => setItems(items.map((x, j) => (i === j ? v : x)));

  return (
    <div className="max-w-4xl px-8 py-8">
      <h1 className="admin-title">ผลงาน</h1>
      <p className="mt-1 text-sm text-slate-500">
        {items.length} รายการ · แสดงในหน้า /projects แถบผลงานหน้าแรก และหน้าเกี่ยวกับเรา
      </p>

      <div className="mt-6 space-y-3">
        {items.map((p, i) => (
          <div key={p.id} className="card-admin p-4">
            <div className="flex items-start gap-3">
              <div className="min-w-0 flex-1 space-y-3">
                <ImageField
                  label={`ผลงานที่ ${i + 1}`}
                  value={p.image}
                  media={media}
                  onChange={(v) => set(i, { ...p, image: v })}
                />
                <div className="grid gap-3 sm:grid-cols-[1fr_1fr_10rem]">
                  <input
                    value={p.title}
                    onChange={(e) => set(i, { ...p, title: e.target.value })}
                    placeholder="ชื่อผลงาน"
                    className="field"
                  />
                  <input
                    value={p.scope}
                    onChange={(e) => set(i, { ...p, scope: e.target.value })}
                    placeholder="ขอบเขตงาน"
                    className="field"
                  />
                  <select
                    value={p.span ?? ""}
                    onChange={(e) =>
                      set(i, { ...p, span: (e.target.value || null) as ProjectDraft["span"] })
                    }
                    className="field"
                  >
                    <option value="">ขนาดปกติ</option>
                    <option value="wide">กว้าง 2 ช่อง</option>
                    <option value="tall">สูง 2 แถว</option>
                  </select>
                </div>
              </div>
              <RowTools
                index={i}
                total={items.length}
                onMove={(f, t) => setItems(move(items, f, t))}
                onRemove={(idx) => setItems(items.filter((_, j) => j !== idx))}
              />
            </div>
          </div>
        ))}

        <button
          type="button"
          onClick={() =>
            setItems([...items, { id: tempId--, image: "", title: "", scope: "", span: null }])
          }
          className="btn-line-admin"
        >
          + เพิ่มผลงาน
        </button>
      </div>

      <SaveBar
        onSave={async () => {
          const res = await saveProjects(items);
          if (res.ok) router.refresh();
          return res;
        }}
        onPublish={async () => {
          const res = await publishProjects();
          if (res.ok) router.refresh();
          return res;
        }}
        hasDraft={rows.some((r) => r.has_draft)}
      />
    </div>
  );
}
