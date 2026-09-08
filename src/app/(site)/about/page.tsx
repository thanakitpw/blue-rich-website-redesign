import type { Metadata } from "next";
import Image from "next/image";
import { CmsImage } from "@/components/CmsImage";
import { Button, Icon, PageHero, SectionHeading } from "@/components/ui";
import Reveal from "@/components/ui/Reveal";
import { CtaBand, Section } from "@/components/concept";
import { bundleFor } from "@/data/site";
import { getCategories, getProjects, getSiteInfo } from "@/lib/cms/content";
import { copyFor } from "@/lib/cms/copy-pages";

export async function generateMetadata(): Promise<Metadata> {
  const { meta } = await copyFor("about");
  return meta;
}

/**
 * Layout follows the reference the client gave (energyreform-solar.com/about-us):
 * centred intro statement → company overview → values →
 * project gallery → product scope → closing CTA.
 *
 * แถบชิปมาตรฐานกับบล็อกขั้นตอนการทำงาน 5 ขั้นถูกถอดออกตามที่ลูกค้าสั่ง
 * มาตรฐานทั้งสามยังอ่านได้ที่หน้า /standards ซึ่งลงรายละเอียดมากกว่า
 *
 * The reference opens with the company's founding date and registered capital.
 * Blue Rich has not supplied those figures, so that block states what the
 * business does instead — nothing about incorporation is invented here.
 */

/* ไอคอนของบล็อก "สิ่งที่เรายึดถือ" — ข้อความย้ายไป @/data/pages/about แล้ว
   จับคู่กันด้วยลำดับ ถ้าเพิ่มข้อในไฟล์ข้อมูลก็เพิ่มไอคอนตรงนี้ให้ครบด้วย */
const valueIcons = [Icon.shield, Icon.users, Icon.doc, Icon.truck];

export default async function AboutPage() {
  const [
    info,
    categories,
    projects,
    { hero, intro, overview, valuesBlock, values, gallery: galleryCopy, scope },
  ] = await Promise.all([
    getSiteInfo(),
    getCategories(),
    getProjects(),
    copyFor("about"),
  ]);
  const { site } = bundleFor(info, []);
  const gallery = projects.slice(0, 8);

  return (
    <>
      <PageHero
        eyebrow={hero.eyebrow}
        title={hero.title}
        description={hero.description}
        breadcrumb={[{ label: "หน้าแรก", href: "/" }, { label: hero.crumb }]}
      />

      {/* ------------------------------------------------------ Intro statement */}
      <Section>
        <Reveal>
          <div className="mx-auto max-w-4xl text-center">
            <span className="eyebrow-en block text-[14px] text-accent-500">{intro.eyebrow}</span>
            <h2 className="mt-2 text-[clamp(23px,3vw,34px)] leading-[1.35]">
              {intro.title1}
              <br className="hidden sm:block" /> {intro.title2}
            </h2>
            <p className="mx-auto mt-5 max-w-3xl text-[16px] leading-[1.9] text-slate-600">
              {site.name} {intro.body}
            </p>
          </div>
        </Reveal>
      </Section>

      {/* ------------------------------------------------------ Company overview */}
      <Section tone="shell">
        <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_1fr] lg:gap-14">
          <Reveal>
            <SectionHeading
              eyebrow={overview.eyebrow}
              title={overview.title}
            />
            <div className="mt-6 space-y-5 text-[16px] leading-[1.9] text-slate-600">
              {overview.body.map((t) => (
                <p key={t}>{t}</p>
              ))}
            </div>

            <div className="mt-8 flex flex-wrap gap-2.5">
              <Button href="/products" size="lg">
                {overview.productsLabel}
                <Icon.arrow />
              </Button>
              <Button href="/projects" variant="ghost" size="lg">
                {overview.projectsLabel}
              </Button>
            </div>
          </Reveal>

          <Reveal delay={120}>
            {/* ชุดเดียวกับบล็อก "BY BLUE RICH" หน้าแรก — เฟดขาวสองชั้นไล่ขึ้นจากขอบล่าง
                และเข้ามาจากขอบขวา ป้ายจึงค่อยๆ โผล่ออกมาจากรูปแทนที่จะแปะทับ
                ชื่อบริษัทดึงจาก "ตั้งค่าเว็บไซต์ → ข้อมูลบริษัท" ที่เดียวกับหัวเว็บ
                โลโก้ใส่ alt ว่างเพราะชื่อเป็นตัวหนังสืออยู่ข้างๆ แล้ว ใส่ซ้ำจะถูกอ่านสองรอบ */}
            <div className="relative aspect-4/3 overflow-hidden rounded-4xl border border-slate-200">
              <CmsImage
                src="/assets/about-steel-structure.jpg"
                alt={overview.imageAlt}
                fill
                sizes="(min-width: 1024px) 46vw, 92vw"
                className="object-cover"
              />
              <span
                aria-hidden
                className="absolute inset-0 bg-[linear-gradient(to_top,rgba(255,255,255,0.82)_0%,rgba(255,255,255,0.36)_16%,rgba(255,255,255,0.08)_30%,rgba(255,255,255,0)_44%)]"
              />
              <span
                aria-hidden
                className="absolute inset-0 bg-[linear-gradient(to_left,rgba(255,255,255,0.6)_0%,rgba(255,255,255,0.22)_24%,rgba(255,255,255,0)_50%)]"
              />
              <span className="absolute right-3.5 bottom-3.5 flex max-w-[calc(100%-1.75rem)] items-center gap-3 rounded-2xl bg-white/80 px-4 py-3 shadow-[0_8px_30px_-8px_rgba(32,64,79,0.38)] ring-1 ring-white/70 ring-inset backdrop-blur-md sm:right-5 sm:bottom-5 sm:gap-4 sm:px-5 sm:py-4">
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
          </Reveal>
        </div>
      </Section>

      {/* -------------------------------------------------------------- Values */}
      <Section>
        <Reveal>
          <SectionHeading
            align="center"
            eyebrow={valuesBlock.eyebrow}
            title={valuesBlock.title}
          />
        </Reveal>
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {values.map((v, i) => {
            const ValueIcon = valueIcons[i] ?? Icon.shield;
            return (
            <Reveal key={v.title} delay={i * 80}>
              <div className="h-full rounded-3xl border border-slate-200 bg-white p-7">
                <span className="grid size-12 place-items-center rounded-2xl bg-brand-50 text-brand-600">
                  <ValueIcon />
                </span>
                <h3 className="mt-5 text-[18px]">{v.title}</h3>
                <p className="mt-3 text-[14.5px] leading-relaxed text-slate-500">{v.text}</p>
              </div>
            </Reveal>
            );
          })}
        </div>
      </Section>

      {/* ------------------------------------------------------------- Gallery */}
      <Section tone="shell">
        <Reveal>
          <SectionHeading
            title={galleryCopy.title}
            action={
              <Button href="/projects" variant="ghost" size="sm">
                {galleryCopy.moreLabel}
                <Icon.arrow />
              </Button>
            }
          />
        </Reveal>
        <div className="mt-[26px] grid grid-cols-2 gap-3.5 md:grid-cols-4">
          {gallery.map((p, i) => (
            <Reveal key={p.image} delay={(i % 4) * 60}>
              <figure className="group relative aspect-16/9 overflow-hidden rounded-2xl bg-slate-100">
                <Image
                  src={p.image}
                  alt={p.title}
                  fill
                  sizes="(min-width: 768px) 25vw, 45vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-[1.06]"
                />
                <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-brand-900/85 to-transparent px-3 pt-8 pb-2.5 text-[13px] font-medium text-white opacity-0 transition group-hover:opacity-100">
                  {p.title}
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* -------------------------------------------------------- Product scope */}
      <Section>
        <Reveal>
          <SectionHeading
            align="center"
            eyebrow={scope.eyebrow}
            title={scope.title}
          />
        </Reveal>
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((c, i) => (
            <Reveal key={c.slug} delay={i * 70}>
              <div className="h-full rounded-3xl border border-slate-200 bg-white p-6">
                <span className="eyebrow-en block text-[12px] tracking-[0.07em] text-accent-500">
                  {c.short}
                </span>
                <h3 className="mt-1 text-[18px]">{c.name}</h3>
                <p className="mt-2.5 text-[14.5px] leading-relaxed text-slate-500">
                  {c.description}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      <CtaBand />
    </>
  );
}
