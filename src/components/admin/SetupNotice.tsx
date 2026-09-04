/**
 * ขึ้นแทนหน้าหลังบ้านเมื่อยังไม่ได้ตั้งค่า Supabase
 * เว็บหน้าบ้านยังทำงานปกติทุกหน้าเพราะถอยไปใช้เนื้อหาตั้งต้นในไฟล์ src/data
 */
const steps = [
  {
    title: "ตั้งค่า environment variables",
    detail: "คัดลอกจาก Supabase Dashboard → Project Settings → API ใส่ใน .env.local และใน Vercel",
  },
  {
    title: "รัน migration",
    detail: "เปิด SQL Editor แล้วรันไฟล์ใน supabase/migrations/ ตามลำดับเลข",
  },
  {
    title: "ย้ายเนื้อหาเข้าฐานข้อมูล",
    detail: "npm run cms:seed แล้วตรวจด้วย npm run cms:verify",
  },
  {
    title: "สร้างผู้ใช้คนแรก",
    detail: "Authentication → Users → Add user แล้วเพิ่มแถวใน cms_users ด้วย id เดียวกัน",
  },
];

export function SetupNotice() {
  return (
    <div className="grid min-h-screen place-items-center bg-slate-50 p-6">
      <div className="w-full max-w-xl rounded-2xl border border-slate-200 bg-white p-8">
        <p className="eyebrow-en text-accent-500">ระบบจัดการเนื้อหา</p>
        <h1 className="admin-title mt-3">ยังไม่ได้เชื่อมต่อ Supabase</h1>
        <p className="mt-2 text-sm leading-relaxed text-slate-500">
          เว็บไซต์หน้าบ้านทำงานปกติทุกหน้า — ส่วนนี้เป็นระบบหลังบ้านที่ต้องต่อฐานข้อมูลก่อนถึงจะใช้ได้
        </p>

        <ol className="mt-6 space-y-4">
          {steps.map((s, i) => (
            <li key={s.title} className="flex gap-3">
              <span className="grid size-6 shrink-0 place-items-center rounded-md bg-brand-50 text-xs font-semibold text-brand-700">
                {i + 1}
              </span>
              <span className="min-w-0">
                <span className="block text-sm font-medium text-slate-900">{s.title}</span>
                <span className="block text-[13px] leading-relaxed text-slate-500">{s.detail}</span>
              </span>
            </li>
          ))}
        </ol>

        <p className="mt-6 border-t border-slate-200 pt-5 font-mono text-[11px] leading-relaxed text-slate-500">
          NEXT_PUBLIC_SUPABASE_URL
          <br />
          NEXT_PUBLIC_SUPABASE_ANON_KEY
        </p>
      </div>
    </div>
  );
}
