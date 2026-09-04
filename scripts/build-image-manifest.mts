/**
 * รวบรวมรายการรูปใน public/ ไว้เป็นไฟล์ JSON สำหรับคลังรูปในหลังบ้าน
 *
 *   node scripts/build-image-manifest.mts     (รันอัตโนมัติตอน prebuild)
 *
 * ทำไมต้องสร้างตอน build ไม่ใช่อ่านโฟลเดอร์ตอน runtime — บน Vercel โฟลเดอร์
 * public ไม่ได้ถูกรวมเข้าไปในฟังก์ชัน ถ้าอ่านตอน runtime จะได้ลิสต์ว่างบน
 * โปรดักชันแต่ครบบนเครื่องตัวเอง โดยไม่มีใครรู้จนกว่าลูกค้าจะเปิดหน้าคลังรูป
 */
import { readdir, stat, writeFile } from "node:fs/promises";
import { join, relative } from "node:path";

const PUBLIC_DIR = "public";
const OUT = "src/data/public-images.json";
const EXT = /\.(png|jpe?g|webp|avif|gif|svg)$/i;

/** โฟลเดอร์ที่ไม่ใช่รูปของเว็บจริง — ตัวอย่างดีไซน์ที่เก็บไว้อ้างอิง */
const SKIP = new Set(["concept-b", "concept-c", "concept-d"]);

type Item = { url: string; filename: string; folder: string; bytes: number };

async function walk(dir: string, out: Item[]) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    if (entry.name.startsWith(".")) continue;
    const full = join(dir, entry.name);

    if (entry.isDirectory()) {
      if (SKIP.has(entry.name)) continue;
      await walk(full, out);
    } else if (EXT.test(entry.name)) {
      const rel = relative(PUBLIC_DIR, full);
      const folder = rel.includes("/") ? rel.slice(0, rel.lastIndexOf("/")) : "ราก";
      out.push({
        url: "/" + rel,
        filename: entry.name,
        folder,
        bytes: (await stat(full)).size,
      });
    }
  }
}

const items: Item[] = [];
await walk(PUBLIC_DIR, items);
items.sort((a, b) => a.url.localeCompare(b.url));
await writeFile(OUT, JSON.stringify(items, null, 2) + "\n");
console.log(`${OUT}: ${items.length} รูป`);
