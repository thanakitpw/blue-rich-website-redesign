/**
 * event ที่เว็บส่งเข้า GA4 เอง (ส่วน page_view / scroll / outbound click
 * Enhanced measurement เก็บให้แล้ว)
 *
 * generate_lead เป็นชื่อ event แนะนำของ GA4 สำหรับธุรกิจที่ขายผ่าน lead
 * ต้องไปติดดาวเป็น Key event ใน GA4 → Admin → Events หลังมี event แรกเข้ามา
 */
type GtagWindow = Window & {
  gtag?: (...args: unknown[]) => void;
  dataLayer?: unknown[];
};

export function trackLead(params: { form: string; topic?: string }) {
  if (typeof window === "undefined") return;
  const w = window as GtagWindow;
  const data = { form_location: window.location.pathname, form_name: params.form, topic: params.topic };
  // dataLayer ไว้ให้ GTM ถ้าวันหลังลูกค้ายิงแอดแล้วติด container เพิ่ม
  (w.dataLayer = w.dataLayer || []).push({ event: "generate_lead", ...data });
  w.gtag?.("event", "generate_lead", data);
}
