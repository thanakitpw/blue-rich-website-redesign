import Image from "next/image";
import Link from "next/link";
import Hero from "@/components/home/Hero";
import Reveal from "@/components/ui/Reveal";
import { Button, Container, Icon, SectionHeading } from "@/components/ui";
import { CategoryCard, NewsCard, ProductCard } from "@/components/cards";
import { categories, products, productsByCategory } from "@/data/products";
import { articles } from "@/data/news";
import { projects } from "@/data/projects";
import { lineHref, site, standards, stats, telHref } from "@/data/site";

const reviews = [
  {
    name: "คุณจ๊อบ",
    topic: "สีกันไฟ",
    text: "ได้รับคำแนะนำ คำปรึกษาที่ดีจากพนักงานที่นี่ครับ มีความรู้ ความเชี่ยวชาญ สีกันไฟมีคุณภาพดีมาก ทนความร้อนสูง",
  },
  {
    name: "คุณส้ม",
    topic: "สีทาโครงสร้างเหล็ก",
    text: "สีคุณภาพดี มีมาตรฐาน ราคาไม่แพง ทนความร้อนสูง มีทีมงานวิศวกรคอยให้คำปรึกษาได้อย่างดีเยี่ยม",
  },
  {
    name: "คุณจุ้ย",
    topic: "น้ำมันสน",
    text: "แกลลอนใหญ่ ใช้ผสมสีทารองพื้นกันสนิมได้เป็นอย่างดี มีคุณภาพสูง เหมาะสำหรับงานทุกประเภท",
  },
];

const advantages = [
  {
    icon: Icon.doc,
    title: "เอกสารรับรองครบชุด",
    text: "ออกเอกสารรับรองงานสีกันไฟโดยวุฒิวิศวกรโยธาและวิศวกรควบคุมงาน ตามแบบ น.4-5 และ น.4-9 พร้อมยื่นหน่วยงานราชการ",
  },
  {
    icon: Icon.shield,
    title: "ผ่านการทดสอบจริง",
    text: "ทดสอบมาตรฐาน ASTM E-119 โดยจุฬาลงกรณ์มหาวิทยาลัย และ ISO 834 ณ ประเทศมาเลเซีย มีรายงานผลทดสอบให้ตรวจสอบ",
  },
  {
    icon: Icon.users,
    title: "ทีมวิศวกรดูแลตลอดงาน",
    text: "ให้คำปรึกษาตั้งแต่คำนวณความหนาฟิล์มตาม Section Factor เลือกระบบสี จนถึงตรวจรับหน้างานและปิดเอกสาร",
  },
  {
    icon: Icon.truck,
    title: "พร้อมส่งทั่วประเทศ",
    text: "มีสต็อกสินค้าสำหรับงานโครงการขนาดใหญ่ จัดส่งตรงถึงหน้างาน พร้อมราคาพิเศษสำหรับผู้รับเหมา",
  },
];

const process = [
  {
    step: "01",
    title: "ส่งแบบและปรึกษา",
    text: "ส่งแบบโครงสร้างหรือ BOQ ให้ทีมวิศวกรประเมินอัตราการทนไฟที่กฎหมายกำหนด",
  },
  {
    step: "02",
    title: "คำนวณและเสนอราคา",
    text: "คำนวณความหนาฟิล์มแห้งตาม Section Factor ของแต่ละชิ้นส่วน พร้อมสรุปปริมาณสีและราคา",
  },
  {
    step: "03",
    title: "ส่งของ / ลงหน้างาน",
    text: "จัดส่งสินค้าถึงหน้างาน หรือให้ทีมช่างเข้าดำเนินงานพร้อมควบคุมคุณภาพทุกขั้นตอน",
  },
  {
    step: "04",
    title: "ตรวจรับและรับรอง",
    text: "ตรวจวัดความหนาฟิล์ม ถ่ายภาพงาน และออกเอกสารรับรองโดยวุฒิวิศวกรให้ครบชุด",
  },
];

export default function HomePage() {
  const featured = products.find((p) => p.featured)!;
  const bestSellers = products.filter((p) => p.bestSeller);
  const latest = articles.slice(0, 3);
  const showcase = projects.slice(0, 6);

  return (
    <>
      <Hero />

      {/* ---------------------------------------------------- Standards marquee */}
      <section className="border-y border-slate-100 bg-white py-6">
        <div className="mask-fade-x overflow-hidden">
          <div className="flex w-max animate-marquee gap-4">
            {[0, 1].map((dup) => (
              <div key={dup} className="flex shrink-0 gap-4" aria-hidden={dup === 1}>
                {standards.map((s) => (
                  <div
                    key={s.label}
                    className="flex items-center gap-3 rounded-2xl bg-brand-50/70 px-5 py-3 ring-1 ring-inset ring-brand-100"
                  >
                    <Icon.shield className="size-5 shrink-0 text-brand-500" />
                    <span>
                      <span className="block font-display text-sm font-semibold text-brand-900">
                        {s.label}
                      </span>
                      <span className="block text-[0.7rem] whitespace-nowrap text-slate-500">
                        {s.note}
                      </span>
                    </span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --------------------------------------------------------- Categories */}
      <section className="py-20 lg:py-28">
        <Container>
          <Reveal>
            <SectionHeading
              eyebrow="หมวดหมู่สินค้า"
              title="วัสดุครบระบบสำหรับงานป้องกันไฟโครงสร้างเหล็ก"
              description="ตั้งแต่สีรองพื้นกันสนิม สีกันไฟชนิดพองตัว ตัวทำละลาย ไปจนถึงผ้ากันไฟสำหรับงานเชื่อมและงานฉนวนความร้อน"
              action={
                <Button href="/products" variant="secondary">
                  ดูสินค้าทั้งหมด
                  <Icon.arrow />
                </Button>
              }
            />
          </Reveal>

          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {categories.map((c, i) => (
              <Reveal key={c.slug} delay={i * 80}>
                <CategoryCard {...c} count={productsByCategory(c.slug).length} />
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* ------------------------------------------------------ Featured product */}
      <section className="relative overflow-hidden bg-brand-50/60 py-20 lg:py-28">
        <div
          aria-hidden
          className="absolute -top-32 -left-32 size-96 rotate-45 rounded-[26%] bg-brand-100/50"
        />
        <Container className="relative">
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
            <Reveal className="order-2 lg:order-1">
              <span className="inline-flex items-center gap-2 rounded-full bg-flame-500/10 px-3.5 py-1.5 text-xs font-semibold text-flame-600 ring-1 ring-inset ring-flame-500/20">
                <Icon.flame className="size-4" />
                สินค้าเรือธง
              </span>
              <h2 className="mt-4 text-3xl leading-tight sm:text-4xl lg:text-[2.7rem]">
                {featured.name}
              </h2>
              <p className="mt-4 text-base leading-relaxed text-slate-600">
                {featured.description[0]}
              </p>

              <ul className="mt-7 grid gap-3">
                {featured.highlights.map((h) => (
                  <li key={h} className="flex gap-3 text-[0.95rem] text-slate-700">
                    <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-brand-600 text-white">
                      <svg viewBox="0 0 20 20" className="size-3" fill="none" aria-hidden>
                        <path
                          d="m5 10.5 3.2 3L15 7"
                          stroke="currentColor"
                          strokeWidth="2.4"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </span>
                    {h}
                  </li>
                ))}
              </ul>

              <div className="mt-9 flex flex-wrap gap-3">
                <Button href={`/products/${featured.slug}`} size="lg">
                  ดูข้อมูลผลิตภัณฑ์
                  <Icon.arrow />
                </Button>
                <Button href={lineHref} variant="line" size="lg">
                  <Icon.line />
                  สอบถามผ่าน LINE
                </Button>
              </div>
            </Reveal>

            <Reveal delay={120} className="order-1 lg:order-2">
              <div className="relative">
                <div className="overflow-hidden rounded-4xl shadow-2xl shadow-brand-950/20 ring-1 ring-brand-900/10">
                  <Image
                    src="/assets/banner-fireproof.jpg"
                    alt="Fire Proof Steel Structure — งานสีกันไฟเคลือบผิวเหล็ก"
                    width={1200}
                    height={1200}
                    sizes="(min-width: 1024px) 50vw, 92vw"
                    className="h-auto w-full"
                  />
                </div>
                <div className="absolute -bottom-6 -left-4 hidden rounded-3xl bg-white p-5 shadow-xl shadow-brand-950/15 ring-1 ring-slate-100 sm:block">
                  <div className="flex items-center gap-4">
                    <Image
                      src={featured.image}
                      alt=""
                      width={80}
                      height={120}
                      className="h-16 w-auto"
                    />
                    <div>
                      <p className="font-display text-sm font-semibold text-brand-900">
                        Solvent &amp; Water Base
                      </p>
                      <p className="text-xs text-slate-500">เฉดสีขาว และสีเทา</p>
                    </div>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </Container>
      </section>

      {/* ---------------------------------------------------------- Best sellers */}
      <section className="py-20 lg:py-28">
        <Container>
          <Reveal>
            <SectionHeading
              eyebrow="Best Seller"
              title="รายการขายดี ยอดนิยม"
              description="สินค้าที่ผู้รับเหมาและเจ้าของโครงการสั่งซ้ำมากที่สุด"
              action={
                <Button href="/products" variant="secondary">
                  ดูทั้งหมด
                  <Icon.arrow />
                </Button>
              }
            />
          </Reveal>
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {bestSellers.map((p, i) => (
              <Reveal key={p.slug} delay={i * 80}>
                <ProductCard product={p} />
              </Reveal>
            ))}
            <Reveal delay={bestSellers.length * 80}>
              <Link
                href="/products"
                className="group flex h-full min-h-[20rem] flex-col items-center justify-center gap-4 rounded-3xl bg-brand-50 p-8 text-center ring-1 ring-inset ring-brand-100 transition hover:bg-brand-100/60"
              >
                <span className="grid size-14 place-items-center rounded-full bg-white text-brand-600 shadow-sm ring-1 ring-brand-100 transition group-hover:bg-brand-600 group-hover:text-white">
                  <Icon.arrow className="size-6" />
                </span>
                <span className="font-display text-lg font-semibold text-brand-900">
                  ดูสินค้าทั้งหมด
                </span>
                <span className="text-sm text-slate-500">
                  {products.length} รายการ · 4 หมวดหมู่
                </span>
              </Link>
            </Reveal>
          </div>
        </Container>
      </section>

      {/* ------------------------------------------------------------ Advantages */}
      <section className="relative overflow-hidden bg-brand-950 py-20 lg:py-28">
        <div
          aria-hidden
          className="absolute inset-0 bg-[radial-gradient(56rem_28rem_at_80%_0%,var(--color-brand-800),transparent_65%)]"
        />
        <Container className="relative">
          <Reveal>
            <SectionHeading
              tone="dark"
              align="center"
              eyebrow="ทำไมต้องเลือกเรา"
              title="งานสีกันไฟที่ผ่านได้จริง ตั้งแต่หน้างานถึงหน้ากระดาษ"
              description="เราไม่ได้ขายแค่สี แต่ดูแลตั้งแต่การเลือกระบบ คำนวณความหนา ควบคุมคุณภาพ จนถึงเอกสารรับรองที่ยื่นหน่วยงานได้จริง"
            />
          </Reveal>

          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {advantages.map((a, i) => (
              <Reveal key={a.title} delay={i * 80}>
                <div className="h-full rounded-3xl bg-white/[0.04] p-7 ring-1 ring-inset ring-white/10 transition hover:bg-white/[0.07]">
                  <span className="grid size-12 place-items-center rounded-2xl bg-brand-500/15 text-brand-300">
                    <a.icon />
                  </span>
                  <h3 className="mt-5 text-lg text-white">{a.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-brand-100/65">{a.text}</p>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal delay={200}>
            <dl className="mt-14 grid gap-px overflow-hidden rounded-3xl bg-white/10 ring-1 ring-white/10 sm:grid-cols-2 lg:grid-cols-4">
              {stats.map((s) => (
                <div key={s.label} className="bg-brand-950/80 p-7 text-center">
                  <dt className="font-display text-3xl font-bold text-white lg:text-4xl">
                    {s.value}
                  </dt>
                  <dd className="mt-2 text-sm text-brand-100/60">{s.label}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </Container>
      </section>

      {/* --------------------------------------------------------------- Process */}
      <section className="py-20 lg:py-28">
        <Container>
          <Reveal>
            <SectionHeading
              eyebrow="ขั้นตอนการทำงาน"
              title="ตั้งแต่ส่งแบบจนถึงเอกสารรับรอง ใน 4 ขั้นตอน"
              description="กระบวนการทำงานที่ชัดเจน ทำให้คุณวางแผนเวลาและงบประมาณของโครงการได้แม่นยำ"
            />
          </Reveal>

          <ol className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {process.map((p, i) => (
              <Reveal key={p.step} delay={i * 90}>
                <li className="relative h-full rounded-3xl bg-white p-7 ring-1 ring-slate-200/80 transition hover:shadow-[0_24px_48px_-28px_rgba(12,36,56,0.3)] hover:ring-brand-300">
                  <span className="font-display text-5xl font-bold text-brand-100">{p.step}</span>
                  <h3 className="mt-3 text-lg">{p.title}</h3>
                  <p className="mt-2.5 text-sm leading-relaxed text-slate-500">{p.text}</p>
                  {i < process.length - 1 && (
                    <span
                      aria-hidden
                      className="absolute top-1/2 -right-3 hidden size-6 place-items-center rounded-full bg-brand-500 text-white lg:grid"
                    >
                      <Icon.arrow className="size-3.5" />
                    </span>
                  )}
                </li>
              </Reveal>
            ))}
          </ol>
        </Container>
      </section>

      {/* -------------------------------------------------------------- Projects */}
      <section className="bg-slate-50 py-20 lg:py-28">
        <Container>
          <Reveal>
            <SectionHeading
              eyebrow="ผลงานของเรา"
              title="ภาพหน้างานจริงจากโครงการที่ใช้ระบบ Neocoat"
              description="โครงสร้างเหล็กโรงงาน โครงหลังคาช่วงกว้าง คานและเสาเหล็กรูปพรรณ ทั้งงานในโรงประกอบและงานหน้าไซต์"
              action={
                <Button href="/projects" variant="secondary">
                  ดูผลงานทั้งหมด
                  <Icon.arrow />
                </Button>
              }
            />
          </Reveal>

          <div className="mt-12 grid grid-cols-2 gap-4 lg:grid-cols-4">
            {showcase.map((p, i) => (
              <Reveal
                key={p.image}
                delay={i * 70}
                className={p.span === "wide" ? "col-span-2" : ""}
              >
                <figure className="group relative h-full overflow-hidden rounded-2xl bg-slate-200">
                  <div className={p.span === "wide" ? "aspect-16/10" : "aspect-4/3"}>
                    <Image
                      src={p.image}
                      alt={p.title}
                      fill
                      sizes="(min-width: 1024px) 25vw, 45vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-brand-950/90 to-transparent p-4 pt-10">
                    <p className="font-display text-sm font-semibold text-white">{p.title}</p>
                    <p className="mt-0.5 line-clamp-1 text-[0.72rem] text-brand-100/70">
                      {p.scope}
                    </p>
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* --------------------------------------------------------- Certification */}
      <section className="py-20 lg:py-28">
        <Container>
          <div className="grid items-center gap-12 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
            <Reveal>
              <div className="overflow-hidden rounded-4xl shadow-2xl shadow-brand-950/15 ring-1 ring-slate-200">
                <Image
                  src="/assets/cert-documents.jpg"
                  alt="เอกสารการรับรองโครงสร้างเหล็กงานสีกันไฟ"
                  width={1200}
                  height={1200}
                  sizes="(min-width: 1024px) 45vw, 92vw"
                  className="h-auto w-full"
                />
              </div>
            </Reveal>

            <Reveal delay={120}>
              <SectionHeading
                eyebrow="บริการรับรองงาน"
                title="เอกสารรับรองโดยวุฒิวิศวกร ครบตามกฎกระทรวง พ.ศ. 2567"
                description="ทุกโครงการที่ใช้ผลิตภัณฑ์ของเรา สามารถขอเอกสารรับรองงานสีกันไฟโดยวุฒิวิศวกรโยธาและวิศวกรควบคุมงาน เพื่อใช้ยื่นขออนุญาตและตรวจรับงาน"
              />
              <ul className="mt-8 grid gap-3">
                {[
                  "หนังสือแสดงความยินยอมของผู้ควบคุมงาน แบบ น.4-5",
                  "หนังสือรับรองของผู้ควบคุมงาน แบบ น.4-9",
                  "หนังสือรับรองโครงสร้างเหล็กทนไฟ พร้อมผลทดสอบอ้างอิง",
                  "รายการคำนวณความหนาฟิล์มตาม Section Factor",
                ].map((t) => (
                  <li
                    key={t}
                    className="flex gap-3 rounded-2xl bg-brand-50/70 px-5 py-4 text-[0.95rem] text-slate-700 ring-1 ring-inset ring-brand-100"
                  >
                    <Icon.doc className="size-5 shrink-0 text-brand-600" />
                    {t}
                  </li>
                ))}
              </ul>
              <div className="mt-8">
                <Button href="/contact" size="lg">
                  ปรึกษาเรื่องเอกสารรับรอง
                  <Icon.arrow />
                </Button>
              </div>
            </Reveal>
          </div>
        </Container>
      </section>

      {/* ---------------------------------------------------------- Testimonials */}
      <section className="bg-slate-50 py-20 lg:py-28">
        <Container>
          <Reveal>
            <SectionHeading
              align="center"
              eyebrow="รีวิวจากลูกค้า"
              title="เสียงจริงจากผู้ใช้งาน"
              description="ขอขอบคุณลูกค้าทุกท่านที่รีวิวให้ ทางเราจะพัฒนาการให้บริการให้ดียิ่งขึ้นค่ะ"
            />
          </Reveal>
          <div className="mt-14 grid gap-5 md:grid-cols-3">
            {reviews.map((r, i) => (
              <Reveal key={r.name} delay={i * 90}>
                <figure className="flex h-full flex-col rounded-3xl bg-white p-7 ring-1 ring-slate-200/80">
                  <Icon.quote className="text-brand-200" />
                  <blockquote className="mt-4 flex-1 text-[0.95rem] leading-relaxed text-slate-600">
                    {r.text}
                  </blockquote>
                  <figcaption className="mt-6 flex items-center gap-3 border-t border-slate-100 pt-5">
                    <span className="grid size-11 place-items-center rounded-full bg-brand-600 font-display font-semibold text-white">
                      {r.name.replace("คุณ", "").charAt(0)}
                    </span>
                    <span>
                      <span className="block font-display font-semibold text-brand-900">
                        {r.name}
                      </span>
                      <span className="block text-xs text-slate-500">{r.topic}</span>
                    </span>
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* -------------------------------------------------------------------- News */}
      <section className="py-20 lg:py-28">
        <Container>
          <Reveal>
            <SectionHeading
              eyebrow="บทความและข่าวสาร"
              title="เรื่องน่ารู้เกี่ยวกับงานสีกันไฟและกฎหมายอาคาร"
              description="อัปเดตข้อกำหนดด้านการป้องกันอัคคีภัย พร้อมความรู้เรื่องงานสีและวัสดุก่อสร้าง"
              action={
                <Button href="/news" variant="secondary">
                  อ่านทั้งหมด
                  <Icon.arrow />
                </Button>
              }
            />
          </Reveal>
          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {latest.map((a, i) => (
              <Reveal key={a.slug} delay={i * 90}>
                <NewsCard article={a} />
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* --------------------------------------------------------------------- CTA */}
      <section className="pb-20 lg:pb-28">
        <Container>
          <Reveal>
            <div className="relative overflow-hidden rounded-5xl bg-brand-900 px-7 py-14 text-center sm:px-14 lg:py-20">
              <div
                aria-hidden
                className="absolute inset-0 bg-[radial-gradient(40rem_20rem_at_50%_0%,var(--color-brand-700),transparent_70%)]"
              />
              <div
                aria-hidden
                className="absolute -bottom-24 -left-16 size-72 rotate-45 rounded-[26%] border border-white/10"
              />
              <div
                aria-hidden
                className="absolute -top-28 -right-12 size-72 rotate-45 rounded-[26%] border border-white/10"
              />
              <div className="relative mx-auto max-w-2xl">
                <h2 className="text-3xl leading-tight text-white sm:text-4xl lg:text-[2.8rem]">
                  มีแบบโครงสร้างอยู่แล้ว? ส่งมาให้ทีมวิศวกรประเมินได้เลย
                </h2>
                <p className="mt-5 text-base leading-relaxed text-brand-100/75">
                  เราจะคำนวณปริมาณสี ความหนาฟิล์ม และสรุปราคาให้ภายใน 1–2 วันทำการ
                  พร้อมแจ้งรายการเอกสารรับรองที่โครงการของคุณต้องใช้
                </p>
                <div className="mt-9 flex flex-wrap justify-center gap-3">
                  <Button href={telHref} size="lg" variant="secondary">
                    <Icon.phone />
                    โทร {site.phones[0]}
                  </Button>
                  <Button href={lineHref} size="lg" variant="line">
                    <Icon.line />
                    แอดไลน์ @{site.lineId}
                  </Button>
                  <Button href="/contact" size="lg" variant="ghost">
                    ส่งข้อความถึงเรา
                    <Icon.arrow />
                  </Button>
                </div>
              </div>
            </div>
          </Reveal>
        </Container>
      </section>
    </>
  );
}
