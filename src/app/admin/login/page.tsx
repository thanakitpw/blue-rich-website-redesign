import { Suspense } from "react";
import { cmsConfigured } from "@/lib/supabase/config";
import { SetupNotice } from "@/components/admin/SetupNotice";
import { LoginForm } from "./login-form";

export default function LoginPage() {
  if (!cmsConfigured) return <SetupNotice />;

  return (
    <div className="grid min-h-screen place-items-center p-6">
      <div className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-8">
        <p className="eyebrow-en text-accent-500">Blue Rich · ระบบจัดการเนื้อหา</p>
        <h1 className="admin-title mt-3 mb-6">เข้าสู่ระบบ</h1>

        {/* useSearchParams ต้องอยู่ใต้ Suspense ไม่งั้นทั้งหน้าถูกบังคับเป็น dynamic */}
        <Suspense fallback={<div className="h-64" />}>
          <LoginForm />
        </Suspense>

        <p className="mt-6 border-t border-slate-200 pt-5 text-[13px] leading-relaxed text-slate-500">
          ลืมรหัสผ่านหรือยังไม่มีบัญชี ติดต่อผู้ดูแลระบบ
        </p>
      </div>
    </div>
  );
}
