"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState, useTransition } from "react";
import type { CopyPage } from "@/lib/cms/copy-pages";
import type { ImageOverrides } from "@/components/CmsImage";
import type { MediaItem } from "@/lib/cms/media";
import { hashText } from "@/lib/cms/copy";
import { publishCopy, saveCopy } from "@/app/admin/(dash)/copy/actions";
import { publishSetting, saveSetting } from "@/app/admin/(dash)/settings/actions";
import { ImageField } from "./ImageField";

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

/** "hero.title" → "หัวเรื่อง · title" — ให้อ่านออกโดยไม่ต้องรู้โครงสร้างข้อมูล */
const labelOf = (key: string) =>
  key
    .split(".")
    .map((part) => (/^\d+$/.test(part) ? `ข้อ ${Number(part) + 1}` : part))
    .join(" · ");

/**
 * หน้าจอแก้ข้อความและรูปแบบเห็นหน้าเว็บจริง
 *
 * ซ้ายคือหน้าเว็บตัวจริงที่เรนเดอร์ใหม่ด้วยฉบับร่าง (ผ่าน Draft Mode) ไม่ใช่ภาพจำลอง
 * ขวาคือช่องกรอกของทุกจุดในหน้านั้น กดฝั่งไหนก็เด้งไปหาอีกฝั่งเสมอ
 * และพิมพ์ปุ๊บหน้าซ้ายเปลี่ยนปั๊บ โดยไม่ต้องรีโหลด (คุยกันผ่าน postMessage)
 */
export function CopyEditor({
  page,
  label,
  path,
  entries,
  images: initialImages,
  media,
}: {
  page: CopyPage;
  label: string;
  path: string;
  entries: CopyEntryView[];
  /** รูปที่ถูกทับไว้แล้ว กุญแจคือ path เดิมของรูปในโค้ด (ดู CmsImage.tsx) */
  images: ImageOverrides;
  /** คลังรูปทั้งหมด สำหรับหน้าต่างเลือกรูป */
  media: MediaItem[];
}) {
  const router = useRouter();
  const frame = useRef<HTMLIFrameElement>(null);

  const [values, setValues] = useState<Record<string, string>>(() =>
    Object.fromEntries(entries.map((e) => [e.key, e.value])),
  );
  const [images, setImages] = useState<ImageOverrides>(initialImages);
  const [imagesDirty, setImagesDirty] = useState(false);
  const [active, setActive] = useState<string | null>(null);
  /** กุญแจที่พรีวิวรายงานว่าโผล่บนหน้านี้จริง — null = ยังไม่ได้ยินอะไรเลย */
  const [onPage, setOnPage] = useState<string[] | null>(null);
  const [onPageImages, setOnPageImages] = useState<string[]>([]);
  const [q, setQ] = useState("");
  const [onlyEdited, setOnlyEdited] = useState(false);
  const [msg, setMsg] = useState<{ kind: "ok" | "err"; text: string } | null>(null);
  const [pending, start] = useTransition();

  const post = useCallback((data: unknown) => {
    frame.current?.contentWindow?.postMessage(data, "*");
  }, []);

  /** รับสัญญาณจากหน้าพรีวิว: กดข้อความ/รูปไหน และหน้ามีอะไรให้แก้บ้าง */
  useEffect(() => {
    const onMessage = (e: MessageEvent) => {
      const d = e.data as { type?: string; key?: string; keys?: string[]; images?: string[] };
      if (d?.type === "cms:select" && d.key) {
        setActive(d.key);
        const el = document.getElementById(`copy-${d.key}`);
        el?.scrollIntoView({ behavior: "smooth", block: "center" });
        (el?.querySelector("textarea") as HTMLElement | null)?.focus();
      }
      if (d?.type === "cms:select-image" && d.key) {
        setActive(d.key);
        // กุญแจของรูปคือ path ซึ่งมี / อยู่ด้วย getElementById รับได้ ต่างจาก querySelector
        document
          .getElementById(`img-${d.key}`)
          ?.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      if (d?.type === "cms:ready") {
        setOnPage(d.keys ?? []);
        setOnPageImages(d.images ?? []);
      }
    };
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, []);

  /** ออกจากหน้านี้เมื่อไหร่ ให้ปิดโหมดพรีวิว ไม่งั้นเดินดูเว็บต่อจะเห็นฉบับร่างค้าง */
  useEffect(() => () => void fetch("/api/admin/preview?off=1").catch(() => {}), []);

  const setValue = (key: string, v: string) => {
    setValues((prev) => ({ ...prev, [key]: v }));
    post({ type: "cms:update", key, value: v });
  };

  const focusKey = (key: string) => {
    setActive(key);
    post({ type: "cms:focus", key });
  };

  /** เลือกรูปใหม่ให้กุญแจนี้ — ส่ง url เท่ากับกุญแจเดิมเมื่อกดคืนค่าเดิม */
  const setImage = (key: string, url: string) => {
    setImages((prev) => {
      const next = { ...prev };
      if (!url || url === key) delete next[key];
      else next[key] = url;
      return next;
    });
    setImagesDirty(true);
    post({ type: "cms:update-image", key, value: url || key });
  };

  const focusImage = (key: string) => {
    setActive(key);
    post({ type: "cms:focus-image", key });
  };

  const shown = entries.filter((e) => {
    if (onlyEdited && values[e.key] === e.fallback) return false;
    const needle = q.trim().toLowerCase();
    if (!needle) return true;
    return (
      e.key.toLowerCase().includes(needle) ||
      e.fallback.toLowerCase().includes(needle) ||
      (values[e.key] ?? "").toLowerCase().includes(needle)
    );
  });

  const changedText = entries.filter((e) => values[e.key] !== e.fallback).length;
  const changedImages = Object.keys(images).length;

  const run = (publish: boolean) =>
    start(async () => {
      setMsg(null);

      /* ส่งเฉพาะจุดที่ต่างจากค่าตั้งต้น จุดที่แก้กลับเหมือนเดิมจะถูกลบแถวทิ้ง */
      const edits = entries
        .filter((e) => values[e.key] !== e.fallback)
        .map((e) => ({ key: e.key, value: values[e.key], sourceHash: hashText(e.fallback) }));

      const res = await saveCopy(page, edits);
      if (!res.ok) return setMsg({ kind: "err", text: res.error });

      if (imagesDirty) {
        const i = await saveSetting("images", images);
        if (!i.ok) return setMsg({ kind: "err", text: i.error });
      }

      if (publish) {
        const p = await publishCopy(page);
        if (!p.ok) return setMsg({ kind: "err", text: p.error });
        if (imagesDirty) {
          const i = await publishSetting("images");
          if (!i.ok) return setMsg({ kind: "err", text: i.error });
        }
        setImagesDirty(false);
      }

      setMsg({
        kind: "ok",
        text: publish ? "เผยแพร่ขึ้นเว็บจริงแล้ว" : "บันทึกร่างแล้ว — เว็บจริงยังไม่เปลี่ยน",
      });
      router.refresh();
    });

  return (
    <div className="flex h-[calc(100vh-73px)] flex-col">
      {/* ---------------------------------------------------------- แถบบน */}
      <div className="flex items-center gap-3 border-b border-slate-200 bg-white px-6 py-2.5">
        <p
          role="status"
          className={`min-w-0 flex-1 truncate text-[13px] ${
            msg ? (msg.kind === "ok" ? "text-brand-700" : "text-red-600") : "text-slate-500"
          }`}
        >
          {msg?.text ??
            (changedText + changedImages > 0
              ? `แก้ไปแล้ว ${changedText} ข้อความ${changedImages ? ` · ${changedImages} รูป` : ""} จากทั้งหมด ${entries.length} จุด`
              : `คลิกข้อความหรือรูปในหน้าเว็บด้านซ้ายเพื่อแก้ — หน้านี้แก้ข้อความได้ ${entries.length} จุด${
                  onPageImages.length ? ` และรูป ${onPageImages.length} รูป` : ""
                }`)}
        </p>
        <a href={path} target="_blank" rel="noopener" className="btn-line-admin shrink-0">
          เปิดหน้าจริง
        </a>
        <button
          type="button"
          onClick={() => run(false)}
          disabled={pending}
          className="btn-line-admin shrink-0"
        >
          {pending ? "กำลังบันทึก…" : "บันทึกร่าง"}
        </button>
        <button
          type="button"
          onClick={() => run(true)}
          disabled={pending}
          className="btn-solid shrink-0"
        >
          เผยแพร่ขึ้นเว็บ
        </button>
      </div>

      <div className="flex min-h-0 flex-1">
        {/* หน้าเว็บจริง เรนเดอร์ด้วยฉบับร่าง คลิกข้อความไหนก็เด้งไปช่องนั้น */}
        <div className="min-w-0 flex-1 bg-slate-100 p-3">
          <iframe
            ref={frame}
            src={`/api/admin/preview?path=${encodeURIComponent(path)}`}
            title={`ตัวอย่างหน้า ${label}`}
            className="h-full w-full rounded-lg border border-slate-200 bg-white"
          />
        </div>

        {/* ------------------------------------------------- ช่องกรอกด้านขวา */}
        <div className="flex w-[26rem] shrink-0 flex-col border-l border-slate-200 bg-white">
          <div className="space-y-2 border-b border-slate-200 p-3">
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="ค้นหาข้อความ…"
              className="field"
            />
            <label className="flex items-center gap-2 text-[12px] text-slate-500">
              <input
                type="checkbox"
                checked={onlyEdited}
                onChange={(e) => setOnlyEdited(e.target.checked)}
              />
              เฉพาะจุดที่แก้แล้ว
            </label>
          </div>

          <ul className="min-h-0 flex-1 overflow-y-auto p-3">
            {shown.map((e) => {
              const edited = values[e.key] !== e.fallback;
              const visible = onPage === null || onPage.includes(e.key);
              return (
                <li
                  key={e.key}
                  id={`copy-${e.key}`}
                  className={`mb-3 rounded-lg border p-3 transition ${
                    active === e.key
                      ? "border-brand-500 bg-brand-50/60"
                      : edited
                        ? "border-brand-200"
                        : "border-slate-200"
                  }`}
                >
                  <div className="mb-1.5 flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={() => focusKey(e.key)}
                      className="text-[11px] text-slate-400 hover:text-brand-700 hover:underline"
                      title={`ไปที่ข้อความนี้ในหน้าเว็บ (${e.key})`}
                    >
                      {labelOf(e.key)}
                    </button>
                    {!visible && (
                      <span
                        className="text-[10px] text-slate-400"
                        title="ข้อความนี้อาจอยู่ในส่วนที่ยังไม่แสดง เช่น แท็บที่ยังไม่ได้เปิด"
                      >
                        ไม่พบบนหน้า
                      </span>
                    )}
                    {e.stale && (
                      <span
                        className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-medium text-amber-800"
                        title="ข้อความตั้งต้นในโค้ดถูกแก้หลังจากคุณแก้จุดนี้ เว็บจริงจะใช้ค่าจากโค้ด"
                      >
                        ต้นฉบับเปลี่ยน
                      </span>
                    )}
                    {edited && (
                      <>
                        <span className="chip-draft">แก้แล้ว</span>
                        <button
                          type="button"
                          onClick={() => setValue(e.key, e.fallback)}
                          className="text-[10px] text-slate-400 hover:text-slate-900 hover:underline"
                        >
                          คืนค่าเดิม
                        </button>
                      </>
                    )}
                  </div>

                  <textarea
                    rows={Math.min(6, Math.max(1, Math.ceil(e.fallback.length / 46)))}
                    value={values[e.key] ?? ""}
                    onFocus={() => focusKey(e.key)}
                    onChange={(ev) => setValue(e.key, ev.target.value)}
                    className="field !text-[13px]"
                  />

                  {edited && (
                    <p className="mt-1.5 text-[11px] leading-relaxed text-slate-400">
                      <span className="text-slate-500">เดิม:</span> {e.fallback}
                    </p>
                  )}
                </li>
              );
            })}

            {shown.length === 0 && (
              <p className="py-12 text-center text-sm text-slate-500">ไม่พบข้อความที่ค้นหา</p>
            )}

            {onPageImages.length > 0 && (
              <li className="mt-6 border-t border-slate-200 pt-4">
                <p className="mb-1 text-[13px] font-semibold text-slate-900">รูปภาพในหน้านี้</p>
                <p className="mb-3 text-[11px] leading-relaxed text-slate-500">
                  คลิกรูปในหน้าเว็บด้านซ้ายก็เด้งมาที่นี่ — รูปเดียวกันที่ใช้หลายหน้า
                  เปลี่ยนที่นี่แล้วเปลี่ยนพร้อมกันทุกหน้า
                  <br />
                  ส่วนรูปสินค้าและรูปบทความแก้ที่หน้าจัดการสินค้า/บทความ จึงไม่มีในรายการนี้
                </p>
                <ul>
                  {onPageImages.map((src) => (
                    <li
                      key={src}
                      id={`img-${src}`}
                      className={`mb-3 rounded-lg border p-3 transition ${
                        active === src
                          ? "border-brand-500 bg-brand-50/60"
                          : images[src]
                            ? "border-brand-200"
                            : "border-slate-200"
                      }`}
                    >
                      <div className="mb-1.5 flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => focusImage(src)}
                          className="min-w-0 flex-1 truncate text-left text-[11px] text-slate-400 hover:text-brand-700 hover:underline"
                          title={`ไปที่รูปนี้ในหน้าเว็บ (${src})`}
                        >
                          {src.split("/").pop()}
                        </button>
                        {images[src] && (
                          <>
                            <span className="chip-draft shrink-0">เปลี่ยนแล้ว</span>
                            <button
                              type="button"
                              onClick={() => setImage(src, src)}
                              className="shrink-0 text-[10px] text-slate-400 hover:text-slate-900 hover:underline"
                            >
                              คืนค่าเดิม
                            </button>
                          </>
                        )}
                      </div>
                      <ImageField
                        value={images[src] ?? src}
                        media={media}
                        onChange={(url) => setImage(src, url)}
                      />
                    </li>
                  ))}
                </ul>
              </li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}
