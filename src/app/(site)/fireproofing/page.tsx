import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Container, Icon, MoreLink, PageHero, SectionHeading } from "@/components/ui";
import Reveal from "@/components/ui/Reveal";
import { CtaBand, FaqList, Section } from "@/components/hub";
import { services } from "@/data/fireproofing";
import { deliverables, faqs, scope, timeline } from "@/data/engineering-lp";
import { projects } from "@/data/projects";
import { stats } from "@/data/site";

export const metadata: Metadata = {
  title: "รับรองสีกันไฟ — คำนวณ ควบคุมงาน และรับรองโดยวุฒิวิศวกร",
  description:
    "บริการรับรองงานสีกันไฟโครงสร้างเหล็ก ตั้งแต่คำนวณความหนาฟิล์มตามค่า Hp/A ควบคุมงานหน้างาน จนถึงออกเอกสารรับรองลงนามโดยวุฒิวิศวกรโยธา แบบ น.4-5 และ น.4-9",
};

/**
 * The hands-on application work the contracting service covers. Every line is
 * quoted from the Neocoat product sheets in `products.ts` — surface prep, the
 * primer requirement, the roller/brush vs airless trade-off and the film
 * thickness range are all stated there.
 */
const onSite = [
  {
    title: "เตรียมผิวก่อนเริ่มทาทุกครั้ง",
    body: "ตรวจสอบผิวเหล็กว่าปราศจากคราบน้ำมัน จารบี สนิม คราบเกลือ ฝุ่นละออง และสิ่งสกปรกอื่น ๆ ที่อาจส่งผลกระทบต่อการยึดเกาะของสี ขั้นตอนนี้เป็นสาเหตุอันดับหนึ่งของงานสีกันไฟที่หลุดล่อนภายหลัง",
  },
  {
    title: "รองพื้นกันสนิมก่อนสีกันไฟ",
    body: "โครงสร้างต้องทาสีรองพื้นกันสนิมก่อนทาสีกันไฟทุกครั้ง และต้องเป็นสีรองพื้นที่ได้รับอนุมัติจากผู้ผลิต Neocoat เพื่อป้องกันการหลุดล่อนและปฏิกิริยาเคมีที่ไม่พึงประสงค์ระหว่างชั้นสี",
  },
  {
    title: "ลูกกลิ้ง–แปรง หรือเครื่องพ่นไร้อากาศ",
    body: "ลูกกลิ้งและแปรงทำงานได้ง่าย ไม่ต้องใช้อุปกรณ์และความชำนาญ ค่าการสูญเสียต่ำ ส่วนเครื่องพ่นสูญญากาศ (Airless Spray) ใช้คนงานน้อย ทำงานได้ไว แต่ผู้ใช้ต้องมีความชำนาญและมีค่าการสูญเสียสูง",
  },
  {
    title: "คุมความหนาฟิล์มให้ตรงกับที่คำนวณ",
    body: "ความหนาชั้นสีกันไฟอยู่ในช่วง 500–3,500 ไมครอน ขึ้นอยู่กับอัตราการทนไฟที่ต้องการและค่า Hp/A ของหน้าตัดเหล็ก ทีมวิศวกรกำหนดจำนวนเที่ยวและตรวจวัดระหว่างทำงาน",
  },
  {
    title: "ปิดด้วยสีทับหน้า",
    body: "ฟิล์มของสีทับหน้าจะช่วยป้องกันไม่ให้น้ำฝนหรือความชื้นสัมผัสสีกันไฟโดยตรง ซึ่งจะทำให้สีกันไฟบวมและร่อน ทั้งยังช่วยให้เช็ดล้างทำความสะอาดได้ง่ายขึ้น",
  },
  {
    title: "ทำได้ทั้งในโรงประกอบและหน้าไซต์",
    body: "งานในโรงประกอบคุมสภาพแวดล้อมได้ดีกว่าและไม่ติดสภาพอากาศ ส่วนงานหน้าไซต์เหมาะกับชิ้นส่วนที่ติดตั้งไปแล้วหรือรอยต่อที่เกิดหลังประกอบ",
  },
];

export default function FireproofingPage() {
  const showcase = projects.slice(0, 4);

  return (
    <>
      <PageHero
        eyebrow="บริการวิศวกรรม"
        title="รับรองสีกันไฟ"
        description="ดูแลงานสีกันไฟโครงสร้างเหล็กครบวงจร — คำนวณความหนาฟิล์มตามหน้าตัดจริง เข้าควบคุมงานหน้างาน และปิดท้ายด้วยเอกสารรับรองลงนามโดยวุฒิวิศวกรโยธาที่ยื่นหน่วยงานได้"
        breadcrumb={[{ label: "หน้าแรก", href: "/" }, { label: "รับรองสีกันไฟ" }]}
      />

      {/* ------------------------------------------------- Two service lines */}
      <Section>
        <Reveal>
          <SectionHeading
            eyebrow="ขอบเขตบริการ"
            title="สองงานหลักที่เรารับ"
            description="แยกจ้างเป็นงาน ๆ ได้ ไม่จำเป็นต้องใช้ครบทั้งสองอย่าง"
          />
        </Reveal>

        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          {services.map((s, i) => (
            <Reveal key={s.slug} delay={i * 100}>
              <Link
                href={`/fireproofing/${s.slug}`}
                className="group flex h-full flex-col overflow-hidden rounded-4xl bg-white border border-slate-200 transition-all duration-300 hover:-translate-y-1 hover:border-brand-200 hover:shadow-[0_28px_56px_-30px_rgba(12,39,64,0.45)]"
              >
                <div className="relative aspect-16/9 overflow-hidden bg-brand-50">
                  <Image
                    src={s.image}
                    alt=""
                    fill
                    sizes="(min-width: 1024px) 45vw, 92vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <span className="absolute top-4 left-4 rounded-full bg-brand-900/85 px-3.5 py-1.5 text-[0.8rem] font-semibold text-white backdrop-blur">
                    {s.eyebrow}
                  </span>
                </div>
                <div className="flex flex-1 flex-col p-7 lg:p-9">
                  <h3 className="text-xl leading-snug transition group-hover:text-brand-700 sm:text-2xl">
                    {s.label}
                  </h3>
                  <p className="mt-3 flex-1 text-[1.02rem] leading-relaxed text-slate-600">
                    {s.lede}
                  </p>
                  <ul className="mt-6 grid gap-2.5">
                    {s.highlights.slice(0, 3).map((h) => (
                      <li key={h} className="flex gap-2.5 text-sm text-slate-700">
                        <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-brand-500" />
                        {h}
                      </li>
                    ))}
                  </ul>
                  <span className="mt-7 inline-flex items-center gap-2 font-semibold text-brand-700">
                    ดูรายละเอียดบริการ
                    <Icon.arrow className="transition-transform duration-300 group-hover:translate-x-1" />
                  </span>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* ------------------------------------------------------- On-site work */}
      <Section tone="shell" id="onsite">
        <Reveal>
          <SectionHeading
            eyebrow="งานหน้างาน"
            title="งานทาและพ่นสีกันไฟที่เรารับเหมาให้ด้วยได้"
            description="รับเหมาทาพร้อมวัสดุ หรือรับจ้างทาอย่างเดียวก็ได้ ทุกงานมีทีมวิศวกรกำหนดระบบสีและเข้าตรวจระหว่างทำ"
          />
        </Reveal>

        <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {onSite.map((b, i) => (
            <Reveal key={b.title} delay={i * 70}>
              <article className="h-full rounded-3xl bg-white p-7 border border-slate-200">
                <span className="grid size-10 place-items-center rounded-2xl bg-brand-600 font-display text-sm font-bold text-white">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-4 text-lg leading-snug">{b.title}</h3>
                <p className="mt-2.5 text-sm leading-relaxed text-slate-600">{b.body}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* ------------------------------------------------------------ Timeline */}
      <Section id="process">
        <Reveal>
          <SectionHeading eyebrow={timeline.eyebrow} title={timeline.title} description={timeline.lead} />
        </Reveal>

        <ol className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {timeline.steps.map((s, i) => (
            <Reveal key={s.title} delay={i * 80}>
              <li className="h-full rounded-3xl bg-white p-7 border border-slate-200">
                <span className="font-display text-4xl font-bold text-brand-100">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-2 text-lg leading-snug">{s.title}</h3>
                <p className="mt-4 text-sm leading-relaxed text-slate-600">
                  <span className="font-semibold text-brand-700">คุณส่งให้เรา · </span>
                  {s.you}
                </p>
                <p className="mt-3 text-sm leading-relaxed text-slate-600">
                  <span className="font-semibold text-brand-700">เราส่งกลับ · </span>
                  {s.us}
                </p>
              </li>
            </Reveal>
          ))}
        </ol>
      </Section>

      {/* -------------------------------------------------------- Deliverables */}
      <section className="relative overflow-hidden bg-brand-950 py-[38px] lg:py-[52px]">
        <div
          aria-hidden
          className="absolute inset-0 bg-[radial-gradient(56rem_28rem_at_15%_0%,var(--color-brand-800),transparent_65%)]"
        />
        <Container className="relative">
          <div className="grid gap-12 lg:grid-cols-[1fr_1.15fr] lg:gap-16">
            <Reveal>
              <SectionHeading
                tone="dark"
                eyebrow={deliverables.eyebrow}
                title={deliverables.title}
                description={deliverables.lead}
              />
              <dl className="mt-10 grid grid-cols-3 gap-px overflow-hidden rounded-3xl bg-white/10 ring-1 ring-white/10">
                {stats.map((s) => (
                  <div key={s.label} className="bg-brand-950/80 p-5 text-center">
                    <dt className="font-display text-2xl font-bold text-white">{s.value}</dt>
                    <dd className="mt-1 text-[0.86rem] text-brand-100/60">{s.label}</dd>
                  </div>
                ))}
              </dl>
            </Reveal>

            <Reveal delay={120}>
              <ul className="grid gap-3">
                {deliverables.items.map((t) => (
                  <li
                    key={t}
                    className="flex gap-3.5 rounded-2xl bg-white/[0.05] px-5 py-4 text-[1.02rem] text-brand-100/85 ring-1 ring-inset ring-white/10"
                  >
                    <Icon.doc className="size-5 shrink-0 text-brand-300" />
                    {t}
                  </li>
                ))}
              </ul>
              <p className="mt-5 text-sm leading-relaxed text-brand-100/55">{deliverables.note}</p>
            </Reveal>
          </div>
        </Container>
      </section>

      {/* --------------------------------------------------------------- Scope */}
      <Section>
        <Reveal>
          <SectionHeading align="center" eyebrow={scope.eyebrow} title={scope.title} description={scope.lead} />
        </Reveal>

        <div className="mt-12 grid gap-6 md:grid-cols-2">
          <Reveal>
            <div className="h-full rounded-4xl bg-brand-50 p-8 border border-slate-200">
              <h3 className="text-xl text-brand-700">{scope.yes.title}</h3>
              <ul className="mt-6 grid gap-3">
                {scope.yes.points.map((p) => (
                  <li key={p} className="flex gap-3 text-[1.02rem] text-slate-700">
                    <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-brand-600 text-white">
                      <svg viewBox="0 0 20 20" className="size-3" fill="none" aria-hidden>
                        <path
                          d="m5 10.5 3.2 3L15 7"
                          stroke="currentColor"
                          strokeWidth="2.4"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </span>
                    {p}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>

          <Reveal delay={100}>
            <div className="h-full rounded-4xl bg-white p-8 border border-slate-200">
              <h3 className="text-xl text-brand-700">{scope.no.title}</h3>
              <ul className="mt-6 grid gap-3">
                {scope.no.points.map((p) => (
                  <li key={p} className="flex gap-3 text-[1.02rem] text-slate-600">
                    <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-slate-200 text-slate-600">
                      <svg viewBox="0 0 20 20" className="size-3" fill="none" aria-hidden>
                        <path d="M6 6l8 8M14 6l-8 8" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
                      </svg>
                    </span>
                    {p}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>

        <Reveal>
          <p className="mx-auto mt-8 max-w-3xl text-center text-[1.02rem] leading-relaxed text-slate-600">
            {scope.outro}
          </p>
        </Reveal>
      </Section>

      {/* ------------------------------------------------------------ Projects */}
      <Section tone="shell">
        <Reveal>
          <SectionHeading
            eyebrow="ผลงานของเรา"
            title="ภาพหน้างานจริงจากโครงการที่ใช้ระบบ Neocoat"
            action={<MoreLink href="/projects">ดูผลงานทั้งหมด</MoreLink>}
          />
        </Reveal>
        <div className="mt-12 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {showcase.map((p, i) => (
            <Reveal key={p.image} delay={i * 70}>
              <figure className="group relative h-full overflow-hidden rounded-2xl bg-brand-100">
                <div className="aspect-4/3">
                  <Image
                    src={p.image}
                    alt={p.title}
                    fill
                    sizes="(min-width: 1024px) 25vw, 45vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-brand-950/90 to-transparent p-4 pt-10">
                  <p className="font-display text-sm font-semibold text-white">{p.title}</p>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* ----------------------------------------------------------------- FAQ */}
      <Section id="faq">
        <Reveal>
          <SectionHeading align="center" eyebrow="คำถามที่พบบ่อย" title="เรื่องที่ลูกค้าถามก่อนตัดสินใจ" />
        </Reveal>
        <div className="mt-12">
          <FaqList items={faqs} />
        </div>
      </Section>

      <CtaBand
        title="ส่งแบบมาให้ประเมินก่อนได้ ไม่มีค่าใช้จ่าย"
        description="ทีมวิศวกรจะทบทวนแบบเบื้องต้น แจ้งกลับว่าขอบเขตงานควรเป็นอย่างไร และต้องใช้เอกสารอะไรบ้าง ภายใน 1–2 วันทำการ"
      />
    </>
  );
}
