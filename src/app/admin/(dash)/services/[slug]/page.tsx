import { notFound } from "next/navigation";
import { getServiceRow, listProducts } from "@/lib/cms/admin";
import { listMedia } from "@/lib/cms/media";
import { ServiceForm } from "@/components/admin/ServiceForm";

export const dynamic = "force-dynamic";

export default async function EditServicePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [row, media, products] = await Promise.all([getServiceRow(slug), listMedia(), listProducts()]);
  if (!row) notFound();

  return (
    <ServiceForm
      row={row}
      media={media}
      allProducts={products.map((p) => ({ slug: p.slug, name: p.name }))}
    />
  );
}
