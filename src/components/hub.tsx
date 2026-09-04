import Image from "next/image";
import Link from "next/link";
import { Button, Container, Icon, SectionHeading } from "@/components/ui";
import { CatalogGrid, CatalogSidebar } from "@/components/catalog";
import { Faq } from "@/components/concept";
import Reveal from "@/components/ui/Reveal";
import type { Product } from "@/data/products";
import { lineHrefOf } from "@/data/site";
import { getSiteInfo } from "@/lib/cms/content";

/* ------------------------------------------------------------- ProductRow */

/**
 * A single product presented as a full-width band — picture on one side,
 * quick specs on the other. Used by the category hubs where each product
 * deserves more room than the grid card gives it.
 */
export async function ProductRow({
  product,
  id,
  eyebrow,
  flip = false,
  children,
}: {
  product: Product;
  id?: string;
  eyebrow?: string;
  flip?: boolean;
  children?: React.ReactNode;
}) {
  const lineHref = lineHrefOf(await getSiteInfo());
  return (
    <div id={id} className="scroll-mt-40">
      <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-14">
        <Reveal className={flip ? "lg:order-2" : ""}>
          <div className="relative overflow-hidden rounded-4xl border border-slate-200 bg-white p-8">
            <div className="relative mx-auto aspect-square w-full max-w-sm">
              <Image
                src={product.image}
                alt={product.name}
                fill
                sizes="(min-width: 1024px) 28rem, 80vw"
                className="object-contain mix-blend-multiply"
              />
            </div>
          </div>
        </Reveal>

        <Reveal delay={100} className={flip ? "lg:order-1" : ""}>
          {eyebrow && (
            <span className="inline-flex items-center gap-2 rounded-full bg-brand-600 px-3.5 py-1.5 text-xs font-semibold text-white">
              {eyebrow}
            </span>
          )}
          <h3 className="mt-4 text-2xl leading-snug sm:text-3xl">{product.name}</h3>
          <p className="mt-4 leading-relaxed text-slate-600">{product.tagline}</p>

          <dl className="mt-7 grid gap-px overflow-hidden rounded-2xl bg-brand-100 border border-slate-200 sm:grid-cols-2">
            {product.quickSpecs.map((s) => (
              <div key={s.label} className="bg-white px-4 py-3">
                <dt className="text-[0.8rem] text-slate-500">{s.label}</dt>
                <dd className="mt-0.5 font-display text-[1.02rem] font-semibold text-brand-700">
                  {s.value}
                </dd>
              </div>
            ))}
          </dl>

          {children}

          <div className="mt-7 flex flex-wrap gap-3">
            <Button href={`/products/${product.slug}`}>
              ดูรายละเอียดสินค้า
              <Icon.arrow />
            </Button>
            <Button href={lineHref} variant="line">
              <Icon.line />
              สอบถามราคา
            </Button>
          </div>
        </Reveal>
      </div>
    </div>
  );
}

/* ----------------------------------------------------------- CatalogSection
 * The archive layout the client referenced: a category rail on the left and a
 * sorted product grid on the right, with room for the page's editorial blocks
 * underneath the grid.
 */

export function CatalogSection({
  products,
  columns = 3,
  children,
}: {
  products: Product[];
  columns?: 2 | 3;
  children?: React.ReactNode;
}) {
  return (
    <section className="py-[38px] lg:py-[52px]">
      <Container>
        <div className="grid gap-8 lg:grid-cols-[262px_1fr] lg:gap-10">
          <CatalogSidebar />
          <div className="min-w-0">
            <CatalogGrid products={products} columns={columns} />
            {children}
          </div>
        </div>
      </Container>
    </section>
  );
}

/* ------------------------------------------------------------- MiniProduct */

/** Compact product tile for the “related / also in this group” rows. */
export function MiniProduct({ product }: { product: Product }) {
  return (
    <Link
      href={`/products/${product.slug}`}
      className="group flex items-center gap-4 rounded-3xl bg-white p-4 border border-slate-200 transition hover:-translate-y-0.5 hover:border-brand-200 hover:shadow-[0_20px_40px_-26px_rgba(12,39,64,0.5)]"
    >
      <span className="relative size-20 shrink-0 overflow-hidden rounded-2xl">
        <Image
          src={product.image}
          alt=""
          fill
          sizes="80px"
          className="object-contain p-2 mix-blend-multiply"
        />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-[17px] leading-snug font-semibold text-brand-700">
          {product.name}
        </span>
        <span className="mt-1 block text-[0.88rem] text-slate-500">{product.cardSummary}</span>
      </span>
      <Icon.arrow className="shrink-0 text-brand-500 transition-transform group-hover:translate-x-1" />
    </Link>
  );
}

/* ---------------------------------------------------------- CoatingDiagram */

/**
 * Cross-section of the three-coat system, drawn rather than photographed so
 * the layer names and the intumescent char reaction stay legible at any size.
 */
export function CoatingDiagram() {
  const layers = [
    { y: 132, h: 26, fill: "var(--color-brand-800)", label: "เหล็กโครงสร้าง", en: "Steel" },
    { y: 112, h: 20, fill: "var(--color-brand-500)", label: "สีรองพื้นกันสนิม", en: "Primer" },
    { y: 84, h: 28, fill: "var(--color-brand-300)", label: "สีกันไฟ Neocoat", en: "Intumescent" },
    { y: 72, h: 12, fill: "var(--color-brand-600)", label: "สีทับหน้า", en: "Top coat" },
  ];

  return (
    <svg
      viewBox="0 0 520 210"
      className="h-auto w-full"
      role="img"
      aria-label="ภาพตัดขวางระบบสีกันไฟ — เหล็ก สีรองพื้นกันสนิม สีกันไฟ และสีทับหน้า"
    >
      {/* Normal state */}
      <text x="10" y="26" className="fill-brand-900" fontSize="13" fontWeight="600">
        สภาวะปกติ
      </text>
      {layers.map((l) => (
        <rect key={l.label} x="10" y={l.y} width="200" height={l.h} rx="3" fill={l.fill} />
      ))}
      {layers.map((l, i) => (
        <g key={`${l.label}-label`}>
          <line
            x1="212"
            y1={l.y + l.h / 2}
            x2="238"
            y2={l.y + l.h / 2}
            stroke="var(--color-brand-300)"
            strokeWidth="1"
          />
          <text
            x="242"
            y={l.y + l.h / 2 + 1}
            fontSize="10.5"
            className="fill-brand-900"
            fontWeight={i === 2 ? "700" : "500"}
          >
            {l.label}
          </text>
          <text x="242" y={l.y + l.h / 2 + 12} fontSize="8.5" className="fill-slate-500">
            {l.en}
          </text>
        </g>
      ))}

      {/* Reacted state */}
      <text x="330" y="26" className="fill-brand-900" fontSize="13" fontWeight="600">
        เมื่อโดนความร้อน
      </text>
      <rect x="330" y="132" width="170" height="26" rx="3" fill="var(--color-brand-800)" />
      <rect x="330" y="112" width="170" height="20" rx="3" fill="var(--color-brand-500)" />
      <path
        d="M330 112c14-8 8-26 22-32s10 20 24 12 8-30 24-34 10 26 26 20 12-24 26-20 8 22 22 26 8 12 6 28Z"
        fill="var(--color-brand-200)"
        stroke="var(--color-brand-400)"
        strokeWidth="1.5"
      />
      <text x="336" y="176" fontSize="10" className="fill-slate-600">
        ฟิล์มพองตัวเป็นชั้นถ่าน (char) หนาขึ้นหลายสิบเท่า
      </text>
      <text x="336" y="190" fontSize="10" className="fill-slate-600">
        หน่วงความร้อนไม่ให้ถึงเนื้อเหล็ก
      </text>

      {/* Heat arrows */}
      {[352, 386, 420, 454].map((x) => (
        <path
          key={x}
          d={`M${x} 40v18m0 0-5-6m5 6 5-6`}
          stroke="var(--color-accent-500)"
          strokeWidth="1.8"
          strokeLinecap="round"
          fill="none"
        />
      ))}
    </svg>
  );
}

/* -------------------------------------------------------------- StepList */

export function StepList({
  steps,
}: {
  steps: { title: string; body: string }[];
}) {
  return (
    <ol className="grid gap-5 md:grid-cols-2">
      {steps.map((s, i) => (
        <Reveal key={s.title} delay={i * 80}>
          <li className="h-full rounded-3xl bg-white p-7 border border-slate-200">
            <span className="grid size-10 place-items-center rounded-2xl bg-brand-600 font-display text-sm font-bold text-white">
              {String(i + 1).padStart(2, "0")}
            </span>
            <h3 className="mt-4 text-lg leading-snug">{s.title}</h3>
            <p className="mt-2.5 text-sm leading-relaxed text-slate-600">{s.body}</p>
          </li>
        </Reveal>
      ))}
    </ol>
  );
}

/* ---------------------------------------------------------------- FaqList
 * Kept as a named export for the pages that already use it; the styling is
 * Concept B's accordion.
 */

export function FaqList({ items }: { items: { q: string; a: string }[] }) {
  return (
    <div className="mx-auto max-w-3xl">
      <Faq items={items} />
    </div>
  );
}

export { Section, CtaBand } from "@/components/concept";
export { SectionHeading };
