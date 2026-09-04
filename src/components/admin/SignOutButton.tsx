"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { browserClient } from "@/lib/supabase/browser";

export function SignOutButton() {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  return (
    <button
      type="button"
      disabled={busy}
      onClick={async () => {
        setBusy(true);
        await browserClient()?.auth.signOut();
        router.replace("/admin/login");
        router.refresh();
      }}
      className="w-full rounded-lg border border-slate-200 px-3 py-2 text-left text-[13px] text-slate-500 transition hover:border-slate-300 hover:text-slate-900"
    >
      {busy ? "กำลังออก…" : "ออกจากระบบ"}
    </button>
  );
}
