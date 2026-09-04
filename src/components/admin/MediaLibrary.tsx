"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useMemo, useState, useTransition } from "react";
import type { MediaItem } from "@/lib/cms/media";
import { browserClient } from "@/lib/supabase/browser";
import { deleteMedia, registerMedia } from "@/app/admin/(dash)/media/actions";

const readableSize = (bytes: number | null) =>
  bytes == null ? "" : bytes > 1024 * 1024
    ? `${(bytes / 1024 / 1024).toFixed(1)} MB`
    : `${Math.round(bytes / 1024)} KB`;

/** ชื่อไฟล์ที่ปลอดภัยกับ Storage — ชื่อไทยทำให้ URL เพี้ยนตอนแชร์ */
const safeName = (name: string) => {
  const dot = name.lastIndexOf(".");
  const ext = dot > 0 ? name.slice(dot).toLowerCase() : "";
  const base = (dot > 0 ? name.slice(0, dot) : name)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  return `${base || "image"}-${Date.now().toString(36)}${ext}`;
};

export function MediaLibrary({ items }: { items: MediaItem[] }) {
  const router = useRouter();
  const [q, setQ] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [pending, start] = useTransition();

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

  const upload = async (files: FileList | null) => {
    if (!files?.length) return;
    const sb = browserClient();
    if (!sb) return setMsg("ยังไม่ได้ตั้งค่าการเชื่อมต่อฐานข้อมูล");

    setBusy(true);
    setMsg(null);

    for (const file of Array.from(files)) {
      const path = `uploads/${safeName(file.name)}`;
      const { error } = await sb.storage.from("media").upload(path, file, {
        cacheControl: "31536000",
        upsert: false,
      });
      if (error) {
        setBusy(false);
        return setMsg(`อัปโหลด ${file.name} ไม่สำเร็จ: ${error.message}`);
      }

      const { data } = sb.storage.from("media").getPublicUrl(path);
      const res = await registerMedia({
        path,
        url: data.publicUrl,
        filename: file.name,
        mime: file.type || null,
        bytes: file.size,
        folder: "อัปโหลดเอง",
      });
      if (!res.ok) {
        setBusy(false);
        return setMsg(res.error);
      }
    }

    setBusy(false);
    setMsg("อัปโหลดเรียบร้อย");
    router.refresh();
  };

  return (
    <div className="max-w-5xl px-8 py-8">
      <h1 className="admin-title">คลังรูป</h1>
      <p className="mt-1 text-sm text-slate-500">
        {items.length} รูป · รูปเดิมของเว็บลบไม่ได้ ลบได้เฉพาะรูปที่อัปโหลดเข้ามาใหม่
      </p>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="ค้นหาชื่อไฟล์หรือโฟลเดอร์"
          className="field max-w-xs"
        />
        <label className="btn-solid cursor-pointer">
          {busy ? "กำลังอัปโหลด…" : "+ อัปโหลดรูป"}
          <input
            type="file"
            accept="image/*"
            multiple
            hidden
            disabled={busy}
            onChange={(e) => {
              void upload(e.target.files);
              e.target.value = "";
            }}
          />
        </label>
        {msg && <span className="text-[13px] text-slate-500">{msg}</span>}
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {shown.map((m) => (
          <figure key={m.url} className="card-admin overflow-hidden">
            <span className="relative block aspect-square bg-slate-50">
              <Image src={m.url} alt={m.alt ?? ""} fill sizes="200px" className="object-contain p-2" />
            </span>
            <figcaption className="border-t border-slate-100 p-2.5">
              <p className="truncate text-[12px] text-slate-900" title={m.filename}>{m.filename}</p>
              <p className="mt-0.5 truncate text-[11px] text-slate-400">
                {m.folder} · {readableSize(m.bytes)}
              </p>
              <div className="mt-2 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => navigator.clipboard?.writeText(m.url)}
                  className="text-[11px] text-accent-500 hover:underline"
                >
                  คัดลอกลิงก์
                </button>
                {m.uploaded && m.id && m.path && (
                  <button
                    type="button"
                    disabled={pending}
                    onClick={() =>
                      start(async () => {
                        const res = await deleteMedia(m.id!, m.path!);
                        setMsg(res.ok ? "ลบรูปแล้ว" : res.error);
                        if (res.ok) router.refresh();
                      })
                    }
                    className="text-[11px] text-red-600 hover:underline"
                  >
                    ลบ
                  </button>
                )}
              </div>
            </figcaption>
          </figure>
        ))}
      </div>

      {shown.length === 0 && (
        <p className="py-16 text-center text-sm text-slate-500">ไม่พบรูปที่ตรงกับคำค้น</p>
      )}
    </div>
  );
}
