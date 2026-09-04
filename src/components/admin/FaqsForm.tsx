"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { FaqRow } from "@/lib/cms/admin";
import { publishFaqs, saveFaqs, type FaqDraft } from "@/app/admin/(dash)/faqs/actions";
import { move, RowTools } from "./Editors";
import { SaveBar } from "./SaveBar";

let tempId = -1;

export function FaqsForm({ rows }: { rows: FaqRow[] }) {
  const router = useRouter();
  const [items, setItems] = useState<FaqDraft[]>(() =>
    rows.map(({ id, question, answer }) => ({ id, question, answer })),
  );

  const set = (i: number, v: FaqDraft) => setItems(items.map((x, j) => (i === j ? v : x)));

  return (
    <div className="max-w-3xl px-8 py-8">
      <h1 className="admin-title">คำถามที่พบบ่อย</h1>
      <p className="mt-1 text-sm text-slate-500">{items.length} ข้อ · แสดงท้ายหน้าแรก</p>

      <div className="mt-6 space-y-3">
        {items.map((f, i) => (
          <div key={f.id} className="card-admin p-4">
            <div className="mb-2 flex items-start gap-2">
              <input
                value={f.question}
                onChange={(e) => set(i, { ...f, question: e.target.value })}
                placeholder="คำถาม"
                className="field flex-1 font-medium"
              />
              <RowTools
                index={i}
                total={items.length}
                onMove={(a, b) => setItems(move(items, a, b))}
                onRemove={(idx) => setItems(items.filter((_, j) => j !== idx))}
              />
            </div>
            <textarea
              rows={5}
              value={f.answer}
              onChange={(e) => set(i, { ...f, answer: e.target.value })}
              placeholder="คำตอบ"
              className="field"
            />
          </div>
        ))}

        <button
          type="button"
          onClick={() => setItems([...items, { id: tempId--, question: "", answer: "" }])}
          className="btn-line-admin"
        >
          + เพิ่มคำถาม
        </button>
      </div>

      <SaveBar
        onSave={async () => {
          const res = await saveFaqs(items);
          if (res.ok) router.refresh();
          return res;
        }}
        onPublish={async () => {
          const res = await publishFaqs();
          if (res.ok) router.refresh();
          return res;
        }}
        hasDraft={rows.some((r) => r.has_draft)}
      />
    </div>
  );
}
