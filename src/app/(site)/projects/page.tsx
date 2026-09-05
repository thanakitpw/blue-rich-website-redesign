import type { Metadata } from "next";
import Image from "next/image";
import { Button, Container, Icon, PageHero } from "@/components/ui";
import Reveal from "@/components/ui/Reveal";
import { bundleFor } from "@/data/site";
import { getProjects, getSiteInfo, getStats } from "@/lib/cms/content";
import { copyFor } from "@/lib/cms/copy-pages";

export async function generateMetadata(): Promise<Metadata> {
  const { meta } = await copyFor("projects");
  return meta;
}

export default async function ProjectsPage() {
  const [projects, stats, info, { hero, cta }] = await Promise.all([
    getProjects(),
    getStats(),
    getSiteInfo(),
    copyFor("projects"),
  ]);
  const { telHref, lineHref } = bundleFor(info, []);

  return (
    <>
      <PageHero
        eyebrow={hero.eyebrow}
        title={hero.title}
        description={hero.description}
        breadcrumb={[{ label: "หน้าแรก", href: "/" }, { label: hero.crumb }]}
      />

      {/* Stats */}
      <section className="border-b border-slate-200 bg-white">
        <Container>
          <dl className="grid divide-y divide-slate-200 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
            {stats.map((s) => (
              <div key={s.label} className="px-2 py-8 text-center">
                <dt className="font-display text-3xl font-bold text-brand-800 lg:text-4xl">
                  {s.value}
                </dt>
                <dd className="mt-2 text-sm text-slate-500">{s.label}</dd>
              </div>
            ))}
          </dl>
        </Container>
      </section>

      {/* Gallery */}
      <section className="py-[38px] lg:py-[52px]">
        <Container>
          {/* Even grid at the photography's own 16:9 ratio — the source files are
              474×264, so the old mixed spans upscaled and cropped them badly. */}
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 lg:gap-5">
            {projects.map((p, i) => (
              <Reveal key={p.image} delay={(i % 4) * 70}>
                <figure className="group relative aspect-16/9 overflow-hidden rounded-3xl bg-slate-100">
                  <Image
                    src={p.image}
                    alt={p.title}
                    fill
                    sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-[1.08]"
                  />
                  <div
                    aria-hidden
                    className="absolute inset-0 bg-gradient-to-t from-brand-950/90 via-brand-950/15 to-transparent opacity-90 transition group-hover:opacity-100"
                  />
                  <figcaption className="absolute inset-x-0 bottom-0 p-4">
                    <p className="text-[15px] leading-snug font-semibold text-white">{p.title}</p>
                    <p className="mt-1 line-clamp-2 text-[12.5px] leading-relaxed text-brand-100/75">
                      {p.scope}
                    </p>
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* CTA */}
      <section className="pb-20 lg:pb-28">
        <Container>
          <Reveal>
            <div className="relative overflow-hidden rounded-5xl bg-brand-900 px-7 py-14 sm:px-14 lg:py-16">
              <div
                aria-hidden
                className="absolute inset-0 bg-[radial-gradient(40rem_20rem_at_20%_0%,var(--color-brand-700),transparent_70%)]"
              />
              <div className="relative flex flex-col items-start gap-7 lg:flex-row lg:items-center lg:justify-between">
                <div className="max-w-xl">
                  <h2 className="text-2xl leading-tight text-white sm:text-3xl">{cta.title}</h2>
                  <p className="mt-4 text-brand-100/75">{cta.description}</p>
                </div>
                <div className="flex shrink-0 flex-wrap gap-3">
                  <Button href={telHref} size="lg" variant="secondary">
                    <Icon.phone />
                    {cta.callLabel}
                  </Button>
                  <Button href={lineHref} size="lg" variant="line">
                    <Icon.line />
                    {cta.lineLabel}
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
