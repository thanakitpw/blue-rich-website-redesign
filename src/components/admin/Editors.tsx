"use client";

import type { Download, Faq, InfoList, SpecRow, SpecTable } from "@/data/products";
import type { MediaItem } from "@/lib/cms/media";
import { ImageField } from "./ImageField";

/**
 * `name` ของทุก editor คือกุญแจต้นทางสำหรับหน้าจอแก้ไขแบบเห็นหน้าเว็บ
 *
 * ช่องกรอกแต่ละช่องจะติด data-cms-key เป็นเส้นทางเต็ม เช่น specs.1.value หรือ
 * faq.0.a — ตรงกับกุญแจที่หน้าพรีวิวห่อข้อความไว้ (ดู lib/cms/product-preview.ts)
 * ฟอร์มที่ไม่ได้ส่ง name มาก็ทำงานเหมือนเดิม ไม่มีอะไรเปลี่ยน
 */
const keyOf = (name: string | undefined, ...parts: (string | number)[]) =>
  name ? [name, ...parts].join(".") : undefined;

/* ───────────────────────── ปุ่มจัดลำดับ/ลบ ที่ใช้ร่วมกัน ─────────────────── */

export function RowTools({
  index,
  total,
  onMove,
  onRemove,
}: {
  index: number;
  total: number;
  onMove: (from: number, to: number) => void;
  onRemove: (index: number) => void;
}) {
  const btn =
    "grid size-7 place-items-center rounded-md border border-slate-200 text-slate-500 transition " +
    "hover:border-slate-400 hover:text-slate-900 disabled:opacity-30 disabled:hover:border-slate-200";
  return (
    <div className="flex shrink-0 gap-1">
      <button type="button" className={btn} disabled={index === 0} onClick={() => onMove(index, index - 1)} aria-label="เลื่อนขึ้น">↑</button>
      <button type="button" className={btn} disabled={index === total - 1} onClick={() => onMove(index, index + 1)} aria-label="เลื่อนลง">↓</button>
      <button type="button" className={`${btn} hover:!border-red-400 hover:!text-red-600`} onClick={() => onRemove(index)} aria-label="ลบ">✕</button>
    </div>
  );
}

export const move = <T,>(arr: T[], from: number, to: number) => {
  const next = [...arr];
  const [item] = next.splice(from, 1);
  next.splice(to, 0, item);
  return next;
};

/** ตัวช่วยที่ทุก editor ด้านล่างใช้: แก้/ย้าย/ลบ/เพิ่ม โดยไม่แก้อาเรย์เดิม */
function useList<T>(value: T[], onChange: (next: T[]) => void) {
  return {
    set: (i: number, v: T) => onChange(value.map((x, j) => (i === j ? v : x))),
    tools: (i: number) => ({
      index: i,
      total: value.length,
      onMove: (f: number, t: number) => onChange(move(value, f, t)),
      onRemove: (idx: number) => onChange(value.filter((_, j) => j !== idx)),
    }),
    add: (v: T) => onChange([...value, v]),
  };
}

/* ───────────────────────── รายการข้อความล้วน ─────────────────────────── */

export function TextListEditor({
  value,
  onChange,
  label,
  addLabel = "+ เพิ่มข้อ",
  rows = 3,
  placeholder,
  name,
}: {
  value: string[];
  onChange: (next: string[]) => void;
  label?: string;
  addLabel?: string;
  rows?: number;
  placeholder?: string;
  name?: string;
}) {
  const l = useList(value, onChange);
  return (
    <div>
      {label && <label className="field-label">{label}</label>}
      <div className="space-y-2">
        {value.map((item, i) => (
          <div key={i} className="flex items-start gap-2">
            {rows === 1 ? (
              <input value={item} placeholder={placeholder} onChange={(e) => l.set(i, e.target.value)} className="field flex-1" data-cms-key={keyOf(name, i)} />
            ) : (
              <textarea rows={rows} value={item} placeholder={placeholder} onChange={(e) => l.set(i, e.target.value)} className="field flex-1" data-cms-key={keyOf(name, i)} />
            )}
            <RowTools {...l.tools(i)} />
          </div>
        ))}
        <button type="button" onClick={() => l.add("")} className="btn-line-admin">{addLabel}</button>
      </div>
    </div>
  );
}

/* ───────────────────────── ตารางสเปก (หัวข้อ/ค่า) ────────────────────── */

export function SpecEditor({
  value,
  onChange,
  label,
  addLabel = "+ เพิ่มแถว",
  name,
}: {
  value: SpecRow[];
  onChange: (next: SpecRow[]) => void;
  label?: string;
  addLabel?: string;
  name?: string;
}) {
  const l = useList(value, onChange);
  return (
    <div>
      {label && <label className="field-label">{label}</label>}
      <div className="space-y-2">
        {value.map((s, i) => (
          <div key={i} className="flex items-start gap-2">
            <input value={s.label} onChange={(e) => l.set(i, { ...s, label: e.target.value })} placeholder="หัวข้อ เช่น ความหนาฟิล์มแห้ง" className="field w-1/3" data-cms-key={keyOf(name, i, "label")} />
            <input value={s.value} onChange={(e) => l.set(i, { ...s, value: e.target.value })} placeholder="ค่า เช่น 500 ไมครอน" className="field flex-1" data-cms-key={keyOf(name, i, "value")} />
            <RowTools {...l.tools(i)} />
          </div>
        ))}
        <button type="button" onClick={() => l.add({ label: "", value: "" })} className="btn-line-admin">{addLabel}</button>
      </div>
    </div>
  );
}

/* ───────────────────────── คำถาม–คำตอบ ────────────────────────────────── */

export function FaqEditor({
  value,
  onChange,
  name,
}: {
  value: Faq[];
  onChange: (next: Faq[]) => void;
  name?: string;
}) {
  const l = useList(value, onChange);
  return (
    <div className="space-y-3">
      {value.map((f, i) => (
        <div key={i} className="rounded-lg border border-slate-200 bg-slate-50 p-3">
          <div className="mb-2 flex items-start gap-2">
            <input value={f.q} onChange={(e) => l.set(i, { ...f, q: e.target.value })} placeholder="คำถาม" className="field flex-1 font-medium" data-cms-key={keyOf(name, i, "q")} />
            <RowTools {...l.tools(i)} />
          </div>
          <textarea rows={4} value={f.a} onChange={(e) => l.set(i, { ...f, a: e.target.value })} placeholder="คำตอบ" className="field" data-cms-key={keyOf(name, i, "a")} />
        </div>
      ))}
      <button type="button" onClick={() => l.add({ q: "", a: "" })} className="btn-line-admin">+ เพิ่มคำถาม</button>
    </div>
  );
}

/* ───────────────────────── บล็อกหัวข้อ + เนื้อความ ───────────────────── */

export function BlockEditor({
  value,
  onChange,
  name,
}: {
  value: { title: string; body: string }[];
  onChange: (next: { title: string; body: string }[]) => void;
  name?: string;
}) {
  const l = useList(value, onChange);
  return (
    <div className="space-y-3">
      {value.map((b, i) => (
        <div key={i} className="rounded-lg border border-slate-200 bg-slate-50 p-3">
          <div className="mb-2 flex items-start gap-2">
            <input value={b.title} onChange={(e) => l.set(i, { ...b, title: e.target.value })} placeholder="หัวข้อ" className="field flex-1 font-medium" data-cms-key={keyOf(name, i, "title")} />
            <RowTools {...l.tools(i)} />
          </div>
          <textarea rows={4} value={b.body} onChange={(e) => l.set(i, { ...b, body: e.target.value })} placeholder="เนื้อความ" className="field" data-cms-key={keyOf(name, i, "body")} />
        </div>
      ))}
      <button type="button" onClick={() => l.add({ title: "", body: "" })} className="btn-line-admin">+ เพิ่มบล็อก</button>
    </div>
  );
}

/* ───────────────────────── เอกสารดาวน์โหลด ───────────────────────────── */

export function DownloadEditor({
  value,
  onChange,
  name,
}: {
  value: Download[];
  onChange: (next: Download[]) => void;
  name?: string;
}) {
  const l = useList(value, onChange);
  return (
    <div className="space-y-2">
      {value.map((d, i) => (
        <div key={i} className="flex items-start gap-2">
          <input value={d.label} onChange={(e) => l.set(i, { ...d, label: e.target.value })} placeholder="ชื่อเอกสาร" className="field w-2/5" data-cms-key={keyOf(name, i, "label")} />
          <input value={d.href} onChange={(e) => l.set(i, { ...d, href: e.target.value })} placeholder="/docs/ไฟล์.pdf" className="field flex-1 font-mono text-[13px]" />
          <RowTools {...l.tools(i)} />
        </div>
      ))}
      <button type="button" onClick={() => l.add({ label: "", href: "" })} className="btn-line-admin">+ เพิ่มเอกสาร</button>
      <p className="text-[12px] text-slate-500">
        ไฟล์ PDF ต้องวางไว้ที่ <code className="font-mono">public/docs/</code> ก่อน แล้วอ้างด้วย path ที่ขึ้นต้นด้วย /docs/
      </p>
    </div>
  );
}

/* ───────────────────────── รายการหัวข้อ + ข้อย่อย ────────────────────── */

export function InfoListEditor({
  value,
  onChange,
  name,
}: {
  value: InfoList[];
  onChange: (next: InfoList[]) => void;
  name?: string;
}) {
  const l = useList(value, onChange);
  return (
    <div className="space-y-3">
      {value.map((list, i) => (
        <div key={i} className="rounded-lg border border-slate-200 bg-slate-50 p-3">
          <div className="mb-2 flex items-start gap-2">
            <input value={list.title} onChange={(e) => l.set(i, { ...list, title: e.target.value })} placeholder="หัวข้อรายการ" className="field flex-1 font-medium" data-cms-key={keyOf(name, i, "title")} />
            <RowTools {...l.tools(i)} />
          </div>
          <TextListEditor value={list.items} onChange={(items) => l.set(i, { ...list, items })} rows={3} name={keyOf(name, i, "items")} />
        </div>
      ))}
      <button type="button" onClick={() => l.add({ title: "", items: [""] })} className="btn-line-admin">+ เพิ่มรายการ</button>
    </div>
  );
}

/* ───────────────────────── แกลเลอรีรูป ───────────────────────────────── */

export function GalleryEditor({
  value,
  media,
  onChange,
  name,
}: {
  value: string[];
  media: MediaItem[];
  onChange: (next: string[]) => void;
  name?: string;
}) {
  const l = useList(value, onChange);
  return (
    <div className="space-y-3">
      {value.map((url, i) => (
        <div key={i} className="flex items-end gap-2" data-cms-key={keyOf(name, i)}>
          <div className="min-w-0 flex-1">
            <ImageField label={`รูปที่ ${i + 1}`} value={url} media={media} onChange={(v) => l.set(i, v)} />
          </div>
          <RowTools {...l.tools(i)} />
        </div>
      ))}
      <button type="button" onClick={() => l.add("")} className="btn-line-admin">+ เพิ่มรูปในแกลเลอรี</button>
    </div>
  );
}

/* ───────────────────────── ตารางเปรียบเทียบ ──────────────────────────── */

export function SpecTableEditor({
  value,
  onChange,
  name,
}: {
  value: SpecTable | null;
  onChange: (next: SpecTable | null) => void;
  name?: string;
}) {
  if (!value) {
    return (
      <button
        type="button"
        onClick={() => onChange({ title: "", columns: ["", ""], rows: [["", ""]] })}
        className="btn-line-admin"
      >
        + เพิ่มตาราง
      </button>
    );
  }

  const setCol = (i: number, v: string) =>
    onChange({ ...value, columns: value.columns.map((c, j) => (i === j ? v : c)) });

  const setCell = (r: number, c: number, v: string) =>
    onChange({ ...value, rows: value.rows.map((row, i) => (i === r ? row.map((cell, j) => (j === c ? v : cell)) : row)) });

  const addColumn = () =>
    onChange({ ...value, columns: [...value.columns, ""], rows: value.rows.map((r) => [...r, ""]) });

  const removeColumn = (i: number) =>
    onChange({
      ...value,
      columns: value.columns.filter((_, j) => j !== i),
      rows: value.rows.map((r) => r.filter((_, j) => j !== i)),
    });

  return (
    <div className="space-y-3 rounded-lg border border-slate-200 bg-slate-50 p-3">
      <div className="flex items-start gap-2">
        <input value={value.title} onChange={(e) => onChange({ ...value, title: e.target.value })} placeholder="ชื่อตาราง" className="field flex-1 font-medium" data-cms-key={keyOf(name, "title")} />
        <button type="button" onClick={() => onChange(null)} className="btn-danger shrink-0">ลบตาราง</button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-separate border-spacing-1">
          <thead>
            <tr>
              {value.columns.map((c, i) => (
                <th key={i} className="align-top">
                  <input value={c} onChange={(e) => setCol(i, e.target.value)} placeholder={`คอลัมน์ ${i + 1}`} className="field min-w-[9rem] font-medium" data-cms-key={keyOf(name, "columns", i)} />
                  <button type="button" onClick={() => removeColumn(i)} className="mt-1 text-[11px] text-slate-500 hover:text-red-600">ลบคอลัมน์</button>
                </th>
              ))}
              <th className="align-top">
                <button type="button" onClick={addColumn} className="btn-line-admin">+ คอลัมน์</button>
              </th>
            </tr>
          </thead>
          <tbody>
            {value.rows.map((row, r) => (
              <tr key={r}>
                {row.map((cell, c) => (
                  <td key={c}>
                    <input value={cell} onChange={(e) => setCell(r, c, e.target.value)} className="field min-w-[9rem]" data-cms-key={keyOf(name, "rows", r, c)} />
                  </td>
                ))}
                <td className="whitespace-nowrap">
                  <RowTools
                    index={r}
                    total={value.rows.length}
                    onMove={(f, t) => onChange({ ...value, rows: move(value.rows, f, t) })}
                    onRemove={(i) => onChange({ ...value, rows: value.rows.filter((_, j) => j !== i) })}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex flex-wrap gap-2">
        <button type="button" onClick={() => onChange({ ...value, rows: [...value.rows, value.columns.map(() => "")] })} className="btn-line-admin">
          + เพิ่มแถว
        </button>
      </div>

      <input value={value.note ?? ""} onChange={(e) => onChange({ ...value, note: e.target.value || undefined })} placeholder="หมายเหตุใต้ตาราง (ไม่บังคับ)" className="field" data-cms-key={keyOf(name, "note")} />
    </div>
  );
}
