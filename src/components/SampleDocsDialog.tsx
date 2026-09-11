"use client";

import { useRef } from "react";
import { Icon } from "@/components/ui";
import type { SampleDoc } from "@/data/service-samples";

/**
 * ปุ่ม "ดาวน์โหลดตัวอย่างเอกสาร" ที่เปิดป๊อปอัพรายการไฟล์ให้เลือก
 *
 * ใช้ <dialog> ของเบราว์เซอร์แบบเดียวกับแกลเลอรีหน้าแลนดิ้ง — ได้ Esc ปิด
 * ขังโฟกัส และ top layer มาเอง ลิงก์ในป๊อปอัพเป็น <a download> ธรรมดา
 * ไฟล์อยู่ใน public/docs จึงเป็น same-origin และ download attribute ทำงานได้
 */
export default function SampleDocsDialog({
  title,
  description,
  docs,
  buttonLabel,
}: {
  title: string;
  description: string;
  docs: SampleDoc[];
  buttonLabel: string;
}) {
  const ref = useRef<HTMLDialogElement>(null);

  return (
    <>
      <button
        type="button"
        onClick={() => ref.current?.showModal()}
        className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-6 py-3 text-[16px] leading-none font-medium text-accent-500 transition-all duration-200 hover:border-accent-200 hover:bg-accent-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-500"
      >
        <Icon.doc className="size-[18px]" />
        {buttonLabel}
      </button>

      {/* คลิกบนฉากหลัง (target คือ dialog เอง) = ปิด — ตัวกล่องขาวเป็นลูกข้างใน */}
      <dialog
        ref={ref}
        onClick={(e) => e.target === e.currentTarget && ref.current?.close()}
        aria-labelledby="sample-docs-title"
        className="m-auto w-[calc(100%-2rem)] max-w-lg rounded-3xl border-0 bg-white p-0 shadow-2xl shadow-brand-950/30 backdrop:bg-brand-950/60 backdrop:backdrop-blur-sm"
      >
        <div className="p-6 sm:p-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="eyebrow-en text-[12px] tracking-[0.07em] text-accent-500">
                ดาวน์โหลดฟรี
              </p>
              <h2 id="sample-docs-title" className="mt-1.5 text-xl leading-snug text-brand-950 sm:text-2xl">
                {title}
              </h2>
            </div>
            <button
              type="button"
              onClick={() => ref.current?.close()}
              aria-label="ปิด"
              className="grid size-9 shrink-0 place-items-center rounded-full bg-slate-100 text-slate-600 transition hover:bg-slate-200"
            >
              <svg viewBox="0 0 24 24" fill="none" aria-hidden className="size-4">
                <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>
          </div>
          <p className="mt-3 text-sm leading-relaxed text-slate-600">{description}</p>

          <ul className="mt-5 grid gap-2.5">
            {docs.map((d) => (
              <li key={d.href}>
                <a
                  href={d.href}
                  download
                  className="group flex items-center gap-3.5 rounded-2xl border border-slate-200 px-4 py-3.5 transition hover:border-brand-200 hover:bg-brand-50"
                >
                  <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-brand-50 text-brand-600 transition group-hover:bg-white">
                    <Icon.doc className="size-5" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-[15px] leading-snug font-semibold text-brand-950">
                      {d.label}
                    </span>
                    <span className="mt-0.5 block text-[13px] leading-relaxed text-slate-500">
                      {d.detail} · PDF {d.size}
                    </span>
                  </span>
                  <svg viewBox="0 0 24 24" fill="none" aria-hidden className="size-5 shrink-0 text-accent-500">
                    <path d="M12 4v12m0 0l-4-4m4 4l4-4M5 20h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </a>
              </li>
            ))}
          </ul>

          <p className="mt-4 text-[12.5px] leading-relaxed text-slate-400">
            เอกสารตัวอย่างใช้เพื่อดูรูปแบบและรายการที่ต้องมี ชุดจริงของแต่ละโครงการจัดทำตามแบบและหน้าตัดเหล็กของงานนั้น
          </p>
        </div>
      </dialog>
    </>
  );
}
