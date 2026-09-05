import { CmsImage } from "@/components/CmsImage";
import Hero from "@/components/home/Hero";
import Reveal from "@/components/ui/Reveal";
import { Button, Icon, MoreLink, SectionHeading } from "@/components/ui";
import { CategoryCard, NewsCard } from "@/components/cards";
import {
  AboutBand,
  ClientLogos,
  Faq,
  LineCta,
  Section,
  StandardsBand,
  ValueBlock,
  WorksGrid,
} from "@/components/concept";
import { getArticles, getHomeFaqs, getHomeShowcase, getProjects } from "@/lib/cms/content";
import { copyFor } from "@/lib/cms/copy-pages";

/**
 * Home page — section order and component styling ported from the approved
 * Concept B mock-up at `public/concept-b/index.html`:
 *
 *   hero slider + duo + trust ribbon → categories → value block →
 *   standards → works → about band → LINE CTA → articles → FAQ
 *
 * แถบ "สินค้าขายดี" ถูกถอดออกตามที่ลูกค้าขอ — ค่าที่เคยคุมแถบนี้
 * (สินค้าเรือธง / สินค้าในการ์ดเล็ก) ยังอยู่ใน site_settings.home_showcase
 *
 * The eight category tiles now point at the client's new menu structure
 * instead of at query-string filters.
 */

export default async function HomePage() {
  const [showcaseCfg, articles, projects, homeFaqs, c] = await Promise.all([
    getHomeShowcase(),
    getArticles(),
    getProjects(),
    getHomeFaqs(),
    copyFor("home"),
  ]);

  const latest = articles.slice(0, 3);
  const showcase = projects.slice(0, 8);

  return (
    <>
      <Hero copy={c.hero} ribbon={c.ribbon} />

      {/* -------------------------------------------------------- Categories */}
      <Section id="categories" tone="shell">
        <Reveal>
          <SectionHeading
            title={c.sections.categories}
            action={<MoreLink href="/products">{c.sections.categoriesMore}</MoreLink>}
          />
        </Reveal>
        <div className="mt-[26px] grid grid-cols-2 gap-[18px] lg:grid-cols-4">
          {showcaseCfg.categoryTiles.map((c, i) => (
            <Reveal key={c.href} delay={(i % 4) * 60}>
              <CategoryCard {...c} />
            </Reveal>
          ))}
        </div>
      </Section>

      {/* -------------------------------------------------------- Value block */}
      <Section id="certify">
        <Reveal>
          <ValueBlock
            points={showcaseCfg.valuePoints}
            lead1={c.valueBlock.lead1}
            lead2Plain={c.valueBlock.lead2Plain}
            lead2Accent={c.valueBlock.lead2Accent}
            note={c.valueBlock.note}
          />
        </Reveal>
      </Section>

      {/* ---------------------------------------------------------- Standards */}
      <Section tone="shell">
        <Reveal>
          <StandardsBand quote={c.standardsQuote} />
        </Reveal>
      </Section>

      {/* ------------------------------------------------------------ Clients */}
      <Section id="clients">
        <Reveal>
          <SectionHeading eyebrow={c.sections.clientsEyebrow} title={c.sections.clients} />
        </Reveal>
        <div className="mt-[26px]">
          <ClientLogos items={showcaseCfg.clients} />
        </div>
      </Section>

      {/* -------------------------------------------------------------- Works */}
      <Section id="works" tone="shell">
        <Reveal>
          <SectionHeading
            title={c.sections.works}
            action={<MoreLink href="/projects">{c.sections.worksMore}</MoreLink>}
          />
        </Reveal>
        <div className="mt-[26px]">
          <WorksGrid items={showcase} />
        </div>
      </Section>

      {/* -------------------------------------------------------------- About */}
      <AboutBand copy={c.aboutBand} />

      {/* ------------------------------------------------------------ Contact */}
      <Section id="contact">
        <LineCta copy={c.lineCta} />
      </Section>

      {/* ----------------------------------------------------------- Articles */}
      <Section id="articles" tone="shell">
        <Reveal>
          <SectionHeading
            title={c.sections.articles}
            action={<MoreLink href="/news">{c.sections.articlesMore}</MoreLink>}
          />
        </Reveal>
        <div className="mt-[26px] grid gap-[22px] md:grid-cols-3">
          {latest.map((a, i) => (
            <Reveal key={a.slug} delay={i * 70}>
              <NewsCard article={a} />
            </Reveal>
          ))}
        </div>
      </Section>

      {/* ---------------------------------------------------------------- FAQ */}
      <Section>
        <div className="grid items-start gap-9 lg:grid-cols-[0.85fr_1.15fr]">
          <Reveal>
            <div className="text-sm text-slate-500">{c.faqBlock.eyebrow}</div>
            <h2 className="mb-[18px] text-[clamp(21px,2.4vw,28px)]">{c.faqBlock.title}</h2>
            <div className="relative aspect-4/3 overflow-hidden rounded-3xl">
              <CmsImage
                src="/assets/faq-home.jpg"
                alt={c.faqBlock.imageAlt}
                fill
                sizes="(min-width: 1024px) 40vw, 92vw"
                className="object-cover"
              />
            </div>
            <div className="mt-5 flex flex-wrap gap-2.5">
              <Button href="/contact" variant="accent">
                <Icon.doc className="size-4" />
                {c.faqBlock.quoteLabel}
              </Button>
              <Button href="/products" variant="ghost">
                {c.faqBlock.productsLabel}
                <Icon.arrow />
              </Button>
            </div>
          </Reveal>

          <Reveal delay={100}>
            <Faq items={homeFaqs} openFirst />
          </Reveal>
        </div>
      </Section>
    </>
  );
}
