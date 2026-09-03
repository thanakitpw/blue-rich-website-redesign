import type { Metadata } from "next";
import { MoreLink, PageHero, SectionHeading } from "@/components/ui";
import Reveal from "@/components/ui/Reveal";
import { CatalogSection, CtaBand, MiniProduct, ProductRow, Section } from "@/components/hub";
import { getProduct } from "@/data/products";
import { lineHref } from "@/data/site";

export const metadata: Metadata = {
  title: "สีน้ำ / สีน้ำมัน — รองพื้นกันสนิม ทับหน้าเหล็ก รองพื้นปูน และสีน้ำพลาสติก",
  description:
    "สีรองพื้นกันสนิมทาเหล็ก Neocoat Primer Grey Oxide, สีน้ำมันทับหน้าเหล็ก Neogloss, สีรองพื้นปูนใหม่-เก่า Four Plus Pro Masonry Sealer และสีน้ำพลาสติกอะคริลิก 100% ทาภายในและภายนอก",
};

const primer = getProduct("neocoat-primer-grey-oxide")!;
const topcoat = getProduct("neogloss-enamel")!;
const masonry = getProduct("four-plus-pro-masonry-sealer")!;
const exterior = getProduct("four-plus-exterior")!;
const interior = getProduct("four-plus-pro-interior")!;
const roofShield = getProduct("roof-shield-ceramic")!;

/** Anchor targets mirror the four sub-items in the client's menu sketch. */
const groups = [
  { id: "steel-primer", label: "สีรองพื้นกันสนิมทาเหล็ก", note: "ชั้นที่ 1 ของงานเหล็ก" },
  { id: "steel-topcoat", label: "สีทับหน้าเหล็ก", note: "ชั้นปิดผิว กันความชื้น" },
  { id: "masonry", label: "สีรองพื้นปูนใหม่/เก่า", note: "ทนด่าง เพิ่มการยึดเกาะ" },
  { id: "emulsion", label: "สีน้ำพลาสติก", note: "ภายใน–ภายนอก อะคริลิก 100%" },
];

export default function PaintPage() {
  return (
    <>
      <PageHero
        eyebrow="Paint & Coating"
        title="สีน้ำ / สีน้ำมัน"
        description="กลุ่มสีสำหรับงานทั่วไปนอกเหนือจากสีกันไฟ — ตั้งแต่รองพื้นกันสนิมและสีทับหน้าสำหรับงานเหล็ก ไปจนถึงรองพื้นปูนและสีน้ำพลาสติกสำหรับงานผนัง"
        breadcrumb={[{ label: "หน้าแรก", href: "/" }, { label: "สีน้ำ / สีน้ำมัน" }]}
      />

      <CatalogSection
        products={[primer, topcoat, masonry, exterior, interior, roofShield]}
      />

      {/* ------------------------------------------------------- Quick jump */}
      <section className="border-b border-slate-200 bg-white py-6">
        <div className="mx-auto w-full max-w-[1200px] px-5 sm:px-8">
          <div className="mask-fade-x -mx-1 overflow-x-auto">
            <div className="flex min-w-max gap-3 px-1">
              {groups.map((g) => (
                <a
                  key={g.id}
                  href={`#${g.id}`}
                  className="group rounded-2xl bg-brand-50 px-5 py-3 border border-slate-200 transition hover:bg-brand-100/70"
                >
                  <span className="block text-[1rem] font-semibold text-brand-700">
                    {g.label}
                  </span>
                  <span className="mt-0.5 block text-[0.82rem] text-slate-500">{g.note}</span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* --------------------------------------------------------- Steel system */}
      <Section>
        <Reveal>
          <SectionHeading
            eyebrow="งานเหล็ก"
            title="ระบบสีสำหรับโครงสร้างเหล็ก"
            description="ระบบสีเหล็กมาเป็นชุด — รองพื้นกันสนิมยึดเกาะกับเนื้อเหล็ก แล้วปิดท้ายด้วยสีทับหน้าที่กันความชื้นและทำความสะอาดง่าย เมื่อมีงานกันไฟ ชั้นสีกันไฟจะแทรกอยู่ตรงกลางระหว่างสองชั้นนี้"
          />
        </Reveal>

        <div className="mt-14 space-y-16 lg:space-y-24">
          <ProductRow product={primer} id="steel-primer" eyebrow="ชั้นที่ 1 · Primer Coat" />
          <ProductRow product={topcoat} id="steel-topcoat" eyebrow="ชั้นปิดผิว · Top Coat" flip />
        </div>

        <Reveal>
          <div className="mt-14 grid gap-4 rounded-4xl bg-brand-900 p-8 text-white sm:grid-cols-3 lg:p-10">
            {[
              { n: "1", t: "สีรองพื้นกันสนิม", d: "ยึดเกาะเนื้อเหล็ก ป้องกันสนิม" },
              { n: "2", t: "สีกันไฟ (ถ้ามี)", d: "ชั้นพองตัวหน่วงความร้อน" },
              { n: "3", t: "สีทับหน้า", d: "กันความชื้น ฝุ่น และเพิ่มความสวยงาม" },
            ].map((s) => (
              <div key={s.n} className="rounded-3xl bg-white/[0.07] p-6 ring-1 ring-inset ring-white/10">
                <span className="font-display text-3xl font-bold text-brand-300">{s.n}</span>
                <p className="mt-2 font-display font-semibold text-white">{s.t}</p>
                <p className="mt-1.5 text-sm text-brand-100/70">{s.d}</p>
              </div>
            ))}
          </div>
          <p className="mt-4 text-center text-sm text-slate-500">
            ต้องการระบบกันไฟด้วย?{" "}
            <a href="/intumescent" className="font-semibold text-brand-700 underline underline-offset-4">
              ดูสีกันไฟ Neocoat
            </a>
          </p>
        </Reveal>
      </Section>

      {/* ------------------------------------------------------ Masonry system */}
      <Section tone="shell">
        <Reveal>
          <SectionHeading
            eyebrow="งานปูน / ผนัง"
            title="ระบบสีสำหรับงานปูนและผนัง"
            description="ผนังปูนใหม่ยังมีความเป็นด่างสูงและดูดซึมสูง การรองพื้นก่อนจึงช่วยให้สีทับหน้าเกาะได้ดีและสีไม่ด่างในภายหลัง"
          />
        </Reveal>

        <div className="mt-14 space-y-16 lg:space-y-24">
          <ProductRow product={masonry} id="masonry" eyebrow="รองพื้นปูน · Masonry Sealer" />
        </div>

        <div id="emulsion" className="mt-16 scroll-mt-40 lg:mt-24">
          <Reveal>
            <SectionHeading
              eyebrow="สีน้ำพลาสติก"
              title="สีน้ำพลาสติกอะคริลิก 100% ภายในและภายนอก"
              description="เลือกสูตรตามตำแหน่งผนัง — ภายนอกเน้นทนแดดทนฝนและกันเชื้อรา–ตะไคร่น้ำ ภายในเน้นผิวด้านเรียบเนียนและทนด่าง"
              action={<MoreLink href="/products?cat=emulsion-paint">ดูทั้งหมดในหมวดนี้</MoreLink>}
            />
          </Reveal>

          <div className="mt-12 space-y-16 lg:space-y-24">
            <ProductRow product={exterior} eyebrow="ทาภายนอก · Exterior" flip />
            <ProductRow product={interior} eyebrow="ทาภายใน · Interior" />
          </div>
        </div>
      </Section>

      {/* ------------------------------------------------------------- Related */}
      <Section>
        <Reveal>
          <SectionHeading
            eyebrow="สินค้าที่เกี่ยวข้อง"
            title="สีและวัสดุอื่นที่มักสั่งพร้อมกัน"
            description="ตัวทำละลายสำหรับสีสูตรน้ำมัน และสีเซรามิคสะท้อนความร้อนสำหรับงานหลังคาและผนัง"
          />
        </Reveal>
        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          <Reveal>
            <MiniProduct product={roofShield} />
          </Reveal>
          <Reveal delay={60}>
            <MiniProduct product={getProduct("thinner-3a-intanin")!} />
          </Reveal>
          <Reveal delay={120}>
            <MiniProduct product={getProduct("turpentine-intanin")!} />
          </Reveal>
          <Reveal delay={180}>
            <MiniProduct product={getProduct("neocoat-intumescent-paint-s")!} />
          </Reveal>
        </div>

        <Reveal>
          <p className="mt-10 text-center text-sm text-slate-500">
            ไม่แน่ใจว่าต้องใช้สีตัวไหนกับงานของคุณ?{" "}
            <a href={lineHref} target="_blank" rel="noreferrer" className="font-semibold text-brand-700 underline underline-offset-4">
              ทักไลน์ให้ทีมงานช่วยเลือก
            </a>
          </p>
        </Reveal>
      </Section>

      <CtaBand
        title="สั่งเป็นชุดทั้งระบบ ราคาดีกว่าซื้อแยก"
        description="แจ้งพื้นที่งานและชนิดผิวที่จะทา ทีมงานจะสรุปปริมาณสีแต่ละชั้นและเสนอราคาให้ทั้งชุด พร้อมราคาพิเศษสำหรับผู้รับเหมา"
      />
    </>
  );
}
