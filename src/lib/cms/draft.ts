/**
 * ตัดฟิลด์ที่ฐานข้อมูลดูแลเองออก เหลือเฉพาะฟิลด์ที่หลังบ้านเขียนได้
 * (id · has_draft · published_at · updated_at ถูกตั้งโดย trigger และ RPC)
 *
 * อยู่แยกจาก src/lib/cms/admin.ts เพราะฟอร์มฝั่ง client ต้องใช้ ส่วน admin.ts
 * import serverClient ซึ่งเรียก next/headers — ถ้ารวมไฟล์เดียวกัน โค้ดฝั่ง
 * เซิร์ฟเวอร์จะถูกลากเข้า bundle ของเบราว์เซอร์แล้ว build พัง
 */
export function toDraft<T extends object, K extends keyof T>(
  row: T,
  omit: readonly K[],
): Omit<T, K> {
  const out = { ...row };
  for (const k of omit) delete out[k];
  return out;
}
