import type { CmsUser } from "@/lib/supabase/server";
import { Nav } from "./Nav";
import { SignOutButton } from "./SignOutButton";

export function Shell({ user, children }: { user: CmsUser; children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <aside className="sticky top-0 flex h-screen w-60 shrink-0 flex-col border-r border-slate-200 bg-white">
        <div className="border-b border-slate-200 px-5 py-5">
          <p className="eyebrow-en text-accent-500">Blue Rich</p>
          <p className="mt-1 text-sm font-semibold text-slate-900">ระบบจัดการเนื้อหา</p>
        </div>

        <Nav />

        <div className="space-y-2.5 border-t border-slate-200 p-3">
          <a
            href="/"
            target="_blank"
            rel="noopener"
            className="block rounded-lg px-3 py-2 text-[13px] text-slate-500 transition hover:text-slate-900"
          >
            ↗ ดูเว็บไซต์จริง
          </a>

          <div className="rounded-lg bg-slate-50 px-3 py-2.5">
            <p className="truncate text-[13px] font-medium text-slate-900">
              {user.display_name || user.email}
            </p>
            <p className="text-[11px] text-slate-500">
              {user.role === "admin" ? "ผู้ดูแลระบบ" : "ผู้แก้ไขเนื้อหา"}
            </p>
          </div>

          <SignOutButton />
        </div>
      </aside>

      <main className="min-w-0 flex-1 bg-slate-50">{children}</main>
    </div>
  );
}
