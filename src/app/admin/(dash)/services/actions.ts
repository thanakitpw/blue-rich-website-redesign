"use server";

import type { ServiceRow } from "@/lib/cms/admin";
import { publishEntity, withCms, type ActionResult } from "@/lib/cms/actions";

export type ServiceDraft = Omit<ServiceRow, "id" | "has_draft" | "updated_at" | "sort_order">;

export async function saveService(slug: string, draft: ServiceDraft): Promise<ActionResult> {
  const res = await withCms(async (sb, userId) => {
    const { error } = await sb
      .from("services")
      .update({ ...draft, updated_by: userId })
      .eq("slug", slug);
    if (error) return { ok: false as const, error: error.message };
    return { ok: true as const };
  });
  return res as ActionResult;
}

export async function publishService(slug: string) {
  return publishEntity("service", slug);
}
