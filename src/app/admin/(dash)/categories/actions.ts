"use server";

import { publishAllOf, type ActionResult } from "@/lib/cms/actions";
import { saveCollection } from "@/lib/cms/collection";
import type { CategoryRow } from "@/lib/cms/admin";

export type CategoryDraft = Pick<
  CategoryRow,
  "id" | "slug" | "name" | "short" | "description" | "image"
>;

export async function saveCategories(rows: CategoryDraft[]): Promise<ActionResult> {
  return saveCollection("categories", rows, (r, i) => ({
    slug: r.slug,
    name: r.name,
    short: r.short,
    description: r.description,
    image: r.image,
    sort_order: i,
  }));
}

export async function publishCategories() {
  return publishAllOf("category");
}
