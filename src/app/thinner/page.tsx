import type { Metadata } from "next";
import Image from "next/image";
import LpHeader from "@/components/landing/LpHeader";
import LpStickyCta from "@/components/landing/LpStickyCta";
import LpQuoteForm from "@/components/landing/LpQuoteForm";
import LpFaq from "@/components/landing/LpFaq";
import LpFooter from "@/components/landing/LpFooter";
import { Check, DarkBand, Eyebrow, SectionHead, Wrap } from "@/components/landing/kit";
import Reveal from "@/components/ui/Reveal";
import { Icon } from "@/components/ui";
import {
  compare,
  difference,
  documents,
  faqs,
  hero,
  lineup,
  navSections,
  ordering,
  packs,
  quickFacts,
  quoteForm,
  safety,
} from "@/data/thinner-lp";
import { bundleFor } from "@/data/site";
import { getSiteInfo } from "@/lib/cms/content";

/**
 * Paid-traffic landing page for the solvent range. Sits outside the (site)
 * route group so it renders without the main navigation, and noindex so it does
 * not compete with /products/thinner-3a-intanin for the same keywords.
 *
 * Visually the counterpart to /neocoat: that page opens on a
 * navy engineering hero, this one opens light and product-forward, because the
 * traffic here is buying stock off a shelf rather than commissioning a system.
 */
export async function generateMetadata(): Promise<Metadata> {
  const site = await getSiteInfo();
  return {
    title: "ทินเนอร์ 3A · 2K · น้ำมันสนอินทนิล | ราคาส่ง พร้อมส่งทั่วประเทศ",
    description:
      "จำหน่ายทินเนอร์ AAA (3A) อินทนิล ทินเนอร์ 2K Centare และน้ำมันสนเชียงใหม่ ขนาด 9 / 15 / 150 กก. และแกลลอน 3.75 ลิตร ราคาตามจำนวน สต็อกพร้อมส่งทั่วประเทศ แจ้งชนิดและจำนวนเพื่อขอราคาได้ทันที",
    robots: { index: false, follow: true },
    openGraph: {
      type: "website",
      locale: "th_TH",
      siteName: site.shortName,
      title: "ทินเนอร์ 3A · 2K และน้ำมันสนอินทนิล สั่งยกลัง ราคาส่ง",
      description:
        "ตัวทำละลายสำหรับผสมสีน้ำมัน สีรองพื้น สีทับหน้า และสีพ่นอุตสาหกรรม ขนาด 9 / 15 / 150 กก. พร้อมส่งทั่วประเทศ",
      images: ["/assets/product-thinner.jpg"],
    },
  };
}

export default async function ThinnerLanding() {
  const info = await getSiteInfo();
  const { site, telHref, lineHref, mailHref } = bundleFor(info, []);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <>
      <LpHeader sections={navSections} />

      <main>
        {/* ------------------------------------------------------------- Hero */}
        <section className="relative overflow-hidden bg-gradient-to-b from-brand-50 via-brand-50/50 to-white pt-28 pb-16 sm:pt-32 lg:pt-36 lg:pb-20">
          <div
            aria-hidden
            className="absolute -top-28 -right-24 size-80 rotate-45 rounded-[26%] border border-brand-200/70"
          />
          <div
            aria-hidden
            className="absolute -bottom-32 -left-20 size-72 rotate-45 rounded-[26%] bg-brand-100/40"
          />

          <Wrap className="relative">
            <div className="grid items-center gap-12 lg:grid-cols-[1.02fr_0.98fr] lg:gap-12">
              <div>
                <Eyebrow>{hero.eyebrow}</Eyebrow>

                <h1 className="mt-5 text-[2.1rem] leading-[1.18] sm:text-5xl lg:text-[3.15rem]">
                  {hero.title}
                  <span className="mt-2 block text-gradient-brand">{hero.titleAccent}</span>
                </h1>

                <p className="mt-5 max-w-xl text-base leading-relaxed text-slate-600 sm:text-[1.06rem]">
                  {hero.description}
                </p>

                <ul className="mt-7 grid gap-2.5">
                  {hero.points.map((p) => (
                    <li key={p} className="flex gap-3 text-[1.02rem] text-slate-700">
                      <Check />
                      {p}
                    </li>
                  ))}
                </ul>

                <div className="mt-9 flex flex-wrap gap-3">
                  <a
                    href="#quote"
                    data-cta="hero-quote"
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-brand-700 px-7 py-3.5 text-[1.02rem] font-semibold text-white shadow-xl shadow-brand-900/20 transition hover:bg-accent-600 active:scale-[0.98]"
                  >
                    ขอราคาตามจำนวน
                    <Icon.arrow />
                  </a>
                  <a
                    href={telHref}
                    data-cta="hero-call"
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-7 py-3.5 text-[1.02rem] font-semibold text-brand-800 ring-1 ring-brand-200 transition hover:bg-brand-50 active:scale-[0.98]"
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

                <p className="mt-6 text-[0.9rem] text-slate-500">{hero.proof}</p>
              </div>

              {/* Product trio rather than one banner — the range is the pitch. */}
              <div className="grid grid-cols-3 items-end gap-3 sm:gap-4">
                {lineup.map((p, i) => (
                  <div
                    key={p.name}
                    className={`overflow-hidden rounded-3xl bg-white shadow-xl shadow-brand-900/10 ring-1 ring-slate-200/80 ${
                      i === 1 ? "sm:-mb-6" : ""
                    }`}
                  >
                    <div className="relative aspect-3/4">
                      <Image
                        src={p.image}
                        alt={p.alt}
                        fill
                        priority={i === 0}
                        sizes="(min-width: 1024px) 15vw, 30vw"
                        className="object-contain p-3"
                      />
                    </div>
                    <p className="border-t border-slate-100 px-3 py-2.5 text-center text-[0.78rem] font-semibold text-brand-800">
                      {p.tag}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </Wrap>
        </section>

        {/* ------------------------------------------------------- Quick facts */}
        <section className="border-y border-slate-100 bg-white py-7">
          <Wrap>
            <dl className="grid gap-4 sm:grid-cols-3">
              {quickFacts.map((f) => (
                <div
                  key={f.value}
                  className="flex items-center gap-4 rounded-2xl bg-brand-50/70 px-5 py-4 ring-1 ring-inset ring-brand-100"
                >
                  <dt className="font-display text-2xl font-bold text-brand-700">{f.value}</dt>
                  <dd className="text-[0.85rem] leading-snug text-slate-600">{f.label}</dd>
                </div>
              ))}
            </dl>
          </Wrap>
        </section>

        {/* ----------------------------------------------------------- Line-up */}
        <section id="lineup" className="py-20 lg:py-24">
          <Wrap>
            <SectionHead
              eyebrow="สินค้าในกลุ่ม"
              title="เลือกตัวทำละลายให้ตรงกับวิธีทาของคุณ"
              lead="สามตัวนี้ครอบคลุมงานสีน้ำมันเกือบทั้งหมดที่หน้างานเจอ ต่างกันที่ความเร็วในการระเหยและงานที่ผู้ผลิตออกแบบมาให้ใช้"
            />

            <div className="mt-12 grid gap-5 lg:grid-cols-3">
              {lineup.map((p, i) => (
                <Reveal key={p.name} delay={i * 90}>
                  <div className="flex h-full flex-col overflow-hidden rounded-4xl bg-white ring-1 ring-slate-200/80 transition hover:shadow-[0_28px_56px_-32px_rgba(12,36,56,0.35)] hover:ring-brand-300">
                    <div className="relative aspect-4/3 bg-slate-50">
                      <Image
                        src={p.image}
                        alt={p.alt}
                        fill
                        sizes="(min-width: 1024px) 32vw, 92vw"
                        className="object-contain p-6"
                      />
                      <span className="absolute top-4 left-4 rounded-full bg-brand-600 px-3 py-1 text-[0.78rem] font-semibold text-white">
                        {p.tag}
                      </span>
                    </div>

                    <div className="flex flex-1 flex-col p-7">
                      <h3 className="text-xl">{p.name}</h3>
                      <p className="mt-3 text-[0.93rem] leading-relaxed text-slate-600">
                        {p.summary}
                      </p>

                      <p className="mt-6 text-xs font-semibold tracking-wide text-slate-400">
                        เหมาะกับงาน
                      </p>
                      <ul className="mt-3 grid flex-1 gap-2.5">
                        {p.bestFor.map((b) => (
                          <li key={b} className="flex gap-3 text-[0.9rem] text-slate-600">
                            <Check />
                            {b}
                          </li>
                        ))}
                      </ul>

                      <dl className="mt-6 grid gap-px overflow-hidden rounded-2xl bg-slate-200 ring-1 ring-slate-200">
                        {p.specs.map((s) => (
                          <div
                            key={s.label}
                            className="flex justify-between gap-4 bg-white px-4 py-3"
                          >
                            <dt className="text-[0.88rem] text-slate-500">{s.label}</dt>
                            <dd className="text-[0.85rem] font-semibold text-brand-950">
                              {s.value}
                            </dd>
                          </div>
                        ))}
                      </dl>

                      <a
                        href="#quote"
                        data-cta={`lineup-${i}`}
                        className="mt-6 inline-flex items-center justify-center gap-2 rounded-full bg-brand-50 px-6 py-3 text-sm font-semibold text-brand-800 ring-1 ring-inset ring-brand-200 transition hover:bg-brand-100"
                      >
                        ขอราคาตัวนี้
                        <Icon.arrow className="size-3.5" />
                      </a>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </Wrap>
        </section>

        {/* ----------------------------------------------------------- Compare */}
        <section id="compare" className="bg-slate-50 py-20 lg:py-24">
          <Wrap>
            <SectionHead
              eyebrow="ตารางเทียบ"
              title="ดูทั้งสามตัวเทียบกันในตารางเดียว"
              lead="สเปกที่ลูกค้าถามบ่อยที่สุดก่อนตัดสินใจสั่ง วางเรียงไว้ให้เทียบได้ในหน้าจอเดียว"
            />

            <Reveal delay={120}>
              <div className="mt-11 overflow-x-auto rounded-3xl ring-1 ring-slate-200">
                <table className="w-full min-w-[48rem] border-collapse text-left">
                  <thead>
                    <tr className="bg-brand-950 text-white">
                      {compare.columns.map((c, i) => (
                        <th
                          key={c}
                          className={`px-6 py-4 font-display text-sm font-semibold ${
                            i === 0 ? "" : "border-l border-white/10"
                          }`}
                        >
                          {c}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {compare.rows.map((row, i) => (
                      <tr key={row[0]} className={i % 2 ? "bg-brand-50/40" : "bg-white"}>
                        {row.map((cell, j) => (
                          <td
                            key={j}
                            className={`px-6 py-4 align-top text-[0.9rem] ${
                              j === 0
                                ? "font-medium text-brand-950"
                                : "border-l border-slate-100 text-slate-600"
                            }`}
                          >
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Reveal>

            <Reveal delay={180}>
              <div className="mt-6 flex flex-col items-center justify-between gap-4 rounded-3xl bg-white px-7 py-6 ring-1 ring-slate-200 sm:flex-row">
                <p className="text-[1.02rem] leading-relaxed text-slate-700">{compare.note}</p>
                <a
                  href={telHref}
                  data-cta="compare-call"
                  className="inline-flex shrink-0 items-center gap-2 rounded-full bg-brand-700 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-brand-900/20 transition hover:bg-accent-600 active:scale-[0.98]"
                >
                  <Icon.phone />
                  โทรถามฝ่ายขาย
                </a>
              </div>
            </Reveal>
          </Wrap>
        </section>

        {/* -------------------------------------------------------- Difference */}
        <DarkBand glow="right">
          <SectionHead
            tone="dark"
            eyebrow={difference.eyebrow}
            title={difference.title}
            lead={difference.lead}
          />

          <div className="mt-14 grid gap-5 md:grid-cols-2">
            {difference.columns.map((c, i) => (
              <Reveal key={c.name} delay={i * 100}>
                <div className="h-full rounded-4xl bg-white/[0.05] p-8 ring-1 ring-inset ring-white/10">
                  <div className="flex items-baseline gap-3">
                    <h3 className="text-2xl text-white">{c.name}</h3>
                    <span className="rounded-full bg-brand-500/20 px-3 py-1 text-[0.78rem] font-semibold text-brand-200">
                      {c.caption}
                    </span>
                  </div>
                  <ul className="mt-6 grid gap-3">
                    {c.points.map((p) => (
                      <li
                        key={p}
                        className="flex gap-3 text-[0.93rem] leading-relaxed text-brand-100/80"
                      >
                        <span className="mt-2 size-1.5 shrink-0 rounded-full bg-brand-400" />
                        {p}
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal delay={200}>
            <p className="mx-auto mt-10 max-w-3xl rounded-3xl bg-white/[0.06] px-7 py-6 text-center text-[1.02rem] leading-relaxed text-brand-100/80 ring-1 ring-inset ring-white/10">
              {difference.outro}
            </p>
          </Reveal>
        </DarkBand>

        {/* --------------------------------------------------- Sizes + ordering */}
        <section id="sizes" className="py-20 lg:py-24">
          <Wrap>
            <SectionHead
              eyebrow="ขนาดบรรจุ"
              title="มีตั้งแต่แกลลอนเดียว จนถึงถัง 150 กิโล"
              lead="เลือกขนาดให้พอดีกับรอบการใช้งาน ซื้อขนาดใหญ่คุ้มกว่าต่อกิโลกรัม แต่เปิดฝาแล้วควรใช้ให้หมดในเวลาที่เหมาะสม"
            />

            <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {packs.map((p, i) => (
                <Reveal key={p.size} delay={i * 80}>
                  <div className="h-full rounded-3xl bg-white p-7 ring-1 ring-slate-200/80 transition hover:ring-brand-300">
                    <p className="font-display text-3xl font-bold text-brand-700">{p.size}</p>
                    <p className="mt-1 font-display font-semibold text-brand-950">{p.name}</p>
                    <p className="mt-3 text-sm leading-relaxed text-slate-500">{p.detail}</p>
                  </div>
                </Reveal>
              ))}
            </div>

            <div className="mt-16 grid items-start gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
              <Reveal>
                <Eyebrow>{ordering.eyebrow}</Eyebrow>
                <h2 className="mt-4 text-3xl leading-[1.25] sm:text-4xl lg:text-[2.4rem]">
                  {ordering.title}
                </h2>
                <a
                  href="#quote"
                  data-cta="ordering-quote"
                  className="mt-8 inline-flex items-center gap-2 rounded-full bg-brand-700 px-7 py-3.5 text-[1.02rem] font-semibold text-white shadow-lg shadow-brand-900/20 transition hover:bg-accent-600 active:scale-[0.98]"
                >
                  แจ้งจำนวนเพื่อขอราคา
                  <Icon.arrow />
                </a>
              </Reveal>

              <Reveal delay={120}>
                <dl className="grid gap-4 sm:grid-cols-2">
                  {ordering.points.map((p) => (
                    <div
                      key={p.title}
                      className="rounded-3xl bg-slate-50 p-6 ring-1 ring-inset ring-slate-100"
                    >
                      <dt className="font-display font-semibold text-brand-950">{p.title}</dt>
                      <dd className="mt-2.5 text-sm leading-relaxed text-slate-600">{p.text}</dd>
                    </div>
                  ))}
                </dl>
              </Reveal>
            </div>
          </Wrap>
        </section>

        {/* ------------------------------------------------------------ Safety */}
        <section className="bg-slate-50 py-20 lg:py-24">
          <Wrap>
            <SectionHead eyebrow={safety.eyebrow} title={safety.title} lead={safety.lead} />

            <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {safety.items.map((s, i) => (
                <Reveal key={s.title} delay={i * 80}>
                  <div className="h-full rounded-3xl bg-white p-7 ring-1 ring-slate-200/80">
                    <span className="grid size-11 place-items-center rounded-2xl bg-accent-500/10 text-accent-600">
                      <Icon.flame className="size-5" />
                    </span>
                    <h3 className="mt-5 text-lg">{s.title}</h3>
                    <p className="mt-2.5 text-sm leading-relaxed text-slate-500">{s.text}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </Wrap>
        </section>

        {/* --------------------------------------------------------- Documents */}
        <section className="py-20 lg:py-24">
          <Wrap>
            <div className="grid items-center gap-10 rounded-4xl bg-brand-50/60 p-8 ring-1 ring-inset ring-brand-100 sm:p-12 lg:grid-cols-[1fr_1.05fr] lg:gap-14">
              <Reveal>
                <Eyebrow>{documents.eyebrow}</Eyebrow>
                <h2 className="mt-4 text-3xl leading-[1.25] sm:text-4xl">{documents.title}</h2>
                <p className="mt-5 text-base leading-relaxed text-slate-600">{documents.lead}</p>
                <p className="mt-5 text-sm leading-relaxed text-slate-500">{documents.note}</p>
              </Reveal>

              <Reveal delay={120}>
                <ul className="grid gap-3">
                  {documents.items.map((d) => (
                    <li key={d.href}>
                      <a
                        href={d.href}
                        target="_blank"
                        rel="noreferrer"
                        data-cta="doc-download"
                        className="flex items-center gap-4 rounded-3xl bg-white p-5 ring-1 ring-slate-200 transition hover:ring-brand-300"
                      >
                        <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-brand-600 text-white">
                          <Icon.doc className="size-5" />
                        </span>
                        <span className="flex-1">
                          <span className="block text-[1.02rem] font-semibold text-brand-950">
                            {d.label}
                          </span>
                          <span className="mt-0.5 block text-[0.85rem] text-slate-500">
                            {d.note}
                          </span>
                        </span>
                        <Icon.arrow className="size-4 shrink-0 text-brand-500" />
                      </a>
                    </li>
                  ))}
                </ul>
              </Reveal>
            </div>
          </Wrap>
        </section>

        {/* ---------------------------------------------------------------- FAQ */}
        <section id="faq" className="bg-slate-50 py-20 lg:py-24">
          <Wrap>
            <SectionHead eyebrow="คำถามที่พบบ่อย" title="เรื่องที่ลูกค้าถามก่อนสั่งมากที่สุด" />

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
                  โทรถามฝ่ายขายได้เลยที่ {site.phones[0]}
                </a>
              </p>
            </Reveal>
          </Wrap>
        </section>

        {/* -------------------------------------------------------------- Quote */}
        <DarkBand id="quote" glow="center">
          <div
            aria-hidden
            className="absolute -bottom-24 -left-16 size-72 rotate-45 rounded-[26%] border border-white/10"
          />
          <div className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:gap-14">
            <div>
              <Eyebrow tone="dark">ขอใบเสนอราคา</Eyebrow>
              <h2 className="mt-4 text-3xl leading-[1.2] text-white sm:text-4xl lg:text-[2.6rem]">
                แจ้งชนิดและจำนวน ให้ฝ่ายขายเสนอราคาให้
              </h2>
              <p className="mt-5 text-base leading-relaxed text-brand-100/75">
                ราคาต่อหน่วยขึ้นกับจำนวนที่สั่งและจังหวัดปลายทาง กรอกเท่าที่รู้ก็พอ
                ที่เหลือฝ่ายขายจะโทรกลับไปคุยกับคุณเอง
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
                    <span className="block text-xs text-brand-200/70">ส่งรายการทางอีเมล</span>
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
              <h3 className="text-xl">กรอกรายการที่ต้องการ</h3>
              <p className="mt-2 text-sm text-slate-500">ฟรี ไม่มีค่าใช้จ่าย และไม่มีข้อผูกมัด</p>
              <div className="mt-6">
                <LpQuoteForm config={quoteForm} />
              </div>
            </div>
          </div>
        </DarkBand>
      </main>

      <LpFooter note="ราคาและสต็อกเปลี่ยนแปลงได้ กรุณายืนยันกับฝ่ายขายก่อนสั่งซื้อทุกครั้ง" />

      <LpStickyCta quoteLabel="ขอราคา" />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </>
  );
}
