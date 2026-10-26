import { revalidatePath } from "next/cache";
import { NextResponse, type NextRequest } from "next/server";

/**
 * Vercel Cron เรียกทุกวัน 00:05 น. เวลาไทย (vercel.json → "5 17 * * *" UTC)
 *
 * บทความตั้งเวลาอยู่ในฐานข้อมูลครบแล้ว getArticles แค่ซ่อนบทที่วันยังไม่ถึง แต่ทุกหน้า
 * เป็น static — ไม่มีใครสั่งเรนเดอร์ใหม่ บทของวันนี้ก็ไม่โผล่ ตัวนี้จึง revalidate
 * ทั้งเว็บวันละครั้ง หน้า /news, หน้าแรก, sitemap และ /news/<slug> (รวม 404 ที่แคชไว้)
 * ได้ข้อมูลของวันใหม่ และลิงก์ระหว่างบทความที่เพิ่งขึ้นก็กลับมาเป็นลิงก์
 *
 * Vercel แนบ "Authorization: Bearer $CRON_SECRET" ให้เองเมื่อโปรเจกต์มี env นี้
 * ไม่มี secret = ไม่รับ เพราะ revalidate ทั้งเว็บถี่ ๆ ทำให้แคชว่างและเปลืองฟังก์ชัน
 */
export async function GET(req: NextRequest) {
  const secret = process.env.CRON_SECRET;
  if (!secret || req.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }
  revalidatePath("/", "layout");
  return NextResponse.json({ ok: true, revalidatedAt: new Date().toISOString() });
}
