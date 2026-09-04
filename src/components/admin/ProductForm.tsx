"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { CategoryRow, ProductRow } from "@/lib/cms/admin";
import { toDraft } from "@/lib/cms/draft";
import type { MediaItem } from "@/lib/cms/media";
import {
  createProduct,
  deleteProduct,
  publishProduct,
  saveProduct,
  type ProductDraft,
} from "@/app/admin/(dash)/products/actions";
import {
  DownloadEditor,
  FaqEditor,
  GalleryEditor,
  InfoListEditor,
  SpecEditor,
  SpecTableEditor,
  TextListEditor,
} from "./Editors";
import { ImageField } from "./ImageField";
import { SaveBar } from "./SaveBar";
import { Field, Fieldset, Toggle } from "./FormBits";

const blank = (categorySlug: string): ProductDraft => ({
  slug: "",
  name: "",
  category_slug: categorySlug,
  tagline: "",
  card_summary: "",
  badges: [],
  quick_specs: [],
  image: "",
  gallery: [],
  downloads: [],
  download_note: null,
  description: [""],
  lists: [],
  specs: [],
  spec_note: null,
  spec_table: null,
  installation: false,
  legal_standards: null,
  faq: [],
  related: [],
  featured: false,
  best_seller: false,
  sort_order: 999,
});

export function ProductForm({
  row,
  categories,
  media,
  allProducts,
}: {
  row: ProductRow | null;
  categories: CategoryRow[];
  media: MediaItem[];
  allProducts: { slug: string; name: string }[];
}) {
  const router = useRouter();
  const isNew = row === null;

  const [d, setD] = useState<ProductDraft>(() =>
    row
      ? toDraft(row, ["id", "has_draft", "published_at", "updated_at"])
      : blank(categories[0]?.slug ?? ""),
  );

  const set = <K extends keyof ProductDraft>(k: K, v: ProductDraft[K]) =>
    setD((prev) => ({ ...prev, [k]: v }));

  return (
    <div className="max-w-4xl px-8 py-8">
      <h1 className="admin-title">{isNew ? "เพิ่มสินค้าใหม่" : d.name || d.slug}</h1>
      {!isNew && (
        <p className="mt-1 text-sm text-slate-500">
          หน้าเว็บจริง:{" "}
          <a href={`/products/${row.slug}`} target="_blank" rel="noopener" className="text-accent-500 underline">
            /products/{row.slug}
          </a>
        </p>
      )}

      <div className="mt-6 space-y-6">
        <Fieldset title="ข้อมูลหลัก">
          <Field label="ชื่อสินค้า">
            <input value={d.name} onChange={(e) => set("name", e.target.value)} className="field" />
          </Field>

          <Field
            label="slug (ที่อยู่หน้าเว็บ)"
            hint={`หน้าเว็บจะอยู่ที่ /products/${d.slug || "…"} — เปลี่ยนแล้วลิงก์เดิมจะใช้ไม่ได้`}
          >
            <input
              value={d.slug}
              onChange={(e) => set("slug", e.target.value)}
              className="field font-mono text-[13px]"
              placeholder="neocoat-intumescent-paint-s"
            />
          </Field>

          <Field label="หมวดหมู่">
            <select value={d.category_slug} onChange={(e) => set("category_slug", e.target.value)} className="field">
              {categories.map((c) => (
                <option key={c.slug} value={c.slug}>{c.name}</option>
              ))}
            </select>
          </Field>

          <Field label="คำโปรยใต้ชื่อสินค้า" hint="ข้อความยาวที่แสดงบนหน้าสินค้า">
            <textarea rows={3} value={d.tagline} onChange={(e) => set("tagline", e.target.value)} className="field" />
          </Field>

          <Field label="สรุปบรรทัดเดียวบนการ์ด" hint="แสดงในหน้ารายการสินค้าและหน้าแรก">
            <input value={d.card_summary} onChange={(e) => set("card_summary", e.target.value)} className="field" />
          </Field>

          <div className="flex flex-wrap gap-6">
            <Toggle label="แสดงในสินค้าแนะนำ" checked={d.featured} onChange={(v) => set("featured", v)} />
            <Toggle label="ติดป้าย ขายดี" checked={d.best_seller} onChange={(v) => set("best_seller", v)} />
          </div>
        </Fieldset>

        <Fieldset title="รูปภาพ">
          <ImageField label="รูปหลัก" value={d.image} media={media} onChange={(v) => set("image", v)} />
          <Field label="แกลเลอรี" hint="รูปที่เลื่อนดูได้บนหน้าสินค้า">
            <GalleryEditor value={d.gallery} media={media} onChange={(v) => set("gallery", v)} />
          </Field>
        </Fieldset>

        <Fieldset title="ป้ายและสเปกย่อ">
          <Field label="ป้ายกำกับ" hint="เช่น ISO 834 · ASTM E119 — แสดงเป็นชิปใต้ชื่อสินค้า">
            <TextListEditor value={d.badges} onChange={(v) => set("badges", v)} rows={1} addLabel="+ เพิ่มป้าย" placeholder="ISO 834" />
          </Field>
          <Field label="สเปกย่อ" hint="ตารางสั้นๆ ด้านบนของหน้าสินค้า">
            <SpecEditor value={d.quick_specs} onChange={(v) => set("quick_specs", v)} />
          </Field>
        </Fieldset>

        <Fieldset title="รายละเอียด">
          <Field label="ย่อหน้าคำอธิบาย">
            <TextListEditor value={d.description} onChange={(v) => set("description", v)} rows={5} addLabel="+ เพิ่มย่อหน้า" />
          </Field>
          <Field label="รายการหัวข้อเพิ่มเติม" hint="บล็อกหัวข้อ + ข้อย่อย ที่แสดงต่อจากคำอธิบาย">
            <InfoListEditor value={d.lists} onChange={(v) => set("lists", v)} />
          </Field>
        </Fieldset>

        <Fieldset title="ตารางสเปกเต็ม">
          <SpecEditor value={d.specs} onChange={(v) => set("specs", v)} />
          <Field label="หมายเหตุใต้ตารางสเปก">
            <input value={d.spec_note ?? ""} onChange={(e) => set("spec_note", e.target.value || null)} className="field" />
          </Field>
          <Field label="ตารางเปรียบเทียบเพิ่มเติม" hint="ใช้กับสินค้าที่มีหลายรุ่นหรือหลายเกรด">
            <SpecTableEditor value={d.spec_table} onChange={(v) => set("spec_table", v)} />
          </Field>
        </Fieldset>

        <Fieldset title="เอกสารดาวน์โหลด">
          <DownloadEditor value={d.downloads} onChange={(v) => set("downloads", v)} />
          <Field label="หมายเหตุใต้กล่องเอกสาร">
            <input value={d.download_note ?? ""} onChange={(e) => set("download_note", e.target.value || null)} className="field" />
          </Field>
        </Fieldset>

        <Fieldset title="บล็อกที่ใช้ร่วมกัน">
          <Toggle
            label="แสดงขั้นตอนการทา 4 ขั้น"
            hint="เนื้อหาขั้นตอนแก้ได้ที่หน้า หน้าแรก → บล็อกที่ใช้ร่วมกัน"
            checked={d.installation}
            onChange={(v) => set("installation", v)}
          />
          <Field
            label="บล็อกข้อกฎหมาย"
            hint="ใส่ชื่อมาตรฐานที่อ้างถึง เช่น ASTM E-119, ISO 834 — เว้นว่างไว้ถ้าไม่ต้องการแสดงบล็อกนี้"
          >
            <input value={d.legal_standards ?? ""} onChange={(e) => set("legal_standards", e.target.value || null)} className="field" />
          </Field>
        </Fieldset>

        <Fieldset title="คำถามที่พบบ่อยของสินค้านี้">
          <FaqEditor value={d.faq} onChange={(v) => set("faq", v)} />
        </Fieldset>

        <Fieldset title="สินค้าที่เกี่ยวข้อง">
          <div className="grid gap-1.5 sm:grid-cols-2">
            {allProducts
              .filter((p) => p.slug !== d.slug)
              .map((p) => (
                <label key={p.slug} className="flex items-start gap-2 text-[13.5px] text-slate-700">
                  <input
                    type="checkbox"
                    className="mt-1"
                    checked={d.related.includes(p.slug)}
                    onChange={(e) =>
                      set(
                        "related",
                        e.target.checked
                          ? [...d.related, p.slug]
                          : d.related.filter((s) => s !== p.slug),
                      )
                    }
                  />
                  <span>{p.name}</span>
                </label>
              ))}
          </div>
        </Fieldset>
      </div>

      <SaveBar
        hasDraft={row?.has_draft}
        backHref="/admin/products"
        onSave={async () => {
          if (isNew) {
            const res = await createProduct(d);
            if (res.ok) router.push(`/admin/products/${d.slug}`);
            return res;
          }
          const res = await saveProduct(row.slug, d);
          if (res.ok && d.slug !== row.slug) router.replace(`/admin/products/${d.slug}`);
          else if (res.ok) router.refresh();
          return res;
        }}
        onPublish={isNew ? undefined : async () => {
          const res = await publishProduct(d.slug);
          if (res.ok) router.refresh();
          return res;
        }}
        onDelete={isNew ? undefined : () => deleteProduct(row.slug)}
        deleteLabel="ลบสินค้านี้"
      />
    </div>
  );
}
