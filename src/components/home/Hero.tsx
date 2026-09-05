"use client";

import { CmsImage } from "@/components/CmsImage";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { Container } from "@/components/ui";
import { Ribbon } from "@/components/concept";
import type * as HomeCopy from "@/data/pages/home";

type HomeHeroCopy = typeof HomeCopy.hero;

/* รูปแบนเนอร์จากลูกค้า สัดส่วน ~2.07:1 เท่ากับกรอบสไลด์ตอนจอกว้างสุด (1140x550)
   เรียงตามลำดับสไลด์ — ตัวแรกคือรูปที่เห็นตอนเปิดหน้าเว็บ
   คำบรรยายภาพอยู่ที่ slideAlts ใน src/data/pages/home.ts เรียงลำดับตรงกัน */
const slideSrc = ["/assets/banner-walkway.jpg", "/assets/banner-1.jpg", "/assets/banner-2.jpg"];

/**
 * รับข้อความมาเป็น prop ไม่ได้อ่านเองเพราะเป็น client component — ถ้าดึง
 * copyFor() เข้ามาตรงนี้ next/headers จะถูกลากเข้า bundle ของเบราว์เซอร์แล้ว build พัง
 */
export default function Hero({
  copy,
  ribbon,
}: {
  copy: HomeHeroCopy;
  ribbon: { title: string; note: string }[];
}) {
  const slides = slideSrc.map((src, i) => ({ src, ...copy.slides[i] }));
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
              <CmsImage
                src={s.src}
                alt={s.alt}
                fill
                priority={i === 0}
                sizes="(min-width: 1200px) 1180px, 100vw"
                className="object-cover"
              />
              {/* ม่านสองชั้น — ชั้นล่างกันปุ่มลูกศรกับจุดบอกสไลด์จมหาย
                  ชั้นขวากันตัวหนังสือจมรูป โดยไม่บังรูปฝั่งซ้ายที่เป็นพระเอก */}
              <span
                aria-hidden
                className="absolute inset-0 bg-gradient-to-t from-brand-900/45 via-brand-900/10 to-transparent"
              />
              <span
                aria-hidden
                className="absolute inset-0 bg-gradient-to-l from-brand-900/75 via-brand-900/30 to-transparent sm:via-brand-900/20"
              />

              {/* ข้อความบนแบนเนอร์ — ชิดขวากลางแนวตั้ง เว้นล่างไว้ให้ปุ่มลูกศร
                  ค่อยๆ ลอยขึ้นตามหลังรูปที่เฟดเข้ามา ให้สายตาไปหยุดที่รูปก่อน */}
              <div className="absolute inset-y-0 right-0 z-2 flex max-w-[88%] items-center justify-end px-5 pb-9 text-right sm:max-w-[72%] lg:max-w-[62%] lg:px-16 lg:pb-14">
                <div
                  className={`transition-all duration-[700ms] ${
                    i === index ? "translate-y-0 opacity-100 delay-200" : "translate-y-3 opacity-0"
                  }`}
                >
                  <span
                    aria-hidden
                    className="mb-2.5 ml-auto block h-[3px] w-9 rounded-full bg-accent-500 lg:mb-4 lg:w-11"
                  />
                  <p className="eyebrow-en text-[10px] text-white/75 sm:text-[11px] lg:text-xs">
                    {s.eyebrow}
                  </p>
                  <p className="mt-1 text-[clamp(20px,3.6vw,46px)] leading-[1.12] font-semibold text-white drop-shadow-[0_2px_14px_rgba(21,36,47,0.55)]">
                    {s.title}
                  </p>
                  <p className="mt-1.5 ml-auto max-w-md text-[12.5px] leading-relaxed text-white/85 drop-shadow-[0_1px_8px_rgba(21,36,47,0.5)] sm:text-[13.5px] lg:mt-3 lg:text-[15px]">
                    {s.note}
                  </p>
                </div>
              </div>
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

        {/* ------------------------------------------------------ headline
            บรรทัดอังกฤษด้านบนเป็นคีย์เวิร์ดที่ลูกค้าใช้เรียกตัวเอง วางเป็น
            eyebrow คั่นด้วยจุด แล้วขนาบด้วยเส้นบางที่จางหายไปทั้งสองข้าง
            เส้นจะซ่อนบนจอเล็กเพื่อไม่ให้ข้อความสองท่อนถูกบีบจนตัดบรรทัด */}
        <div className="mb-6 text-center lg:mb-[30px]">
          <p className="eyebrow-en flex flex-wrap items-center justify-center gap-x-2.5 gap-y-1 text-[10.5px] text-brand-500 sm:gap-x-3.5 sm:text-xs">
            <span
              aria-hidden
              className="hidden h-px w-10 bg-gradient-to-r from-transparent to-brand-300 sm:block lg:w-16"
            />
            <span>{copy.eyebrowLeft}</span>
            <span aria-hidden className="size-1 shrink-0 rounded-full bg-accent-500" />
            <span>{copy.eyebrowRight}</span>
            <span
              aria-hidden
              className="hidden h-px w-10 bg-gradient-to-r from-brand-300 to-transparent sm:block lg:w-16"
            />
          </p>

          <h1 className="mx-auto mt-2 max-w-3xl text-[clamp(22px,2.8vw,34px)] leading-[1.35] font-semibold text-balance text-brand-700">
            {copy.headline}
            <span className="text-accent-600">{copy.headlineAccent}</span>
            {copy.headlineTail}
          </h1>

          <span aria-hidden className="mx-auto mt-3.5 block h-[3px] w-11 rounded-full bg-accent-500" />
        </div>

        {/* ------------------------------------------------------ hero duo */}
        <div className="grid gap-[22px] md:grid-cols-2">
          <Link
            href="/intumescent"
            className="group relative flex min-h-[250px] items-end overflow-hidden rounded-3xl bg-brand-800 lg:min-h-[355px] lg:rounded-4xl"
          >
            <CmsImage
              src="/assets/hero-fire-paint.jpg"
              alt={copy.paintCard.alt}
              fill
              sizes="(min-width: 768px) 50vw, 100vw"
              className="object-cover transition-transform duration-[600ms] group-hover:scale-[1.03]"
            />
            <span
              aria-hidden
              className="absolute inset-0 bg-[linear-gradient(0deg,rgba(32,64,79,.94)_0%,rgba(32,64,79,.72)_26%,rgba(32,64,79,.12)_58%,rgba(32,64,79,0)_100%)]"
            />
            <span className="relative z-2 block px-[26px] pt-[22px] pb-6 text-white">
              <span className="eyebrow-en block text-xs text-white/70">{copy.paintCard.eyebrow}</span>
              <span className="block text-[clamp(21px,2.3vw,29px)] font-semibold text-white drop-shadow-[0_1px_10px_rgba(21,36,47,0.5)]">
                {copy.paintCard.title}
              </span>
              <span className="mt-1.5 block text-[14px] text-white/85">
                {copy.paintCard.note}
              </span>
            </span>
          </Link>

          <Link
            href="/fireproofing"
            className="group relative flex min-h-[250px] items-end overflow-hidden rounded-3xl bg-brand-800 lg:min-h-[355px] lg:rounded-4xl"
          >
            <CmsImage
              src="/assets/hero-engineer-certified.jpg"
              alt={copy.engineerCard.alt}
              fill
              sizes="(min-width: 768px) 50vw, 100vw"
              className="object-cover transition-transform duration-[600ms] group-hover:scale-[1.03]"
            />
            <span
              aria-hidden
              className="absolute inset-0 bg-[linear-gradient(0deg,rgba(32,64,79,.94)_0%,rgba(32,64,79,.72)_26%,rgba(32,64,79,.12)_58%,rgba(32,64,79,0)_100%)]"
            />
            <span className="relative z-2 block px-[26px] pt-[22px] pb-6 text-white">
              <span className="eyebrow-en block text-xs text-white/70">{copy.engineerCard.eyebrow}</span>
              <span className="block text-[clamp(21px,2.3vw,29px)] font-semibold text-white drop-shadow-[0_1px_10px_rgba(21,36,47,0.5)]">
                {copy.engineerCard.title}
              </span>
            </span>
          </Link>
        </div>

        {/* -------------------------------------------------------- ribbon */}
        <div className="mt-[26px]">
          <Ribbon items={ribbon} />
        </div>
      </Container>
    </header>
  );
}
