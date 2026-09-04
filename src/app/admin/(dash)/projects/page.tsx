import { listProjects } from "@/lib/cms/admin";
import { listMedia } from "@/lib/cms/media";
import { ProjectsForm } from "@/components/admin/ProjectsForm";

export const dynamic = "force-dynamic";

export default async function AdminProjectsPage() {
  const [rows, media] = await Promise.all([listProjects(), listMedia()]);
  return <ProjectsForm rows={rows} media={media} />;
}
