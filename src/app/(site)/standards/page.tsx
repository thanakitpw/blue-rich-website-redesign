import type { Metadata } from "next";
import Image from "next/image";
import { Icon, PageHero } from "@/components/ui";
import Reveal from "@/components/ui/Reveal";
import { CtaBand, Section } from "@/components/concept";
import { getSiteInfo, getStandards } from "@/lib/cms/content";
import { copyFor } from "@/lib/cms/copy-pages";

export async function generateMetadata(): Promise<Metadata> {
  const [site, standards, { meta, metaDescriptionPrefix }] = await Promise.all([
    getSiteInfo(),
    getStandards(),
    copyFor("standards"),
  ]);
  return {
    title: meta.title,
    description: `${metaDescriptionPrefix} ${site.shortName} อ้างอิง — ${standards
      .map((s) => s.label)
      .join(" · ")}`,
  };
}

/**
 * หน้ามาตรฐาน — หนึ่งบล็อกต่อหนึ่งมาตรฐาน สลับซ้ายขวาไปเรื่อยๆ
 * บล็อกแรกข้อความซ้าย/รูปขวา บล็อกที่สองกลับด้าน ตามที่ลูกค้าสั่ง
 *
 * เนื้อหาทั้งหมดมาจาก site_settings.standards แก้ได้ที่ /admin/menu
 * รูปตอนนี้ยังเป็นรูป mock จากคลังรูปเดิม รอรูปจริงจากลูกค้า
 */
export default async function StandardsPage() {
  const [standards, { hero, cta }] = await Promise.all([getStandards(), copyFor("standards")]);

  return (
    <>
      {/* ไม่ส่ง description — ลูกค้าขอตัดย่อหน้าเกริ่นใต้หัวข้อออก (ดู data/pages/standards.ts) */}
      <PageHero
        eyebrow={hero.eyebrow}
        title={hero.title}
        breadcrumb={[{ label: "หน้าแรก", href: "/" }, { label: hero.crumb }]}
      />

      {standards.map((s, i) => {
        /* คู่/คี่สลับกัน — ใบแรกรูปอยู่ขวา ใบที่สองรูปอยู่ซ้าย */
        const imageRight = i % 2 === 0;
        return (
          <Section key={s.slug || s.label} id={s.slug} tone={i % 2 === 0 ? "plain" : "shell"}>
            <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-14">
              <Reveal className={imageRight ? "" : "lg:order-2"}>
                <p className="eyebrow-en text-xs text-accent-500">{s.eyebrow}</p>
                <h2 className="mt-1.5 text-[clamp(21px,2.5vw,30px)]">{s.title}</h2>
                <p className="mt-2 text-sm font-semibold text-brand-600">{s.note}</p>

                <div className="mt-5 space-y-4 text-[1.02rem] leading-relaxed text-slate-600">
                  {s.body.map((p) => (
                    <p key={p}>{p}</p>
                  ))}
                </div>

                {s.points.length > 0 && (
                  <ul className="mt-6 space-y-2.5">
                    {s.points.map((p) => (
                      <li key={p} className="flex items-start gap-3">
                        <span className="mt-0.5 grid size-[26px] shrink-0 place-items-center rounded-full bg-brand-600 text-white">
                          <Icon.check className="size-[14px]" />
                        </span>
                        <span className="text-[1.02rem] text-brand-800">{p}</span>
                      </li>
                    ))}
                  </ul>
                )}

                {s.docs && s.docs.length > 0 && (
                  <div className="mt-6 flex flex-wrap gap-2.5">
                    {s.docs.map((d) => (
                      <a
                        key={d.href}
                        href={d.href}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-brand-700 border border-slate-200 transition hover:border-brand-300 hover:text-brand-800"
                      >
                        <Icon.doc className="size-4" />
                        {d.label}
                      </a>
                    ))}
                  </div>
                )}
              </Reveal>

              <Reveal delay={100} className={imageRight ? "" : "lg:order-1"}>
                {/* สแกนเอกสารเป็นแนวตั้ง ต้องเห็นทั้งแผ่น จึงใช้ contain บนพื้นขาว
                    ส่วนรูปถ่ายทั่วไปยังครอบเต็มกรอบเหมือนเดิม */}
                <div
                  className={`relative aspect-4/3 overflow-hidden rounded-4xl border border-slate-200 ${
                    s.fit === "contain" ? "bg-white" : "bg-brand-800"
                  }`}
                >
                  {s.image && (
                    <Image
                      src={s.image}
                      alt={s.label}
                      fill
                      sizes="(min-width: 1024px) 48vw, 92vw"
                      className={s.fit === "contain" ? "object-contain p-4" : "object-cover"}
                    />
                  )}
                </div>
              </Reveal>
            </div>
          </Section>
        );
      })}

      <CtaBand title={cta.title} description={cta.description} />
    </>
  );
}
