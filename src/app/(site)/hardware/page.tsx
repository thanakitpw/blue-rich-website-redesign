import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Button, Icon, PageHero, SectionHeading } from "@/components/ui";
import Reveal from "@/components/ui/Reveal";
import { CatalogSection, CtaBand, ProductRow, Section } from "@/components/hub";
import { bundleFor } from "@/data/site";
import { getProduct, getSiteInfo } from "@/lib/cms/content";
import { copyFor } from "@/lib/cms/copy-pages";

export async function generateMetadata(): Promise<Metadata> {
  const { meta } = await copyFor("hardware");
  return meta;
}



/* ไอคอนของบล็อกข้อสังเกต — ข้อความย้ายไป @/data/pages/hardware แล้ว */
const noticeIcons = [Icon.truck, Icon.doc, Icon.users];

export default async function HardwarePage() {
  const [thinner3a, turpentine, thinner2k, blanket, info] = await Promise.all([
    getProduct("thinner-3a-intanin"),
    getProduct("turpentine-intanin"),
    getProduct("thinner-2k"),
    getProduct("fiberglass-cloth"),
    getSiteInfo(),
  ]);
  const { hero, wash, pairingBlock, pairing, blanket: blanketCopy, notices, cta } =
    await copyFor("hardware");
  if (!thinner3a || !turpentine || !thinner2k || !blanket) notFound();
  const { telHref, lineHref } = bundleFor(info, []);

  return (
    <>
      <PageHero
        eyebrow={hero.eyebrow}
        title={hero.title}
        description={hero.description}
        breadcrumb={[{ label: "หน้าแรก", href: "/" }, { label: hero.crumb }]}
      />

      <CatalogSection products={[thinner3a, turpentine, thinner2k, blanket]} columns={2} />

      {/* --------------------------------------------------------- Wash thinner */}
      <Section id="thinner-wash" tone="shell">
        <div className="grid items-center gap-10 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
          <Reveal>
            <SectionHeading
              eyebrow={wash.eyebrow}
              title={wash.title}
              description={wash.description}
            />
            <ul className="mt-8 grid gap-3">
              {wash.points.map((t) => (
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
                {wash.lineLabel}
              </Button>
              <Button href={telHref} variant="secondary" size="lg">
                <Icon.phone />
                {wash.callLabel}
              </Button>
            </div>
          </Reveal>

          <Reveal delay={120}>
            <div className="rounded-4xl bg-white p-7 border border-slate-200 sm:p-9">
              <p className="font-display text-lg font-semibold text-brand-700">
                {wash.noteTitle}
              </p>
              <p className="mt-3 text-[1.02rem] leading-relaxed text-slate-600">
                {wash.noteBody}
              </p>
              <p className="mt-4 rounded-2xl bg-brand-50 px-5 py-4 text-sm leading-relaxed text-brand-700 border border-slate-200">
                {wash.noteHint}
              </p>
            </div>
          </Reveal>
        </div>
      </Section>

      {/* -------------------------------------------------------- Pairing guide */}
      <Section tone="shell">
        <Reveal>
          <SectionHeading
            eyebrow={pairingBlock.eyebrow}
            title={pairingBlock.title}
            description={pairingBlock.description}
          />
        </Reveal>

        <Reveal>
          <div className="mt-12 overflow-hidden rounded-3xl bg-white border border-slate-200">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[44rem] text-left text-sm">
                <thead>
                  <tr className="bg-brand-800 text-white">
                    <th className="px-5 py-4 font-semibold">{pairingBlock.headJob}</th>
                    <th className="px-5 py-4 font-semibold">{pairingBlock.headUse}</th>
                    <th className="px-5 py-4 font-semibold">{pairingBlock.headNote}</th>
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
            eyebrow={blanketCopy.eyebrow}
            title={blanketCopy.title}
            description={blanketCopy.description}
          />
        </Reveal>
        <div className="mt-12">
          <ProductRow product={blanket} eyebrow={blanketCopy.rowEyebrow} />
        </div>
      </Section>

      {/* -------------------------------------------------------------- Notice */}
      <Section tone="shell">
        <Reveal>
          <div className="grid gap-6 md:grid-cols-3">
            {notices.map((c, i) => {
              const NoticeIcon = noticeIcons[i] ?? Icon.truck;
              return (
              <div
                key={c.title}
                className="rounded-3xl bg-white p-7 border border-slate-200"
                style={{ transitionDelay: `${i * 60}ms` }}
              >
                <span className="grid size-12 place-items-center rounded-2xl bg-brand-50 text-brand-600 border border-slate-200">
                  <NoticeIcon />
                </span>
                <h3 className="mt-5 text-lg">{c.title}</h3>
                <p className="mt-2.5 text-sm leading-relaxed text-slate-600">{c.text}</p>
              </div>
              );
            })}
          </div>
        </Reveal>
      </Section>

      <CtaBand title={cta.title} description={cta.description} />
    </>
  );
}
