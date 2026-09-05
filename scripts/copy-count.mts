/**
 * นับจุดที่แก้ได้ของทุกหน้าที่อยู่ในทะเบียน COPY_PAGES
 *
 *   node scripts/copy-count.mts
 *
 * ใช้ตัวเดินก้อนตัวเดียวกับที่หลังบ้านและหน้าเว็บใช้ ตัวเลขที่ได้จึงตรงกับ
 * ที่ลูกค้าเห็นในหน้า /admin/copy เสมอ
 *
 * ไล่ import ไฟล์ข้อมูลเองแทนที่จะอ่านจาก copy-pages.ts เพราะไฟล์นั้นแตะ
 * next/headers ซึ่งรันในสคริปต์ node ธรรมดาไม่ได้ — ถ้าเพิ่มหน้าใหม่ในทะเบียน
 * อย่าลืมเพิ่มบรรทัดที่นี่ด้วย
 */
import { collectCopy } from "../src/lib/cms/copy.ts";

const pages: [string, unknown][] = [
  ["/", await import("../src/data/pages/home.ts")],
  ["/about", await import("../src/data/pages/about.ts")],
  ["/contact", await import("../src/data/pages/contact.ts")],
  ["/standards", await import("../src/data/pages/standards.ts")],
  ["/products", await import("../src/data/pages/products.ts")],
  ["/news", await import("../src/data/pages/news.ts")],
  ["/projects", await import("../src/data/pages/projects.ts")],
  ["/intumescent", await import("../src/data/pages/intumescent.ts")],
  ["/paint", await import("../src/data/pages/paint.ts")],
  ["/hardware", await import("../src/data/pages/hardware.ts")],
  ["/fireproofing", await import("../src/data/pages/fireproofing.ts")],
  ["โครงหน้าสินค้า", await import("../src/data/pages/product-detail.ts")],
  ["โครงหน้าบทความ", await import("../src/data/pages/article-detail.ts")],
  ["โครงหน้าบริการ", await import("../src/data/pages/service-detail.ts")],
  ["/neocoat", await import("../src/data/fire-paint-lp.ts")],
  ["/thinner", await import("../src/data/thinner-lp.ts")],
  ["/four-plus", await import("../src/data/four-plus-lp.ts")],
  ["/fire-blanket", await import("../src/data/fire-blanket-lp.ts")],
  ["/engineering", await import("../src/data/engineering-lp.ts")],
];

let total = 0;
for (const [name, mod] of pages) {
  const n = collectCopy(mod).length;
  total += n;
  console.log(`${name.padEnd(18)} ${String(n).padStart(4)} จุด`);
}
console.log(`${"รวม".padEnd(18)} ${String(total).padStart(4)} จุด`);

console.log("\nตัวอย่างกุญแจของหน้าแรก");
for (const e of collectCopy(pages[0][1]).slice(0, 8)) {
  console.log(`  ${e.path.padEnd(30)} ${e.value.slice(0, 46)}`);
}
