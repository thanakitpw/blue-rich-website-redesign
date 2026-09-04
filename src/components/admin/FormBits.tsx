"use client";

/** ชิ้นส่วนเล็กๆ ที่ทุกฟอร์มในหลังบ้านใช้ร่วมกัน */

export function Fieldset({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="card-admin p-5">
      <h2 className="mb-4 border-b border-slate-100 pb-3 text-[15px] font-semibold text-slate-900">
        {title}
      </h2>
      <div className="space-y-5">{children}</div>
    </section>
  );
}

export function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="field-label">{label}</label>
      {children}
      {hint && <p className="mt-1.5 text-[12px] leading-relaxed text-slate-500">{hint}</p>}
    </div>
  );
}

export function Toggle({
  label,
  hint,
  checked,
  onChange,
}: {
  label: string;
  hint?: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div>
      <label className="flex items-center gap-2 text-[13.5px] font-medium text-slate-700">
        <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} />
        {label}
      </label>
      {hint && <p className="mt-1 ml-6 text-[12px] text-slate-500">{hint}</p>}
    </div>
  );
}
