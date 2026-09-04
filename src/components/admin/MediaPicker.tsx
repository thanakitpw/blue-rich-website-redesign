"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import type { MediaItem } from "@/lib/cms/media";

/**
 * หน้าต่างเลือกรูปจากคลัง
 *
 * ปิดได้ด้วยการคลิกพื้นหลังหรือปุ่มปิด และช่องค้นหาได้โฟกัสทันทีที่เปิด
 * ปุ่มทุกอันเป็น type="button" เพราะกล่องนี้ถูกวางอยู่ในฟอร์มแก้ไข —
 * ถ้าไม่ระบุ เบราว์เซอร์จะถือเป็น submit แล้วส่งฟอร์มตอนกดเลือกรูป
 */
export function MediaPicker({
  items,
  open,
  onClose,
  onPick,
}: {
  items: MediaItem[];
  open: boolean;
  onClose: () => void;
  onPick: (url: string) => void;
}) {
  const [q, setQ] = useState("");

  const shown = useMemo(() => {
    const needle = q.trim().toLowerCase();
    if (!needle) return items;
    return items.filter(
      (m) =>
        m.filename.toLowerCase().includes(needle) ||
        m.folder.toLowerCase().includes(needle) ||
        m.url.toLowerCase().includes(needle),
    );
  }, [items, q]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-100 grid place-items-center bg-slate-950/40 p-4"
      role="dialog"
      aria-modal="true"
      aria-label="เลือกรูปจากคลัง"
      onClick={onClose}
    >
      <div
        className="flex max-h-[80vh] w-full max-w-3xl flex-col rounded-2xl bg-white"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 border-b border-slate-200 p-4">
          <input
            autoFocus
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="ค้นหาชื่อไฟล์หรือโฟลเดอร์"
            className="field !mt-0 flex-1"
          />
          <button type="button" onClick={onClose} className="btn-line-admin">
            ปิด
          </button>
        </div>

        <div className="grid grid-cols-3 gap-3 overflow-y-auto p-4 sm:grid-cols-4 md:grid-cols-5">
          {shown.map((m) => (
            <button
              key={m.url}
              type="button"
              onClick={() => {
                onPick(m.url);
                onClose();
              }}
              className="group text-left"
            >
              <span className="relative block aspect-square overflow-hidden rounded-lg border border-slate-200 bg-slate-50 transition group-hover:border-accent-400">
                <Image src={m.url} alt="" fill sizes="140px" className="object-contain p-1.5" />
              </span>
              <span className="mt-1 block truncate text-[11px] text-slate-500">{m.filename}</span>
            </button>
          ))}
          {shown.length === 0 && (
            <p className="col-span-full py-10 text-center text-sm text-slate-500">
              ไม่พบรูปที่ตรงกับคำค้น
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
