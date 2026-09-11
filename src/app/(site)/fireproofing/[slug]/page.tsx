import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Button, Icon, MoreLink, PageHero, SectionHeading } from "@/components/ui";
import Reveal from "@/components/ui/Reveal";
import { CtaBand, FaqList, MiniProduct, Section } from "@/components/hub";
import SampleDocsDialog from "@/components/SampleDocsDialog";
import { SERVICE_SAMPLES } from "@/data/service-samples";
import { telHrefOf } from "@/data/site";
import { getProducts, getService, getServices, getSiteInfo } from "@/lib/cms/content";
import { copyFor } from "@/lib/cms/copy-pages";

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
  const copy = await copyFor("service-detail");

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
  /* ตัวอย่างเอกสารมีเฉพาะบางบริการ (ตอนนี้คือหน้ารับรองสีกันไฟ) — ไม่มีก็ไม่แสดงปุ่ม */
  const samples = SERVICE_SAMPLES[service.slug];

  return (
    <>
      <PageHero
        eyebrow={service.eyebrow}
        title={service.label}
        description={service.lede}
        breadcrumb={[
          { label: copy.breadcrumb.home, href: "/" },
          { label: copy.breadcrumb.parent, href: "/fireproofing" },
          { label: service.label },
        ]}
      />

      {/* ------------------------------------------------------------ Overview */}
      <Section>
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <Reveal>
            <div className="overflow-hidden rounded-4xl bg-brand-50 shadow-[0_10px_28px_rgba(42,80,104,0.10)] border border-slate-200">
              <div className="relative aspect-square">
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
            <SectionHeading eyebrow={copy.overview.eyebrow} title={service.title} />
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
              {samples && (
                <SampleDocsDialog
                  title={samples.title}
                  description={samples.description}
                  docs={samples.docs}
                  buttonLabel="ดาวน์โหลดตัวอย่างเอกสารรับรอง"
                />
              )}
            </div>
          </Reveal>
        </div>
      </Section>

      {/* -------------------------------------------------------------- Blocks */}
      <Section tone="shell">
        <Reveal>
          <SectionHeading
            eyebrow={copy.detail.eyebrow}
            title={copy.detail.title}
            description={copy.detail.description}
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

      {/* ------------------------------------------------------- Document detail */}
      {service.sections && service.sections.length > 0 && (
        <Section>
          <Reveal>
            {/* คอลัมน์แคบกว่าปกติ เพราะเป็นเนื้อหาอ่านยาว ไม่ใช่การ์ด */}
            <div className="mx-auto max-w-[46rem]">
              {service.sections.map((sec, i) => (
                <div key={sec.title ?? i} className={i > 0 ? "mt-10" : ""}>
                  {sec.title && <h2 className="text-2xl sm:text-3xl">{sec.title}</h2>}

                  {sec.body?.map((t) => (
                    <p key={t} className="mt-4 leading-[1.9] text-slate-600">
                      {t}
                    </p>
                  ))}

                  {sec.items && (
                    <ul className="mt-5 grid gap-3">
                      {sec.items.map((it) => (
                        <li key={it} className="flex gap-3 leading-[1.8] text-slate-600">
                          <span className="mt-2.5 size-1.5 shrink-0 rounded-full bg-brand-400" />
                          {it}
                        </li>
                      ))}
                    </ul>
                  )}

                  {sec.note && (
                    <p className="mt-5 leading-[1.9] text-slate-600">{sec.note}</p>
                  )}
                </div>
              ))}
            </div>
          </Reveal>
        </Section>
      )}

      {/* ------------------------------------------------------------ Materials */}
      <Section>
        <Reveal>
          <SectionHeading
            eyebrow={copy.products.eyebrow}
            title={copy.products.title}
            action={<MoreLink href="/products">{copy.products.moreLabel}</MoreLink>}
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
          <SectionHeading
            align="center"
            eyebrow={copy.faq.eyebrow}
            title={`${copy.faq.titlePrefix}${service.label}`}
          />
        </Reveal>
        <div className="mt-12">
          <FaqList items={service.faq} />
        </div>

        {other.length > 0 && (
          <Reveal>
            <div className="mt-12 flex flex-wrap items-center justify-center gap-3">
              <span className="text-sm text-slate-500">{copy.otherServices}</span>
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
