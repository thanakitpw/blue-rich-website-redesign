import { listMedia } from "@/lib/cms/media";
import { MediaLibrary } from "@/components/admin/MediaLibrary";

export const dynamic = "force-dynamic";

export default async function AdminMediaPage() {
  return <MediaLibrary items={await listMedia()} />;
}
