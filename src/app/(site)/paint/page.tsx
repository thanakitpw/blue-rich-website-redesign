import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MoreLink, PageHero, SectionHeading } from "@/components/ui";
import Reveal from "@/components/ui/Reveal";
import { CatalogSection, CtaBand, MiniProduct, ProductRow, Section } from "@/components/hub";
import { lineHrefOf } from "@/data/site";
import { getProduct, getSiteInfo } from "@/lib/cms/content";
import { copyFor } from "@/lib/cms/copy-pages";

export async function generateMetadata(): Promise<Metadata> {
  const { meta } = await copyFor("paint");
  return meta;
}



export default async function PaintPage() {
  const [primer, topcoat, masonry, exterior, interior, thinner, turpentine, solvent, info] =
    await Promise.all([
      getProduct("neocoat-primer-grey-oxide"),
      getProduct("neogloss-enamel"),
      getProduct("four-plus-pro-masonry-sealer"),
      getProduct("four-plus-exterior"),
      getProduct("four-plus-pro-interior"),
      getProduct("thinner-3a-intanin"),
      getProduct("turpentine-intanin"),
      getProduct("neocoat-intumescent-paint-s"),
      getSiteInfo(),
    ]);
  const {
    hero,
    groups,
    steel,
    masonry: masonryCopy,
    emulsion,
    related,
  } = await copyFor("paint");
  if (!primer || !topcoat || !masonry || !exterior || !interior) notFound();
  const lineHref = lineHrefOf(info);

  return (
    <>
      <PageHero
        eyebrow={hero.eyebrow}
        title={hero.title}
        description={hero.description}
        breadcrumb={[{ label: "หน้าแรก", href: "/" }, { label: hero.crumb }]}
      />

      <CatalogSection
        products={[primer, topcoat, masonry, exterior, interior]}
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
            eyebrow={steel.eyebrow}
            title={steel.title}
            description={steel.description}
          />
        </Reveal>

        <div className="mt-14 space-y-16 lg:space-y-24">
          <ProductRow product={primer} id="steel-primer" eyebrow={steel.primerEyebrow} />
          <ProductRow product={topcoat} id="steel-topcoat" eyebrow={steel.topcoatEyebrow} flip />
        </div>

        <Reveal>
          <div className="mt-14 grid gap-4 rounded-4xl bg-brand-900 p-8 text-white sm:grid-cols-3 lg:p-10">
            {steel.layers.map((s) => (
              <div key={s.n} className="rounded-3xl bg-white/[0.07] p-6 ring-1 ring-inset ring-white/10">
                <span className="font-display text-3xl font-bold text-brand-300">{s.n}</span>
                <p className="mt-2 font-display font-semibold text-white">{s.t}</p>
                <p className="mt-1.5 text-sm text-brand-100/70">{s.d}</p>
              </div>
            ))}
          </div>
          <p className="mt-4 text-center text-sm text-slate-500">
            {steel.fireQuestion}{" "}
            <a href="/intumescent" className="font-semibold text-brand-700 underline underline-offset-4">
              {steel.fireLink}
            </a>
          </p>
        </Reveal>
      </Section>

      {/* ------------------------------------------------------ Masonry system */}
      <Section tone="shell">
        <Reveal>
          <SectionHeading
            eyebrow={masonryCopy.eyebrow}
            title={masonryCopy.title}
            description={masonryCopy.description}
          />
        </Reveal>

        <div className="mt-14 space-y-16 lg:space-y-24">
          <ProductRow product={masonry} id="masonry" eyebrow={masonryCopy.sealerEyebrow} />
        </div>

        <div id="emulsion" className="mt-16 scroll-mt-40 lg:mt-24">
          <Reveal>
            <SectionHeading
              eyebrow={emulsion.eyebrow}
              title={emulsion.title}
              description={emulsion.description}
              action={<MoreLink href="/products?cat=emulsion-paint">{emulsion.moreLabel}</MoreLink>}
            />
          </Reveal>

          <div className="mt-12 space-y-16 lg:space-y-24">
            <ProductRow product={exterior} eyebrow={emulsion.exteriorEyebrow} flip />
            <ProductRow product={interior} eyebrow={emulsion.interiorEyebrow} />
          </div>
        </div>
      </Section>

      {/* ------------------------------------------------------------- Related */}
      <Section>
        <Reveal>
          <SectionHeading
            eyebrow={related.eyebrow}
            title={related.title}
            description={related.description}
          />
        </Reveal>
        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          <Reveal>
            {thinner && <MiniProduct product={thinner} />}
          </Reveal>
          <Reveal delay={60}>
            {turpentine && <MiniProduct product={turpentine} />}
          </Reveal>
          <Reveal delay={120}>
            {solvent && <MiniProduct product={solvent} />}
          </Reveal>
        </div>

        <Reveal>
          <p className="mt-10 text-center text-sm text-slate-500">
            {related.helpQuestion}{" "}
            <a href={lineHref} target="_blank" rel="noreferrer" className="font-semibold text-brand-700 underline underline-offset-4">
              {related.helpLink}
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
