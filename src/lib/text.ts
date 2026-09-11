/**
 * กันชื่อมาตรฐานไม่ให้ถูกตัดขึ้นบรรทัดใหม่กลางคำ — "ISO 834" ต้องอยู่บรรทัดเดียวกัน
 * ไม่ใช่ "ISO" ค้างท้ายบรรทัดแล้ว "834" ตกไปอยู่บรรทัดถัดไป
 *
 * ทำตอนแสดงผลแทนการฝัง NBSP ไว้ในข้อความ เพราะข้อความสินค้ามาจากหลังบ้าน
 * ที่ลูกค้าแก้เองได้ ถ้าฝังไว้ในข้อมูล พอลูกค้าพิมพ์ทับก็หลุด
 *
 * จับ: ISO 834 · ASTM E119 · ASTM E-119 · EN 13381 · BS 476 · มอก. 2321
 * ช่องว่างและขีดในโค้ดถูกแทนด้วย NBSP / non-breaking hyphen ตามลำดับ
 */
const STANDARD = /\b(ISO|ASTM|EN|BS|มอก\.)\s+([A-Z]?-?\d[\d-]*)/g;

export const keepStandardsTogether = (text: string) =>
  text.replace(STANDARD, (_, org: string, code: string) => `${org} ${code.replace(/-/g, "‑")}`);
