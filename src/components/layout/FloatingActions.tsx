"use client";

import { useEffect, useState } from "react";
import { Icon } from "@/components/ui";
import { useSite } from "@/components/SiteProvider";

/**
 * Concept B has a three-button sticky bar on phones (`.mcta`). On larger
 * screens it has no floating actions, so the round buttons only appear from
 * `sm` up, once the visitor is past the fold.
 */
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
          aria-label={`แอดไลน์ @${site.lineId}`}
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
          aria-label={`แอดไลน์ @${site.lineId}`}
          className="relative grid size-12 place-items-center rounded-full bg-[#06C755] text-white shadow-[0_8px_20px_rgba(6,199,85,0.3)] transition hover:scale-105"
        >
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
          className="relative grid size-12 place-items-center rounded-full bg-[#06C755] text-white shadow-[0_8px_20px_rgba(6,199,85,0.3)] transition hover:scale-105"
        >
          <Icon.line className="size-5" />
          <span className="absolute -top-1 -right-1 grid size-[18px] place-items-center rounded-full bg-white text-[11px] font-bold text-[#06C755] shadow">
            2
          </span>
        </a>
        <a
          href={telHref}
          aria-label="โทรหาฝ่ายขาย"
          className="grid size-12 place-items-center rounded-full bg-accent-500 text-white shadow-[0_8px_20px_rgba(32,108,164,0.32)] transition hover:scale-105"
        >
          <Icon.phone className="size-5" />
        </a>
        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          aria-label="กลับขึ้นด้านบน"
          className="grid size-12 place-items-center rounded-full border border-slate-200 bg-white text-brand-600 shadow-[0_8px_20px_rgba(42,80,104,0.12)] transition hover:scale-105"
        >
          <Icon.arrow className="size-5 -rotate-90" />
        </button>
      </div>
    </>
  );
}
