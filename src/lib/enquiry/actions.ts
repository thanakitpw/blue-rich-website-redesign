"use server";

import { getSiteInfo } from "@/lib/cms/content";
import { logEnquiry } from "./log";
import { requestMeta, type RequestMeta } from "./request";
import { sendViaResend } from "./resend";
import { FLAG_LABEL, screenEnquiry, type Flag } from "./screen";
import { verifyTurnstile, type TurnstileResult } from "./turnstile";

/**
 * รับข้อมูลจากฟอร์มสอบถาม / ขอใบเสนอราคา คัดกรองสแปม แล้วส่งเป็นอีเมลถึงทีมขาย
 *
 * ── ทำไมฟอร์มต้องส่ง spec มาด้วย ──
 * ฟอร์มหน้าติดต่อกับฟอร์มหน้าแลนดิ้งแต่ละหน้ามีช่องไม่เหมือนกัน (สีกันไฟถาม
 * อัตราทนไฟ ทินเนอร์ถามขนาดบรรจุ) spec คือรายชื่อช่องพร้อมป้ายกำกับสำหรับ
 * เรียงลงในเนื้อเมล — component ผูกมาให้ด้วย .bind() ก่อนส่งเข้า useActionState
 *
 * ── ลำดับการคัดกรอง ──
 *   1. honeypot        ช่องซ่อนมีค่า = บอตกรอกทุกช่อง
 *   2. Turnstile       Cloudflare ยืนยันว่าเบราว์เซอร์นี้ไม่ใช่บอต (./turnstile.ts)
 *   3. เนื้อหา          ภาษา ลิงก์ รูปแบบเบอร์ ประเทศต้นทาง (./screen.ts)
 *   4. rate limit      ต่อ IP นับในฐานข้อมูล (./log.ts)
 * ทุกฉบับถูกบันทึกลงตาราง enquiries ไม่ว่าจะส่งหรือทิ้ง ดูย้อนหลังได้ที่ /admin/enquiries
 *
 * ── ทิ้งแบบเงียบ ──
 * ฉบับที่ถูกทิ้งได้คำตอบ "ส่งแล้ว" เหมือนปกติ บอตจะได้ไม่รู้ว่าโดนกรองแล้วปรับตัว
 * ฉบับที่แค่ "น่าสงสัย" ยังส่งถึงทีมขาย แต่ subject จะขึ้น [ต่างประเทศ] หรือ
 * [โปรดตรวจสอบ] และท้ายเมลมีข้อมูลผู้ส่ง (ประเทศ IP อุปกรณ์ ข้อสังเกต) ให้ดูประกอบ
 *
 * ── ขอบเขตความปลอดภัย ──
 * นี่คือฟอร์มสาธารณะ ใครก็ยิงได้ตามที่ออกแบบ สิ่งที่เซิร์ฟเวอร์คุมเองคือ
 * "ส่งไปหาใคร" (มาจาก env หรือหลังบ้าน ไม่ใช่จากฟอร์ม) ความยาวข้อความ และ
 * ตัวคัดกรองข้างบน ส่วนเนื้อหาเมลผู้กรอกคุมได้อยู่แล้วโดยธรรมชาติของฟอร์มติดต่อ
 */
export type EnquiryField = {
  name: string;
  label: string;
  multiline?: boolean;
  /** ช่องเลือกที่ตัวเลือกเป็นไทยเสมอ — ไม่นับตอนเช็คว่าข้อความมีภาษาไทยไหม */
  select?: boolean;
};

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
/* token ของ Turnstile ยาวได้ถึง 2048 ตัวอักษร ห้ามตัดด้วยขีดจำกัดของช่องข้อความ */
const MAX_TOKEN_LENGTH = 4096;

const TURNSTILE_LABEL: Record<TurnstileResult, string> = {
  ok: "ผ่าน",
  fail: "ไม่ผ่าน",
  unverified: "ยังไม่ได้ยืนยัน (สคริปต์ไม่โหลด/token หมดอายุ)",
  skip: "ยังไม่เปิดใช้",
};

export async function sendEnquiry(
  spec: EnquirySpec,
  _prev: EnquiryState,
  formData: FormData,
): Promise<EnquiryState> {
  const raw = (k: string) => String(formData.get(k) ?? "").trim();
  const get = (k: string) => raw(k).slice(0, MAX_FIELD_LENGTH);

  const name = get("name");
  const phone = get("phone");
  if (!name || !phone) {
    return { status: "error", message: "กรุณากรอกชื่อและเบอร์โทรติดต่อกลับ" };
  }

  const fields = spec.fields.slice(0, MAX_FIELDS).map((f) => ({ ...f, value: get(f.name) }));
  const topic = spec.topicField ? get(spec.topicField) : "";
  const baseSubject = [`[${spec.subject}]`, topic, "—", name].filter(Boolean).join(" ");
  const meta = await requestMeta();

  /* ── คัดกรอง ── */
  let turnstile: TurnstileResult = "skip";
  let flags: Flag[] = [];
  let dropReason: string | null = null;

  if (raw("website")) {
    // ช่องที่ซ่อนไว้ คนจริงมองไม่เห็นจึงไม่กรอก บอตกรอกทุกช่อง
    dropReason = "honeypot";
  } else {
    turnstile = await verifyTurnstile(raw("cf-turnstile-response").slice(0, MAX_TOKEN_LENGTH), meta.ip);

    const screened = screenEnquiry({
      name,
      phone,
      freeText: fields
        .filter((f) => !f.select && f.name !== "phone" && f.name !== "email")
        .map((f) => f.value),
      country: meta.country,
    });
    flags = screened.flags;
    if (turnstile === "unverified") flags.push("unverified");
    dropReason = turnstile === "fail" ? "turnstile" : screened.dropReason;
  }

  const logged = await logEnquiry({
    source: spec.source,
    subject: baseSubject,
    fields: fields.map(({ label, value }) => ({ label, value })),
    meta,
    turnstile,
    flags,
    verdict: dropReason ? "dropped" : "delivered",
    reason: dropReason,
  });
  // ฐานข้อมูลตัดสิน rate limit เพิ่มได้ทางเดียว: จาก "ส่ง" เป็น "ทิ้ง"
  if (logged?.verdict === "dropped") dropReason = logged.reason ?? dropReason ?? "rate-limit";

  console.info(
    `[enquiry] ${dropReason ? `dropped:${dropReason}` : "delivered"}`,
    `country=${meta.country ?? "?"} ip=${meta.ip ?? "?"} turnstile=${turnstile}`,
    `flags=${flags.join(",") || "-"} row=${logged?.id ?? "-"}`,
  );

  // ทิ้งเงียบๆ — ตอบเหมือนส่งสำเร็จ ไม่ให้บอตรู้ตัว (ฉบับนี้ยังอยู่ในตาราง enquiries)
  if (dropReason) return { status: "sent" };

  /* ── ประกอบเมล ── */
  const tag = flags.includes("foreign") ? "[ต่างประเทศ]" : flags.length ? "[โปรดตรวจสอบ]" : "";
  const subject = [tag, baseSubject].filter(Boolean).join(" ");

  const lines = fields.map((f) =>
    f.multiline ? `\n${f.label}:\n${f.value || "-"}` : `${f.label}: ${f.value || "-"}`,
  );
  const sentAt = new Date().toLocaleString("th-TH", {
    timeZone: "Asia/Bangkok",
    dateStyle: "medium",
    timeStyle: "short",
  });
  const text = [
    `${spec.subject} — จาก${spec.source}`,
    "",
    ...lines,
    "",
    `ส่งเมื่อ ${sentAt}`,
    "",
    ...senderBlock(meta, turnstile, flags),
  ].join("\n");

  const email = get("email");
  const to = process.env.ENQUIRY_TO_EMAIL || (await getSiteInfo()).email;
  const res = await sendViaResend({
    to,
    subject,
    text,
    replyTo: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? email : undefined,
  });

  if (!res.ok) {
    console.error(`[enquiry] ส่งอีเมลไม่สำเร็จ (row=${logged?.id ?? "-"}):`, res.error);
    return { status: "error", message: "ส่งข้อความไม่สำเร็จ" };
  }
  return { status: "sent" };
}

/** ท้ายเมล: สิ่งที่ระบบรู้เกี่ยวกับผู้ส่ง ให้ทีมขายใช้ประกอบการตัดสินใจ */
function senderBlock(meta: RequestMeta, turnstile: TurnstileResult, flags: Flag[]): string[] {
  const where = [meta.country ?? "ไม่ทราบ", meta.city].filter(Boolean).join(" · ");
  const notes = flags.map((f) => FLAG_LABEL[f]).join(", ") || "ไม่มี";
  return [
    "──────────────",
    "ข้อมูลผู้ส่ง (ระบบใส่ให้อัตโนมัติ)",
    `ประเทศ: ${where}`,
    `IP: ${meta.ip ?? "ไม่ทราบ"}`,
    `อุปกรณ์: ${meta.userAgent ?? "ไม่ทราบ"}`,
    `ตรวจบอต (Turnstile): ${TURNSTILE_LABEL[turnstile]}`,
    `ข้อสังเกต: ${notes}`,
    ...(meta.referer ? [`หน้าเว็บ: ${meta.referer}`] : []),
  ];
}
