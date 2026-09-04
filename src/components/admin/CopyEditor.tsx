"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import type { CopyPage } from "@/lib/cms/copy-pages";
import { hashText } from "@/lib/cms/copy";
import { publishCopy, saveCopy } from "@/app/admin/(dash)/copy/actions";
import { SaveBar } from "./SaveBar";

export type CopyEntryView = {
  key: string;
  /** ข้อความตั้งต้นในโค้ด */
  fallback: string;
  /** ข้อความที่จะแสดงตอนนี้ (ฉบับร่างถ้ามี) */
  value: string;
  edited: boolean;
  dirty: boolean;
  stale: boolean;
};

/** "hero.title" → "hero" · "faqs.2.a" → "faqs" */
const groupOf = (key: string) => key.split(".")[0];

/** "faqs.2.a" → "ข้อ 3 · a" — ให้อ่านออกโดยไม่ต้องรู้โครงสร้างข้อมูล */
const labelOf = (key: string) =>
  key
    .split(".")
    .slice(1)
    .map((part) => (/^\d+$/.test(part) ? `ข้อ ${Number(part) + 1}` : part))
    .join(" · ") || "—";

export function CopyEditor({
  page,
  label,
  path,
  entries,
}: {
  page: CopyPage;
  label: string;
  path: string;
  entries: CopyEntryView[];
}) {
  const router = useRouter();
  const [values, setValues] = useState<Record<string, string>>(() =>
    Object.fromEntries(entries.map((e) => [e.key, e.value])),
  );
  const [q, setQ] = useState("");
  const [onlyEdited, setOnlyEdited] = useState(false);

  const defaults = useMemo(
    () => Object.fromEntries(entries.map((e) => [e.key, e.fallback])),
    [entries],
  );

  const changed = entries.filter((e) => values[e.key] !== e.fallback);

  const shown = entries.filter((e) => {
    if (onlyEdited && values[e.key] === e.fallback) return false;
    const needle = q.trim().toLowerCase();
    if (!needle) return true;
    return (
      e.key.toLowerCase().includes(needle) ||
      values[e.key].toLowerCase().includes(needle) ||
      e.fallback.toLowerCase().includes(needle)
    );
  });

  const groups = [...new Set(shown.map((e) => groupOf(e.key)))];

  return (
    <div className="max-w-3xl px-8 py-8">
      <h1 className="admin-title">{label}</h1>
      <p className="mt-1 text-sm text-slate-500">
        {entries.length} จุด · แก้แล้ว {changed.length} จุด ·{" "}
        <a href={path} target="_blank" rel="noopener" className="text-accent-500 underline">
          ดูหน้าเว็บจริง {path}
        </a>
      </p>

      <div className="sticky top-0 z-10 -mx-8 mt-5 flex flex-wrap items-center gap-3 bg-slate-50/95 px-8 py-3 backdrop-blur">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="ค้นหาข้อความหรือชื่อจุด"
          className="field max-w-xs"
        />
        <label className="flex items-center gap-2 text-[13px] text-slate-600">
          <input
            type="checkbox"
            checked={onlyEdited}
            onChange={(e) => setOnlyEdited(e.target.checked)}
          />
          แสดงเฉพาะจุดที่แก้แล้ว
        </label>
        <span className="text-[12px] text-slate-400">แสดง {shown.length} จุด</span>
      </div>

      <div className="mt-3 space-y-6">
        {groups.map((g) => (
          <section key={g} className="card-admin p-5">
            <h2 className="mb-4 border-b border-slate-100 pb-3 font-mono text-[13px] font-semibold text-slate-900">
              {g}
            </h2>

            <div className="space-y-5">
              {shown
                .filter((e) => groupOf(e.key) === g)
                .map((e) => {
                  const isChanged = values[e.key] !== e.fallback;
                  const long = e.fallback.length > 90;
                  return (
                    <div key={e.key}>
                      <div className="mb-1.5 flex flex-wrap items-center gap-2">
                        <label className="text-[13px] font-medium text-slate-700">
                          {labelOf(e.key)}
                        </label>
                        {isChanged && <span className="chip-live">แก้แล้ว</span>}
                        {e.dirty && <span className="chip-draft">ยังไม่เผยแพร่</span>}
                        {isChanged && (
                          <button
                            type="button"
                            onClick={() =>
                              setValues((v) => ({ ...v, [e.key]: defaults[e.key] }))
                            }
                            className="text-[11.5px] text-slate-500 hover:text-slate-900 hover:underline"
                          >
                            คืนค่าเดิม
                          </button>
                        )}
                      </div>

                      {long ? (
                        <textarea
                          rows={Math.min(10, Math.ceil(values[e.key].length / 70) + 1)}
                          value={values[e.key]}
                          onChange={(ev) => setValues((v) => ({ ...v, [e.key]: ev.target.value }))}
                          className="field"
                        />
                      ) : (
                        <input
                          value={values[e.key]}
                          onChange={(ev) => setValues((v) => ({ ...v, [e.key]: ev.target.value }))}
                          className="field"
                        />
                      )}

                      {e.stale && (
                        <p className="mt-1.5 text-[12px] leading-relaxed text-amber-700">
                          ข้อความต้นทางในโค้ดถูกแก้ไปหลังจากที่แก้จุดนี้ไว้ —
                          เว็บจริงกำลังแสดงข้อความจากโค้ด กดบันทึกอีกครั้งเพื่อยืนยันใช้ข้อความนี้
                        </p>
                      )}
                    </div>
                  );
                })}
            </div>
          </section>
        ))}

        {shown.length === 0 && (
          <p className="py-16 text-center text-sm text-slate-500">ไม่พบจุดที่ตรงกับเงื่อนไข</p>
        )}
      </div>

      <SaveBar
        hasDraft={entries.some((e) => e.dirty)}
        backHref="/admin/copy"
        onSave={async () => {
          /* ส่งเฉพาะจุดที่ต่างจากค่าตั้งต้น พร้อม hash ของค่าตั้งต้น ณ ตอนนี้
             เพื่อให้ระบบรู้ทีหลังว่าโค้ดถูกแก้จนข้อความนี้ไม่ควรใช้แล้วหรือยัง */
          const res = await saveCopy(
            page,
            changed.map((e) => ({
              key: e.key,
              value: values[e.key],
              sourceHash: hashText(e.fallback),
            })),
          );
          if (res.ok) router.refresh();
          return res;
        }}
        onPublish={async () => {
          const res = await publishCopy(page);
          if (res.ok) router.refresh();
          return res;
        }}
      />
    </div>
  );
}
