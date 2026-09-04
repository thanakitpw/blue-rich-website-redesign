/** ทุกหน้าในหลังบ้านยิงคิวรีไป Supabase ก่อนเรนเดอร์ จึงเห็นช่วงรอชัดกว่าเว็บหน้าบ้าน */
export default function Loading() {
  return (
    <div className="grid min-h-[50vh] place-items-center">
      <p className="text-sm text-slate-500">กำลังโหลด…</p>
    </div>
  );
}
