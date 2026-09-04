import { createClient } from "@supabase/supabase-js";
import { cmsConfigured, supabaseAnonKey, supabaseUrl } from "./config";

/**
 * ไคลเอนต์สำหรับ "เว็บหน้าบ้าน" — ไม่ผูกกับคุกกี้ ไม่มีเซสชันใคร
 *
 * อ่านได้เฉพาะคอลัมน์ published / published_value เพราะ anon ถูก revoke คอลัมน์
 * ฉบับร่างทิ้งที่ชั้นฐานข้อมูล ต่อให้โค้ดฝั่งนี้เขียนพลาดก็ดึงร่างออกมาไม่ได้
 */

/**
 * ค่าที่คงที่ตลอดหนึ่ง deploy แต่เปลี่ยนเมื่อ deploy ใหม่
 *
 * ── ปัญหาที่แก้ ──
 * Next เก็บผลลัพธ์ fetch ที่เกิดตอน prerender ลง Data Cache และ Vercel เอา
 * แคชก้อนนั้นกลับมาใช้ข้าม deploy ผลคือ deploy ครั้งถัดไป prerender ด้วยเนื้อหา
 * เก่าที่ค้างอยู่ ทั้งที่ลูกค้ากดเผยแพร่ไปแล้ว — ยืนยันแล้วว่าเกิดขึ้นจริง
 * (build ซ้ำได้เนื้อหาเดิม จนกระทั่งลบ .next/cache ทิ้งถึงจะได้ของใหม่)
 *
 * ── ทำไมไม่ใช้ no-store ──
 * ลองแล้ว Next ถือว่าเป็น "ข้อมูลที่แคชไม่ได้" แล้วเปลี่ยนทุกหน้าเป็น dynamic
 * ซึ่งเสียข้อดีของเว็บ static ทั้งหมด และในโค้ดนี้ยังกลายเป็น error ที่ถูกกลืน
 * แล้วถอยไปใช้เนื้อหาตั้งต้นแบบเงียบๆ อีกด้วย
 *
 * ── วิธีที่ใช้ ──
 * แนบค่านี้เป็น header ทำให้กุญแจแคชของ deploy ใหม่ไม่ชนกับของเดิม แคชจึงเย็น
 * ตอนเริ่ม build แต่ยังใช้ซ้ำได้ระหว่าง build เดียวกัน (40 หน้าไม่ยิงซ้ำทุกหน้า)
 * ส่วนความสดหลังจาก deploy มาจาก revalidatePath ที่ปุ่มเผยแพร่สั่ง
 */
const buildStamp =
  process.env.VERCEL_DEPLOYMENT_ID ?? `local-${Math.floor(Date.now() / 1000)}`;

export const publicClient = () =>
  cmsConfigured
    ? createClient(supabaseUrl, supabaseAnonKey, {
        auth: { persistSession: false, autoRefreshToken: false },
        global: { headers: { "x-cms-build": buildStamp } },
      })
    : null;
