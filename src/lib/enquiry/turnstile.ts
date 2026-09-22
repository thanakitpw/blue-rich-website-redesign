/**
 * ตรวจ token ของ Cloudflare Turnstile ฝั่งเซิร์ฟเวอร์
 *
 * ── ผลลัพธ์สี่แบบ ทำไมไม่ใช่แค่ผ่าน/ไม่ผ่าน ──
 * ok          Cloudflare ยืนยันว่า token ถูกต้อง
 * fail        token ปลอมหรือถูกแก้ — บอตแน่ ทิ้งได้เลย
 * unverified  ยังตัดสินไม่ได้: ไม่มี token (สคริปต์โหลดไม่ขึ้น / กดส่งเร็วกว่าที่
 *             widget จะพร้อม), token หมดอายุหรือถูกใช้แล้ว, หรือ Cloudflare ล่ม
 *             เคสพวกนี้ลูกค้าจริงเจอได้ จึงไม่ทิ้ง แค่ติดป้ายแล้วให้ตัวกรองเนื้อหา
 *             ตัดสินต่อ
 * skip        ยังไม่ได้ตั้งค่า TURNSTILE_SECRET_KEY — ข้ามขั้นนี้ไปเลย
 *
 * หลักคือ "สงสัยให้ส่งต่อ ชัดเจนค่อยทิ้ง" — พลาดสแปมหนึ่งฉบับเสียเวลาลบ
 * แต่พลาดลูกค้าหนึ่งรายเสียงาน
 */
export type TurnstileResult = "ok" | "fail" | "unverified" | "skip";

const VERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";

export async function verifyTurnstile(
  token: string,
  ip: string | null,
): Promise<TurnstileResult> {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) return "skip";
  if (!token) return "unverified";

  const body = new URLSearchParams({ secret, response: token });
  if (ip) body.set("remoteip", ip);

  try {
    const res = await fetch(VERIFY_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body,
      signal: AbortSignal.timeout(5000),
    });
    const data = (await res.json()) as { success?: boolean; "error-codes"?: string[] };
    if (data.success) return "ok";

    const codes = data["error-codes"] ?? [];
    // หมดอายุ/ใช้ซ้ำ = ลูกค้ากรอกนานหรือกดส่งซ้ำหลัง error ไม่ใช่หลักฐานว่าเป็นบอต
    if (codes.includes("timeout-or-duplicate")) return "unverified";
    // ฝั่งเราตั้งค่าผิด (secret ผิด ฯลฯ) ไม่ใช่ความผิดผู้ส่ง
    if (codes.some((c) => c.startsWith("invalid-input-secret") || c === "internal-error")) {
      console.error("[enquiry] Turnstile ตั้งค่าไม่ถูกต้อง:", codes.join(", "));
      return "unverified";
    }
    return "fail";
  } catch (err) {
    console.error("[enquiry] ติดต่อ Turnstile ไม่ได้:", err);
    return "unverified";
  }
}
