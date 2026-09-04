import { cmsConfigured } from "@/lib/supabase/config";
import { currentCmsUser, serverClient } from "@/lib/supabase/server";
import { SetupNotice } from "@/components/admin/SetupNotice";
import { NoAccessNotice } from "@/components/admin/NoAccessNotice";
import { Shell } from "@/components/admin/Shell";

/**
 * ด่านที่สองของหลังบ้าน — proxy.ts กันคนที่ยังไม่ล็อกอินไปแล้ว
 * ชั้นนี้กันคนที่ล็อกอิน Supabase ได้แต่ไม่ได้อยู่ในตาราง cms_users
 */
export default async function DashLayout({ children }: { children: React.ReactNode }) {
  if (!cmsConfigured) return <SetupNotice />;

  const user = await currentCmsUser();

  if (!user) {
    /* ถึงตรงนี้แปลว่า proxy ปล่อยผ่านมาแล้ว = มีเซสชันจริง แต่ไม่มีแถวใน cms_users
       ห้าม redirect กลับหน้าเข้าสู่ระบบ เพราะ proxy จะเด้งกลับมาที่นี่อีกไม่รู้จบ */
    const sb = await serverClient();
    const { data } = (await sb?.auth.getUser()) ?? { data: { user: null } };
    return <NoAccessNotice email={data.user?.email ?? "บัญชีนี้"} />;
  }

  return <Shell user={user}>{children}</Shell>;
}
