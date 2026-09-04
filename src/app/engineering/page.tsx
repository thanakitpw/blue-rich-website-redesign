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
  deliverables,
  faqs,
  hero,
  navSections,
  problems,
  quoteForm,
  reports,
  scope,
  services,
  timeline,
} from "@/data/engineering-lp";
import { bundleFor } from "@/data/site";
import { getSiteInfo, getStandards } from "@/lib/cms/content";

/**
 * Paid-traffic landing page for the engineering service. Sits outside the (site)
 * route group so it renders without the main navigation, and noindex so it does
 * not compete with the organic pages for the same keywords.
 *
 * The other landing pages sell a product and are laid out as card grids; this
 * one sells a process, so the spine of the page is a vertical timeline with a
 * "you send / we deliver" split at every step, followed by the document set the
 * customer actually walks away with.
 */
export async function generateMetadata(): Promise<Metadata> {
  const site = await getSiteInfo();
  return {
    title: "รับรองงานสีกันไฟโดยวุฒิวิศวกร | คำนวณ Hp/A · ตรวจหน้างาน · น.4-5 / น.4-9",
    description:
      "บริการคำนวณความหนาฟิล์มสีกันไฟตามค่า Hp/A ของหน้าตัดจริง ตรวจวัดความหนาฟิล์มหน้างาน และออกเอกสารรับรองลงนามโดยวุฒิวิศวกรโยธา อ้างอิงผลทดสอบ ASTM E-119 และ ISO 834 ส่งแบบมาให้ประเมินก่อนได้ ไม่มีค่าใช้จ่าย",
    robots: { index: false, follow: true },
    openGraph: {
      type: "website",
      locale: "th_TH",
      siteName: site.shortName,
      title: "งานรับรองสีกันไฟโครงสร้างเหล็ก โดยวุฒิวิศวกรโยธา",
      description:
        "คำนวณความหนาฟิล์มรายหน้าตัด ตรวจวัดหน้างาน และออกเอกสารรับรองที่ยื่นหน่วยงานได้ครบชุด",
      images: ["/assets/cert-documents.jpg"],
    },
  };
}

const iconMap = {
  doc: Icon.doc,
  users: Icon.users,
  shield: Icon.shield,
};

export default async function EngineeringLanding() {
  const [info, standards] = await Promise.all([getSiteInfo(), getStandards()]);
  const { site, telHref, lineHref, mailHref } = bundleFor(info, []);

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "Service",
      name: "บริการรับรองงานสีกันไฟโครงสร้างเหล็กโดยวุฒิวิศวกร",
      serviceType: "Fire protection engineering certification",
      description:
        "คำนวณความหนาฟิล์มสีกันไฟตามค่า Hp/A ตรวจวัดความหนาฟิล์มหน้างาน และออกเอกสารรับรองลงนามโดยวุฒิวิศวกรโยธา",
      areaServed: { "@type": "Country", name: "ประเทศไทย" },
      provider: { "@type": "Organization", name: site.name, telephone: site.phones },
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
            className="absolute inset-0 bg-[radial-gradient(58rem_30rem_at_10%_-8%,var(--color-brand-700),transparent),radial-gradient(42rem_26rem_at_96%_30%,var(--color-brand-800),transparent)]"
          />
          <div
            aria-hidden
            className="absolute -top-24 right-[-6rem] size-72 rotate-45 rounded-[28%] border border-white/10"
          />

          <Wrap className="relative">
            <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14">
              <div>
                <Eyebrow tone="dark">{hero.eyebrow}</Eyebrow>

                <h1 className="mt-5 text-[2.1rem] leading-[1.18] text-white sm:text-5xl lg:text-[3.2rem]">
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
                    ส่งแบบให้ประเมินฟรี
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
                    src="/assets/cert-documents.jpg"
                    alt="เอกสารรับรองงานสีกันไฟโครงสร้างเหล็ก แบบ น.4-5 และ น.4-9 โดยวุฒิวิศวกร"
                    width={1200}
                    height={1200}
                    priority
                    sizes="(min-width: 1024px) 45vw, 92vw"
                    className="h-auto w-full"
                  />
                </div>
              </div>
            </div>
          </Wrap>
        </section>

        {/* --------------------------------------------------- Standards grid */}
        <section className="border-b border-slate-100 bg-white py-10">
          <Wrap>
            <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
              {standards.map((s) => (
                <li
                  key={s.label}
                  className="rounded-2xl bg-brand-50/60 px-5 py-4 ring-1 ring-inset ring-brand-100"
                >
                  <Icon.shield className="size-5 text-brand-500" />
                  <p className="mt-3 font-display text-sm font-semibold text-brand-700">
                    {s.label}
                  </p>
                  <p className="mt-1 text-[0.8rem] leading-snug text-slate-500">{s.note}</p>
                </li>
              ))}
            </ul>
          </Wrap>
        </section>

        {/* ---------------------------------------------------------- Problems */}
        <section className="py-20 lg:py-24">
          <Wrap>
            <SectionHead eyebrow={problems.eyebrow} title={problems.title} lead={problems.lead} />

            <div className="mt-12 grid gap-5 lg:grid-cols-3">
              {problems.items.map((p, i) => (
                <Reveal key={p.title} delay={i * 90}>
                  <div className="h-full rounded-3xl bg-white p-7 ring-1 ring-slate-200/80">
                    <span className="grid size-11 place-items-center rounded-2xl bg-accent-500/10 text-accent-600">
                      <Icon.flame className="size-5" />
                    </span>
                    <h3 className="mt-5 text-lg">{p.title}</h3>
                    <p className="mt-2.5 text-sm leading-relaxed text-slate-500">{p.text}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </Wrap>
        </section>

        {/* ---------------------------------------------------------- Services */}
        <section id="services" className="bg-slate-50 py-20 lg:py-24">
          <Wrap>
            <SectionHead eyebrow={services.eyebrow} title={services.title} lead={services.lead} />

            <div className="mt-12 grid gap-5 lg:grid-cols-3">
              {services.items.map((s, i) => {
                const IconComp = iconMap[s.icon];
                return (
                  <Reveal key={s.name} delay={i * 90}>
                    <div className="flex h-full flex-col rounded-4xl bg-white p-8 ring-1 ring-slate-200/80 transition hover:shadow-[0_28px_56px_-32px_rgba(12,36,56,0.35)] hover:ring-brand-300">
                      <span className="grid size-12 place-items-center rounded-2xl bg-brand-600 text-white">
                        <IconComp className="size-6" />
                      </span>
                      <h3 className="mt-5 text-xl">{s.name}</h3>
                      <p className="mt-3 text-[0.93rem] leading-relaxed text-slate-600">
                        {s.detail}
                      </p>

                      <p className="mt-6 text-xs font-semibold tracking-wide text-slate-400">
                        รวมอยู่ในบริการ
                      </p>
                      <ul className="mt-3 grid flex-1 gap-2.5">
                        {s.includes.map((inc) => (
                          <li key={inc} className="flex gap-3 text-[0.9rem] text-slate-600">
                            <Check />
                            {inc}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </Reveal>
                );
              })}
            </div>
          </Wrap>
        </section>

        {/* ---------------------------------------------------------- Timeline */}
        <section id="process" className="py-20 lg:py-24">
          <Wrap>
            <SectionHead eyebrow={timeline.eyebrow} title={timeline.title} lead={timeline.lead} />

            {/* Vertical spine: every step states what each side supplies. */}
            <ol className="mx-auto mt-14 max-w-4xl">
              {timeline.steps.map((s, i) => (
                <Reveal key={s.title} delay={i * 80} as="li" className="block">
                  <div className="flex gap-6">
                    <div className="flex w-11 shrink-0 flex-col items-center sm:w-14">
                      <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-brand-600 font-display text-lg font-bold text-white sm:size-14 sm:text-xl">
                        {i + 1}
                      </span>
                      {i < timeline.steps.length - 1 && (
                        <span aria-hidden className="w-px flex-1 bg-brand-200" />
                      )}
                    </div>

                    <div className="pb-8">
                      <h3 className="text-xl">{s.title}</h3>
                      <div className="mt-4 grid gap-3 sm:grid-cols-2">
                        <div className="rounded-3xl bg-slate-50 p-5 ring-1 ring-inset ring-slate-100">
                          <p className="text-xs font-semibold tracking-wide text-slate-400">
                            คุณส่งให้เรา
                          </p>
                          <p className="mt-2 text-[0.9rem] leading-relaxed text-slate-600">
                            {s.you}
                          </p>
                        </div>
                        <div className="rounded-3xl bg-brand-50/70 p-5 ring-1 ring-inset ring-brand-100">
                          <p className="text-xs font-semibold tracking-wide text-brand-500">
                            เราส่งกลับ
                          </p>
                          <p className="mt-2 text-[0.9rem] leading-relaxed text-slate-700">
                            {s.us}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </Reveal>
              ))}
            </ol>
          </Wrap>
        </section>

        {/* ------------------------------------------------------ Deliverables */}
        <DarkBand id="deliverables" glow="left">
          <div className="grid items-start gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
            <Reveal>
              <Eyebrow tone="dark">{deliverables.eyebrow}</Eyebrow>
              <h2 className="mt-4 text-3xl leading-[1.25] text-white sm:text-4xl lg:text-[2.5rem]">
                {deliverables.title}
              </h2>
              <p className="mt-5 text-base leading-relaxed text-brand-100/75">
                {deliverables.lead}
              </p>
              <p className="mt-6 rounded-3xl bg-white/[0.06] px-6 py-5 text-[1rem] leading-relaxed text-brand-100/70 ring-1 ring-inset ring-white/10">
                {deliverables.note}
              </p>
            </Reveal>

            <Reveal delay={120}>
              <ul className="grid gap-3">
                {deliverables.items.map((d) => (
                  <li
                    key={d}
                    className="flex gap-4 rounded-3xl bg-white/[0.05] px-6 py-5 ring-1 ring-inset ring-white/10"
                  >
                    <Icon.doc className="mt-0.5 size-5 shrink-0 text-brand-300" />
                    <span className="text-[1.02rem] leading-relaxed text-brand-50">{d}</span>
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        </DarkBand>

        {/* ----------------------------------------------------------- Reports */}
        <section id="reports" className="py-20 lg:py-24">
          <Wrap>
            <SectionHead eyebrow={reports.eyebrow} title={reports.title} lead={reports.lead} />

            <div className="mt-12 grid gap-4 sm:grid-cols-2">
              {reports.items.map((r, i) => (
                <Reveal key={r.href} delay={i * 70}>
                  <a
                    href={r.href}
                    target="_blank"
                    rel="noreferrer"
                    data-cta={`report-${i}`}
                    className="flex items-center gap-5 rounded-3xl bg-white p-6 ring-1 ring-slate-200 transition hover:ring-brand-300"
                  >
                    <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-brand-600 text-white">
                      <Icon.doc className="size-5" />
                    </span>
                    <span className="flex-1">
                      <span className="block text-[1.05rem] font-semibold text-brand-950">
                        {r.label}
                      </span>
                      <span className="mt-0.5 block text-[0.85rem] text-slate-500">{r.note}</span>
                    </span>
                    <Icon.arrow className="size-4 shrink-0 text-brand-500" />
                  </a>
                </Reveal>
              ))}
            </div>
          </Wrap>
        </section>

        {/* ------------------------------------------------------------- Scope */}
        <section className="bg-slate-50 py-20 lg:py-24">
          <Wrap>
            <SectionHead eyebrow={scope.eyebrow} title={scope.title} lead={scope.lead} />

            <div className="mt-12 grid gap-5 md:grid-cols-2">
              <Reveal>
                <div className="h-full rounded-4xl bg-white p-8 ring-1 ring-slate-200/80">
                  <h3 className="text-xl text-brand-800">{scope.yes.title}</h3>
                  <ul className="mt-6 grid gap-3">
                    {scope.yes.points.map((p) => (
                      <li key={p} className="flex gap-3 text-[0.93rem] leading-relaxed text-slate-600">
                        <Check />
                        {p}
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>

              <Reveal delay={100}>
                <div className="h-full rounded-4xl bg-white p-8 ring-1 ring-slate-200/80">
                  <h3 className="text-xl text-slate-500">{scope.no.title}</h3>
                  <ul className="mt-6 grid gap-3">
                    {scope.no.points.map((p) => (
                      <li key={p} className="flex gap-3 text-[0.93rem] leading-relaxed text-slate-600">
                        <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-slate-200 text-slate-500">
                          <svg viewBox="0 0 20 20" className="size-3" fill="none" aria-hidden>
                            <path
                              d="M6 6l8 8M14 6l-8 8"
                              stroke="currentColor"
                              strokeWidth="2.4"
                              strokeLinecap="round"
                            />
                          </svg>
                        </span>
                        {p}
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            </div>

            <Reveal delay={160}>
              <div className="mt-6 flex flex-col items-center justify-between gap-4 rounded-3xl bg-white px-7 py-6 ring-1 ring-slate-200 sm:flex-row">
                <p className="text-[1.02rem] leading-relaxed text-slate-700">{scope.outro}</p>
                <a
                  href={telHref}
                  data-cta="scope-call"
                  className="inline-flex shrink-0 items-center gap-2 rounded-full bg-brand-700 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-brand-900/20 transition hover:bg-accent-600 active:scale-[0.98]"
                >
                  <Icon.phone />
                  โทรคุยกับวิศวกร
                </a>
              </div>
            </Reveal>
          </Wrap>
        </section>

        {/* ---------------------------------------------------------------- FAQ */}
        <section id="faq" className="py-20 lg:py-24">
          <Wrap>
            <SectionHead eyebrow="คำถามที่พบบ่อย" title="เรื่องที่ลูกค้าถามก่อนตัดสินใจมากที่สุด" />

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
        <DarkBand id="quote" glow="center">
          <div
            aria-hidden
            className="absolute -bottom-24 -left-16 size-72 rotate-45 rounded-[26%] border border-white/10"
          />
          <div className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:gap-14">
            <div>
              <Eyebrow tone="dark">ส่งแบบให้ประเมิน</Eyebrow>
              <h2 className="mt-4 text-3xl leading-[1.2] text-white sm:text-4xl lg:text-[2.6rem]">
                ส่งแบบมาให้วิศวกรดูก่อน ไม่มีค่าใช้จ่าย
              </h2>
              <p className="mt-5 text-base leading-relaxed text-brand-100/75">
                กรอกเท่าที่มีข้อมูลก็พอ ถ้ายังไม่รู้ว่าอาคารต้องทนไฟกี่ชั่วโมง
                หรือยังไม่มีแบบครบ โทรคุยกันก่อนได้ เราจะบอกว่าต้องเตรียมอะไรบ้าง
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
                    <span className="block text-xs text-brand-200/70">โทรหาทีมวิศวกร</span>
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
                    <span className="block text-xs text-brand-200/70">ส่งแบบทางแชท</span>
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
                    <span className="block text-xs text-brand-200/70">ส่งไฟล์แบบทางอีเมล</span>
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
              <h3 className="text-xl">กรอกข้อมูลโครงการ</h3>
              <p className="mt-2 text-sm text-slate-500">ฟรี ไม่มีค่าใช้จ่าย และไม่มีข้อผูกมัด</p>
              <div className="mt-6">
                <LpQuoteForm config={quoteForm} />
              </div>
            </div>
          </div>
        </DarkBand>
      </main>

      <LpFooter note="เอกสารผลทดสอบในหน้านี้เป็นผลทดสอบของผลิตภัณฑ์ ไม่ใช่เอกสารรับรองรายโครงการ ข้อกำหนดทางกฎหมายกรุณายืนยันกับผู้ออกแบบอาคารและเจ้าพนักงานท้องถิ่นของโครงการอีกครั้ง" />

      <LpStickyCta quoteLabel="ส่งแบบให้ดู" />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </>
  );
}
