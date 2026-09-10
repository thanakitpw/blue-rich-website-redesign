"use client";

import { useActionState } from "react";
import { Icon } from "@/components/ui";
import { useSite } from "@/components/SiteProvider";
import { sendEnquiry, type EnquirySpec, type EnquiryState } from "@/lib/enquiry/actions";

const topics = [
  "สีกันไฟ – สีทนไฟ",
  "สีรองพื้นกันสนิม",
  "น้ำมันสน / ทินเนอร์",
  "ผ้ากันไฟ",
  "บริการรับรองงานโดยวุฒิวิศวกร",
  "อื่น ๆ",
];

/* ลำดับช่องในเมลที่ทีมขายได้รับ — name ต้องตรงกับ input ด้านล่าง */
const spec: EnquirySpec = {
  subject: "สอบถามจากเว็บไซต์",
  topicField: "topic",
  source: "หน้าติดต่อเรา",
  fields: [
    { name: "name", label: "ชื่อผู้ติดต่อ" },
    { name: "company", label: "บริษัท/โครงการ" },
    { name: "phone", label: "เบอร์โทร" },
    { name: "email", label: "อีเมล" },
    { name: "topic", label: "เรื่องที่สนใจ" },
    { name: "message", label: "รายละเอียด", multiline: true },
  ],
};

const sendContactEnquiry = sendEnquiry.bind(null, spec);
const initialState: EnquiryState = { status: "idle" };

const field =
  "w-full rounded-2xl border border-brand-200 bg-white px-4 py-3 text-[1.02rem] text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-brand-400 focus:ring-4 focus:ring-brand-100";

/**
 * ส่งผ่าน server action เข้าอีเมลทีมขายโดยตรง (ดู src/lib/enquiry)
 * เดิมเปิด mailto: ซึ่งบนมือถือจำนวนมากไม่มีแอปเมลตั้งค่าไว้ ข้อความจึงหายกลางทาง
 */
export default function ContactForm() {
  const { site } = useSite();
  const [state, formAction, pending] = useActionState(sendContactEnquiry, initialState);

  return (
    <form action={formAction} className="grid gap-4">
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

      {/* ช่องดักบอต — คนจริงมองไม่เห็น เซิร์ฟเวอร์ทิ้งฟอร์มที่ช่องนี้มีค่า */}
      <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden className="hidden" />

      <button
        type="submit"
        disabled={pending}
        className="mt-2 inline-flex items-center justify-center gap-2 rounded-full bg-brand-700 px-7 py-3.5 font-semibold text-white shadow-lg shadow-brand-900/20 transition hover:bg-accent-600 active:scale-[0.98] disabled:cursor-wait disabled:opacity-60"
      >
        <Icon.mail />
        {pending ? "กำลังส่ง…" : "ส่งข้อความถึงเรา"}
      </button>

      <p className="text-xs leading-relaxed text-slate-400">
        ข้อความจะส่งตรงถึงทีมงานทางอีเมล และจะติดต่อกลับภายใน 1–2 วันทำการ
        หากเร่งด่วนสามารถโทรหรือทักไลน์หาเราได้โดยตรง
      </p>

      {state.status === "sent" && (
        <p
          role="status"
          className="rounded-2xl bg-brand-50 px-5 py-4 text-sm text-brand-800 border border-slate-200"
        >
          ได้รับข้อความแล้ว ขอบคุณครับ ทีมงานจะติดต่อกลับภายใน 1–2 วันทำการ หากเร่งด่วนโทร{" "}
          {site.phones[0]}
        </p>
      )}

      {state.status === "error" && (
        <p
          role="alert"
          className="rounded-2xl bg-amber-50 px-5 py-4 text-sm leading-relaxed text-amber-900 ring-1 ring-inset ring-amber-100"
        >
          {state.message} กรุณาโทร {site.phones[0]} หรือส่งอีเมลมาที่{" "}
          <a href={`mailto:${site.email}`} className="font-semibold underline">
            {site.email}
          </a>
        </p>
      )}
    </form>
  );
}
