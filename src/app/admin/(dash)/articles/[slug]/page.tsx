import { notFound } from "next/navigation";
import { getArticleRow } from "@/lib/cms/admin";
import { listMedia } from "@/lib/cms/media";
import { ArticleForm } from "@/components/admin/ArticleForm";

export const dynamic = "force-dynamic";

export default async function EditArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [row, media] = await Promise.all([getArticleRow(slug), listMedia()]);
  if (!row) notFound();
  return <ArticleForm row={row} media={media} />;
}
