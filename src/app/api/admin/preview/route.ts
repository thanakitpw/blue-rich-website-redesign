import { draftMode } from "next/headers";
import { NextResponse, type NextRequest } from "next/server";
import { currentCmsUser } from "@/lib/supabase/server";

/**
 * เปิด/ปิดโหมดพรีวิว
 *
 *   /api/admin/preview?path=/neocoat   → เปิด แล้วพาไปหน้านั้น
 *   /api/admin/preview?off=1           → ปิด
 *
 * proxy.ts กัน /api/admin/* ไว้ให้แล้วชั้นหนึ่ง ที่นี่เช็ค cms_users ซ้ำอีกชั้น
 * เพราะ route handler ถูกยิงตรงได้โดยไม่ผ่านหน้าจอไหนเลย
 *
 * คุกกี้ Draft Mode ทำให้ทุกหน้าเรนเดอร์ใหม่ด้วย "ฉบับร่าง" และห่อข้อความด้วย
 * เครื่องหมายที่มองไม่เห็น ตัวคุกกี้เองไม่ได้ให้สิทธิ์อ่านอะไรเพิ่ม — ฉบับร่างยัง
 * ถูก RLS กันไว้ ใครไม่ได้ล็อกอินก็ยังได้ค่าที่เผยแพร่แล้วเหมือนเดิม
 */
export async function GET(req: NextRequest) {
  const draft = await draftMode();

  if (req.nextUrl.searchParams.get("off")) {
    draft.disable();
    return NextResponse.json({ ok: true, preview: false });
  }

  const user = await currentCmsUser();
  if (!user) return NextResponse.json({ ok: false, error: "ไม่มีสิทธิ์" }, { status: 403 });

  /* รับเฉพาะ path ภายในเว็บนี้ กัน open redirect ไปโดเมนอื่น */
  const path = req.nextUrl.searchParams.get("path") ?? "/";
  const safe = path.startsWith("/") && !path.startsWith("//") ? path : "/";

  draft.enable();
  return NextResponse.redirect(new URL(safe, req.nextUrl.origin));
}
