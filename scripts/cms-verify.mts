/**
 * ตรวจว่าเนื้อหาใน DB ตรงกับไฟล์ต้นฉบับ src/data/*.ts จริงไหม
 *
 *   node --env-file=.env.local scripts/cms-verify.mts
 *
 * ทำสองอย่าง
 *   1. เทียบสแนปช็อต published ทีละรายการกับ object ในไฟล์ แบบ deep-equal
 *      ถ้าตรงกันหมด แปลว่าสลับหน้าเว็บไปอ่านจาก DB แล้วเนื้อหาจะไม่เพี้ยน
 *   2. ยิง REST API ด้วยสิทธิ์ anon เพื่อยืนยันว่าคอลัมน์ฉบับร่างถูกปฏิเสธจริง
 *      ไม่ใช่แค่ "โค้ดเราไม่ได้ขอ" แต่ฐานข้อมูลไม่ยอมให้ขอ
 */
import { createClient } from "@supabase/supabase-js";
import { categories, installationSteps, legalInfo, products } from "../src/data/products.ts";
import { articles } from "../src/data/news.ts";
import { projects } from "../src/data/projects.ts";
import { homeFaqs } from "../src/data/faq.ts";
import { services } from "../src/data/fireproofing.ts";
import { site, nav, standards, stats } from "../src/data/site.ts";
import { bestSellerSlugs, categoryTiles, clients, flagshipSlug, valuePoints } from "../src/data/home.ts";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const sb = createClient(url, key, { auth: { persistSession: false } });

let failures = 0;

/** เทียบแบบไม่สนลำดับคีย์ของ object แต่สนลำดับของอาเรย์ */
const canon = (v: unknown): unknown => {
  if (Array.isArray(v)) return v.map(canon);
  if (v && typeof v === "object") {
    return Object.fromEntries(
      Object.keys(v as object).sort().map((k) => [k, canon((v as Record<string, unknown>)[k])]),
    );
  }
  return v;
};
const same = (a: unknown, b: unknown) => JSON.stringify(canon(a)) === JSON.stringify(canon(b));

async function check<T>(
  label: string,
  table: string,
  order: { column: string; ascending?: boolean },
  expected: T[],
  keyOf: (row: T) => string,
) {
  const { data, error } = await sb
    .from(table)
    .select("published")
    .order(order.column, { ascending: order.ascending ?? true });
  if (error) {
    console.log(`✗ ${label}: อ่านไม่ได้ — ${error.message}`);
    failures++;
    return;
  }
  const got = (data ?? []).map((r) => r.published as T);

  if (got.length !== expected.length) {
    console.log(`✗ ${label}: มี ${got.length} รายการ ควรเป็น ${expected.length}`);
    failures++;
  }

  let bad = 0;
  expected.forEach((exp, i) => {
    if (!same(exp, got[i])) {
      bad++;
      if (bad <= 2) {
        console.log(`✗ ${label} · ${keyOf(exp)}`);
        console.log(`    ไฟล์: ${JSON.stringify(canon(exp)).slice(0, 300)}`);
        console.log(`    DB  : ${JSON.stringify(canon(got[i])).slice(0, 300)}`);
      }
    }
  });

  if (bad) failures++;
  console.log(`${bad ? "✗" : "✓"} ${label}: ${expected.length - bad}/${expected.length} ตรงกัน`);
}

await check("หมวดหมู่", "categories", { column: "sort_order" }, categories, (c) => c.slug);
await check("สินค้า", "products", { column: "sort_order" }, products, (p) => p.slug);
await check("ผลงาน", "projects", { column: "sort_order" }, projects, (p) => p.image);
await check("หน้าบริการ", "services", { column: "sort_order" }, services, (s) => s.slug);
await check("FAQ หน้าแรก", "faqs", { column: "sort_order" }, homeFaqs, (f) => f.q);

/* บทความในไฟล์เรียงตามวันที่ใหม่→เก่าอยู่แล้ว ตรงกับลำดับที่หน้าเว็บใช้ */
await check("บทความ", "articles", { column: "date_iso", ascending: false }, articles, (a) => a.slug);

// ── ค่าตั้งค่าเว็บไซต์ ─────────────────────────────────────────────────────
const expectedSettings: Record<string, unknown> = {
  company: { ...site }, nav, standards, stats,
  home_showcase: { flagshipSlug, bestSellerSlugs, categoryTiles, valuePoints, clients },
  installation_steps: installationSteps,
  legal_info: legalInfo,
};
const { data: settingRows } = await sb.from("site_settings").select("key, published_value");
for (const [k, exp] of Object.entries(expectedSettings)) {
  const row = (settingRows ?? []).find((r) => r.key === k);
  const ok = same(exp, row?.published_value);
  if (!ok) failures++;
  console.log(`${ok ? "✓" : "✗"} ค่าตั้งค่า "${k}"`);
}

// ── สิทธิ์ anon ────────────────────────────────────────────────────────────
console.log("\nสิทธิ์ของ anon (ต้องถูกปฏิเสธทุกข้อ)");
const denied: [string, string][] = [
  ["products", "name"],
  ["products", "has_draft"],
  ["articles", "body"],
  ["projects", "title"],
  ["services", "lede"],
  ["site_copy", "draft_value"],
  ["site_settings", "draft_value"],
  ["cms_users", "email"],
  ["media", "url"],
];
for (const [table, column] of denied) {
  const { error } = await sb.from(table).select(column).limit(1);
  const blocked = Boolean(error);
  if (!blocked) failures++;
  console.log(`  ${blocked ? "✓" : "✗"} ${table}.${column} — ${error?.code ?? "อ่านได้!"}`);
}

console.log(failures === 0 ? "\nผ่านทั้งหมด" : `\nไม่ผ่าน ${failures} ข้อ`);
process.exit(failures === 0 ? 0 : 1);
