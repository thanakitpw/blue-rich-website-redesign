"use server";

import { publishAllOf, type ActionResult } from "@/lib/cms/actions";
import { saveCollection } from "@/lib/cms/collection";
import type { ProjectRow } from "@/lib/cms/admin";

export type ProjectDraft = Pick<ProjectRow, "id" | "image" | "title" | "scope" | "span">;

export async function saveProjects(rows: ProjectDraft[]): Promise<ActionResult> {
  return saveCollection("projects", rows, (r, i) => ({
    image: r.image,
    title: r.title,
    scope: r.scope,
    span: r.span,
    sort_order: i,
  }));
}

export async function publishProjects() {
  return publishAllOf("project");
}
