import { notFound } from "next/navigation";
import { collectCopy, hashText } from "@/lib/cms/copy";
import { COPY_PAGES, type CopyPage } from "@/lib/cms/copy-pages";
import { serverClient } from "@/lib/supabase/server";
import { CopyEditor } from "@/components/admin/CopyEditor";

export const dynamic = "force-dynamic";

export default async function EditCopyPage({ params }: { params: Promise<{ page: string }> }) {
  const { page } = await params;
  if (!(page in COPY_PAGES)) notFound();
  const key = page as CopyPage;
  const meta = COPY_PAGES[key];

  const defaults = collectCopy(await meta.load());

  const sb = await serverClient();
  const { data } = (await sb
    ?.from("site_copy")
    .select("key, draft_value, published_value, source_hash")
    .eq("page", key)) ?? { data: [] };

  const saved = new Map(
    (data ?? []).map((r) => [
      r.key as string,
      {
        draft: (r.draft_value ?? r.published_value) as string | null,
        published: r.published_value as string | null,
        hash: (r.source_hash as string) ?? null,
      },
    ]),
  );

  return (
    <CopyEditor
      page={key}
      label={meta.label}
      path={meta.path}
      entries={defaults.map((d) => {
        const hit = saved.get(d.path);
        return {
          key: d.path,
          fallback: d.value,
          value: hit?.draft ?? d.value,
          edited: Boolean(hit),
          dirty: Boolean(hit && hit.draft !== hit.published),
          /* hash ไม่ตรง = นักพัฒนาแก้ข้อความในโค้ดหลังจากลูกค้าแก้ไปแล้ว
             เว็บจริงจะแสดงค่าจากโค้ด ไม่ใช่ค่าที่ลูกค้าเคยแก้ */
          stale: Boolean(hit?.hash && hit.hash !== hashText(d.value)),
        };
      })}
    />
  );
}

