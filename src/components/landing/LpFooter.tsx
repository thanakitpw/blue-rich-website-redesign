import { CmsImage } from "@/components/CmsImage";
import { Icon } from "@/components/ui";
import { Wrap } from "@/components/landing/kit";
import { bundleFor } from "@/data/site";
import { getSiteInfo, getStandards } from "@/lib/cms/content";

/**
 * Landing-page footer. Contact details only — no navigation back into the main
 * site, so paid traffic keeps its one path to a CTA. `note` carries the
 * per-page disclaimer (legal summaries, spec caveats).
 */
export default async function LpFooter({ note }: { note?: string }) {
  const [info, standards] = await Promise.all([getSiteInfo(), getStandards()]);
  const { site, mailHref, mapHref, lineHref, lineHref2 } = bundleFor(info, []);
  return (
    <footer className="bg-brand-950 pt-14 pb-28 text-brand-100/70 lg:pb-14">
      <Wrap>
        <div className="grid gap-8 border-t border-white/10 pt-10 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <div className="flex items-center gap-3">
              <CmsImage src="/assets/logo.png" alt="" width={160} height={142} className="h-11 w-auto" />
              <span className="leading-tight">
                <span className="block font-display text-[1.02rem] font-bold text-white">
                  BLUE RICH
                </span>
                <span className="block text-[0.62rem] font-semibold tracking-[0.18em] text-brand-400">
                  MATERIAL PRODUCTS
                </span>
              </span>
            </div>
            <p className="mt-5 text-sm leading-relaxed">{site.name}</p>
            <p className="mt-3 text-sm leading-relaxed">{site.address}</p>
          </div>

          <div className="text-sm">
            <p className="font-display font-semibold text-white">ติดต่อเรา</p>
            <ul className="mt-4 grid gap-2.5">
              {site.phones.map((p) => (
                <li key={p}>
                  <a
                    href={`tel:${p.replace(/-/g, "")}`}
                    className="flex items-center gap-2 transition hover:text-white"
                  >
                    <Icon.phone className="size-3.5" />
                    {p}
                  </a>
                </li>
              ))}
              <li>
                <a href={mailHref} className="flex items-center gap-2 transition hover:text-white">
                  <Icon.mail className="size-3.5" />
                  {site.email}
                </a>
              </li>
              <li>
                <a
                  href={lineHref}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 transition hover:text-white"
                >
                  <Icon.line className="size-3.5" />
                  LINE : {site.lineId}
                </a>
                <a
                  href={lineHref2}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 transition hover:text-white"
                >
                  <Icon.line className="size-3.5" />
                  LINE ช่องทางที่ 2
                </a>
              </li>
              <li>
                <a
                  href={mapHref}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 transition hover:text-white"
                >
                  <Icon.pin className="size-3.5" />
                  ดูแผนที่
                </a>
              </li>
            </ul>
          </div>

          <div className="text-sm">
            <p className="font-display font-semibold text-white">มาตรฐานที่อ้างอิง</p>
            <ul className="mt-4 grid gap-2.5">
              {standards.map((s) => (
                <li key={s.label} className="flex items-start gap-2">
                  <Icon.shield className="mt-0.5 size-3.5 shrink-0 text-brand-400" />
                  <span>
                    <span className="block text-brand-100/90">{s.label}</span>
                    <span className="block text-xs text-brand-200/50">{s.note}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <p className="mt-10 border-t border-white/10 pt-6 text-xs leading-relaxed text-brand-200/50">
          © {new Date().getFullYear()} {site.name} — สงวนลิขสิทธิ์{note ? ` · ${note}` : ""}
        </p>
      </Wrap>
    </footer>
  );
}
