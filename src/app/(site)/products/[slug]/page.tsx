import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumb, Button, Container, Icon } from "@/components/ui";
import Reveal from "@/components/ui/Reveal";
import ProductGallery from "@/components/ProductGallery";
import { ProductCard } from "@/components/cards";
import {
  categories,
  getProduct,
  installationSteps,
  legalInfo,
  products,
  relatedProducts,
} from "@/data/products";
import { lineHref, mailHref, site, telHref } from "@/data/site";

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) return { title: "ไม่พบสินค้า" };
  return {
    title: product.name,
    description: product.tagline,
    openGraph: { images: [product.image] },
  };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) notFound();

  const cat = categories.find((c) => c.slug === product.category);
  const suggestions = relatedProducts(product);

  return (
    <>
      {/* Breadcrumb band */}
      <div className="bg-brand-950 pt-28 pb-6 sm:pt-32">
        <Container>
          <Breadcrumb
            items={[
              { label: "หน้าหลัก", href: "/" },
              { label: "สินค้า", href: "/products" },
              { label: cat?.name ?? "", href: `/products?cat=${product.category}` },
              { label: product.name },
            ]}
          />
        </Container>
      </div>

      {/* Overview */}
      <section className="bg-brand-950 pb-16 lg:pb-24">
        <Container>
          <div className="grid gap-10 lg:grid-cols-2 lg:gap-14">
            <div className="rounded-4xl bg-white p-4 sm:p-6">
              <ProductGallery images={product.gallery} alt={product.name} />
            </div>

            <div className="lg:py-4">
              <div className="flex flex-wrap items-center gap-2">
                {product.bestSeller && (
                  <span className="rounded-full bg-flame-500 px-3 py-1 text-[0.68rem] font-bold text-white">
                    ขายดี
                  </span>
                )}
                {product.badges.map((b) => (
                  <span
                    key={b}
                    className="rounded-full bg-brand-500/15 px-3.5 py-1.5 text-xs font-semibold text-brand-200 ring-1 ring-inset ring-brand-400/20"
                  >
                    {b}
                  </span>
                ))}
              </div>

              <h1 className="mt-5 text-3xl leading-tight text-white sm:text-4xl lg:text-[2.75rem]">
                {product.name}
              </h1>
              <p className="mt-4 leading-[1.85] text-brand-100/75">{product.tagline}</p>

              <dl className="mt-8 grid gap-x-8 gap-y-3 sm:grid-cols-2">
                {product.quickSpecs.map((s) => (
                  <div key={s.label} className="flex gap-2 text-[0.95rem]">
                    <span className="text-brand-400">·</span>
                    <dt className="text-brand-100/60">{s.label}</dt>
                    <dd className="font-semibold text-white">{s.value}</dd>
                  </div>
                ))}
              </dl>

              <div className="mt-9 rounded-3xl bg-white/[0.05] p-6 ring-1 ring-inset ring-white/10">
                <p className="text-sm text-brand-100/70">
                  สอบถามราคาและปริมาณที่ต้องใช้สำหรับโครงการของคุณ
                </p>
                <div className="mt-4 flex flex-wrap gap-3">
                  <Button href={telHref} size="lg" variant="secondary">
                    <Icon.phone />
                    โทร {site.phones[0]}
                  </Button>
                  <Button href={lineHref} size="lg" variant="line">
                    <Icon.line />
                    สอบถามผ่าน LINE
                  </Button>
                  <Button href={mailHref} size="lg" variant="ghost">
                    <Icon.mail />
                    ส่งอีเมล
                  </Button>
                </div>
              </div>

              {product.downloads && product.downloads.length > 0 && (
                <div className="mt-5 rounded-3xl p-6 ring-1 ring-inset ring-white/10">
                  <p className="font-display text-xs font-semibold tracking-[0.15em] text-brand-300 uppercase">
                    เอกสารดาวน์โหลด
                  </p>
                  <div className="mt-4 grid gap-2.5 sm:grid-cols-2">
                    {product.downloads.map((d) => (
                      <a
                        key={d.href}
                        href={d.href}
                        target="_blank"
                        rel="noopener"
                        className="flex items-start gap-2.5 rounded-xl px-3.5 py-3 text-sm font-semibold text-brand-100 ring-1 ring-inset ring-white/15 transition hover:bg-white/5 hover:text-white hover:ring-brand-400/50"
                      >
                        <Icon.doc className="mt-0.5 size-4 shrink-0 text-brand-300" />
                        {d.label}
                      </a>
                    ))}
                  </div>
                  {product.downloadNote && (
                    <p className="mt-3.5 text-xs leading-relaxed text-brand-100/50">
                      {product.downloadNote}
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        </Container>
      </section>

      {/* Details + specs */}
      <section className="py-16 lg:py-24">
        <Container>
          <div className="grid gap-12 lg:grid-cols-[1.25fr_1fr] lg:gap-16">
            <Reveal>
              <h2 className="text-2xl sm:text-3xl">เกี่ยวกับสินค้า</h2>
              <div className="mt-6 space-y-5">
                {product.description.map((p, i) => (
                  <p key={i} className="text-[1.02rem] leading-[1.9] text-slate-600">
                    {p}
                  </p>
                ))}
              </div>

              {product.lists?.map((list) => (
                <div key={list.title} className="mt-9">
                  <h3 className="text-lg">{list.title}</h3>
                  <ul className="mt-4 grid gap-3">
                    {list.items.map((item) => (
                      <li key={item} className="flex gap-3 leading-[1.8] text-slate-600">
                        <span className="mt-2 size-1.5 shrink-0 rounded-full bg-brand-400" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}

              <div className="mt-10 rounded-3xl border border-brand-100 bg-brand-50/60 p-7">
                <h3 className="flex items-center gap-2.5 text-lg">
                  <Icon.doc className="size-5 text-brand-600" />
                  ต้องการเอกสารรับรอง?
                </h3>
                <p className="mt-3 text-[0.95rem] leading-relaxed text-slate-600">
                  ทุกโครงการที่ใช้ผลิตภัณฑ์ของเรา สามารถขอเอกสารรับรองงานสีกันไฟ
                  โดยวุฒิวิศวกรโยธาและวิศวกรควบคุมงาน ตามแบบ น.4-5 และ น.4-9
                  เพื่อใช้ยื่นขออนุญาตและตรวจรับงาน
                </p>
                <Link
                  href="/contact"
                  className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-700 hover:text-brand-800"
                >
                  ติดต่อขอรายละเอียด
                  <Icon.arrow />
                </Link>
              </div>
            </Reveal>

            <Reveal delay={120}>
              <div className="overflow-hidden rounded-3xl ring-1 ring-slate-200">
                <div className="bg-brand-900 px-6 py-4">
                  <h2 className="text-lg text-white">สเปกเทคนิค</h2>
                </div>
                <dl className="divide-y divide-slate-100">
                  {product.specs.map((s) => (
                    <div
                      key={s.label}
                      className="grid grid-cols-[auto_1fr] gap-4 bg-white px-6 py-3.5 text-sm even:bg-slate-50/60"
                    >
                      <dt className="text-slate-500">{s.label}</dt>
                      <dd className="text-right font-medium text-brand-900">{s.value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
              {product.specNote && (
                <p className="mt-4 rounded-2xl bg-slate-50 px-5 py-4 text-[0.82rem] leading-relaxed text-slate-500 ring-1 ring-inset ring-slate-200/70">
                  {product.specNote}
                </p>
              )}

              <div className="mt-6 rounded-3xl bg-brand-950 p-7 text-white">
                <p className="font-display text-lg font-semibold">
                  ให้วิศวกรช่วยคำนวณปริมาณ
                </p>
                <p className="mt-2 text-sm text-brand-100/70">
                  แจ้งพื้นที่ ตร.ม. และชั่วโมงกันไฟที่ต้องการ
                  ทีมงานจะคำนวณจำนวนถังและเสนอราคาให้
                </p>
                <Button href="/contact" size="md" variant="secondary" className="mt-5">
                  ขอคำนวณ &amp; ใบเสนอราคา
                  <Icon.arrow />
                </Button>
              </div>
            </Reveal>
          </div>
        </Container>
      </section>

      {/* Thinner / drying table */}
      {product.table && (
        <section className="pb-16 lg:pb-24">
          <Container>
            <Reveal>
              <h2 className="text-2xl sm:text-3xl">{product.table.title}</h2>
              <div className="mt-6 overflow-x-auto rounded-3xl ring-1 ring-slate-200">
                <table className="w-full min-w-[56rem] border-collapse text-sm">
                  <thead>
                    <tr className="bg-brand-900 text-left text-white">
                      {product.table.columns.map((c) => (
                        <th key={c} className="px-5 py-3.5 font-display font-semibold">
                          {c}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {product.table.rows.map((row, i) => (
                      <tr key={i} className="bg-white even:bg-slate-50/60">
                        {row.map((cell, j) => (
                          <td
                            key={j}
                            className={`px-5 py-3.5 align-top ${
                              j === 0 ? "font-medium text-brand-900" : "text-slate-600"
                            }`}
                          >
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {product.table.note && (
                <p className="mt-4 text-[0.82rem] text-slate-500">{product.table.note}</p>
              )}
            </Reveal>
          </Container>
        </section>
      )}

      {/* Installation */}
      {product.installation && (
        <section className="bg-slate-50 py-16 lg:py-24">
          <Container>
            <Reveal>
              <h2 className="text-2xl sm:text-3xl">การติดตั้ง (Installation)</h2>
            </Reveal>
            <div className="mt-10 grid gap-5 sm:grid-cols-2">
              {installationSteps.map((s, i) => (
                <Reveal key={s.title} delay={i * 70}>
                  <div className="flex h-full gap-5 rounded-3xl bg-white p-7 ring-1 ring-slate-200/80">
                    <span className="grid size-10 shrink-0 place-items-center rounded-full bg-brand-600 font-display font-bold text-white">
                      {i + 1}
                    </span>
                    <div>
                      <h3 className="text-lg leading-snug">{s.title}</h3>
                      <p className="mt-2.5 text-[0.95rem] leading-[1.85] text-slate-600">
                        {s.body}
                      </p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </Container>
        </section>
      )}

      {/* Building code */}
      {product.legalStandards && (
        <section className="py-16 lg:py-24">
          <Container>
            <Reveal>
              <div className="rounded-4xl bg-brand-50 p-8 ring-1 ring-inset ring-brand-100 sm:p-11">
                <h2 className="text-2xl sm:text-3xl">{legalInfo.title}</h2>
                <p className="mt-5 leading-[1.9] text-slate-600">{legalInfo.intro}</p>

                <h3 className="mt-8 text-lg">{legalInfo.listTitle}</h3>
                <ul className="mt-4 grid gap-3">
                  {legalInfo.items.map((item) => (
                    <li key={item} className="flex gap-3 leading-[1.8] text-slate-600">
                      <Icon.shield className="mt-1 size-4 shrink-0 text-brand-600" />
                      {item}
                    </li>
                  ))}
                </ul>

                <p className="mt-8 text-[0.9rem] leading-relaxed text-slate-500">
                  ดูรายละเอียดมาตรฐานการทดสอบ {product.legalStandards}{" "}
                  และประกาศราชกิจจานุเบกษาได้ที่หน้า มาตรฐาน &amp; ใบรับรอง
                </p>
              </div>
            </Reveal>
          </Container>
        </section>
      )}

      {/* FAQ */}
      {product.faq.length > 0 && (
        <section className="pb-16 lg:pb-24">
          <Container>
            <Reveal>
              <h2 className="text-2xl sm:text-3xl">คำถามที่พบบ่อย</h2>
            </Reveal>
            <div className="mt-8 grid max-w-3xl gap-4">
              {product.faq.map((f, i) => (
                <Reveal key={f.q} delay={i * 70}>
                  <details className="group rounded-3xl bg-white px-6 py-5 ring-1 ring-slate-200/80 open:ring-brand-200">
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-display font-semibold text-brand-900">
                      {f.q}
                      <span className="grid size-7 shrink-0 place-items-center rounded-full bg-brand-50 text-brand-700 transition group-open:rotate-45">
                        <svg viewBox="0 0 20 20" className="size-3.5" fill="none" aria-hidden>
                          <path
                            d="M10 4v12M4 10h12"
                            stroke="currentColor"
                            strokeWidth="2.2"
                            strokeLinecap="round"
                          />
                        </svg>
                      </span>
                    </summary>
                    <p className="mt-3.5 text-[0.95rem] leading-[1.85] text-slate-600">{f.a}</p>
                  </details>
                </Reveal>
              ))}
            </div>
          </Container>
        </section>
      )}

      {/* Related */}
      <section className="bg-slate-50 py-16 lg:py-24">
        <Container>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <h2 className="text-2xl sm:text-3xl">สินค้าที่เกี่ยวข้อง</h2>
            <Button href="/products" variant="secondary">
              ดูสินค้าทั้งหมด
              <Icon.arrow />
            </Button>
          </div>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {suggestions.map((p, i) => (
              <Reveal key={p.slug} delay={i * 70}>
                <ProductCard product={p} />
              </Reveal>
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}
