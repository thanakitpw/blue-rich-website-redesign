import { listFaqs } from "@/lib/cms/admin";
import { FaqsForm } from "@/components/admin/FaqsForm";

export const dynamic = "force-dynamic";

export default async function AdminFaqsPage() {
  return <FaqsForm rows={await listFaqs("home")} />;
}
