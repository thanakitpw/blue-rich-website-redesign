import { CmsImage } from "@/components/CmsImage";
import type { Metadata } from "next";
import LpHeader from "@/components/landing/LpHeader";
import LpStickyCta from "@/components/landing/LpStickyCta";
import LpQuoteForm from "@/components/landing/LpQuoteForm";
import LpFaq from "@/components/landing/LpFaq";
import LpFooter from "@/components/landing/LpFooter";
import { Band, Check, Eyebrow, SectionHead, Wrap } from "@/components/landing/kit";
import LpHero from "@/components/landing/LpHero";
import Reveal from "@/components/ui/Reveal";
import { Icon } from "@/components/ui";
import { bundleFor } from "@/data/site";
import { copyFor } from "@/lib/cms/copy-pages";
import { getProducts, getSiteInfo } from "@/lib/cms/content";
import { badgesFor } from "@/data/products";

/**
 * Landing page for the Four Plus emulsion range. Sits outside the (site) route
 * group so it renders without the main navigation, but it is indexed and sits in
 * the sitemap — it carries the range keyword ("สีน้ำพลาสติก Four Plus") while
 * /products/four-plus-* keep the individual product terms.
 *
 * The page is built around the three-coat system rather than three separate
 * products, because the failure this traffic is trying to avoid — peeling and
 * patchy walls — is caused by skipping the primer, not by the topcoat.
 */
export async function generateMetadata(): Promise<Metadata> {
  const [site, { meta }] = await Promise.all([getSiteInfo(), copyFor("four-plus")]);
  return {
    title: meta.title,
    description: meta.description,
    // หน้านี้ติดอันดับเองได้ canonical จึงชี้กลับหาตัวเอง ไม่ใช่หน้าสินค้า
    alternates: { canonical: "/four-plus" },
    openGraph: {
      type: "website",
      locale: "th_TH",
      siteName: site.shortName,
      title: meta.ogTitle,
      description: meta.ogDescription,
      images: ["/assets/products/four-plus-exterior.webp"],
    },
  };
}

export default async function FourPlusLanding() {
  /* ข้อความทั้งหน้ามาจาก @/data/four-plus-lp แล้วทับด้วยค่าที่ลูกค้าแก้จากหลังบ้าน
     ชื่อที่ผูกออกมาตรงกับ export เดิมทุกตัว เนื้อหา JSX ด้านล่างจึงไม่ต้องแก้ */
  const {
    compare,
    coverage,
    faqs,
    hero,
    highlights,
    lineup,
    navSections,
    prep,
    problems,
    quoteForm,
    system,
  } = await copyFor("four-plus");
  const [info, products] = await Promise.all([getSiteInfo(), getProducts()]);
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
        {/* ปุ่มที่สองพาไปตารางคำนวณถังแทนปุ่มโทร ตามหน้าเดิม */}
        <LpHero
          hero={hero}
          banner="/assets/news-painting.jpg"
          cutout="/assets/products/four-plus-exterior.webp"
          badges={badgesFor(products, ["four-plus-exterior"])}
          quoteLabel="แจ้งพื้นที่ ขอราคา"
          secondary={{ href: "#coverage", label: "ดูตารางคำนวณถัง", cta: "hero-coverage" }}
          telHref={telHref}
          lineHref={lineHref}
          phone={site.phones[0]}
          lineId={site.lineId}
        />

        {/* ------------------------------------------------------- Highlights */}
        <section className="border-y border-slate-100 bg-white py-7">
          <Wrap>
            <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {highlights.map((h) => (
                <div
                  key={h.label}
                  className="flex items-center gap-4 rounded-2xl bg-brand-50/70 px-5 py-4 ring-1 ring-inset ring-brand-100"
                >
                  <dt className="font-display text-2xl font-bold text-brand-700">{h.value}</dt>
                  <dd className="text-[0.85rem] leading-snug text-slate-600">{h.label}</dd>
                </div>
              ))}
            </dl>
          </Wrap>
        </section>

        {/* ----------------------------------------------------------- Line-up */}
        <section id="lineup" className="py-20 lg:py-24">
          <Wrap>
            <SectionHead
              eyebrow="สินค้าในระบบ"
              title="สามตัว ออกแบบมาให้ใช้คู่กันเป็นระบบเดียว"
              lead="ซื้อแยกตัวก็ได้ แต่ผลลัพธ์ที่ดีที่สุดมาจากการใช้ทั้งระบบ เพราะแต่ละตัวรับหน้าที่คนละชั้นของฟิล์มสี"
            />

            <div className="mt-12 grid gap-5 lg:grid-cols-3">
              {lineup.map((p, i) => (
                <Reveal key={p.name} delay={i * 90}>
                  <div className="flex h-full flex-col overflow-hidden rounded-4xl bg-white ring-1 ring-slate-200/80 transition hover:shadow-[0_28px_56px_-32px_rgba(12,36,56,0.35)] hover:ring-brand-300">
                    <div className="relative aspect-4/3 bg-slate-50">
                      <CmsImage
                        src={p.image}
                        alt={p.alt}
                        fill
                        sizes="(min-width: 1024px) 32vw, 92vw"
                        className="object-contain p-6"
                      />
                      <span className="absolute top-4 left-4 rounded-full bg-brand-600 px-3 py-1 text-[0.78rem] font-semibold text-white">
                        {p.step}
                      </span>
                    </div>

                    <div className="flex flex-1 flex-col p-7">
                      <p className="text-[0.86rem] font-semibold tracking-wide text-brand-500">
                        {p.thai}
                      </p>
                      <h3 className="mt-1.5 text-[1.15rem] leading-snug">{p.name}</h3>
                      <p className="mt-3 text-[0.93rem] leading-relaxed text-slate-600">
                        {p.summary}
                      </p>

                      <ul className="mt-6 grid flex-1 gap-2.5">
                        {p.points.map((b) => (
                          <li key={b} className="flex gap-3 text-[0.9rem] text-slate-600">
                            <Check />
                            {b}
                          </li>
                        ))}
                      </ul>

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

        {/* ------------------------------------------------------------ System */}
        <section id="system" className="bg-slate-50 py-20 lg:py-24">
          <Wrap>
            <SectionHead eyebrow={system.eyebrow} title={system.title} lead={system.lead} />

            {/* Layers drawn as a wall build-up, top coat first, substrate last. */}
            <div className="mx-auto mt-14 max-w-3xl">
              {system.layers.map((l, i) => (
                <Reveal key={l.order} delay={i * 100}>
                  <div className="flex items-stretch gap-5">
                    <div className="flex w-12 shrink-0 flex-col items-center">
                      <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-brand-600 font-display text-lg font-bold text-white">
                        {l.order}
                      </span>
                      <span aria-hidden className="w-px flex-1 bg-brand-200" />
                    </div>

                    <div className="mb-4 flex-1 rounded-3xl bg-white p-6 ring-1 ring-slate-200/80">
                      <h3 className="text-lg">{l.name}</h3>
                      <p className="mt-1 font-display text-sm font-semibold text-brand-600">
                        {l.product}
                      </p>
                      <p className="mt-3 text-[0.93rem] leading-relaxed text-slate-600">
                        {l.detail}
                      </p>
                    </div>
                  </div>
                </Reveal>
              ))}

              <Reveal delay={320}>
                <div className="flex items-center gap-5">
                  <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-slate-300 text-white">
                    <Icon.shield className="size-5" />
                  </span>
                  <p className="flex-1 rounded-3xl bg-slate-200/60 px-6 py-4 text-[0.9rem] leading-relaxed text-slate-600">
                    <span className="font-display font-semibold text-brand-950">พื้นผิว : </span>
                    {system.substrate}
                  </p>
                </div>
              </Reveal>
            </div>
          </Wrap>
        </section>

        {/* ---------------------------------------------------------- Problems */}
        <Band glow="right">
          <SectionHead
            tone="band"
            eyebrow={problems.eyebrow}
            title={problems.title}
            lead={problems.lead}
          />

          <div className="mt-14 grid gap-5 lg:grid-cols-3">
            {problems.items.map((p, i) => (
              <Reveal key={p.symptom} delay={i * 90}>
                <div className="h-full rounded-4xl bg-white p-7 ring-1 ring-inset ring-brand-100">
                  <h3 className="text-xl text-brand-900">{p.symptom}</h3>

                  <p className="mt-5 text-xs font-semibold tracking-wide text-accent-600">
                    ต้นเหตุ
                  </p>
                  <p className="mt-2 text-[1rem] leading-relaxed text-slate-600">
                    {p.cause}
                  </p>

                  <p className="mt-5 text-xs font-semibold tracking-wide text-brand-600">
                    วิธีป้องกัน
                  </p>
                  <p className="mt-2 text-[1rem] leading-relaxed text-slate-600">{p.fix}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </Band>

        {/* ------------------------------------------------------- Spec compare */}
        <section id="spec" className="py-20 lg:py-24">
          <Wrap>
            <SectionHead
              eyebrow="ตารางสเปก"
              title="เทียบทั้งสามตัวในตารางเดียว"
              lead="สเปกที่ผู้รับเหมาและฝ่ายจัดซื้อขอดูก่อนอนุมัติ วางเรียงไว้ให้เทียบได้ในหน้าจอเดียว"
            />

            <Reveal delay={120}>
              <div className="mt-11 overflow-x-auto rounded-3xl ring-1 ring-slate-200">
                <table className="w-full min-w-[46rem] border-collapse text-left">
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

            <Reveal delay={170}>
              <p className="mt-6 rounded-3xl bg-slate-50 px-7 py-5 text-[1rem] leading-relaxed text-slate-600 ring-1 ring-inset ring-slate-100">
                {compare.note}
              </p>
            </Reveal>
          </Wrap>
        </section>

        {/* ---------------------------------------------------------- Coverage */}
        <section id="coverage" className="bg-slate-50 py-20 lg:py-24">
          <Wrap>
            <div className="grid items-start gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
              <Reveal>
                <Eyebrow>{coverage.eyebrow}</Eyebrow>
                <h2 className="mt-4 text-3xl leading-[1.25] sm:text-4xl lg:text-[2.5rem]">
                  {coverage.title}
                </h2>
                <p className="mt-5 text-base leading-relaxed text-slate-600">{coverage.lead}</p>
                <a
                  href="#quote"
                  data-cta="coverage-quote"
                  className="mt-8 inline-flex items-center gap-2 rounded-full bg-brand-700 px-7 py-3.5 text-[1.02rem] font-semibold text-white shadow-lg shadow-brand-900/20 transition hover:bg-accent-600 active:scale-[0.98]"
                >
                  ให้ทีมงานคำนวณให้แม่นกว่านี้
                  <Icon.arrow />
                </a>
              </Reveal>

              <Reveal delay={120}>
                <div className="overflow-x-auto rounded-3xl bg-white ring-1 ring-slate-200">
                  <table className="w-full min-w-[34rem] border-collapse text-left">
                    <thead>
                      <tr className="bg-brand-950 text-white">
                        {coverage.columns.map((c, i) => (
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
                      {coverage.rows.map((row, i) => (
                        <tr key={row[0]} className={i % 2 ? "bg-brand-50/40" : "bg-white"}>
                          {row.map((cell, j) => (
                            <td
                              key={j}
                              className={`px-6 py-4 text-[1rem] ${
                                j === 0
                                  ? "font-medium text-brand-950"
                                  : j === row.length - 1
                                    ? "border-l border-slate-100 font-semibold text-brand-700"
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

                <p className="mt-5 rounded-3xl bg-white px-6 py-5 text-[0.96rem] leading-relaxed text-slate-500 ring-1 ring-slate-200">
                  {coverage.note}
                </p>
              </Reveal>
            </div>
          </Wrap>
        </section>

        {/* -------------------------------------------------------------- Prep */}
        <section className="py-20 lg:py-24">
          <Wrap>
            <SectionHead eyebrow={prep.eyebrow} title={prep.title} />

            <div className="mt-12 grid gap-5 lg:grid-cols-3">
              {prep.items.map((p, i) => (
                <Reveal key={p.title} delay={i * 90}>
                  <div className="h-full rounded-3xl bg-white p-7 ring-1 ring-slate-200/80 transition hover:ring-brand-300">
                    <span className="font-display text-5xl font-bold text-brand-100">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <h3 className="mt-3 text-lg">{p.title}</h3>
                    <p className="mt-2.5 text-sm leading-relaxed text-slate-500">{p.text}</p>
                  </div>
                </Reveal>
              ))}
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
        <Band id="quote" glow="center">
          <div
            aria-hidden
            className="absolute -bottom-24 -left-16 size-72 rotate-45 rounded-[26%] border border-brand-200/60"
          />
          <div className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:gap-14">
            <div>
              <Eyebrow tone="band">ขอใบเสนอราคา</Eyebrow>
              <h2 className="mt-4 text-3xl leading-[1.2] text-brand-900 sm:text-4xl lg:text-[2.6rem]">
                แจ้งพื้นที่ ตร.ม. ให้ทีมงานคำนวณจำนวนถังให้
              </h2>
              <p className="mt-5 text-base leading-relaxed text-slate-600">
                บอกพื้นที่ผนังกับสภาพผนังมา เราจะคำนวณจำนวนถังทั้งรองพื้นและทับหน้า
                พร้อมเสนอราคาโครงการกลับไปให้
              </p>

              <div className="mt-9 grid gap-3">
                <a
                  href={telHref}
                  data-cta="quote-call"
                  className="flex items-center gap-4 rounded-3xl bg-white p-5 ring-1 ring-inset ring-brand-100 transition hover:bg-brand-100"
                >
                  <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-brand-100 text-brand-700">
                    <Icon.phone className="size-5" />
                  </span>
                  <span>
                    <span className="block text-xs text-slate-500">โทรหาฝ่ายขาย</span>
                    <span className="block font-display font-semibold text-brand-900">
                      {site.phones.join(" · ")}
                    </span>
                  </span>
                </a>

                <a
                  href={lineHref}
                  target="_blank"
                  rel="noreferrer"
                  data-cta="quote-line"
                  className="flex items-center gap-4 rounded-3xl bg-white p-5 ring-1 ring-inset ring-brand-100 transition hover:bg-brand-100"
                >
                  <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-[#06C755]/20 text-[#06C755]">
                    <Icon.line className="size-5" />
                  </span>
                  <span>
                    <span className="block text-xs text-slate-500">ส่งรูปผนังหรือแบบทางแชท</span>
                    <span className="block font-display font-semibold text-brand-900">
                      LINE ID : {site.lineId}
                    </span>
                  </span>
                </a>

                <a
                  href={mailHref}
                  data-cta="quote-mail"
                  className="flex items-center gap-4 rounded-3xl bg-white p-5 ring-1 ring-inset ring-brand-100 transition hover:bg-brand-100"
                >
                  <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-brand-100 text-brand-700">
                    <Icon.mail className="size-5" />
                  </span>
                  <span>
                    <span className="block text-xs text-slate-500">ส่งรายการทางอีเมล</span>
                    <span className="block font-display font-semibold text-brand-900">
                      {site.email}
                    </span>
                  </span>
                </a>

                <div className="flex items-center gap-4 rounded-3xl bg-white p-5 ring-1 ring-inset ring-brand-100">
                  <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-brand-100 text-brand-700">
                    <Icon.clock className="size-5" />
                  </span>
                  <span>
                    <span className="block text-xs text-slate-500">เวลาทำการ</span>
                    <span className="block font-display font-semibold text-brand-900">
                      {site.hours}
                    </span>
                  </span>
                </div>
              </div>
            </div>

            <div className="rounded-4xl bg-white p-6 shadow-2xl shadow-brand-900/10 sm:p-8">
              <h3 className="text-xl">กรอกข้อมูลหน้างาน</h3>
              <p className="mt-2 text-sm text-slate-500">ฟรี ไม่มีค่าใช้จ่าย และไม่มีข้อผูกมัด</p>
              <div className="mt-6">
                <LpQuoteForm config={quoteForm} />
              </div>
            </div>
          </div>
        </Band>
      </main>

      <LpFooter note="อัตราการทาและเวลาแห้งเป็นค่าที่วัดในสภาวะมาตรฐาน ผลจริงขึ้นกับสภาพผนังและอากาศหน้างาน" />

      <LpStickyCta quoteLabel="ขอราคา" />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </>
  );
}
