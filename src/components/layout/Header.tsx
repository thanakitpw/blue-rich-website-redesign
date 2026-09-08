"use client";

import { CmsImage } from "@/components/CmsImage";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Button, Container, Icon } from "@/components/ui";
import { useSite } from "@/components/SiteProvider";
import type { NavItem } from "@/data/site";

/**
 * Concept B's header: a white utility bar that scrolls away, then a sticky
 * white pill nav. The nine-item structure the client drew adds dropdowns to
 * four of the pills — CSS-driven (`group-hover` + `group-focus-within`) so
 * they work for pointer and keyboard without a piece of state per menu.
 */
export default function Header() {
  const { site, nav, telHref, lineHref, lineHref2, headerPhones } = useSite();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);

  /* ทั้งหัวเว็บติดหนึบตามลงมาเวลาเลื่อน พอเลื่อนพ้นช่วงแรกแล้วแถบบนจะบีบตัวลง
     ให้เตี้ยกว่าเดิม เพราะถ้าคาไว้เท่าเดิมจะกินพื้นที่จอเกินไป
     จอเล็กแถบบนหุบหายไปเลย เหลือแค่แถวเมนู เพราะจอสูงไม่พอให้แบ่ง */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* Reset the mobile panel when the route changes — done during render, the
   * documented way to reset state in response to a changed value. */
  const [lastPath, setLastPath] = useState(pathname);
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setOpen(false);
    setExpanded(null);
  }

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href.split("#")[0]);

  const isBranchActive = (item: NavItem) =>
    isActive(item.href) || (item.children ?? []).some((c) => isActive(c.href));

  return (
    <header className="sticky top-0 z-60">
      {/* ---------------------------------------------------- Utility bar */}
      <div
        className={`overflow-hidden border-b bg-white transition-all duration-300 ${
          scrolled
            ? "max-h-0 border-transparent opacity-0 lg:max-h-[64px] lg:border-slate-100 lg:opacity-100"
            : "max-h-[160px] border-slate-100 opacity-100"
        }`}
      >
        <Container
          className={`flex items-center justify-between gap-4 transition-all duration-300 ${
            scrolled ? "py-3 lg:py-1.5" : "py-3"
          }`}
        >
          <Link href="/" className="flex items-center gap-3" aria-label={site.name}>
            <CmsImage
              src="/assets/logo.png"
              alt=""
              width={160}
              height={142}
              priority
              className={`w-auto shrink-0 transition-all duration-300 ${
                scrolled ? "h-[34px] lg:h-[32px]" : "h-[34px] sm:h-[42px]"
              }`}
            />
            {/* ชื่อบริษัทดึงจาก "ตั้งค่าเว็บไซต์ → ข้อมูลบริษัท" ไม่ฝังไว้ในโค้ด
               แก้ที่เดียวแล้วเปลี่ยนพร้อมกันทั้งหัวเว็บ ท้ายเว็บ และข้อมูลที่ส่งให้ Google
               ชื่อเต็มยาวกว่าชื่อย่อพอสมควร จอเล็กจึงลดขนาดลงและปล่อยให้ตกบรรทัดได้ */}
            <span className="leading-[1.2]">
              <b className="block text-[13px] font-semibold text-brand-700 sm:text-[15px] xl:text-base">
                {site.name}
              </b>
              <span className="hidden text-[11.5px] tracking-[0.07em] text-slate-500 uppercase sm:block xl:text-[12px]">
                {site.nameEn}
              </span>
            </span>
          </Link>

          <div className="flex items-center gap-2.5">
            <a
              href={telHref}
              aria-label={`โทร ${site.phones[0]}`}
              className="grid size-[38px] shrink-0 place-items-center rounded-full bg-accent-500 text-white transition hover:bg-accent-600"
            >
              <Icon.phone className="size-[18px]" />
            </a>
            <span className="hidden leading-tight lg:block">
              <span className="flex gap-x-3 text-[14px] font-semibold text-brand-700">
                {headerPhones.map((phone) => (
                  <a
                    key={phone}
                    href={`tel:${phone.replace(/-/g, "")}`}
                    className="whitespace-nowrap transition hover:text-accent-600"
                  >
                    {phone}
                  </a>
                ))}
              </span>
              <span className="mt-0.5 block text-[13px] text-slate-500">{site.hours}</span>
            </span>
            <Button href="/contact" className="hidden sm:inline-flex">
              <Icon.doc className="size-[15px]" />
              ขอใบเสนอราคา
            </Button>
          </div>
        </Container>
      </div>

      {/* ------------------------------------------------------- Pill nav */}
      <nav
        aria-label="เมนูหลัก"
        className={`border-b border-slate-200 bg-white transition-shadow duration-300 ${
          scrolled ? "shadow-[0_6px_18px_rgba(42,80,104,0.09)]" : "shadow-[0_1px_0_rgba(42,80,104,0.03)]"
        }`}
      >
        <Container className="relative flex items-center justify-between gap-5 py-[9px]">
          {/* Mobile toggle */}
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            className="inline-flex items-center gap-2 rounded-[8px] border border-slate-200 px-3 py-[7px] text-sm text-brand-700 lg:hidden"
          >
            <svg
              viewBox="0 0 24 24"
              width="17"
              height="17"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              aria-hidden
            >
              {open ? <path d="M5 5l14 14M19 5L5 19" /> : <path d="M3 6h18M3 12h18M3 18h18" />}
            </svg>
            เมนู
          </button>

          {/* Desktop pills — 10 ปุ่มหลังยกสองสูตรสีกันไฟขึ้นมา บีบระยะที่ช่วง lg
              ให้พอดีแถวเดียว แล้วค่อยคลายกลับที่ xl ซึ่งมีที่ว่างพอ */}
          <ul className="hidden items-center gap-0.5 lg:flex xl:gap-1">
            {nav.map((item) => {
              const active = isBranchActive(item);
              return (
                <li key={item.href} className="group relative">
                  <Link
                    href={item.href}
                    className={`flex items-center gap-1 rounded-full px-2.5 text-[14.5px] whitespace-nowrap transition xl:px-3.5 xl:text-sm ${
                      item.note ? "py-1" : "py-2"
                    } ${
                      active
                        ? "bg-brand-600 font-medium text-white"
                        : "text-brand-800 hover:bg-brand-50 hover:text-brand-600"
                    }`}
                  >
                    {/* เมนูที่มี note ขึ้นสองบรรทัด — ชื่อไทยบน ชื่อรุ่นภาษาอังกฤษล่าง
                        บีบ py ลงเพื่อให้ปุ่มสูงใกล้เคียงปุ่มบรรทัดเดียวข้าง ๆ */}
                    {item.note ? (
                      <span className="flex flex-col leading-tight">
                        {item.label}
                        <span
                          className={`text-[10.5px] font-normal tracking-tight ${
                            active ? "text-white/75" : "text-slate-400"
                          }`}
                        >
                          {item.note}
                        </span>
                      </span>
                    ) : (
                      item.label
                    )}
                    {item.children && (
                      <Icon.chevronDown className="size-3.5 opacity-70 transition-transform duration-200 group-hover:rotate-180" />
                    )}
                  </Link>

                  {item.children && (
                    <div className="invisible absolute top-full left-0 z-10 w-[20rem] translate-y-1 pt-2 opacity-0 transition-all duration-200 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100">
                      <ul className="overflow-hidden rounded-3xl border border-slate-200 bg-white p-2 shadow-[0_12px_30px_rgba(42,80,104,0.14)]">
                        {item.children.map((child) => (
                          <li key={child.href}>
                            <Link
                              href={child.href}
                              className={`block rounded-2xl px-4 py-2.5 transition ${
                                isActive(child.href) ? "bg-brand-50" : "hover:bg-brand-50"
                              }`}
                            >
                              <span className="block text-[14.5px] font-medium text-brand-700">
                                {child.label}
                              </span>
                              {child.note && (
                                <span className="mt-0.5 block text-[13px] leading-snug text-slate-500">
                                  {child.note}
                                </span>
                              )}
                            </Link>
                          </li>
                        ))}
                        <li className="mt-1 border-t border-slate-100 pt-1">
                          <Link
                            href={item.href}
                            className="flex items-center gap-1.5 rounded-2xl px-4 py-2 text-[13.5px] font-medium text-accent-500 transition hover:bg-brand-50"
                          >
                            ดูภาพรวม {item.label}
                            <Icon.arrow className="size-3.5" />
                          </Link>
                        </li>
                      </ul>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>

          {/* Social — ลูกค้าขอตัด Facebook ออก เหลือ LINE สองช่องทาง */}
          <div className="flex gap-2">
            <a
              href={lineHref}
              target="_blank"
              rel="noreferrer"
              aria-label={`แอดไลน์ ${site.lineId}`}
              className="grid size-[30px] place-items-center rounded-full bg-[#06C755] text-white transition hover:brightness-110"
            >
              <Icon.line className="size-4" />
            </a>
            <a
              href={lineHref2}
              target="_blank"
              rel="noreferrer"
              aria-label="แอดไลน์ ช่องทางที่ 2"
              className="grid size-[30px] place-items-center rounded-full bg-[#06C755] text-white transition hover:brightness-110"
            >
              <Icon.line className="size-4" />
            </a>
          </div>

          {/* Mobile panel */}
          {open && (
            <div className="absolute inset-x-0 top-full z-20 max-h-[75vh] overflow-y-auto border-b border-slate-200 bg-white px-5 pt-2 pb-4 shadow-[0_12px_24px_rgba(42,80,104,0.09)] lg:hidden">
              <ul className="flex flex-col gap-0.5">
                {nav.map((item) => (
                  <li key={item.href}>
                    <div className="flex items-center">
                      <Link
                        href={item.href}
                        className={`flex-1 rounded-[8px] px-3.5 py-2.5 text-sm ${
                          isBranchActive(item)
                            ? "bg-brand-600 font-medium text-white"
                            : "text-brand-800"
                        }`}
                      >
                        {item.label}
                        {item.note && (
                          <span
                            className={`mt-0.5 block text-[12px] leading-snug ${
                              isBranchActive(item) ? "text-white/75" : "text-slate-500"
                            }`}
                          >
                            {item.note}
                          </span>
                        )}
                      </Link>
                      {item.children && (
                        <button
                          type="button"
                          aria-label={`เปิดเมนูย่อย ${item.label}`}
                          aria-expanded={expanded === item.href}
                          onClick={() =>
                            setExpanded((v) => (v === item.href ? null : item.href))
                          }
                          className="grid size-8 place-items-center rounded-full border border-slate-200 text-brand-600"
                        >
                          <Icon.chevronDown
                            className={`size-4 transition-transform duration-200 ${
                              expanded === item.href ? "rotate-180" : ""
                            }`}
                          />
                        </button>
                      )}
                    </div>

                    {item.children && expanded === item.href && (
                      <ul className="my-1 rounded-[10px] bg-brand-50 p-1.5">
                        {item.children.map((child) => (
                          <li key={child.href}>
                            <Link
                              href={child.href}
                              className="block rounded-[8px] px-3 py-2 text-brand-700 transition hover:bg-white"
                            >
                              <span className="block text-[14.5px]">{child.label}</span>
                              {/* คำอธิบายบรรทัดล่าง — เดิมมีเฉพาะเมนูจอใหญ่ */}
                              {child.note && (
                                <span className="mt-0.5 block text-[12.5px] leading-snug text-slate-500">
                                  {child.note}
                                </span>
                              )}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                ))}
              </ul>

              <div className="mt-4 grid gap-2">
                <Button href={telHref} variant="accent">
                  <Icon.phone />
                  โทร {site.phones[0]}
                </Button>
                <Button href={lineHref} variant="line">
                  <Icon.line />
                  แอดไลน์ {site.lineId}
                </Button>
                <Button href={lineHref2} variant="line">
                  <Icon.line />
                  แอดไลน์ ช่องทางที่ 2
                </Button>
              </div>
            </div>
          )}
        </Container>
      </nav>
    </header>
  );
}
