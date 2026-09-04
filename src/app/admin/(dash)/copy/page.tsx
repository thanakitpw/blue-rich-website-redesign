import Link from "next/link";
import { collectCopy } from "@/lib/cms/copy";
import { copyPageList } from "@/lib/cms/copy-pages";
import { copyCounts } from "./actions";

export const dynamic = "force-dynamic";

export default async function CopyIndexPage() {
  const counts = await copyCounts();

  const pages = await Promise.all(
    copyPageList.map(async (p) => ({
      ...p,
      total: collectCopy(await p.load()).length,
      ...(counts[p.key] ?? { edited: 0, dirty: 0 }),
    })),
  );

  const groups = [...new Set(pages.map((p) => p.group))];
  const total = pages.reduce((n, p) => n + p.total, 0);

  return (
    <div className="max-w-4xl px-8 py-8">
      <h1 className="admin-title">ข้อความในหน้าเว็บ</h1>
      <p className="mt-1 text-sm text-slate-500">
        ข้อความที่ฝังอยู่ในหน้าเว็บแต่ละหน้า แก้ที่นี่แล้วกดเผยแพร่ได้ทันที
        โดยไม่ต้องแก้โค้ด — รวมทั้งหมด {total} จุด
      </p>

      {groups.map((g) => (
        <section key={g} className="mt-6">
          <h2 className="mb-2 text-[13px] font-semibold text-slate-500">{g}</h2>
          <ul className="card-admin divide-y divide-slate-100">
            {pages
              .filter((p) => p.group === g)
              .map((p) => (
                <li key={p.key}>
                  <Link
                    href={`/admin/copy/${p.key}`}
                    className="flex items-center gap-3 px-5 py-4 transition hover:bg-slate-50"
                  >
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[14px] font-medium text-slate-900">
                        {p.label}
                      </span>
                      <span className="block truncate font-mono text-[11.5px] text-slate-400">
                        {p.path}
                        {p.note ? ` · ${p.note}` : ""}
                      </span>
                    </span>
                    {p.dirty > 0 && <span className="chip-draft">ร่าง {p.dirty} จุด</span>}
                    {p.edited > 0 && <span className="chip-live">แก้แล้ว {p.edited} จุด</span>}
                    <span className="shrink-0 text-[12px] text-slate-400">{p.total} จุด</span>
                  </Link>
                </li>
              ))}
          </ul>
        </section>
      ))}

      <p className="mt-8 text-[12px] leading-relaxed text-slate-500">
        ฐานข้อมูลเก็บเฉพาะจุดที่ต่างจากค่าตั้งต้นในโค้ด แก้กลับไปเหมือนเดิมเมื่อไหร่
        แถวนั้นจะถูกลบทิ้ง — เปิดหน้านี้จึงตอบได้เสมอว่าลูกค้าแก้อะไรไปบ้าง
      </p>
    </div>
  );
}
