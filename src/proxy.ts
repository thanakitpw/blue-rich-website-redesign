import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

/**
 * ประตูกั้นหลังบ้าน
 *
 * Next 16 เปลี่ยนชื่อ middleware เป็น proxy แล้ว (middleware.ts ถูก deprecated)
 * และ proxy รันบน Node.js runtime เป็นค่าเริ่มต้น จะตั้ง runtime เองไม่ได้
 *
 * ที่นี่ทำแค่ "ยังไม่ล็อกอิน = เด้งไปหน้าเข้าสู่ระบบ" และต่ออายุคุกกี้เซสชันให้
 * ส่วนการเช็คว่าเป็นทีมงานจริงไหม (มีแถวใน cms_users) อยู่ที่ (dash)/layout.tsx
 * และทุก server action — กันไว้สองชั้นเพราะ proxy อาจถูก deploy แยกไปอยู่หน้า CDN
 */
export async function proxy(request: NextRequest) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // ยังไม่ตั้งค่า Supabase — ปล่อยผ่านให้หน้าหลังบ้านขึ้นคำแนะนำวิธีตั้งค่าแทนจอขาว
  if (!url || !key) return NextResponse.next();

  const path = request.nextUrl.pathname;
  const onLoginPage = path.startsWith("/admin/login");

  /* ไม่มีคุกกี้ของ Supabase เลย = ยังไม่ได้ล็อกอินแน่นอน ไม่ต้องเสียเวลายิงถาม
     เป็นเคสที่เจอบ่อยที่สุด (คนเปิดหน้าเข้าสู่ระบบ) และถ้ายิงถามจะต้องรอ network
     หนึ่งรอบทั้งที่รู้คำตอบอยู่แล้ว */
  const hasSessionCookie = request.cookies.getAll().some((c) => c.name.startsWith("sb-"));

  if (!hasSessionCookie) {
    if (onLoginPage) return NextResponse.next();
    if (path.startsWith("/api/")) {
      return NextResponse.json({ error: "ต้องเข้าสู่ระบบก่อน" }, { status: 401 });
    }
    const to = new URL("/admin/login", request.url);
    to.searchParams.set("next", path);
    return NextResponse.redirect(to);
  }

  let response = NextResponse.next({ request });

  const supabase = createServerClient(url, key, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll: (list) => {
        for (const { name, value } of list) request.cookies.set(name, value);
        response = NextResponse.next({ request });
        for (const { name, value, options } of list) response.cookies.set(name, value, options);
      },
    },
  });

  // getUser() คุยกับ Supabase จริงเพื่อตรวจ token — อ่านคุกกี้เฉยๆ ปลอมได้
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user && !onLoginPage) {
    if (path.startsWith("/api/")) {
      return NextResponse.json({ error: "ต้องเข้าสู่ระบบก่อน" }, { status: 401 });
    }
    const to = new URL("/admin/login", request.url);
    to.searchParams.set("next", path);
    return NextResponse.redirect(to);
  }

  // ล็อกอินแล้วแต่ยังวนอยู่หน้าเข้าสู่ระบบ — ส่งเข้าหลังบ้านเลย
  if (user && onLoginPage) {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  return response;
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
