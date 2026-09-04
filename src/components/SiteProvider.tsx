"use client";

import { createContext, useContext, useMemo } from "react";
import {
  bundleFor,
  nav as defaultNav,
  site as defaultSite,
  type NavItem,
  type SiteBundle,
  type SiteInfo,
} from "@/data/site";

/**
 * ข้อมูลบริษัทและเมนูสำหรับ client component
 *
 * ข้อมูลชุดนี้แก้ได้จากหลังบ้านแล้ว จึงอ่านจากฐานข้อมูลไม่ได้ตรงๆ ใน client
 * component — layout ฝั่งเซิร์ฟเวอร์อ่านมาแล้วส่งลงมาทาง context นี้
 *
 * ค่าเริ่มต้นของ context เป็นค่าตั้งต้นในไฟล์ ไม่ใช่ undefined เพื่อให้
 * component ที่ถูกใช้นอก provider (เช่นในเทสต์) ยังเรนเดอร์ได้ ไม่ระเบิด
 */
const Ctx = createContext<SiteBundle>(bundleFor(defaultSite, defaultNav));

export function SiteProvider({
  site,
  nav,
  children,
}: {
  site: SiteInfo;
  nav: NavItem[];
  children: React.ReactNode;
}) {
  const value = useMemo(() => bundleFor(site, nav), [site, nav]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export const useSite = () => useContext(Ctx);
