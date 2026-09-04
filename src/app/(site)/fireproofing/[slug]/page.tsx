import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Button, Icon, MoreLink, PageHero, SectionHeading } from "@/components/ui";
import Reveal from "@/components/ui/Reveal";
import { CtaBand, FaqList, MiniProduct, Section } from "@/components/hub";
import { telHrefOf } from "@/data/site";
import { getProducts, getService, getServices, getSiteInfo } from "@/lib/cms/content";

export async function generateStaticParams() {
  return (await getServices()).map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const service = await getService(slug);
  if (!service) return {};
  return { title: service.label, description: service.lede };
}

export default async function ServicePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const service = await getService(slug);
  if (!service) notFound();

  const [products, services, info] = await Promise.all([
    getProducts(),
    getServices(),
    getSiteInfo(),
  ]);
  const telHref = telHrefOf(info);
  const related = service.products
    .map((slug) => products.find((p) => p.slug === slug))
    .filter((p): p is NonNullable<typeof p> => Boolean(p));
  const other = services.filter((s) => s.slug !== service.slug);

  return (
    <>
      <PageHero
        eyebrow={service.eyebrow}
        title={service.label}
        description={service.lede}
        breadcrumb={[
          { label: "หน้าแรก", href: "/" },
          { label: "รับรองสีกันไฟ", href: "/fireproofing" },
          { label: service.label },
        ]}
      />

      {/* ------------------------------------------------------------ Overview */}
      <Section>
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <Reveal>
            <div className="overflow-hidden rounded-4xl bg-brand-50 shadow-[0_10px_28px_rgba(42,80,104,0.10)] border border-slate-200">
              <div className="relative aspect-4/3">
                <Image
                  src={service.image}
                  alt={service.label}
                  fill
                  sizes="(min-width: 1024px) 45vw, 92vw"
                  className="object-cover"
                />
              </div>
            </div>
          </Reveal>

          <Reveal delay={120}>
            <SectionHeading eyebrow="ภาพรวม" title={service.title} />
            <ul className="mt-8 grid gap-3">
              {service.highlights.map((h) => (
                <li
                  key={h}
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
                  {h}
                </li>
              ))}
            </ul>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button href="/contact" size="lg">
                ขอใบเสนอราคา
                <Icon.arrow />
              </Button>
              <Button href={telHref} variant="secondary" size="lg">
                <Icon.phone />
                ปรึกษาทีมวิศวกร
              </Button>
            </div>
          </Reveal>
        </div>
      </Section>

      {/* -------------------------------------------------------------- Blocks */}
      <Section tone="shell">
        <Reveal>
          <SectionHeading
            eyebrow="รายละเอียดงาน"
            title="สิ่งที่เกิดขึ้นจริงในแต่ละขั้น"
            description="ลำดับนี้คือสิ่งที่ทีมงานทำและตรวจในทุกโครงการ ไม่ว่างานจะเล็กหรือใหญ่"
          />
        </Reveal>

        <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {service.blocks.map((b, i) => (
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

      {/* ------------------------------------------------------------ Materials */}
      <Section>
        <Reveal>
          <SectionHeading
            eyebrow="วัสดุที่เกี่ยวข้อง"
            title="สินค้าที่ใช้ในงานนี้"
            action={<MoreLink href="/products">ดูสินค้าทั้งหมด</MoreLink>}
          />
        </Reveal>
        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          {related.map((p, i) => (
            <Reveal key={p.slug} delay={i * 60}>
              <MiniProduct product={p} />
            </Reveal>
          ))}
        </div>
      </Section>

      {/* ----------------------------------------------------------------- FAQ */}
      <Section tone="shell">
        <Reveal>
          <SectionHeading align="center" eyebrow="คำถามที่พบบ่อย" title={`เรื่องที่ถามบ่อยเกี่ยวกับ${service.label}`} />
        </Reveal>
        <div className="mt-12">
          <FaqList items={service.faq} />
        </div>

        {other.length > 0 && (
          <Reveal>
            <div className="mt-12 flex flex-wrap items-center justify-center gap-3">
              <span className="text-sm text-slate-500">บริการอื่นในหมวดนี้ :</span>
              {other.map((o) => (
                <Button key={o.slug} href={`/fireproofing/${o.slug}`} variant="secondary">
                  {o.label}
                  <Icon.arrow />
                </Button>
              ))}
            </div>
          </Reveal>
        )}
      </Section>

      <CtaBand />
    </>
  );
}
