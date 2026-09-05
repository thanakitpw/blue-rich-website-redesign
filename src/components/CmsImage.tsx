"use client";

import NextImage, { type ImageProps } from "next/image";
import { createContext, useContext } from "react";

/**
 * ชั้นทับรูปภาพ — "รูปตั้งต้นอยู่ในโค้ด · ฐานข้อมูลทับได้"
 *
 * แนวคิดเดียวกับข้อความใน src/lib/cms/copy.ts ต่างกันที่ตัวกุญแจ
 * ข้อความใช้เส้นทางในก้อนข้อมูล (hero.title) ส่วนรูปใช้ "path เดิมของรูปนั้น" ตรงๆ
 *
 * ที่เลือก path เป็นกุญแจเพราะ
 *   · อ่านออกทั้งในฐานข้อมูลและในหลังบ้าน ไม่ต้องเปิดโค้ดดูว่าอันไหนคืออันไหน
 *   · ไม่เลื่อน — เพิ่มหรือลบรูปในหน้าแล้วรูปอื่นไม่ไปสวมกุญแจกัน
 *   · ถ้าเปลี่ยนรูปในโค้ด ค่าที่ลูกค้าเคยเลือกจะเลิกมีผลไปเอง เพราะกุญแจเดิม
 *     ไม่มีอยู่บนหน้าแล้ว จึงไม่ต้องเก็บ hash กันข้อความเพี้ยนเหมือนฝั่งข้อความ
 *
 * ผลข้างเคียงที่ตั้งใจ: รูปเดียวกันที่ใช้หลายหน้า เปลี่ยนทีเดียวเปลี่ยนพร้อมกันหมด
 */
export type ImageOverrides = Record<string, string>;

type Ctx = { overrides: ImageOverrides; preview: boolean };

const ImageContext = createContext<Ctx>({ overrides: {}, preview: false });

export function ImageOverrideProvider({
  value,
  children,
}: {
  value: Ctx;
  children: React.ReactNode;
}) {
  return <ImageContext.Provider value={value}>{children}</ImageContext.Provider>;
}

/**
 * ใช้แทน next/image เฉพาะรูปที่เป็น "งานออกแบบของหน้า" — แบนเนอร์ ภาพประกอบ โลโก้ลูกค้า
 *
 * รูปสินค้าและรูปบทความไม่ต้องใช้ตัวนี้ เพราะแก้ได้จากหน้าจอของมันเองอยู่แล้ว
 * ถ้าเอามาใช้ซ้ำจะกลายเป็นแก้รูปเดียวกันได้สองที่ แล้วงงว่าอันไหนชนะ
 */
export function CmsImage({ src, ...rest }: ImageProps) {
  const { overrides, preview } = useContext(ImageContext);

  // รูปที่ import เข้ามาเป็นไฟล์ (StaticImageData) ไม่มี path ให้อ้างอิง ปล่อยผ่าน
  if (typeof src !== "string") return <NextImage src={src} {...rest} />;

  return (
    <NextImage
      src={overrides[src] ?? src}
      {...rest}
      /* ป้ายบอกหลังบ้านว่ารูปนี้คือกุญแจไหน ติดเฉพาะตอนพรีวิว
         หน้า static ที่ผู้เข้าชมทั่วไปได้รับจึงไม่มี attribute นี้ติดไปด้วย */
      {...(preview ? { "data-cms-image": src } : {})}
    />
  );
}
