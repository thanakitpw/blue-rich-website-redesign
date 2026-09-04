"use client";

import { useState } from "react";
import { Icon } from "@/components/ui";
import { useSite } from "@/components/SiteProvider";

const topics = [
  "สีกันไฟ – สีทนไฟ",
  "สีรองพื้นกันสนิม",
  "น้ำมันสน / ทินเนอร์",
  "ผ้ากันไฟ",
  "บริการรับรองงานโดยวุฒิวิศวกร",
  "อื่น ๆ",
];

const field =
  "w-full rounded-2xl border border-brand-200 bg-white px-4 py-3 text-[1.02rem] text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-brand-400 focus:ring-4 focus:ring-brand-100";

/**
 * No backend is wired up yet — submitting composes the enquiry and hands it to
 * the visitor's mail client. Swap `handleSubmit` for a server action or form
 * service when an inbox integration is available.
 */
export default function ContactForm() {
  const { site } = useSite();
  const [sent, setSent] = useState(false);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const get = (k: string) => String(data.get(k) ?? "").trim();

    const body = [
      `ชื่อผู้ติดต่อ: ${get("name")}`,
      `บริษัท/โครงการ: ${get("company") || "-"}`,
      `เบอร์โทร: ${get("phone")}`,
      `อีเมล: ${get("email") || "-"}`,
      `เรื่องที่สนใจ: ${get("topic")}`,
      "",
      "รายละเอียด:",
      get("message"),
    ].join("\n");

    window.location.href = `mailto:${site.email}?subject=${encodeURIComponent(
      `[สอบถามจากเว็บไซต์] ${get("topic")} — ${get("name")}`,
    )}&body=${encodeURIComponent(body)}`;

    setSent(true);
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="grid gap-2">
          <span className="text-sm font-medium text-slate-700">
            ชื่อผู้ติดต่อ <span className="text-accent-600">*</span>
          </span>
          <input name="name" required placeholder="ชื่อ – นามสกุล" className={field} />
        </label>
        <label className="grid gap-2">
          <span className="text-sm font-medium text-slate-700">บริษัท / ชื่อโครงการ</span>
          <input name="company" placeholder="เช่น โรงงาน ABC" className={field} />
        </label>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="grid gap-2">
          <span className="text-sm font-medium text-slate-700">
            เบอร์โทรติดต่อกลับ <span className="text-accent-600">*</span>
          </span>
          <input
            name="phone"
            type="tel"
            required
            inputMode="tel"
            placeholder="08X-XXX-XXXX"
            className={field}
          />
        </label>
        <label className="grid gap-2">
          <span className="text-sm font-medium text-slate-700">อีเมล</span>
          <input name="email" type="email" placeholder="you@company.com" className={field} />
        </label>
      </div>

      <label className="grid gap-2">
        <span className="text-sm font-medium text-slate-700">เรื่องที่สนใจ</span>
        <select name="topic" defaultValue={topics[0]} className={field}>
          {topics.map((t) => (
            <option key={t}>{t}</option>
          ))}
        </select>
      </label>

      <label className="grid gap-2">
        <span className="text-sm font-medium text-slate-700">
          รายละเอียดงาน <span className="text-accent-600">*</span>
        </span>
        <textarea
          name="message"
          required
          rows={5}
          placeholder="เช่น อาคารโรงงาน 2 ชั้น โครงสร้างเหล็ก ต้องการอัตราการทนไฟ 2 ชั่วโมง ปริมาณเหล็กประมาณ 80 ตัน"
          className={`${field} resize-y`}
        />
      </label>

      <button
        type="submit"
        className="mt-2 inline-flex items-center justify-center gap-2 rounded-full bg-brand-700 px-7 py-3.5 font-semibold text-white shadow-lg shadow-brand-900/20 transition hover:bg-accent-600 active:scale-[0.98]"
      >
        <Icon.mail />
        ส่งข้อความถึงเรา
      </button>

      <p className="text-xs leading-relaxed text-slate-400">
        เมื่อกดส่ง ระบบจะเปิดโปรแกรมอีเมลของคุณพร้อมข้อความที่กรอกไว้
        หากไม่สะดวกสามารถโทรหรือทักไลน์หาเราได้โดยตรง
      </p>

      {sent && (
        <p
          role="status"
          className="rounded-2xl bg-brand-50 px-5 py-4 text-sm text-brand-800 border border-slate-200"
        >
          เปิดโปรแกรมอีเมลเรียบร้อยแล้ว หากไม่มีหน้าต่างขึ้นมา กรุณาส่งอีเมลมาที่{" "}
          <a href={`mailto:${site.email}`} className="font-semibold underline">
            {site.email}
          </a>{" "}
          หรือโทร {site.phones[0]}
        </p>
      )}
    </form>
  );
}
