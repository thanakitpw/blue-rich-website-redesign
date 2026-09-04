import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Button, Icon, PageHero, SectionHeading } from "@/components/ui";
import Reveal from "@/components/ui/Reveal";
import { CatalogSection, CtaBand, ProductRow, Section } from "@/components/hub";
import { bundleFor } from "@/data/site";
import { getProduct, getSiteInfo } from "@/lib/cms/content";

export const metadata: Metadata = {
  title: "ฮาร์ดแวร์ — ทินเนอร์ น้ำมันสน และผ้ากันไฟ",
  description:
    "ทินเนอร์ 3A (AAA) อินทนิล, น้ำมันสนเชียงใหม่ อินทนิล, ทินเนอร์ 2K Centare และผ้ากันไฟ Fiberglass Cloth ทน 550–1000°C พร้อมส่งสำหรับงานอุตสาหกรรมและงานโครงการ",
};



/**
 * Solvent pairing guide. Every row is quoted from the “ตัวทำละลาย” spec of the
 * paint it refers to — nothing here is a general recommendation of our own.
 */
const pairing = [
  {
    job: "สีรองพื้น · สีทับหน้า · สีชนิดโซลเวนต์",
    use: "ทินเนอร์ AAA (3A) หรือ น้ำมันสน",
    note: "ใช้เป็นตัวทำละลายผสมสีสูตรน้ำมันชนิดต่าง ๆ",
  },
  {
    job: "สีกันไฟ Neocoat สูตรน้ำมัน (Paint-S)",
    use: "ทินเนอร์ AAA · Thinner 4K No.10",
    note: "ผสม 15–20 % ตามที่ระบุใน TDS",
  },
  {
    job: "สีกันไฟ Neocoat สูตรน้ำ (Paint-W)",
    use: "น้ำ — ไม่ใช้ทินเนอร์",
    note: "สูตร Low VOC ไม่ใช้ทินเนอร์เป็นตัวทำละลาย",
  },
  {
    job: "สีเคลือบเงา Neogloss (แปรง / ลูกกลิ้ง)",
    use: "Victor Thinner AAA",
    note: "ผสม 5–10 % ตามตารางในแคตตาล็อกสินค้า",
  },
  {
    job: "สีพ่นรถยนต์ · สีจริง",
    use: "ทินเนอร์ 2K Centare",
    note: "อะคริลิคเกรดพรีเมียม เหมาะกับอากาศร้อนชื้น",
  },
  {
    job: "ล้างมือ เครื่องมือช่าง และอุปกรณ์",
    use: "ทินเนอร์ AAA / น้ำมันสน / ทินเนอร์ล้างเครื่องมือ",
    note: "สอบถามชนิดที่เหมาะกับงานได้ที่ฝ่ายขาย",
  },
];

export default async function HardwarePage() {
  const [thinner3a, turpentine, thinner2k, blanket, info] = await Promise.all([
    getProduct("thinner-3a-intanin"),
    getProduct("turpentine-intanin"),
    getProduct("thinner-2k"),
    getProduct("fiberglass-cloth"),
    getSiteInfo(),
  ]);
  if (!thinner3a || !turpentine || !thinner2k || !blanket) notFound();
  const { telHref, lineHref } = bundleFor(info, []);

  return (
    <>
      <PageHero
        eyebrow="Hardware & Solvent"
        title="ฮาร์ดแวร์"
        description="ตัวทำละลายและอุปกรณ์กันไฟที่หน้างานต้องใช้คู่กับสี — ทินเนอร์ 3A ทินเนอร์ 2K น้ำมันสนเชียงใหม่ และผ้ากันไฟไฟเบอร์กลาส มีสต็อกพร้อมส่ง"
        breadcrumb={[{ label: "หน้าแรก", href: "/" }, { label: "ฮาร์ดแวร์" }]}
      />

      <CatalogSection products={[thinner3a, turpentine, thinner2k, blanket]} columns={2} />

      {/* --------------------------------------------------------- Wash thinner */}
      <Section id="thinner-wash" tone="shell">
        <div className="grid items-center gap-10 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
          <Reveal>
            <SectionHeading
              eyebrow="ทินเนอร์ล้าง"
              title="ทินเนอร์ล้างเครื่องมือและอุปกรณ์"
              description="ใช้ล้างมือ เครื่องมือช่าง แปรง ลูกกลิ้ง และอุปกรณ์พ่นสี หลังจบงานสีสูตรน้ำมัน มีจำหน่ายคู่กับทินเนอร์ผสมสีและน้ำมันสนในกลุ่มเดียวกัน"
            />
            <ul className="mt-8 grid gap-3">
              {[
                "ล้างแปรง ลูกกลิ้ง และหัวพ่นหลังใช้งานสีสูตรน้ำมัน",
                "สั่งพร้อมทินเนอร์ผสมสีและน้ำมันสนได้ในบิลเดียว",
                "สอบถามขนาดบรรจุและราคาที่ฝ่ายขาย",
              ].map((t) => (
                <li
                  key={t}
                  className="flex gap-3 rounded-2xl bg-white px-5 py-4 text-[1.02rem] text-slate-700 border border-slate-200"
                >
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
                  {t}
                </li>
              ))}
            </ul>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button href={lineHref} variant="line" size="lg">
                <Icon.line />
                สอบถามผ่าน LINE
              </Button>
              <Button href={telHref} variant="secondary" size="lg">
                <Icon.phone />
                โทรถามฝ่ายขาย
              </Button>
            </div>
          </Reveal>

          <Reveal delay={120}>
            <div className="rounded-4xl bg-white p-7 border border-slate-200 sm:p-9">
              <p className="font-display text-lg font-semibold text-brand-700">
                ทินเนอร์ล้าง ต่างจากทินเนอร์ผสมสียังไง
              </p>
              <p className="mt-3 text-[1.02rem] leading-relaxed text-slate-600">
                ทินเนอร์ผสมสี เช่น ทินเนอร์ AAA (3A) และน้ำมันสน ใช้เจือจางเนื้อสีให้ได้ความข้นเหลว
                ตามที่ TDS กำหนด ซึ่งมีผลโดยตรงกับความหนาฟิล์มที่ได้
                ส่วนทินเนอร์ล้างใช้กับการทำความสะอาดอุปกรณ์หลังจบงานเท่านั้น
                ไม่ควรนำมาผสมเนื้อสีแทนกัน
              </p>
              <p className="mt-4 rounded-2xl bg-brand-50 px-5 py-4 text-sm leading-relaxed text-brand-700 border border-slate-200">
                หากไม่แน่ใจว่าสีที่ใช้อยู่ต้องผสมด้วยตัวไหน ให้ยึดตาม TDS ของสีตัวนั้นเป็นหลัก
                หรือส่งรูปฉลากมาให้ทีมงานช่วยดูได้
              </p>
            </div>
          </Reveal>
        </div>
      </Section>

      {/* -------------------------------------------------------- Pairing guide */}
      <Section tone="shell">
        <Reveal>
          <SectionHeading
            eyebrow="ตารางเลือกใช้"
            title="งานแบบไหน ใช้ตัวทำละลายตัวไหน"
            description="อ้างอิงจากข้อมูลทางเทคนิคของสีแต่ละตัว — ถ้าใช้สียี่ห้ออื่น ให้ยึดตาม TDS ของสีตัวนั้นเป็นหลัก"
          />
        </Reveal>

        <Reveal>
          <div className="mt-12 overflow-hidden rounded-3xl bg-white border border-slate-200">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[44rem] text-left text-sm">
                <thead>
                  <tr className="bg-brand-800 text-white">
                    <th className="px-5 py-4 font-semibold">ประเภทงาน / ชนิดสี</th>
                    <th className="px-5 py-4 font-semibold">ตัวทำละลายที่ใช้</th>
                    <th className="px-5 py-4 font-semibold">หมายเหตุ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {pairing.map((r) => (
                    <tr key={r.job} className="odd:bg-brand-50/40">
                      <th className="px-5 py-3.5 font-medium text-brand-700">{r.job}</th>
                      <td className="px-5 py-3.5 font-semibold text-brand-700">{r.use}</td>
                      <td className="px-5 py-3.5 text-slate-600">{r.note}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <p className="mt-4 text-sm text-slate-500">
            ไม่แน่ใจว่าสีที่มีอยู่ใช้ตัวไหน{" "}
            <a href={lineHref} target="_blank" rel="noreferrer" className="font-semibold text-brand-700 underline underline-offset-4">
              ส่งรูปฉลากมาทางไลน์
            </a>{" "}
            ให้ทีมงานช่วยดูได้
          </p>
        </Reveal>
      </Section>

      {/* -------------------------------------------------------- Fire blanket */}
      <Section id="fire-blanket">
        <Reveal>
          <SectionHeading
            eyebrow="อุปกรณ์กันไฟ"
            title="ผ้ากันไฟ Fiberglass Cloth"
            description="ใช้คลุมกันสะเก็ดไฟงานเชื่อมและงานตัด รวมถึงงานฉนวนความร้อน เลือกความหนาและการเคลือบซิลิโคนได้ตามลักษณะงาน"
          />
        </Reveal>
        <div className="mt-12">
          <ProductRow product={blanket} eyebrow="ทน 550–1000°C" />
        </div>
      </Section>

      {/* -------------------------------------------------------------- Notice */}
      <Section tone="shell">
        <Reveal>
          <div className="grid gap-6 md:grid-cols-3">
            {[
              {
                icon: Icon.truck,
                title: "มีสต็อกพร้อมส่ง",
                text: "ทินเนอร์และน้ำมันสนมีขนาด 9 / 15 / 150 กก. สำหรับงานหน้าร้านจนถึงงานโครงการ จัดส่งตรงถึงหน้างาน",
              },
              {
                icon: Icon.doc,
                title: "มีเอกสาร MSDS",
                text: "ขอเอกสารความปลอดภัย (MSDS) ของทินเนอร์ AAA (3A) อินทนิล ได้จากหน้าสินค้า หรือขอฉบับเต็มที่ฝ่ายขาย",
              },
              {
                icon: Icon.users,
                title: "ราคาผู้รับเหมา",
                text: "สั่งเป็นปริมาณสำหรับงานโครงการมีราคาพิเศษ แจ้งปริมาณและกำหนดส่งมาให้ทีมงานเสนอราคาได้",
              },
            ].map((c, i) => (
              <div
                key={c.title}
                className="rounded-3xl bg-white p-7 border border-slate-200"
                style={{ transitionDelay: `${i * 60}ms` }}
              >
                <span className="grid size-12 place-items-center rounded-2xl bg-brand-50 text-brand-600 border border-slate-200">
                  <c.icon />
                </span>
                <h3 className="mt-5 text-lg">{c.title}</h3>
                <p className="mt-2.5 text-sm leading-relaxed text-slate-600">{c.text}</p>
              </div>
            ))}
          </div>
        </Reveal>
      </Section>

      <CtaBand
        title="สั่งทินเนอร์และผ้ากันไฟเป็นล็อต"
        description="แจ้งชนิด ขนาดบรรจุ และปริมาณที่ต้องการ ทีมงานจะเช็กสต็อกและเสนอราคาพร้อมค่าจัดส่งให้ในวันเดียวกัน"
      />
    </>
  );
}
