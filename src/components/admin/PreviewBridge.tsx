"use client";

import { useEffect } from "react";
import { MARK } from "@/lib/cms/copy";

/**
 * สะพานเชื่อมระหว่างหน้าเว็บจริงกับหน้าจอแก้ไขในหลังบ้าน
 *
 * ทำงานเฉพาะตอนอยู่ในโหมดพรีวิว (มี Draft Mode) เท่านั้น
 *
 * หน้าที่:
 *   1. ถอดเครื่องหมายที่มองไม่เห็นออกจากข้อความ แล้วห่อด้วย span ที่กดได้
 *   2. กดข้อความหรือรูปไหน → บอกหน้าจอแก้ไขว่าเป็นกุญแจไหน
 *   3. หน้าจอแก้ไขพิมพ์อะไร/เลือกรูปไหน → เปลี่ยนในหน้าทันที ไม่ต้องรีโหลด
 *
 * รูปไม่ต้องใช้เครื่องหมายเหมือนข้อความ เพราะ CmsImage ติด data-cms-image
 * ให้ตั้งแต่ฝั่งเซิร์ฟเวอร์แล้ว (เฉพาะตอนพรีวิว)
 */
export function PreviewBridge() {
  useEffect(() => {
    /* หลังบ้านเองก็อยู่ใต้ layout เดียวกันและคุกกี้พรีวิวยังติดอยู่ แต่ไม่มีอะไร
       ให้ทำที่นั่น — ออกไปเลย ไม่ต้องเสียแรงตั้ง observer คุมทั้งหน้าจอแก้ไข */
    if (location.pathname.startsWith("/admin")) return;

    /* เปิดหน้านี้ตรงๆ ทั้งที่โหมดพรีวิวยังค้างอยู่ (เช่นกดเปิดแท็บใหม่)
       ยังต้องถอดเครื่องหมายทิ้ง ไม่งั้นกุญแจจะโผล่เป็นข้อความบนหน้าจอ
       แค่ไม่ต้องทำให้กดได้ เพราะไม่มีหน้าจอแก้ไขให้คุยด้วย */
    const embedded = window.parent !== window;

    /* เทียบค่าเองแทนการใส่ path ลงใน attribute selector — กุญแจของรูปคือ path
       ซึ่งมีอักขระที่ต้อง escape ถ้าเขียนเป็น selector ตรงๆ */
    const images = () =>
      Array.from(document.querySelectorAll<HTMLImageElement>("img[data-cms-image]"));

    /**
     * หารูปที่กดได้ "ใต้ตำแหน่งเมาส์"
     *
     * รูปในดีไซน์นี้แทบทุกใบมีของวางทับเต็มพื้นที่ — แผ่นไล่เฉดให้ตัวหนังสือ
     * อ่านออก (absolute inset-0) หรือกรอบลิงก์ที่คลุมทั้งการ์ด การกดจึงไปโดน
     * แผ่นนั้น ไม่ใช่ตัว <img> และ closest() ช่วยไม่ได้เพราะมันไล่ขึ้นหา
     * บรรพบุรุษ ส่วนแผ่นที่ทับอยู่เป็น "พี่น้อง" ของรูป ไม่ใช่พ่อแม่
     *
     * elementsFromPoint คืนทุกชั้นที่ซ้อนกันอยู่ตรงนั้น จึงมองทะลุลงไปเจอรูปได้
     */
    const imageAt = (x: number, y: number) => {
      const stack = document.elementsFromPoint(x, y); // บนสุด → ล่างสุด
      const depth = stack.findIndex(
        (el) => el instanceof HTMLImageElement && Boolean(el.dataset.cmsImage),
      );
      if (depth < 0) return null;

      /* ถ้ามีปุ่ม ลิงก์ ช่องกรอก หรือข้อความที่แก้ได้ "อยู่เหนือ" รูป ให้ของพวกนั้น
         ได้คลิกไป ไม่ใช่ทะลุไปเลือกรูปที่อยู่ข้างหลัง — ส่วนลิงก์ที่ห่อรูปทั้งใบ
         ไม่เข้าเงื่อนไขนี้ เพราะมันเป็นบรรพบุรุษจึงอยู่ "ใต้" รูปในลิสต์ */
      const blocked = stack
        .slice(0, depth)
        .some((el) => el.matches("a[href], button, input, select, textarea, [data-cms-key]"));

      return blocked ? null : (stack[depth] as HTMLImageElement);
    };

    /* กรอบประของรูปใส่เฉพาะตอนอยู่ใน iframe ของหลังบ้าน — ถ้าเปิดหน้าจริง
       ทั้งที่โหมดพรีวิวยังค้างอยู่ ไม่ควรมีกรอบมารกหน้าเว็บ */
    const clickable = ["[data-cms-key]", ...(embedded ? ["[data-cms-image]"] : [])];
    const sel = (suffix = "") => clickable.map((c) => c + suffix).join(", ");

    const style = document.createElement("style");
    style.textContent = `
      ${sel()} { outline: 1px dashed rgba(32,108,164,.55); outline-offset: 2px; cursor: pointer; border-radius: 2px; transition: background-color .15s, outline-color .15s; }
      ${sel(":hover")} { background: rgba(32,108,164,.14); outline-color: #206ca4; }
      ${sel("[data-cms-active]")} { background: rgba(32,108,164,.22); outline: 2px solid #206ca4; }
      /* รูปมีของทับอยู่ :hover ของตัวมันเองจึงไม่เคยติด ต้องชี้เอาเองจากตำแหน่งเมาส์ */
      [data-cms-image][data-cms-hover] { outline: 2px solid #206ca4; }
    `;
    document.head.appendChild(style);

    /** ห่อข้อความที่มีเครื่องหมายให้กดได้ */
    let sweptAttributes = false;
    const wrap = () => {
      const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
      const hits: Text[] = [];
      let n: Node | null;
      while ((n = walker.nextNode())) {
        if (n.nodeValue?.includes(MARK)) hits.push(n as Text);
      }

      for (const node of hits) {
        const m = node.nodeValue!.match(
          new RegExp(`${MARK}([^${MARK}]+)${MARK}([\\s\\S]*?)${MARK}`),
        );
        if (!m) {
          node.nodeValue = node.nodeValue!.split(MARK).join("");
          continue;
        }
        const [full, key, text] = m;
        const at = node.nodeValue!.indexOf(full);
        const before = node.nodeValue!.slice(0, at);
        const after = node.nodeValue!.slice(at + full.length);

        const span = document.createElement("span");
        if (embedded) span.dataset.cmsKey = key;
        span.textContent = text;

        const frag = document.createDocumentFragment();
        if (before) frag.appendChild(document.createTextNode(before));
        frag.appendChild(span);
        if (after) frag.appendChild(document.createTextNode(after));
        node.replaceWith(frag);
      }

      /* ข้อความที่ไปอยู่ใน attribute (เช่น alt, aria-label, title) ต้องถอด
         เครื่องหมายทิ้ง กวาดเต็มรอบเดียวตอนแรก หลังจากนั้นกวาดเฉพาะตอนเจอใหม่ */
      if (sweptAttributes && hits.length === 0) return;
      sweptAttributes = true;
      for (const el of Array.from(document.querySelectorAll("*"))) {
        for (const attr of Array.from(el.attributes)) {
          if (!attr.value.includes(MARK)) continue;
          const parts = attr.value.split(MARK);
          el.setAttribute(attr.name, (parts[2] ?? parts.join("")).trim() || parts.join(""));
        }
      }
    };

    /* React จะ re-render component ฝั่ง client หลังจากนี้ แล้วเขียนทับข้อความที่
       เพิ่งถอดเครื่องหมายไป ต้องคอยตามเก็บ ไม่งั้นกุญแจโผล่ทีหลัง */
    let queued = false;
    const observer = new MutationObserver(() => {
      if (queued) return;
      queued = true;
      queueMicrotask(() => {
        queued = false;
        wrap();
      });
    });

    /* บอกหน้าจอแก้ไขว่ามีกุญแจและรูปอะไรอยู่บนหน้านี้บ้าง
       ประกาศซ้ำเมื่อ DOM เปลี่ยนด้วย เพราะ component ฝั่ง client (เช่นสไลด์
       หน้าแรก) เพิ่งเรนเดอร์รูปออกมาหลังจากรอบแรกไปแล้ว */
    let lastAnnounced = "";
    let announceTimer = 0;
    const announce = () => {
      const payload = {
        type: "cms:ready",
        keys: Array.from(document.querySelectorAll<HTMLElement>("[data-cms-key]")).map(
          (el) => el.dataset.cmsKey,
        ),
        images: Array.from(new Set(images().map((el) => el.dataset.cmsImage))),
      };
      const fingerprint = JSON.stringify(payload);
      if (fingerprint === lastAnnounced) return;
      lastAnnounced = fingerprint;
      window.parent.postMessage(payload, "*");
    };

    /**
     * รอให้ React ไฮเดรตเสร็จก่อนค่อยลงมือรื้อ DOM
     *
     * ถ้ารื้อตัดหน้า React จะพบว่า DOM ไม่ตรงกับ HTML ที่เซิร์ฟเวอร์ส่งมา แล้วทิ้ง
     * ทั้ง tree ไปเรนเดอร์ใหม่ฝั่ง client — สุดท้ายยังใช้ได้เพราะ observer ตามเก็บ
     * แต่เสียแรงเรนเดอร์ทั้งหน้าฟรีๆ และมี error ค้างตอน dev
     */
    const start = () => {
      wrap();
      observer.observe(document.body, { childList: true, subtree: true, characterData: true });
      // ประกาศหลัง wrap() เสมอ ถ้าประกาศก่อนจะได้ลิสต์กุญแจเปล่า
      if (embedded) announce();
    };

    const idle =
      typeof window.requestIdleCallback === "function"
        ? window.requestIdleCallback(start, { timeout: 100 })
        : window.setTimeout(start, 0);

    const cancelIdle = () => {
      if (typeof window.cancelIdleCallback === "function") window.cancelIdleCallback(idle);
      else window.clearTimeout(idle);
    };

    if (!embedded) {
      return () => {
        cancelIdle();
        observer.disconnect();
        style.remove();
      };
    }

    const onClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      // กันไม่ให้กดลิงก์แล้วพรีวิวหลุดออกไปหน้าอื่น
      if (target?.closest("a[href], button[type=submit]")) e.preventDefault();

      const text = target?.closest<HTMLElement>("[data-cms-key]");
      if (text) {
        e.preventDefault();
        e.stopPropagation();
        window.parent.postMessage({ type: "cms:select", key: text.dataset.cmsKey }, "*");
        return;
      }

      const image =
        target?.closest<HTMLElement>("[data-cms-image]") ?? imageAt(e.clientX, e.clientY);
      if (image) {
        e.preventDefault();
        e.stopPropagation();
        window.parent.postMessage({ type: "cms:select-image", key: image.dataset.cmsImage }, "*");
      }
    };
    document.addEventListener("click", onClick, true);

    /* ไฮไลต์รูปที่อยู่ใต้เมาส์เอง — ถ้าปล่อยให้ :hover ทำงานตามปกติ รูปที่มี
       แผ่นทับอยู่จะไม่มีวันติด hover เลย คนใช้ก็ไม่รู้ว่ากดได้ */
    let hoverFrame = 0;
    const onMove = (e: MouseEvent) => {
      if (hoverFrame) return;
      const { clientX: x, clientY: y } = e;
      hoverFrame = requestAnimationFrame(() => {
        hoverFrame = 0;
        const hit = imageAt(x, y);
        for (const el of images()) {
          if (el === hit) el.dataset.cmsHover = "1";
          else delete el.dataset.cmsHover;
        }
        document.body.style.cursor = hit ? "pointer" : "";
      });
    };
    document.addEventListener("mousemove", onMove);

    const onMessage = (e: MessageEvent) => {
      const d = e.data as { type?: string; key?: string; value?: string };
      if (d?.type === "cms:update" && d.key != null) {
        for (const el of document.querySelectorAll<HTMLElement>(
          `[data-cms-key="${CSS.escape(d.key)}"]`,
        )) {
          el.textContent = d.value ?? "";
        }
      }
      if (d?.type === "cms:update-image" && d.key != null) {
        for (const el of images()) {
          if (el.dataset.cmsImage !== d.key) continue;
          /* next/image ใส่ srcset ไว้ด้วย ถ้าไม่ล้างทิ้งเบราว์เซอร์จะยังหยิบ
             รูปเดิมจาก srcset มาแสดงต่อ ทั้งที่ src ใหม่แล้ว */
          el.srcset = "";
          el.src = d.value || d.key;
        }
      }
      if (d?.type === "cms:focus" || d?.type === "cms:focus-image") {
        if (d.key == null) return;
        for (const el of document.querySelectorAll<HTMLElement>("[data-cms-active]")) {
          delete el.dataset.cmsActive;
        }
        const el =
          d.type === "cms:focus"
            ? document.querySelector<HTMLElement>(`[data-cms-key="${CSS.escape(d.key)}"]`)
            : images().find((i) => i.dataset.cmsImage === d.key);
        if (el) {
          el.dataset.cmsActive = "1";
          el.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      }
    };
    window.addEventListener("message", onMessage);

    /* ประกาศครั้งแรกเกิดใน start() หลัง wrap() เสร็จ ที่นี่ดูแลเฉพาะรอบถัดๆ ไป */
    const reannounce = new MutationObserver(() => {
      window.clearTimeout(announceTimer);
      announceTimer = window.setTimeout(announce, 150);
    });
    reannounce.observe(document.body, { childList: true, subtree: true });

    return () => {
      cancelIdle();
      observer.disconnect();
      reannounce.disconnect();
      window.clearTimeout(announceTimer);
      cancelAnimationFrame(hoverFrame);
      document.body.style.cursor = "";
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("click", onClick, true);
      window.removeEventListener("message", onMessage);
      style.remove();
    };
  }, []);

  return null;
}
