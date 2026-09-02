"use client";

import { useEffect, useState } from "react";
import { Icon } from "@/components/ui";
import { lineHref, telHref } from "@/data/site";

/**
 * Bottom action bar for phones, where the sticky header CTA scrolls out of the
 * thumb zone. Appears once the visitor is past the hero so it never covers the
 * first screen. Hidden on desktop — the header CTA stays visible there.
 */
export default function LpStickyCta({ quoteLabel = "ขอใบเสนอราคา" }: { quoteLabel?: string }) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 460);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className={`fixed inset-x-0 bottom-0 z-50 border-t border-slate-200 bg-white/95 backdrop-blur-xl transition-transform duration-300 lg:hidden ${
        show ? "translate-y-0" : "translate-y-full"
      }`}
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <div className="grid grid-cols-3 gap-2 p-3">
        <a
          href={telHref}
          data-cta="sticky-call"
          className="flex flex-col items-center justify-center gap-1 rounded-2xl bg-brand-700 py-2.5 text-white transition active:scale-[0.97]"
        >
          <Icon.phone className="size-5" />
          <span className="text-[0.7rem] font-semibold">โทรสอบถาม</span>
        </a>
        <a
          href={lineHref}
          target="_blank"
          rel="noreferrer"
          data-cta="sticky-line"
          className="flex flex-col items-center justify-center gap-1 rounded-2xl bg-[#06C755] py-2.5 text-white transition active:scale-[0.97]"
        >
          <Icon.line className="size-5" />
          <span className="text-[0.7rem] font-semibold">แชท LINE</span>
        </a>
        <a
          href="#quote"
          data-cta="sticky-quote"
          className="flex flex-col items-center justify-center gap-1 rounded-2xl bg-brand-50 py-2.5 text-brand-800 ring-1 ring-inset ring-brand-200 transition active:scale-[0.97]"
        >
          <Icon.doc className="size-5" />
          <span className="text-[0.7rem] font-semibold">{quoteLabel}</span>
        </a>
      </div>
    </div>
  );
}
