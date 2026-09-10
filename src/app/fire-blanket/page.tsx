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
 * Landing page for the fiberglass cloth range. Sits outside the (site) route
 * group so it renders without the main navigation, but it is indexed and sits in
 * the sitemap — it carries the grade-picker keywords ("ผ้ากันไฟ 550/1000°C")
 * while /products/fiberglass-cloth keeps the catalogue entry.
 *
 * Structured around the grade picker rather than a single product pitch: this
 * traffic mostly knows it wants a fire blanket and is choosing a temperature
 * rating and a cut size, so those two decisions come first.
 */
export async function generateMetadata(): Promise<Metadata> {
  const [site, { meta }] = await Promise.all([getSiteInfo(), copyFor("fire-blanket")]);
  return {
    title: meta.title,
    description: meta.description,
    // หน้านี้ติดอันดับเองได้ canonical จึงชี้กลับหาตัวเอง ไม่ใช่หน้าสินค้า
    alternates: { canonical: "/fire-blanket" },
    openGraph: {
      type: "website",
      locale: "th_TH",
      siteName: site.shortName,
      title: meta.ogTitle,
      description: meta.ogDescription,
      images: ["/assets/products/fiberglass-cloth-panel-main.webp"],
    },
  };
}

export default async function FireBlanketLanding() {
  /* ข้อความทั้งหน้ามาจาก @/data/fire-blanket-lp แล้วทับด้วยค่าที่ลูกค้าแก้จากหลังบ้าน
     ชื่อที่ผูกออกมาตรงกับ export เดิมทุกตัว เนื้อหา JSX ด้านล่างจึงไม่ต้องแก้ */
  const {
    boundary,
    documents,
    faqs,
    gallery,
    gradeNote,
    grades,
    hero,
    navSections,
    quoteForm,
    services,
    specs,
    useCases,
  } = await copyFor("fire-blanket");
  const [info, products] = await Promise.all([getSiteInfo(), getProducts()]);
  const { site, telHref, lineHref, mailHref } = bundleFor(info, []);

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "Product",
      name: "ผ้ากันไฟ ผ้ากันสะเก็ดไฟ Fiberglass Cloth",
      category: "ผ้ากันไฟ / ผ้ากันสะเก็ดไฟ",
      description:
        "ผ้าใยแก้วทอแบบซาติน ผ่านการอบ 2 ครั้ง อุณหภูมิใช้งาน 550°C และ 1000°C ตัดเย็บตามขนาด เจาะรูตาไก่ได้",
      image: `${site.url}/assets/products/fiberglass-cloth-panel-main.webp`,
      offers: {
        "@type": "Offer",
        availability: "https://schema.org/InStock",
        priceCurrency: "THB",
        url: `${site.url}/fire-blanket`,
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
        {/* ใช้รูปเนื้อผ้าเป็นแบนเนอร์ไปก่อนจนกว่าจะได้รูปหน้างานจริง ผ้าไม่มีไฟล์ตัดพื้นจึงไม่มีรูปลอยมุมซ้าย */}
        <LpHero
          hero={hero}
          banner="/assets/products/fiberglass-cloth-weave-detail.webp"
          badges={badgesFor(products, ["fiberglass-cloth"])}
          quoteLabel="แจ้งขนาดเพื่อขอราคา"
          telHref={telHref}
          lineHref={lineHref}
          phone={site.phones[0]}
          lineId={site.lineId}
        />

        {/* ------------------------------------------------------------ Grades */}
        <section id="grades" className="py-20 lg:py-24">
          <Wrap>
            <SectionHead
              eyebrow="เลือกเกรด"
              title="สี่เกรด แบ่งตามอุณหภูมิและสภาพหน้างาน"
              lead="ทุกเกรดทอแบบซาตินและผ่านการอบ 2 ครั้งเหมือนกัน ต่างกันที่เนื้อวัสดุ ความหนา และผิวเคลือบ"
            />

            <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {grades.map((g, i) => (
                <Reveal key={g.doc} delay={i * 80}>
                  <div className="flex h-full flex-col overflow-hidden rounded-4xl bg-white ring-1 ring-slate-200/80 transition hover:shadow-[0_28px_56px_-32px_rgba(12,36,56,0.35)] hover:ring-brand-300">
                    <div className="relative aspect-4/3 bg-slate-100">
                      <CmsImage
                        src={g.image}
                        alt={g.alt}
                        fill
                        sizes="(min-width: 1024px) 24vw, 45vw"
                        className="object-cover"
                      />
                      <span className="absolute top-4 left-4 rounded-full bg-brand-950/85 px-3.5 py-1.5 font-display text-sm font-bold text-accent-400 backdrop-blur">
                        {g.temp}
                      </span>
                    </div>

                    <div className="flex flex-1 flex-col p-6">
                      <h3 className="text-[1.12rem] leading-snug">{g.name}</h3>
                      <p className="mt-1 text-[0.88rem] font-semibold text-brand-600">
                        {g.thickness}
                      </p>
                      <p className="mt-3 flex-1 text-[0.96rem] leading-relaxed text-slate-600">
                        {g.summary}
                      </p>

                      <p className="mt-5 rounded-2xl bg-slate-50 px-4 py-3 text-[0.88rem] leading-relaxed text-slate-500 ring-1 ring-inset ring-slate-100">
                        เหมาะกับ : {g.bestFor}
                      </p>

                      <a
                        href={g.doc}
                        target="_blank"
                        rel="noreferrer"
                        data-cta={`grade-doc-${i}`}
                        className="mt-4 inline-flex items-center justify-center gap-2 rounded-full bg-brand-50 px-5 py-2.5 text-[0.85rem] font-semibold text-brand-800 ring-1 ring-inset ring-brand-200 transition hover:bg-brand-100"
                      >
                        <Icon.doc className="size-4" />
                        ดูสเปก PDF
                      </a>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>

            <Reveal delay={160}>
              <p className="mx-auto mt-10 max-w-3xl rounded-3xl bg-accent-500/[0.07] px-7 py-6 text-center text-[1.02rem] leading-relaxed text-slate-700 ring-1 ring-inset ring-accent-500/20">
                {gradeNote}
              </p>
            </Reveal>
          </Wrap>
        </section>

        {/* ----------------------------------------------------------- Gallery */}
        <section className="bg-slate-50 py-20 lg:py-24">
          <Wrap>
            <SectionHead
              eyebrow="เนื้อผ้าและงานเย็บ"
              title="ดูเนื้อผ้าจริงก่อนตัดสินใจ"
              lead="ภาพถ่ายผ้าและงานเย็บที่เราส่งจริง ทั้งผืนสำเร็จ ริมผ้า รูตาไก่ และแบบม้วน"
            />

            {/* Five photos: two-up on phones with the last one filling the row,
                a single five-across strip from lg. */}
            <div className="mt-12 grid grid-cols-2 gap-4 lg:grid-cols-5">
              {gallery.map((g, i) => (
                <Reveal
                  key={g.src}
                  delay={i * 70}
                  className={i === gallery.length - 1 ? "col-span-2 lg:col-span-1" : ""}
                >
                  <figure className="group h-full overflow-hidden rounded-3xl bg-white ring-1 ring-slate-200/80">
                    <div className="relative aspect-4/3">
                      <CmsImage
                        src={g.src}
                        alt={g.alt}
                        fill
                        sizes="(min-width: 1024px) 20vw, 45vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                    <figcaption className="px-4 py-3 text-[0.86rem] leading-snug text-slate-500">
                      {g.caption}
                    </figcaption>
                  </figure>
                </Reveal>
              ))}
            </div>
          </Wrap>
        </section>

        {/* ------------------------------------------------- Service + spec */}
        <section id="service" className="py-20 lg:py-24">
          <Wrap>
            <div className="grid items-start gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
              <Reveal>
                <Eyebrow>{services.eyebrow}</Eyebrow>
                <h2 className="mt-4 text-3xl leading-[1.25] sm:text-4xl lg:text-[2.5rem]">
                  {services.title}
                </h2>
                <p className="mt-5 text-base leading-relaxed text-slate-600">{services.lead}</p>

                <div className="mt-9 grid gap-4">
                  {services.items.map((s, i) => (
                    <div
                      key={s.title}
                      className="flex gap-5 rounded-3xl bg-white p-6 ring-1 ring-slate-200/80"
                    >
                      <span className="grid size-10 shrink-0 place-items-center rounded-2xl bg-brand-600 font-display font-bold text-white">
                        {i + 1}
                      </span>
                      <div>
                        <h3 className="text-lg">{s.title}</h3>
                        <p className="mt-2 text-[1rem] leading-relaxed text-slate-600">
                          {s.text}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <a
                  href="#quote"
                  data-cta="service-quote"
                  className="mt-8 inline-flex items-center gap-2 rounded-full bg-brand-700 px-7 py-3.5 text-[1.02rem] font-semibold text-white shadow-lg shadow-brand-900/20 transition hover:bg-accent-600 active:scale-[0.98]"
                >
                  ส่งขนาดให้คิดราคา
                  <Icon.arrow />
                </a>
              </Reveal>

              <Reveal delay={120}>
                <div className="overflow-hidden rounded-4xl ring-1 ring-slate-200">
                  <p className="bg-brand-950 px-6 py-4 font-display text-sm font-semibold text-white">
                    สเปกผ้าโดยสรุป
                  </p>
                  <dl className="grid gap-px bg-slate-200">
                    {specs.map((s) => (
                      <div
                        key={s.label}
                        className="flex flex-wrap justify-between gap-x-6 gap-y-1 bg-white px-6 py-3.5"
                      >
                        <dt className="text-[0.85rem] text-slate-500">{s.label}</dt>
                        <dd className="text-[0.96rem] font-medium text-brand-950">{s.value}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              </Reveal>
            </div>
          </Wrap>
        </section>

        {/* --------------------------------------------------------- Use cases */}
        <section id="uses" className="bg-slate-50 py-20 lg:py-24">
          <Wrap>
            <SectionHead eyebrow={useCases.eyebrow} title={useCases.title} />

            <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {useCases.items.map((u, i) => (
                <Reveal key={u.title} delay={i * 70}>
                  <div className="h-full rounded-3xl bg-white p-7 ring-1 ring-slate-200/80 transition hover:ring-brand-300">
                    <span className="grid size-11 place-items-center rounded-2xl bg-brand-50 text-brand-600">
                      <Icon.shield className="size-5" />
                    </span>
                    <h3 className="mt-5 text-lg">{u.title}</h3>
                    <p className="mt-2.5 text-sm leading-relaxed text-slate-500">{u.text}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </Wrap>
        </section>

        {/* ---------------------------------------------------------- Boundary */}
        <Band glow="left">
          <SectionHead
            tone="band"
            eyebrow={boundary.eyebrow}
            title={boundary.title}
            lead={boundary.lead}
          />

          <div className="mt-14 grid gap-5 md:grid-cols-2">
            {boundary.columns.map((c, i) => (
              <Reveal key={c.name} delay={i * 100}>
                <div
                  className={`h-full rounded-4xl p-8 ring-1 ring-inset ${
                    c.tone === "yes"
                      ? "bg-white ring-brand-100"
                      : "bg-accent-500/[0.08] ring-accent-500/25"
                  }`}
                >
                  <h3 className="text-2xl text-brand-900">{c.name}</h3>
                  <ul className="mt-6 grid gap-3">
                    {c.points.map((p) => (
                      <li
                        key={p}
                        className="flex gap-3 text-[0.93rem] leading-relaxed text-slate-600"
                      >
                        {c.tone === "yes" ? (
                          <Check />
                        ) : (
                          <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-accent-500/20 text-accent-600">
                            <svg viewBox="0 0 20 20" className="size-3" fill="none" aria-hidden>
                              <path
                                d="M6 6l8 8M14 6l-8 8"
                                stroke="currentColor"
                                strokeWidth="2.4"
                                strokeLinecap="round"
                              />
                            </svg>
                          </span>
                        )}
                        {p}
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal delay={200}>
            <div className="mx-auto mt-10 flex max-w-3xl flex-col items-center justify-between gap-4 rounded-3xl bg-white px-7 py-6 ring-1 ring-inset ring-brand-100 sm:flex-row">
              <p className="text-[1.02rem] leading-relaxed text-slate-600">{boundary.outro}</p>
              <a
                href={telHref}
                data-cta="boundary-call"
                className="inline-flex shrink-0 items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-brand-800 transition hover:bg-brand-100 active:scale-[0.98]"
              >
                <Icon.phone />
                ปรึกษาทีมงาน
              </a>
            </div>
          </Reveal>
        </Band>

        {/* --------------------------------------------------------- Documents */}
        <section id="documents" className="py-20 lg:py-24">
          <Wrap>
            <SectionHead eyebrow={documents.eyebrow} title={documents.title} lead={documents.lead} />

            <div className="mt-12 grid gap-4 sm:grid-cols-2">
              {grades.map((g, i) => (
                <Reveal key={g.doc} delay={i * 70}>
                  <a
                    href={g.doc}
                    target="_blank"
                    rel="noreferrer"
                    data-cta={`documents-${i}`}
                    className="flex items-start gap-5 rounded-3xl bg-white p-6 ring-1 ring-slate-200 transition hover:ring-brand-300"
                  >
                    <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-brand-600 text-white">
                      <Icon.doc className="size-5" />
                    </span>
                    <span className="flex-1">
                      <span className="block text-[1.05rem] font-semibold text-brand-950">
                        {g.name} {g.temp}
                      </span>
                      <span className="mt-1 block text-[0.85rem] leading-relaxed text-slate-500">
                        {g.thickness} · สเปกจากผู้ผลิต
                      </span>
                      {/* ขนาดไฟล์และจำนวนหน้า — บอกล่วงหน้าว่ากดแล้วจะโหลดอะไรมา */}
                      <span className="mt-2 inline-flex items-center gap-2 rounded-full bg-brand-50 px-2.5 py-1 text-[0.72rem] font-semibold text-brand-700">
                        {g.docMeta}
                      </span>
                    </span>
                    <Icon.arrow className="mt-4 size-4 shrink-0 text-brand-500" />
                  </a>
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
                  โทรถามทีมงานได้เลยที่ {site.phones[0]}
                </a>
              </p>
            </Reveal>
          </Wrap>
        </section>

        {/* -------------------------------------------------------------- Quote */}
        <Band id="quote" glow="center">
          <div
            aria-hidden
            className="absolute -bottom-24 -right-16 size-72 rotate-45 rounded-[26%] border border-brand-200/60"
          />
          <div className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:gap-14">
            <div>
              <Eyebrow tone="band">ขอใบเสนอราคา</Eyebrow>
              <h2 className="mt-4 text-3xl leading-[1.2] text-brand-900 sm:text-4xl lg:text-[2.6rem]">
                แจ้งขนาดและจำนวน ให้ฝ่ายขายคิดราคาให้
              </h2>
              <p className="mt-5 text-base leading-relaxed text-slate-600">
                ราคารวมค่าตัดเย็บและค่าเจาะตาไก่มาให้ในใบเดียว ไม่แน่ใจเรื่องเกรด
                บอกลักษณะงานมา ทีมงานเลือกให้ได้
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
                    <span className="block text-xs text-slate-500">ส่งแบบ/รูปหน้างานทางแชท</span>
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
              <h3 className="text-xl">กรอกขนาดและจำนวนที่ต้องการ</h3>
              <p className="mt-2 text-sm text-slate-500">ฟรี ไม่มีค่าใช้จ่าย และไม่มีข้อผูกมัด</p>
              <div className="mt-6">
                <LpQuoteForm config={quoteForm} />
              </div>
            </div>
          </div>
        </Band>
      </main>

      <LpFooter note="อุณหภูมิใช้งานที่ระบุเป็นค่าของเส้นด้ายตามเอกสารผู้ผลิต ไม่ใช่อัตราการทนไฟของโครงสร้างอาคาร" />

      <LpStickyCta quoteLabel="ขอราคา" />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </>
  );
}
