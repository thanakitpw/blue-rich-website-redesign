"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { Icon } from "@/components/ui";
import { lineHref, site, telHref } from "@/data/site";

export type LpSection = { href: string; label: string };

/**
 * Deliberately not the site Header — an ad landing page should offer no way out
 * except the CTAs, so the links here only jump within the page. `sections` is
 * the in-page jump list, which differs per landing page.
 */
export default function LpHeader({ sections }: { sections: LpSection[] }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/95 shadow-[0_1px_0_theme(colors.slate.200),0_12px_32px_-16px_rgba(12,36,56,0.28)] backdrop-blur-xl"
          : "bg-white/85 backdrop-blur-md"
      }`}
    >
      <div className="mx-auto flex w-full max-w-[1200px] items-center justify-between gap-4 px-5 sm:px-8">
        <div
          className={`flex items-center gap-3 transition-all duration-300 ${
            scrolled ? "h-16" : "h-[4.5rem] lg:h-[4.75rem]"
          }`}
        >
          <Image
            src="/assets/logo.png"
            alt={site.name}
            width={160}
            height={142}
            priority
            className={`w-auto transition-all duration-300 ${scrolled ? "h-9" : "h-10 lg:h-11"}`}
          />
          <span className="hidden leading-tight sm:block">
            <span className="block font-display text-[0.95rem] font-bold text-brand-900">
              BLUE RICH
            </span>
            <span className="block text-[0.62rem] font-semibold tracking-[0.18em] text-brand-500">
              MATERIAL PRODUCTS
            </span>
          </span>
        </div>

        <nav className="hidden items-center gap-1 xl:flex">
          {sections.map((s) => (
            <a
              key={s.href}
              href={s.href}
              className="rounded-full px-3.5 py-2 text-[0.9rem] font-medium text-slate-600 transition hover:bg-brand-50 hover:text-brand-700"
            >
              {s.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <a
            href={lineHref}
            target="_blank"
            rel="noreferrer"
            data-cta="header-line"
            className="hidden items-center gap-2 rounded-full bg-[#06C755] px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-[#06C755]/25 transition hover:bg-[#05b34c] active:scale-[0.98] sm:inline-flex"
          >
            <Icon.line />
            แอดไลน์
          </a>
          <a
            href={telHref}
            data-cta="header-call"
            className="inline-flex items-center gap-2 rounded-full bg-brand-700 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-brand-900/20 transition hover:bg-brand-800 active:scale-[0.98]"
          >
            <Icon.phone />
            <span className="hidden sm:inline">โทร {site.phones[0]}</span>
            <span className="sm:hidden">โทรเลย</span>
          </a>
        </div>
      </div>
    </header>
  );
}
