import Image from "next/image";
import Link from "next/link";
import { Icon } from "@/components/ui";
import type { Product } from "@/data/products";
import type { Article } from "@/data/news";

/* --------------------------------------------------------------- ProductCard
 * Concept B's `.p-card`. The concept mocked up SKU codes; the real catalogue
 * has none, so the category name sits in that slot instead.
 */

export function ProductCard({ product }: { product: Product }) {
  return (
    <Link
      href={`/products/${product.slug}`}
      className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white transition-all duration-200 hover:-translate-y-0.5 hover:border-brand-200 hover:shadow-[0_8px_24px_rgba(42,80,104,0.07)]"
    >
      <div className="relative grid aspect-[1/0.86] flex-none place-items-center p-3.5">
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 45vw, 90vw"
          className="object-contain p-4 mix-blend-multiply transition-transform duration-500 group-hover:scale-[1.04]"
        />
        {product.bestSeller && (
          <span className="absolute top-2.5 left-2.5 z-3 rounded-full bg-brand-600 px-2.5 py-[3px] text-[12px] font-medium text-white">
            ขายดี
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col px-[15px] pt-[13px] pb-[17px]">
        <h3 className="text-[17px] leading-[1.4] font-semibold text-brand-700">
          {product.name}
        </h3>
        <p className="mt-2 line-clamp-2 text-[13.5px] leading-[1.7] text-slate-500">
          {product.cardSummary}
        </p>
        <div className="mt-auto pt-3.5">
          <span className="inline-flex items-center gap-1 text-[13.5px] font-semibold text-brand-600">
            รายละเอียด
            <Icon.arrow className="size-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
          </span>
        </div>
      </div>
    </Link>
  );
}

/* -------------------------------------------------------------- FeatureCard
 * Concept B's `.feature-card` — the flagship product beside the grid, with an
 * accent corner pill.
 */

export function FeatureCard({ product, pill }: { product: Product; pill?: string }) {
  return (
    <Link
      href={`/products/${product.slug}`}
      className="group relative flex h-full flex-col overflow-hidden rounded-3xl border-[1.5px] border-brand-200 bg-white transition hover:shadow-[0_10px_28px_rgba(42,80,104,0.09)]"
    >
      {pill && (
        <span className="absolute top-3 right-3 z-3 grid size-[58px] place-content-center rounded-full bg-accent-500 text-center text-[12px] leading-[1.25] font-medium text-white shadow-[0_4px_12px_rgba(32,108,164,0.32)]">
          {pill}
        </span>
      )}
      <div className="relative grid min-h-[260px] flex-1 place-items-center p-[22px]">
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(min-width: 1024px) 330px, 90vw"
          className="object-contain p-8 mix-blend-multiply transition-transform duration-500 group-hover:scale-[1.03]"
        />
      </div>
      <div className="px-[18px] pt-4 pb-5">
        <h3 className="text-[20px] leading-[1.35] font-semibold text-brand-700">
          {product.name}
        </h3>
        <p className="mt-2 line-clamp-3-b text-[14px] leading-[1.7] text-slate-500">
          {product.tagline}
        </p>
        <div className="mt-3.5">
          <span className="inline-flex items-center gap-1 text-[13.5px] font-semibold text-brand-600">
            สอบถามราคา
            <Icon.arrow className="size-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
          </span>
        </div>
      </div>
    </Link>
  );
}

/* ------------------------------------------------------------- CategoryCard
 * Concept B's `.cat-card` — sky photo panel, uppercase English label, Thai
 * heading, one-line description.
 */

export function CategoryCard({
  href,
  name,
  short,
  description,
  image,
  photo = false,
}: {
  href: string;
  name: string;
  short: string;
  description: string;
  image: string;
  /** Fill the panel with the image instead of blending a cut-out onto white. */
  photo?: boolean;
}) {
  return (
    <Link
      href={href}
      className="group flex h-full flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white transition hover:border-brand-200 hover:shadow-[0_8px_24px_rgba(42,80,104,0.07)]"
    >
      <div
        className={`relative aspect-[1/0.72] flex-none overflow-hidden ${
          photo ? "bg-brand-800" : "grid place-items-center bg-white p-4"
        }`}
      >
        <Image
          src={image}
          alt=""
          fill
          sizes="(min-width: 1024px) 25vw, 45vw"
          className={`transition-transform duration-500 group-hover:scale-[1.04] ${
            photo ? "object-cover" : "object-contain p-6 mix-blend-multiply"
          }`}
        />
      </div>
      <div className="px-4 pt-3.5 pb-[18px]">
        <span className="eyebrow-en block text-[12px] tracking-[0.07em] text-brand-400">
          {short}
        </span>
        <h3 className="mt-px mb-[5px] text-[18px] font-semibold transition group-hover:text-brand-600">
          {name}
        </h3>
        <p className="text-[13.5px] leading-[1.65] text-slate-500">{description}</p>
      </div>
    </Link>
  );
}

/* ---------------------------------------------------------------- MoreCard
 * Fills the last cell of a product grid with a link to the full catalogue,
 * so a row is never left with a hole in it.
 */

export function MoreCard({
  href = "/products",
  label = "ดูสินค้าทั้งหมด",
  note,
}: {
  href?: string;
  label?: string;
  note?: string;
}) {
  return (
    <Link
      href={href}
      className="group flex h-full min-h-[16rem] flex-col items-center justify-center gap-4 rounded-3xl border border-dashed border-brand-200 bg-brand-50/60 p-8 text-center transition hover:border-brand-600 hover:bg-brand-50"
    >
      <span className="grid size-14 place-items-center rounded-full bg-white text-brand-600 shadow-[0_4px_14px_rgba(42,80,104,0.10)] transition group-hover:bg-brand-600 group-hover:text-white">
        <Icon.arrow className="size-6" />
      </span>
      <span className="text-[18px] font-semibold text-brand-700">{label}</span>
      {note && <span className="text-[14px] text-slate-500">{note}</span>}
    </Link>
  );
}

/* ------------------------------------------------------------------ NewsCard
 * Concept B's `.art`.
 */

export function NewsCard({ article, featured = false }: { article: Article; featured?: boolean }) {
  return (
    <Link
      href={`/news/${article.slug}`}
      className={`group flex overflow-hidden rounded-3xl border border-slate-200 bg-white transition-all duration-200 hover:border-brand-200 hover:shadow-[0_8px_24px_rgba(42,80,104,0.08)] ${
        featured ? "flex-col md:flex-row" : "flex-col"
      }`}
    >
      <div
        className={`relative overflow-hidden bg-slate-50 ${
          featured ? "aspect-16/10 md:aspect-auto md:w-[46%]" : "aspect-16/10"
        }`}
      >
        <Image
          src={article.image}
          alt=""
          fill
          sizes={featured ? "(min-width: 768px) 45vw, 90vw" : "(min-width: 1024px) 33vw, 90vw"}
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>

      <div className={`flex flex-1 flex-col px-[17px] pt-[15px] pb-[18px] ${featured ? "md:p-7" : ""}`}>
        <span className="block text-[12px] font-medium tracking-[0.04em] text-accent-500">
          {article.tag}
        </span>
        <h3
          className={`mt-1 mb-[7px] leading-[1.5] font-medium transition group-hover:text-brand-600 ${
            featured ? "text-xl md:text-2xl" : "text-[17px]"
          }`}
        >
          {article.title}
        </h3>
        <p
          className={`text-[13.5px] leading-[1.7] text-slate-500 ${
            featured ? "line-clamp-4" : "line-clamp-2"
          }`}
        >
          {article.excerpt}
        </p>
        <div className="mt-auto flex items-center gap-1.5 pt-3 text-xs text-slate-500">
          <Icon.clock className="size-3.5" />
          <time dateTime={article.date}>{article.dateLabel}</time>
        </div>
      </div>
    </Link>
  );
}
