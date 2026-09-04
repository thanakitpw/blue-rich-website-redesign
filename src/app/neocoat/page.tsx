import type { Metadata } from "next";
import Image from "next/image";
import LpHeader from "@/components/landing/LpHeader";
import LpStickyCta from "@/components/landing/LpStickyCta";
import LpQuoteForm from "@/components/landing/LpQuoteForm";
import LpFaq from "@/components/landing/LpFaq";
import LpFooter from "@/components/landing/LpFooter";
import { Check, Wrap } from "@/components/landing/kit";
import Reveal from "@/components/ui/Reveal";
import { Icon } from "@/components/ui";
import {
  advantages,
  calculation,
  documents,
  faqs,
  formulas,
  galleryImages,
  hero,
  legal,
  mechanism,
  process,
  productSpecs,
  related,
  navSections,
  quoteForm,
  reviews,
  risk,
  system,
} from "@/data/fire-paint-lp";
import { bundleFor } from "@/data/site";
import { getSiteInfo, getStandards } from "@/lib/cms/content";

/**
 * Paid-traffic landing page. Kept out of the (site) route group so it renders
 * without the main navigation, and out of the sitemap + search index so it does
 * not compete with /products/neocoat-intumescent-paint for the same keywords.
 * Flip `robots` below if this page is ever meant to rank organically too.
 */
export async function generateMetadata(): Promise<Metadata> {
  const site = await getSiteInfo();
  return {
    title: "สีกันไฟโครงสร้างเหล็ก ทนไฟสูงสุด 3 ชม. | ขอใบเสนอราคาฟรี",
    description:
      "สีกันไฟ Neocoat Intumescent Paint สำหรับโครงสร้างเหล็ก ผ่าน ASTM E-119 และ ISO 834 พร้อมเอกสารรับรองโดยวุฒิวิศวกร แบบ น.4-5 / น.4-9 ทีมวิศวกรคำนวณความหนาฟิล์มและเสนอราคาให้ฟรีภายใน 1-2 วันทำการ",
    // noindex on its own — pairing it with a canonical pointing elsewhere sends
    // conflicting signals. Links out are still followed.
    robots: { index: false, follow: true },
    openGraph: {
      type: "website",
      locale: "th_TH",
      siteName: site.shortName,
      title: "สีกันไฟโครงสร้างเหล็ก ทนไฟสูงสุด 3 ชั่วโมง พร้อมเอกสารรับรองวุฒิวิศวกร",
      description:
        "ผ่าน ASTM E-119 (จุฬาฯ) และ ISO 834 ครบทั้งระบบตั้งแต่สีรองพื้นกันสนิมจนถึงเอกสารยื่นราชการ ขอใบเสนอราคาฟรี",
      images: ["/assets/banner-fireproof.jpg"],
    },
  };
}

const iconMap = {
  doc: Icon.doc,
  shield: Icon.shield,
  users: Icon.users,
  truck: Icon.truck,
  flame: Icon.flame,
  phone: Icon.phone,
};

export default async function FireRetardantPaintLanding() {
  const [info, standards] = await Promise.all([getSiteInfo(), getStandards()]);
  const { site, telHref, lineHref, mailHref } = bundleFor(info, []);

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "Product",
      name: "สีกันไฟ – สีทนไฟ Neocoat Intumescent Paint",
      sku: "A014",
      category: "สีกันไฟโครงสร้างเหล็ก",
      description:
        "สีกันไฟชนิดพองตัวสำหรับโครงสร้างเหล็ก ทนไฟสูงสุด 3 ชั่วโมง ผ่านการทดสอบ ASTM E-119 และ ISO 834 พร้อมเอกสารรับรองโดยวุฒิวิศวกรโยธา",
      image: `${site.url}/assets/product-neocoat-intumescent.jpg`,
      brand: { "@type": "Brand", name: "Neocoat" },
      offers: {
        "@type": "Offer",
        availability: "https://schema.org/InStock",
        priceCurrency: "THB",
        url: `${site.url}/neocoat`,
        seller: { "@type": "Organization", name: site.name },
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faqs.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    },
  ];

  return (
    <>
      <LpHeader sections={navSections} />

      <main>
        {/* ------------------------------------------------------------- Hero */}
        <section className="relative overflow-hidden bg-brand-950 pt-28 pb-16 sm:pt-32 lg:pt-36 lg:pb-24">
          <div
            aria-hidden
            className="absolute inset-0 bg-[radial-gradient(60rem_32rem_at_12%_-10%,var(--color-brand-700),transparent),radial-gradient(44rem_26rem_at_100%_20%,var(--color-brand-800),transparent)]"
          />
          <div
            aria-hidden
            className="absolute -top-24 right-[-6rem] size-72 rotate-45 rounded-[28%] border border-white/10"
          />

          <Wrap className="relative">
            <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14">
              <div>
                <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-1.5 text-xs font-semibold tracking-wide text-brand-100 ring-1 ring-inset ring-white/20">
                  <Icon.flame className="size-4 text-accent-400" />
                  {hero.eyebrow}
                </span>

                <h1 className="mt-5 text-[2.1rem] leading-[1.18] text-white sm:text-5xl lg:text-[3.3rem]">
                  {hero.title}
                  <span className="mt-2 block bg-gradient-to-br from-brand-200 via-brand-100 to-white bg-clip-text text-transparent">
                    {hero.titleAccent}
                  </span>
                </h1>

                <p className="mt-5 max-w-xl text-base leading-relaxed text-brand-100/80 sm:text-[1.06rem]">
                  {hero.description}
                </p>

                <ul className="mt-7 grid gap-2.5">
                  {hero.points.map((p) => (
                    <li key={p} className="flex gap-3 text-[1.02rem] text-brand-50">
                      <Check />
                      {p}
                    </li>
                  ))}
                </ul>

                <div className="mt-9 flex flex-wrap gap-3">
                  <a
                    href="#quote"
                    data-cta="hero-quote"
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-7 py-3.5 text-[1.02rem] font-semibold text-brand-800 shadow-xl shadow-brand-950/30 transition hover:bg-brand-50 active:scale-[0.98]"
                  >
                    ขอใบเสนอราคาฟรี
                    <Icon.arrow />
                  </a>
                  <a
                    href={telHref}
                    data-cta="hero-call"
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-brand-600 px-7 py-3.5 text-[1.02rem] font-semibold text-white shadow-xl shadow-brand-950/30 transition hover:bg-accent-600 active:scale-[0.98]"
                  >
                    <Icon.phone />
                    โทร {site.phones[0]}
                  </a>
                  <a
                    href={lineHref}
                    target="_blank"
                    rel="noreferrer"
                    data-cta="hero-line"
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-[#06C755] px-7 py-3.5 text-[1.02rem] font-semibold text-white shadow-xl shadow-[#06C755]/25 transition hover:bg-[#05b34c] active:scale-[0.98]"
                  >
                    <Icon.line />
                    แอดไลน์ @{site.lineId}
                  </a>
                </div>

                <p className="mt-6 text-[0.9rem] text-brand-200/70">{hero.proof}</p>
              </div>

              <div className="relative">
                <div className="overflow-hidden rounded-4xl shadow-2xl shadow-brand-950/50 ring-1 ring-white/10">
                  <Image
                    src="/assets/banner-fireproof.jpg"
                    alt="งานสีกันไฟเคลือบผิวโครงสร้างเหล็ก Fire Proof Steel Structure"
                    width={1200}
                    height={1200}
                    priority
                    sizes="(min-width: 1024px) 45vw, 92vw"
                    className="h-auto w-full"
                  />
                </div>

                <div className="absolute -bottom-5 -left-3 hidden rounded-3xl bg-white p-4 shadow-2xl shadow-brand-950/30 sm:block">
                  <div className="flex items-center gap-3.5">
                    <Image
                      src="/assets/product-neocoat-intumescent.jpg"
                      alt=""
                      width={80}
                      height={120}
                      className="h-14 w-auto"
                    />
                    <div>
                      <p className="font-display text-sm font-semibold text-brand-700">
                        Solvent &amp; Water Base
                      </p>
                      <p className="text-xs text-slate-500">เฉดสีขาว และสีเทา · รหัส A014</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Wrap>
        </section>

        {/* -------------------------------------------------- Standards strip */}
        <section className="border-b border-slate-100 bg-white py-6">
          <div className="mask-fade-x overflow-hidden">
            <div className="flex w-max animate-marquee gap-4">
              {[0, 1].map((dup) => (
                <div key={dup} className="flex shrink-0 gap-4" aria-hidden={dup === 1}>
                  {standards.map((s) => (
                    <div
                      key={s.label}
                      className="flex items-center gap-3 rounded-2xl bg-brand-50/70 px-5 py-3 ring-1 ring-inset ring-brand-100"
                    >
                      <Icon.shield className="size-5 shrink-0 text-brand-500" />
                      <span>
                        <span className="block font-display text-sm font-semibold text-brand-700">
                          {s.label}
                        </span>
                        <span className="block text-[0.78rem] whitespace-nowrap text-slate-500">
                          {s.note}
                        </span>
                      </span>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* -------------------------------------------------------- Why / risk */}
        <section id="why" className="py-20 lg:py-24">
          <Wrap>
            <Reveal className="mx-auto max-w-3xl text-center">
              <span className="inline-flex items-center gap-2 rounded-full bg-accent-500/10 px-3.5 py-1.5 text-xs font-semibold text-accent-600 ring-1 ring-inset ring-accent-500/20">
                <Icon.flame className="size-4" />
                {risk.eyebrow}
              </span>
              <h2 className="mt-4 text-3xl leading-[1.25] sm:text-4xl lg:text-[2.6rem]">
                {risk.title}
              </h2>
              <p className="mt-5 text-base leading-relaxed text-slate-600 sm:text-[1.12rem]">
                {risk.lead}
              </p>
            </Reveal>

            <div className="mt-12 grid gap-5 md:grid-cols-3">
              {risk.facts.map((f, i) => (
                <Reveal key={f.label} delay={i * 90}>
                  <div className="h-full rounded-3xl bg-white p-7 text-center ring-1 ring-slate-200/80">
                    <p className="font-display text-4xl font-bold text-accent-600 lg:text-[2.75rem]">
                      {f.value}
                    </p>
                    <p className="mt-3 font-display font-semibold text-brand-950">{f.label}</p>
                    <p className="mt-2 text-sm leading-relaxed text-slate-500">{f.note}</p>
                  </div>
                </Reveal>
              ))}
            </div>

            <Reveal delay={160}>
              <p className="mx-auto mt-10 max-w-3xl rounded-3xl bg-brand-50/70 px-7 py-6 text-center text-[1.05rem] leading-relaxed text-slate-700 ring-1 ring-inset ring-brand-100">
                {risk.outro}
              </p>
            </Reveal>
          </Wrap>
        </section>

        {/* --------------------------------------------------------- Mechanism */}
        <section className="relative overflow-hidden bg-brand-950 py-20 lg:py-24">
          <div
            aria-hidden
            className="absolute inset-0 bg-[radial-gradient(56rem_28rem_at_80%_0%,var(--color-brand-800),transparent_65%)]"
          />
          <Wrap className="relative">
            <Reveal className="mx-auto max-w-3xl text-center">
              <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-1.5 text-xs font-semibold text-brand-100 ring-1 ring-inset ring-white/20">
                <span className="size-1.5 rounded-full bg-current" />
                {mechanism.eyebrow}
              </span>
              <h2 className="mt-4 text-3xl leading-[1.25] text-white sm:text-4xl lg:text-[2.6rem]">
                {mechanism.title}
              </h2>
              <p className="mt-5 text-base leading-relaxed text-brand-100/75 sm:text-[1.12rem]">
                {mechanism.description}
              </p>
            </Reveal>

            <ol className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {mechanism.steps.map((s, i) => (
                <Reveal key={s.step} delay={i * 90}>
                  <li className="relative h-full rounded-3xl bg-white/[0.05] p-7 ring-1 ring-inset ring-white/10">
                    <span className="font-display text-4xl font-bold text-brand-500/40">
                      {s.step}
                    </span>
                    <span className="mt-3 inline-flex rounded-full bg-accent-500/15 px-3 py-1 text-[0.78rem] font-semibold text-accent-400">
                      {s.temp}
                    </span>
                    <h3 className="mt-3 text-[1.12rem] text-white">{s.title}</h3>
                    <p className="mt-2.5 text-sm leading-relaxed text-brand-100/65">{s.text}</p>
                  </li>
                </Reveal>
              ))}
            </ol>
          </Wrap>
        </section>

        {/* ------------------------------------------------------ Legal ratings */}
        <section className="py-20 lg:py-24">
          <Wrap>
            <Reveal className="mx-auto max-w-3xl text-center">
              <span className="inline-flex items-center gap-2 rounded-full bg-brand-50 px-3.5 py-1.5 text-xs font-semibold text-brand-700 ring-1 ring-inset ring-brand-100">
                <span className="size-1.5 rounded-full bg-current" />
                {legal.eyebrow}
              </span>
              <h2 className="mt-4 text-3xl leading-[1.25] sm:text-4xl lg:text-[2.6rem]">
                {legal.title}
              </h2>
              <p className="mt-5 text-base leading-relaxed text-slate-600">{legal.description}</p>
            </Reveal>

            <Reveal delay={120}>
              <div className="mt-11 overflow-x-auto rounded-3xl ring-1 ring-slate-200">
                <table className="w-full min-w-[42rem] border-collapse text-left">
                  <thead>
                    <tr className="bg-brand-950 text-white">
                      <th className="px-6 py-4 font-display text-sm font-semibold">
                        ประเภทอาคาร
                      </th>
                      <th className="px-6 py-4 font-display text-sm font-semibold">
                        ส่วนที่ต้องป้องกัน
                      </th>
                      <th className="px-6 py-4 font-display text-sm font-semibold">
                        อัตราการทนไฟ
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {legal.rows.map((r, i) => (
                      <tr
                        key={r.type}
                        className={i % 2 ? "bg-brand-50/40" : "bg-white"}
                      >
                        <td className="px-6 py-4 align-top text-[1rem] font-medium text-brand-950">
                          {r.type}
                        </td>
                        <td className="px-6 py-4 align-top text-[1rem] text-slate-600">
                          {r.parts}
                        </td>
                        <td className="px-6 py-4 align-top text-[1rem] font-semibold text-brand-700">
                          {r.rating}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Reveal>

            <Reveal delay={180}>
              <div className="mt-6 flex flex-col items-center justify-between gap-4 rounded-3xl bg-brand-50/70 px-7 py-6 ring-1 ring-inset ring-brand-100 sm:flex-row">
                <p className="text-[1.02rem] leading-relaxed text-slate-700">{legal.note}</p>
                <a
                  href="#quote"
                  data-cta="legal-quote"
                  className="inline-flex shrink-0 items-center gap-2 rounded-full bg-brand-700 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-brand-900/20 transition hover:bg-accent-600 active:scale-[0.98]"
                >
                  ส่งแบบให้ประเมิน
                  <Icon.arrow />
                </a>
              </div>
            </Reveal>
          </Wrap>
        </section>

        {/* ----------------------------------------------------------- Product */}
        <section id="product" className="bg-slate-50 py-20 lg:py-24">
          <Wrap>
            <Reveal className="mx-auto max-w-3xl text-center">
              <span className="inline-flex items-center gap-2 rounded-full bg-brand-50 px-3.5 py-1.5 text-xs font-semibold text-brand-700 ring-1 ring-inset ring-brand-100">
                <span className="size-1.5 rounded-full bg-current" />
                ข้อมูลผลิตภัณฑ์
              </span>
              <h2 className="mt-4 text-3xl leading-[1.25] sm:text-4xl lg:text-[2.6rem]">
                สีกันไฟ Neocoat Intumescent Paint
              </h2>
              <p className="mt-5 text-base leading-relaxed text-slate-600">
                สเปกโดยสรุปของผลิตภัณฑ์ที่เราจำหน่าย
                ค่าที่ขึ้นกับการคำนวณจริงของแต่ละโครงการระบุไว้เป็นค่าโดยทั่วไป
                ทีมวิศวกรจะคำนวณค่าที่ใช้จริงให้เมื่อได้รับแบบ
              </p>
            </Reveal>

            <div className="mt-12 grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:gap-12">
              <Reveal>
                <div className="overflow-hidden rounded-4xl bg-white shadow-xl shadow-brand-950/10 ring-1 ring-slate-200">
                  <Image
                    src="/assets/product-neocoat-intumescent.jpg"
                    alt="สีกันไฟ สีทนไฟ Neocoat Intumescent Paint สำหรับโครงสร้างเหล็ก"
                    width={900}
                    height={1200}
                    sizes="(min-width: 1024px) 36vw, 92vw"
                    className="h-auto w-full"
                  />
                </div>
              </Reveal>

              <Reveal delay={120}>
                <dl className="grid gap-px overflow-hidden rounded-3xl bg-slate-200 ring-1 ring-slate-200 sm:grid-cols-2">
                  {productSpecs.map((s) => (
                    <div key={s.label} className="bg-white px-6 py-4">
                      <dt className="text-xs font-semibold tracking-wide text-slate-400">
                        {s.label}
                      </dt>
                      <dd className="mt-1 text-[1.02rem] font-medium text-brand-950">
                        {s.value}
                      </dd>
                    </div>
                  ))}
                </dl>
              </Reveal>
            </div>

            <div className="mt-8 grid gap-5 md:grid-cols-2">
              {formulas.map((f, i) => (
                <Reveal key={f.name} delay={i * 100}>
                  <div className="h-full rounded-3xl bg-white p-7 ring-1 ring-slate-200/80">
                    <div className="flex flex-wrap items-center gap-3">
                      <h3 className="text-xl">{f.name}</h3>
                      <span className="rounded-full bg-brand-50 px-3 py-1 text-[0.78rem] font-semibold text-brand-700 ring-1 ring-inset ring-brand-100">
                        {f.tag}
                      </span>
                    </div>
                    <ul className="mt-5 grid gap-2.5">
                      {f.points.map((p) => (
                        <li key={p} className="flex gap-3 text-[0.93rem] text-slate-600">
                          <Check />
                          {p}
                        </li>
                      ))}
                    </ul>
                  </div>
                </Reveal>
              ))}
            </div>
          </Wrap>
        </section>

        {/* ------------------------------------------------------ Coating system */}
        <section id="system" className="py-20 lg:py-24">
          <Wrap>
            <Reveal className="mx-auto max-w-3xl text-center">
              <span className="inline-flex items-center gap-2 rounded-full bg-brand-50 px-3.5 py-1.5 text-xs font-semibold text-brand-700 ring-1 ring-inset ring-brand-100">
                <span className="size-1.5 rounded-full bg-current" />
                {system.eyebrow}
              </span>
              <h2 className="mt-4 text-3xl leading-[1.25] sm:text-4xl lg:text-[2.6rem]">
                {system.title}
              </h2>
              <p className="mt-5 text-base leading-relaxed text-slate-600">
                {system.description}
              </p>
            </Reveal>

            <div className="mt-12 grid gap-5 lg:grid-cols-3">
              {system.layers.map((l, i) => (
                <Reveal key={l.step} delay={i * 100}>
                  <div className="relative h-full rounded-3xl bg-white p-7 ring-1 ring-slate-200/80 transition hover:shadow-[0_24px_48px_-28px_rgba(12,36,56,0.3)] hover:ring-brand-300">
                    <span className="inline-flex rounded-full bg-brand-600 px-3.5 py-1 text-[0.78rem] font-semibold text-white">
                      {l.step}
                    </span>
                    <h3 className="mt-4 text-xl">{l.name}</h3>
                    <p className="mt-1 font-display text-sm font-semibold text-brand-600">
                      {l.product}
                    </p>
                    <p className="mt-3.5 text-[0.93rem] leading-relaxed text-slate-600">
                      {l.detail}
                    </p>
                    <p className="mt-5 rounded-2xl bg-slate-50 px-4 py-3 text-[0.9rem] text-slate-500 ring-1 ring-inset ring-slate-100">
                      ความหนา : {l.thickness}
                    </p>
                  </div>
                </Reveal>
              ))}
            </div>
          </Wrap>
        </section>

        {/* -------------------------------------------------------- Calculation */}
        <section className="bg-slate-50 py-20 lg:py-24">
          <Wrap>
            <div className="grid items-start gap-12 lg:grid-cols-2 lg:gap-16">
              <Reveal>
                <span className="inline-flex items-center gap-2 rounded-full bg-brand-50 px-3.5 py-1.5 text-xs font-semibold text-brand-700 ring-1 ring-inset ring-brand-100">
                  <span className="size-1.5 rounded-full bg-current" />
                  {calculation.eyebrow}
                </span>
                <h2 className="mt-4 text-3xl leading-[1.25] sm:text-4xl lg:text-[2.5rem]">
                  {calculation.title}
                </h2>
                <p className="mt-5 text-base leading-relaxed text-slate-600">
                  {calculation.description}
                </p>

                <div className="mt-8 rounded-3xl bg-brand-950 p-7 text-brand-100/85">
                  <p className="text-[1.02rem] leading-relaxed">{calculation.cta}</p>
                  <a
                    href="#quote"
                    data-cta="calc-quote"
                    className="mt-6 inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-brand-800 transition hover:bg-brand-50 active:scale-[0.98]"
                  >
                    ส่งรายการเหล็กให้คำนวณฟรี
                    <Icon.arrow />
                  </a>
                </div>
              </Reveal>

              <Reveal delay={120}>
                <ul className="grid gap-4">
                  {calculation.factors.map((f, i) => (
                    <li
                      key={f.title}
                      className="flex gap-5 rounded-3xl bg-white p-6 ring-1 ring-slate-200/80"
                    >
                      <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-brand-50 font-display font-bold text-brand-600">
                        {i + 1}
                      </span>
                      <span>
                        <span className="block font-display font-semibold text-brand-950">
                          {f.title}
                        </span>
                        <span className="mt-1.5 block text-[1rem] leading-relaxed text-slate-600">
                          {f.text}
                        </span>
                      </span>
                    </li>
                  ))}
                </ul>
              </Reveal>
            </div>
          </Wrap>
        </section>

        {/* ---------------------------------------------------------- Documents */}
        <section id="documents" className="py-20 lg:py-24">
          <Wrap>
            <div className="grid items-center gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
              <Reveal>
                <div className="overflow-hidden rounded-4xl shadow-2xl shadow-brand-950/15 ring-1 ring-slate-200">
                  <Image
                    src="/assets/cert-documents.jpg"
                    alt="เอกสารรับรองงานสีกันไฟโครงสร้างเหล็กโดยวุฒิวิศวกร"
                    width={1200}
                    height={1200}
                    sizes="(min-width: 1024px) 42vw, 92vw"
                    className="h-auto w-full"
                  />
                </div>
              </Reveal>

              <Reveal delay={120}>
                <span className="inline-flex items-center gap-2 rounded-full bg-brand-50 px-3.5 py-1.5 text-xs font-semibold text-brand-700 ring-1 ring-inset ring-brand-100">
                  <span className="size-1.5 rounded-full bg-current" />
                  {documents.eyebrow}
                </span>
                <h2 className="mt-4 text-3xl leading-[1.25] sm:text-4xl lg:text-[2.5rem]">
                  {documents.title}
                </h2>
                <p className="mt-5 text-base leading-relaxed text-slate-600">
                  {documents.description}
                </p>

                <ul className="mt-8 grid gap-3">
                  {documents.items.map((d) => (
                    <li
                      key={d.title}
                      className="flex gap-4 rounded-2xl bg-brand-50/70 px-5 py-4 ring-1 ring-inset ring-brand-100"
                    >
                      <Icon.doc className="mt-0.5 size-5 shrink-0 text-brand-600" />
                      <span>
                        <span className="block text-[1.02rem] font-semibold text-brand-950">
                          {d.title}
                        </span>
                        <span className="mt-1 block text-[0.96rem] leading-relaxed text-slate-600">
                          {d.text}
                        </span>
                      </span>
                    </li>
                  ))}
                </ul>
              </Reveal>
            </div>
          </Wrap>
        </section>

        {/* --------------------------------------------------------- Advantages */}
        <section className="relative overflow-hidden bg-brand-950 py-20 lg:py-24">
          <div
            aria-hidden
            className="absolute inset-0 bg-[radial-gradient(56rem_28rem_at_20%_0%,var(--color-brand-800),transparent_65%)]"
          />
          <Wrap className="relative">
            <Reveal className="mx-auto max-w-3xl text-center">
              <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-1.5 text-xs font-semibold text-brand-100 ring-1 ring-inset ring-white/20">
                <span className="size-1.5 rounded-full bg-current" />
                ทำไมต้องซื้อกับ Blue Rich
              </span>
              <h2 className="mt-4 text-3xl leading-[1.25] text-white sm:text-4xl lg:text-[2.6rem]">
                ขายสีอย่างเดียวใครก็ทำได้ แต่งานต้องผ่านการตรวจรับด้วย
              </h2>
              <p className="mt-5 text-base leading-relaxed text-brand-100/75">
                เราดูแลตั้งแต่การอ่านแบบ คำนวณความหนา เลือกระบบสี ควบคุมคุณภาพหน้างาน
                จนถึงเอกสารรับรองที่ยื่นหน่วยงานได้จริง
              </p>
            </Reveal>

            <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {advantages.map((a, i) => {
                const IconComp = iconMap[a.icon];
                return (
                  <Reveal key={a.title} delay={i * 80}>
                    <div className="h-full rounded-3xl bg-white/[0.04] p-7 ring-1 ring-inset ring-white/10 transition hover:bg-white/[0.07]">
                      <span className="grid size-12 place-items-center rounded-2xl bg-brand-500/15 text-brand-300">
                        <IconComp className="size-6" />
                      </span>
                      <h3 className="mt-5 text-lg text-white">{a.title}</h3>
                      <p className="mt-3 text-sm leading-relaxed text-brand-100/65">{a.text}</p>
                    </div>
                  </Reveal>
                );
              })}
            </div>
          </Wrap>
        </section>

        {/* ------------------------------------------------------------ Process */}
        <section className="py-20 lg:py-24">
          <Wrap>
            <Reveal className="mx-auto max-w-3xl text-center">
              <span className="inline-flex items-center gap-2 rounded-full bg-brand-50 px-3.5 py-1.5 text-xs font-semibold text-brand-700 ring-1 ring-inset ring-brand-100">
                <span className="size-1.5 rounded-full bg-current" />
                ขั้นตอนการทำงาน
              </span>
              <h2 className="mt-4 text-3xl leading-[1.25] sm:text-4xl lg:text-[2.6rem]">
                จากส่งแบบถึงเอกสารรับรอง ใน 4 ขั้นตอน
              </h2>
            </Reveal>

            <ol className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {process.map((p, i) => (
                <Reveal key={p.step} delay={i * 90}>
                  <li className="relative h-full rounded-3xl bg-white p-7 ring-1 ring-slate-200/80 transition hover:shadow-[0_24px_48px_-28px_rgba(12,36,56,0.3)] hover:ring-brand-300">
                    <span className="font-display text-5xl font-bold text-brand-100">
                      {p.step}
                    </span>
                    <h3 className="mt-3 text-lg">{p.title}</h3>
                    <p className="mt-2.5 text-sm leading-relaxed text-slate-500">{p.text}</p>
                    <p className="mt-5 inline-flex items-center gap-2 rounded-full bg-brand-50 px-3.5 py-1.5 text-[0.75rem] font-semibold text-brand-700">
                      <Icon.clock className="size-3.5" />
                      {p.duration}
                    </p>
                    {i < process.length - 1 && (
                      <span
                        aria-hidden
                        className="absolute top-1/2 -right-3 hidden size-6 place-items-center rounded-full bg-brand-500 text-white lg:grid"
                      >
                        <Icon.arrow className="size-3.5" />
                      </span>
                    )}
                  </li>
                </Reveal>
              ))}
            </ol>
          </Wrap>
        </section>

        {/* ------------------------------------------------------------ Gallery */}
        <section className="bg-slate-50 py-20 lg:py-24">
          <Wrap>
            <Reveal className="mx-auto max-w-3xl text-center">
              <span className="inline-flex items-center gap-2 rounded-full bg-brand-50 px-3.5 py-1.5 text-xs font-semibold text-brand-700 ring-1 ring-inset ring-brand-100">
                <span className="size-1.5 rounded-full bg-current" />
                ผลงานจริง
              </span>
              <h2 className="mt-4 text-3xl leading-[1.25] sm:text-4xl lg:text-[2.6rem]">
                ภาพหน้างานจากโครงการที่ใช้ระบบ Neocoat
              </h2>
              <p className="mt-5 text-base leading-relaxed text-slate-600">
                โครงสร้างเหล็กโรงงาน โครงหลังคาช่วงกว้าง คานและเสาเหล็กรูปพรรณ
                ทั้งงานในโรงประกอบและงานหน้าไซต์
              </p>
            </Reveal>

            <div className="mt-12 grid grid-cols-2 gap-4 lg:grid-cols-4">
              {galleryImages.map((g, i) => (
                <Reveal key={g.src} delay={i * 60}>
                  <figure className="group overflow-hidden rounded-2xl bg-slate-200">
                    <div className="relative aspect-4/3">
                      <Image
                        src={g.src}
                        alt={g.alt}
                        fill
                        sizes="(min-width: 1024px) 25vw, 45vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                  </figure>
                </Reveal>
              ))}
            </div>
          </Wrap>
        </section>

        {/* ------------------------------------------------------------ Reviews */}
        <section className="py-20 lg:py-24">
          <Wrap>
            <Reveal className="mx-auto max-w-3xl text-center">
              <span className="inline-flex items-center gap-2 rounded-full bg-brand-50 px-3.5 py-1.5 text-xs font-semibold text-brand-700 ring-1 ring-inset ring-brand-100">
                <span className="size-1.5 rounded-full bg-current" />
                เสียงจากลูกค้า
              </span>
              <h2 className="mt-4 text-3xl leading-[1.25] sm:text-4xl lg:text-[2.6rem]">
                รีวิวจากผู้รับเหมาและเจ้าของโครงการ
              </h2>
            </Reveal>

            <div className="mt-12 grid gap-5 md:grid-cols-3">
              {reviews.map((r, i) => (
                <Reveal key={r.name} delay={i * 90}>
                  <figure className="flex h-full flex-col rounded-3xl bg-white p-7 ring-1 ring-slate-200/80">
                    <Icon.quote className="text-brand-200" />
                    <blockquote className="mt-4 flex-1 text-[1.02rem] leading-relaxed text-slate-600">
                      {r.text}
                    </blockquote>
                    <figcaption className="mt-6 flex items-center gap-3 border-t border-slate-100 pt-5">
                      <span className="grid size-11 place-items-center rounded-full bg-brand-600 font-display font-semibold text-white">
                        {r.name.replace("คุณ", "").charAt(0)}
                      </span>
                      <span>
                        <span className="block font-display font-semibold text-brand-700">
                          {r.name}
                        </span>
                        <span className="block text-xs text-slate-500">{r.role}</span>
                      </span>
                    </figcaption>
                  </figure>
                </Reveal>
              ))}
            </div>
          </Wrap>
        </section>

        {/* ------------------------------------------------------------ Related */}
        <section className="bg-slate-50 py-20 lg:py-24">
          <Wrap>
            <Reveal className="mx-auto max-w-3xl text-center">
              <span className="inline-flex items-center gap-2 rounded-full bg-brand-50 px-3.5 py-1.5 text-xs font-semibold text-brand-700 ring-1 ring-inset ring-brand-100">
                <span className="size-1.5 rounded-full bg-current" />
                สั่งครบจบที่เดียว
              </span>
              <h2 className="mt-4 text-3xl leading-[1.25] sm:text-4xl lg:text-[2.6rem]">
                วัสดุอื่นที่งานโครงสร้างเหล็กต้องใช้ เรามีครบ
              </h2>
              <p className="mt-5 text-base leading-relaxed text-slate-600">
                สั่งพร้อมกันในใบเดียว ส่งพร้อมกันรอบเดียว ไม่ต้องเสียเวลาหาหลายเจ้า
              </p>
            </Reveal>

            <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {related.map((r, i) => (
                <Reveal key={r.name} delay={i * 80}>
                  <div className="flex h-full flex-col overflow-hidden rounded-3xl bg-white ring-1 ring-slate-200/80">
                    <div className="relative aspect-4/3 bg-slate-100">
                      <Image
                        src={r.image}
                        alt={r.name}
                        fill
                        sizes="(min-width: 1024px) 25vw, 45vw"
                        className="object-cover"
                      />
                    </div>
                    <div className="flex flex-1 flex-col p-6">
                      <span className="text-[0.78rem] font-semibold tracking-wide text-brand-500">
                        {r.role}
                      </span>
                      <h3 className="mt-1.5 text-[1.12rem]">{r.name}</h3>
                      <p className="mt-2 text-sm leading-relaxed text-slate-500">{r.text}</p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </Wrap>
        </section>

        {/* ---------------------------------------------------------------- FAQ */}
        <section id="faq" className="py-20 lg:py-24">
          <Wrap>
            <Reveal className="mx-auto max-w-3xl text-center">
              <span className="inline-flex items-center gap-2 rounded-full bg-brand-50 px-3.5 py-1.5 text-xs font-semibold text-brand-700 ring-1 ring-inset ring-brand-100">
                <span className="size-1.5 rounded-full bg-current" />
                คำถามที่พบบ่อย
              </span>
              <h2 className="mt-4 text-3xl leading-[1.25] sm:text-4xl lg:text-[2.6rem]">
                เรื่องที่ลูกค้าถามก่อนตัดสินใจมากที่สุด
              </h2>
            </Reveal>

            <div className="mx-auto mt-12 max-w-3xl">
              <LpFaq items={faqs} />
            </div>

            <Reveal delay={140}>
              <p className="mt-10 text-center text-[1.02rem] text-slate-600">
                ยังไม่เจอคำตอบที่ต้องการ?{" "}
                <a
                  href={telHref}
                  data-cta="faq-call"
                  className="font-semibold text-brand-700 underline underline-offset-4 hover:text-brand-800"
                >
                  โทรถามทีมวิศวกรได้เลยที่ {site.phones[0]}
                </a>
              </p>
            </Reveal>
          </Wrap>
        </section>

        {/* -------------------------------------------------------------- Quote */}
        <section id="quote" className="relative overflow-hidden bg-brand-950 py-20 lg:py-24">
          <div
            aria-hidden
            className="absolute inset-0 bg-[radial-gradient(50rem_26rem_at_50%_0%,var(--color-brand-800),transparent_70%)]"
          />
          <div
            aria-hidden
            className="absolute -bottom-24 -left-16 size-72 rotate-45 rounded-[26%] border border-white/10"
          />
          <Wrap className="relative">
            <div className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:gap-14">
              <div>
                <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-1.5 text-xs font-semibold text-brand-100 ring-1 ring-inset ring-white/20">
                  <span className="size-1.5 rounded-full bg-current" />
                  ขอใบเสนอราคา
                </span>
                <h2 className="mt-4 text-3xl leading-[1.2] text-white sm:text-4xl lg:text-[2.6rem]">
                  ส่งแบบมาวันนี้ ได้ราคาพร้อมรายการคำนวณภายใน 1–2 วันทำการ
                </h2>
                <p className="mt-5 text-base leading-relaxed text-brand-100/75">
                  กรอกข้อมูลเท่าที่มี ไม่ต้องครบก็ได้ ทีมวิศวกรจะโทรกลับไปคุยรายละเอียดกับคุณเอง
                  หรือถ้าสะดวกคุยเลย โทรหรือแอดไลน์หาเราได้ทันที
                </p>

                <div className="mt-9 grid gap-3">
                  <a
                    href={telHref}
                    data-cta="quote-call"
                    className="flex items-center gap-4 rounded-3xl bg-white/[0.06] p-5 ring-1 ring-inset ring-white/10 transition hover:bg-white/[0.1]"
                  >
                    <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-brand-500/20 text-brand-200">
                      <Icon.phone className="size-5" />
                    </span>
                    <span>
                      <span className="block text-xs text-brand-200/70">โทรหาฝ่ายขาย</span>
                      <span className="block font-display font-semibold text-white">
                        {site.phones.join(" · ")}
                      </span>
                    </span>
                  </a>

                  <a
                    href={lineHref}
                    target="_blank"
                    rel="noreferrer"
                    data-cta="quote-line"
                    className="flex items-center gap-4 rounded-3xl bg-white/[0.06] p-5 ring-1 ring-inset ring-white/10 transition hover:bg-white/[0.1]"
                  >
                    <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-[#06C755]/20 text-[#06C755]">
                      <Icon.line className="size-5" />
                    </span>
                    <span>
                      <span className="block text-xs text-brand-200/70">แชทกับทีมงาน</span>
                      <span className="block font-display font-semibold text-white">
                        LINE ID : {site.lineId}
                      </span>
                    </span>
                  </a>

                  <a
                    href={mailHref}
                    data-cta="quote-mail"
                    className="flex items-center gap-4 rounded-3xl bg-white/[0.06] p-5 ring-1 ring-inset ring-white/10 transition hover:bg-white/[0.1]"
                  >
                    <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-brand-500/20 text-brand-200">
                      <Icon.mail className="size-5" />
                    </span>
                    <span>
                      <span className="block text-xs text-brand-200/70">ส่งแบบทางอีเมล</span>
                      <span className="block font-display font-semibold text-white">
                        {site.email}
                      </span>
                    </span>
                  </a>

                  <div className="flex items-center gap-4 rounded-3xl bg-white/[0.06] p-5 ring-1 ring-inset ring-white/10">
                    <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-brand-500/20 text-brand-200">
                      <Icon.clock className="size-5" />
                    </span>
                    <span>
                      <span className="block text-xs text-brand-200/70">เวลาทำการ</span>
                      <span className="block font-display font-semibold text-white">
                        {site.hours}
                      </span>
                    </span>
                  </div>
                </div>
              </div>

              <div className="rounded-4xl bg-white p-6 shadow-2xl shadow-brand-950/40 sm:p-8">
                <h3 className="text-xl">กรอกข้อมูลเพื่อรับใบเสนอราคา</h3>
                <p className="mt-2 text-sm text-slate-500">
                  ฟรี ไม่มีค่าใช้จ่าย และไม่มีข้อผูกมัด
                </p>
                <div className="mt-6">
                  <LpQuoteForm config={quoteForm} />
                </div>
              </div>
            </div>
          </Wrap>
        </section>
      </main>

      <LpFooter note="ข้อมูลข้อกำหนดทางกฎหมายในหน้านี้เป็นการสรุปเพื่อใช้ตั้งต้นเท่านั้น กรุณายืนยันกับผู้ออกแบบอาคารและเจ้าพนักงานท้องถิ่นของโครงการอีกครั้ง" />

      <LpStickyCta />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </>
  );
}
