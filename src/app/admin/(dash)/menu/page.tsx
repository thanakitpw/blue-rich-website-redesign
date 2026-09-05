import { dirtySettingKeys, getSettingDraft } from "@/lib/cms/admin";
import {
  nav as defaultNav,
  standards as defaultStandards,
  stats as defaultStats,
  type NavItem,
  type Standard,
  type Stat,
} from "@/data/site";
import { listMedia } from "@/lib/cms/media";
import { MenuForm } from "@/components/admin/MenuForm";

export const dynamic = "force-dynamic";

export default async function AdminMenuPage() {
  const [nav, standards, stats, media, dirty] = await Promise.all([
    getSettingDraft<NavItem[]>("nav"),
    getSettingDraft<Standard[]>("standards"),
    getSettingDraft<Stat[]>("stats"),
    listMedia(),
    dirtySettingKeys(),
  ]);

  return (
    <MenuForm
      nav={nav ?? defaultNav}
      standards={standards ?? defaultStandards}
      stats={stats ?? defaultStats}
      media={media}
      hasDraft={["nav", "standards", "stats"].some((k) => dirty.has(k))}
    />
  );
}
