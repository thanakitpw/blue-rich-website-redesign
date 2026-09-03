import type { Metadata } from "next";
import { Container, Icon, PageHero } from "@/components/ui";
import Reveal from "@/components/ui/Reveal";
import ContactForm from "@/components/ContactForm";
import { lineHref, lineHref2, mailHref, mapEmbed, mapHref, site, telHref } from "@/data/site";

export const metadata: Metadata = {
  title: "ติดต่อเรา",
  description: `ติดต่อ ${site.name} โทร ${site.phones.join(", ")} อีเมล ${site.email} LINE ID ${site.lineId}`,
};

export default function ContactPage() {
  const channels = [
    {
      icon: Icon.phone,
      label: "โทรศัพท์",
      lines: site.phones,
      href: telHref,
      cta: "โทรออก",
    },
    {
      icon: Icon.line,
      label: "LINE",
      lines: [`ID : ${site.lineId}`],
      href: lineHref,
      cta: "เปิด LINE",
      external: true,
    },
    {
      icon: Icon.line,
      label: "LINE ช่องทางที่ 2",
      lines: ["กดเพิ่มเพื่อนได้ทันที"],
      href: lineHref2,
      cta: "เปิด LINE",
      external: true,
    },
    {
      icon: Icon.mail,
      label: "อีเมล",
      lines: [site.email],
      href: mailHref,
      cta: "ส่งอีเมล",
    },
    {
      icon: Icon.clock,
      label: "เวลาทำการ",
      lines: [site.hours],
    },
  ];

  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="ติดต่อเรา"
        description="ฝ่ายขายและทีมวิศวกรพร้อมให้คำปรึกษาเรื่องระบบสีกันไฟ ปริมาณที่ต้องใช้ และเอกสารรับรอง โดยไม่มีค่าใช้จ่าย"
        breadcrumb={[{ label: "หน้าแรก", href: "/" }, { label: "ติดต่อเรา" }]}
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
                <h2 className="text-2xl sm:text-3xl">ส่งรายละเอียดงานให้เราประเมิน</h2>
                <p className="mt-3 text-[1.02rem] leading-relaxed text-slate-600">
                  กรอกข้อมูลด้านล่าง ทีมงานจะติดต่อกลับภายใน 1 วันทำการ
                  หากมีแบบโครงสร้างหรือ BOQ สามารถแนบไฟล์มาทางอีเมลหรือ LINE ได้เลย
                </p>
                <div className="mt-8">
                  <ContactForm />
                </div>
              </div>
            </Reveal>

            <Reveal delay={120}>
              <div className="sticky top-28 space-y-5">
                <div className="rounded-4xl bg-brand-950 p-8 text-white">
                  <h2 className="text-xl text-white">ที่อยู่บริษัท</h2>
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
                    เปิดใน Google Maps
                    <Icon.arrow />
                  </a>
                </div>

                <div className="overflow-hidden rounded-4xl border border-slate-200">
                  <iframe
                    src={mapEmbed}
                    title={`แผนที่ ${site.name}`}
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
