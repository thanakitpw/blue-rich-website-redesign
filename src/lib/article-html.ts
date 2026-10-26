import type { Article } from "@/data/news";
import type { SiteInfo } from "@/data/site";

/**
 * ตัวช่วยของบทความที่เนื้อหาเป็น HTML (บทความ SEO จาก seo/blog — สกิล bluerich-blog-publish)
 *
 * HTML ถูกสร้างจากไฟล์ .md ในรีโปโดย scripts/blog/md-to-article.mts ไม่ได้มาจากผู้ใช้
 * จึงอ่านด้วย regex ตามรูปร่างที่ตัวแปลงเขียนเองได้ ไม่ต้องลาก HTML parser เข้ามาทั้งตัว
 */

const decode = (s: string) =>
  s
    .replace(/<[^>]+>/g, "")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, "&")
    .trim();

/**
 * ถอดลิงก์ที่ชี้ไปบทความซึ่งยังไม่ขึ้นเว็บ (ตั้งเวลาไว้วันหลัง) ให้เหลือข้อความ
 * บทความชุดเดียวกันลิงก์หากันเอง แต่ทยอยลงคนละวัน ถ้าไม่ถอดจะเป็นลิงก์ 404
 * พอบทปลายทางถึงวันขึ้น cron สั่ง revalidate หน้านี้ใหม่ ลิงก์ก็กลับมาเอง
 */
export function linkLiveArticlesOnly(html: string, live: Set<string>): string {
  return html.replace(
    /<a href="\/news\/([^"#?]+)[^"]*"[^>]*>([\s\S]*?)<\/a>/g,
    (whole, slug: string, text: string) => (live.has(slug) ? whole : text),
  );
}

/** คำถาม–คำตอบจากบล็อก .faq-item (h3 + p) — schema มาจาก HTML ที่แสดงจริง ไม่มีสำเนาที่สอง */
export function faqFromHtml(html: string): { q: string; a: string }[] {
  const items = html.match(/<div class="faq-item">[\s\S]*?<\/div>/g) ?? [];
  return items
    .map((item) => {
      const q = item.match(/<h3[^>]*>([\s\S]*?)<\/h3>/)?.[1] ?? "";
      const a = [...item.matchAll(/<p>([\s\S]*?)<\/p>/g)].map((m) => decode(m[1])).join(" ");
      return { q: decode(q), a };
    })
    .filter((x) => x.q && x.a);
}

/** Article + BreadcrumbList (+ FAQPage เมื่อมี FAQ) สำหรับหน้า /news/[slug] */
export function articleSchemas(article: Article, site: SiteInfo, html: string) {
  const url = `${site.url}/news/${article.slug}`;
  const image = article.image.startsWith("http") ? article.image : `${site.url}${article.image}`;
  const org = { "@type": "Organization", name: site.name, url: site.url };

  const schemas: Record<string, unknown>[] = [
    {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: article.title,
      description: article.seoDescription || article.excerpt,
      image: [image],
      datePublished: article.date,
      dateModified: article.date,
      mainEntityOfPage: url,
      author: org,
      publisher: { ...org, logo: { "@type": "ImageObject", url: `${site.url}/assets/logo.png` } },
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "หน้าแรก", item: site.url },
        { "@type": "ListItem", position: 2, name: "บทความ", item: `${site.url}/news` },
        { "@type": "ListItem", position: 3, name: article.title, item: url },
      ],
    },
  ];

  const faq = faqFromHtml(html);
  if (faq.length) {
    schemas.push({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faq.map(({ q, a }) => ({
        "@type": "Question",
        name: q,
        acceptedAnswer: { "@type": "Answer", text: a },
      })),
    });
  }
  return schemas;
}
