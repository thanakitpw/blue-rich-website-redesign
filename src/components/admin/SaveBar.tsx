"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import type { ActionResult } from "@/lib/cms/actions";

/**
 * แถบบันทึกที่ทุกหน้าแก้ไขใช้ร่วมกัน
 *
 * แยก "บันทึกร่าง" กับ "เผยแพร่" ออกจากกันชัดเจน เพราะเป็นแนวคิดหลักของระบบนี้
 * — แก้แล้วเว็บจริงยังไม่ขยับจนกว่าจะกดเผยแพร่
 */
export function SaveBar({
  onSave,
  onPublish,
  onDelete,
  hasDraft,
  backHref,
  deleteLabel = "ลบรายการนี้",
  saveLabel = "บันทึกร่าง",
}: {
  onSave: () => Promise<ActionResult>;
  onPublish?: () => Promise<ActionResult>;
  onDelete?: () => Promise<ActionResult>;
  hasDraft?: boolean;
  backHref?: string;
  deleteLabel?: string;
  saveLabel?: string;
}) {
  const [pending, start] = useTransition();
  const [msg, setMsg] = useState<{ kind: "ok" | "err"; text: string } | null>(null);
  const [confirming, setConfirming] = useState(false);

  const run = (fn: () => Promise<ActionResult>, okText: string) =>
    start(async () => {
      setMsg(null);
      const res = await fn();
      setMsg(res.ok ? { kind: "ok", text: okText } : { kind: "err", text: res.error });
    });

  return (
    <div className="sticky bottom-0 -mx-8 mt-8 flex flex-wrap items-center gap-3 border-t border-slate-200 bg-white/95 px-8 py-4 backdrop-blur">
      <button type="button" disabled={pending} onClick={() => run(onSave, "บันทึกร่างแล้ว")} className="btn-solid">
        {pending ? "กำลังทำงาน…" : saveLabel}
      </button>

      {onPublish && (
        <button
          type="button"
          disabled={pending}
          onClick={() => run(onPublish, "เผยแพร่ขึ้นเว็บแล้ว")}
          className="btn-line-admin"
        >
          เผยแพร่ขึ้นเว็บ
        </button>
      )}

      {hasDraft && (
        <span className="chip-draft">มีร่างที่ยังไม่เผยแพร่</span>
      )}

      <span className="flex-1" />

      {msg && (
        <span
          role="status"
          className={`text-[13px] ${msg.kind === "ok" ? "text-emerald-700" : "text-red-600"}`}
        >
          {msg.text}
        </span>
      )}

      {backHref && (
        <Link href={backHref} className="btn-line-admin">
          กลับ
        </Link>
      )}

      {onDelete &&
        (confirming ? (
          <span className="flex items-center gap-2">
            <span className="text-[13px] text-slate-600">ลบถาวร แน่ใจไหม?</span>
            <button type="button" disabled={pending} onClick={() => run(onDelete, "ลบแล้ว")} className="btn-danger">
              ยืนยันลบ
            </button>
            <button type="button" onClick={() => setConfirming(false)} className="btn-line-admin">
              ยกเลิก
            </button>
          </span>
        ) : (
          <button type="button" onClick={() => setConfirming(true)} className="btn-danger">
            {deleteLabel}
          </button>
        ))}
    </div>
  );
}

/** ปุ่มเดี่ยวสำหรับหน้ารายการ เช่น "เผยแพร่ทั้งหมด" */
export function ActionButton({
  action,
  label,
  okText,
  className = "btn-line-admin",
}: {
  action: () => Promise<ActionResult>;
  label: string;
  okText: string;
  className?: string;
}) {
  const [pending, start] = useTransition();
  const [msg, setMsg] = useState<string | null>(null);

  return (
    <span className="inline-flex items-center gap-2">
      <button
        type="button"
        disabled={pending}
        className={className}
        onClick={() =>
          start(async () => {
            const res = await action();
            setMsg(res.ok ? okText : res.error);
          })
        }
      >
        {pending ? "กำลังทำงาน…" : label}
      </button>
      {msg && <span className="text-[13px] text-slate-500">{msg}</span>}
    </span>
  );
}
