/**
 * เครื่องยนต์ของ "ข้อความประจำหน้า" — "ค่าตั้งต้นอยู่ในโค้ด · ฐานข้อมูลทับได้"
 *
 * หน้า landing เก็บข้อความไว้ในไฟล์ src/data/*-lp.ts เป็นก้อน object อยู่แล้ว
 * จึงไม่ต้องรื้อ JSX — อ้างอิงข้อความแต่ละจุดด้วย "เส้นทางในก้อนนั้น" ตรงๆ
 *
 *   hero.title · faqs.2.a · quoteForm.fields.3.options.1
 *
 * ต่างจากการไล่เลข t01 t02 ตรงที่กุญแจผูกกับ "ความหมาย" ไม่ใช่ "ลำดับ"
 * เพิ่มย่อหน้าใหม่ตรงกลางแล้วกุญแจของย่อหน้าอื่นไม่เลื่อนตาม
 *
 * ไฟล์นี้ตั้งใจให้ไม่มี import อะไรเลย เพราะทั้งหน้าจอแก้ไขฝั่ง client
 * และสคริปต์ใน scripts/ ต้องใช้ — ถ้าลาก supabase เข้ามา ไคลเอนต์ฐานข้อมูล
 * จะถูกรวมเข้า bundle ของเบราว์เซอร์ไปด้วยโดยไม่มีใครสังเกต
 */

/** FNV-1a — สั้น เร็ว พอสำหรับตรวจว่าข้อความต้นทางถูกแก้หรือยัง */
export function hashText(s: string): string {
  let h = 0x811c9dc5;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return (h >>> 0).toString(36);
}

/**
 * คีย์ที่เป็น "โครงสร้าง" ไม่ใช่ข้อความให้คนอ่าน
 *
 * ถ้าปล่อยให้แก้ได้ ลูกค้าจะทำลิงก์ในหน้าพัง ฟอร์มส่งไม่ออก หรือ anchor เลื่อนไปผิดที่
 * โดยไม่รู้ตัว — เช่น navSections[].href ที่ต้องตรงกับ id ของ section
 * และ quoteForm.fields[].name ที่ถูกใช้เป็นชื่อฟิลด์ตอนประกอบอีเมล
 */
const STRUCTURAL_KEYS = new Set([
  "href", "src", "id", "slug", "kind", "name", "type", "icon", "topicField",
]);

/** ค่าที่หน้าตาเป็นเส้นทาง ลิงก์ หรือ anchor — กันไว้อีกชั้นเผื่อมีคีย์ชื่ออื่น */
const looksStructural = (v: string) =>
  v.startsWith("/") || v.startsWith("#") || v.startsWith("http") || v.startsWith("mailto:");

export type CopyEntry = { path: string; value: string };

/**
 * เดินเก็บข้อความทุกใบในก้อน object พร้อมเส้นทาง
 *
 * ลำดับที่ได้คือลำดับการประกาศในไฟล์ ซึ่งตรงกับลำดับที่แสดงบนหน้าเว็บ
 * หน้าจอแก้ไขจึงเรียงตามนั้นได้เลยโดยไม่ต้องจัดลำดับเพิ่ม
 */
export function collectCopy(node: unknown, prefix = ""): CopyEntry[] {
  if (typeof node === "string") {
    const key = prefix.slice(prefix.lastIndexOf(".") + 1);
    if (STRUCTURAL_KEYS.has(key) || looksStructural(node) || !node.trim()) return [];
    return [{ path: prefix, value: node }];
  }

  if (Array.isArray(node)) {
    return node.flatMap((item, i) => collectCopy(item, prefix ? `${prefix}.${i}` : String(i)));
  }

  if (node && typeof node === "object") {
    return Object.entries(node).flatMap(([k, v]) => {
      if (STRUCTURAL_KEYS.has(k)) return [];
      return collectCopy(v, prefix ? `${prefix}.${k}` : k);
    });
  }

  return [];
}

export type Override = { value: string; hash: string | null };

/**
 * คืนก้อนใหม่ที่ข้อความถูกทับตามเส้นทาง — ไม่แก้ของเดิม
 *
 * จะทับก็ต่อเมื่อ hash ของข้อความตั้งต้นยังตรงกับที่บันทึกไว้ตอนลูกค้ากดแก้
 * ถ้านักพัฒนาแก้ข้อความในโค้ดไปแล้ว ค่าที่ลูกค้าเคยแก้จะถูกข้าม แล้วแสดงค่าจากโค้ดแทน
 * — ปลอดภัยกว่าปล่อยให้ข้อความเก่าทับข้อความที่เพิ่งแก้โดยไม่มีใครรู้
 */
export function applyCopy<T>(node: T, overrides: Map<string, Override>, prefix = ""): T {
  if (typeof node === "string") {
    const hit = overrides.get(prefix);
    if (!hit) return node;
    if (hit.hash && hit.hash !== hashText(node)) return node;
    return hit.value as unknown as T;
  }

  if (Array.isArray(node)) {
    return node.map((item, i) =>
      applyCopy(item, overrides, prefix ? `${prefix}.${i}` : String(i)),
    ) as unknown as T;
  }

  if (node && typeof node === "object") {
    return Object.fromEntries(
      Object.entries(node).map(([k, v]) => [
        k,
        applyCopy(v, overrides, prefix ? `${prefix}.${k}` : k),
      ]),
    ) as T;
  }

  return node;
}
