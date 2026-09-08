import type { Metadata } from "next";
import { Button, Container, Icon, PageHero } from "@/components/ui";
import Reveal from "@/components/ui/Reveal";
import { bundleFor } from "@/data/site";
import WorksGallery from "@/components/WorksGallery";
import { getProjects, getSiteInfo } from "@/lib/cms/content";
import { copyFor } from "@/lib/cms/copy-pages";

export async function generateMetadata(): Promise<Metadata> {
  const { meta } = await copyFor("projects");
  return meta;
}

export default async function ProjectsPage() {
  /* แถบตัวเลขสถิติถูกถอดออกตามที่ลูกค้าสั่ง ชุด stats ยังใช้ที่ /about และ /fireproofing */
  const [projects, info, { hero, cta }] = await Promise.all([
    getProjects(),
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

      {/* Gallery */}
      <section className="py-[38px] lg:py-[52px]">
        <Container>
          {/* ใช้คอมโพเนนต์เดียวกับแถบผลงานหน้าแรก — ไม่มีข้อความทับรูป
              กดที่รูปแล้วขยายเป็นป๊อปอัป เลื่อนดูรูปถัดไปได้ในตัว */}
          <WorksGallery items={projects} />
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
