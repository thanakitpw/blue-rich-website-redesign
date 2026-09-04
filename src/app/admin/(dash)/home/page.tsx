import { dirtySettingKeys, getSettingDraft, listProducts } from "@/lib/cms/admin";
import { listMedia } from "@/lib/cms/media";
import type { HomeShowcase, LegalInfo } from "@/lib/cms/content";
import type { Step } from "@/data/products";
import {
  bestSellerSlugs,
  categoryTiles,
  flagshipSlug,
  valuePoints,
} from "@/data/home";
import { installationSteps, legalInfo } from "@/data/products";
import { HomeForm } from "@/components/admin/HomeForm";

export const dynamic = "force-dynamic";

export default async function AdminHomePage() {
  const [showcase, steps, legal, media, products, dirty] = await Promise.all([
    getSettingDraft<HomeShowcase>("home_showcase"),
    getSettingDraft<Step[]>("installation_steps"),
    getSettingDraft<LegalInfo>("legal_info"),
    listMedia(),
    listProducts(),
    dirtySettingKeys(),
  ]);

  return (
    <HomeForm
      showcase={showcase ?? { flagshipSlug, bestSellerSlugs, categoryTiles, valuePoints }}
      installationSteps={steps ?? installationSteps}
      legalInfo={legal ?? legalInfo}
      media={media}
      products={products.map((p) => ({ slug: p.slug, name: p.name }))}
      hasDraft={["home_showcase", "installation_steps", "legal_info"].some((k) => dirty.has(k))}
    />
  );
}
