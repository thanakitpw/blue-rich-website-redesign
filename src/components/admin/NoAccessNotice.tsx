import { SignOutButton } from "./SignOutButton";

/**
 * ล็อกอิน Supabase ผ่านแล้ว แต่ยังไม่มีแถวใน cms_users
 *
 * ต้องเป็น "หน้า" ไม่ใช่ redirect กลับไปหน้าเข้าสู่ระบบ เพราะ proxy จะเห็นว่า
 * มีเซสชันอยู่แล้วเด้งกลับมาที่นี่อีก กลายเป็นวนไม่รู้จบ (ERR_TOO_MANY_REDIRECTS)
 */
export function NoAccessNotice({ email }: { email: string }) {
  return (
    <div className="grid min-h-screen place-items-center bg-slate-50 p-6">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8">
        <p className="eyebrow-en text-accent-500">ระบบจัดการเนื้อหา</p>
        <h1 className="admin-title mt-3">บัญชีนี้ยังไม่ได้รับสิทธิ์</h1>
        <p className="mt-2 text-sm leading-relaxed text-slate-500">
          เข้าสู่ระบบด้วย <span className="font-medium text-slate-900">{email}</span> สำเร็จแล้ว
          แต่บัญชีนี้ยังไม่ถูกเพิ่มเข้าทีมงาน จึงยังเข้าหลังบ้านไม่ได้
        </p>

        <div className="mt-6 rounded-lg bg-slate-50 p-4">
          <p className="text-[13px] font-medium text-slate-900">ผู้ดูแลระบบต้องรันคำสั่งนี้ใน Supabase</p>
          <pre className="mt-2 overflow-x-auto font-mono text-[11px] leading-relaxed text-slate-500">
{`insert into public.cms_users (id, email, display_name, role)
select id, email, 'ชื่อที่จะให้แสดง', 'editor'
  from auth.users where email = '${email}';`}
          </pre>
        </div>

        <div className="mt-6">
          <SignOutButton />
        </div>
      </div>
    </div>
  );
}
