"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { CmsImage } from "@/components/CmsImage";
import Reveal from "@/components/ui/Reveal";

/**
 * แกลเลอรีผลงาน — กดรูปย่อแล้วเปิดรูปใหญ่ทับหน้า เลื่อนซ้าย/ขวาดูรูปถัดไปได้
 *
 * ใช้ <dialog> ของเบราว์เซอร์แทนเขียน modal เอง จึงได้ Esc ปิด, โฟกัสถูกขังใน
 * กล่อง และเลเยอร์ทับ (top layer) ฟรี ไม่ต้องยุ่งกับ z-index ของ LpHeader/LpStickyCta
 *
 * รูปใหญ่ใช้ CmsImage ด้วย src เดียวกับรูปย่อ ถ้าลูกค้าเปลี่ยนรูปจากหลังบ้าน
 * รูปใหญ่จะเปลี่ยนตามเพราะกุญแจเดียวกัน
 */
export type LpGalleryImage = { src: string; alt: string };

export default function LpGallery({ images }: { images: LpGalleryImage[] }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  /* null = ปิดอยู่ · ตัวเลข = ลำดับรูปที่เปิด */
  const [active, setActive] = useState<number | null>(null);

  const open = (i: number) => {
    setActive(i);
    dialogRef.current?.showModal();
  };
  const close = () => dialogRef.current?.close();

  const step = useCallback(
    (dir: 1 | -1) =>
      setActive((cur) => (cur === null ? cur : (cur + dir + images.length) % images.length)),
    [images.length],
  );

  /* ล็อกไม่ให้หน้าหลังเลื่อนตอนรูปใหญ่เปิดอยู่ — <dialog> ไม่ล็อกให้เอง */
  useEffect(() => {
    if (active === null) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [active]);

  return (
    <>
      <div className="mt-12 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {images.map((g, i) => (
          <Reveal key={g.src} delay={i * 60}>
            <button
              type="button"
              onClick={() => open(i)}
              aria-label={`ดูรูปใหญ่: ${g.alt}`}
              className="group block w-full cursor-zoom-in overflow-hidden rounded-2xl bg-slate-200 outline-none ring-offset-2 focus-visible:ring-2 focus-visible:ring-brand-500"
            >
              <span className="relative block aspect-4/3">
                <CmsImage
                  src={g.src}
                  alt={g.alt}
                  fill
                  sizes="(min-width: 1024px) 25vw, 45vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </span>
            </button>
          </Reveal>
        ))}
      </div>

      {/* onClose ยิงทั้งตอนกด Esc และตอนเรียก close() เอง จึงเคลียร์ state ที่เดียว
          คลิกบนฉากหลัง (target คือตัว dialog เอง ไม่ใช่ลูกข้างใน) = ปิด */}
      <dialog
        ref={dialogRef}
        onClose={() => setActive(null)}
        onClick={(e) => e.target === e.currentTarget && close()}
        onKeyDown={(e) => {
          if (e.key === "ArrowRight") step(1);
          if (e.key === "ArrowLeft") step(-1);
        }}
        aria-label="รูปผลงานขนาดใหญ่"
        className="m-auto h-dvh max-h-none w-screen max-w-none border-0 bg-transparent p-0 backdrop:bg-brand-950/90 backdrop:backdrop-blur-sm"
      >
        {active !== null && (
          <div className="pointer-events-none flex h-full flex-col items-center justify-center gap-4 px-4 py-6 sm:px-16">
            <div className="pointer-events-auto relative h-[min(78dvh,900px)] w-full max-w-6xl">
              <CmsImage
                key={images[active].src}
                src={images[active].src}
                alt={images[active].alt}
                fill
                sizes="(min-width: 1200px) 1152px, 100vw"
                className="rounded-2xl object-contain"
              />
            </div>
            <p className="pointer-events-auto max-w-2xl text-center text-sm leading-relaxed text-white/85">
              {images[active].alt}
              <span className="ml-2 text-white/50">
                {active + 1} / {images.length}
              </span>
            </p>
          </div>
        )}

        <button
          type="button"
          onClick={close}
          aria-label="ปิด"
          className="absolute top-4 right-4 grid size-11 place-items-center rounded-full bg-white/10 text-white ring-1 ring-white/20 backdrop-blur transition hover:bg-white/20"
        >
          <svg viewBox="0 0 24 24" fill="none" aria-hidden className="size-5">
            <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>

        {images.length > 1 && (
          <>
            <button
              type="button"
              onClick={() => step(-1)}
              aria-label="รูปก่อนหน้า"
              className="absolute top-1/2 left-2 grid size-11 -translate-y-1/2 place-items-center rounded-full bg-white/10 text-white ring-1 ring-white/20 backdrop-blur transition hover:bg-white/20 sm:left-4"
            >
              <svg viewBox="0 0 24 24" fill="none" aria-hidden className="size-5">
                <path d="M15 6l-6 6 6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <button
              type="button"
              onClick={() => step(1)}
              aria-label="รูปถัดไป"
              className="absolute top-1/2 right-2 grid size-11 -translate-y-1/2 place-items-center rounded-full bg-white/10 text-white ring-1 ring-white/20 backdrop-blur transition hover:bg-white/20 sm:right-4"
            >
              <svg viewBox="0 0 24 24" fill="none" aria-hidden className="size-5">
                <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </>
        )}
      </dialog>
    </>
  );
}
