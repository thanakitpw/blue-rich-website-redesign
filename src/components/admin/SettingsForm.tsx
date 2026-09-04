"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { SiteInfo } from "@/data/site";
import { publishSetting, saveSetting } from "@/app/admin/(dash)/settings/actions";
import { TextListEditor } from "./Editors";
import { SaveBar } from "./SaveBar";
import { Field, Fieldset } from "./FormBits";

export function SettingsForm({ value, hasDraft }: { value: SiteInfo; hasDraft: boolean }) {
  const router = useRouter();
  const [d, setD] = useState<SiteInfo>(value);
  const set = <K extends keyof SiteInfo>(k: K, v: SiteInfo[K]) =>
    setD((prev) => ({ ...prev, [k]: v }));

  return (
    <div className="max-w-3xl px-8 py-8">
      <h1 className="admin-title">ข้อมูลบริษัท</h1>
      <p className="mt-1 text-sm text-slate-500">
        ใช้ทั่วทั้งเว็บ — หัวเว็บ ส่วนท้าย หน้าติดต่อ ปุ่มลอย และข้อมูล SEO
      </p>

      <div className="mt-6 space-y-6">
        <Fieldset title="ชื่อและคำโปรย">
          <Field label="ชื่อบริษัท (ไทย)">
            <input value={d.name} onChange={(e) => set("name", e.target.value)} className="field" />
          </Field>
          <Field label="ชื่อบริษัท (อังกฤษ)">
            <input value={d.nameEn} onChange={(e) => set("nameEn", e.target.value)} className="field" />
          </Field>
          <Field label="ชื่อย่อ" hint="ใช้ต่อท้ายชื่อหน้าในแท็บเบราว์เซอร์">
            <input value={d.shortName} onChange={(e) => set("shortName", e.target.value)} className="field" />
          </Field>
          <Field label="คำโปรยหนึ่งบรรทัด">
            <input value={d.tagline} onChange={(e) => set("tagline", e.target.value)} className="field" />
          </Field>
          <Field label="คำอธิบายเว็บไซต์" hint="ข้อความที่ Google แสดงใต้ชื่อเว็บในผลค้นหา">
            <textarea rows={3} value={d.description} onChange={(e) => set("description", e.target.value)} className="field" />
          </Field>
        </Fieldset>

        <Fieldset title="ช่องทางติดต่อ">
          <Field label="เบอร์โทร" hint="เบอร์แรกใช้กับปุ่มโทรทั้งเว็บ · เบอร์ที่หนึ่งกับที่สี่ขึ้นบนหัวเว็บ">
            <TextListEditor value={d.phones} onChange={(v) => set("phones", v)} rows={1} addLabel="+ เพิ่มเบอร์" placeholder="099-458-6692" />
          </Field>
          <Field label="อีเมล">
            <input value={d.email} onChange={(e) => set("email", e.target.value)} className="field" />
          </Field>
          <Field label="LINE ID" hint="ใส่เฉพาะไอดี ไม่ต้องใส่ @ นำหน้า">
            <input value={d.lineId} onChange={(e) => set("lineId", e.target.value)} className="field" />
          </Field>
          <Field label="ลิงก์ LINE ช่องทางที่สอง" hint="เป็นลิงก์เชิญที่ไม่มีไอดีสาธารณะ จึงต้องใส่ทั้ง URL">
            <input value={d.lineHref2} onChange={(e) => set("lineHref2", e.target.value)} className="field font-mono text-[13px]" />
          </Field>
          <Field label="เวลาทำการ">
            <input value={d.hours} onChange={(e) => set("hours", e.target.value)} className="field" />
          </Field>
        </Fieldset>

        <Fieldset title="ที่อยู่">
          <Field label="ที่อยู่เต็ม">
            <textarea rows={3} value={d.address} onChange={(e) => set("address", e.target.value)} className="field" />
          </Field>
          <Field label="ที่อยู่แบบสั้น" hint="ใช้ในที่ที่พื้นที่จำกัด">
            <input value={d.addressShort} onChange={(e) => set("addressShort", e.target.value)} className="field" />
          </Field>
          <Field label="ข้อความค้นหาแผนที่" hint="ใช้สร้างลิงก์และแผนที่ฝังของ Google Maps">
            <textarea rows={2} value={d.mapQuery} onChange={(e) => set("mapQuery", e.target.value)} className="field" />
          </Field>
        </Fieldset>

        <Fieldset title="ที่อยู่เว็บไซต์">
          <Field label="URL เต็มของเว็บ" hint="ใช้สร้าง sitemap และลิงก์แบบเต็มในข้อมูล SEO — เปลี่ยนเมื่อย้ายโดเมนเท่านั้น">
            <input value={d.url} onChange={(e) => set("url", e.target.value)} className="field font-mono text-[13px]" />
          </Field>
        </Fieldset>
      </div>

      <SaveBar
        hasDraft={hasDraft}
        onSave={async () => {
          const res = await saveSetting("company", d);
          if (res.ok) router.refresh();
          return res;
        }}
        onPublish={async () => {
          const res = await publishSetting("company");
          if (res.ok) router.refresh();
          return res;
        }}
      />
    </div>
  );
}
