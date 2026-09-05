import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Icon, PageHero, SectionHeading } from "@/components/ui";
import Reveal from "@/components/ui/Reveal";
import {
  CatalogSection,
  CoatingDiagram,
  CtaBand,
  ProductRow,
  Section,
} from "@/components/hub";
import { getProduct } from "@/lib/cms/content";
import { copyFor } from "@/lib/cms/copy-pages";

export async function generateMetadata(): Promise<Metadata> {
  const { meta } = await copyFor("intumescent");
  return meta;
}



export default async function FirePaintPage() {
  /* หน้านี้โชว์เฉพาะสีกันไฟสองสูตรตามที่ลูกค้าขอ — รองพื้นกันสนิมกับสีทับหน้า
     ย้ายไปอยู่หน้า /paint แทน ถึงจะยังพูดถึงในหัวข้อ "ระบบสีครบ 3 ชั้น" ก็ตาม */
  const [solvent, water, { hero, howItWorks, formulas, compare, cta }] = await Promise.all([
    getProduct("neocoat-intumescent-paint-s"),
    getProduct("neocoat-intumescent-paint-w"),
    copyFor("intumescent"),
  ]);
  if (!solvent || !water) notFound();

  return (
    <>
      <PageHero
        eyebrow={hero.eyebrow}
        title={hero.title}
        description={hero.description}
        breadcrumb={[{ label: "หน้าแรก", href: "/" }, { label: hero.crumb }]}
      />

      {/* เหลือสองใบ ใช้กริดสองคอลัมน์ ไม่งั้นช่องที่สามจะโหว่ */}
      <CatalogSection products={[solvent, water]} columns={2} />

      {/* -------------------------------------------------- How it works */}
      <Section>
        <div className="grid items-center gap-12 lg:grid-cols-[1fr_1.05fr] lg:gap-16">
          <Reveal>
            <SectionHeading
              eyebrow={howItWorks.eyebrow}
              title={howItWorks.title}
              description={howItWorks.description}
            />
            <ul className="mt-8 grid gap-3">
              {howItWorks.points.map((t) => (
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
              {howItWorks.diagramNote}
            </p>
          </Reveal>
        </div>
      </Section>

      {/* --------------------------------------------------- Two formulas */}
      <Section tone="shell" id="formulas">
        <Reveal>
          <SectionHeading
            align="center"
            eyebrow={formulas.eyebrow}
            title={formulas.title}
            description={formulas.description}
          />
        </Reveal>

        <div className="mt-14 space-y-16 lg:space-y-24">
          <ProductRow product={solvent} eyebrow={formulas.solventEyebrow} />
          <ProductRow product={water} eyebrow={formulas.waterEyebrow} flip />
        </div>

        <Reveal>
          <div className="mt-16 overflow-hidden rounded-3xl bg-white border border-slate-200">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[40rem] text-left text-sm">
                <thead>
                  <tr className="bg-brand-800 text-white">
                    <th className="px-5 py-4 font-semibold">{formulas.tableHeadTopic}</th>
                    <th className="px-5 py-4 font-semibold">{formulas.tableHeadSolvent}</th>
                    <th className="px-5 py-4 font-semibold">{formulas.tableHeadWater}</th>
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

      <CtaBand title={cta.title} description={cta.description} />
    </>
  );
}
