import { CmsImage } from "@/components/CmsImage";
import Link from "next/link";
import { Button, Container, Icon } from "@/components/ui";
import { bundleFor } from "@/data/site";
import { getNav, getSiteInfo } from "@/lib/cms/content";

/** Items 2–5 of the menu carry children; 6–9 are the plain company pages. */


/** Concept B's footer: charcoal ground, white logo tile, orange row icons. */
export default async function Footer() {
  const [info, navItems] = await Promise.all([getSiteInfo(), getNav()]);
  const { site, nav, telHref, mailHref, mapHref, lineChannels } = bundleFor(info, navItems);
  const sections = nav.filter((i) => i.children);
  const pages = nav.filter((i) => !i.children && i.href !== "/");

  return (
    <footer className="mt-2.5 bg-[#12181d] text-[#c6d2db]">
      <Container>
        <div className="grid gap-8 py-11 sm:grid-cols-2 lg:grid-cols-[190px_1.3fr_1fr_1fr] lg:gap-8">
          <div>
            <span className="inline-block rounded-[10px] bg-white p-3">
              <CmsImage
                src="/assets/logo-flat.jpg"
                alt={site.name}
                width={180}
                height={160}
                className="h-11 w-auto"
              />
            </span>
          </div>

          <div>
            <div className="mb-3 text-[15.5px] font-medium text-white">{site.name}</div>
            <a
              href={mapHref}
              target="_blank"
              rel="noreferrer"
              className="mb-3 flex gap-2.5 text-[14px] leading-[1.75] transition hover:text-white"
            >
              <Icon.pin className="mt-[5px] size-[15px] shrink-0 text-accent-500" />
              <span>{site.address}</span>
            </a>
            <a href={telHref} className="mb-3 flex gap-2.5 text-[14px] leading-[1.75] transition hover:text-white">
              <Icon.phone className="mt-[5px] size-[15px] shrink-0 text-accent-500" />
              <span>
                <b className="text-[14px] font-semibold text-white">เบอร์ติดต่อ</b>
                <br />
                {site.phones.join(" · ")}
              </span>
            </a>
            <a href={mailHref} className="flex gap-2.5 text-[14px] leading-[1.75] transition hover:text-white">
              <Icon.mail className="mt-[5px] size-[15px] shrink-0 text-accent-500" />
              <span>
                <b className="text-[14px] font-semibold text-white">อีเมล</b>
                <br />
                {site.email}
              </span>
            </a>
            <div className="mt-3 flex gap-2.5 text-[14px] leading-[1.75]">
              <Icon.line className="mt-[5px] size-[15px] shrink-0 text-accent-500" />
              <span>
                <b className="text-[14px] font-semibold text-white">LINE</b>
                <br />
                {lineChannels.map((c, i) => (
                  <a
                    key={c.href}
                    href={c.href}
                    target="_blank"
                    rel="noreferrer"
                    className="transition hover:text-white"
                  >
                    {i > 0 && " · "}
                    {c.label ?? `ช่องทางที่ ${i + 1}`}
                  </a>
                ))}
              </span>
            </div>
          </div>

          <div>
            <div className="mb-3 text-[15.5px] font-medium text-white">สินค้าและบริการ</div>
            <ul className="text-[14px]">
              {sections.map((section) => (
                <li key={section.href} className="mb-2">
                  <Link href={section.href} className="transition hover:text-accent-500">
                    {section.label}
                  </Link>
                  <ul className="mt-1.5 ml-3 border-l border-white/10 pl-3 text-[13.5px] text-[#93a3af]">
                    {section.children?.map((child) => (
                      <li key={child.href} className="mb-1.5">
                        <Link href={child.href} className="transition hover:text-accent-500">
                          {child.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <div className="mb-3 text-[15.5px] font-medium text-white">บริษัท</div>
            <ul className="mb-5 text-[14px]">
              {pages.map((item) => (
                <li key={item.href} className="mb-2">
                  <Link href={item.href} className="transition hover:text-accent-500">
                    {item.label}
                  </Link>
                </li>
              ))}
              <li className="mb-2">
                <Link href="/products" className="transition hover:text-accent-500">
                  สินค้าทั้งหมด
                </Link>
              </li>
            </ul>

            <Button href="/contact" variant="accent" size="sm">
              <Icon.doc className="size-[15px]" />
              ขอใบเสนอราคา
            </Button>

            <div className="mt-3.5 flex gap-2.5">
              <a
                href="https://www.facebook.com/"
                target="_blank"
                rel="noreferrer"
                aria-label="Facebook"
                className="grid size-8 place-items-center rounded-full bg-white/10 text-white transition hover:bg-accent-500"
              >
                <Icon.facebook className="size-[15px]" />
              </a>
              {lineChannels.map((c) => (
                <a
                  key={c.href}
                  href={c.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={c.aria}
                  className="grid size-8 place-items-center rounded-full bg-white/10 text-white transition hover:bg-accent-500"
                >
                  <Icon.line className="size-[15px]" />
                </a>
              ))}
            </div>

            <p className="mt-3.5 text-[13.5px] text-[#8a9aa7]">
              เวลาทำการ
              <br />
              {site.hours}
            </p>
          </div>
        </div>
      </Container>

      <div className="border-t border-white/[0.09] py-4 text-center text-xs text-[#8a9aa7]">
        Copyright © {new Date().getFullYear()} {site.nameEn} — All rights reserved.
      </div>
    </footer>
  );
}
