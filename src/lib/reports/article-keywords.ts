import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { plannedArticles, type ArticleKeyword } from "@/data/reports/seo-keywords";

/**
 * คีย์เวิร์ดของบทความ อ่านจาก frontmatter ของ content/articles/NN-slug.md
 *
 * ไฟล์ .md เป็นต้นฉบับเดียวของบทความ หน้ารายงานจึงอ่านคีย์เวิร์ดจากที่นั่นตรง ๆ
 * ไม่พิมพ์ซ้ำ ฟิลด์ที่ใช้ตามแม่แบบของสกิลเขียนบทความ:
 *
 *   ลำดับ: 3 จาก 12
 *   title: "ชื่อเรื่อง"
 *   keyword_หลัก: "คำหลัก"
 *   keyword_รอง: ["คำรอง 1", "คำรอง 2"]
 *
 * อ่านตอน build เท่านั้น (หน้าเป็น static) ถ้ายังไม่มีไฟล์บทความเลย
 * ใช้แผน 12 บทจาก plannedArticles แทน จะได้ไม่มีตารางว่างระหว่างรอเขียน
 */

const ARTICLES_DIR = path.join(process.cwd(), "content", "articles");

/** ตัดเครื่องหมายคำพูดหัวท้ายของค่าใน frontmatter */
const unquote = (s: string) => s.trim().replace(/^["']|["']$/g, "");

/** อ่านลิสต์แบบ ["a", "b"] หรือ a, b — พอสำหรับสองรูปแบบที่แม่แบบใช้ */
const parseList = (s: string) =>
  s
    .trim()
    .replace(/^\[|\]$/g, "")
    .split(",")
    .map(unquote)
    .filter(Boolean);

function parseFrontmatter(md: string): Record<string, string> {
  const m = md.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!m) return {};
  const out: Record<string, string> = {};
  for (const line of m[1].split(/\r?\n/)) {
    /* ข้ามบล็อกที่ย่อหน้าเข้า (แหล่งข้อเท็จจริง, รูป) — เอาเฉพาะคีย์ระดับบนสุด */
    const kv = line.match(/^([^\s:][^:]*):\s*(.*)$/);
    if (kv) out[kv[1].trim()] = kv[2];
  }
  return out;
}

export function getArticleKeywords(): { rows: ArticleKeyword[]; fromFiles: boolean } {
  let files: string[] = [];
  try {
    files = readdirSync(ARTICLES_DIR).filter((f) => /^\d{2}-.*\.md$/.test(f));
  } catch {
    return { rows: plannedArticles, fromFiles: false };
  }
  if (files.length === 0) return { rows: plannedArticles, fromFiles: false };

  const rows = files
    .sort()
    .map((file) => {
      const fm = parseFrontmatter(readFileSync(path.join(ARTICLES_DIR, file), "utf8"));
      const n = Number((fm["ลำดับ"] ?? file).match(/\d+/)?.[0] ?? 0);
      return {
        n,
        title: unquote(fm.title ?? ""),
        keyword: unquote(fm["keyword_หลัก"] ?? ""),
        secondary: parseList(fm["keyword_รอง"] ?? ""),
      };
    })
    .filter((r) => r.title && r.keyword)
    .sort((a, b) => a.n - b.n);

  /* บทที่ยังไม่ได้เขียนคงแสดงจากแผน จะได้เห็นครบ 12 บทเสมอ */
  const written = new Set(rows.map((r) => r.n));
  const merged = [...rows, ...plannedArticles.filter((p) => !written.has(p.n))].sort(
    (a, b) => a.n - b.n,
  );
  return { rows: merged, fromFiles: rows.length > 0 };
}
