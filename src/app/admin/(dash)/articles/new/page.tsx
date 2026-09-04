import { listMedia } from "@/lib/cms/media";
import { ArticleForm } from "@/components/admin/ArticleForm";

export const dynamic = "force-dynamic";

export default async function NewArticlePage() {
  return <ArticleForm row={null} media={await listMedia()} />;
}
