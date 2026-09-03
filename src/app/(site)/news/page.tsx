import type { Metadata } from "next";
import { Container, PageHero } from "@/components/ui";
import Reveal from "@/components/ui/Reveal";
import { NewsCard } from "@/components/cards";
import { articles } from "@/data/news";

export const metadata: Metadata = {
  title: "บทความและข่าวสาร",
  description:
    "รวมบทความเรื่องกฎหมายป้องกันอัคคีภัย งานสีกันไฟโครงสร้างเหล็ก และความรู้เรื่องวัสดุก่อสร้าง จากบริษัท บลูริช แมททีเรียล โปรดักส์",
};

export default function NewsPage() {
  const [featured, ...rest] = articles;

  return (
    <>
      <PageHero
        eyebrow="Insights"
        title="บทความและข่าวสาร"
        description="อัปเดตข้อกำหนดด้านการป้องกันอัคคีภัย มาตรฐานงานสีกันไฟ และความรู้เรื่องวัสดุก่อสร้างที่นำไปใช้ได้จริง"
        breadcrumb={[{ label: "หน้าแรก", href: "/" }, { label: "บทความ" }]}
      />

      <section className="py-[38px] lg:py-[52px]">
        <Container>
          <Reveal>
            <NewsCard article={featured} featured />
          </Reveal>

          <div className="mt-6 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {rest.map((a, i) => (
              <Reveal key={a.slug} delay={(i % 3) * 80}>
                <NewsCard article={a} />
              </Reveal>
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}
