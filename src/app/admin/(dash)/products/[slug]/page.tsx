import { notFound } from "next/navigation";
import { getProductRow, listCategories, listProducts } from "@/lib/cms/admin";
import { listMedia } from "@/lib/cms/media";
import { ProductForm } from "@/components/admin/ProductForm";

export const dynamic = "force-dynamic";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [row, categories, media, all] = await Promise.all([
    getProductRow(slug),
    listCategories(),
    listMedia(),
    listProducts(),
  ]);
  if (!row) notFound();

  return (
    <ProductForm
      row={row}
      categories={categories}
      media={media}
      allProducts={all.map((p) => ({ slug: p.slug, name: p.name }))}
    />
  );
}
