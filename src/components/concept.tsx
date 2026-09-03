import Image from "next/image";
import Link from "next/link";
import { Button, Container, Icon } from "@/components/ui";
import { lineChannels, lineHref, lineHref2, mapHref, site, standards, stats, telHref } from "@/data/site";

/* -------------------------------------------------------------------- Section
 * Concept B's `.sec` (52px band) and `.sec-shell` (the #f6f9fb ground).
 */

export function Section({
  id,
  tone = "plain",
  className = "",
  children,
}: {
  id?: string;
  tone?: "plain" | "shell" | "dark";
  className?: string;
  children: React.ReactNode;
}) {
  const tones = {
    plain: "",
    shell: "bg-slate-50",
    dark: "bg-brand-900 text-brand-100/80",
  };
  return (
    <section id={id} className={`scroll-mt-20 py-[38px] lg:py-[52px] ${tones[tone]} ${className}`}>
      <Container>{children}</Container>
    </section>
  );
}

/* --------------------------------------------------------------------- Ribbon
 * `.ribbon-box` — four claims on a sky panel with a blue hairline frame.
 */

const ribbonItems = [
  { icon: Icon.shield, title: "ผ่านมาตรฐานสากล", note: "ASTM E-119 · ISO 834" },
  { icon: Icon.doc, title: "ถูกต้องตามกฎหมาย", note: "เอกสาร น.4-5 / น.4-9" },
  { icon: Icon.truck, title: "สินค้าพร้อมส่ง", note: "มีสต็อกในไทย ส่งทั่วประเทศ" },
  { icon: Icon.users, title: "ทีมงานมืออาชีพ", note: "ดูแลตั้งแต่เลือกสีถึงส่งมอบเอกสาร" },
];

export function Ribbon() {
  return (
    <div className="grid grid-cols-1 rounded-3xl border-[1.5px] border-brand-200 bg-brand-50 min-[430px]:grid-cols-2 lg:grid-cols-4">
      {ribbonItems.map((r, i) => (
        <div
          key={r.title}
          className={`flex items-center gap-3 px-5 py-[18px] ${
            i > 0 ? "border-t border-brand-200/60 lg:border-t-0 lg:border-l" : ""
          } ${i === 1 ? "min-[430px]:border-t-0 min-[430px]:border-l lg:border-t-0" : ""} ${
            i === 3 ? "min-[430px]:border-l" : ""
          }`}
        >
          <span className="size-[34px] shrink-0 text-brand-500">
            <r.icon className="size-full" />
          </span>
          <span>
            <b className="block text-[15.5px] leading-[1.4] font-medium text-brand-700">
              {r.title}
            </b>
            <span className="text-[13.5px] text-slate-500">{r.note}</span>
          </span>
        </div>
      ))}
    </div>
  );
}

/* ----------------------------------------------------------------- ValueBlock
 * `.value` — quote glyph, big italic English lead, checklist and photo.
 */

export function ValueBlock({
  lead1 = "Protect your",
  lead2Plain = "Steel ",
  lead2Accent = "Structure",
  note = "ปกป้องโครงสร้างเหล็กให้คงรูปได้นานขึ้นตามอัตราการทนไฟที่ออกแบบไว้",
  points,
  image = "/assets/value-steel-structure.jpg",
}: {
  lead1?: string;
  lead2Plain?: string;
  lead2Accent?: string;
  note?: string;
  points: string[];
  image?: string;
}) {
  return (
    <div className="grid items-center gap-8 lg:grid-cols-[1fr_1.15fr] lg:gap-11">
      <div>
        <Icon.quote className="block text-accent-500" />
        <div className="mt-3.5 mb-1.5 leading-[1.2] font-semibold">
          <span className="eyebrow-en block text-[16px] tracking-[0.1em] text-accent-500">
            {lead1}
          </span>
          <span className="eyebrow-en block text-[clamp(24px,3vw,34px)] tracking-[0.02em] text-brand-500">
            {lead2Plain}
            <em className="text-brand-700 italic">{lead2Accent}</em>
          </span>
        </div>
        <p className="mb-[18px] text-[14.5px] text-slate-500">{note}</p>
        <ul>
          {points.map((p) => (
            <li
              key={p}
              className="mb-[9px] flex items-center gap-3 rounded-[10px] bg-slate-50 px-3.5 py-2.5"
            >
              <span className="grid size-[30px] shrink-0 place-items-center rounded-full bg-brand-600 text-white">
                <Icon.check className="size-[15px]" />
              </span>
              <span className="text-sm text-brand-800">{p}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="relative aspect-16/10 overflow-hidden rounded-3xl border border-slate-200 bg-brand-800">
        <Image
          src={image}
          alt=""
          fill
          sizes="(min-width: 1024px) 55vw, 92vw"
          className="object-cover"
        />
      </div>
    </div>
  );
}

/* -------------------------------------------------------------- StandardsBand
 * `.trusted` — italic pull-quote over the shell ground, then the chip row.
 */

export function StandardsBand() {
  return (
    <div className="text-center">
      <p className="text-[clamp(16px,2vw,21px)] leading-[1.55] font-medium text-brand-700 italic">
        “{site.shortName} Material Products
        <br />
        วัสดุกันไฟที่ผ่านการทดสอบและรับรองตามมาตรฐานที่กฎหมายกำหนด”
      </p>
      <div className="mt-6 flex flex-wrap justify-center gap-3.5">
        {standards.map((s) => (
          <div
            key={s.label}
            className="min-w-[170px] rounded-2xl border border-slate-200 bg-white px-[22px] py-3.5 shadow-[0_2px_10px_rgba(42,80,104,0.04)]"
          >
            <b className="block text-[16px] font-semibold text-brand-600">{s.label}</b>
            <span className="text-xs text-slate-500">{s.note}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ WorksGrid
 * A plain, even grid rather than a masonry. The project photography is only
 * 474×264, so a masonry with double-width tiles upscaled it and looked soft.
 * Every tile is now one column at 16:9 — the source's own ratio — which means
 * no crop and no upscale at any breakpoint.
 */

export function WorksGrid({
  items,
}: {
  items: { image: string; title: string; scope?: string }[];
}) {
  return (
    <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-3 lg:grid-cols-4">
      {items.map((p) => (
        <Link
          key={p.image}
          href="/projects"
          className="group relative aspect-16/9 overflow-hidden rounded-2xl bg-slate-100"
        >
          <Image
            src={p.image}
            alt={p.title}
            fill
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.06]"
          />
          <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-brand-900/90 to-transparent px-3 pt-8 pb-2.5 text-[13px] leading-snug font-medium text-white opacity-0 transition group-hover:opacity-100">
            {p.title}
          </span>
        </Link>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ AboutBand
 * `.about` — image bleeding off the left edge with the circular One Stop
 * Service stamp, copy and stat row on the right.
 */

export function AboutBand() {
  return (
    <section id="about" className="overflow-x-clip py-[38px] lg:py-[52px]">
      <div className="mx-auto grid w-full max-w-[1180px] items-center gap-7 px-5 lg:grid-cols-[0.92fr_1.08fr] lg:gap-13">
        <div className="bleed-left relative aspect-16/9 overflow-hidden rounded-3xl lg:aspect-16/11 lg:rounded-l-none">
          <Image
            src="/assets/products/neocoat-paint-w-warehouse.webp"
            alt="คลังสินค้า Blue Rich Material Products"
            fill
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-cover"
          />
          <span
            aria-hidden
            className="absolute inset-0 bg-gradient-to-r from-brand-800/55 to-brand-800/10"
          />
          <span className="absolute right-[22px] bottom-[22px] z-2 grid size-[120px] place-items-center rounded-full bg-gradient-to-br from-accent-500 to-brand-500 shadow-[0_10px_26px_rgba(32,64,79,0.35)]">
            <span className="grid size-[98px] place-content-center rounded-full bg-white p-1.5 text-center leading-[1.1]">
              <b className="block text-3xl font-bold text-brand-700">1</b>
              <span className="mt-px block text-[9.5px] font-semibold tracking-[0.07em] text-accent-500 uppercase">
                One Stop Service
              </span>
            </span>
          </span>
        </div>

        <div>
          <div className="eyebrow-en text-[14px] text-brand-200">Blue Rich Material Products</div>
          <h2 className="text-[clamp(22px,2.6vw,30px)] font-bold tracking-[0.02em] italic">
            BY <em className="text-accent-500 italic">BLUE RICH</em>
          </h2>
          <p className="my-3 max-w-[640px] text-sm text-slate-500">
            จำหน่ายวัสดุป้องกันอัคคีภัยครบวงจร ทั้งสีกันไฟ Neocoat Intumescent Paint
            สีรองพื้นกันสนิม ผ้ากันไฟ ทินเนอร์และน้ำมันสน
            พร้อมบริการจัดทำเอกสารรับรองงานสีกันไฟโดยวุฒิวิศวกรโยธา
            ตามกฎกระทรวงกำหนดการออกแบบโครงสร้างอาคาร พ.ศ. 2567 — ดูแลตั้งแต่เลือกระบบสี
            คำนวณความหนาฟิล์ม จนถึงส่งมอบเอกสารให้ผ่านการตรวจ
          </p>
          <div className="mb-[22px] flex flex-wrap gap-x-6 gap-y-3">
            {stats.map((s) => (
              <div key={s.label}>
                <b className="block text-2xl leading-[1.1] font-bold text-brand-600">{s.value}</b>
                <span className="text-[13.5px] text-slate-500">{s.label}</span>
              </div>
            ))}
          </div>
          <Button href="/about" variant="ghost">
            เกี่ยวกับเรา
            <Icon.arrow />
          </Button>
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------- LineCta
 * `.linecta` — accent italic heading, phone list, and the LINE phone mockup.
 */

export function LineCta() {
  return (
    <div className="grid items-center gap-7 lg:grid-cols-2 lg:gap-10">
      <div>
        <div className="flex items-center gap-3.5">
          <h2 className="text-[clamp(22px,2.6vw,30px)] font-bold text-accent-500 italic">
            สนใจสั่งซื้อ
          </h2>
          <span className="h-0.5 max-w-[110px] flex-1 bg-accent-500/50" />
        </div>
        <p className="mt-1 mb-5 text-[15.5px] text-slate-500">
          หรือสอบถามรายละเอียดเพิ่มเติม ทีมงานยินดีช่วยเลือกระบบสีให้ตรงกับอัตราการทนไฟที่โครงการต้องการ
        </p>

        <Button href={lineHref} variant="line">
          <Icon.line className="size-[18px]" />
          เพิ่มเพื่อนทาง LINE · @{site.lineId}
        </Button>

        <div className="mt-4.5 flex flex-col gap-2.5">
          {site.phones.slice(0, 2).map((phone) => (
            <a
              key={phone}
              href={`tel:${phone.replace(/-/g, "")}`}
              className="flex items-center gap-[11px] text-xl font-semibold text-brand-700 transition hover:text-accent-500"
            >
              <span className="grid size-8 shrink-0 place-items-center rounded-full bg-accent-500 text-white">
                <Icon.phone className="size-[15px]" />
              </span>
              {phone}
            </a>
          ))}
        </div>

        <a
          href={mapHref}
          target="_blank"
          rel="noreferrer"
          className="mt-4 flex gap-2.5 text-[14px] text-slate-500 transition hover:text-brand-600"
        >
          <Icon.pin className="mt-1 size-4 shrink-0 text-accent-500" />
          {site.address}
        </a>
      </div>

      {/* phone mockup */}
      <div className="w-[230px] justify-self-center rounded-[32px] bg-[#12181d] p-2.5 shadow-[0_18px_40px_rgba(32,64,79,0.24)]">
        <div className="relative overflow-hidden rounded-3xl bg-white px-[18px] pt-[22px] pb-[26px] text-center">
          <span className="absolute top-0 left-1/2 h-4 w-[74px] -translate-x-1/2 rounded-b-xl bg-[#12181d]" />
          <div className="mt-3.5 text-[18px] font-semibold text-[#06C755]">แอดไลน์เลย</div>
          <div className="mx-auto mt-3.5 mb-2.5 grid size-[62px] place-items-center rounded-[18px] bg-[#06C755]">
            <Icon.line className="size-[34px] text-white" />
          </div>
          <div className="text-[22px] font-bold tracking-[0.02em] text-brand-700">
            @{site.lineId}
          </div>
          <div className="mt-0.5 text-xs text-slate-500">LINE Official Account</div>
          <Button href={lineHref} variant="line" size="sm" className="mt-3.5 w-full">
            เพิ่มเพื่อน @{site.lineId}
          </Button>
          <Button href={lineHref2} variant="line" size="sm" className="mt-2 w-full">
            เพิ่มเพื่อน ช่องทางที่ 2
          </Button>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------------ Faq
 * `details.qa` — pale frame that turns accent blue when open, with the
 * accent +/− toggle.
 */

export function Faq({
  items,
  openFirst = false,
}: {
  items: { q: string; a: string }[];
  openFirst?: boolean;
}) {
  return (
    <div>
      {items.map((f, i) => (
        <details
          key={f.q}
          open={openFirst && i === 0}
          className="group mb-[11px] overflow-hidden rounded-[10px] border-[1.5px] border-brand-200 bg-white open:border-accent-500"
        >
          <summary className="relative cursor-pointer list-none py-[13px] pr-[46px] pl-[17px] text-[15.5px] leading-[1.5] text-brand-700 marker:content-none">
            {f.q}
            <span className="absolute top-1/2 right-3.5 grid size-5 -translate-y-1/2 place-items-center rounded-full bg-accent-500 text-white transition group-open:rotate-180">
              <svg viewBox="0 0 20 20" className="size-[11px]" fill="none" aria-hidden>
                <path d="M4 10h12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                <path
                  d="M10 4v12"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  className="group-open:hidden"
                />
              </svg>
            </span>
          </summary>
          <div className="border-t border-slate-100 px-[18px] pt-[13px] pb-[15px] text-[14.5px] leading-[1.8] text-slate-500">
            {f.a}
          </div>
        </details>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------- QuoteCta
 * The closing band used at the bottom of the inner pages.
 */

export function CtaBand({
  title = "สนใจสั่งซื้อ หรือขอใบเสนอราคา",
  description = "ส่งแบบโครงสร้างหรือรายการ BOQ มาให้ทีมวิศวกรประเมิน เราจะคำนวณปริมาณสี ความหนาฟิล์ม และสรุปราคาให้ภายใน 1–2 วันทำการ",
}: {
  title?: string;
  description?: string;
}) {
  return (
    <section className="py-[38px] lg:py-[52px]">
      <Container>
        <div className="relative overflow-hidden rounded-4xl bg-brand-900 px-6 py-11 text-center sm:px-12">
          <span
            aria-hidden
            className="absolute inset-0 bg-[radial-gradient(38rem_18rem_at_50%_0%,var(--color-brand-700),transparent_70%)]"
          />
          <div className="relative mx-auto max-w-2xl">
            <h2 className="text-[clamp(21px,2.6vw,30px)] leading-snug text-white">{title}</h2>
            <p className="mt-3.5 text-sm leading-relaxed text-brand-100/75">{description}</p>
            <div className="mt-7 flex flex-wrap justify-center gap-2.5">
              <Button href={telHref} variant="accent" size="lg">
                <Icon.phone />
                โทร {site.phones[0]}
              </Button>
              {lineChannels.map((c, i) => (
                <Button key={c.href} href={c.href} variant="line" size="lg">
                  <Icon.line />
                  {c.label ? `แอดไลน์ ${c.label}` : `แอดไลน์ ช่องทางที่ ${i + 1}`}
                </Button>
              ))}
              <Button href="/contact" variant="outline" size="lg">
                ส่งข้อความถึงเรา
                <Icon.arrow />
              </Button>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
