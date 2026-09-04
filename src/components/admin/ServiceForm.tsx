"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { ServiceRow } from "@/lib/cms/admin";
import { toDraft } from "@/lib/cms/draft";
import type { MediaItem } from "@/lib/cms/media";
import { publishService, saveService, type ServiceDraft } from "@/app/admin/(dash)/services/actions";
import { BlockEditor, FaqEditor, TextListEditor } from "./Editors";
import { ImageField } from "./ImageField";
import { SaveBar } from "./SaveBar";
import { Field, Fieldset } from "./FormBits";

export function ServiceForm({
  row,
  media,
  allProducts,
}: {
  row: ServiceRow;
  media: MediaItem[];
  allProducts: { slug: string; name: string }[];
}) {
  const router = useRouter();
  const [d, setD] = useState<ServiceDraft>(() =>
    toDraft(row, ["id", "has_draft", "updated_at", "sort_order"]),
  );

  const set = <K extends keyof ServiceDraft>(k: K, v: ServiceDraft[K]) =>
    setD((prev) => ({ ...prev, [k]: v }));

  return (
    <div className="max-w-3xl px-8 py-8">
      <h1 className="admin-title">{d.label}</h1>
      <p className="mt-1 text-sm text-slate-500">
        หน้าเว็บจริง:{" "}
        <a href={`/fireproofing/${row.slug}`} target="_blank" rel="noopener" className="text-accent-500 underline">
          /fireproofing/{row.slug}
        </a>
      </p>

      <div className="mt-6 space-y-6">
        <Fieldset title="หัวหน้าเพจ">
          <Field label="ชื่อสั้น" hint="ใช้ในเมนูและการ์ดบนหน้ารวม">
            <input value={d.label} onChange={(e) => set("label", e.target.value)} className="field" />
          </Field>
          <Field label="บรรทัดนำภาษาอังกฤษ">
            <input value={d.eyebrow} onChange={(e) => set("eyebrow", e.target.value)} className="field" />
          </Field>
          <Field label="หัวข้อใหญ่">
            <textarea rows={2} value={d.title} onChange={(e) => set("title", e.target.value)} className="field" />
          </Field>
          <Field label="คำโปรย">
            <textarea rows={4} value={d.lede} onChange={(e) => set("lede", e.target.value)} className="field" />
          </Field>
          <ImageField label="รูปหัวเพจ" value={d.image} media={media} onChange={(v) => set("image", v)} />
        </Fieldset>

        <Fieldset title="จุดเด่น">
          <TextListEditor value={d.highlights} onChange={(v) => set("highlights", v)} rows={2} />
        </Fieldset>

        <Fieldset title="ขั้นตอนการทำงาน">
          <BlockEditor value={d.blocks} onChange={(v) => set("blocks", v)} />
        </Fieldset>

        <Fieldset title="วัสดุที่ใช้ในงานนี้">
          <div className="grid gap-1.5 sm:grid-cols-2">
            {allProducts.map((p) => (
              <label key={p.slug} className="flex items-start gap-2 text-[13.5px] text-slate-700">
                <input
                  type="checkbox"
                  className="mt-1"
                  checked={d.products.includes(p.slug)}
                  onChange={(e) =>
                    set(
                      "products",
                      e.target.checked
                        ? [...d.products, p.slug]
                        : d.products.filter((s) => s !== p.slug),
                    )
                  }
                />
                <span>{p.name}</span>
              </label>
            ))}
          </div>
        </Fieldset>

        <Fieldset title="คำถามที่พบบ่อย">
          <FaqEditor value={d.faq} onChange={(v) => set("faq", v)} />
        </Fieldset>
      </div>

      <SaveBar
        hasDraft={row.has_draft}
        backHref="/admin/services"
        onSave={async () => {
          const res = await saveService(row.slug, d);
          if (res.ok) router.refresh();
          return res;
        }}
        onPublish={async () => {
          const res = await publishService(row.slug);
          if (res.ok) router.refresh();
          return res;
        }}
      />
    </div>
  );
}
