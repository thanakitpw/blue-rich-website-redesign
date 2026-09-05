import type { Metadata } from "next";
import { Button, Container, Icon, PageHero } from "@/components/ui";
import { CatalogSection } from "@/components/hub";
import Reveal from "@/components/ui/Reveal";
import { bundleFor } from "@/data/site";
import { getCategories, getProducts, getSiteInfo } from "@/lib/cms/content";
import { copyFor } from "@/lib/cms/copy-pages";

export async function generateMetadata(): Promise<Metadata> {
  const { meta } = await copyFor("products");
  return meta;
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ cat?: string }>;
}) {
  const { cat } = await searchParams;
  const [categories, products, info, { hero, cta }] = await Promise.all([
    getCategories(),
    getProducts(),
    getSiteInfo(),
    copyFor("products"),
  ]);
  const { telHref, lineHref } = bundleFor(info, []);
  const active = categories.find((c) => c.slug === cat);
  const list = active ? products.filter((p) => p.category === active.slug) : products;

  return (
    <>
      <PageHero
        eyebrow={hero.eyebrow}
        title={active ? active.name : hero.title}
        description={active ? active.description : hero.description}
        breadcrumb={[
          { label: "หน้าแรก", href: "/" },
          ...(active
            ? [{ label: hero.crumbParent, href: "/products" }, { label: active.name }]
            : [{ label: hero.crumb }]),
        ]}
      />

      <CatalogSection products={list} />

      <section className="pb-[38px] lg:pb-[52px]">
        <Container>
          <Reveal>
            <div className="flex flex-col items-center gap-5 rounded-4xl border border-brand-200 bg-brand-50 px-7 py-11 text-center sm:px-12">
              <h2 className="max-w-xl text-2xl sm:text-3xl">{cta.title}</h2>
              <p className="max-w-xl text-slate-600">{cta.description}</p>
              <div className="flex flex-wrap justify-center gap-2.5">
                <Button href={telHref} size="lg">
                  <Icon.phone />
                  {cta.callLabel}
                </Button>
                <Button href={lineHref} variant="line" size="lg">
                  <Icon.line />
                  {cta.lineLabel}
                </Button>
              </div>
            </div>
          </Reveal>
        </Container>
      </section>
    </>
  );
}
