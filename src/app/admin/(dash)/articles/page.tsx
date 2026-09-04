import Image from "next/image";
import Link from "next/link";
import { listArticles, timeAgo } from "@/lib/cms/admin";
import { ActionButton } from "@/components/admin/SaveBar";
import { publishAllArticles } from "./actions";

export const dynamic = "force-dynamic";

export default async function ArticlesPage() {
  const articles = await listArticles();
  const dirty = articles.filter((a) => a.has_draft).length;

  return (
    <div className="max-w-4xl px-8 py-8">
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex-1">
          <h1 className="admin-title">บทความ</h1>
          <p className="mt-1 text-sm text-slate-500">
            {articles.length} บทความ{dirty > 0 && ` · ${dirty} บทความมีร่างที่ยังไม่เผยแพร่`}
          </p>
        </div>
        {dirty > 0 && (
          <ActionButton action={publishAllArticles} label={`เผยแพร่ทั้งหมด (${dirty})`} okText="เผยแพร่แล้ว" />
        )}
        <Link href="/admin/articles/new" className="btn-solid">+ เขียนบทความ</Link>
      </div>

      <ul className="card-admin mt-6 divide-y divide-slate-100">
        {articles.map((a) => (
          <li key={a.slug}>
            <Link href={`/admin/articles/${a.slug}`} className="flex items-center gap-3 px-5 py-3 transition hover:bg-slate-50">
              <span className="relative h-11 w-16 shrink-0 overflow-hidden rounded-md border border-slate-200 bg-slate-50">
                {a.image && <Image src={a.image} alt="" fill sizes="64px" className="object-cover" />}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-[14px] text-slate-900">{a.title}</span>
                <span className="block truncate text-[12px] text-slate-400">
                  {a.tag} · {a.date_label}
                </span>
              </span>
              {a.has_draft && <span className="chip-draft">มีร่าง</span>}
              <span className="shrink-0 text-[12px] text-slate-400">{timeAgo(a.updated_at)}</span>
            </Link>
          </li>
        ))}
        {articles.length === 0 && <li className="px-5 py-8 text-center text-sm text-slate-500">ยังไม่มีบทความ</li>}
      </ul>
    </div>
  );
}
