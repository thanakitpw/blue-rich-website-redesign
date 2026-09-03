import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Breadcrumb, Button, Container, Icon } from "@/components/ui";
import Reveal from "@/components/ui/Reveal";
import { NewsCard } from "@/components/cards";
import { articles, getArticle } from "@/data/news";
import { lineHref, telHref } from "@/data/site";

export function generateStaticParams() {
  return articles.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) return { title: "ไม่พบบทความ" };
  return {
    title: article.title,
    description: article.excerpt,
    openGraph: {
      type: "article",
      publishedTime: article.date,
      images: [article.image],
    },
  };
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) notFound();

  const more = articles.filter((a) => a.slug !== article.slug).slice(0, 3);

  return (
    <>
      <section className="border-b border-slate-200 bg-brand-50">
        <Container className="py-9 sm:py-12">
          <Breadcrumb
            items={[
              { label: "หน้าแรก", href: "/" },
              { label: "บทความ", href: "/news" },
              { label: article.title },
            ]}
          />
          <div className="mt-5 max-w-3xl">
            <div className="flex flex-wrap items-center gap-3 text-sm">
              <span className="rounded-full bg-accent-500 px-3 py-1 text-[12px] font-medium text-white">
                {article.tag}
              </span>
              <time dateTime={article.date} className="text-[13.5px] text-slate-500">
                {article.dateLabel}
              </time>
            </div>
            <h1 className="rule-bar mt-4 text-[clamp(23px,3vw,34px)] leading-snug font-semibold">
              {article.title}
            </h1>
            <p className="mt-4 text-sm leading-relaxed text-slate-500 sm:text-[16px]">
              {article.excerpt}
            </p>
          </div>
        </Container>
      </section>

      <article className="py-[38px] lg:py-[52px]">
        <Container>
          <div className="mx-auto max-w-3xl">
            <div className="overflow-hidden rounded-4xl shadow-[0_8px_24px_rgba(42,80,104,0.09)] border border-slate-200">
              <Image
                src={article.image}
                alt={article.title}
                width={1200}
                height={750}
                priority
                sizes="(min-width: 768px) 768px, 92vw"
                className="h-auto w-full object-cover"
              />
            </div>

            <div className="mt-10 space-y-6">
              {article.body.map((p, i) => (
                <p key={i} className="text-[1.12rem] leading-[2] text-slate-600">
                  {p}
                </p>
              ))}
            </div>

            <div className="mt-12 rounded-4xl bg-brand-50 p-8 border border-slate-200">
              <h2 className="text-xl">ต้องการคำปรึกษาเรื่องงานสีกันไฟ?</h2>
              <p className="mt-3 text-[1.02rem] leading-relaxed text-slate-600">
                ทีมวิศวกรของ บลูริช แมททีเรียล โปรดักส์
                พร้อมช่วยประเมินอัตราการทนไฟที่โครงการของคุณต้องใช้ คำนวณความหนาฟิล์ม
                และจัดเตรียมเอกสารรับรองให้ครบชุด
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Button href={telHref}>
                  <Icon.phone />
                  ขอใบเสนอราคา
                </Button>
                <Button href={lineHref} variant="line">
                  <Icon.line />
                  ปรึกษาผ่าน LINE
                </Button>
              </div>
            </div>
          </div>
        </Container>
      </article>

      <section className="bg-slate-50 py-[38px] lg:py-[52px]">
        <Container>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <h2 className="text-2xl sm:text-3xl">บทความอื่นที่น่าสนใจ</h2>
            <Button href="/news" variant="secondary">
              อ่านทั้งหมด
              <Icon.arrow />
            </Button>
          </div>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {more.map((a, i) => (
              <Reveal key={a.slug} delay={i * 80}>
                <NewsCard article={a} />
              </Reveal>
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}
