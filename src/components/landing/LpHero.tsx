import { HeroBanner } from "@/components/product/ProductHero";
import { Icon } from "@/components/ui";
import { Check, Wrap } from "@/components/landing/kit";

/**
 * Hero ของหน้าแลนดิ้งทุกหน้า — แบนเนอร์ชุดเดียวกับหน้าสินค้า + แถบจุดขายและ CTA
 *
 * ลูกค้าขอให้หน้าแลนดิ้ง "เหมือนหน้าสินค้า" จึงใช้ HeroBanner ตัวเดียวกัน ต่างกันแค่
 * ไม่มีเบรดครัมบ์ (หน้าแลนดิ้งตั้งใจไม่มีเมนูพาออกไปหน้าอื่น) และเก็บคำโปรย
 * จุดขาย และปุ่ม CTA ของหน้าแลนดิ้งไว้ในกล่องขาวใต้แบนเนอร์ ซึ่งเป็นโครงเดียวกับ
 * กล่อง "สอบถามราคา" ของหน้าสินค้า
 *
 * ข้อความทุกช่องมาจาก hero ของ src/data/*-lp.ts (ลูกค้าแก้ได้จากหลังบ้าน) ส่วนรูป
 * แบนเนอร์/ถังสี และป้ายบนแบนเนอร์เป็นของแต่ละหน้ากำหนดมา
 */
export type LpHeroCopy = {
  eyebrow: string;
  title: string;
  titleAccent: string;
  description: string;
  points: string[];
  proof: string;
};

export type LpHeroCta = { href: string; label: string; cta: string };

export default function LpHero({
  hero,
  banner,
  cutout,
  cutoutPair,
  badges,
  quoteLabel,
  secondary,
  telHref,
  lineHref,
  phone,
  lineId,
}: {
  hero: LpHeroCopy;
  banner: string;
  cutout?: string;
  /** cutout เป็นไฟล์ถังคู่ — ดู HeroBanner */
  cutoutPair?: boolean;
  badges: string[];
  /** ข้อความปุ่มหลักที่พาไปฟอร์ม #quote — แต่ละหน้าใช้คำต่างกัน */
  quoteLabel: string;
  /** ปุ่มที่สอง ค่าเริ่มต้นคือปุ่มโทร บางหน้าใช้พาไปส่วนอื่นในหน้าแทน */
  secondary?: LpHeroCta;
  telHref: string;
  lineHref: string;
  phone: string;
  lineId: string;
}) {
  const second: LpHeroCta = secondary ?? {
    href: telHref,
    label: `โทร ${phone}`,
    cta: "hero-call",
  };

  return (
    <>
      {/* pt เผื่อความสูงของ LpHeader ที่เป็น fixed (4.5rem / 4.75rem) */}
      <section className="bg-white pt-[5.75rem] lg:pt-[6.5rem]">
        <Wrap>
          <HeroBanner
            banner={banner}
            cutout={cutout}
            cutoutPair={cutoutPair}
            eyebrow={hero.eyebrow}
            title={hero.title}
            tagline={hero.titleAccent}
            badges={badges}
          />
        </Wrap>
      </section>

      <section className="bg-white pt-6 pb-4 lg:pt-8 lg:pb-6">
        <Wrap>
          <div className="grid gap-7 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm shadow-brand-900/5 lg:grid-cols-[1.2fr_0.8fr] lg:items-center lg:gap-12 lg:p-8">
            <div>
              <p className="text-base leading-relaxed text-slate-600 sm:text-[1.06rem]">
                {hero.description}
              </p>
              <ul className="mt-5 grid gap-2.5 sm:grid-cols-2">
                {hero.points.map((p) => (
                  <li key={p} className="flex gap-2.5 text-[0.98rem] leading-snug text-brand-900">
                    <Check />
                    {p}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              {/* จอเล็กเรียงเป็นแถวเดียว จอกลางเรียงข้างกัน จอใหญ่กลับมาซ้อนเป็นคอลัมน์ขวา */}
              <div className="flex flex-col gap-2.5 sm:flex-row sm:flex-wrap lg:flex-col">
                <a
                  href="#quote"
                  data-cta="hero-quote"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-brand-700 px-7 py-3.5 text-[1.02rem] font-semibold text-white shadow-lg shadow-brand-900/20 transition hover:bg-accent-600 active:scale-[0.98]"
                >
                  {quoteLabel}
                  <Icon.arrow />
                </a>
                <a
                  href={second.href}
                  data-cta={second.cta}
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-7 py-3.5 text-[1.02rem] font-semibold whitespace-nowrap text-brand-800 ring-1 ring-inset ring-brand-200 transition hover:bg-brand-50 active:scale-[0.98]"
                >
                  {second.cta === "hero-call" && <Icon.phone />}
                  {second.label}
                </a>
                <a
                  href={lineHref}
                  target="_blank"
                  rel="noreferrer"
                  data-cta="hero-line"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-[#06C755] px-7 py-3.5 text-[1.02rem] font-semibold text-white shadow-lg shadow-[#06C755]/25 transition hover:bg-[#05b34c] active:scale-[0.98]"
                >
                  <Icon.line />
                  แอดไลน์ {lineId}
                </a>
              </div>
              <p className="mt-4 text-center text-[0.88rem] leading-relaxed text-slate-500 lg:text-left">
                {hero.proof}
              </p>
            </div>
          </div>
        </Wrap>
      </section>
    </>
  );
}
