"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
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

type Msg = { type?: string; key?: string };

/**
 * หน้าจอแก้สินค้าแบบเห็นหน้าเว็บจริง — โครงเดียวกับ CopyEditor
 *
 * ซ้ายคือหน้าสินค้าตัวจริงที่เรนเดอร์ด้วยฉบับร่าง (Draft Mode) คลิกข้อความหรือรูป
 * ไหนก็เด้งไปช่องนั้นทางขวา และพิมพ์ปุ๊บหน้าซ้ายเปลี่ยนปั๊บผ่าน postMessage
 *
 * ── กุญแจที่คุยกัน ──
 * ทุกช่องกรอกติด data-cms-key เป็นชื่อคอลัมน์ + เส้นทาง (tagline · specs.1.value
 * · faq.0.a) ตรงกับที่หน้าพรีวิวห่อข้อความไว้ (ดู lib/cms/product-preview.ts)
 * จึงไม่ต้องมี map กลางระหว่างฟอร์มกับหน้าเว็บ — เพิ่มช่องใหม่แค่ติดกุญแจให้ตรง
 *
 * ── ข้อจำกัด ──
 * พรีวิวอัปเดตสดเฉพาะ "ข้อความ" การเพิ่ม/ลบ/ย้ายแถวต้องบันทึกร่างก่อน หน้าซ้าย
 * จะโหลดใหม่ให้เอง เพราะโครง HTML มาจากเซิร์ฟเวอร์ ไม่ได้เรนเดอร์ซ้ำฝั่งนี้
 *
 * สินค้าใหม่ที่ยังไม่มี slug ไม่มีหน้าให้พรีวิว จึงใช้ฟอร์มเต็มจอแบบเดิม
 */
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
  const frame = useRef<HTMLIFrameElement>(null);
  const panel = useRef<HTMLDivElement>(null);

  const [d, setD] = useState<ProductDraft>(() =>
    row
      ? toDraft(row, ["id", "has_draft", "published_at", "updated_at"])
      : blank(categories[0]?.slug ?? ""),
  );
  /* จำนวนแถวตอนโหลด — ต่างจากตอนนี้ = โครงเปลี่ยน พรีวิวต้องรอบันทึกร่าง */
  const [shape] = useState(() => shapeOf(d));
  const [hint, setHint] = useState<string | null>(null);

  const set = <K extends keyof ProductDraft>(k: K, v: ProductDraft[K]) =>
    setD((prev) => ({ ...prev, [k]: v }));

  const post = useCallback((data: unknown) => {
    frame.current?.contentWindow?.postMessage(data, "*");
  }, []);

  /** เด้งไปช่องกรอกที่กุญแจตรงกัน คืน false ถ้าไม่มีช่องนั้นในฟอร์ม */
  const focusField = useCallback((key: string) => {
    const root = panel.current;
    if (!root) return false;
    const el = root.querySelector<HTMLElement>(`[data-cms-key="${CSS.escape(key)}"]`);
    if (!el) return false;

    for (const a of root.querySelectorAll<HTMLElement>("[data-cms-active]")) delete a.dataset.cmsActive;
    el.dataset.cmsActive = "1";
    el.scrollIntoView({ behavior: "smooth", block: "center" });
    const input = el.matches("input, textarea") ? el : el.querySelector<HTMLElement>("input, textarea");
    input?.focus({ preventScroll: true });
    return true;
  }, []);

  /** รับสัญญาณจากหน้าพรีวิว: กดข้อความ/รูปไหน */
  useEffect(() => {
    if (isNew) return;
    const onMessage = (e: MessageEvent) => {
      const m = e.data as Msg;
      if (!m?.key) return;

      if (m.type === "cms:select") {
        setHint(focusField(m.key) ? null : "ข้อความนี้ไม่ได้อยู่ในฟอร์มสินค้า — แก้ได้ที่เมนู หน้าเว็บ → หน้าสินค้า");
      }
      if (m.type === "cms:select-image") {
        const ok = m.key.startsWith("gallery.") ? focusField(m.key) : false;
        setHint(
          ok
            ? null
            : "รูปนี้ไม่ใช่รูปในแกลเลอรีสินค้า — รูปแบนเนอร์/รูปประกอบแก้ได้ที่เมนู หน้าเว็บ → หน้าสินค้า",
        );
      }
    };
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [isNew, focusField]);

  /** ออกจากหน้านี้เมื่อไหร่ ให้ปิดโหมดพรีวิว ไม่งั้นเดินดูเว็บต่อจะเห็นฉบับร่างค้าง */
  useEffect(() => {
    if (isNew) return;
    return () => void fetch("/api/admin/preview?off=1").catch(() => {});
  }, [isNew]);

  /* พิมพ์ในช่องไหน → ส่งค่าใหม่ไปให้หน้าซ้ายทันที ใช้ตัวฟังตัวเดียวที่ราก
     จะได้ไม่ต้องไล่แก้ทุก editor ให้รู้จักพรีวิว */
  const onInput = (e: React.FormEvent<HTMLDivElement>) => {
    const t = e.target as HTMLInputElement | HTMLTextAreaElement;
    const key = t.dataset?.cmsKey;
    if (key) post({ type: "cms:update", key, value: t.value });
  };
  const onFocus = (e: React.FocusEvent<HTMLDivElement>) => {
    const t = e.target as HTMLElement;
    const key = t.dataset?.cmsKey ?? t.closest<HTMLElement>("[data-cms-key]")?.dataset.cmsKey;
    if (key) post({ type: "cms:focus", key });
  };

  /** เปลี่ยนรูปในแกลเลอรี — บอกพรีวิวให้สลับรูปที่ช่องนั้นด้วย */
  const setGallery = (next: string[]) => {
    next.forEach((url, i) => {
      if (url !== d.gallery[i]) post({ type: "cms:update-image", key: `gallery.${i}`, value: url });
    });
    set("gallery", next);
  };

  const reloadPreview = () => frame.current?.contentWindow?.location.reload();
  const shapeChanged = !isNew && shapeOf(d) !== shape;

  const fields = (
    <div className="space-y-6">
      <Fieldset title="ข้อมูลหลัก">
        <Field label="ชื่อสินค้า">
          <input value={d.name} onChange={(e) => set("name", e.target.value)} className="field" data-cms-key="name" />
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
          <textarea rows={3} value={d.tagline} onChange={(e) => set("tagline", e.target.value)} className="field" data-cms-key="tagline" />
        </Field>

        <Field label="สรุปบรรทัดเดียวบนการ์ด" hint="แสดงในหน้ารายการสินค้าและหน้าแรก (ไม่อยู่บนหน้าสินค้า)">
          <input value={d.card_summary} onChange={(e) => set("card_summary", e.target.value)} className="field" />
        </Field>

        <div className="flex flex-wrap gap-6">
          <Toggle label="แสดงในสินค้าแนะนำ" checked={d.featured} onChange={(v) => set("featured", v)} />
          <Toggle label="ติดป้าย ขายดี" checked={d.best_seller} onChange={(v) => set("best_seller", v)} />
        </div>
      </Fieldset>

      <Fieldset title="รูปภาพ">
        <div data-cms-key="image">
          <ImageField label="รูปหลัก (การ์ด / ตอนแชร์)" value={d.image} media={media} onChange={(v) => set("image", v)} />
        </div>
        <Field label="แกลเลอรี" hint="รูปที่เลื่อนดูได้บนหน้าสินค้า">
          <GalleryEditor value={d.gallery} media={media} onChange={setGallery} name="gallery" />
        </Field>
      </Fieldset>

      <Fieldset title="ป้ายและสเปกย่อ">
        <Field label="ป้ายกำกับ" hint="เช่น ISO 834 · ASTM E119 — แสดงเป็นชิปใต้ชื่อสินค้า">
          <TextListEditor value={d.badges} onChange={(v) => set("badges", v)} rows={1} addLabel="+ เพิ่มป้าย" placeholder="ISO 834" name="badges" />
        </Field>
        <Field label="สเปกย่อ" hint="ตารางสั้นๆ ด้านบนของหน้าสินค้า">
          <SpecEditor value={d.quick_specs} onChange={(v) => set("quick_specs", v)} name="quick_specs" />
        </Field>
      </Fieldset>

      <Fieldset title="รายละเอียด">
        <Field label="ย่อหน้าคำอธิบาย">
          <TextListEditor value={d.description} onChange={(v) => set("description", v)} rows={5} addLabel="+ เพิ่มย่อหน้า" name="description" />
        </Field>
        <Field label="รายการหัวข้อเพิ่มเติม" hint="บล็อกหัวข้อ + ข้อย่อย ที่แสดงต่อจากคำอธิบาย">
          <InfoListEditor value={d.lists} onChange={(v) => set("lists", v)} name="lists" />
        </Field>
      </Fieldset>

      <Fieldset title="ตารางสเปกเต็ม">
        <SpecEditor value={d.specs} onChange={(v) => set("specs", v)} name="specs" />
        <Field label="หมายเหตุใต้ตารางสเปก">
          <input value={d.spec_note ?? ""} onChange={(e) => set("spec_note", e.target.value || null)} className="field" data-cms-key="spec_note" />
        </Field>
        <Field label="ตารางเปรียบเทียบเพิ่มเติม" hint="ใช้กับสินค้าที่มีหลายรุ่นหรือหลายเกรด">
          <SpecTableEditor value={d.spec_table} onChange={(v) => set("spec_table", v)} name="spec_table" />
        </Field>
      </Fieldset>

      <Fieldset title="เอกสารดาวน์โหลด">
        <DownloadEditor value={d.downloads} onChange={(v) => set("downloads", v)} name="downloads" />
        <Field label="หมายเหตุใต้กล่องเอกสาร">
          <input value={d.download_note ?? ""} onChange={(e) => set("download_note", e.target.value || null)} className="field" data-cms-key="download_note" />
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
          <input value={d.legal_standards ?? ""} onChange={(e) => set("legal_standards", e.target.value || null)} className="field" data-cms-key="legal_standards" />
        </Field>
      </Fieldset>

      <Fieldset title="คำถามที่พบบ่อยของสินค้านี้">
        <FaqEditor value={d.faq} onChange={(v) => set("faq", v)} name="faq" />
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
  );

  const saveBar = (
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
        else if (res.ok) {
          router.refresh();
          // โครงหน้า (จำนวนแถว/ย่อหน้า) มาจากเซิร์ฟเวอร์ ต้องโหลดพรีวิวใหม่ถึงจะเห็น
          reloadPreview();
        }
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
  );

  /* ---------------------------------------------- สินค้าใหม่: ฟอร์มเต็มจอ */
  if (isNew) {
    return (
      <div className="max-w-4xl px-8 py-8">
        <h1 className="admin-title">เพิ่มสินค้าใหม่</h1>
        <div className="mt-6">{fields}</div>
        {saveBar}
      </div>
    );
  }

  /* ------------------------------------------- สินค้าเดิม: พรีวิว + ฟอร์ม */
  return (
    <div className="flex h-screen flex-col">
      <div className="flex items-center gap-4 border-b border-slate-200 bg-white px-6 py-3">
        <div className="min-w-0 flex-1">
          <Link href="/admin/products" className="text-[13px] text-slate-500 hover:text-slate-900">
            ← กลับไปรายการสินค้า
          </Link>
          <h1 className="admin-title mt-0.5 truncate">{d.name || d.slug}</h1>
        </div>
        <p
          role="status"
          className={`hidden max-w-[34rem] text-right text-[12.5px] leading-snug lg:block ${
            hint ? "text-amber-700" : "text-slate-500"
          }`}
        >
          {hint ??
            (shapeChanged
              ? "เพิ่ม/ลบ/ย้ายแถวแล้ว — พรีวิวจะเห็นโครงใหม่หลังกดบันทึกร่าง"
              : "คลิกข้อความหรือรูปในหน้าเว็บด้านซ้ายเพื่อแก้ พิมพ์แล้วหน้าซ้ายเปลี่ยนทันที")}
        </p>
        <a href={`/products/${row.slug}`} target="_blank" rel="noopener" className="btn-line-admin shrink-0">
          เปิดหน้าจริง
        </a>
      </div>

      <div className="flex min-h-0 flex-1">
        {/* หน้าสินค้าตัวจริง เรนเดอร์ด้วยฉบับร่าง */}
        <div className="min-w-0 flex-1 bg-slate-100 p-3">
          <iframe
            ref={frame}
            src={`/api/admin/preview?path=${encodeURIComponent(`/products/${row.slug}`)}`}
            title={`ตัวอย่างหน้า ${d.name}`}
            className="h-full w-full rounded-lg border border-slate-200 bg-white"
          />
        </div>

        {/* ฟอร์มด้านขวา — ตัวฟัง input/focus ที่รากคุมทุกช่องข้างใน */}
        <div
          ref={panel}
          onInput={onInput}
          onFocus={onFocus}
          className="flex w-[min(36rem,50%)] shrink-0 flex-col overflow-y-auto border-l border-slate-200 bg-slate-50"
        >
          <div className="px-8 pt-6">{fields}</div>
          <div className="mt-auto px-8">{saveBar}</div>
        </div>
      </div>
    </div>
  );
}

/** ลายเซ็นของ "โครง" ฟอร์ม — จำนวนสมาชิกของทุกรายการ ไว้เทียบว่าโครงเปลี่ยนไหม */
function shapeOf(d: ProductDraft) {
  return JSON.stringify([
    d.badges.length,
    d.quick_specs.length,
    d.description.length,
    d.lists.map((l) => l.items.length),
    d.specs.length,
    d.spec_table ? [d.spec_table.columns.length, d.spec_table.rows.length] : null,
    d.downloads.length,
    d.faq.length,
    d.gallery.length,
    Boolean(d.spec_note),
    Boolean(d.download_note),
    Boolean(d.legal_standards),
  ]);
}
