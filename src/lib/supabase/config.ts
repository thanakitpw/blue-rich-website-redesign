/**
 * ค่าเชื่อมต่อ Supabase
 *
 * ทั้งเว็บหน้าบ้านและหลังบ้านใช้ publishable key ตัวเดียวกัน ไม่มี service role key
 * ที่ไหนเลย — สิทธิ์ทั้งหมดคุมด้วย RLS + column-level grant ในฐานข้อมูล
 * (ดู supabase/migrations/0003_cms_security.sql)
 */
export const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
export const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

/**
 * ยังไม่ได้ตั้งค่า = เว็บหน้าบ้านถอยไปใช้เนื้อหาตั้งต้นในไฟล์ src/data/*.ts
 * ทำให้ deploy ที่ยังไม่ได้ใส่ env ไม่จอขาว และหลังบ้านจะขึ้นหน้าบอกวิธีตั้งค่าแทน
 */
export const cmsConfigured = Boolean(supabaseUrl && supabaseAnonKey);
