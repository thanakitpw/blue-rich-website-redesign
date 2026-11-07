import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui";
import { getSiteInfo } from "@/lib/cms/content";
import { getArticleKeywords } from "@/lib/reports/article-keywords";
import {
  extraKeywordGroups,
  pageKeywords,
  principles,
  reportMeta,
  type KeywordType,
} from "@/data/reports/seo-keywords";

/**
 * /reports/seo-keywords — แผนคีย์เวิร์ดให้ลูกค้าเปิดดูบนโดเมนของตัวเอง
 *
 * อยู่นอก route group (site) จึงไม่มีเมนู ท้ายเว็บ หรือปุ่ม LINE ลอย
 * ไม่ผ่าน CMS ไม่อยู่ใน sitemap และตั้ง noindex เพราะเป็นเอกสารภายในที่แชร์
 * เป็นลิงก์ตรงเท่านั้น ข้อมูลอยู่ที่ @/data/reports/seo-keywords ส่วนคีย์เวิร์ด
 * ของบทความอ่านจากต้นฉบับใน seo/blog/*.md (ดู @/lib/reports/article-keywords)
 */
export const metadata: Metadata = {
  title: reportMeta.title,
  description: `คีย์เวิร์ดหลัก หน้าเป้าหมาย คีย์เวิร์ดเพิ่มเติม และคีย์เวิร์ดของบทความ สำหรับเว็บ ${reportMeta.domain}`,
  robots: { index: false, follow: false },
};

/* ประเภทคีย์เวิร์ดแยกด้วยสีพื้นอ่อนของแบรนด์ ไม่เพิ่มสีใหม่ */
const typeStyle: Record<KeywordType, string> = {
  ซื้อ: "bg-accent-100 text-accent-700",
  บริการ: "bg-brand-900 text-white",
  ความรู้: "bg-slate-100 text-slate-700",
  กฎหมาย: "border border-slate-300 text-slate-700",
  แบรนด์: "border border-accent-200 text-accent-700",
};

export default async function SeoKeywordsReport() {
  const site = await getSiteInfo();
  const { rows: articles } = getArticleKeywords();
  const targets = new Set(pageKeywords.map((k) => k.target)).size;
  const extraCount = extraKeywordGroups.reduce((sum, g) => sum + g.keywords.length, 0);
  const liveCount = articles.filter((a) => a.live).length;
  const byNumber = new Map(articles.map((a) => [a.n, a]));

  return (
    <div className="bg-white text-slate-950">
      <header className="border-b border-slate-200 bg-brand-50">
        <Container className="py-10 sm:py-14">
          <p className="eyebrow-en text-[13px] text-accent-600">SEO Keyword Plan</p>
          <h1 className="mt-2 text-[clamp(26px,3.4vw,38px)] leading-tight">
            คีย์เวิร์ด SEO เว็บ {reportMeta.domain}
          </h1>
          <p className="mt-4 max-w-3xl text-[16px] leading-relaxed text-slate-600">
            จัดทำ {reportMeta.preparedOn} ปรับปรุง {reportMeta.updatedOn} สำหรับ {site.name} —
            คีย์เวิร์ดหลัก {pageKeywords.length} คำ กำหนดหน้าเป้าหมาย {targets} หน้า
            คีย์เวิร์ดเพิ่มเติมจากคำที่คนค้นจริง {extraCount} คำ และบทความ {articles.length} บท
            (ขึ้นเว็บแล้ว {liveCount} บท) ที่แต่ละบทรับคำหลักของตัวเองแล้วลิงก์กลับเข้าหน้าสินค้าและหน้าบริการ
          </p>
        </Container>
      </header>

      <main>
        <section className="py-[38px] lg:py-[52px]">
          <Container>
            <h2 className="rule-bar text-2xl sm:text-3xl">หลักที่ใช้เลือกคีย์เวิร์ด</h2>
            <div className="mt-8 grid gap-6 md:grid-cols-3">
              {principles.map((p) => (
                <div key={p.title} className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
                  <h3 className="text-[17px]">{p.title}</h3>
                  <p className="mt-3 text-[15px] leading-relaxed text-slate-600">{p.body}</p>
                </div>
              ))}
            </div>
          </Container>
        </section>

        <section className="border-t border-slate-200 py-[38px] lg:py-[52px]">
          <Container>
            <h2 className="rule-bar text-2xl sm:text-3xl">คีย์เวิร์ดหลักและหน้าเป้าหมาย</h2>
            <p className="mt-3 max-w-3xl text-[15px] text-slate-600">
              หนึ่งคำหลักต่อหนึ่งหน้า คำรองคือคำที่หน้าเดียวกันรับได้โดยไม่ต้องสร้างหน้าเพิ่ม
              คู่แข่งคือโดเมนที่พบบนหน้าแรกของ Google เมื่อค้นคำนั้นจริง ณ วันจัดทำ
            </p>
            <div className="mt-8 overflow-x-auto rounded-3xl border border-slate-200">
              <table className="w-full min-w-[820px] border-collapse text-[14.5px]">
                <thead>
                  <tr className="bg-slate-50 text-left text-[12.5px] tracking-wide text-slate-500">
                    <th className="px-4 py-3 font-medium">คีย์เวิร์ดหลัก</th>
                    <th className="px-4 py-3 font-medium">ประเภท</th>
                    <th className="px-4 py-3 font-medium">หน้าเป้าหมาย</th>
                    <th className="px-4 py-3 font-medium">คู่แข่งที่พบบนหน้าแรก</th>
                  </tr>
                </thead>
                <tbody>
                  {pageKeywords.map((k) => (
                    <tr key={k.keyword} className="border-t border-slate-200 align-top">
                      <td className="px-4 py-3">
                        <span className="font-medium text-brand-700">{k.keyword}</span>
                        {k.secondary.length > 0 && (
                          <span className="mt-1 block text-[13px] leading-relaxed text-slate-500">
                            {k.secondary.join(" · ")}
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-block rounded-full px-2.5 py-0.5 text-[12px] font-medium ${typeStyle[k.type]}`}
                        >
                          {k.type}
                        </span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <Link
                          href={k.target}
                          className="font-mono text-[13px] text-accent-600 underline decoration-accent-200 underline-offset-4 hover:decoration-accent-500"
                        >
                          {k.targetLabel ?? k.target}
                        </Link>
                      </td>
                      <td className="px-4 py-3 text-[13.5px] leading-relaxed text-slate-600">
                        {k.competitors}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Container>
        </section>

        <section className="border-t border-slate-200 py-[38px] lg:py-[52px]">
          <Container>
            <h2 className="rule-bar text-2xl sm:text-3xl">คีย์เวิร์ดเพิ่มเติม {extraCount} คำ</h2>
            <p className="mt-3 max-w-3xl text-[15px] text-slate-600">
              คำที่คนพิมพ์ค้นจริงจากคำแนะนำการค้นหาของ Google ({reportMeta.updatedOn}) คัดเฉพาะคำที่ตรงกับสินค้าและบริการของ
              Blue Rich ไม่รวมชื่อแบรนด์คู่แข่งหรือร้านค้า ทุกคำให้หน้าหรือบทความที่มีอยู่แล้วรับ ไม่ต้องสร้างหน้าใหม่
            </p>
            <div className="mt-8 grid gap-6 lg:grid-cols-2">
              {extraKeywordGroups.map((g) => (
                <div key={g.group} className="overflow-hidden rounded-3xl border border-slate-200">
                  <div className="bg-slate-50 px-5 py-4">
                    <h3 className="text-[17px]">
                      {g.group} <span className="text-[14px] font-normal text-slate-500">· {g.keywords.length} คำ</span>
                    </h3>
                    <p className="mt-1 text-[13.5px] leading-relaxed text-slate-500">{g.note}</p>
                  </div>
                  <table className="w-full border-collapse text-[14px]">
                    <tbody>
                      {g.keywords.map((k) => {
                        const art = k.article ? byNumber.get(k.article) : undefined;
                        return (
                          <tr key={k.keyword} className="border-t border-slate-200 align-top">
                            <td className="px-5 py-2.5 font-medium text-brand-700">{k.keyword}</td>
                            <td className="px-2 py-2.5">
                              <span
                                className={`inline-block rounded-full px-2.5 py-0.5 text-[12px] font-medium whitespace-nowrap ${typeStyle[k.type]}`}
                              >
                                {k.type}
                              </span>
                            </td>
                            <td className="px-5 py-2.5 text-[13px] text-slate-600">
                              {k.target ? (
                                <Link
                                  href={k.target}
                                  className="font-mono text-accent-600 underline decoration-accent-200 underline-offset-4 hover:decoration-accent-500"
                                >
                                  {k.target}
                                </Link>
                              ) : art?.live && art.slug ? (
                                <Link
                                  href={`/news/${art.slug}`}
                                  className="text-accent-600 underline decoration-accent-200 underline-offset-4 hover:decoration-accent-500"
                                >
                                  บทที่ {k.article}
                                </Link>
                              ) : (
                                <span>บทที่ {k.article} (รอรีวิว)</span>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              ))}
            </div>
          </Container>
        </section>

        <section className="border-t border-slate-200 bg-slate-50 py-[38px] lg:py-[52px]">
          <Container>
            <h2 className="rule-bar text-2xl sm:text-3xl">
              คีย์เวิร์ดของบทความทั้ง {articles.length} บท
            </h2>
            <p className="mt-3 max-w-3xl text-[15px] text-slate-600">
              ชื่อเรื่องขึ้นต้นด้วยคำหลัก ยาวไม่เกิน 60 ตัวอักษร ทุกบทลิงก์กลับเข้าหน้าสินค้าและหน้าบริการอย่างน้อย 3 ลิงก์
            </p>
            <div className="mt-8 overflow-x-auto rounded-3xl border border-slate-200 bg-white">
              <table className="w-full min-w-[820px] border-collapse text-[14.5px]">
                <thead>
                  <tr className="bg-slate-50 text-left text-[12.5px] tracking-wide text-slate-500">
                    <th className="px-4 py-3 font-medium">บท</th>
                    <th className="px-4 py-3 font-medium">ชื่อเรื่อง</th>
                    <th className="px-4 py-3 font-medium">คีย์เวิร์ดหลัก</th>
                    <th className="px-4 py-3 font-medium">คีย์เวิร์ดรอง</th>
                    <th className="px-4 py-3 font-medium">สถานะ</th>
                  </tr>
                </thead>
                <tbody>
                  {articles.map((a) => (
                    <tr key={a.n} className="border-t border-slate-200 align-top">
                      <td className="px-4 py-3 tabular-nums text-slate-500">{a.n}</td>
                      <td className="px-4 py-3 font-medium text-brand-700">
                        {a.live && a.slug ? (
                          <Link
                            href={`/news/${a.slug}`}
                            className="underline decoration-accent-200 underline-offset-4 hover:decoration-accent-500"
                          >
                            {a.title}
                          </Link>
                        ) : (
                          a.title
                        )}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">{a.keyword}</td>
                      <td className="px-4 py-3 text-[13.5px] leading-relaxed text-slate-600">
                        {a.secondary.join(" · ")}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-[13px]">
                        {a.live ? (
                          <span className="text-accent-700">ขึ้นเว็บแล้ว</span>
                        ) : (
                          <span className="text-slate-500">รอลูกค้ารีวิว</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Container>
        </section>
      </main>

      <footer className="border-t border-slate-200">
        <Container className="py-8 text-[13.5px] leading-relaxed text-slate-500">
          <p>
            จัดทำสำหรับ {site.name} · {reportMeta.preparedOn} · ปรับปรุง {reportMeta.updatedOn}
          </p>
          <p className="mt-1">
            ปริมาณการค้นหาและอันดับปัจจุบันของแต่ละคำจะรายงานแยกต่างหาก หลังตั้งค่า Google Search Console เสร็จ
          </p>
        </Container>
      </footer>
    </div>
  );
}
