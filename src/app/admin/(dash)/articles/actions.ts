"use server";

import { redirect } from "next/navigation";
import type { ArticleRow } from "@/lib/cms/admin";
import {
  publishAllOf,
  publishEntity,
  revalidateSite,
  withCms,
  type ActionResult,
} from "@/lib/cms/actions";

export type ArticleDraft = Omit<ArticleRow, "id" | "has_draft" | "published_at" | "updated_at">;

export async function saveArticle(slug: string, draft: ArticleDraft): Promise<ActionResult> {
  const res = await withCms(async (sb, userId) => {
    const { error } = await sb
      .from("articles")
      .update({ ...draft, updated_by: userId })
      .eq("slug", slug);
    if (error) return { ok: false as const, error: error.message };
    if (draft.slug !== slug) revalidateSite();
    return { ok: true as const };
  });
  return res as ActionResult;
}

export async function createArticle(draft: ArticleDraft): Promise<ActionResult> {
  const res = await withCms(async (sb, userId) => {
    const { error } = await sb.from("articles").insert({ ...draft, updated_by: userId });
    if (error) {
      return {
        ok: false as const,
        error: error.code === "23505" ? "มีบทความที่ใช้ slug นี้อยู่แล้ว" : error.message,
      };
    }
    return { ok: true as const };
  });
  return res as ActionResult;
}

export async function publishArticle(slug: string) {
  return publishEntity("article", slug);
}

export async function publishAllArticles() {
  return publishAllOf("article");
}

export async function deleteArticle(slug: string): Promise<ActionResult> {
  const res = await withCms(async (sb) => {
    const { error } = await sb.from("articles").delete().eq("slug", slug);
    if (error) return { ok: false as const, error: error.message };
    revalidateSite();
    return { ok: true as const };
  });
  if ((res as ActionResult).ok) redirect("/admin/articles");
  return res as ActionResult;
}
