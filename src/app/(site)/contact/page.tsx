import type { Metadata } from "next";
import { Container, Icon, PageHero } from "@/components/ui";
import Reveal from "@/components/ui/Reveal";
import ContactForm from "@/components/ContactForm";
import { bundleFor } from "@/data/site";
import { getSiteInfo } from "@/lib/cms/content";
import { copyFor } from "@/lib/cms/copy-pages";

export async function generateMetadata(): Promise<Metadata> {
  const [site, { meta }] = await Promise.all([getSiteInfo(), copyFor("contact")]);
  return {
    title: meta.title,
    description: `ติดต่อ ${site.name} โทร ${site.phones.join(", ")} อีเมล ${site.email} LINE ID ${site.lineId}`,
  };
}

export default async function ContactPage() {
  const [info, copy] = await Promise.all([getSiteInfo(), copyFor("contact")]);
  const { hero, channels: labels, form, address } = copy;
  const { site, telHref, lineHref, lineHref2, mailHref, mapHref, mapEmbed } = bundleFor(info, []);

  /* ป้ายกำกับมาจากไฟล์ข้อความ ส่วนตัวข้อมูลจริงมาจาก "ข้อมูลบริษัท" ในหลังบ้าน */
  const channels: {
    icon: (typeof Icon)["phone"];
    label: string;
    lines: string[];
    href?: string;
    cta?: string;
    external?: boolean;
  }[] = [
    { icon: Icon.phone, label: labels[0].label, lines: site.phones, href: telHref, cta: labels[0].cta },
    {
      icon: Icon.line,
      label: labels[1].label,
      lines: [`${labels[1].idPrefix} ${site.lineId}`],
      href: lineHref,
      cta: labels[1].cta,
      external: true,
    },
    {
      icon: Icon.line,
      label: labels[2].label,
      lines: [labels[2].line ?? ""],
      href: lineHref2,
      cta: labels[2].cta,
      external: true,
    },
    { icon: Icon.mail, label: labels[3].label, lines: [site.email], href: mailHref, cta: labels[3].cta },
    { icon: Icon.clock, label: labels[4].label, lines: [site.hours] },
  ];

  return (
    <>
      <PageHero
        eyebrow={hero.eyebrow}
        title={hero.title}
        description={hero.description}
        breadcrumb={[{ label: "หน้าแรก", href: "/" }, { label: hero.crumb }]}
      />

      {/* Channels */}
      <section className="py-[38px] lg:py-[52px]">
        <Container>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {channels.map((c, i) => (
              <Reveal key={c.label} delay={i * 70}>
                <div className="flex h-full flex-col rounded-3xl bg-white p-6 border border-slate-200 transition hover:border-brand-200">
                  <span className="grid size-11 place-items-center rounded-2xl bg-brand-50 text-brand-600">
                    <c.icon className="size-5" />
                  </span>
                  <p className="mt-4 text-xs font-semibold tracking-wide text-slate-400 uppercase">
                    {c.label}
                  </p>
                  <div className="mt-1.5 flex-1 space-y-0.5">
                    {c.lines.map((l) => (
                      <p key={l} className="font-display font-semibold break-words text-brand-700">
                        {l}
                      </p>
                    ))}
                  </div>
                  {c.href && (
                    <a
                      href={c.href}
                      {...(c.external ? { target: "_blank", rel: "noreferrer" } : {})}
                      className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-700 hover:text-brand-800"
                    >
                      {c.cta}
                      <Icon.arrow />
                    </a>
                  )}
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* Form + address */}
      <section className="pb-16 lg:pb-24">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[1.15fr_1fr] lg:gap-14">
            <Reveal>
              <div className="rounded-4xl bg-white p-7 border border-slate-200 sm:p-10">
                <h2 className="text-2xl sm:text-3xl">{form.title}</h2>
                <p className="mt-3 text-[1.02rem] leading-relaxed text-slate-600">
                  {form.description}
                </p>
                <div className="mt-8">
                  <ContactForm />
                </div>
              </div>
            </Reveal>

            <Reveal delay={120}>
              <div className="sticky top-28 space-y-5">
                <div className="rounded-4xl bg-brand-950 p-8 text-white">
                  <h2 className="text-xl text-white">{address.title}</h2>
                  <p className="mt-4 flex gap-3 text-[1.02rem] leading-relaxed text-brand-100/80">
                    <Icon.pin className="mt-1 size-5 shrink-0 text-brand-400" />
                    {site.address}
                  </p>
                  <a
                    href={mapHref}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-6 inline-flex items-center gap-2 rounded-full bg-white/10 px-5 py-2.5 text-sm font-semibold text-white ring-1 ring-inset ring-white/20 transition hover:bg-white/20"
                  >
                    {address.mapLabel}
                    <Icon.arrow />
                  </a>
                </div>

                <div className="overflow-hidden rounded-4xl border border-slate-200">
                  <iframe
                    src={mapEmbed}
                    title={`${address.mapTitlePrefix} ${site.name}`}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    className="h-[22rem] w-full border-0"
                  />
                </div>
              </div>
            </Reveal>
          </div>
        </Container>
      </section>
    </>
  );
}
