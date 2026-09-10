"use client";

import { useActionState, useMemo, useRef, useState } from "react";
import { Icon } from "@/components/ui";
import { useSite } from "@/components/SiteProvider";
import { sendEnquiry, type EnquirySpec, type EnquiryState } from "@/lib/enquiry/actions";

export type LpFormField =
  | {
      kind: "text";
      name: string;
      label: string;
      placeholder?: string;
      type?: "text" | "tel";
      /** Force the field onto its own row. */
      full?: boolean;
    }
  | { kind: "select"; name: string; label: string; options: string[]; full?: boolean }
  | { kind: "textarea"; name: string; label: string; placeholder?: string; rows?: number };

export type LpQuoteFormConfig = {
  /** Bracketed tag opening the composed message, and the mail subject prefix. */
  subject: string;
  /** Field whose answer is appended to the mail subject, e.g. the "ต้องการ" select. */
  topicField?: string;
  /** Everything after the always-present name + phone pair. */
  fields: LpFormField[];
  /** Fine print under the buttons. Defaults to the standard call-back promise. */
  note?: string;
};

const field =
  "w-full rounded-2xl border border-brand-200 bg-white px-4 py-3 text-[1.02rem] text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-brand-400 focus:ring-4 focus:ring-brand-100";

const labelText = "text-sm font-medium text-slate-700";

const initialState: EnquiryState = { status: "idle" };

/** ช่องของหน้านี้ในรูปที่ server action ใช้เรียงเนื้อเมล — ชื่อกับเบอร์นำหน้าเสมอ */
function specFor(config: LpQuoteFormConfig): EnquirySpec {
  return {
    subject: config.subject,
    topicField: config.topicField,
    source: "หน้าแลนดิ้ง",
    fields: [
      { name: "name", label: "ชื่อผู้ติดต่อ" },
      { name: "phone", label: "เบอร์โทร" },
      ...config.fields.map((f) => ({ name: f.name, label: f.label, multiline: f.kind === "textarea" })),
    ],
  };
}

/**
 * ปุ่มเมลส่งผ่าน server action เข้าอีเมลทีมขายโดยตรง (ดู src/lib/enquiry)
 * ปุ่ม LINE ยังประกอบข้อความฝั่ง client แล้วคัดลอกให้วางในแชท — ทราฟฟิก B2B
 * ไทยปิดการขายทางไลน์ได้ดีกว่ามาก จึงเก็บทางนี้ไว้คู่กัน
 *
 * The field list is per landing page: a fire-paint enquiry needs a fire rating,
 * a thinner enquiry needs pack sizes. Only name and phone are universal.
 */
export default function LpQuoteForm({ config }: { config: LpQuoteFormConfig }) {
  const { site, lineHref } = useSite();
  const formRef = useRef<HTMLFormElement>(null);

  const action = useMemo(() => sendEnquiry.bind(null, specFor(config)), [config]);
  const [state, formAction, pending] = useActionState(action, initialState);

  const [lineStatus, setLineStatus] = useState<"idle" | "copied" | "copyFailed">("idle");
  /* กล่องสถานะมีกล่องเดียว โชว์ผลของปุ่มที่กดล่าสุด */
  const [lastUsed, setLastUsed] = useState<"mail" | "line">("mail");

  function compose(form: HTMLFormElement) {
    const data = new FormData(form);
    const get = (k: string) => String(data.get(k) ?? "").trim();

    const lines = config.fields.map((f) =>
      f.kind === "textarea" ? `\n${f.label}:\n${get(f.name) || "-"}` : `${f.label}: ${get(f.name) || "-"}`,
    );

    return [
      `[${config.subject} — จากหน้าแลนดิ้ง]`,
      "",
      `ชื่อผู้ติดต่อ: ${get("name")}`,
      `เบอร์โทร: ${get("phone")}`,
      ...lines,
    ].join("\n");
  }

  async function handleLine() {
    const form = formRef.current;
    if (!form) return;

    // Same required-field rules as the mail path — don't send a blank enquiry.
    if (!form.reportValidity()) return;

    setLastUsed("line");
    try {
      await navigator.clipboard.writeText(compose(form));
      setLineStatus("copied");
    } catch {
      setLineStatus("copyFailed");
    }
    window.open(lineHref, "_blank", "noopener");
  }

  const showMail = lastUsed === "mail" && state.status !== "idle";
  const showLine = lastUsed === "line" && lineStatus !== "idle";

  return (
    <form
      ref={formRef}
      action={formAction}
      onSubmit={() => setLastUsed("mail")}
      className="grid gap-4"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="grid gap-2">
          <span className={labelText}>
            ชื่อผู้ติดต่อ <span className="text-accent-600">*</span>
          </span>
          <input name="name" required placeholder="ชื่อ – นามสกุล" className={field} />
        </label>
        <label className="grid gap-2">
          <span className={labelText}>
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

        {config.fields.map((f) => {
          const span = f.kind === "textarea" || f.full ? "sm:col-span-2" : "";

          return (
            <label key={f.name} className={`grid gap-2 ${span}`}>
              <span className={labelText}>{f.label}</span>

              {f.kind === "text" && (
                <input
                  name={f.name}
                  type={f.type ?? "text"}
                  placeholder={f.placeholder}
                  className={field}
                />
              )}

              {f.kind === "select" && (
                <select name={f.name} defaultValue={f.options[0]} className={field}>
                  {f.options.map((o) => (
                    <option key={o}>{o}</option>
                  ))}
                </select>
              )}

              {f.kind === "textarea" && (
                <textarea
                  name={f.name}
                  rows={f.rows ?? 4}
                  placeholder={f.placeholder}
                  className={`${field} resize-y`}
                />
              )}
            </label>
          );
        })}
      </div>

      {/* ช่องดักบอต — คนจริงมองไม่เห็น เซิร์ฟเวอร์ทิ้งฟอร์มที่ช่องนี้มีค่า */}
      <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden className="hidden" />

      <div className="mt-2 grid gap-3 sm:grid-cols-2">
        <button
          type="submit"
          disabled={pending}
          data-cta="form-submit-mail"
          className="inline-flex items-center justify-center gap-2 rounded-full bg-brand-700 px-7 py-3.5 font-semibold text-white shadow-lg shadow-brand-900/20 transition hover:bg-accent-600 active:scale-[0.98] disabled:cursor-wait disabled:opacity-60"
        >
          <Icon.mail />
          {pending ? "กำลังส่ง…" : "ส่งขอใบเสนอราคา"}
        </button>
        <button
          type="button"
          onClick={handleLine}
          data-cta="form-submit-line"
          className="inline-flex items-center justify-center gap-2 rounded-full bg-[#06C755] px-7 py-3.5 font-semibold text-white shadow-lg shadow-[#06C755]/25 transition hover:bg-[#05b34c] active:scale-[0.98]"
        >
          <Icon.line />
          ส่งทาง LINE แทน
        </button>
      </div>

      <p className="text-xs leading-relaxed text-slate-400">
        {config.note ??
          `ข้อมูลที่กรอกใช้สำหรับติดต่อกลับและจัดทำใบเสนอราคาเท่านั้น ทีมงานจะติดต่อกลับภายใน 1–2 วันทำการ หรือโทรหาเราได้โดยตรงที่ ${site.phones[0]}`}
      </p>

      {showMail && state.status === "sent" && (
        <p
          role="status"
          className="rounded-2xl bg-brand-50 px-5 py-4 text-sm leading-relaxed text-brand-800 ring-1 ring-inset ring-brand-100"
        >
          ได้รับคำขอใบเสนอราคาแล้ว ขอบคุณครับ ทีมงานจะติดต่อกลับภายใน 1–2 วันทำการ หากเร่งด่วนโทร{" "}
          {site.phones[0]}
        </p>
      )}

      {showMail && state.status === "error" && (
        <p
          role="alert"
          className="rounded-2xl bg-amber-50 px-5 py-4 text-sm leading-relaxed text-amber-900 ring-1 ring-inset ring-amber-100"
        >
          {state.message} กรุณาโทร {site.phones[0]} หรือกด &ldquo;ส่งทาง LINE แทน&rdquo;
        </p>
      )}

      {showLine && (
        <p
          role="status"
          className="rounded-2xl bg-brand-50 px-5 py-4 text-sm leading-relaxed text-brand-800 ring-1 ring-inset ring-brand-100"
        >
          {lineStatus === "copied" && (
            <>คัดลอกรายละเอียดงานไว้ให้แล้ว เปิดแชท LINE ขึ้นมาแล้ววางข้อความส่งได้เลย</>
          )}
          {lineStatus === "copyFailed" && (
            <>
              เปิดแชท LINE ให้แล้ว แต่คัดลอกข้อความอัตโนมัติไม่สำเร็จ
              รบกวนพิมพ์รายละเอียดงานในแชท หรือโทรหาเราที่ {site.phones[0]}
            </>
          )}
        </p>
      )}
    </form>
  );
}
