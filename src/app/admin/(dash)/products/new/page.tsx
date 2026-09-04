import { listCategories, listProducts } from "@/lib/cms/admin";
import { listMedia } from "@/lib/cms/media";
import { ProductForm } from "@/components/admin/ProductForm";

export const dynamic = "force-dynamic";

export default async function NewProductPage() {
  const [categories, media, all] = await Promise.all([
    listCategories(),
    listMedia(),
    listProducts(),
  ]);

  return (
    <ProductForm
      row={null}
      categories={categories}
      media={media}
      allProducts={all.map((p) => ({ slug: p.slug, name: p.name }))}
    />
  );
}
