import type { Metadata } from "next";
import Image from "next/image";
import { Button, Container, Icon, PageHero, SectionHeading } from "@/components/ui";
import Reveal from "@/components/ui/Reveal";
import { lineHref, site, standards, stats, telHref } from "@/data/site";
import { categories } from "@/data/products";

export const metadata: Metadata = {
  title: "เกี่ยวกับเรา",
  description:
    "บริษัท บลูริช แมททีเรียล โปรดักส์ จำกัด ผู้จำหน่ายสีกันไฟ สีทนไฟ สีรองพื้นกันสนิม ทินเนอร์ น้ำมันสน และผ้ากันไฟ ดำเนินธุรกิจตามหลักวิศวกรรมที่ถูกต้อง",
};

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
  return (
    <>
      <PageHero
        eyebrow="About Us"
        title="บริษัท บลูริช แมททีเรียล โปรดักส์ จำกัด"
        description="ผู้จำหน่ายสีกันไฟสูตรน้ำมันและสูตรน้ำ สีน้ำมัน สีรองพื้น ทินเนอร์ และน้ำมันสน สำหรับงานบ้านพักอาศัย อาคารพาณิชย์ และโรงงานอุตสาหกรรม"
        breadcrumb={[{ label: "หน้าหลัก", href: "/" }, { label: "เกี่ยวกับเรา" }]}
      />

      {/* Story */}
      <section className="py-16 lg:py-24">
        <Container>
          <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_1fr] lg:gap-16">
            <Reveal>
              <SectionHeading
                eyebrow="เราคือใคร"
                title="วัสดุงานป้องกันไฟ ที่มาพร้อมความรับผิดชอบทางวิศวกรรม"
              />
              <div className="mt-6 space-y-5 text-[1.02rem] leading-[1.9] text-slate-600">
                <p>
                  บริษัท บลูริช แมททีเรียล โปรดักส์ จำกัด
                  ดำเนินธุรกิจจำหน่ายสีกันไฟสูตรน้ำมันและสูตรน้ำ สีน้ำมัน สีรองพื้น ทินเนอร์
                  และน้ำมันสน ให้บริการโดยวิศวกรรับรองงาน สำหรับงานก่อสร้างหลากหลายประเภท
                  ทั้งบ้านพักอาศัย อาคารพาณิชย์ และโรงงานอุตสาหกรรม
                </p>
                <p>
                  ขอบเขตผลิตภัณฑ์ของเราครอบคลุมตั้งแต่สีรองพื้น สีทับหน้าเหล็ก ทินเนอร์ น้ำมันสน
                  ซีเมนต์กันไฟ ไปจนถึงสีเซรามิคกันความร้อน
                  จึงสามารถออกแบบระบบสีทั้งระบบให้กับโครงการได้ในที่เดียว
                </p>
                <p>
                  เราให้ความสำคัญกับการดำเนินธุรกิจตามมาตรฐานงานวิศวกรรมที่ถูกต้อง
                  ให้คำปรึกษาด้านการออกแบบที่สอดคล้องกับวัตถุประสงค์ของงาน
                  เน้นความซื่อสัตย์ในการทำธุรกิจ รับผิดชอบต่อลูกค้า
                  และให้บริการทั้งก่อนและหลังการขายโดยทีมงานผู้เชี่ยวชาญ
                </p>
              </div>

              <div className="mt-9 flex flex-wrap gap-3">
                <Button href="/products" size="lg">
                  ดูสินค้าของเรา
                  <Icon.arrow />
                </Button>
                <Button href="/projects" variant="secondary" size="lg">
                  ดูผลงานที่ผ่านมา
                </Button>
              </div>
            </Reveal>

            <Reveal delay={120}>
              <div className="relative">
                {/* Diamond motif from the brand identity */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-4">
                    <Image
                      src="/assets/work-06.jpg"
                      alt="ลานเตรียมงานทาสีกันไฟหน้าโรงงาน"
                      width={800}
                      height={600}
                      className="h-auto w-full rounded-3xl object-cover shadow-lg shadow-brand-950/10"
                    />
                    <Image
                      src="/assets/work-10.jpg"
                      alt="สีกันไฟ Neocoat พร้อมส่งหน้าโครงการ"
                      width={800}
                      height={600}
                      className="h-auto w-full rounded-3xl object-cover shadow-lg shadow-brand-950/10"
                    />
                  </div>
                  <div className="space-y-4 pt-10">
                    <Image
                      src="/assets/work-02.jpg"
                      alt="งานทาสีกันไฟโครงถักเหล็ก"
                      width={800}
                      height={600}
                      className="h-auto w-full rounded-3xl object-cover shadow-lg shadow-brand-950/10"
                    />
                    <Image
                      src="/assets/work-12.jpg"
                      alt="คานเหล็กประกอบขนาดใหญ่"
                      width={800}
                      height={600}
                      className="h-auto w-full rounded-3xl object-cover shadow-lg shadow-brand-950/10"
                    />
                  </div>
                </div>
                <div
                  aria-hidden
                  className="absolute -top-8 -right-8 -z-10 size-40 rotate-45 rounded-[26%] bg-brand-100"
                />
              </div>
            </Reveal>
          </div>
        </Container>
      </section>

      {/* Values */}
      <section className="bg-slate-50 py-16 lg:py-24">
        <Container>
          <Reveal>
            <SectionHeading
              align="center"
              eyebrow="แนวทางการทำงาน"
              title="สิ่งที่เรายึดถือในทุกโครงการ"
            />
          </Reveal>
          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((v, i) => (
              <Reveal key={v.title} delay={i * 80}>
                <div className="h-full rounded-3xl bg-white p-7 ring-1 ring-slate-200/80">
                  <span className="grid size-12 place-items-center rounded-2xl bg-brand-50 text-brand-600">
                    <v.icon />
                  </span>
                  <h3 className="mt-5 text-lg">{v.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-slate-500">{v.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* Standards */}
      <section className="py-16 lg:py-24">
        <Container>
          <div className="grid gap-12 lg:grid-cols-[1fr_1.15fr] lg:gap-16">
            <Reveal>
              <div className="overflow-hidden rounded-4xl shadow-2xl shadow-brand-950/15 ring-1 ring-slate-200">
                <Image
                  src="/assets/cert-documents.jpg"
                  alt="เอกสารการรับรองโครงสร้างเหล็กงานสีกันไฟ"
                  width={1200}
                  height={1200}
                  sizes="(min-width: 1024px) 45vw, 92vw"
                  className="h-auto w-full"
                />
              </div>
            </Reveal>

            <Reveal delay={120}>
              <SectionHeading
                eyebrow="มาตรฐานและการรับรอง"
                title="ผลทดสอบและเอกสารที่ตรวจสอบได้จริง"
                description="ผลิตภัณฑ์สีกันไฟของเราผ่านการทดสอบจากสถาบันที่ได้รับการยอมรับ และทุกโครงการรับรองโดยวุฒิวิศวกรโยธา"
              />
              <ul className="mt-8 grid gap-3 sm:grid-cols-2">
                {standards.map((s) => (
                  <li
                    key={s.label}
                    className="rounded-2xl bg-brand-50/70 p-5 ring-1 ring-inset ring-brand-100"
                  >
                    <p className="font-display font-semibold text-brand-900">{s.label}</p>
                    <p className="mt-1 text-sm text-slate-500">{s.note}</p>
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        </Container>
      </section>

      {/* Stats + scope */}
      <section className="relative overflow-hidden bg-brand-950 py-16 lg:py-24">
        <div
          aria-hidden
          className="absolute inset-0 bg-[radial-gradient(56rem_28rem_at_15%_0%,var(--color-brand-800),transparent_65%)]"
        />
        <Container className="relative">
          <Reveal>
            <SectionHeading
              tone="dark"
              align="center"
              eyebrow="ขอบเขตผลิตภัณฑ์"
              title="ครบทุกวัสดุที่โครงการเหล็กต้องใช้"
            />
          </Reveal>

          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {categories.map((c, i) => (
              <Reveal key={c.slug} delay={i * 80}>
                <div className="h-full rounded-3xl bg-white/[0.04] p-6 ring-1 ring-inset ring-white/10">
                  <span className="text-[0.68rem] font-semibold tracking-[0.15em] text-brand-300 uppercase">
                    {c.short}
                  </span>
                  <h3 className="mt-2 text-lg text-white">{c.name}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-brand-100/65">{c.description}</p>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal delay={200}>
            <dl className="mt-12 grid gap-px overflow-hidden rounded-3xl bg-white/10 ring-1 ring-white/10 sm:grid-cols-2 lg:grid-cols-4">
              {stats.map((s) => (
                <div key={s.label} className="bg-brand-950/80 p-7 text-center">
                  <dt className="font-display text-3xl font-bold text-white lg:text-4xl">
                    {s.value}
                  </dt>
                  <dd className="mt-2 text-sm text-brand-100/60">{s.label}</dd>
                </div>
              ))}
            </dl>
          </Reveal>

          <Reveal delay={260}>
            <div className="mt-12 flex flex-col items-center gap-6 text-center">
              <p className="max-w-2xl text-brand-100/75">
                เรามั่นใจว่าผลิตภัณฑ์ของเราจะตอบโจทย์ความต้องการของลูกค้าได้อย่างครอบคลุมในทุกลักษณะงาน
                หากมีข้อสงสัย ทีมงานยินดีให้คำปรึกษาโดยไม่มีค่าใช้จ่าย
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                <Button href={telHref} size="lg" variant="secondary">
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
        </Container>
      </section>
    </>
  );
}
