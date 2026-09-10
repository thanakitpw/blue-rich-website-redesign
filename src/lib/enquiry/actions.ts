"use server";

import { getSiteInfo } from "@/lib/cms/content";
import { sendViaResend } from "./resend";

/**
 * รับข้อมูลจากฟอร์มสอบถาม / ขอใบเสนอราคา แล้วส่งเป็นอีเมลถึงทีมขาย
 *
 * ── ทำไมฟอร์มต้องส่ง spec มาด้วย ──
 * ฟอร์มหน้าติดต่อกับฟอร์มหน้าแลนดิ้งแต่ละหน้ามีช่องไม่เหมือนกัน (สีกันไฟถาม
 * อัตราทนไฟ ทินเนอร์ถามขนาดบรรจุ) spec คือรายชื่อช่องพร้อมป้ายกำกับสำหรับ
 * เรียงลงในเนื้อเมล — component ผูกมาให้ด้วย .bind() ก่อนส่งเข้า useActionState
 *
 * ── ขอบเขตความปลอดภัย ──
 * นี่คือฟอร์มสาธารณะ ใครก็ยิงได้ตามที่ออกแบบ สิ่งที่เซิร์ฟเวอร์คุมเองคือ
 * "ส่งไปหาใคร" (มาจาก env หรือหลังบ้าน ไม่ใช่จากฟอร์ม) ความยาวข้อความ และ
 * ช่องดักบอต ส่วนเนื้อหาเมลผู้กรอกคุมได้อยู่แล้วโดยธรรมชาติของฟอร์มติดต่อ
 */
export type EnquiryField = { name: string; label: string; multiline?: boolean };

export type EnquirySpec = {
  /** ข้อความในวงเล็บเหลี่ยมนำหน้า subject เช่น "สอบถามจากเว็บไซต์" */
  subject: string;
  /** ช่องที่จะเอาค่าไปต่อท้าย subject เช่น เรื่องที่สนใจ */
  topicField?: string;
  /** ช่องทั้งหมดตามลำดับที่จะเรียงในเนื้อเมล */
  fields: EnquiryField[];
  /** ที่มาของฟอร์ม เช่น "หน้าติดต่อเรา" — ขึ้นบรรทัดแรกของเมล */
  source: string;
};

export type EnquiryState =
  | { status: "idle" }
  | { status: "sent" }
  | { status: "error"; message: string };

const MAX_FIELD_LENGTH = 2000;
const MAX_FIELDS = 30;

export async function sendEnquiry(
  spec: EnquirySpec,
  _prev: EnquiryState,
  formData: FormData,
): Promise<EnquiryState> {
  const get = (k: string) => String(formData.get(k) ?? "").trim().slice(0, MAX_FIELD_LENGTH);

  // ช่องที่ซ่อนไว้ คนจริงมองไม่เห็นจึงไม่กรอก บอตกรอกทุกช่อง — ตอบว่าสำเร็จเฉยๆ ไม่ให้รู้ตัว
  if (get("website")) return { status: "sent" };

  const name = get("name");
  const phone = get("phone");
  if (!name || !phone) {
    return { status: "error", message: "กรุณากรอกชื่อและเบอร์โทรติดต่อกลับ" };
  }

  const topic = spec.topicField ? get(spec.topicField) : "";
  const subject = [`[${spec.subject}]`, topic, "—", name].filter(Boolean).join(" ");

  const lines = spec.fields
    .slice(0, MAX_FIELDS)
    .map((f) =>
      f.multiline ? `\n${f.label}:\n${get(f.name) || "-"}` : `${f.label}: ${get(f.name) || "-"}`,
    );
  const sentAt = new Date().toLocaleString("th-TH", {
    timeZone: "Asia/Bangkok",
    dateStyle: "medium",
    timeStyle: "short",
  });
  const text = [`${spec.subject} — จาก${spec.source}`, "", ...lines, "", `ส่งเมื่อ ${sentAt}`].join(
    "\n",
  );

  const email = get("email");
  const to = process.env.ENQUIRY_TO_EMAIL || (await getSiteInfo()).email;
  const res = await sendViaResend({
    to,
    subject,
    text,
    replyTo: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? email : undefined,
  });

  if (!res.ok) {
    console.error("[enquiry] ส่งอีเมลไม่สำเร็จ:", res.error);
    return { status: "error", message: "ส่งข้อความไม่สำเร็จ" };
  }
  return { status: "sent" };
}
