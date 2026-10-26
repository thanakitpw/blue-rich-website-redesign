import type { Metadata } from "next";
import { Container, PageHero } from "@/components/ui";
import Reveal from "@/components/ui/Reveal";
import { NewsCard } from "@/components/cards";
import { getArticles } from "@/lib/cms/content";
import { copyFor } from "@/lib/cms/copy-pages";

/* บทความตั้งเวลา (getArticles ซ่อนบทที่ยังไม่ถึงวัน) ต้องโผล่เองเมื่อถึงวัน — ISR รายชั่วโมงเป็นตัวสำรอง
   ของ cron /api/cron/publish-scheduled ที่ revalidate ทั้งเว็บตอน 00:05 น. */
export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  const { meta } = await copyFor("news");
  return meta;
}

export default async function NewsPage() {
  const [[featured, ...rest], { hero }] = await Promise.all([getArticles(), copyFor("news")]);

  return (
    <>
      <PageHero
        eyebrow={hero.eyebrow}
        title={hero.title}
        description={hero.description}
        breadcrumb={[{ label: "หน้าแรก", href: "/" }, { label: hero.crumb }]}
      />

      <section className="py-[38px] lg:py-[52px]">
        <Container>
          {/* ว่างได้เมื่ออ่านฐานข้อมูลไม่ได้ — ไฟล์สำรองไม่มีบทความแล้ว (ดู src/data/news.ts) */}
          {featured && (
            <Reveal>
              <NewsCard article={featured} featured />
            </Reveal>
          )}

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
