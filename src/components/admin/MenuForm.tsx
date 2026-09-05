"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { NavItem, Standard, Stat } from "@/data/site";
import type { MediaItem } from "@/lib/cms/media";
import { publishSetting, saveSetting } from "@/app/admin/(dash)/settings/actions";
import { move, RowTools, TextListEditor } from "./Editors";
import { ImageField } from "./ImageField";
import { SaveBar } from "./SaveBar";
import { Field, Fieldset } from "./FormBits";
import type { ActionResult } from "@/lib/cms/actions";

/**
 * เมนู มาตรฐาน และตัวเลขสถิติ อยู่คนละคีย์ในฐานข้อมูล แต่รวมไว้หน้าเดียว
 * เพราะทั้งสามอย่างเป็น "โครงของเว็บ" ที่ลูกค้าแทบไม่แตะ และแตะทีก็มักแตะพร้อมกัน
 * ปุ่มบันทึกจึงบันทึกทั้งสามคีย์ในครั้งเดียว
 */
export function MenuForm({
  nav: navValue,
  standards: standardsValue,
  stats: statsValue,
  media,
  hasDraft,
}: {
  nav: NavItem[];
  standards: Standard[];
  stats: Stat[];
  media: MediaItem[];
  hasDraft: boolean;
}) {
  const router = useRouter();
  const [nav, setNav] = useState<NavItem[]>(navValue);
  const [standards, setStandards] = useState<Standard[]>(standardsValue);
  const [stats, setStats] = useState<Stat[]>(statsValue);

  const setItem = (i: number, v: NavItem) => setNav(nav.map((x, j) => (i === j ? v : x)));

  const saveAll = async (): Promise<ActionResult> => {
    for (const [key, value] of [["nav", nav], ["standards", standards], ["stats", stats]] as const) {
      const res = await saveSetting(key, value);
      if (!res.ok) return res;
    }
    return { ok: true };
  };

  const publishAll = async (): Promise<ActionResult> => {
    for (const key of ["nav", "standards", "stats"]) {
      const res = await publishSetting(key);
      if (!res.ok) return res;
    }
    return { ok: true };
  };

  return (
    <div className="max-w-3xl px-8 py-8">
      <h1 className="admin-title">เมนูและมาตรฐาน</h1>
      <p className="mt-1 text-sm text-slate-500">
        เมนูหลัก มาตรฐานที่อ้างอิง และตัวเลขที่โชว์ทั่วเว็บ
      </p>

      <div className="mt-6 space-y-6">
        <Fieldset title="เมนูหลัก">
          <p className="text-[12px] leading-relaxed text-slate-500">
            ลิงก์ต้องขึ้นต้นด้วย / เช่น <code className="font-mono">/products/neogloss-enamel</code> ·
            ใส่ # ต่อท้ายเพื่อชี้ไปหัวข้อในหน้า เช่น <code className="font-mono">/paint#emulsion</code>
          </p>

          <div className="space-y-3">
            {nav.map((item, i) => (
              <div key={i} className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                <div className="mb-2 flex items-start gap-2">
                  <input value={item.label} onChange={(e) => setItem(i, { ...item, label: e.target.value })} placeholder="ชื่อเมนู" className="field w-2/5 font-medium" />
                  <input value={item.href} onChange={(e) => setItem(i, { ...item, href: e.target.value })} placeholder="/path" className="field flex-1 font-mono text-[13px]" />
                  <RowTools
                    index={i}
                    total={nav.length}
                    onMove={(a, b) => setNav(move(nav, a, b))}
                    onRemove={(idx) => setNav(nav.filter((_, j) => j !== idx))}
                  />
                </div>

                {(item.children ?? []).length > 0 && (
                  <div className="mt-2 space-y-2 border-l-2 border-slate-200 pl-3">
                    {(item.children ?? []).map((child, k) => {
                      const children = item.children ?? [];
                      const setChild = (v: typeof child) =>
                        setItem(i, { ...item, children: children.map((c, m) => (m === k ? v : c)) });
                      return (
                        <div key={k} className="flex items-start gap-2">
                          <div className="min-w-0 flex-1 space-y-1.5">
                            <div className="flex gap-2">
                              <input value={child.label} onChange={(e) => setChild({ ...child, label: e.target.value })} placeholder="ชื่อเมนูย่อย" className="field w-2/5" />
                              <input value={child.href} onChange={(e) => setChild({ ...child, href: e.target.value })} placeholder="/path" className="field flex-1 font-mono text-[13px]" />
                            </div>
                            <input value={child.note ?? ""} onChange={(e) => setChild({ ...child, note: e.target.value || undefined })} placeholder="คำอธิบายใต้ชื่อ (แสดงเฉพาะบนจอใหญ่)" className="field" />
                          </div>
                          <RowTools
                            index={k}
                            total={children.length}
                            onMove={(a, b) => setItem(i, { ...item, children: move(children, a, b) })}
                            onRemove={(idx) => setItem(i, { ...item, children: children.filter((_, m) => m !== idx) })}
                          />
                        </div>
                      );
                    })}
                  </div>
                )}

                <button
                  type="button"
                  onClick={() => setItem(i, { ...item, children: [...(item.children ?? []), { href: "", label: "" }] })}
                  className="btn-line-admin mt-2 ml-3"
                >
                  + เมนูย่อย
                </button>
              </div>
            ))}

            <button type="button" onClick={() => setNav([...nav, { href: "", label: "" }])} className="btn-line-admin">
              + เพิ่มเมนู
            </button>
          </div>
        </Fieldset>

        <Fieldset title="มาตรฐานที่อ้างอิง">
          <p className="text-[12px] leading-relaxed text-slate-500">
            การ์ดสามใบบนหน้าแรก และหนึ่งบล็อกต่อหนึ่งมาตรฐานในหน้า{" "}
            <span className="font-mono">/standards</span> — “รหัส” คือชื่อ anchor
            ที่การ์ดหน้าแรกลิงก์เข้าไป ใช้ตัวอักษรอังกฤษพิมพ์เล็กกับขีดกลางเท่านั้น
          </p>
          <div className="space-y-3">
            {standards.map((s, i) => {
              const setStd = (v: Standard) =>
                setStandards(standards.map((x, j) => (i === j ? v : x)));
              return (
                <div key={i} className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                  <div className="flex items-start gap-2">
                    <div className="min-w-0 flex-1 space-y-2.5">
                      <div className="grid gap-2 sm:grid-cols-2">
                        <input value={s.label} onChange={(e) => setStd({ ...s, label: e.target.value })} placeholder="ASTM E-119" className="field font-medium" />
                        <input value={s.slug} onChange={(e) => setStd({ ...s, slug: e.target.value })} placeholder="astm-e119" className="field font-mono text-[13px]" />
                      </div>
                      <input value={s.note} onChange={(e) => setStd({ ...s, note: e.target.value })} placeholder="ทดสอบโดยจุฬาลงกรณ์มหาวิทยาลัย" className="field" />
                      <ImageField value={s.image} media={media} onChange={(v) => setStd({ ...s, image: v })} />
                      <div className="grid gap-2 sm:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
                        <input value={s.eyebrow} onChange={(e) => setStd({ ...s, eyebrow: e.target.value })} placeholder="Fire Test Standard" className="field" />
                        <input value={s.title} onChange={(e) => setStd({ ...s, title: e.target.value })} placeholder="หัวข้อในหน้ามาตรฐาน" className="field font-medium" />
                      </div>
                      <Field label="เนื้อหา" hint="หนึ่งช่อง = หนึ่งย่อหน้า">
                        <TextListEditor value={s.body} onChange={(v) => setStd({ ...s, body: v })} rows={4} addLabel="+ เพิ่มย่อหน้า" />
                      </Field>
                      <Field label="รายการติ๊กถูก">
                        <TextListEditor value={s.points} onChange={(v) => setStd({ ...s, points: v })} rows={2} />
                      </Field>
                    </div>
                    <RowTools
                      index={i}
                      total={standards.length}
                      onMove={(a, b) => setStandards(move(standards, a, b))}
                      onRemove={(idx) => setStandards(standards.filter((_, j) => j !== idx))}
                    />
                  </div>
                </div>
              );
            })}
            <button
              type="button"
              onClick={() =>
                setStandards([
                  ...standards,
                  { slug: "", label: "", note: "", image: "", eyebrow: "", title: "", body: [], points: [] },
                ])
              }
              className="btn-line-admin"
            >
              + เพิ่มมาตรฐาน
            </button>
          </div>
        </Fieldset>

        <Fieldset title="ตัวเลขที่โชว์">
          <Field label="" hint="แถบสถิติในหน้าเกี่ยวกับเรา หน้าผลงาน และหน้ารับรองสีกันไฟ">
            <div className="space-y-2">
              {stats.map((s, i) => (
                <div key={i} className="flex items-start gap-2">
                  <input value={s.value} onChange={(e) => setStats(stats.map((x, j) => (j === i ? { ...x, value: e.target.value } : x)))} placeholder="15+" className="field w-32 font-medium" />
                  <input value={s.label} onChange={(e) => setStats(stats.map((x, j) => (j === i ? { ...x, label: e.target.value } : x)))} placeholder="ปีประสบการณ์งานสีกันไฟ" className="field flex-1" />
                  <RowTools
                    index={i}
                    total={stats.length}
                    onMove={(a, b) => setStats(move(stats, a, b))}
                    onRemove={(idx) => setStats(stats.filter((_, j) => j !== idx))}
                  />
                </div>
              ))}
              <button type="button" onClick={() => setStats([...stats, { value: "", label: "" }])} className="btn-line-admin">
                + เพิ่มตัวเลข
              </button>
            </div>
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
