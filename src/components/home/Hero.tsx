"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { Container } from "@/components/ui";
import { Ribbon } from "@/components/concept";

/* Banner artwork supplied by the client — 2280px wide, ~2.07:1 to match the
   slider frame at its largest breakpoint. */
const slides = [
  { src: "/assets/banner-3.jpg", alt: "โครงหลังคาเหล็กช่วงกว้างมองจากด้านใต้" },
  { src: "/assets/banner-1.jpg", alt: "สะพานโครงถักเหล็กในเมืองยามพลบค่ำ" },
  { src: "/assets/banner-2.jpg", alt: "ทางเดินลอยฟ้าโครงสร้างเหล็กกลางเมือง" },
];

export default function Hero() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  const go = useCallback((next: number) => {
    setIndex((next + slides.length) % slides.length);
  }, []);

  useEffect(() => {
    if (paused) return;
    const t = setInterval(() => setIndex((i) => (i + 1) % slides.length), 6000);
    return () => clearInterval(t);
  }, [paused]);

  return (
    <header className="pt-6 lg:pt-[34px]">
      <Container>
        {/* -------------------------------------------------------- slider */}
        <div
          className="relative mb-6 h-[240px] overflow-hidden rounded-3xl bg-brand-800 sm:h-[300px] lg:mb-[30px] lg:h-[430px] lg:rounded-4xl xl:h-[550px]"
          aria-roledescription="carousel"
          aria-label="แบนเนอร์หน้าแรก"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          {slides.map((s, i) => (
            <div
              key={s.src}
              role="group"
              aria-roledescription="slide"
              aria-label={`${i + 1} จาก ${slides.length}`}
              className={`absolute inset-0 transition-opacity duration-[650ms] ${
                i === index ? "visible opacity-100" : "invisible opacity-0"
              }`}
            >
              <Image
                src={s.src}
                alt={s.alt}
                fill
                priority={i === 0}
                sizes="(min-width: 1200px) 1180px, 100vw"
                className="object-cover"
              />
              <span
                aria-hidden
                className="absolute inset-0 bg-gradient-to-t from-brand-900/45 via-brand-900/10 to-transparent"
              />
            </div>
          ))}

          <button
            type="button"
            aria-label="สไลด์ก่อนหน้า"
            onClick={() => go(index - 1)}
            className="absolute right-20 bottom-[26px] z-6 hidden size-11 place-items-center rounded-full border border-white/30 bg-white/15 text-white backdrop-blur transition hover:border-white hover:bg-white hover:text-brand-700 sm:grid"
          >
            <svg viewBox="0 0 24 24" className="size-[19px]" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
          <button
            type="button"
            aria-label="สไลด์ถัดไป"
            onClick={() => go(index + 1)}
            className="absolute right-[26px] bottom-[26px] z-6 hidden size-11 place-items-center rounded-full border border-white/30 bg-white/15 text-white backdrop-blur transition hover:border-white hover:bg-white hover:text-brand-700 sm:grid"
          >
            <svg viewBox="0 0 24 24" className="size-[19px]" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>

          <div
            role="tablist"
            aria-label="เลือกสไลด์"
            className="absolute bottom-4 left-5 z-6 flex gap-2.5 lg:bottom-[30px] lg:left-16"
          >
            {slides.map((s, i) => (
              <button
                key={s.src}
                type="button"
                role="tab"
                aria-selected={i === index}
                aria-label={`สไลด์ ${i + 1}`}
                onClick={() => go(i)}
                className={`h-1 rounded-sm transition-all duration-200 ${
                  i === index ? "w-[46px] bg-accent-500" : "w-[30px] bg-white/35 hover:bg-white/60"
                }`}
              />
            ))}
          </div>
        </div>

        <h1 className="mb-6 text-center text-[clamp(21px,2.6vw,32px)] font-semibold text-brand-700">
          ผู้จำหน่ายสีกันไฟโครงสร้างเหล็กและรับรองงานโดยวุฒิวิศวกรครบวงจร
        </h1>

        {/* ------------------------------------------------------ hero duo */}
        <div className="grid gap-[22px] md:grid-cols-2">
          <Link
            href="/intumescent"
            className="group relative flex min-h-[250px] items-end overflow-hidden rounded-3xl bg-brand-800 lg:min-h-[355px] lg:rounded-4xl"
          >
            <Image
              src="/assets/hero-fire-paint.jpg"
              alt="ถังสีกันไฟ Neocoat Intumescent Paint-S หน้างานโครงสร้างเหล็ก"
              fill
              sizes="(min-width: 768px) 50vw, 100vw"
              className="object-cover transition-transform duration-[600ms] group-hover:scale-[1.03]"
            />
            <span
              aria-hidden
              className="absolute inset-0 bg-[linear-gradient(0deg,rgba(32,64,79,.94)_0%,rgba(32,64,79,.72)_26%,rgba(32,64,79,.12)_58%,rgba(32,64,79,0)_100%)]"
            />
            <span className="relative z-2 block px-[26px] pt-[22px] pb-6 text-white">
              <span className="eyebrow-en block text-xs text-white/70">Intumescent Paint</span>
              <span className="block text-[clamp(21px,2.3vw,29px)] font-semibold text-white drop-shadow-[0_1px_10px_rgba(21,36,47,0.5)]">
                สีกันไฟโครงสร้างเหล็ก
              </span>
              <span className="mt-1.5 block text-[14px] text-white/85">
                Neocoat สูตรน้ำมัน &amp; สูตรน้ำ · ASTM E-119 · ISO 834
              </span>
            </span>
          </Link>

          <Link
            href="/fireproofing"
            className="group relative flex min-h-[250px] items-end overflow-hidden rounded-3xl bg-brand-800 lg:min-h-[355px] lg:rounded-4xl"
          >
            <Image
              src="/assets/hero-engineer-certified.jpg"
              alt="วิศวกรตรวจแบบโครงสร้างเหล็กหน้าไซต์งาน"
              fill
              sizes="(min-width: 768px) 50vw, 100vw"
              className="object-cover transition-transform duration-[600ms] group-hover:scale-[1.03]"
            />
            <span
              aria-hidden
              className="absolute inset-0 bg-[linear-gradient(0deg,rgba(32,64,79,.94)_0%,rgba(32,64,79,.72)_26%,rgba(32,64,79,.12)_58%,rgba(32,64,79,0)_100%)]"
            />
            <span className="relative z-2 block px-[26px] pt-[22px] pb-6 text-white">
              <span className="eyebrow-en block text-xs text-white/70">Engineer Certified</span>
              <span className="block text-[clamp(21px,2.3vw,29px)] font-semibold text-white drop-shadow-[0_1px_10px_rgba(21,36,47,0.5)]">
                บริการรับรองงานโดยวุฒิวิศวกรโยธา
              </span>
              <span className="mt-1.5 block text-[14px] text-white/85">
                แบบ กสอ. น.4-5 / น.4-9 · กฎกระทรวง พ.ศ. 2567
              </span>
            </span>
          </Link>
        </div>

        {/* -------------------------------------------------------- ribbon */}
        <div className="mt-[26px]">
          <Ribbon />
        </div>
      </Container>
    </header>
  );
}
