import Link from "next/link";
import { listServices, timeAgo } from "@/lib/cms/admin";

export const dynamic = "force-dynamic";

export default async function AdminServicesPage() {
  const services = await listServices();

  return (
    <div className="max-w-3xl px-8 py-8">
      <h1 className="admin-title">หน้าบริการรับรอง</h1>
      <p className="mt-1 text-sm text-slate-500">
        สองหน้าใต้เมนู “รับรองสีกันไฟ” — เพิ่มหน้าใหม่ต้องแก้เมนูด้วย
      </p>

      <ul className="card-admin mt-6 divide-y divide-slate-100">
        {services.map((s) => (
          <li key={s.slug}>
            <Link href={`/admin/services/${s.slug}`} className="flex items-center gap-3 px-5 py-4 transition hover:bg-slate-50">
              <span className="min-w-0 flex-1">
                <span className="block truncate text-[14px] font-medium text-slate-900">{s.label}</span>
                <span className="block truncate text-[12px] text-slate-400">/fireproofing/{s.slug}</span>
              </span>
              {s.has_draft && <span className="chip-draft">มีร่าง</span>}
              <span className="shrink-0 text-[12px] text-slate-400">{timeAgo(s.updated_at)}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
