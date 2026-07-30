"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Button, Container, Icon } from "@/components/ui";
import { lineHref, mailHref, nav, site, telHref } from "@/data/site";

export default function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      {/* Utility bar — collapses away once the page scrolls */}
      <div
        className={`hidden overflow-hidden bg-brand-950 text-brand-100/80 transition-[height,opacity] duration-300 lg:block ${
          scrolled ? "h-0 opacity-0" : "h-10 opacity-100"
        }`}
      >
        <Container className="flex h-10 items-center justify-between text-[0.8rem]">
          <div className="flex items-center gap-6">
            <a href={telHref} className="flex items-center gap-2 transition hover:text-white">
              <Icon.phone className="size-3.5" />
              {site.phones.join(" · ")}
            </a>
            <a href={mailHref} className="flex items-center gap-2 transition hover:text-white">
              <Icon.mail className="size-3.5" />
              {site.email}
            </a>
          </div>
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-2">
              <Icon.clock className="size-3.5" />
              {site.hours}
            </span>
            <a
              href={lineHref}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 transition hover:text-white"
            >
              <Icon.line className="size-3.5" />
              LINE : {site.lineId}
            </a>
          </div>
        </Container>
      </div>

      {/* Main bar */}
      <div
        className={`transition-all duration-300 ${
          scrolled
            ? "bg-white/90 shadow-[0_1px_0_theme(colors.slate.200),0_12px_32px_-16px_rgba(12,36,56,0.28)] backdrop-blur-xl"
            : "bg-white/80 backdrop-blur-md lg:bg-white/95"
        }`}
      >
        <Container>
          <div
            className={`flex items-center justify-between transition-all duration-300 ${
              scrolled ? "h-16" : "h-[4.5rem] lg:h-20"
            }`}
          >
            <Link href="/" className="flex items-center gap-3" aria-label={site.name}>
              <Image
                src="/assets/logo.png"
                alt=""
                width={160}
                height={142}
                priority
                className={`w-auto transition-all duration-300 ${scrolled ? "h-9" : "h-10 lg:h-12"}`}
              />
              <span className="hidden leading-tight sm:block">
                <span className="block font-display text-[0.95rem] font-bold text-brand-900">
                  BLUE RICH
                </span>
                <span className="block text-[0.62rem] font-semibold tracking-[0.18em] text-brand-500">
                  MATERIAL PRODUCTS
                </span>
              </span>
            </Link>

            <nav className="hidden items-center gap-1 lg:flex">
              {nav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`relative rounded-full px-4 py-2 text-[0.92rem] font-medium transition ${
                    isActive(item.href)
                      ? "text-brand-700"
                      : "text-slate-600 hover:bg-brand-50 hover:text-brand-700"
                  }`}
                >
                  {item.label}
                  {isActive(item.href) && (
                    <span className="absolute inset-x-4 -bottom-0.5 h-0.5 rounded-full bg-brand-500" />
                  )}
                </Link>
              ))}
            </nav>

            <div className="flex items-center gap-2">
              <Button href={telHref} size="md" className="hidden sm:inline-flex">
                <Icon.phone />
                ขอใบเสนอราคา
              </Button>

              <button
                type="button"
                onClick={() => setOpen((v) => !v)}
                aria-label={open ? "ปิดเมนู" : "เปิดเมนู"}
                aria-expanded={open}
                className="grid size-11 place-items-center rounded-full text-brand-800 ring-1 ring-brand-200 transition hover:bg-brand-50 lg:hidden"
              >
                <span className="relative block h-3.5 w-5">
                  <span
                    className={`absolute inset-x-0 h-0.5 rounded bg-current transition-all duration-300 ${
                      open ? "top-1.5 rotate-45" : "top-0"
                    }`}
                  />
                  <span
                    className={`absolute inset-x-0 top-1.5 h-0.5 rounded bg-current transition-all duration-200 ${
                      open ? "opacity-0" : "opacity-100"
                    }`}
                  />
                  <span
                    className={`absolute inset-x-0 h-0.5 rounded bg-current transition-all duration-300 ${
                      open ? "top-1.5 -rotate-45" : "top-3"
                    }`}
                  />
                </span>
              </button>
            </div>
          </div>
        </Container>
      </div>

      {/* Mobile drawer */}
      <div
        className={`fixed inset-x-0 top-[4.5rem] bottom-0 z-40 overflow-y-auto bg-white transition-all duration-300 lg:hidden ${
          open ? "visible opacity-100" : "invisible opacity-0"
        }`}
      >
        <Container className="py-6">
          <nav className="flex flex-col">
            {nav.map((item, i) => (
              <Link
                key={item.href}
                href={item.href}
                style={{ transitionDelay: open ? `${i * 40}ms` : "0ms" }}
                className={`border-b border-slate-100 py-4 font-display text-lg font-semibold transition-all duration-300 ${
                  open ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
                } ${isActive(item.href) ? "text-brand-700" : "text-brand-950"}`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="mt-8 grid gap-3">
            <Button href={telHref} size="lg">
              <Icon.phone />
              โทร {site.phones[0]}
            </Button>
            <Button href={lineHref} variant="line" size="lg">
              <Icon.line />
              แอดไลน์ @{site.lineId}
            </Button>
          </div>

          <div className="mt-8 space-y-3 rounded-3xl bg-brand-50 p-5 text-sm text-slate-600">
            <p className="flex gap-3">
              <Icon.pin className="mt-0.5 shrink-0 text-brand-500" />
              {site.address}
            </p>
            <p className="flex gap-3">
              <Icon.mail className="mt-0.5 shrink-0 text-brand-500" />
              {site.email}
            </p>
            <p className="flex gap-3">
              <Icon.clock className="mt-0.5 shrink-0 text-brand-500" />
              {site.hours}
            </p>
          </div>
        </Container>
      </div>
    </header>
  );
}
