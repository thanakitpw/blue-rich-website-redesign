/**
 * สร้างไฟล์ SQL สำหรับย้ายเนื้อหาเดิมใน src/data/*.ts เข้าฐานข้อมูล CMS
 *
 *   node scripts/cms-seed-sql.mts > supabase/seed.sql
 *
 * ตั้งใจให้รันซ้ำได้ (on conflict do update) เนื้อหาชุดนี้คือสิ่งที่อยู่บนเว็บจริง
 * อยู่แล้ว จึงเซ็ตให้เป็นทั้งฉบับร่างและฉบับเผยแพร่พร้อมกัน
 *
 * สแนปช็อต published ไม่ได้เขียนจากสคริปต์นี้ แต่ให้ฐานข้อมูลสร้างเองด้วย
 * private.*_snapshot() ซึ่งเป็นฟังก์ชันตัวเดียวกับที่ปุ่ม "เผยแพร่" ใช้
 * รูปร่างสองฝั่งจึงไม่มีทางหลุดจากกันเพราะลืมแก้ที่ใดที่หนึ่ง
 */
import { categories, installationSteps, legalInfo, products } from "../src/data/products.ts";
import { articles } from "../src/data/news.ts";
import { projects } from "../src/data/projects.ts";
import { homeFaqs } from "../src/data/faq.ts";
import { services } from "../src/data/fireproofing.ts";
import { site, nav, standards, stats } from "../src/data/site.ts";
import { bestSellerSlugs, categoryTiles, flagshipSlug, valuePoints } from "../src/data/home.ts";

/** escape ค่าเป็น string literal ของ Postgres */
const q = (v: string | null | undefined) =>
  v == null ? "null" : `'${v.replace(/'/g, "''")}'`;

/** jsonb literal — dollar quoting กัน quote ในเนื้อหาไทยชนกัน */
const j = (v: unknown) => `$j$${JSON.stringify(v)}$j$::jsonb`;

/** boolean ที่ optional ในไฟล์ต้นทาง แต่เป็น not null ในตาราง */
const b = (v: boolean | undefined) => (v ? "true" : "false");

const out: string[] = [];
out.push("-- สร้างอัตโนมัติจาก scripts/cms-seed-sql.mts — อย่าแก้ไฟล์นี้ด้วยมือ");
out.push("begin;");

// ── หมวดหมู่ ───────────────────────────────────────────────────────────────
categories.forEach((c, i) => {
  out.push(
    `insert into public.categories (slug, name, short, description, image, sort_order)
values (${q(c.slug)}, ${q(c.name)}, ${q(c.short)}, ${q(c.description)}, ${q(c.image)}, ${i})
on conflict (slug) do update set
  name = excluded.name, short = excluded.short, description = excluded.description,
  image = excluded.image, sort_order = excluded.sort_order;`,
  );
});

// ── สินค้า ─────────────────────────────────────────────────────────────────
products.forEach((p, i) => {
  out.push(
    `insert into public.products (
  slug, name, category_slug, tagline, card_summary, badges, quick_specs, image,
  gallery, downloads, download_note, description, lists, specs, spec_note,
  spec_table, installation, legal_standards, faq, related, featured, best_seller,
  sort_order)
values (
  ${q(p.slug)}, ${q(p.name)}, ${q(p.category)}, ${q(p.tagline)}, ${q(p.cardSummary)},
  ${j(p.badges)}, ${j(p.quickSpecs)}, ${q(p.image)}, ${j(p.gallery)},
  ${j(p.downloads ?? [])}, ${q(p.downloadNote)}, ${j(p.description)}, ${j(p.lists ?? [])},
  ${j(p.specs)}, ${q(p.specNote)}, ${p.table ? j(p.table) : "null"}, ${b(p.installation)},
  ${q(p.legalStandards)}, ${j(p.faq)}, ${j(p.related)}, ${b(p.featured)},
  ${b(p.bestSeller)}, ${i})
on conflict (slug) do update set
  name = excluded.name, category_slug = excluded.category_slug,
  tagline = excluded.tagline, card_summary = excluded.card_summary,
  badges = excluded.badges, quick_specs = excluded.quick_specs, image = excluded.image,
  gallery = excluded.gallery, downloads = excluded.downloads,
  download_note = excluded.download_note, description = excluded.description,
  lists = excluded.lists, specs = excluded.specs, spec_note = excluded.spec_note,
  spec_table = excluded.spec_table, installation = excluded.installation,
  legal_standards = excluded.legal_standards, faq = excluded.faq,
  related = excluded.related, featured = excluded.featured,
  best_seller = excluded.best_seller, sort_order = excluded.sort_order;`,
  );
});

// ── บทความ ─────────────────────────────────────────────────────────────────
articles.forEach((a) => {
  out.push(
    `insert into public.articles (slug, title, excerpt, image, date_iso, date_label, tag, body)
values (${q(a.slug)}, ${q(a.title)}, ${q(a.excerpt)}, ${q(a.image)}, ${q(a.date)}, ${q(a.dateLabel)}, ${q(a.tag)}, ${j(a.body)})
on conflict (slug) do update set
  title = excluded.title, excerpt = excluded.excerpt, image = excluded.image,
  date_iso = excluded.date_iso, date_label = excluded.date_label, tag = excluded.tag,
  body = excluded.body;`,
  );
});

/* ผลงานและ FAQ ไม่มี slug ให้ยึด — ใช้ "ลบทิ้งแล้วใส่ใหม่ตามลำดับในไฟล์"
   ปลอดภัยเพราะสคริปต์นี้ใช้ตอนย้ายข้อมูลเข้าครั้งแรกเท่านั้น ไม่ได้รันทับของที่
   ลูกค้าแก้แล้ว (ถ้าจะรันซ้ำหลังลูกค้าเริ่มใช้งาน ให้ข้ามสองบล็อกนี้) */
out.push("delete from public.projects;");
projects.forEach((p, i) => {
  out.push(
    `insert into public.projects (image, title, scope, span, sort_order)
values (${q(p.image)}, ${q(p.title)}, ${q(p.scope)}, ${q(p.span)}, ${i});`,
  );
});

out.push("delete from public.faqs where page = 'home';");
homeFaqs.forEach((f, i) => {
  out.push(
    `insert into public.faqs (page, question, answer, sort_order)
values ('home', ${q(f.q)}, ${q(f.a)}, ${i});`,
  );
});

// ── หน้าบริการรับรองสีกันไฟ ────────────────────────────────────────────────
services.forEach((s, i) => {
  out.push(
    `insert into public.services (slug, label, eyebrow, title, lede, image, highlights, blocks, products, faq, sort_order)
values (${q(s.slug)}, ${q(s.label)}, ${q(s.eyebrow)}, ${q(s.title)}, ${q(s.lede)}, ${q(s.image)}, ${j(s.highlights)}, ${j(s.blocks)}, ${j(s.products)}, ${j(s.faq)}, ${i})
on conflict (slug) do update set
  label = excluded.label, eyebrow = excluded.eyebrow, title = excluded.title,
  lede = excluded.lede, image = excluded.image, highlights = excluded.highlights,
  blocks = excluded.blocks, products = excluded.products, faq = excluded.faq,
  sort_order = excluded.sort_order;`,
  );
});

// ── ค่าตั้งค่าเว็บไซต์ ─────────────────────────────────────────────────────
const settings: Record<string, unknown> = {
  company: { ...site },
  nav,
  standards,
  stats,
  home_showcase: { flagshipSlug, bestSellerSlugs, categoryTiles, valuePoints },
  installation_steps: installationSteps,
  legal_info: legalInfo,
};
for (const [key, value] of Object.entries(settings)) {
  out.push(
    `insert into public.site_settings (key, draft_value, published_value, published_at)
values (${q(key)}, ${j(value)}, ${j(value)}, now())
on conflict (key) do update set
  draft_value = excluded.draft_value, published_value = excluded.published_value,
  published_at = now();`,
  );
}

out.push(`-- สแนปช็อตให้ฐานข้อมูลสร้างเองจากคอลัมน์ ด้วยฟังก์ชันชุดเดียวกับที่ปุ่ม "เผยแพร่" ใช้
update public.categories c set published = private.category_snapshot(c.*), published_at = now();
update public.products   p set published = private.product_snapshot(p.*),  published_at = now();
update public.articles   a set published = private.article_snapshot(a.*),  published_at = now();
update public.projects   p set published = private.project_snapshot(p.*),  published_at = now();
update public.faqs       f set published = private.faq_snapshot(f.*),      published_at = now();
update public.services   s set published = private.service_snapshot(s.*),  published_at = now();`);

out.push("commit;");
console.log(out.join("\n\n"));
