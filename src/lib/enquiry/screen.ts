/**
 * คัดกรองสแปมจากเนื้อหาที่กรอก — ฟังก์ชันล้วน ไม่แตะเครือข่าย ทดสอบง่าย
 *
 * ── หลักคิด ──
 * ลูกค้าของ Blue Rich คือโรงงาน ผู้รับเหมา วิศวกรในไทย ข้อความจริงแทบทั้งหมดมี
 * ภาษาไทยอย่างน้อยในชื่อหรือรายละเอียด และเบอร์โทรเป็นเบอร์ไทย ส่วนสแปมที่เข้า
 * มาทางฟอร์มติดต่อคือข้อความอังกฤษ/รัสเซียล้วนพร้อมลิงก์ จากนอกประเทศ
 *
 * แต่ละสัญญาณเดี่ยวๆ ยังไม่พอจะทิ้ง (วิศวกรต่างชาติที่ทำงานในไทยก็เขียนอังกฤษ
 * ลูกค้าไทยก็อาจแนบลิงก์แบบแปลน) จึงทิ้งเฉพาะเมื่อสัญญาณซ้อนกันจนไม่เหลือ
 * ทางที่เป็นลูกค้าจริง ที่เหลือส่งต่อพร้อมติดป้ายให้ทีมขายดูเอง
 */
export type Flag = "foreign" | "link" | "no-thai" | "foreign-phone" | "unverified";

export const FLAG_LABEL: Record<Flag, string> = {
  foreign: "ส่งจากนอกประเทศไทย",
  link: "มีลิงก์ในข้อความ",
  "no-thai": "ไม่มีภาษาไทยเลย",
  "foreign-phone": "เบอร์โทรไม่ใช่รูปแบบไทย",
  unverified: "ยังไม่ได้ยืนยันว่าไม่ใช่บอต",
};

export type ScreenInput = {
  name: string;
  phone: string;
  /** ข้อความช่องกรอกอิสระทั้งหมด (ชื่อ บริษัท รายละเอียด ฯลฯ) ไม่รวมช่องเลือกที่เป็นไทยเสมอ */
  freeText: string[];
  /** ISO 3166-1 alpha-2 จาก Vercel — null เมื่อไม่รู้ (เช่นรันในเครื่อง) */
  country: string | null;
};

export type ScreenResult = {
  flags: Flag[];
  /** เหตุที่ควรทิ้ง — null คือส่งต่อได้ */
  dropReason: string | null;
};

const THAI = /[฀-๿]/;
const LINK = /https?:\/\/|www\./i;

/** เบอร์ไทย: 0X-XXXX-XXXX (9–10 หลัก) หรือ +66 นำหน้า ยอมให้มีขีด ช่องว่าง วงเล็บ จุด */
export function isThaiPhone(raw: string): boolean {
  // ตัดส่วนท้ายที่ไม่ใช่ตัวเลขทิ้ง เช่น "081-234-5678 ต่อ 12" — เอาเฉพาะก้อนเบอร์นำหน้า
  const head = raw.trim().match(/^\+?[\d\s\-().]+/)?.[0] ?? "";
  const digits = head.replace(/[^\d+]/g, "");
  return /^(?:\+?660?|0)\d{8,9}$/.test(digits);
}

export function screenEnquiry(input: ScreenInput): ScreenResult {
  const flags: Flag[] = [];
  const text = [input.name, ...input.freeText].join("\n");

  const foreign = Boolean(input.country) && input.country !== "TH";
  const hasThai = THAI.test(text);
  const hasLink = LINK.test(text);
  const thaiPhone = isThaiPhone(input.phone);

  if (foreign) flags.push("foreign");
  if (hasLink) flags.push("link");
  if (!hasThai) flags.push("no-thai");
  if (!thaiPhone) flags.push("foreign-phone");

  let dropReason: string | null = null;
  if (hasLink && !hasThai) {
    dropReason = "link-no-thai";
  } else if (foreign && !hasThai && !thaiPhone) {
    dropReason = "foreign-no-thai";
  }

  return { flags, dropReason };
}
