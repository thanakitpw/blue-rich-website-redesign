"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { CategoryTile } from "@/data/home";
import type { Step } from "@/data/products";
import type { HomeShowcase, LegalInfo } from "@/lib/cms/content";
import type { MediaItem } from "@/lib/cms/media";
import type { ActionResult } from "@/lib/cms/actions";
import { publishSetting, saveSetting } from "@/app/admin/(dash)/settings/actions";
import { BlockEditor, move, RowTools, TextListEditor } from "./Editors";
import { ImageField } from "./ImageField";
import { SaveBar } from "./SaveBar";
import { Field, Fieldset, Toggle } from "./FormBits";

export function HomeForm({
  showcase,
  installationSteps,
  legalInfo,
  media,
  products,
  hasDraft,
}: {
  showcase: HomeShowcase;
  installationSteps: Step[];
  legalInfo: LegalInfo;
  media: MediaItem[];
  products: { slug: string; name: string }[];
  hasDraft: boolean;
}) {
  const router = useRouter();
  const [s, setS] = useState<HomeShowcase>(showcase);
  const [steps, setSteps] = useState<Step[]>(installationSteps);
  const [legal, setLegal] = useState<LegalInfo>(legalInfo);

  const setTile = (i: number, v: CategoryTile) =>
    setS({ ...s, categoryTiles: s.categoryTiles.map((x, j) => (i === j ? v : x)) });

  const saveAll = async (): Promise<ActionResult> => {
    for (const [key, value] of [
      ["home_showcase", s],
      ["installation_steps", steps],
      ["legal_info", legal],
    ] as const) {
      const res = await saveSetting(key, value);
      if (!res.ok) return res;
    }
    return { ok: true };
  };

  const publishAll = async (): Promise<ActionResult> => {
    for (const key of ["home_showcase", "installation_steps", "legal_info"]) {
      const res = await publishSetting(key);
      if (!res.ok) return res;
    }
    return { ok: true };
  };

  return (
    <div className="max-w-3xl px-8 py-8">
      <h1 className="admin-title">หน้าแรก</h1>
      <p className="mt-1 text-sm text-slate-500">
        แถบสินค้าขายดี การ์ดหมวด จุดเด่น และบล็อกที่หน้าสินค้าหลายตัวใช้ร่วมกัน
      </p>

      <div className="mt-6 space-y-6">
        <Fieldset title="แถบสินค้าขายดี">
          <Field label="สินค้าเรือธง" hint="การ์ดใบใหญ่ทางซ้าย">
            <select
              value={s.flagshipSlug}
              onChange={(e) => setS({ ...s, flagshipSlug: e.target.value })}
              className="field"
            >
              {products.map((p) => (
                <option key={p.slug} value={p.slug}>{p.name}</option>
              ))}
            </select>
          </Field>

          <Field label="สินค้าในการ์ดเล็ก" hint="ติ๊กและเรียงลำดับด้วยลำดับที่ติ๊ก — ควรมี 5 รายการ">
            <div className="space-y-2">
              {s.bestSellerSlugs.map((slug, i) => (
                <div key={i} className="flex items-start gap-2">
                  <select
                    value={slug}
                    onChange={(e) =>
                      setS({
                        ...s,
                        bestSellerSlugs: s.bestSellerSlugs.map((x, j) => (j === i ? e.target.value : x)),
                      })
                    }
                    className="field flex-1"
                  >
                    {products.map((p) => (
                      <option key={p.slug} value={p.slug}>{p.name}</option>
                    ))}
                  </select>
                  <RowTools
                    index={i}
                    total={s.bestSellerSlugs.length}
                    onMove={(a, b) => setS({ ...s, bestSellerSlugs: move(s.bestSellerSlugs, a, b) })}
                    onRemove={(idx) =>
                      setS({ ...s, bestSellerSlugs: s.bestSellerSlugs.filter((_, j) => j !== idx) })
                    }
                  />
                </div>
              ))}
              <button
                type="button"
                onClick={() =>
                  setS({ ...s, bestSellerSlugs: [...s.bestSellerSlugs, products[0]?.slug ?? ""] })
                }
                className="btn-line-admin"
              >
                + เพิ่มสินค้า
              </button>
            </div>
          </Field>
        </Fieldset>

        <Fieldset title="การ์ดเลือกสินค้าตามลักษณะงาน">
          <div className="space-y-3">
            {s.categoryTiles.map((t, i) => (
              <div key={i} className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                <div className="flex items-start gap-2">
                  <div className="min-w-0 flex-1 space-y-2.5">
                    <div className="grid gap-2 sm:grid-cols-2">
                      <input value={t.name} onChange={(e) => setTile(i, { ...t, name: e.target.value })} placeholder="ชื่อการ์ด" className="field font-medium" />
                      <input value={t.short} onChange={(e) => setTile(i, { ...t, short: e.target.value })} placeholder="บรรทัดอังกฤษ" className="field" />
                    </div>
                    <input value={t.href} onChange={(e) => setTile(i, { ...t, href: e.target.value })} placeholder="/intumescent" className="field font-mono text-[13px]" />
                    <textarea rows={2} value={t.description} onChange={(e) => setTile(i, { ...t, description: e.target.value })} placeholder="คำอธิบายสั้น" className="field" />
                    <ImageField value={t.image} media={media} onChange={(v) => setTile(i, { ...t, image: v })} />
                    <Toggle
                      label="เป็นรูปถ่ายเต็มการ์ด"
                      hint="ไม่ติ๊ก = ภาพสินค้าตัดพื้นวางบนพื้นอ่อน"
                      checked={Boolean(t.photo)}
                      onChange={(v) => setTile(i, { ...t, photo: v || undefined })}
                    />
                  </div>
                  <RowTools
                    index={i}
                    total={s.categoryTiles.length}
                    onMove={(a, b) => setS({ ...s, categoryTiles: move(s.categoryTiles, a, b) })}
                    onRemove={(idx) =>
                      setS({ ...s, categoryTiles: s.categoryTiles.filter((_, j) => j !== idx) })
                    }
                  />
                </div>
              </div>
            ))}
            <button
              type="button"
              onClick={() =>
                setS({
                  ...s,
                  categoryTiles: [
                    ...s.categoryTiles,
                    { href: "", short: "", name: "", description: "", image: "" },
                  ],
                })
              }
              className="btn-line-admin"
            >
              + เพิ่มการ์ด
            </button>
          </div>
        </Fieldset>

        <Fieldset title="จุดเด่นกลางหน้าแรก">
          <TextListEditor
            value={s.valuePoints}
            onChange={(v) => setS({ ...s, valuePoints: v })}
            rows={2}
          />
        </Fieldset>

        <Fieldset title="ขั้นตอนการทา (ใช้ร่วมกันในหน้าสินค้า)">
          <p className="text-[12px] text-slate-500">
            แสดงในหน้าสินค้าที่เปิดสวิตช์ “แสดงขั้นตอนการทา 4 ขั้น” ไว้
          </p>
          <BlockEditor value={steps} onChange={setSteps} />
        </Fieldset>

        <Fieldset title="บล็อกข้อกฎหมาย (ใช้ร่วมกันในหน้าสินค้า)">
          <Field label="หัวข้อ">
            <input value={legal.title} onChange={(e) => setLegal({ ...legal, title: e.target.value })} className="field" />
          </Field>
          <Field label="คำนำ">
            <textarea rows={3} value={legal.intro} onChange={(e) => setLegal({ ...legal, intro: e.target.value })} className="field" />
          </Field>
          <Field label="หัวข้อของรายการ">
            <input value={legal.listTitle} onChange={(e) => setLegal({ ...legal, listTitle: e.target.value })} className="field" />
          </Field>
          <Field label="รายการ">
            <TextListEditor value={legal.items} onChange={(v) => setLegal({ ...legal, items: v })} rows={2} />
          </Field>
        </Fieldset>
      </div>

      <SaveBar
        hasDraft={hasDraft}
        onSave={async () => {
          const res = await saveAll();
          if (res.ok) router.refresh();
          return res;
        }}
        onPublish={async () => {
          const res = await publishAll();
          if (res.ok) router.refresh();
          return res;
        }}
      />
    </div>
  );
}
