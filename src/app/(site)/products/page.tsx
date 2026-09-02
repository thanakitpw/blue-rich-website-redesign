import type { Metadata } from "next";
import Link from "next/link";
import { Button, Container, Icon, PageHero } from "@/components/ui";
import Reveal from "@/components/ui/Reveal";
import { ProductCard } from "@/components/cards";
import { categories, products } from "@/data/products";
import { lineHref, telHref } from "@/data/site";

export const metadata: Metadata = {
  title: "สินค้าทั้งหมด",
  description:
    "สีกันไฟ Neocoat Intumescent Paint สูตรน้ำมันและสูตรน้ำ, สีรองพื้น/ทับหน้า, ซีเมนต์พ่นกันไฟ Fendolite M2 และ Mandolite CP-2, ผ้ากันไฟ Fiberglass Cloth, สีเซรามิคสะท้อนความร้อน Roof Shield, ทินเนอร์/น้ำมันสน และสีน้ำพลาสติก Four Plus",
};

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ cat?: string }>;
}) {
  const { cat } = await searchParams;
  const active = categories.find((c) => c.slug === cat);
  const list = active ? products.filter((p) => p.category === active.slug) : products;

  return (
    <>
      <PageHero
        eyebrow="Products"
        title={active ? active.name : "สินค้าทั้งหมด"}
        description={
          active
            ? active.description
            : "สินค้าสีกันไฟ & วัสดุกันไฟ รับรองโดยวุฒิวิศวกรโยธา — ครบระบบตั้งแต่สีรองพื้น สีกันไฟ สีทับหน้า ซีเมนต์พ่นกันไฟ ผ้ากันไฟ ไปจนถึงสีน้ำพลาสติกและตัวทำละลาย"
        }
        breadcrumb={[
          { label: "หน้าหลัก", href: "/" },
          ...(active
            ? [{ label: "สินค้า", href: "/products" }, { label: active.name }]
            : [{ label: "สินค้าทั้งหมด" }]),
        ]}
      />

      <section className="py-14 lg:py-20">
        <Container>
          {/* Filter tabs */}
          <div className="mask-fade-x -mx-1 overflow-x-auto pb-2">
            <div className="flex min-w-max gap-2 px-1">
              <FilterTab href="/products" label="ทั้งหมด" count={products.length} active={!active} />
              {categories.map((c) => (
                <FilterTab
                  key={c.slug}
                  href={`/products?cat=${c.slug}`}
                  label={c.name}
                  count={products.filter((p) => p.category === c.slug).length}
                  active={active?.slug === c.slug}
                />
              ))}
            </div>
          </div>

          <p className="mt-6 text-sm text-slate-500">
            แสดง <span className="font-semibold text-brand-800">{list.length}</span> รายการ
            {active && ` ในหมวด ${active.name}`}
          </p>

          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {list.map((p, i) => (
              <Reveal key={p.slug} delay={(i % 4) * 70}>
                <ProductCard product={p} />
              </Reveal>
            ))}
          </div>

          {/* Enquiry band */}
          <Reveal>
            <div className="mt-16 flex flex-col items-center gap-6 rounded-4xl bg-brand-50 px-7 py-11 text-center ring-1 ring-inset ring-brand-100 sm:px-12">
              <h2 className="max-w-xl text-2xl sm:text-3xl">
                ไม่แน่ใจว่าโครงการของคุณต้องใช้ระบบสีแบบไหน?
              </h2>
              <p className="max-w-xl text-slate-600">
                ส่งแบบโครงสร้างหรือรายการ BOQ มาให้ทีมวิศวกรของเราประเมินอัตราการทนไฟ
                ความหนาฟิล์ม และปริมาณสีที่ต้องใช้ได้ฟรี
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                <Button href={telHref} size="lg">
                  <Icon.phone />
                  ขอใบเสนอราคา
                </Button>
                <Button href={lineHref} variant="line" size="lg">
                  <Icon.line />
                  ปรึกษาผ่าน LINE
                </Button>
              </div>
            </div>
          </Reveal>
        </Container>
      </section>
    </>
  );
}

function FilterTab({
  href,
  label,
  count,
  active,
}: {
  href: string;
  label: string;
  count: number;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      className={`inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition ${
        active
          ? "bg-brand-700 text-white shadow-lg shadow-brand-900/20"
          : "bg-white text-slate-600 ring-1 ring-inset ring-slate-200 hover:bg-brand-50 hover:text-brand-700 hover:ring-brand-200"
      }`}
    >
      {label}
      <span
        className={`rounded-full px-2 py-0.5 text-[0.68rem] ${
          active ? "bg-white/20" : "bg-slate-100 text-slate-500"
        }`}
      >
        {count}
      </span>
    </Link>
  );
}
