"use client";

import { createBrowserClient } from "@supabase/ssr";
import { cmsConfigured, supabaseAnonKey, supabaseUrl } from "./config";

/** ใช้เฉพาะหน้าเข้าสู่ระบบ ปุ่มออกจากระบบ และการอัปโหลดรูปเข้า Storage */
export const browserClient = () =>
  cmsConfigured ? createBrowserClient(supabaseUrl, supabaseAnonKey) : null;
