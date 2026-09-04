"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { ArticleRow } from "@/lib/cms/admin";
import { toDraft } from "@/lib/cms/draft";
import type { MediaItem } from "@/lib/cms/media";
import {
  createArticle,
  deleteArticle,
  publishArticle,
  saveArticle,
  type ArticleDraft,
} from "@/app/admin/(dash)/articles/actions";
import { TextListEditor } from "./Editors";
import { ImageField } from "./ImageField";
import { SaveBar } from "./SaveBar";
import { Field, Fieldset } from "./FormBits";

/** วันที่ไทยจากวันที่จริง เพื่อไม่ให้ต้องพิมพ์เองแล้วพิมพ์ผิด */
const thaiDate = (iso: string) => {
  if (!iso) return "";
  const d = new Date(`${iso}T00:00:00`);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString("th-TH", { day: "numeric", month: "long", year: "numeric" });
};

const blank = (): ArticleDraft => ({
  slug: "",
  title: "",
  excerpt: "",
  image: "",
  date_iso: new Date().toISOString().slice(0, 10),
  date_label: thaiDate(new Date().toISOString().slice(0, 10)),
  tag: "ความรู้",
  body: [""],
});

export function ArticleForm({ row, media }: { row: ArticleRow | null; media: MediaItem[] }) {
  const router = useRouter();
  const isNew = row === null;

  const [d, setD] = useState<ArticleDraft>(() =>
    row ? toDraft(row, ["id", "has_draft", "published_at", "updated_at"]) : blank(),
  );

  const set = <K extends keyof ArticleDraft>(k: K, v: ArticleDraft[K]) =>
    setD((prev) => ({ ...prev, [k]: v }));

  return (
    <div className="max-w-3xl px-8 py-8">
      <h1 className="admin-title">{isNew ? "เขียนบทความใหม่" : d.title || d.slug}</h1>
      {!isNew && (
        <p className="mt-1 text-sm text-slate-500">
          หน้าเว็บจริง:{" "}
          <a href={`/news/${row.slug}`} target="_blank" rel="noopener" className="text-accent-500 underline">
            /news/{row.slug}
          </a>
        </p>
      )}

      <div className="mt-6 space-y-6">
        <Fieldset title="ข้อมูลบทความ">
          <Field label="ชื่อเรื่อง">
            <input value={d.title} onChange={(e) => set("title", e.target.value)} className="field" />
          </Field>

          <Field label="slug (ที่อยู่หน้าเว็บ)" hint={`หน้าเว็บจะอยู่ที่ /news/${d.slug || "…"}`}>
            <input value={d.slug} onChange={(e) => set("slug", e.target.value)} className="field font-mono text-[13px]" />
          </Field>

          <Field label="คำโปรย" hint="แสดงบนการ์ดในหน้ารายการบทความและหน้าแรก">
            <textarea rows={3} value={d.excerpt} onChange={(e) => set("excerpt", e.target.value)} className="field" />
          </Field>

          <div className="grid gap-5 sm:grid-cols-3">
            <Field label="วันที่">
              <input
                type="date"
                value={d.date_iso ?? ""}
                onChange={(e) => {
                  set("date_iso", e.target.value || null);
                  set("date_label", thaiDate(e.target.value));
                }}
                className="field"
              />
            </Field>
            <Field label="วันที่แบบไทย" hint="เติมให้อัตโนมัติ แก้เองได้">
              <input value={d.date_label} onChange={(e) => set("date_label", e.target.value)} className="field" />
            </Field>
            <Field label="ป้ายหมวด" hint="เช่น ความรู้ · กฎหมาย · ผลงาน">
              <input value={d.tag} onChange={(e) => set("tag", e.target.value)} className="field" />
            </Field>
          </div>

          <ImageField label="รูปหน้าปก" value={d.image} media={media} onChange={(v) => set("image", v)} />
        </Fieldset>

        <Fieldset title="เนื้อหา">
          <TextListEditor value={d.body} onChange={(v) => set("body", v)} rows={7} addLabel="+ เพิ่มย่อหน้า" />
        </Fieldset>
      </div>

      <SaveBar
        hasDraft={row?.has_draft}
        backHref="/admin/articles"
        onSave={async () => {
          if (isNew) {
            const res = await createArticle(d);
            if (res.ok) router.push(`/admin/articles/${d.slug}`);
            return res;
          }
          const res = await saveArticle(row.slug, d);
          if (res.ok && d.slug !== row.slug) router.replace(`/admin/articles/${d.slug}`);
          else if (res.ok) router.refresh();
          return res;
        }}
        onPublish={isNew ? undefined : async () => {
          const res = await publishArticle(d.slug);
          if (res.ok) router.refresh();
          return res;
        }}
        onDelete={isNew ? undefined : () => deleteArticle(row.slug)}
        deleteLabel="ลบบทความนี้"
      />
    </div>
  );
}
