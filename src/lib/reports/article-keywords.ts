import { existsSync, readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { plannedArticles, type ArticleKeyword } from "@/data/reports/seo-keywords";

/**
 * คีย์เวิร์ดของบทความ อ่านจากต้นฉบับใน seo/blog/NN-<keyword>.md
 *
 * seo/blog เป็นต้นฉบับเดียวของบทความตั้งแต่ขึ้นเว็บชุดแรก (สกิล bluerich-blog-publish)
 * หน้ารายงานจึงอ่านจากที่นั่นตรง ๆ ไม่พิมพ์ซ้ำ ฟิลด์ที่ใช้อยู่ในบล็อก SEO META
 * ต้นไฟล์และหัวข้อ H1:
 *
 *   URL slug     : /news/<slug>
 *   Primary KW   : คำหลัก
 *   Secondary KW : คำรอง 1, คำรอง 2
 *   # ชื่อเรื่อง
 *
 * บทที่ขึ้นเว็บแล้วคือบทที่มี seo/published/<slug>.json (ไฟล์ที่ตัวแปลงสร้างตอนลงบทความ)
 * ร่างที่รอลูกค้ารีวิวยังไม่มีไฟล์นี้ อ่านตอน build เท่านั้น (หน้าเป็น static)
 * ถ้าไม่มีไฟล์บทความเลย ใช้แผน 12 บทจาก plannedArticles แทน
 */

const BLOG_DIR = path.join(process.cwd(), "seo", "blog");
const PUBLISHED_DIR = path.join(process.cwd(), "seo", "published");

const field = (md: string, name: string) =>
  md.match(new RegExp(`^${name}\\s*:\\s*(.*)$`, "m"))?.[1].trim() ?? "";

export function getArticleKeywords(): { rows: ArticleKeyword[]; fromFiles: boolean } {
  let files: string[] = [];
  try {
    files = readdirSync(BLOG_DIR).filter((f) => /^\d{2}-.*\.md$/.test(f));
  } catch {
    return { rows: plannedArticles, fromFiles: false };
  }
  if (files.length === 0) return { rows: plannedArticles, fromFiles: false };

  const rows = files
    .map((file) => {
      const md = readFileSync(path.join(BLOG_DIR, file), "utf8");
      const slug = field(md, "URL slug").replace(/^\/news\//, "");
      return {
        n: Number(file.slice(0, 2)),
        title: md.match(/^#\s+(.+)$/m)?.[1].trim() ?? "",
        keyword: field(md, "Primary KW"),
        secondary: field(md, "Secondary KW")
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
        slug,
        live: slug !== "" && existsSync(path.join(PUBLISHED_DIR, `${slug}.json`)),
      };
    })
    .filter((r) => r.title && r.keyword)
    .sort((a, b) => a.n - b.n);

  return { rows, fromFiles: true };
}
