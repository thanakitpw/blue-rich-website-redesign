/**
 * นับจุดที่แก้ได้ของแต่ละหน้า landing
 *
 *   node scripts/copy-count.mts
 *
 * ใช้ตัวเดินก้อนตัวเดียวกับที่หลังบ้านและหน้าเว็บใช้ ตัวเลขที่ได้จึงตรงกับ
 * ที่ลูกค้าเห็นในหน้า /admin/copy เสมอ
 */
import { collectCopy } from "../src/lib/cms/copy.ts";

const pages: [string, unknown][] = [
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
  console.log(`${name.padEnd(16)} ${String(n).padStart(4)} จุด`);
}
console.log(`${"รวม".padEnd(16)} ${String(total).padStart(4)} จุด`);

console.log("\nตัวอย่างกุญแจของ /neocoat");
for (const e of collectCopy(pages[0][1]).slice(0, 8)) {
  console.log(`  ${e.path.padEnd(30)} ${e.value.slice(0, 46)}`);
}
