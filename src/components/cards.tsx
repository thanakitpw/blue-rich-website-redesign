import Image from "next/image";
import Link from "next/link";
import { Icon } from "@/components/ui";
import type { Product } from "@/data/products";
import type { Article } from "@/data/news";
import { categories } from "@/data/products";

export function ProductCard({ product }: { product: Product }) {
  const cat = categories.find((c) => c.slug === product.category);

  return (
    <Link
      href={`/products/${product.slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-3xl bg-white ring-1 ring-slate-200/80 transition-all duration-300 hover:-translate-y-1 hover:ring-brand-300 hover:shadow-[0_24px_48px_-24px_rgba(12,36,56,0.35)]"
    >
      <div className="relative aspect-4/3 overflow-hidden bg-gradient-to-br from-brand-50 to-slate-50">
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 45vw, 90vw"
          className="object-contain p-6 transition-transform duration-500 group-hover:scale-105"
        />
        {product.bestSeller && (
          <span className="absolute top-4 left-4 rounded-full bg-flame-500 px-3 py-1 text-[0.68rem] font-bold text-white shadow-sm">
            ขายดี
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-5">
        <span className="text-[0.7rem] font-semibold tracking-wide text-brand-500">
          {cat?.name} · {product.code}
        </span>
        <h3 className="mt-2 line-clamp-2 text-[1.05rem] leading-snug transition group-hover:text-brand-700">
          {product.name}
        </h3>
        <p className="mt-2 line-clamp-2 flex-1 text-sm text-slate-500">{product.tagline}</p>
        <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-700">
          ดูรายละเอียด
          <Icon.arrow className="transition-transform duration-300 group-hover:translate-x-1" />
        </span>
      </div>
    </Link>
  );
}

export function CategoryCard({
  slug,
  name,
  short,
  description,
  image,
  count,
}: {
  slug: string;
  name: string;
  short: string;
  description: string;
  image: string;
  count: number;
}) {
  return (
    <Link
      href={`/products?cat=${slug}`}
      className="group relative flex flex-col overflow-hidden rounded-4xl bg-brand-950 p-7 text-white transition-all duration-300 hover:-translate-y-1"
    >
      <Image
        src={image}
        alt=""
        fill
        sizes="(min-width: 1024px) 25vw, 90vw"
        className="object-cover opacity-20 transition-all duration-700 group-hover:scale-110 group-hover:opacity-30"
      />
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-t from-brand-950 via-brand-950/85 to-brand-900/60"
      />
      <div className="relative flex min-h-[15rem] flex-col">
        <span className="text-xs font-semibold tracking-[0.15em] text-brand-300 uppercase">
          {short}
        </span>
        <h3 className="mt-2 text-xl text-white">{name}</h3>
        <p className="mt-3 line-clamp-3 flex-1 text-sm leading-relaxed text-brand-100/70">
          {description}
        </p>
        <div className="mt-5 flex items-center justify-between border-t border-white/10 pt-4">
          <span className="text-xs text-brand-200/70">{count} รายการ</span>
          <span className="grid size-9 place-items-center rounded-full bg-white/10 ring-1 ring-white/20 transition group-hover:bg-brand-500 group-hover:ring-brand-400">
            <Icon.arrow />
          </span>
        </div>
      </div>
    </Link>
  );
}

export function NewsCard({ article, featured = false }: { article: Article; featured?: boolean }) {
  return (
    <Link
      href={`/news/${article.slug}`}
      className={`group flex overflow-hidden rounded-3xl bg-white ring-1 ring-slate-200/80 transition-all duration-300 hover:-translate-y-1 hover:ring-brand-300 hover:shadow-[0_24px_48px_-24px_rgba(12,36,56,0.3)] ${
        featured ? "flex-col md:flex-row" : "flex-col"
      }`}
    >
      <div
        className={`relative overflow-hidden bg-slate-100 ${
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
        <span className="absolute top-4 left-4 rounded-full bg-white/95 px-3 py-1 text-[0.68rem] font-bold text-brand-700 backdrop-blur">
          {article.tag}
        </span>
      </div>

      <div className={`flex flex-1 flex-col p-6 ${featured ? "md:p-8" : ""}`}>
        <time dateTime={article.date} className="text-xs font-medium text-slate-400">
          {article.dateLabel}
        </time>
        <h3
          className={`mt-2 leading-snug transition group-hover:text-brand-700 ${
            featured ? "text-xl md:text-2xl" : "line-clamp-2 text-lg"
          }`}
        >
          {article.title}
        </h3>
        <p
          className={`mt-3 flex-1 text-sm leading-relaxed text-slate-500 ${
            featured ? "line-clamp-4" : "line-clamp-3"
          }`}
        >
          {article.excerpt}
        </p>
        <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-700">
          อ่านบทความ
          <Icon.arrow className="transition-transform duration-300 group-hover:translate-x-1" />
        </span>
      </div>
    </Link>
  );
}
