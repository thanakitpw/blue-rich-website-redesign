import Image from "next/image";
import Link from "next/link";
import { Container, Icon } from "@/components/ui";
import { lineHref, mailHref, mapHref, nav, site, telHref } from "@/data/site";
import { categories } from "@/data/products";

export default function Footer() {
  return (
    <footer className="relative overflow-hidden bg-brand-950 text-brand-100/70">
      <div
        aria-hidden
        className="absolute inset-0 bg-[radial-gradient(50rem_26rem_at_10%_0%,var(--color-brand-800),transparent)]"
      />
      <div
        aria-hidden
        className="absolute -bottom-32 -right-20 size-96 rotate-45 rounded-[26%] border border-white/[0.06]"
      />

      <Container className="relative">
        <div className="grid gap-12 py-16 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr] lg:py-20">
          <div>
            <Image
              src="/assets/logo.png"
              alt={site.name}
              width={180}
              height={160}
              className="h-14 w-auto brightness-0 invert"
            />
            <p className="mt-5 text-sm leading-relaxed">
              {site.name}
              <br />
              ผู้จำหน่ายสีกันไฟ–สีทนไฟ สีรองพื้นกันสนิม น้ำมันสน ทินเนอร์ และผ้ากันไฟ
              พร้อมบริการรับรองงานโดยวุฒิวิศวกร
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              {["ASTM E-119", "ISO 834", "ISO 9001:2015"].map((s) => (
                <span
                  key={s}
                  className="rounded-full bg-white/[0.06] px-3 py-1.5 text-[0.7rem] font-semibold text-brand-100 ring-1 ring-inset ring-white/10"
                >
                  {s}
                </span>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-display text-sm font-semibold tracking-wide text-white">
              เมนูเว็บไซต์
            </h3>
            <ul className="mt-5 space-y-3 text-sm">
              {nav.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="transition hover:text-white">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-display text-sm font-semibold tracking-wide text-white">
              หมวดหมู่สินค้า
            </h3>
            <ul className="mt-5 space-y-3 text-sm">
              {categories.map((c) => (
                <li key={c.slug}>
                  <Link
                    href={`/products?cat=${c.slug}`}
                    className="transition hover:text-white"
                  >
                    {c.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-display text-sm font-semibold tracking-wide text-white">
              ติดต่อเรา
            </h3>
            <ul className="mt-5 space-y-4 text-sm">
              <li>
                <a href={mapHref} target="_blank" rel="noreferrer" className="flex gap-3 transition hover:text-white">
                  <Icon.pin className="mt-0.5 shrink-0 text-brand-400" />
                  <span>{site.address}</span>
                </a>
              </li>
              <li>
                <a href={telHref} className="flex gap-3 transition hover:text-white">
                  <Icon.phone className="mt-0.5 shrink-0 text-brand-400" />
                  <span>{site.phones.join(", ")}</span>
                </a>
              </li>
              <li>
                <a href={mailHref} className="flex gap-3 transition hover:text-white">
                  <Icon.mail className="mt-0.5 shrink-0 text-brand-400" />
                  <span>{site.email}</span>
                </a>
              </li>
              <li>
                <a
                  href={lineHref}
                  target="_blank"
                  rel="noreferrer"
                  className="flex gap-3 transition hover:text-white"
                >
                  <Icon.line className="mt-0.5 shrink-0 text-brand-400" />
                  <span>LINE ID : {site.lineId}</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col gap-3 border-t border-white/10 py-7 text-xs sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {site.name} · สงวนลิขสิทธิ์
          </p>
          <p className="text-brand-100/50">
            เลขที่ผู้เสียภาษี / ข้อมูลบริษัท ติดต่อฝ่ายขาย {site.phones[0]}
          </p>
        </div>
      </Container>
    </footer>
  );
}
