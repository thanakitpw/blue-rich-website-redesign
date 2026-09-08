"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";

/**
 * แถวรูปผลงานหน้าแรก + ป๊อปอัปดูรูปใหญ่
 *
 * เดิมการ์ดแต่ละใบเป็นลิงก์ไป /projects และมีป้ายชื่อโครงการทับบนรูปตอน hover
 * ลูกค้าขอให้ไม่มีข้อความบนรูป และให้กดแล้วรูปขยายเป็นป๊อปอัปแทนการเปลี่ยนหน้า
 *
 * ต้องเป็น client component เพราะมี state ของป๊อปอัปกับปุ่มคีย์บอร์ด
 * ตัวไฟล์แยกจาก concept.tsx ที่เป็น server component ทั้งไฟล์
 *
 * รูปต้นฉบับในชุดนี้กว้างแค่ ~474px จึงจำกัดความกว้างป๊อปอัปไว้ที่ 900px
 * ถ้าปล่อยให้เต็มจอ รูปจะถูกขยายเกิน 3 เท่าและแตกจนเห็นชัด
 */

type Work = { image: string; title: string; scope?: string };

export default function WorksGallery({ items }: { items: Work[] }) {
  /* null = ปิดอยู่ · ตัวเลข = ดัชนีรูปที่เปิดค้างไว้ */
  const [open, setOpen] = useState<number | null>(null);

  const close = useCallback(() => setOpen(null), []);
  const step = useCallback(
    (delta: number) =>
      setOpen((i) => (i === null ? i : (i + delta + items.length) % items.length)),
    [items.length],
  );

  /* ปุ่ม Esc ปิด ลูกศรซ้าย-ขวาเลื่อนรูป และล็อกไม่ให้หน้าเลื่อนตอนป๊อปอัปเปิด */
  useEffect(() => {
    if (open === null) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);

    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, close, step]);

  const current = open === null ? null : items[open];

  return (
    <>
      <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-3 lg:grid-cols-4">
        {items.map((p, i) => (
          <button
            key={p.image}
            type="button"
            onClick={() => setOpen(i)}
            aria-label={`ดูรูปใหญ่ — ${p.title}`}
            className="group relative aspect-16/9 cursor-zoom-in overflow-hidden rounded-2xl bg-slate-100 focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 focus:outline-none"
          >
            <Image
              src={p.image}
              alt={p.title}
              fill
              sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
              className="object-cover transition-transform duration-500 group-hover:scale-[1.06]"
            />
          </button>
        ))}
      </div>

      {current && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="รูปผลงาน"
          onClick={close}
          className="fixed inset-0 z-100 grid place-items-center bg-slate-950/85 p-4 backdrop-blur-sm sm:p-8"
        >
          {/* ปุ่มปิดอยู่นอกกรอบรูป กดตรงไหนของพื้นหลังก็ปิดได้เหมือนกัน */}
          <button
            type="button"
            onClick={close}
            aria-label="ปิด"
            className="absolute top-4 right-4 grid size-10 place-items-center rounded-full bg-white/10 text-white transition hover:bg-white/20 sm:top-6 sm:right-6"
          >
            <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>

          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-[900px]"
          >
            <div className="relative aspect-16/9 overflow-hidden rounded-2xl bg-slate-900 shadow-2xl">
              <Image
                key={current.image}
                src={current.image}
                alt={current.title}
                fill
                quality={90}
                sizes="(min-width: 964px) 900px, 100vw"
                className="object-contain"
                priority
              />
            </div>

            {items.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={() => step(-1)}
                  aria-label="รูปก่อนหน้า"
                  className="absolute top-1/2 left-2 grid size-10 -translate-y-1/2 place-items-center rounded-full bg-slate-950/55 text-white transition hover:bg-slate-950/80 sm:-left-14"
                >
                  <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                    <path d="M15 5l-7 7 7 7" />
                  </svg>
                </button>
                <button
                  type="button"
                  onClick={() => step(1)}
                  aria-label="รูปถัดไป"
                  className="absolute top-1/2 right-2 grid size-10 -translate-y-1/2 place-items-center rounded-full bg-slate-950/55 text-white transition hover:bg-slate-950/80 sm:-right-14"
                >
                  <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                    <path d="M9 5l7 7-7 7" />
                  </svg>
                </button>

                <p className="mt-3 text-center text-[13px] text-white/70">
                  {(open ?? 0) + 1} / {items.length}
                </p>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
