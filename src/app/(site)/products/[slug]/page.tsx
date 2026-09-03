import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Button, Container, Icon } from "@/components/ui";
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

/** Restates the guarantees already stated on /fireproofing and the home page. */
const assurances = [
  {
    icon: Icon.doc,
    title: "เอกสารรับรองครบชุด",
    note: "ออกเอกสารรับรองงานสีกันไฟโดยวุฒิวิศวกรโยธา ตามแบบ น.4-5 และ น.4-9",
  },
  {
    icon: Icon.shield,
    title: "ผ่านการทดสอบจริง",
    note: "ASTM E-119 และ ISO 834 มีรายงานผลทดสอบให้ตรวจสอบก่อนสั่งซื้อ",
  },
  {
    icon: Icon.truck,
    title: "มีสต็อก ส่งทั่วประเทศ",
    note: "มีสินค้าสำหรับงานโครงการ จัดส่งตรงถึงหน้างาน",
  },
];

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
      {/* --------------------------------------------------------- Breadcrumb */}
      <div className="border-b border-slate-200 bg-white py-3.5">
        <Container>
          <nav aria-label="breadcrumb">
            <ol className="flex flex-wrap items-center gap-2 text-[14px] text-slate-500">
              <li>
                <Link href="/" aria-label="หน้าแรก" className="grid size-6 place-items-center text-brand-600 transition hover:text-accent-600">
                  <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                    <path d="M3 10.5 12 3l9 7.5" />
                    <path d="M5.5 9.5V20a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1V9.5" />
                  </svg>
                </Link>
              </li>
              <li aria-hidden className="text-slate-300">›</li>
              <li>
                <Link href="/products" className="transition hover:text-brand-600">
                  สินค้าทั้งหมด
                </Link>
              </li>
              {cat && (
                <>
                  <li aria-hidden className="text-slate-300">›</li>
                  <li>
                    <Link
                      href={`/products?cat=${cat.slug}`}
                      className="transition hover:text-brand-600"
                    >
                      {cat.name}
                    </Link>
                  </li>
                </>
              )}
              <li aria-hidden className="text-slate-300">›</li>
              <li className="font-medium text-brand-600">{product.name}</li>
            </ol>
          </nav>
        </Container>
      </div>

      {/* ----------------------------------------------------------- Overview */}
      <section className="py-8 lg:py-12">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[1.02fr_1fr] lg:gap-14">
            <ProductGallery images={product.gallery} alt={product.name} />

            <div>
              <h1 className="text-[clamp(25px,3.2vw,36px)] leading-[1.25] font-bold text-brand-600">
                {product.name}
              </h1>
              {cat && (
                <p className="mt-2 text-[14px] text-slate-500">
                  หมวดสินค้า :{" "}
                  <Link
                    href={`/products?cat=${cat.slug}`}
                    className="font-medium text-brand-700 underline underline-offset-4"
                  >
                    {cat.name}
                  </Link>
                  <span className="mx-2 text-slate-300">|</span>
                  {cat.short}
                </p>
              )}

              {product.badges.length > 0 && (
                <p className="mt-3 text-[16px] font-semibold text-brand-700">
                  {product.badges.join(" · ")}
                </p>
              )}

              <hr className="my-5 border-slate-200" />

              <p className="text-[16px] leading-[1.85] text-slate-600">{product.tagline}</p>

              <ul className="mt-4 space-y-2">
                {product.quickSpecs.map((sp, i) => (
                  <li key={sp.label} className="flex gap-2.5 text-[15.5px] leading-[1.7]">
                    <span
                      aria-hidden
                      className={`mt-[9px] size-1.5 shrink-0 rounded-full ${
                        i < 2 ? "bg-accent-500" : "bg-slate-300"
                      }`}
                    />
                    <span className={i < 2 ? "text-brand-700" : "text-slate-600"}>
                      {sp.label}{" "}
                      <b className="font-semibold text-brand-700">{sp.value}</b>
                    </span>
                  </li>
                ))}
              </ul>

              <hr className="my-5 border-slate-200" />

              {/* Price slot — Blue Rich quotes per project, so the headline spec
                  sits here instead of a number, with the enquiry CTA below. */}
              <p className="text-[clamp(22px,2.6vw,28px)] leading-tight font-bold text-brand-600">
                สอบถามราคา
              </p>
              <p className="mt-1 text-[14px] text-slate-500">
                ราคาขึ้นกับปริมาณและขอบเขตงาน · แจ้งพื้นที่หน้างานให้ทีมงานประเมินได้
              </p>

              <div className="mt-5 flex flex-wrap gap-2.5">
                <Button href={lineHref} variant="line" size="lg">
                  <Icon.line className="size-[18px]" />
                  สั่งซื้อสินค้าผ่าน LINE
                </Button>
                <Button href={telHref} size="lg">
                  <Icon.phone />
                  โทร {site.phones[0]}
                </Button>
                <Button href={mailHref} variant="ghost" size="lg">
                  <Icon.mail />
                  ส่งอีเมล
                </Button>
              </div>

              {/* Assurance panel */}
              <ul className="mt-6 space-y-4 rounded-3xl border border-slate-200 p-6">
                {assurances.map((a) => (
                  <li key={a.title} className="flex gap-3.5">
                    <span className="grid size-10 shrink-0 place-items-center rounded-2xl bg-brand-50 text-brand-600">
                      <a.icon className="size-5" />
                    </span>
                    <span>
                      <b className="block text-[16px] font-semibold text-brand-700">{a.title}</b>
                      <span className="text-[14px] leading-relaxed text-slate-500">{a.note}</span>
                    </span>
                  </li>
                ))}
              </ul>

              {product.downloads && product.downloads.length > 0 && (
                <div className="mt-4 rounded-3xl border border-slate-200 p-6">
                  <p className="eyebrow-en text-[12px] tracking-[0.07em] text-accent-500">
                    เอกสารดาวน์โหลด
                  </p>
                  <div className="mt-3.5 grid gap-2.5 sm:grid-cols-2">
                    {product.downloads.map((d) => (
                      <a
                        key={d.href}
                        href={d.href}
                        target="_blank"
                        rel="noopener"
                        className="flex items-start gap-2.5 rounded-xl border border-slate-200 px-3.5 py-3 text-[14px] font-medium text-brand-700 transition hover:border-brand-200 hover:bg-brand-50"
                      >
                        <Icon.doc className="mt-0.5 size-4 shrink-0 text-accent-500" />
                        {d.label}
                      </a>
                    ))}
                  </div>
                  {product.downloadNote && (
                    <p className="mt-3.5 text-[13px] leading-relaxed text-slate-400">
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
      <section className="py-[38px] lg:py-[52px]">
        <Container>
          <div className="grid gap-12 lg:grid-cols-[1.25fr_1fr] lg:gap-16">
            <Reveal>
              <h2 className="text-2xl sm:text-3xl">เกี่ยวกับสินค้า</h2>
              <div className="mt-6 space-y-5">
                {product.description.map((p, i) => (
                  <p key={i} className="text-[1.08rem] leading-[1.9] text-slate-600">
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

              <div className="mt-10 rounded-3xl border border-slate-200 bg-brand-50 p-7">
                <h3 className="flex items-center gap-2.5 text-lg">
                  <Icon.doc className="size-5 text-brand-600" />
                  ต้องการเอกสารรับรอง?
                </h3>
                <p className="mt-3 text-[1.02rem] leading-relaxed text-slate-600">
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
              <div className="overflow-hidden rounded-3xl border border-slate-200">
                <div className="bg-brand-900 px-6 py-4">
                  <h2 className="text-lg text-white">สเปกเทคนิค</h2>
                </div>
                <dl className="divide-y divide-slate-200">
                  {product.specs.map((s) => (
                    <div
                      key={s.label}
                      className="grid grid-cols-[auto_1fr] gap-4 bg-white px-6 py-3.5 text-sm even:bg-slate-50/60"
                    >
                      <dt className="text-slate-500">{s.label}</dt>
                      <dd className="text-right font-medium text-brand-700">{s.value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
              {product.specNote && (
                <p className="mt-4 rounded-2xl bg-slate-50 px-5 py-4 text-[0.9rem] leading-relaxed text-slate-500 border border-slate-200/70">
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
              <div className="mt-6 overflow-x-auto rounded-3xl border border-slate-200">
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
                  <tbody className="divide-y divide-slate-200">
                    {product.table.rows.map((row, i) => (
                      <tr key={i} className="bg-white even:bg-slate-50/60">
                        {row.map((cell, j) => (
                          <td
                            key={j}
                            className={`px-5 py-3.5 align-top ${
                              j === 0 ? "font-medium text-brand-700" : "text-slate-600"
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
                <p className="mt-4 text-[0.9rem] text-slate-500">{product.table.note}</p>
              )}
            </Reveal>
          </Container>
        </section>
      )}

      {/* Installation */}
      {product.installation && (
        <section className="bg-slate-50 py-[38px] lg:py-[52px]">
          <Container>
            <Reveal>
              <h2 className="text-2xl sm:text-3xl">การติดตั้ง (Installation)</h2>
            </Reveal>
            <div className="mt-10 grid gap-5 sm:grid-cols-2">
              {installationSteps.map((s, i) => (
                <Reveal key={s.title} delay={i * 70}>
                  <div className="flex h-full gap-5 rounded-3xl bg-white p-7 border border-slate-200">
                    <span className="grid size-10 shrink-0 place-items-center rounded-full bg-brand-600 font-display font-bold text-white">
                      {i + 1}
                    </span>
                    <div>
                      <h3 className="text-lg leading-snug">{s.title}</h3>
                      <p className="mt-2.5 text-[1.02rem] leading-[1.85] text-slate-600">
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
        <section className="py-[38px] lg:py-[52px]">
          <Container>
            <Reveal>
              <div className="rounded-4xl bg-brand-50 p-8 border border-slate-200 sm:p-11">
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
                  <details className="group rounded-3xl bg-white px-6 py-5 border border-slate-200 open:border-accent-500">
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-display font-semibold text-brand-700">
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
                    <p className="mt-3.5 text-[1.02rem] leading-[1.85] text-slate-600">{f.a}</p>
                  </details>
                </Reveal>
              ))}
            </div>
          </Container>
        </section>
      )}

      {/* Related */}
      <section className="bg-slate-50 py-[38px] lg:py-[52px]">
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
