import { CmsImage } from "@/components/CmsImage";
import type { Metadata } from "next";
import LpHeader from "@/components/landing/LpHeader";
import LpStickyCta from "@/components/landing/LpStickyCta";
import LpQuoteForm from "@/components/landing/LpQuoteForm";
import LpFaq from "@/components/landing/LpFaq";
import LpFooter from "@/components/landing/LpFooter";
import LpGallery from "@/components/landing/LpGallery";
import { Check, Wrap } from "@/components/landing/kit";
import LpHero from "@/components/landing/LpHero";
import { PRODUCT_HERO } from "@/components/product/ProductHero";
import Reveal from "@/components/ui/Reveal";
import { Icon } from "@/components/ui";
import { bundleFor } from "@/data/site";
import { copyFor } from "@/lib/cms/copy-pages";
import { getProducts, getSiteInfo, getStandards } from "@/lib/cms/content";

/**
 * Landing page. Kept out of the (site) route group so it renders without the
 * main navigation, but it is indexed and sits in the sitemap — it is the page
 * meant to rank for "สีกันไฟโครงสร้างเหล็ก", so the two Neocoat product pages
 * stay on the narrower model keywords and this one carries the category term.
 */
export async function generateMetadata(): Promise<Metadata> {
  const [site, { meta }] = await Promise.all([
    getSiteInfo(),
    copyFor("neocoat"),
  ]);
  return {
    title: meta.title,
    description: meta.description,
    // หน้านี้ติดอันดับเองได้ canonical จึงชี้กลับหาตัวเอง ไม่ใช่หน้าสินค้า
    alternates: { canonical: "/neocoat" },
    openGraph: {
      type: "website",
      locale: "th_TH",
      siteName: site.shortName,
      title: meta.ogTitle,
      description: meta.ogDescription,
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
  /* ข้อความทั้งหน้ามาจาก @/data/fire-paint-lp แล้วทับด้วยค่าที่ลูกค้าแก้จากหลังบ้าน
     ชื่อที่ผูกออกมาตรงกับ export เดิมทุกตัว เนื้อหา JSX ด้านล่างจึงไม่ต้องแก้ */
  const {
    advantages,
    calculation,
    documents,
    faqs,
    formulas,
    galleryImages,
    hero,
    legal,
    navSections,
    process,
    productSpecs,
    quoteForm,
    related,
    reports,
    reviews,
    risk,
    system,
  } = await copyFor("neocoat");
  const [info, standards, products] = await Promise.all([
    getSiteInfo(),
    getStandards(),
    getProducts(),
  ]);
  /* รูปปกจากสินค้าจริง — ถ้า slug ไม่ตรงกับสินค้าไหน (เช่นสินค้าถูกลบ) การ์ดจะไม่มีรูป
     แต่ไม่พัง */
  const coverOf = (slug: string) =>
    products.find((p) => p.slug === slug)?.image;
  const { site, telHref, lineHref, mailHref } = bundleFor(info, []);

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "Product",
      name: "สีกันไฟ – สีทนไฟ Neocoat Intumescent Paint",
      sku: "A014",
      category: "สีกันไฟโครงสร้างเหล็ก",
      description:
        "สีกันไฟสำหรับโครงสร้างเหล็ก ทนไฟสูงสุด 3 ชั่วโมง ผ่านการทดสอบ ASTM E-119 และ ISO 834 พร้อมเอกสารรับรองโดยวุฒิวิศวกรโยธา",
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
        {/* รูปแบนเนอร์ใช้ไฟล์เดียวกับหน้าสินค้าสูตรน้ำมัน จะได้แก้ที่เดียว
            ส่วนถังสีเป็นไฟล์ถังคู่ (สูตรน้ำมัน + สูตรน้ำ) เพราะหน้านี้ขายทั้งสองสูตร
            ต่างจากหน้าสินค้าที่โชว์ถังของสูตรตัวเองใบเดียว */}
        <LpHero
          hero={hero}
          banner={PRODUCT_HERO["neocoat-intumescent-paint-s"].banner}
          cutout="/assets/products/neocoat-paint-sw-cutout.webp"
          cutoutPair
          badges={standards.map((s) => s.label)}
          quoteLabel="ขอใบเสนอราคาฟรี"
          telHref={telHref}
          lineHref={lineHref}
          phone={site.phones[0]}
          lineId={site.lineId}
        />

        {/* -------------------------------------------------- Standards strip */}
        {/* แถวนิ่ง ไม่วิ่ง (ลูกค้าขอ) — มีแค่ 4 ป้าย จอใหญ่เรียงแถวเดียวกึ่งกลาง
            จอเล็กตัดขึ้นบรรทัดใหม่ 2 คอลัมน์ ไม่ต้องเลื่อนแนวนอน */}
        <section className="border-b border-slate-100 bg-white py-6">
          <Wrap>
            <ul className="grid gap-3 sm:grid-cols-2 lg:flex lg:flex-wrap lg:justify-center lg:gap-4">
              {standards.map((s) => (
                <li
                  key={s.label}
                  className="flex items-center gap-3 rounded-2xl bg-brand-50/70 px-5 py-3 ring-1 ring-inset ring-brand-100"
                >
                  <Icon.shield className="size-5 shrink-0 text-brand-500" />
                  <span>
                    <span className="block font-display text-sm font-semibold text-brand-700">
                      {s.label}
                    </span>
                    <span className="block text-[0.78rem] text-slate-500">
                      {s.note}
                    </span>
                  </span>
                </li>
              ))}
            </ul>
          </Wrap>
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
                    {/* การ์ดที่ค่าเป็นข้อความยาว (ไม่ใช่ตัวเลข) ลดขนาดลงหนึ่งขั้นให้ยังอยู่บรรทัดเดียว */}
                    <p
                      className={`font-display font-bold text-accent-600 ${
                        f.value.length > 12 ? "text-3xl lg:text-4xl" : "text-4xl lg:text-[2.75rem]"
                      }`}
                    >
                      {f.value}
                    </p>
                    <p className="mt-3 font-display font-semibold text-brand-950">
                      {f.label}
                    </p>
                    {f.note && (
                      <p className="mt-2 text-sm leading-relaxed text-slate-500">
                        {f.note}
                      </p>
                    )}
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
              <p className="mt-5 text-base leading-relaxed text-slate-600">
                {legal.description}
              </p>
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
                <p className="text-[1.02rem] leading-relaxed text-slate-700">
                  {legal.note}
                </p>
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
                  <CmsImage
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
                        <li
                          key={p}
                          className="flex gap-3 text-[0.93rem] text-slate-600"
                        >
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

                <div className="mt-8 rounded-3xl bg-brand-50 p-7 text-brand-900 ring-1 ring-inset ring-brand-100">
                  <p className="text-[1.02rem] leading-relaxed">
                    {calculation.cta}
                  </p>
                  <a
                    href="#quote"
                    data-cta="calc-quote"
                    className="mt-6 inline-flex items-center gap-2 rounded-full bg-brand-700 px-6 py-3 text-sm font-semibold text-white transition hover:bg-accent-600 active:scale-[0.98]"
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
                  <CmsImage
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

        {/* ----------------------------------------------------------- Reports */}
        <section id="reports" className="bg-slate-50 py-20 lg:py-24">
          <Wrap>
            <div className="mx-auto max-w-3xl text-center">
              <span className="inline-flex items-center gap-2 rounded-full bg-brand-50 px-3.5 py-1.5 text-xs font-semibold text-brand-700 ring-1 ring-inset ring-brand-100">
                <span className="size-1.5 rounded-full bg-current" />
                {reports.eyebrow}
              </span>
              <h2 className="mt-4 text-3xl leading-[1.25] sm:text-4xl lg:text-[2.6rem]">
                {reports.title}
              </h2>
              <p className="mt-5 text-base leading-relaxed text-slate-600 sm:text-[1.12rem]">
                {reports.lead}
              </p>
            </div>

            <div className="mt-12 grid gap-4 sm:grid-cols-2">
              {reports.items.map((r, i) => (
                <Reveal key={r.href} delay={i * 70}>
                  <a
                    href={r.href}
                    target="_blank"
                    rel="noreferrer"
                    data-cta={`report-${i}`}
                    className="flex h-full items-start gap-5 rounded-3xl bg-white p-6 ring-1 ring-slate-200 transition hover:ring-brand-300"
                  >
                    <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-brand-600 text-white">
                      <Icon.doc className="size-5" />
                    </span>
                    <span className="flex-1">
                      <span className="block text-[1.05rem] font-semibold text-brand-950">
                        {r.label}
                      </span>
                      <span className="mt-1 block text-[0.85rem] leading-relaxed text-slate-500">
                        {r.note}
                      </span>
                      {/* ขนาดไฟล์และจำนวนหน้า — บอกล่วงหน้าว่ากดแล้วจะโหลดอะไรมา */}
                      <span className="mt-2 inline-flex items-center gap-2 rounded-full bg-brand-50 px-2.5 py-1 text-[0.72rem] font-semibold text-brand-700">
                        {r.meta}
                      </span>
                    </span>
                    <Icon.arrow className="mt-4 size-4 shrink-0 text-brand-500" />
                  </a>
                </Reveal>
              ))}
            </div>

            <p className="mx-auto mt-10 max-w-3xl rounded-3xl bg-amber-50 px-6 py-5 text-[0.95rem] leading-relaxed text-amber-900 ring-1 ring-inset ring-amber-200">
              {reports.note}
            </p>
          </Wrap>
        </section>

        {/* --------------------------------------------------------- Advantages */}
        <section className="relative overflow-hidden bg-brand-50 py-20 lg:py-24">
          <div
            aria-hidden
            className="absolute inset-0 bg-[radial-gradient(56rem_28rem_at_20%_0%,rgba(255,255,255,0.75),transparent_65%)]"
          />
          <Wrap className="relative">
            <Reveal className="mx-auto max-w-3xl text-center">
              <span className="inline-flex items-center gap-2 rounded-full bg-white px-3.5 py-1.5 text-xs font-semibold text-brand-700 ring-1 ring-inset ring-brand-100">
                <span className="size-1.5 rounded-full bg-current" />
                ทำไมต้องซื้อกับ Blue Rich
              </span>
              <h2 className="mt-4 text-3xl leading-[1.25] text-brand-900 sm:text-4xl lg:text-[2.6rem]">
                ขายสีอย่างเดียวใครก็ทำได้ แต่งานต้องผ่านการตรวจรับด้วย
              </h2>
              <p className="mt-5 text-base leading-relaxed text-slate-600">
                เราดูแลตั้งแต่การอ่านแบบ คำนวณความหนา เลือกระบบสี
                ควบคุมคุณภาพหน้างาน จนถึงเอกสารรับรองที่ยื่นหน่วยงานได้จริง
              </p>
            </Reveal>

            <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {advantages.map((a, i) => {
                const IconComp = iconMap[a.icon];
                return (
                  <Reveal key={a.title} delay={i * 80}>
                    <div className="h-full rounded-3xl bg-white p-7 ring-1 ring-inset ring-brand-100 transition hover:bg-brand-100">
                      <span className="grid size-12 place-items-center rounded-2xl bg-brand-100 text-brand-600">
                        <IconComp className="size-6" />
                      </span>
                      <h3 className="mt-5 text-lg text-brand-900">{a.title}</h3>
                      <p className="mt-3 text-sm leading-relaxed text-slate-600">
                        {a.text}
                      </p>
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
                    <p className="mt-2.5 text-sm leading-relaxed text-slate-500">
                      {p.text}
                    </p>
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

            {/* กดรูปแล้วเปิดรูปใหญ่ได้ (ลูกค้าขอ) */}
            <LpGallery images={galleryImages} />
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
                        <span className="block text-xs text-slate-500">
                          {r.role}
                        </span>
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
                สั่งพร้อมกันในใบเดียว ส่งพร้อมกันรอบเดียว
                ไม่ต้องเสียเวลาหาหลายเจ้า
              </p>
            </Reveal>

            <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {related.map((r, i) => {
                const cover = coverOf(r.slug);
                return (
                  <Reveal key={r.name} delay={i * 80}>
                    <div className="flex h-full flex-col overflow-hidden rounded-3xl bg-white ring-1 ring-slate-200/80">
                      {/* โชว์ทั้งใบแบบการ์ดสินค้า (object-contain) เพราะรูปปกบางใบเป็นถังตั้ง
                          ถ้า cover จะโดนตัดหัวท้าย */}
                      <div className="relative aspect-4/3 bg-white">
                        {cover && (
                          <CmsImage
                            src={cover}
                            alt={r.name}
                            fill
                            sizes="(min-width: 1024px) 25vw, 45vw"
                            className="object-contain p-5 mix-blend-multiply"
                          />
                        )}
                      </div>
                      <div className="flex flex-1 flex-col p-6">
                        <span className="text-[0.78rem] font-semibold tracking-wide text-brand-500">
                          {r.role}
                        </span>
                        <h3 className="mt-1.5 text-[1.12rem]">{r.name}</h3>
                        <p className="mt-2 text-sm leading-relaxed text-slate-500">
                          {r.text}
                        </p>
                      </div>
                    </div>
                  </Reveal>
                );
              })}
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
        <section
          id="quote"
          className="relative overflow-hidden bg-brand-50 py-20 lg:py-24"
        >
          <div
            aria-hidden
            className="absolute inset-0 bg-[radial-gradient(50rem_26rem_at_50%_0%,rgba(255,255,255,0.75),transparent_70%)]"
          />
          <div
            aria-hidden
            className="absolute -bottom-24 -left-16 size-72 rotate-45 rounded-[26%] border border-brand-200/60"
          />
          <Wrap className="relative">
            <div className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:gap-14">
              <div>
                <span className="inline-flex items-center gap-2 rounded-full bg-white px-3.5 py-1.5 text-xs font-semibold text-brand-700 ring-1 ring-inset ring-brand-100">
                  <span className="size-1.5 rounded-full bg-current" />
                  ขอใบเสนอราคา
                </span>
                <h2 className="mt-4 text-3xl leading-[1.2] text-brand-900 sm:text-4xl lg:text-[2.6rem]">
                  ส่งแบบมาวันนี้ ได้ราคาพร้อมรายการคำนวณภายใน 1–2 วันทำการ
                </h2>
                <p className="mt-5 text-base leading-relaxed text-slate-600">
                  กรอกข้อมูลเท่าที่มี ไม่ต้องครบก็ได้
                  ทีมวิศวกรจะโทรกลับไปคุยรายละเอียดกับคุณเอง หรือถ้าสะดวกคุยเลย
                  โทรหรือแอดไลน์หาเราได้ทันที
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
                      <span className="block text-xs text-slate-500">
                        โทรหาฝ่ายขาย
                      </span>
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
                      <span className="block text-xs text-slate-500">
                        แชทกับทีมงาน
                      </span>
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
                      <span className="block text-xs text-slate-500">
                        ส่งแบบทางอีเมล
                      </span>
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
                      <span className="block text-xs text-slate-500">
                        เวลาทำการ
                      </span>
                      <span className="block font-display font-semibold text-brand-900">
                        {site.hours}
                      </span>
                    </span>
                  </div>
                </div>
              </div>

              <div className="rounded-4xl bg-white p-6 shadow-2xl shadow-brand-900/10 sm:p-8">
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
