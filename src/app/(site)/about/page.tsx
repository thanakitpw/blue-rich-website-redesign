import type { Metadata } from "next";
import Image from "next/image";
import { Button, Icon, PageHero, SectionHeading } from "@/components/ui";
import Reveal from "@/components/ui/Reveal";
import { CtaBand, Section } from "@/components/concept";
import { lineHref, site, standards, stats, telHref } from "@/data/site";
import { categories } from "@/data/products";
import { projects } from "@/data/projects";

export const metadata: Metadata = {
  title: "เกี่ยวกับเรา",
  description:
    "บริษัท บลูริช แมททีเรียล โปรดักส์ จำกัด ผู้จำหน่ายสีกันไฟ สีทนไฟ สีรองพื้นกันสนิม ทินเนอร์ น้ำมันสน และผ้ากันไฟ ดำเนินธุรกิจตามหลักวิศวกรรมที่ถูกต้อง",
};

/**
 * Layout follows the reference the client gave (energyreform-solar.com/about-us):
 * centred intro statement with certification badges → numbered five-step process
 * flow → company overview with stats → values → standards → project gallery →
 * product scope → closing CTA.
 *
 * The reference opens with the company's founding date and registered capital.
 * Blue Rich has not supplied those figures, so that block states what the
 * business does instead — nothing about incorporation is invented here.
 */

const process = [
  {
    title: "ส่งแบบและปรึกษา",
    text: "ส่งแบบโครงสร้างหรือ BOQ ให้ทีมวิศวกรประเมินอัตราการทนไฟที่กฎหมายกำหนด",
  },
  {
    title: "คำนวณและเสนอราคา",
    text: "คำนวณความหนาฟิล์มแห้งตามค่า Hp/A ของแต่ละหน้าตัด พร้อมสรุปปริมาณสีและราคา",
  },
  {
    title: "ส่งของ / ลงหน้างาน",
    text: "จัดส่งสินค้าถึงหน้างาน หรือให้ทีมช่างเข้าดำเนินงานตามระบบสีที่กำหนดไว้",
  },
  {
    title: "ควบคุมคุณภาพ",
    text: "ตรวจการเตรียมผิวและวัดความหนาฟิล์มด้วยเครื่องวัดเป็นระยะ พร้อมบันทึกผล",
  },
  {
    title: "ตรวจรับและรับรอง",
    text: "สรุปผลตรวจและออกเอกสารรับรองลงนามโดยวุฒิวิศวกรโยธาให้ครบชุด",
  },
];

const values = [
  {
    icon: Icon.shield,
    title: "ยึดหลักวิศวกรรมที่ถูกต้อง",
    text: "ดำเนินธุรกิจตามมาตรฐานงานวิศวกรรม ไม่แนะนำระบบที่ต่ำกว่าที่กฎหมายกำหนดเพียงเพื่อลดราคา",
  },
  {
    icon: Icon.users,
    title: "ให้คำปรึกษาตามวัตถุประสงค์งาน",
    text: "ออกแบบและเลือกระบบสีให้สอดคล้องกับลักษณะอาคาร งบประมาณ และเป้าหมายของโครงการ",
  },
  {
    icon: Icon.doc,
    title: "ซื่อสัตย์และรับผิดชอบ",
    text: "ให้ข้อมูลผลิตภัณฑ์ตรงตามจริง มีผลทดสอบและเอกสารรับรองให้ตรวจสอบได้ทุกโครงการ",
  },
  {
    icon: Icon.truck,
    title: "ดูแลทั้งก่อนและหลังการขาย",
    text: "ทีมงานผู้เชี่ยวชาญพร้อมให้บริการตั้งแต่ช่วงเสนอราคา ระหว่างหน้างาน จนถึงหลังส่งมอบ",
  },
];

export default function AboutPage() {
  const gallery = projects.slice(0, 8);

  return (
    <>
      <PageHero
        eyebrow="About Us"
        title="เกี่ยวกับเรา"
        description="ผู้จำหน่ายสีกันไฟสูตรน้ำมันและสูตรน้ำ สีน้ำมัน สีรองพื้น ทินเนอร์ และน้ำมันสน สำหรับงานบ้านพักอาศัย อาคารพาณิชย์ และโรงงานอุตสาหกรรม"
        breadcrumb={[{ label: "หน้าแรก", href: "/" }, { label: "เกี่ยวกับเรา" }]}
      />

      {/* ------------------------------------------------------ Intro statement */}
      <Section>
        <Reveal>
          <div className="mx-auto max-w-4xl text-center">
            <span className="eyebrow-en block text-[14px] text-accent-500">
              Blue Rich Material Products
            </span>
            <h2 className="mt-2 text-[clamp(23px,3vw,34px)] leading-[1.35]">
              ผู้จำหน่ายวัสดุป้องกันอัคคีภัยครบวงจร
              <br className="hidden sm:block" /> พร้อมงานรับรองโดยวุฒิวิศวกรโยธา
            </h2>
            <p className="mx-auto mt-5 max-w-3xl text-[16px] leading-[1.9] text-slate-600">
              {site.name} ดำเนินธุรกิจจำหน่ายสีกันไฟสูตรน้ำมันและสูตรน้ำ สีน้ำมัน สีรองพื้น
              ทินเนอร์ และน้ำมันสน ให้บริการโดยวิศวกรรับรองงาน
              สำหรับงานก่อสร้างหลากหลายประเภท ทั้งบ้านพักอาศัย อาคารพาณิชย์
              และโรงงานอุตสาหกรรม
            </p>
          </div>
        </Reveal>

        <Reveal delay={120}>
          <div className="mt-9 flex flex-wrap justify-center gap-3.5">
            {standards.map((s) => (
              <div
                key={s.label}
                className="min-w-[180px] rounded-2xl border border-slate-200 bg-white px-[22px] py-3.5 text-center shadow-[0_2px_10px_rgba(42,80,104,0.04)]"
              >
                <b className="block text-[16px] font-semibold text-brand-600">{s.label}</b>
                <span className="text-[13px] text-slate-500">{s.note}</span>
              </div>
            ))}
          </div>
        </Reveal>
      </Section>

      {/* -------------------------------------------------------- Process flow */}
      <Section tone="shell">
        <Reveal>
          <SectionHeading
            align="center"
            eyebrow="How we work"
            title="ขั้นตอนการทำงาน 5 ขั้น"
            description="ทุกโครงการเดินตามลำดับเดียวกัน ตั้งแต่วันที่ส่งแบบจนถึงวันที่ได้เอกสารเซ็นแล้ว"
          />
        </Reveal>

        <ol className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-5 lg:gap-3">
          {process.map((p, i) => (
            <Reveal key={p.title} delay={i * 80}>
              <li className="relative flex h-full flex-col items-center rounded-3xl border border-slate-200 bg-white px-5 pt-9 pb-7 text-center">
                <span className="absolute -top-5 grid size-10 place-items-center rounded-full bg-brand-600 text-[17px] font-bold text-white">
                  {i + 1}
                </span>
                <h3 className="text-[17px] leading-snug">{p.title}</h3>
                <p className="mt-2.5 text-[14.5px] leading-relaxed text-slate-500">{p.text}</p>
                {i < process.length - 1 && (
                  <span
                    aria-hidden
                    className="absolute top-1/2 -right-3 hidden size-6 place-items-center rounded-full bg-brand-200 text-brand-700 lg:grid"
                  >
                    <Icon.arrow className="size-3.5" />
                  </span>
                )}
              </li>
            </Reveal>
          ))}
        </ol>
      </Section>

      {/* ------------------------------------------------------ Company overview */}
      <Section>
        <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_1fr] lg:gap-14">
          <Reveal>
            <SectionHeading
              eyebrow="เราคือใคร"
              title="วัสดุงานป้องกันไฟ ที่มาพร้อมความรับผิดชอบทางวิศวกรรม"
            />
            <div className="mt-6 space-y-5 text-[16px] leading-[1.9] text-slate-600">
              <p>
                ขอบเขตผลิตภัณฑ์ของเราครอบคลุมตั้งแต่สีรองพื้น สีทับหน้าเหล็ก ทินเนอร์
                น้ำมันสน ไปจนถึงสีเซรามิคกันความร้อน
                จึงสามารถออกแบบระบบสีทั้งระบบให้กับโครงการได้ในที่เดียว
              </p>
              <p>
                เราให้ความสำคัญกับการดำเนินธุรกิจตามมาตรฐานงานวิศวกรรมที่ถูกต้อง
                ให้คำปรึกษาด้านการออกแบบที่สอดคล้องกับวัตถุประสงค์ของงาน
                เน้นความซื่อสัตย์ในการทำธุรกิจ รับผิดชอบต่อลูกค้า
                และให้บริการทั้งก่อนและหลังการขายโดยทีมงานผู้เชี่ยวชาญ
              </p>
            </div>

            <dl className="mt-8 grid grid-cols-3 gap-x-6 gap-y-5 border-t border-slate-200 pt-7">
              {stats.map((s) => (
                <div key={s.label}>
                  <dt className="text-2xl leading-[1.1] font-bold text-brand-600">{s.value}</dt>
                  <dd className="mt-1 text-[13.5px] text-slate-500">{s.label}</dd>
                </div>
              ))}
            </dl>

            <div className="mt-8 flex flex-wrap gap-2.5">
              <Button href="/products" size="lg">
                ดูสินค้าของเรา
                <Icon.arrow />
              </Button>
              <Button href="/projects" variant="ghost" size="lg">
                ดูผลงานที่ผ่านมา
              </Button>
            </div>
          </Reveal>

          <Reveal delay={120}>
            <div className="relative aspect-4/3 overflow-hidden rounded-4xl border border-slate-200">
              <Image
                src="/assets/products/neocoat-paint-w-warehouse.webp"
                alt="คลังสินค้า Blue Rich Material Products"
                fill
                sizes="(min-width: 1024px) 46vw, 92vw"
                className="object-cover"
              />
              <span
                aria-hidden
                className="absolute inset-0 bg-gradient-to-t from-brand-900/45 to-transparent"
              />
              <span className="absolute right-5 bottom-5 grid size-[110px] place-items-center rounded-full bg-gradient-to-br from-accent-500 to-brand-500 shadow-[0_10px_26px_rgba(32,64,79,0.35)]">
                <span className="grid size-[90px] place-content-center rounded-full bg-white p-1.5 text-center leading-[1.1]">
                  <b className="block text-3xl font-bold text-brand-700">1</b>
                  <span className="mt-px block text-[9.5px] font-semibold tracking-[0.07em] text-accent-500 uppercase">
                    One Stop Service
                  </span>
                </span>
              </span>
            </div>
          </Reveal>
        </div>
      </Section>

      {/* -------------------------------------------------------------- Values */}
      <Section tone="shell">
        <Reveal>
          <SectionHeading
            align="center"
            eyebrow="แนวทางการทำงาน"
            title="สิ่งที่เรายึดถือในทุกโครงการ"
          />
        </Reveal>
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {values.map((v, i) => (
            <Reveal key={v.title} delay={i * 80}>
              <div className="h-full rounded-3xl border border-slate-200 bg-white p-7">
                <span className="grid size-12 place-items-center rounded-2xl bg-brand-50 text-brand-600">
                  <v.icon />
                </span>
                <h3 className="mt-5 text-[18px]">{v.title}</h3>
                <p className="mt-3 text-[14.5px] leading-relaxed text-slate-500">{v.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* ------------------------------------------------------------- Gallery */}
      <Section>
        <Reveal>
          <SectionHeading
            title="ภาพหน้างานจริงจากโครงการของเรา"
            action={
              <Button href="/projects" variant="ghost" size="sm">
                ผลงานทั้งหมด
                <Icon.arrow />
              </Button>
            }
          />
        </Reveal>
        <div className="mt-[26px] grid grid-cols-2 gap-3.5 md:grid-cols-4">
          {gallery.map((p, i) => (
            <Reveal key={p.image} delay={(i % 4) * 60}>
              <figure className="group relative aspect-16/9 overflow-hidden rounded-2xl bg-slate-100">
                <Image
                  src={p.image}
                  alt={p.title}
                  fill
                  sizes="(min-width: 768px) 25vw, 45vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-[1.06]"
                />
                <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-brand-900/85 to-transparent px-3 pt-8 pb-2.5 text-[13px] font-medium text-white opacity-0 transition group-hover:opacity-100">
                  {p.title}
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* -------------------------------------------------------- Product scope */}
      <Section tone="shell">
        <Reveal>
          <SectionHeading
            align="center"
            eyebrow="ขอบเขตผลิตภัณฑ์"
            title="ครบทุกวัสดุที่โครงการเหล็กต้องใช้"
          />
        </Reveal>
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((c, i) => (
            <Reveal key={c.slug} delay={i * 70}>
              <div className="h-full rounded-3xl border border-slate-200 bg-white p-6">
                <span className="eyebrow-en block text-[12px] tracking-[0.07em] text-accent-500">
                  {c.short}
                </span>
                <h3 className="mt-1 text-[18px]">{c.name}</h3>
                <p className="mt-2.5 text-[14.5px] leading-relaxed text-slate-500">
                  {c.description}
                </p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={200}>
          <div className="mt-11 flex flex-col items-center gap-5 text-center">
            <p className="max-w-2xl text-slate-600">
              เรามั่นใจว่าผลิตภัณฑ์ของเราจะตอบโจทย์ความต้องการของลูกค้าได้อย่างครอบคลุมในทุกลักษณะงาน
              หากมีข้อสงสัย ทีมงานยินดีให้คำปรึกษาโดยไม่มีค่าใช้จ่าย
            </p>
            <div className="flex flex-wrap justify-center gap-2.5">
              <Button href={telHref} size="lg">
                <Icon.phone />
                โทร {site.phones[0]}
              </Button>
              <Button href={lineHref} size="lg" variant="line">
                <Icon.line />
                แอดไลน์ @{site.lineId}
              </Button>
            </div>
          </div>
        </Reveal>
      </Section>

      <CtaBand />
    </>
  );
}
