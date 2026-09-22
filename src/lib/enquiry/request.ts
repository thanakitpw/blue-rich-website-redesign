import { headers } from "next/headers";

/**
 * ข้อมูลผู้ส่งที่อ่านได้จาก header ของคำขอ — ใช้ต่อท้ายเมลและบันทึกลงตาราง
 *
 * ประเทศ/เมืองมาจาก header ที่ Vercel ใส่ให้ทุกคำขอ ในเครื่องหรือโฮสต์อื่นจะเป็น
 * null ทั้งคู่ ตัวกรองจึงต้องรับกรณี "ไม่รู้ประเทศ" ได้เสมอ
 */
export type RequestMeta = {
  ip: string | null;
  country: string | null;
  city: string | null;
  userAgent: string | null;
  referer: string | null;
};

export async function requestMeta(): Promise<RequestMeta> {
  const h = await headers();
  const first = (v: string | null) => v?.split(",")[0]?.trim() || null;

  // x-vercel-ip-city ถูก URL-encode มา (เช่น Chiang%20Mai)
  const rawCity = h.get("x-vercel-ip-city");
  let city: string | null = null;
  if (rawCity) {
    try {
      city = decodeURIComponent(rawCity);
    } catch {
      city = rawCity;
    }
  }

  return {
    ip: first(h.get("x-forwarded-for")) ?? first(h.get("x-real-ip")),
    country: h.get("x-vercel-ip-country")?.toUpperCase() || null,
    city,
    userAgent: h.get("user-agent")?.slice(0, 512) || null,
    referer: h.get("referer")?.slice(0, 512) || null,
  };
}
