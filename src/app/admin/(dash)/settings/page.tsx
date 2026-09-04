import { dirtySettingKeys, getSettingDraft } from "@/lib/cms/admin";
import { site as defaultSite, type SiteInfo } from "@/data/site";
import { SettingsForm } from "@/components/admin/SettingsForm";

export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
  const [value, dirty] = await Promise.all([
    getSettingDraft<SiteInfo>("company"),
    dirtySettingKeys(),
  ]);
  return <SettingsForm value={value ?? defaultSite} hasDraft={dirty.has("company")} />;
}
