import type { Metadata } from "next";
import { Button, Container, Icon, PageHero } from "@/components/ui";
import { CatalogSection } from "@/components/hub";
import Reveal from "@/components/ui/Reveal";
import { categories, products } from "@/data/products";
import { lineHref, telHref } from "@/data/site";

export const metadata: Metadata = {
  title: "สินค้าทั้งหมด",
  description:
    "สีกันไฟ Neocoat Intumescent Paint สูตรน้ำมันและสูตรน้ำ, สีรองพื้น/ทับหน้า, ผ้ากันไฟ Fiberglass Cloth, สีเซรามิคสะท้อนความร้อน Roof Shield, ทินเนอร์/น้ำมันสน และสีน้ำพลาสติก Four Plus",
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
            : "สินค้าสีกันไฟ & วัสดุกันไฟ รับรองโดยวุฒิวิศวกรโยธา — ครบระบบตั้งแต่สีรองพื้น สีกันไฟ สีทับหน้า ผ้ากันไฟ ไปจนถึงสีน้ำพลาสติกและตัวทำละลาย"
        }
        breadcrumb={[
          { label: "หน้าแรก", href: "/" },
          ...(active
            ? [{ label: "สินค้า", href: "/products" }, { label: active.name }]
            : [{ label: "สินค้าทั้งหมด" }]),
        ]}
      />

      <CatalogSection products={list} />

      <section className="pb-[38px] lg:pb-[52px]">
        <Container>
          <Reveal>
            <div className="flex flex-col items-center gap-5 rounded-4xl border border-brand-200 bg-brand-50 px-7 py-11 text-center sm:px-12">
              <h2 className="max-w-xl text-2xl sm:text-3xl">
                ไม่แน่ใจว่าโครงการของคุณต้องใช้ระบบสีแบบไหน?
              </h2>
              <p className="max-w-xl text-slate-600">
                ส่งแบบโครงสร้างหรือรายการ BOQ มาให้ทีมวิศวกรของเราประเมินอัตราการทนไฟ
                ความหนาฟิล์ม และปริมาณสีที่ต้องใช้ได้ฟรี
              </p>
              <div className="flex flex-wrap justify-center gap-2.5">
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
