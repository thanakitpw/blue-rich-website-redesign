import Image from "next/image";
import Hero from "@/components/home/Hero";
import Reveal from "@/components/ui/Reveal";
import { Button, Icon, MoreLink, SectionHeading } from "@/components/ui";
import { CategoryCard, FeatureCard, MoreCard, NewsCard, ProductCard } from "@/components/cards";
import {
  AboutBand,
  Faq,
  LineCta,
  Section,
  StandardsBand,
  ValueBlock,
  WorksGrid,
} from "@/components/concept";
import { categories, getProduct, products } from "@/data/products";
import { articles } from "@/data/news";
import { projects } from "@/data/projects";
import { homeFaqs } from "@/data/faq";

/**
 * Home page — section order and component styling ported from the approved
 * Concept B mock-up at `public/concept-b/index.html`:
 *
 *   hero slider + duo + trust ribbon → best sellers → categories →
 *   value block → standards → works → about band → LINE CTA →
 *   articles → FAQ
 *
 * The eight category tiles now point at the client's new menu structure
 * instead of at query-string filters.
 */

const flagship = getProduct("neocoat-intumescent-paint-s")!;

const bestSellerSlugs = [
  "neocoat-intumescent-paint-w",
  "neocoat-primer-grey-oxide",
  "fiberglass-cloth",
  "thinner-3a-intanin",
  "roof-shield-ceramic",
];

/** Concept B's eight tiles, re-pointed at the new section pages. */
const categoryTiles = [
  {
    href: "/intumescent",
    short: "Intumescent Paint",
    name: "สีกันไฟ",
    description: "Neocoat Intumescent Paint-S · Solvent Base และสูตรน้ำ Low VOC",
    image: "/assets/products/neocoat-paint-s.png",
  },
  {
    href: "/paint#steel-primer",
    short: "Primer & Top Coat",
    name: "สีรองพื้น / ทับหน้า",
    description: "Neocoat Primer Grey Oxide · Neogloss สีน้ำมันทาเหล็ก",
    image: "/assets/products/neocoat-primer.png",
  },
  {
    href: "/products/fiberglass-cloth",
    short: "Fire Blanket",
    name: "ผ้ากันไฟ",
    description: "Fiberglass Cloth ผ้ากันไฟ / กันสะเก็ดไฟ 550–1000°C",
    image: "/assets/products/fiberglass-cloth-panel-main.webp",
  },
  {
    href: "/hardware",
    short: "Thinner & Turpentine",
    name: "ทินเนอร์ / น้ำมันสน",
    description: "ทินเนอร์ 3A ผสมสี อินทนิล · ทินเนอร์ 2K · น้ำมันสน",
    image: "/assets/products/thinner-3a-intanin.webp",
  },
  {
    href: "/products/roof-shield-ceramic",
    short: "Ceramic Coating",
    name: "เซรามิคสะท้อนร้อน",
    description: "Roof Shield สีเซรามิคสะท้อนความร้อน ลดอุณหภูมิใต้หลังคา",
    image: "/assets/products/roof-shield.png",
  },
  {
    href: "/paint#emulsion",
    short: "Emulsion Paint",
    name: "สีน้ำพลาสติก",
    description: "Four Plus ทาภายใน / ภายนอก และสีรองพื้นปูน",
    image: "/assets/products/four-plus-exterior.webp",
  },
  {
    href: "/fireproofing/certification",
    short: "Engineering Service",
    name: "วิศวกรรับรองงานสีกันไฟ",
    description: "จัดทำเอกสาร น.4-5 / น.4-9 รับรองโดยวุฒิวิศวกรโยธา",
    image: "/assets/service-certification.jpg",
    photo: true,
  },
  {
    href: "/fireproofing/supervision",
    short: "Site Supervision",
    name: "วิศวกรควบคุมสีกันไฟ",
    description: "ตรวจหน้างาน วัดความหนาฟิล์ม และบันทึกผลเป็นหลักฐาน",
    image: "/assets/service-supervision.jpg",
    photo: true,
  },
];

const valuePoints = [
  "ฟิล์มสีขยายตัวเป็นฉนวนเมื่อโดนความร้อน",
  "คำนวณความหนาฟิล์มตามค่า Section Factor รายชิ้น",
  "ตรวจวัดความหนาฟิล์มทั้งขณะเปียกและเมื่อแห้ง",
  "ปิดงานด้วยเอกสารรับรองจากวุฒิวิศวกรโยธา",
];

export default function HomePage() {
  const bestSellers = bestSellerSlugs
    .map((s) => getProduct(s))
    .filter((p): p is NonNullable<typeof p> => Boolean(p));
  const latest = articles.slice(0, 3);
  const showcase = projects.slice(0, 8);

  return (
    <>
      <Hero />

      {/* ------------------------------------------------------ Best sellers */}
      <Section id="products">
        <Reveal>
          <SectionHeading
            title="สินค้าขายดี"
            action={<MoreLink href="/products">ดูสินค้าทั้งหมด</MoreLink>}
          />
        </Reveal>

        <div className="mt-[26px] grid gap-[26px] lg:grid-cols-[330px_1fr]">
          <Reveal>
            <FeatureCard product={flagship} />
          </Reveal>
          <div className="grid grid-cols-2 gap-[18px] lg:grid-cols-3">
            {bestSellers.map((p, i) => (
              <Reveal key={p.slug} delay={i * 60}>
                <ProductCard product={p} />
              </Reveal>
            ))}
            <Reveal delay={bestSellers.length * 60}>
              <MoreCard note={`${products.length} รายการ · ${categories.length} หมวดหมู่`} />
            </Reveal>
          </div>
        </div>
      </Section>

      {/* -------------------------------------------------------- Categories */}
      <Section id="categories" tone="shell">
        <Reveal>
          <SectionHeading
            title="เลือกสินค้าตามลักษณะงาน"
            action={<MoreLink href="/products">ดูสินค้าทั้งหมด</MoreLink>}
          />
        </Reveal>
        <div className="mt-[26px] grid grid-cols-2 gap-[18px] lg:grid-cols-4">
          {categoryTiles.map((c, i) => (
            <Reveal key={c.href} delay={(i % 4) * 60}>
              <CategoryCard {...c} />
            </Reveal>
          ))}
        </div>
      </Section>

      {/* -------------------------------------------------------- Value block */}
      <Section id="certify">
        <Reveal>
          <ValueBlock points={valuePoints} />
        </Reveal>
      </Section>

      {/* ---------------------------------------------------------- Standards */}
      <Section tone="shell">
        <Reveal>
          <StandardsBand />
        </Reveal>
      </Section>

      {/* -------------------------------------------------------------- Works */}
      <Section id="works">
        <Reveal>
          <SectionHeading
            title="ผลงานที่ผ่านมาของเรา"
            action={<MoreLink href="/projects">ผลงานทั้งหมด</MoreLink>}
          />
        </Reveal>
        <div className="mt-[26px]">
          <WorksGrid items={showcase} />
        </div>
      </Section>

      {/* -------------------------------------------------------------- About */}
      <AboutBand />

      {/* ------------------------------------------------------------ Contact */}
      <Section id="contact">
        <LineCta />
      </Section>

      {/* ----------------------------------------------------------- Articles */}
      <Section id="articles" tone="shell">
        <Reveal>
          <SectionHeading
            title="บทความสาระน่ารู้"
            action={<MoreLink href="/news">บทความทั้งหมด</MoreLink>}
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
            <div className="text-sm text-slate-500">รวบรวม</div>
            <h2 className="mb-[18px] text-[clamp(21px,2.4vw,28px)]">คำถามที่พบบ่อย?</h2>
            <div className="relative aspect-4/3 overflow-hidden rounded-3xl">
              <Image
                src="/assets/faq-home.jpg"
                alt="งานทาสีกันไฟโครงสร้างเหล็ก"
                fill
                sizes="(min-width: 1024px) 40vw, 92vw"
                className="object-cover"
              />
            </div>
            <div className="mt-5 flex flex-wrap gap-2.5">
              <Button href="/contact" variant="accent">
                <Icon.doc className="size-4" />
                ขอใบเสนอราคา
              </Button>
              <Button href="/products" variant="ghost">
                ดูสินค้าทั้งหมด
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
