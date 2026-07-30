import Image from "next/image";
import { Button, Container, Icon } from "@/components/ui";
import { lineHref, site, telHref } from "@/data/site";

const trust = [
  { label: "ASTM E-119", note: "จุฬาลงกรณ์ฯ" },
  { label: "ISO 834", note: "มาเลเซีย" },
  { label: "น.4-5 / น.4-9", note: "วุฒิวิศวกร" },
];

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-brand-950 pt-28 pb-20 sm:pt-36 lg:pt-44 lg:pb-28">
      {/* Ambient light */}
      <div
        aria-hidden
        className="absolute inset-0 bg-[radial-gradient(70rem_36rem_at_8%_-10%,var(--color-brand-700),transparent_60%),radial-gradient(46rem_30rem_at_92%_20%,var(--color-brand-800),transparent_65%)]"
      />
      {/* Faint blueprint grid */}
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.06] [background-image:linear-gradient(to_right,white_1px,transparent_1px),linear-gradient(to_bottom,white_1px,transparent_1px)] [background-size:64px_64px]"
      />

      <Container className="relative">
        <div className="grid items-center gap-14 lg:grid-cols-[1.05fr_1fr] lg:gap-10">
          {/* Copy */}
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-white/[0.07] px-4 py-2 text-xs font-semibold text-brand-100 ring-1 ring-inset ring-white/15">
              <span className="relative flex size-2">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-flame-400 opacity-70" />
                <span className="relative inline-flex size-2 rounded-full bg-flame-500" />
              </span>
              รับรองงานตามกฎกระทรวง พ.ศ. 2567
            </span>

            <h1 className="mt-6 text-[2.6rem] leading-[1.12] text-white sm:text-6xl lg:text-[4.1rem]">
              สีกันไฟโครงสร้างเหล็ก
              <br />
              <span className="text-gradient-brand bg-gradient-to-br from-brand-200 via-brand-300 to-white">
                รับรองโดยวุฒิวิศวกร
              </span>
            </h1>

            <p className="mt-6 max-w-xl text-base leading-relaxed text-brand-100/75 sm:text-lg">
              จำหน่ายสีกันไฟ–สีทนไฟ Neocoat Intumescent Paint ทั้งสูตรน้ำมันและสูตรน้ำ
              สีรองพื้นกันสนิม น้ำมันสน ทินเนอร์ และผ้ากันไฟ
              พร้อมทีมวิศวกรให้คำปรึกษาตั้งแต่คำนวณความหนาฟิล์มจนถึงออกเอกสารรับรอง
            </p>

            <div className="mt-9 flex flex-wrap gap-3">
              <Button href={telHref} size="lg">
                <Icon.phone />
                ขอใบเสนอราคา
              </Button>
              <Button href="/products" variant="ghost" size="lg">
                ดูสินค้าทั้งหมด
                <Icon.arrow />
              </Button>
            </div>

            <dl className="mt-11 flex flex-wrap gap-x-10 gap-y-5 border-t border-white/10 pt-7">
              {trust.map((t) => (
                <div key={t.label}>
                  <dt className="font-display text-lg font-semibold text-white">{t.label}</dt>
                  <dd className="mt-0.5 text-xs text-brand-200/60">{t.note}</dd>
                </div>
              ))}
            </dl>
          </div>

          {/* Diamond collage — a modernised nod to the original hero */}
          <div className="relative mx-auto w-full max-w-[30rem] lg:max-w-none">
            <div className="relative aspect-square">
              {/* Halo rings */}
              <div
                aria-hidden
                className="absolute inset-[6%] rotate-45 rounded-[26%] border border-white/10"
              />
              <div
                aria-hidden
                className="absolute inset-[16%] rotate-45 rounded-[26%] border border-white/[0.07]"
              />

              {/* Large diamond */}
              <figure className="diamond absolute top-[16%] left-[4%] size-[52%] overflow-hidden shadow-2xl shadow-brand-950/60 ring-2 ring-white/15">
                <Image
                  src="/assets/work-04.jpg"
                  alt="โครงหลังคาเหล็กทาสีกันไฟ"
                  fill
                  priority
                  sizes="(min-width: 1024px) 300px, 50vw"
                  className="diamond-inner object-cover"
                />
              </figure>

              {/* Medium diamond */}
              <figure className="diamond absolute top-[2%] right-[10%] size-[34%] overflow-hidden shadow-xl shadow-brand-950/50 ring-2 ring-white/15">
                <Image
                  src="/assets/work-11.jpg"
                  alt="โครงถักเหล็กในโรงประกอบ"
                  fill
                  sizes="(min-width: 1024px) 200px, 34vw"
                  className="diamond-inner object-cover"
                />
              </figure>

              {/* Small diamonds */}
              <figure className="diamond absolute right-[2%] bottom-[26%] size-[27%] overflow-hidden shadow-xl shadow-brand-950/50 ring-2 ring-white/15">
                <Image
                  src="/assets/work-16.jpg"
                  alt="คานเหล็กพร้อมยกติดตั้ง"
                  fill
                  sizes="(min-width: 1024px) 160px, 27vw"
                  className="diamond-inner object-cover"
                />
              </figure>

              <figure className="diamond absolute bottom-[2%] left-[30%] size-[27%] overflow-hidden shadow-xl shadow-brand-950/50 ring-2 ring-white/15">
                <Image
                  src="/assets/work-10.jpg"
                  alt="สีกันไฟ Neocoat พร้อมส่ง"
                  fill
                  sizes="(min-width: 1024px) 160px, 27vw"
                  className="diamond-inner object-cover"
                />
              </figure>

              {/* Floating spec chip */}
              <div className="absolute bottom-[8%] left-[-2%] rounded-2xl bg-white/95 px-4 py-3 shadow-2xl shadow-brand-950/40 backdrop-blur">
                <p className="font-display text-2xl font-bold text-brand-800">3 ชม.</p>
                <p className="text-[0.68rem] font-medium text-slate-500">อัตราการทนไฟสูงสุด</p>
              </div>

              {/* Floating standards chip */}
              <div className="absolute top-[38%] right-[-4%] rounded-2xl bg-brand-500/95 px-4 py-3 text-white shadow-2xl shadow-brand-950/40 backdrop-blur">
                <p className="font-display text-lg font-bold">500 µm</p>
                <p className="text-[0.68rem] text-brand-50/90">ความหนาฟิล์มแห้ง</p>
              </div>
            </div>
          </div>
        </div>
      </Container>

      {/* Quick contact strip */}
      <Container className="relative mt-16 lg:mt-20">
        <div className="grid gap-px overflow-hidden rounded-3xl bg-white/10 ring-1 ring-white/10 sm:grid-cols-3">
          <a href={telHref} className="group flex items-center gap-4 bg-brand-950/80 p-6 transition hover:bg-brand-900/80">
            <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-brand-500/20 text-brand-300">
              <Icon.phone className="size-5" />
            </span>
            <span className="min-w-0">
              <span className="block text-xs text-brand-200/60">โทรฝ่ายขาย</span>
              <span className="block truncate font-display font-semibold text-white">
                {site.phones[0]}
              </span>
            </span>
          </a>
          <a
            href={lineHref}
            target="_blank"
            rel="noreferrer"
            className="group flex items-center gap-4 bg-brand-950/80 p-6 transition hover:bg-brand-900/80"
          >
            <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-[#06C755]/20 text-[#06C755]">
              <Icon.line className="size-5" />
            </span>
            <span className="min-w-0">
              <span className="block text-xs text-brand-200/60">ปรึกษาผ่าน LINE</span>
              <span className="block truncate font-display font-semibold text-white">
                @{site.lineId}
              </span>
            </span>
          </a>
          <a
            href={`mailto:${site.email}`}
            className="group flex items-center gap-4 bg-brand-950/80 p-6 transition hover:bg-brand-900/80"
          >
            <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-brand-500/20 text-brand-300">
              <Icon.mail className="size-5" />
            </span>
            <span className="min-w-0">
              <span className="block text-xs text-brand-200/60">อีเมลฝ่ายขาย</span>
              <span className="block truncate font-display font-semibold text-white">
                {site.email}
              </span>
            </span>
          </a>
        </div>
      </Container>
    </section>
  );
}
