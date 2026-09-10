import type { ReactNode } from "react";

/**
 * Presentational primitives shared by every landing page. Server components on
 * purpose — landing pages ship as little client JS as possible, so anything
 * that does not need state lives here rather than inside a "use client" file.
 */

export function Wrap({
  className = "",
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={`mx-auto w-full max-w-[1200px] px-5 sm:px-8 ${className}`}>{children}</div>
  );
}

/** Tick used in every benefit list. */
export function Check({ className = "" }: { className?: string }) {
  return (
    <span
      className={`mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-brand-600 text-white ${className}`}
    >
      <svg viewBox="0 0 20 20" className="size-3" fill="none" aria-hidden>
        <path
          d="m5 10.5 3.2 3L15 7"
          stroke="currentColor"
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}

/** Pill label above a section heading. `tone` follows the section background:
    `light` on white, `band` on the sky-blue Band (white pill so it does not vanish). */
export function Eyebrow({
  tone = "light",
  children,
}: {
  tone?: "light" | "band" | "flame";
  children: ReactNode;
}) {
  const tones = {
    light: "bg-brand-50 text-brand-700 ring-brand-100",
    band: "bg-white text-brand-700 ring-brand-100",
    flame: "bg-accent-500/10 text-accent-600 ring-accent-500/20",
  } as const;

  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-semibold ring-1 ring-inset ${tones[tone]}`}
    >
      <span className="size-1.5 rounded-full bg-current" />
      {children}
    </span>
  );
}

/** Centred eyebrow + heading + lead. `tone` follows the section background. */
export function SectionHead({
  eyebrow,
  title,
  lead,
  tone = "light",
  className = "",
}: {
  eyebrow: string;
  title: ReactNode;
  lead?: string;
  tone?: "light" | "band";
  className?: string;
}) {
  return (
    <div className={`mx-auto max-w-3xl text-center ${className}`}>
      <Eyebrow tone={tone}>{eyebrow}</Eyebrow>
      <h2 className="mt-4 text-3xl leading-[1.25] sm:text-4xl lg:text-[2.6rem]">{title}</h2>
      {lead && (
        <p className="mt-5 text-base leading-relaxed text-slate-600 sm:text-[1.12rem]">{lead}</p>
      )}
    </div>
  );
}

/**
 * Full-bleed sky-blue band with a soft white radial wash.
 *
 * เดิมเป็นแถบน้ำเงินเข้ม (navy) ตัวหนังสือขาว — ลูกค้าขอให้ทุกหน้าแลนดิ้งเลิกใช้
 * พื้นมืด จึงเปลี่ยนเป็นฟ้าอ่อนโทนเดียวกับ bg-brand-50 ที่ใช้ทั่วเว็บ การ์ดข้างใน
 * เป็นขาวทึบแทนขาวโปร่ง ตัวหนังสือกลับมาเป็นสีปกติของเว็บ
 */
export function Band({
  id,
  glow = "left",
  className = "",
  children,
}: {
  id?: string;
  glow?: "left" | "right" | "center";
  className?: string;
  children: ReactNode;
}) {
  const glows = {
    left: "bg-[radial-gradient(56rem_28rem_at_20%_0%,rgba(255,255,255,0.75),transparent_65%)]",
    right: "bg-[radial-gradient(56rem_28rem_at_80%_0%,rgba(255,255,255,0.75),transparent_65%)]",
    center: "bg-[radial-gradient(50rem_26rem_at_50%_0%,rgba(255,255,255,0.75),transparent_70%)]",
  } as const;

  return (
    <section
      id={id}
      className={`relative overflow-hidden bg-brand-50 py-20 lg:py-24 ${className}`}
    >
      <div aria-hidden className={`absolute inset-0 ${glows[glow]}`} />
      <Wrap className="relative">{children}</Wrap>
    </section>
  );
}
