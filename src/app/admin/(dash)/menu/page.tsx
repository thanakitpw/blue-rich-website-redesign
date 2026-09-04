import { dirtySettingKeys, getSettingDraft } from "@/lib/cms/admin";
import {
  nav as defaultNav,
  standards as defaultStandards,
  stats as defaultStats,
  type NavItem,
  type Standard,
  type Stat,
} from "@/data/site";
import { MenuForm } from "@/components/admin/MenuForm";

export const dynamic = "force-dynamic";

export default async function AdminMenuPage() {
  const [nav, standards, stats, dirty] = await Promise.all([
    getSettingDraft<NavItem[]>("nav"),
    getSettingDraft<Standard[]>("standards"),
    getSettingDraft<Stat[]>("stats"),
    dirtySettingKeys(),
  ]);

  return (
    <MenuForm
      nav={nav ?? defaultNav}
      standards={standards ?? defaultStandards}
      stats={stats ?? defaultStats}
      hasDraft={["nav", "standards", "stats"].some((k) => dirty.has(k))}
    />
  );
}
