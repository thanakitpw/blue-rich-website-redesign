"use server";

import { publishAllOf, type ActionResult } from "@/lib/cms/actions";
import { saveCollection } from "@/lib/cms/collection";
import type { FaqRow } from "@/lib/cms/admin";

export type FaqDraft = Pick<FaqRow, "id" | "question" | "answer">;

export async function saveFaqs(rows: FaqDraft[]): Promise<ActionResult> {
  return saveCollection(
    "faqs",
    rows,
    (r, i) => ({ question: r.question, answer: r.answer, sort_order: i }),
    { column: "page", value: "home" },
  );
}

export async function publishFaqs() {
  return publishAllOf("faq");
}
