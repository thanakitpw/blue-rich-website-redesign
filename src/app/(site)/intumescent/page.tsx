import type { Metadata } from "next";
import { Icon, PageHero, SectionHeading } from "@/components/ui";
import Reveal from "@/components/ui/Reveal";
import {
  CatalogSection,
  CoatingDiagram,
  CtaBand,
  ProductRow,
  Section,
} from "@/components/hub";
import { getProduct } from "@/data/products";

export const metadata: Metadata = {
  title: "สีกันไฟ Neocoat — สูตรน้ำมันและสูตรน้ำ",
  description:
    "สีกันไฟ Neocoat Intumescent Paint สำหรับโครงสร้างเหล็ก ทั้งสูตรน้ำมัน (Intumescent Paint-S) และสูตรน้ำ (Intumescent Paint-W) ผ่านการทดสอบ ASTM E-119 และ ISO 834 พร้อมเอกสารรับรองโดยวุฒิวิศวกร",
};

const solvent = getProduct("neocoat-intumescent-paint-s")!;
const water = getProduct("neocoat-intumescent-paint-w")!;
const primer = getProduct("neocoat-primer-grey-oxide")!;
const topcoat = getProduct("neogloss-enamel")!;

/** Side-by-side comparison — every row is quoted from the two product sheets. */
const compare = [
  { label: "ฐานสูตร", s: "Solvent Base (สูตรน้ำมัน)", w: "Water Base (สูตรน้ำ) · Low VOC" },
  { label: "สี / ลักษณะฟิล์ม", s: "ขาว / เทา · ด้าน", w: "ขาว" },
  { label: "ขนาดบรรจุ", s: "22 กก.", w: "22 กก." },
  { label: "ความหนาฟิล์มแห้ง (DFT)", s: "500 ไมครอน", w: "500 ไมครอน" },
  { label: "อัตราการใช้งาน", s: "23–25 ตร.ม./ถัง", w: "23–25 ตร.ม./ถัง" },
  {
    label: "ตัวทำละลาย",
    s: "ทินเนอร์ AAA · Thinner 4K No.10 ผสม 15–20%",
    w: "น้ำ — ไม่ใช้ทินเนอร์",
  },
  {
    label: "เหมาะกับ",
    s: "โครงสร้างเหล็กภายในอาคาร — เสา คาน โครงถัก",
    w: "อาคารเขียว (Green Building) · งานในสภาวะอากาศร้อน ถ่ายเทสะดวก",
  },
  { label: "มาตรฐานทดสอบ", s: "ISO 834 · ASTM E119 · FSRG 2019/035", w: "ASTM E119" },
  { label: "อายุการจัดเก็บ", s: "1 ปี", w: "1 ปี" },
];

export default function FirePaintPage() {
  return (
    <>
      <PageHero
        eyebrow="Neocoat Intumescent Paint"
        title="สีกันไฟ Neocoat"
        description="สีกันไฟชนิดขยายตัวสำหรับโครงสร้างเหล็ก — เมื่อได้รับความร้อนฟิล์มสีจะพองตัวเป็นชั้นฉนวน หน่วงไม่ให้ความร้อนถึงเนื้อเหล็กตามอัตราการทนไฟที่ออกแบบไว้ มีให้เลือกทั้งสูตรน้ำมันและสูตรน้ำ"
        breadcrumb={[{ label: "หน้าแรก", href: "/" }, { label: "สีกันไฟ Neocoat" }]}
      />

      <CatalogSection products={[solvent, water, primer, topcoat]} />

      {/* -------------------------------------------------- How it works */}
      <Section>
        <div className="grid items-center gap-12 lg:grid-cols-[1fr_1.05fr] lg:gap-16">
          <Reveal>
            <SectionHeading
              eyebrow="หลักการทำงาน"
              title="สีที่พองตัวเป็นฉนวนเมื่อเจอไฟ"
              description="เมื่อได้รับความร้อนจากเพลิงไหม้ ฟิล์มสีจะขยายตัวขึ้นเป็นชั้นหนา ทำหน้าที่เป็นฉนวนกันความร้อน ไม่ให้ความร้อนเข้าถึงเนื้อเหล็กโดยตรง ช่วยรักษาโครงสร้างเหล็กให้คงรูปอยู่ได้นานขึ้นตามระยะเวลาที่ออกแบบไว้ (Fire Rating)"
            />
            <ul className="mt-8 grid gap-3">
              {[
                "ระบบสีครบ 3 ชั้น — รองพื้นกันสนิม → สีกันไฟ → สีทับหน้า",
                "ความหนาชั้นสีกันไฟ 500–3,500 ไมครอน ตามค่า Hp/A ของหน้าตัดจริง",
                "ทาด้วยลูกกลิ้ง แปรง หรือเครื่องพ่นไร้อากาศ (Airless Spray)",
                "ใช้ได้ทั้งผิวงานโลหะและผิวคอนกรีต",
              ].map((t) => (
                <li
                  key={t}
                  className="flex gap-3 rounded-2xl bg-white px-5 py-4 text-[1.02rem] text-slate-700 border border-slate-200"
                >
                  <Icon.shield className="size-5 shrink-0 text-brand-600" />
                  {t}
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal delay={120}>
            <div className="rounded-4xl bg-white p-7 border border-slate-200 sm:p-9">
              <CoatingDiagram />
            </div>
            <p className="mt-4 text-center text-xs text-slate-500">
              ภาพประกอบแสดงลำดับชั้นของระบบสี · สัดส่วนในภาพไม่ใช่สเกลจริง
            </p>
          </Reveal>
        </div>
      </Section>

      {/* --------------------------------------------------- Two formulas */}
      <Section tone="shell" id="formulas">
        <Reveal>
          <SectionHeading
            align="center"
            eyebrow="เลือกสูตรที่ใช่"
            title="สูตรน้ำมัน และ สูตรน้ำ"
            description="เนื้อสีทั้งสองสูตรให้ความหนาฟิล์มแห้งและอัตราการใช้งานเท่ากัน ต่างกันที่ตัวทำละลายและสภาพหน้างานที่เหมาะสม"
          />
        </Reveal>

        <div className="mt-14 space-y-16 lg:space-y-24">
          <ProductRow product={solvent} eyebrow="สูตรน้ำมัน · Solvent Base" />
          <ProductRow product={water} eyebrow="สูตรน้ำ · Low VOC" flip />
        </div>

        <Reveal>
          <div className="mt-16 overflow-hidden rounded-3xl bg-white border border-slate-200">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[40rem] text-left text-sm">
                <thead>
                  <tr className="bg-brand-800 text-white">
                    <th className="px-5 py-4 font-semibold">หัวข้อ</th>
                    <th className="px-5 py-4 font-semibold">สูตรน้ำมัน (Paint-S)</th>
                    <th className="px-5 py-4 font-semibold">สูตรน้ำ (Paint-W)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {compare.map((r) => (
                    <tr key={r.label} className="odd:bg-brand-50/40">
                      <th className="px-5 py-3.5 font-medium text-brand-700">{r.label}</th>
                      <td className="px-5 py-3.5 text-slate-600">{r.s}</td>
                      <td className="px-5 py-3.5 text-slate-600">{r.w}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </Reveal>
      </Section>

      <CtaBand
        title="ต้องใช้สีกันไฟกี่ถัง หนาเท่าไหร่?"
        description="ส่งแบบโครงสร้างหรือรายการ BOQ มาให้ทีมวิศวกรคำนวณความหนาฟิล์มตามค่า Hp/A ของหน้าตัดจริง พร้อมสรุปปริมาณสีและราคาให้"
      />
    </>
  );
}
