import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumb, Button, Container, Icon } from "@/components/ui";
import Reveal from "@/components/ui/Reveal";
import ProductGallery from "@/components/ProductGallery";
import { ProductCard } from "@/components/cards";
import { categories, getProduct, products } from "@/data/products";
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
    description: `${product.tagline} — ${product.description[0].slice(0, 140)}`,
    openGraph: { images: [product.image] },
  };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) notFound();

  const cat = categories.find((c) => c.slug === product.category);
  const related = products
    .filter((p) => p.category === product.category && p.slug !== product.slug)
    .slice(0, 4);
  const others = products.filter((p) => p.slug !== product.slug).slice(0, 4);
  const suggestions = related.length ? related : others;

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
              <div className="flex flex-wrap items-center gap-3">
                <span className="rounded-full bg-brand-500/15 px-3.5 py-1.5 text-xs font-semibold text-brand-200 ring-1 ring-inset ring-brand-400/20">
                  {cat?.name}
                </span>
                <span className="text-xs font-medium text-brand-200/60">
                  รหัสสินค้า {product.code}
                </span>
                {product.bestSeller && (
                  <span className="rounded-full bg-flame-500 px-3 py-1 text-[0.68rem] font-bold text-white">
                    ขายดี
                  </span>
                )}
              </div>

              <h1 className="mt-5 text-3xl leading-tight text-white sm:text-4xl lg:text-[2.9rem]">
                {product.name}
              </h1>
              <p className="mt-4 text-lg text-brand-100/75">{product.tagline}</p>

              <ul className="mt-8 grid gap-3">
                {product.highlights.map((h) => (
                  <li key={h} className="flex gap-3 text-[0.95rem] text-brand-100/85">
                    <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-brand-500 text-white">
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
            </div>
          </div>
        </Container>
      </section>

      {/* Details + specs */}
      <section className="py-16 lg:py-24">
        <Container>
          <div className="grid gap-12 lg:grid-cols-[1.25fr_1fr] lg:gap-16">
            <Reveal>
              <h2 className="text-2xl sm:text-3xl">รายละเอียดสินค้า</h2>
              <div className="mt-6 space-y-5">
                {product.description.map((p, i) => (
                  <p key={i} className="text-[1.02rem] leading-[1.9] text-slate-600">
                    {p}
                  </p>
                ))}
              </div>

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
                  <h2 className="text-lg text-white">ข้อมูลจำเพาะ</h2>
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

              <div className="mt-6 rounded-3xl bg-brand-950 p-7 text-white">
                <p className="font-display text-lg font-semibold">ต้องการปริมาณมาก?</p>
                <p className="mt-2 text-sm text-brand-100/70">
                  มีราคาพิเศษสำหรับผู้รับเหมาและงานโครงการ พร้อมจัดส่งตรงถึงหน้างานทั่วประเทศ
                </p>
                <Button href="/contact" size="md" variant="secondary" className="mt-5">
                  ขอราคาโครงการ
                  <Icon.arrow />
                </Button>
              </div>
            </Reveal>
          </div>
        </Container>
      </section>

      {/* Related */}
      <section className="bg-slate-50 py-16 lg:py-24">
        <Container>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <h2 className="text-2xl sm:text-3xl">รายการที่เกี่ยวข้อง</h2>
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
