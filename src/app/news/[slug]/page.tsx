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
      <section className="relative overflow-hidden bg-brand-950 pt-28 pb-16 sm:pt-32 lg:pb-20">
        <div
          aria-hidden
          className="absolute inset-0 bg-[radial-gradient(56rem_28rem_at_15%_-10%,var(--color-brand-700),transparent_60%)]"
        />
        <Container className="relative">
          <Breadcrumb
            items={[
              { label: "หน้าหลัก", href: "/" },
              { label: "บทความ", href: "/news" },
              { label: article.title },
            ]}
          />
          <div className="mt-7 max-w-3xl">
            <div className="flex flex-wrap items-center gap-3 text-sm">
              <span className="rounded-full bg-brand-500/20 px-3.5 py-1.5 text-xs font-semibold text-brand-200 ring-1 ring-inset ring-brand-400/25">
                {article.tag}
              </span>
              <time dateTime={article.date} className="text-brand-200/60">
                {article.dateLabel}
              </time>
            </div>
            <h1 className="mt-5 text-3xl leading-[1.2] text-white sm:text-4xl lg:text-[3rem]">
              {article.title}
            </h1>
            <p className="mt-5 text-base leading-relaxed text-brand-100/75 sm:text-lg">
              {article.excerpt}
            </p>
          </div>
        </Container>
      </section>

      <article className="py-14 lg:py-20">
        <Container>
          <div className="mx-auto max-w-3xl">
            <div className="overflow-hidden rounded-4xl shadow-xl shadow-brand-950/10 ring-1 ring-slate-200">
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
                <p key={i} className="text-[1.05rem] leading-[2] text-slate-600">
                  {p}
                </p>
              ))}
            </div>

            <div className="mt-12 rounded-4xl bg-brand-50 p-8 ring-1 ring-inset ring-brand-100">
              <h2 className="text-xl">ต้องการคำปรึกษาเรื่องงานสีกันไฟ?</h2>
              <p className="mt-3 text-[0.95rem] leading-relaxed text-slate-600">
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

      <section className="bg-slate-50 py-16 lg:py-24">
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
