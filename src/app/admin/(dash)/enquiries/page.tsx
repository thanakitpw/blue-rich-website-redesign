import { timeAgo } from "@/lib/cms/admin";
import { listEnquiries, type EnquiryRow } from "@/lib/enquiry/admin";
import { FLAG_LABEL } from "@/lib/enquiry/screen";

export const dynamic = "force-dynamic";

/**
 * ข้อความจากฟอร์มทุกฉบับ รวมที่ตัวกรองสแปมทิ้งไปโดยไม่ส่งเมล
 *
 * หน้านี้มีไว้เป็นตาข่ายรองรับ: ถ้าลูกค้าบอกว่า "ส่งฟอร์มแล้วไม่มีใครติดต่อกลับ"
 * ให้มาหาที่นี่ก่อน ข้อความยังอยู่ครบพร้อมเหตุผลที่ระบบตัดสิน
 */
const REASON_LABEL: Record<string, string> = {
  honeypot: "บอตกรอกช่องที่ซ่อนไว้",
  turnstile: "ไม่ผ่านการตรวจบอต (Turnstile)",
  "rate-limit": "ส่งถี่เกินไปจาก IP เดียวกัน",
  "link-no-thai": "มีลิงก์และไม่มีภาษาไทยเลย",
  "foreign-no-thai": "นอกประเทศ + ไม่มีภาษาไทย + เบอร์ไม่ใช่ไทย",
};

function stamp(iso: string) {
  return new Date(iso).toLocaleString("th-TH", {
    timeZone: "Asia/Bangkok",
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function Row({ e }: { e: EnquiryRow }) {
  const name = e.fields.find((f) => f.label === "ชื่อผู้ติดต่อ")?.value || "—";
  const phone = e.fields.find((f) => f.label === "เบอร์โทร")?.value || "—";
  const dropped = e.verdict === "dropped";

  return (
    <details className="card-admin group">
      <summary className="flex cursor-pointer list-none items-start gap-3 p-4">
        <span
          className={`mt-0.5 shrink-0 rounded-full px-2 py-0.5 text-[11px] font-medium ${
            dropped ? "bg-rose-100 text-rose-800" : "bg-emerald-100 text-emerald-800"
          }`}
        >
          {dropped ? "ทิ้ง" : "ส่งแล้ว"}
        </span>

        <span className="min-w-0 flex-1">
          <span className="block truncate text-[14px] font-medium text-slate-900">
            {name} · {phone}
          </span>
          <span className="mt-0.5 block truncate text-[12.5px] text-slate-500">
            {e.subject}
            {dropped && e.reason && ` — ${REASON_LABEL[e.reason] ?? e.reason}`}
          </span>
        </span>

        <span className="shrink-0 text-right text-[12px] text-slate-500">
          <span className="block">{timeAgo(e.created_at)}</span>
          <span className="block">{e.country ?? "??"}{e.city ? ` · ${e.city}` : ""}</span>
        </span>
      </summary>

      <div className="border-t border-slate-100 px-4 py-4 text-[13px]">
        <dl className="grid gap-x-6 gap-y-2 sm:grid-cols-[max-content_1fr]">
          {e.fields.map((f) => (
            <div key={f.label} className="contents">
              <dt className="text-slate-500">{f.label}</dt>
              <dd className="whitespace-pre-wrap break-words text-slate-900">{f.value || "—"}</dd>
            </div>
          ))}
        </dl>

        <div className="mt-4 space-y-1 border-t border-slate-100 pt-3 text-[12px] text-slate-500">
          <p>ส่งเมื่อ {stamp(e.created_at)} · จาก{e.source}</p>
          <p>IP {e.ip ?? "—"} · Turnstile: {e.turnstile}</p>
          {e.flags.length > 0 && (
            <p>ข้อสังเกต: {e.flags.map((f) => FLAG_LABEL[f] ?? f).join(", ")}</p>
          )}
          {e.user_agent && <p className="break-all">อุปกรณ์: {e.user_agent}</p>}
        </div>
      </div>
    </details>
  );
}

export default async function AdminEnquiriesPage() {
  const rows = await listEnquiries(100);
  const dropped = rows.filter((r) => r.verdict === "dropped").length;

  return (
    <div className="max-w-4xl px-8 py-8">
      <h1 className="admin-title">ข้อความจากฟอร์ม</h1>
      <p className="mt-1 text-sm text-slate-500">
        {rows.length === 0
          ? "ยังไม่มีข้อความเข้ามา"
          : `${rows.length} ฉบับล่าสุด · ตัวกรองสแปมทิ้งไป ${dropped} ฉบับ (ยังเปิดดูได้ที่นี่ ไม่ได้ส่งเข้าอีเมล)`}
      </p>

      <div className="mt-6 space-y-3">
        {rows.map((e) => (
          <Row key={e.id} e={e} />
        ))}
      </div>
    </div>
  );
}
