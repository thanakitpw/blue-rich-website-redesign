"use client";

import { useEffect, useState } from "react";
import { Icon } from "@/components/ui";
import { lineHref, telHref } from "@/data/site";

export default function FloatingActions() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 520);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className={`fixed right-4 bottom-4 z-40 flex flex-col gap-3 transition-all duration-300 sm:right-6 sm:bottom-6 ${
        show ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0"
      }`}
    >
      <a
        href={lineHref}
        target="_blank"
        rel="noreferrer"
        aria-label="แชทผ่าน LINE"
        className="group grid size-13 place-items-center rounded-full bg-[#06C755] text-white shadow-xl shadow-[#06C755]/30 transition hover:scale-105 sm:size-14"
      >
        <Icon.line className="size-6" />
      </a>
      <a
        href={telHref}
        aria-label="โทรหาฝ่ายขาย"
        className="grid size-13 place-items-center rounded-full bg-brand-700 text-white shadow-xl shadow-brand-900/30 transition hover:scale-105 sm:size-14"
      >
        <Icon.phone className="size-5" />
      </a>
      <button
        type="button"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        aria-label="กลับขึ้นด้านบน"
        className="grid size-13 place-items-center rounded-full bg-white text-brand-700 shadow-xl shadow-brand-900/10 ring-1 ring-brand-100 transition hover:scale-105 sm:size-14"
      >
        <Icon.arrow className="size-5 -rotate-90" />
      </button>
    </div>
  );
}
