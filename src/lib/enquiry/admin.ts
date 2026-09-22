import { serverClient } from "@/lib/supabase/server";
import type { Flag } from "./screen";
import type { TurnstileResult } from "./turnstile";

/** แถวในตาราง enquiries ที่หน้าหลังบ้านอ่าน (RLS ให้เฉพาะคนที่มีแถวใน cms_users) */
export type EnquiryRow = {
  id: number;
  created_at: string;
  source: string;
  subject: string;
  fields: { label: string; value: string }[];
  ip: string | null;
  country: string | null;
  city: string | null;
  user_agent: string | null;
  turnstile: TurnstileResult;
  flags: Flag[];
  verdict: "delivered" | "dropped";
  reason: string | null;
};

export async function listEnquiries(limit = 100): Promise<EnquiryRow[]> {
  const sb = await serverClient();
  if (!sb) return [];

  const { data, error } = await sb
    .from("enquiries")
    .select(
      "id, created_at, source, subject, fields, ip, country, city, user_agent, turnstile, flags, verdict, reason",
    )
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("[enquiry] อ่านรายการไม่สำเร็จ:", error.code, error.message);
    return [];
  }
  return (data ?? []) as EnquiryRow[];
}
