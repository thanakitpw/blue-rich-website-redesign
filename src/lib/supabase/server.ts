import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { cmsConfigured, supabaseAnonKey, supabaseUrl } from "./config";

/**
 * ไคลเอนต์ฝั่งเซิร์ฟเวอร์ที่ผูกกับคุกกี้ของผู้ใช้ — ใช้เฉพาะในหลังบ้าน
 * สิทธิ์ที่ได้คือสิทธิ์ของคนที่ล็อกอินอยู่ ผ่าน RLS ตามปกติ
 */
export async function serverClient() {
  if (!cmsConfigured) return null;
  const store = await cookies();

  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll: () => store.getAll(),
      setAll: (list) => {
        try {
          for (const { name, value, options } of list) store.set(name, value, options);
        } catch {
          /* เรียกจาก Server Component ซึ่งเขียนคุกกี้ไม่ได้ — proxy.ts ต่ออายุเซสชันให้แล้ว */
        }
      },
    },
  });
}

export type CmsUser = {
  id: string;
  email: string;
  display_name: string | null;
  role: "editor" | "admin";
};

/**
 * ผู้ใช้ที่ล็อกอินอยู่ และมีสิทธิ์เข้าหลังบ้านจริง
 *
 * ล็อกอิน Supabase ผ่านอย่างเดียวยังไม่พอ ต้องมีแถวใน cms_users ด้วย
 * คืน null เมื่อไม่เข้าเงื่อนไข ให้ผู้เรียกตัดสินใจว่าจะ redirect หรือตอบ 401
 */
export async function currentCmsUser(): Promise<CmsUser | null> {
  const sb = await serverClient();
  if (!sb) return null;

  /* ต้องเรียก getUser() ก่อนเสมอ ไม่ใช่แค่เพื่อตรวจตัวตน แต่เพราะมันเป็นตัวที่ทำให้
     ไคลเอนต์โหลดเซสชันจากคุกกี้เข้ามาจริงๆ ถ้าข้ามขั้นนี้ คำสั่งค้นด้านล่างจะถูกส่ง
     ไปแบบไม่มี token แล้ว PostgREST มองเป็น anon ผลคือ RLS ตัดทิ้งทุกแถว
     = ล็อกอินได้แต่เข้าหลังบ้านไม่ได้ */
  const { data: auth } = await sb.auth.getUser();
  if (!auth.user) return null;

  /* ไม่ต้องกรองด้วย id เพราะ policy cms_users_self เปิดให้เห็นเฉพาะแถวของตัวเองอยู่แล้ว
     การพึ่ง RLS อย่างเดียวทำให้ไม่มีทางพลาดเพราะหยิบ id ผิดตัว */
  const { data, error } = await sb
    .from("cms_users")
    .select("id, email, display_name, role")
    .maybeSingle();

  if (error) {
    console.error("[cms] อ่านสิทธิ์ผู้ใช้ไม่สำเร็จ:", error.code, error.message);
    return null;
  }

  return (data as CmsUser | null) ?? null;
}
