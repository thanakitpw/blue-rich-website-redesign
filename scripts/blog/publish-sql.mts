/**
 * ตรวจบทความใน seo/published แล้วพิมพ์ SQL สำหรับลงตาราง public.articles
 *
 *   node scripts/blog/publish-sql.mts seo/published/*.json --dry     # ตรวจอย่างเดียว
 *   node scripts/blog/publish-sql.mts seo/published/<slug>.json      # ตรวจ + พิมพ์ SQL ออก stdout
 *
 * .env.local ของรีโปนี้ไม่มี service-role key (มีแค่ anon) สคริปต์จึงไม่เขียน DB เอง
 * แต่ออก SQL ให้รันผ่าน Supabase MCP `execute_sql` (โปรเจกต์ joxozwjhqkraafostdbd)
 * หรือ SQL Editor ของ Supabase — รันซ้ำได้ (upsert ตาม slug) ลิงก์และ published_at เดิมคงอยู่
 *
 * สแนปช็อต published ให้ฐานข้อมูลสร้างเองด้วย private.article_snapshot() ตัวเดียวกับปุ่ม
 * "เผยแพร่" ในหลังบ้าน รูปร่างข้อมูลสองทางจึงไม่มีวันเพี้ยนจากกัน
 *
 * วันที่ในอนาคตไม่ต้องรอ — ลงไว้ล่วงหน้าได้เลย หน้าเว็บซ่อนจนถึงวัน (getArticles)
 * แล้ว cron /api/cron/publish-scheduled revalidate ให้หลังเที่ยงคืนเวลาไทย
 */
import { existsSync, readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import { products } from "../../src/data/products.ts";
import { services } from "../../src/data/fireproofing.ts";

type ArticleJson = {
  slug: string;
  title: string;
  seo_title: string;
  seo_description: string;
  excerpt: string;
  tag: string;
  date: string;
  date_label: string;
  image: string;
  content_file: string;
};

const ROOT = process.cwd();
const args = process.argv.slice(2);
const dry = args.includes("--dry");
const files = args.filter((a) => a.endsWith(".json"));
if (!files.length) {
  console.error("ใช้: node scripts/blog/publish-sql.mts seo/published/*.json [--dry]");
  process.exit(1);
}

/* ── หน้าที่มีอยู่จริง สำหรับตรวจลิงก์ภายใน ─────────────────────────────── */
function appRoutes(dir: string, prefix = ""): string[] {
  const out: string[] = [];
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    if (!e.isDirectory()) {
      if (e.name === "page.tsx") out.push(prefix || "/");
      continue;
    }
    if (e.name === "admin" || e.name === "api" || e.name.startsWith("[")) continue;
    const seg = /^\(.*\)$/.test(e.name) ? "" : `/${e.name}`;
    out.push(...appRoutes(path.join(dir, e.name), prefix + seg));
  }
  return out;
}
const known = new Set([
  ...appRoutes(path.join(ROOT, "src", "app")),
  ...products.map((p) => `/products/${p.slug}`),
  ...services.map((s) => `/fireproofing/${s.slug}`),
]);
/* บทความปลายทางต้องมีไฟล์ใน seo/published (ลงไว้แล้วหรือกำลังลงชุดนี้) */
const articleDates = new Map<string, string>();
for (const f of readdirSync(path.join(ROOT, "seo", "published")).filter((f) => f.endsWith(".json"))) {
  const j = JSON.parse(readFileSync(path.join(ROOT, "seo", "published", f), "utf8")) as ArticleJson;
  articleDates.set(j.slug, j.date);
}

/* ── ตรวจ ─────────────────────────────────────────────────────────────── */
let failures = 0;
const loaded: { json: ArticleJson; html: string }[] = [];

for (const file of files) {
  const json = JSON.parse(readFileSync(file, "utf8")) as ArticleJson;
  const htmlPath = path.join(path.dirname(file), json.content_file);
  const html = existsSync(htmlPath) ? readFileSync(htmlPath, "utf8") : "";
  const errors: string[] = [];
  const warns: string[] = [];

  if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(json.slug)) errors.push(`slug ต้องเป็น a-z0-9 คั่นด้วย - : ${json.slug}`);
  if (!html) errors.push(`ไม่พบไฟล์ ${json.content_file}`);
  if (/<h1[\s>]/i.test(html)) errors.push("มี <h1> ในเนื้อหา — หน้าเว็บใส่ h1 จากชื่อบทความอยู่แล้ว");
  if (/_{3,}|รอตาราง|รอวิศวกร|รอยืนยัน|รอข้อมูล/.test(html + json.title + json.seo_description))
    errors.push("ยังมีช่องว่างรอข้อมูล (___ / รอ...) ในบทความ");
  if (/ \| Blue Rich$|Blue Rich$/.test(json.seo_title))
    errors.push('seo_title ห้ามมี "| Blue Rich" — layout เติมให้เองแล้ว');
  if (json.seo_description.length < 70 || json.seo_description.length > 170)
    warns.push(`seo_description ยาว ${json.seo_description.length} ตัวอักษร (ควร 70–170)`);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(json.date)) errors.push(`date ไม่ใช่ YYYY-MM-DD: ${json.date}`);
  if (!json.image.startsWith("/") || !existsSync(path.join(ROOT, "public", json.image)))
    errors.push(`ไม่พบรูปปก public${json.image}`);

  const ids = [...html.matchAll(/<h2 id="([^"]+)"/g)].map((m) => m[1]);
  if (new Set(ids).size !== ids.length) errors.push("id ของ <h2> ซ้ำกัน");
  for (const [, anchor] of html.matchAll(/href="#([^"]+)"/g))
    if (!ids.includes(anchor)) errors.push(`สารบัญชี้ #${anchor} แต่ไม่มี <h2 id> นั้น`);
  for (const item of html.match(/<div class="faq-item">[\s\S]*?<\/div>/g) ?? [])
    if (/<div/.test(item.slice(1))) errors.push("มี <div> ซ้อนใน .faq-item — schema FAQ จะอ่านคำตอบขาด");

  for (const [, href] of html.matchAll(/<a href="(\/[^"#?]*)/g)) {
    const p = href.replace(/\/$/, "") || "/";
    const news = p.match(/^\/news\/(.+)$/)?.[1];
    if (news) {
      const target = articleDates.get(news);
      if (!target) errors.push(`ลิงก์ไปบทความที่ไม่มีในระบบ: ${href}`);
      else if (target > json.date)
        warns.push(`ลิงก์ ${href} ขึ้นเว็บ ${target} หลังบทนี้ — ช่วงก่อนวันนั้นจะแสดงเป็นข้อความธรรมดา`);
    } else if (!known.has(p)) {
      errors.push(`ลิงก์ภายในไม่มีหน้าจริง: ${href}`);
    }
  }

  const label = `${json.date}  ${json.slug}`;
  if (errors.length) {
    failures++;
    console.error(`✗ ${label}`);
    errors.forEach((e) => console.error(`    ✗ ${e}`));
  } else {
    console.error(`✓ ${label}`);
  }
  warns.forEach((w) => console.error(`    ! ${w}`));
  loaded.push({ json, html });
}

if (failures) {
  console.error(`\n${failures} บทความไม่ผ่าน — แก้ที่ seo/blog/*.md แล้วรัน md-to-article ใหม่`);
  process.exit(1);
}
if (dry) process.exit(0);

/* ── SQL ──────────────────────────────────────────────────────────────── */
const q = (s: string) => `'${s.replace(/'/g, "''")}'`;
const out: string[] = [];
for (const { json: a, html } of loaded) {
  out.push(`insert into public.articles
  (slug, title, excerpt, image, date_iso, date_label, tag, body, content_html, seo_title, seo_description)
values (${q(a.slug)}, ${q(a.title)}, ${q(a.excerpt)}, ${q(a.image)}, ${q(a.date)}, ${q(a.date_label)}, ${q(a.tag)},
  '[]'::jsonb, ${q(html)}, ${q(a.seo_title)}, ${q(a.seo_description)})
on conflict (slug) do update set
  title = excluded.title, excerpt = excluded.excerpt, image = excluded.image,
  date_iso = excluded.date_iso, date_label = excluded.date_label, tag = excluded.tag,
  body = excluded.body, content_html = excluded.content_html,
  seo_title = excluded.seo_title, seo_description = excluded.seo_description;`);
}
out.push(`update public.articles a
   set published = private.article_snapshot(a.*), published_at = coalesce(a.published_at, now())
 where a.slug in (${loaded.map(({ json }) => q(json.slug)).join(", ")});`);
console.log(out.join("\n\n"));
