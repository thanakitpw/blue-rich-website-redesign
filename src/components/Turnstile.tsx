"use client";

import Script from "next/script";
import { useCallback, useEffect, useRef } from "react";

/**
 * Cloudflare Turnstile — ตัวยืนยันว่าคนกดส่งฟอร์มไม่ใช่บอต แบบที่ลูกค้าแทบไม่เห็น
 *
 * ── วิธีทำงาน ──
 * widget ตรวจเบราว์เซอร์เงียบๆ ตั้งแต่หน้าโหลด แล้วฝัง <input hidden
 * name="cf-turnstile-response"> ไว้ในฟอร์ม server action อ่านค่านั้นไปถาม
 * Cloudflare อีกทีว่าจริงไหม (ดู src/lib/enquiry/turnstile.ts)
 *
 * appearance "interaction-only" = ไม่แสดงอะไรเลยถ้าผ่านเงียบๆ ได้ จะโผล่กล่อง
 * ติ๊กก็ต่อเมื่อ Cloudflare ไม่แน่ใจ (เช่นมาจาก VPN) ซึ่งคนจริงติ๊กผ่านได้
 * ต่างจากโหมด invisible ที่ถ้าไม่แน่ใจจะปฏิเสธเลยโดยไม่มีทางแก้ — ต้องตั้ง widget
 * ในหน้า Cloudflare เป็นโหมด Managed ให้ตรงกัน
 *
 * ── ถ้ายังไม่ได้ตั้งค่า ──
 * ไม่มี NEXT_PUBLIC_TURNSTILE_SITE_KEY = ไม่เรนเดอร์อะไรเลย ฟอร์มทำงานเหมือนเดิม
 * ฝั่งเซิร์ฟเวอร์ก็ข้ามขั้นตรวจไป ตัวกรองอื่นยังทำงานครบ
 *
 * ── resetOn ──
 * token ใช้ได้ครั้งเดียว หลัง server action ตอบกลับ (ไม่ว่าสำเร็จหรือ error)
 * ต้องขอใหม่ ไม่งั้นกดส่งซ้ำจะถูกมองว่า token ซ้ำ — ส่ง state ของ useActionState
 * มาเป็นสัญญาณ เพราะมันเป็น object ใหม่ทุกครั้งที่ action จบ
 */
const SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
const SCRIPT_SRC = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";

type TurnstileApi = {
  render: (el: HTMLElement, opts: Record<string, unknown>) => string;
  reset: (id: string) => void;
  remove: (id: string) => void;
};

declare global {
  interface Window {
    turnstile?: TurnstileApi;
  }
}

export function Turnstile({ resetOn }: { resetOn: unknown }) {
  const box = useRef<HTMLDivElement>(null);
  const widgetId = useRef<string | null>(null);
  const firstRender = useRef(true);

  const mount = useCallback(() => {
    const api = window.turnstile;
    if (!api || !box.current || widgetId.current || !SITE_KEY) return;
    widgetId.current = api.render(box.current, {
      sitekey: SITE_KEY,
      appearance: "interaction-only",
      theme: "light",
      language: "th",
      "response-field-name": "cf-turnstile-response",
    });
  }, []);

  useEffect(() => {
    // สคริปต์อาจโหลดไว้แล้วจากหน้าก่อน (เปลี่ยนหน้าแบบ client-side) onReady จะไม่ยิงซ้ำในบางกรณี
    mount();
    return () => {
      if (widgetId.current) {
        window.turnstile?.remove(widgetId.current);
        widgetId.current = null;
      }
    };
  }, [mount]);

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    if (widgetId.current) window.turnstile?.reset(widgetId.current);
  }, [resetOn]);

  if (!SITE_KEY) return null;

  return (
    <>
      <Script src={SCRIPT_SRC} strategy="afterInteractive" onReady={mount} />
      <div ref={box} />
    </>
  );
}
