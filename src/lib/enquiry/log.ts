import { publicClient } from "@/lib/supabase/public";
import type { RequestMeta } from "./request";
import type { Flag } from "./screen";
import type { TurnstileResult } from "./turnstile";

/**
 * บันทึกข้อความลงตาราง enquiries ผ่าน RPC enquiry_log() และรับผลตัดสิน rate limit กลับมา
 * (ดู supabase/migrations/0005_enquiries.sql ว่าทำไมการนับต่อ IP ต้องอยู่ในฐานข้อมูล)
 *
 * ทุกทางที่ล้มเหลว (ยังไม่ตั้งค่า Supabase, เครือข่ายล่ม, ฟังก์ชันปฏิเสธ) คืน null
 * แล้วผู้เรียกใช้ผลตัดสินเดิมของตัวเองต่อ — ฐานข้อมูลล่มต้องไม่ทำให้ลูกค้าส่งฟอร์มไม่ได้
 */
export type Verdict = "delivered" | "dropped";

export type EnquiryLogInput = {
  source: string;
  subject: string;
  fields: { label: string; value: string }[];
  meta: RequestMeta;
  turnstile: TurnstileResult;
  flags: Flag[];
  verdict: Verdict;
  reason: string | null;
};

export type EnquiryLogResult = { id: number; verdict: Verdict; reason: string | null };

// PostgREST แปลง string เป็น inet ให้ แต่ค่าที่ไม่ใช่ IP จะทำให้ทั้งคำสั่งล้ม
const IPV4 = /^\d{1,3}(\.\d{1,3}){3}$/;
const IPV6 = /^[0-9a-f:]+$/i;
const asInet = (ip: string | null) => (ip && (IPV4.test(ip) || IPV6.test(ip)) ? ip : null);

export async function logEnquiry(input: EnquiryLogInput): Promise<EnquiryLogResult | null> {
  const sb = publicClient();
  if (!sb) return null;

  const { data, error } = await sb.rpc("enquiry_log", {
    p_source: input.source,
    p_subject: input.subject,
    p_fields: input.fields,
    p_ip: asInet(input.meta.ip),
    p_country: input.meta.country,
    p_city: input.meta.city,
    p_user_agent: input.meta.userAgent,
    p_referer: input.meta.referer,
    p_turnstile: input.turnstile,
    p_flags: input.flags,
    p_verdict: input.verdict,
    p_reason: input.reason,
  });

  if (error) {
    console.error("[enquiry] บันทึกลงฐานข้อมูลไม่สำเร็จ:", error.code, error.message);
    return null;
  }
  return data as EnquiryLogResult;
}
