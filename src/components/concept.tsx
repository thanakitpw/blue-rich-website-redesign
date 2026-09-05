import Image from "next/image";
import { CmsImage } from "@/components/CmsImage";
import Link from "next/link";
import { Button, Container, Icon } from "@/components/ui";
import type { ClientLogo } from "@/data/home";
import type * as HomeCopy from "@/data/pages/home";
import { bundleFor } from "@/data/site";
import { getSiteInfo, getStandards, getStats } from "@/lib/cms/content";

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

/* ไอคอนสี่ใบของริบบิ้น — ข้อความมาจากไฟล์ข้อความหน้าแรก จับคู่กันด้วยลำดับ */
const ribbonIcons = [Icon.shield, Icon.doc, Icon.truck, Icon.users];

export function Ribbon({ items }: { items: { title: string; note: string }[] }) {
  return (
    <div className="grid grid-cols-1 rounded-3xl border-[1.5px] border-brand-200 bg-brand-50 min-[430px]:grid-cols-2 lg:grid-cols-4">
      {items.map((r, i) => (
        <div
          key={r.title}
          className={`flex items-center gap-3 px-5 py-[18px] ${
            i > 0 ? "border-t border-brand-200/60 lg:border-t-0 lg:border-l" : ""
          } ${i === 1 ? "min-[430px]:border-t-0 min-[430px]:border-l lg:border-t-0" : ""} ${
            i === 3 ? "min-[430px]:border-l" : ""
          }`}
        >
          <span className="size-[34px] shrink-0 text-brand-500">
            {(() => {
              const RibbonIcon = ribbonIcons[i] ?? Icon.shield;
              return <RibbonIcon className="size-full" />;
            })()}
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
        <CmsImage
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
 * คำโปรยตัวเอียง แล้วตามด้วยการ์ดหนึ่งใบต่อหนึ่งมาตรฐาน กดเข้าไปอ่านต่อได้ที่
 * หน้า /standards โดยกระโดดไปที่บล็อกของมาตรฐานนั้นเลย
 */

export async function StandardsBand({ quote }: { quote: typeof HomeCopy.standardsQuote }) {
  const [site, standards] = await Promise.all([getSiteInfo(), getStandards()]);
  return (
    <div className="text-center">
      <p className="text-[clamp(16px,2vw,21px)] leading-[1.55] font-medium text-brand-700 italic">
        “{site.shortName} {quote.line1}
        <br />
        {quote.line2}”
      </p>

      {/* สี่ใบพอดีสองแถวบนจอกลาง และแถวเดียวบนจอคอม — ถ้าเพิ่มมาตรฐานอีกใบ
          ในหลังบ้าน ใบที่ห้าจะไปขึ้นแถวใหม่เอง ไม่ต้องแก้โค้ด */}
      <div className="mt-7 grid gap-4 text-left sm:grid-cols-2 lg:grid-cols-4">
        {standards.map((s) => (
          <Link
            key={s.slug || s.label}
            href={`/standards#${s.slug}`}
            className="group flex flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white transition hover:border-brand-300 hover:shadow-[0_10px_30px_rgba(42,80,104,0.08)]"
          >
            {/* กรอบ 5:7 — สัดส่วนกระดาษ A4 พอดี เอกสารจึงเต็มการ์ดโดยไม่เหลือขอบขาว
                การ์ดสูงขึ้นแทนที่จะย่อรูปให้เล็กลง ตามที่ลูกค้าสั่ง
                ใบที่เป็นรูปถ่ายก็ครอบเต็มกรอบเหมือนกัน แถวจึงยังสูงเท่ากันทุกใบ */}
            <span className="relative block aspect-5/7 overflow-hidden bg-white">
              {s.image && (
                <Image
                  src={s.image}
                  alt=""
                  fill
                  sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 92vw"
                  className="object-cover transition-transform duration-[600ms] group-hover:scale-[1.03]"
                />
              )}
            </span>
            <span className="flex flex-1 flex-col px-5 py-[18px]">
              <b className="block text-[16px] font-semibold text-brand-600">{s.label}</b>
              <span className="mt-0.5 block flex-1 text-xs text-slate-500">{s.note}</span>
              <span className="mt-3 inline-flex items-center gap-1.5 text-[13px] font-semibold text-accent-500 transition group-hover:gap-2.5">
                ดูรายละเอียด
                <Icon.arrow />
              </span>
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------- ClientLogos
 * โลโก้ลูกค้า สองแถว แถวละห้าช่องบนจอใหญ่ ย่อลงเหลือสามและสองช่องบนจอเล็ก
 * ช่องที่ยังไม่มีโลโก้ (image ว่าง) ขึ้นเป็นกรอบเส้นประไว้ให้เห็นว่าจองที่ไว้
 */

export function ClientLogos({ items }: { items: ClientLogo[] }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5 lg:gap-4">
      {items.map((c, i) =>
        c.image ? (
          <div
            key={c.image}
            className="group flex flex-col items-center justify-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-5"
          >
            <span className="relative block h-11 w-full sm:h-[52px]">
              <Image
                src={c.image}
                alt={c.name}
                fill
                sizes="(min-width: 1024px) 180px, (min-width: 640px) 30vw, 45vw"
                className="object-contain opacity-80 grayscale transition duration-300 group-hover:opacity-100 group-hover:grayscale-0"
              />
            </span>
            <span className="text-center text-[12.5px] leading-tight text-slate-500">{c.name}</span>
          </div>
        ) : (
          <div
            key={`placeholder-${i}`}
            className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-slate-300 px-4 py-5"
            aria-hidden
          >
            <span className="block h-11 sm:h-[52px]" />
            <span className="text-center text-[12.5px] leading-tight text-slate-400">
              รอโลโก้เพิ่ม
            </span>
          </div>
        ),
      )}
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
 * `.about` — รูปกินขอบซ้ายออกนอกจอ มีป้ายโลโก้กับชื่อบริษัทวางทับมุมขวาล่าง
 * ข้อความและแถวตัวเลขอยู่ฝั่งขวา
 */

export async function AboutBand({ copy }: { copy: typeof HomeCopy.aboutBand }) {
  const [stats, site] = await Promise.all([getStats(), getSiteInfo()]);
  return (
    <section id="about" className="overflow-x-clip py-[38px] lg:py-[52px]">
      <div className="mx-auto grid w-full max-w-[1180px] items-center gap-7 px-5 lg:grid-cols-[0.92fr_1.08fr] lg:gap-13">
        <div className="bleed-left relative aspect-16/9 overflow-hidden rounded-3xl lg:aspect-16/11 lg:rounded-l-none">
          <CmsImage
            src="/assets/about-steel-structure.jpg"
            alt={copy.imageAlt}
            fill
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-cover"
          />
          <span
            aria-hidden
            className="absolute inset-0 bg-gradient-to-r from-brand-800/55 to-brand-800/10"
          />

          {/* เฟดสีขาวสองชั้น ไล่ขึ้นจากขอบล่างและเข้ามาจากขอบขวา
              ทำให้ป้ายไม่ได้ลอยทับรูปดิบๆ แต่ค่อยๆ โผล่ออกมาจากตัวรูป
              พอพื้นหลังใต้ป้ายสว่างขึ้นแล้ว ขอบป้ายจึงแทบไม่มีเส้นตัดให้เห็น */}
          <span
            aria-hidden
            className="absolute inset-0 bg-[linear-gradient(to_top,rgba(255,255,255,0.82)_0%,rgba(255,255,255,0.36)_16%,rgba(255,255,255,0.08)_30%,rgba(255,255,255,0)_44%)]"
          />
          <span
            aria-hidden
            className="absolute inset-0 bg-[linear-gradient(to_left,rgba(255,255,255,0.6)_0%,rgba(255,255,255,0.22)_24%,rgba(255,255,255,0)_50%)]"
          />

          {/* ป้ายชื่อบริษัท — ชื่อดึงจาก "ตั้งค่าเว็บไซต์ → ข้อมูลบริษัท" ที่เดียวกับหัวเว็บ
              โลโก้ใส่ alt ว่างเพราะชื่อบริษัทเป็นตัวหนังสืออยู่ข้างๆ แล้ว
              ถ้าใส่ alt ซ้ำ โปรแกรมอ่านหน้าจอจะอ่านชื่อบริษัทสองรอบ
              จำกัดความกว้างไว้ไม่ให้ล้นกรอบรูปตอนจอแคบ ชื่อยาวก็ตกบรรทัดเอง */}
          <span className="absolute right-3.5 bottom-3.5 z-2 flex max-w-[calc(100%-1.75rem)] items-center gap-3 rounded-2xl bg-white/80 px-4 py-3 shadow-[0_8px_30px_-8px_rgba(32,64,79,0.38)] ring-1 ring-white/70 ring-inset backdrop-blur-md sm:right-5 sm:bottom-5 sm:gap-4 sm:px-5 sm:py-4">
            <CmsImage
              src="/assets/logo.png"
              alt=""
              width={160}
              height={142}
              className="h-9 w-auto shrink-0 drop-shadow-[0_1px_5px_rgba(32,64,79,0.16)] sm:h-11 lg:h-[50px]"
            />
            <span aria-hidden className="h-8 w-px shrink-0 bg-brand-900/12 sm:h-10 lg:h-11" />
            <span className="min-w-0">
              <b className="font-display block text-[13px] leading-[1.3] font-semibold tracking-[0.005em] text-brand-800 sm:text-[16px] lg:text-[18px]">
                {site.name}
              </b>
              <span className="mt-[3px] block text-[8.5px] leading-[1.45] font-medium tracking-[0.16em] text-brand-500 uppercase sm:mt-1 sm:text-[10px] sm:tracking-[0.2em] lg:text-[11px]">
                {site.nameEn}
              </span>
            </span>
          </span>
        </div>

        <div>
          <div className="eyebrow-en text-[14px] text-brand-200">{copy.eyebrow}</div>
          <h2 className="text-[clamp(22px,2.6vw,30px)] font-bold tracking-[0.02em] italic">
            {copy.titlePrefix} <em className="text-accent-500 italic">{copy.titleAccent}</em>
          </h2>
          {/* ชื่อบริษัทดึงจากหลังบ้าน ถ้าลูกค้าแก้ชื่อจดทะเบียน ย่อหน้านี้เปลี่ยนตาม */}
          <p className="my-4 max-w-[640px] text-[1.15rem] leading-[1.85] text-slate-500">
            {site.name} {copy.body}
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
            {copy.moreLabel}
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

export async function LineCta({ copy }: { copy: typeof HomeCopy.lineCta }) {
  const { site, lineHref, lineHref2, mapHref } = bundleFor(await getSiteInfo(), []);
  return (
    <div className="grid items-center gap-7 lg:grid-cols-2 lg:gap-10">
      <div>
        <div className="flex items-center gap-3.5">
          <h2 className="text-[clamp(22px,2.6vw,30px)] font-bold text-accent-500 italic">
            {copy.title}
          </h2>
          <span className="h-0.5 max-w-[110px] flex-1 bg-accent-500/50" />
        </div>
        <p className="mt-1 mb-5 text-[15.5px] text-slate-500">
          {copy.description}
        </p>

        {/* ปุ่มไลน์ทั้งสองช่องทางอยู่ฝั่งซ้ายรวมกัน ฝั่งขวาเหลือแต่ QR ให้สแกน */}
        <div className="flex flex-wrap gap-2.5">
          <Button href={lineHref} variant="line">
            <Icon.line className="size-[18px]" />
            {copy.addFriendPrefix} {site.lineId}
          </Button>
          <Button href={lineHref2} variant="line">
            <Icon.line className="size-[18px]" />
            {copy.addFriend2}
          </Button>
        </div>

        <div className="mt-4.5 flex flex-col gap-2.5">
          {site.phones.slice(0, 3).map((phone) => (
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

      {/* มือถือจำลอง — QR สองช่องทางเรียงบนลงล่างเต็มความกว้างจอ ได้ขนาดใหญ่กว่า
          วางคู่กันเกือบเท่าตัว กดได้ด้วยสำหรับคนที่เปิดจากมือถือ ซึ่งสแกนจอตัวเองไม่ได้
          ใส่ unoptimized เพราะ QR ต้องคมเป๊ะทุกช่อง ถ้าปล่อยให้ระบบบีบเป็น AVIF
          ขอบช่องจะเบลอจนกล้องบางรุ่นอ่านไม่ออก ไฟล์เล็กอยู่แล้วจึงไม่ต้องบีบ */}
      <div className="w-[216px] justify-self-center rounded-[32px] bg-[#12181d] p-2.5 shadow-[0_18px_40px_rgba(32,64,79,0.24)] sm:w-[238px] lg:w-[252px]">
        <div className="relative overflow-hidden rounded-3xl bg-white px-[18px] pt-[22px] pb-[22px] text-center">
          <span className="absolute top-0 left-1/2 h-4 w-[74px] -translate-x-1/2 rounded-b-xl bg-[#12181d]" />
          <div className="mt-3.5 text-[17px] font-semibold text-[#06C755]">{copy.qrTitle}</div>
          <p className="mt-0.5 text-[12.5px] leading-snug text-slate-500">{copy.qrNote}</p>

          <div className="mt-4 flex flex-col gap-4">
            {[
              { href: lineHref, src: "/assets/line-qr-1.jpg", label: site.lineId, alt: copy.qr1Alt },
              { href: lineHref2, src: "/assets/line-qr-2.jpg", label: copy.qr2Label, alt: copy.qr2Alt },
            ].map((qr) => (
              <a key={qr.src} href={qr.href} target="_blank" rel="noreferrer" className="group block">
                <span className="relative block aspect-square overflow-hidden rounded-2xl border border-slate-200 transition group-hover:border-[#06C755]/70">
                  <CmsImage
                    src={qr.src}
                    alt={qr.alt}
                    fill
                    sizes="260px"
                    unoptimized
                    className="object-contain p-1.5"
                  />
                </span>
                <span className="mt-2 flex items-center justify-center gap-1.5 text-[13.5px] font-semibold text-brand-700 transition group-hover:text-[#06C755]">
                  <Icon.line className="size-4 shrink-0 text-[#06C755]" />
                  {qr.label}
                </span>
              </a>
            ))}
          </div>
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

export async function CtaBand({
  title = "สนใจสั่งซื้อ หรือขอใบเสนอราคา",
  description = "ส่งแบบโครงสร้างหรือรายการ BOQ มาให้ทีมวิศวกรประเมิน เราจะคำนวณปริมาณสี ความหนาฟิล์ม และสรุปราคาให้ภายใน 1–2 วันทำการ",
}: {
  title?: string;
  description?: string;
}) {
  const { site, lineChannels } = bundleFor(await getSiteInfo(), []);
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
            {/* สองแถว — เบอร์โทรแถวบน ไลน์แถวล่าง แยกช่องทางให้อ่านง่ายกว่าเรียงยาวแถวเดียว
                เบอร์ที่ขึ้นคือสองเบอร์แรกในลิสต์ ชุดเดียวกับปุ่มโทรลอยมุมขวาล่าง
                อยากเปลี่ยนว่าเบอร์ไหนขึ้นก็ย้ายลำดับที่ ตั้งค่าเว็บไซต์ → ข้อมูลบริษัท */}
            <div className="mt-7 flex flex-wrap justify-center gap-2.5">
              {site.phones.slice(0, 2).map((phone) => (
                <Button
                  key={phone}
                  href={`tel:${phone.replace(/-/g, "")}`}
                  variant="accent"
                  size="lg"
                >
                  <Icon.phone />
                  โทร {phone}
                </Button>
              ))}
            </div>
            <div className="mt-2.5 flex flex-wrap justify-center gap-2.5">
              {lineChannels.map((c, i) => (
                <Button key={c.href} href={c.href} variant="line" size="lg">
                  <Icon.line />
                  {c.label ? `แอดไลน์ ${c.label}` : `แอดไลน์ ช่องทางที่ ${i + 1}`}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
