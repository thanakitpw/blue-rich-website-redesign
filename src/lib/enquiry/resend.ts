/**
 * ส่งอีเมลผ่าน Resend ด้วย REST API ตรงๆ
 *
 * ── ทำไมไม่ใช้แพ็กเกจ resend ──
 * ใช้แค่ endpoint เดียว (POST /emails) การยิง fetch เองสั้นกว่าและไม่เพิ่ม
 * dependency ที่ต้องตามอัปเดต ถ้าวันหน้าต้องใช้ webhook หรือ template ค่อยเปลี่ยน
 *
 * ── ทำไม from ต้องเป็น @blue-rich.com ──
 * Resend ยอมส่งจากโดเมนที่ verify แล้วเท่านั้น (DKIM/SPF ของ Resend อยู่ใน
 * Cloudflare ของโดเมนนี้) ส่วนอีเมลที่ลูกค้ากรอกในฟอร์มใส่เป็น reply_to
 * เพื่อให้ทีมขายกด Reply ตอบกลับได้ทันทีโดยไม่ต้องคัดลอกที่อยู่
 */
export type OutboundMail = {
  to: string;
  subject: string;
  text: string;
  replyTo?: string;
};

export type SendResult = { ok: true; id: string } | { ok: false; error: string };

const DEFAULT_FROM = "Blue Rich Website <website@blue-rich.com>";

export async function sendViaResend(mail: OutboundMail): Promise<SendResult> {
  const key = process.env.RESEND_API_KEY;
  if (!key) return { ok: false, error: "ยังไม่ได้ตั้งค่า RESEND_API_KEY" };

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: process.env.ENQUIRY_FROM_EMAIL || DEFAULT_FROM,
      to: [mail.to],
      subject: mail.subject,
      text: mail.text,
      ...(mail.replyTo ? { reply_to: mail.replyTo } : {}),
    }),
  });

  const body = (await res.json().catch(() => ({}))) as { id?: string; message?: string };
  if (!res.ok || !body.id) {
    return { ok: false, error: body.message ?? `Resend ตอบ HTTP ${res.status}` };
  }
  return { ok: true, id: body.id };
}
