"use client";

import { useEffect, useState } from "react";
import { Icon } from "@/components/ui";
import { useSite } from "@/components/SiteProvider";

/**
 * Concept B has a three-button sticky bar on phones (`.mcta`). On larger
 * screens it has no floating actions, so the round buttons only appear from
 * `sm` up, once the visitor is past the fold.
 */

/**
 * ป้ายบอกว่าปุ่มกลมปุ่มไหนคืออะไร โผล่ออกมาทางซ้ายตอนชี้เมาส์หรือ tab มาถึง
 *
 * ปุ่มกลมมีแต่ไอคอน คนใช้จึงต้องเดาว่าอันไหนคืออะไร โดยเฉพาะไลน์สองปุ่มที่
 * ต่างกันแค่เลข 1/2 ป้ายนี้ตอบให้ตรงๆ ว่าเบอร์อะไร ไลน์ไหน
 *
 * pointer-events-none กันไม่ให้ตัวป้ายไปบังปุ่มจนกดไม่โดน
 * และไม่ได้ใช้ title="" เพราะรอนานกว่าจะขึ้น สั่งให้ขึ้นทันทีไม่ได้
 */
function FloatLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="pointer-events-none absolute top-1/2 right-full mr-3 -translate-y-1/2 translate-x-2 rounded-full bg-brand-800 px-3.5 py-1.5 text-[13px] font-medium whitespace-nowrap text-white opacity-0 shadow-[0_6px_18px_rgba(32,64,79,0.28)] transition-all duration-200 group-hover:translate-x-0 group-hover:opacity-100 group-focus-visible:translate-x-0 group-focus-visible:opacity-100">
      {children}
    </span>
  );
}
export default function FloatingActions() {
  const { site, telHref, lineHref, lineHref2 } = useSite();
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 520);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      {/* Mobile sticky bar */}
      <div className="fixed inset-x-0 bottom-0 z-80 grid grid-cols-4 gap-1.5 border-t border-slate-200 bg-white p-2 shadow-[0_-6px_18px_rgba(42,80,104,0.09)] sm:hidden">
        <a
          href={telHref}
          className="inline-flex items-center justify-center gap-1 rounded-full bg-accent-500 px-1.5 py-2.5 text-[13px] font-medium text-white"
        >
          <Icon.phone className="size-4" />
          โทร
        </a>
        <a
          href={lineHref}
          target="_blank"
          rel="noreferrer"
          aria-label={`แอดไลน์ ${site.lineId}`}
          className="inline-flex items-center justify-center gap-1 rounded-full bg-[#06C755] px-1.5 py-2.5 text-[13px] font-medium text-white"
        >
          <Icon.line className="size-4" />
          LINE 1
        </a>
        <a
          href={lineHref2}
          target="_blank"
          rel="noreferrer"
          aria-label="แอดไลน์ ช่องทางที่ 2"
          className="inline-flex items-center justify-center gap-1 rounded-full bg-[#06C755] px-1.5 py-2.5 text-[13px] font-medium text-white"
        >
          <Icon.line className="size-4" />
          LINE 2
        </a>
        <a
          href="/contact"
          className="inline-flex items-center justify-center gap-1.5 rounded-full bg-brand-600 px-2 py-2.5 text-[14px] font-medium text-white"
        >
          <Icon.doc className="size-4" />
          ใบเสนอราคา
        </a>
      </div>

      {/* Desktop float */}
      <div
        className={`fixed right-5 bottom-5 z-40 hidden flex-col gap-2.5 transition-all duration-300 sm:flex ${
          show ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0"
        }`}
      >
        <a
          href={lineHref}
          target="_blank"
          rel="noreferrer"
          aria-label={`แอดไลน์ ${site.lineId}`}
          className="group relative grid size-12 place-items-center rounded-full bg-[#06C755] text-white shadow-[0_8px_20px_rgba(6,199,85,0.3)] transition hover:scale-105"
        >
          <FloatLabel>LINE {site.lineId}</FloatLabel>
          <Icon.line className="size-5" />
          <span className="absolute -top-1 -right-1 grid size-[18px] place-items-center rounded-full bg-white text-[11px] font-bold text-[#06C755] shadow">
            1
          </span>
        </a>
        <a
          href={lineHref2}
          target="_blank"
          rel="noreferrer"
          aria-label="แอดไลน์ ช่องทางที่ 2"
          className="group relative grid size-12 place-items-center rounded-full bg-[#06C755] text-white shadow-[0_8px_20px_rgba(6,199,85,0.3)] transition hover:scale-105"
        >
          <FloatLabel>LINE ช่องทางที่ 2</FloatLabel>
          <Icon.line className="size-5" />
          <span className="absolute -top-1 -right-1 grid size-[18px] place-items-center rounded-full bg-white text-[11px] font-bold text-[#06C755] shadow">
            2
          </span>
        </a>
        {/* ปุ่มโทรใช้สองเบอร์แรกในลิสต์ อยากเปลี่ยนว่าเบอร์ไหนขึ้นก็ย้ายลำดับในหลังบ้าน
            ปุ่มหน้าตาเหมือนกันทั้งคู่ ป้ายตอนชี้เมาส์เป็นตัวบอกว่าอันไหนเบอร์อะไร */}
        {site.phones.slice(0, 2).map((phone) => (
          <a
            key={phone}
            href={`tel:${phone.replace(/-/g, "")}`}
            aria-label={`โทรหาฝ่ายขาย ${phone}`}
            className="group relative grid size-12 place-items-center rounded-full bg-accent-500 text-white shadow-[0_8px_20px_rgba(32,108,164,0.32)] transition hover:scale-105"
          >
            <FloatLabel>โทร {phone}</FloatLabel>
            <Icon.phone className="size-5" />
          </a>
        ))}
        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          aria-label="กลับขึ้นด้านบน"
          className="group relative grid size-12 place-items-center rounded-full border border-slate-200 bg-white text-brand-600 shadow-[0_8px_20px_rgba(42,80,104,0.12)] transition hover:scale-105"
        >
          <FloatLabel>กลับขึ้นด้านบน</FloatLabel>
          <Icon.arrow className="size-5 -rotate-90" />
        </button>
      </div>
    </>
  );
}
