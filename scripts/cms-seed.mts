/**
 * ย้ายเนื้อหาเดิมใน src/data/*.ts เข้าฐานข้อมูล CMS แล้วกดเผยแพร่ให้เลย
 *
 *   CMS_EMAIL=... CMS_PASSWORD=... node --env-file=.env.local scripts/cms-seed.mts
 *
 * เขียนผ่าน supabase-js ด้วยสิทธิ์ของผู้ใช้หลังบ้านจริง ไม่ใช่ service role key
 * แปลว่าสคริปต์นี้เดินผ่าน RLS ชุดเดียวกับที่หลังบ้านใช้ — ถ้ามันรันผ่าน
 * ก็แปลว่าสิทธิ์ของทีมงานถูกตั้งไว้ถูกต้องจริง ไม่ใช่ผ่านเพราะข้ามด่านไป
 *
 * รันซ้ำได้ (upsert ด้วย slug) ยกเว้นผลงานกับ FAQ ที่ไม่มี slug ให้ยึด
 * — สองอย่างนั้นจะถูกล้างแล้วใส่ใหม่ตามลำดับในไฟล์ ถ้าลูกค้าเริ่มแก้แล้ว
 * อย่ารันสคริปต์นี้ซ้ำ
 */
import { createClient } from "@supabase/supabase-js";
import { categories, installationSteps, legalInfo, products } from "../src/data/products.ts";
import { articles } from "../src/data/news.ts";
import { projects } from "../src/data/projects.ts";
import { homeFaqs } from "../src/data/faq.ts";
import { services } from "../src/data/fireproofing.ts";
import { site, nav, standards, stats } from "../src/data/site.ts";
import { bestSellerSlugs, categoryTiles, flagshipSlug, valuePoints } from "../src/data/home.ts";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const email = process.env.CMS_EMAIL;
const password = process.env.CMS_PASSWORD;

if (!url || !key) throw new Error("ต้องมี NEXT_PUBLIC_SUPABASE_URL และ NEXT_PUBLIC_SUPABASE_ANON_KEY");
if (!email || !password) throw new Error("ต้องมี CMS_EMAIL และ CMS_PASSWORD");

const sb = createClient(url, key, { auth: { persistSession: false } });

const { error: authError } = await sb.auth.signInWithPassword({ email, password });
if (authError) throw new Error(`เข้าสู่ระบบไม่สำเร็จ: ${authError.message}`);

/** โยนทิ้งทันทีที่เขียนไม่ผ่าน ดีกว่า seed ครึ่งๆ กลางๆ แล้วไม่มีใครรู้ */
const run = async <T>(what: string, p: PromiseLike<{ error: { message: string } | null; data?: T }>) => {
  const { error, data } = await p;
  if (error) throw new Error(`${what}: ${error.message}`);
  return data;
};

await run(
  "หมวดหมู่",
  sb.from("categories").upsert(
    categories.map((c, i) => ({
      slug: c.slug, name: c.name, short: c.short,
      description: c.description, image: c.image, sort_order: i,
    })),
    { onConflict: "slug" },
  ),
);
console.log(`หมวดหมู่ ${categories.length} รายการ`);

await run(
  "สินค้า",
  sb.from("products").upsert(
    products.map((p, i) => ({
      slug: p.slug, name: p.name, category_slug: p.category,
      tagline: p.tagline, card_summary: p.cardSummary,
      badges: p.badges, quick_specs: p.quickSpecs, image: p.image,
      gallery: p.gallery, downloads: p.downloads ?? [],
      download_note: p.downloadNote ?? null, description: p.description,
      lists: p.lists ?? [], specs: p.specs, spec_note: p.specNote ?? null,
      spec_table: p.table ?? null, installation: p.installation ?? false,
      legal_standards: p.legalStandards ?? null, faq: p.faq, related: p.related,
      featured: p.featured ?? false, best_seller: p.bestSeller ?? false,
      sort_order: i,
    })),
    { onConflict: "slug" },
  ),
);
console.log(`สินค้า ${products.length} รายการ`);

await run(
  "บทความ",
  sb.from("articles").upsert(
    articles.map((a) => ({
      slug: a.slug, title: a.title, excerpt: a.excerpt, image: a.image,
      date_iso: a.date, date_label: a.dateLabel, tag: a.tag, body: a.body,
    })),
    { onConflict: "slug" },
  ),
);
console.log(`บทความ ${articles.length} รายการ`);

await run(
  "หน้าบริการ",
  sb.from("services").upsert(
    services.map((s, i) => ({
      slug: s.slug, label: s.label, eyebrow: s.eyebrow, title: s.title,
      lede: s.lede, image: s.image, highlights: s.highlights, blocks: s.blocks,
      products: s.products, faq: s.faq, sort_order: i,
    })),
    { onConflict: "slug" },
  ),
);
console.log(`หน้าบริการ ${services.length} รายการ`);

/* ไม่มี slug ให้ยึด — ล้างแล้วใส่ใหม่ตามลำดับในไฟล์ */
await run("ล้างผลงานเดิม", sb.from("projects").delete().gte("id", 0));
await run(
  "ผลงาน",
  sb.from("projects").insert(
    projects.map((p, i) => ({
      image: p.image, title: p.title, scope: p.scope,
      span: p.span ?? null, sort_order: i,
    })),
  ),
);
console.log(`ผลงาน ${projects.length} รายการ`);

await run("ล้าง FAQ เดิม", sb.from("faqs").delete().eq("page", "home"));
await run(
  "FAQ",
  sb.from("faqs").insert(
    homeFaqs.map((f, i) => ({ page: "home", question: f.q, answer: f.a, sort_order: i })),
  ),
);
console.log(`FAQ ${homeFaqs.length} ข้อ`);

const settings: Record<string, unknown> = {
  company: { ...site },
  nav,
  standards,
  stats,
  home_showcase: { flagshipSlug, bestSellerSlugs, categoryTiles, valuePoints },
  installation_steps: installationSteps,
  legal_info: legalInfo,
};
await run(
  "ตั้งค่าเว็บไซต์",
  sb.from("site_settings").upsert(
    Object.entries(settings).map(([key, value]) => ({ key, draft_value: value })),
    { onConflict: "key" },
  ),
);
console.log(`ตั้งค่าเว็บไซต์ ${Object.keys(settings).length} รายการ`);

/* เผยแพร่ทั้งหมด — เนื้อหาชุดนี้คือสิ่งที่อยู่บนเว็บจริงอยู่แล้ว
   สแนปช็อตสร้างโดยฟังก์ชันในฐานข้อมูล ตัวเดียวกับที่ปุ่มเผยแพร่ในหลังบ้านใช้ */
for (const entity of ["category", "product", "article", "service", "project", "faq"]) {
  const { data, error } = await sb.rpc("cms_publish_all", { p_entity: entity });
  if (error) throw new Error(`เผยแพร่ ${entity}: ${error.message}`);
  console.log(`เผยแพร่ ${entity}: ${data} รายการ`);
}
for (const key of Object.keys(settings)) {
  const { error } = await sb.rpc("cms_publish", { p_entity: "setting", p_key: key });
  if (error) throw new Error(`เผยแพร่ค่า ${key}: ${error.message}`);
}
console.log("เผยแพร่ค่าตั้งค่าเว็บไซต์ครบแล้ว");
