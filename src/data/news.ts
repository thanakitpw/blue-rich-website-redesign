export type Article = {
  slug: string;
  title: string;
  excerpt: string;
  image: string;
  date: string;
  dateLabel: string;
  tag: string;
  body: string[];
  /** เนื้อหาเป็น HTML (บทความ SEO จาก seo/blog) — มีค่าเมื่อไรหน้าบทความใช้ค่านี้แทน body */
  html?: string;
  /** <title> และ meta description เมื่อไม่อยากใช้ชื่อบนหน้า/คำโปรยตรง ๆ */
  seoTitle?: string;
  seoDescription?: string;
};

/**
 * บทความชุดเดิม 7 บทถูกถอดออกเมื่อ 26 ต.ค. 2569 (URL เก่า redirect ใน next.config.ts)
 * บทความตอนนี้มาจาก seo/blog/*.md ผ่านสกิล bluerich-blog-publish และอยู่ในฐานข้อมูลเท่านั้น
 * ไฟล์นี้จึงไม่มีบทความสำรอง — ถ้า Supabase ล่ม หน้า /news แสดงว่างแทนบทความที่ลบไปแล้ว
 */
export const articles: Article[] = [];
