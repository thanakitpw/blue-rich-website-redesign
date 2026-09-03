import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

/* ----------------------------------------------------------------- Container
 * Concept B wraps content in `width: min(100% - 40px, 1180px)`.
 */

export function Container({
  className = "",
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={`mx-auto w-full max-w-[1180px] px-5 ${className}`}>{children}</div>
  );
}

/* ------------------------------------------------------------------- Button
 * Ported from Concept B's `.btn` — pill, 14px medium, 11/20 padding.
 */

type Variant = "primary" | "secondary" | "ghost" | "line" | "accent" | "outline";
type Size = "sm" | "md" | "lg";

const variants: Record<Variant, string> = {
  /* #206ca4 is the site's action colour — every solid button uses it. */
  primary: "bg-accent-500 text-white hover:bg-accent-600",
  accent: "bg-accent-500 text-white hover:bg-accent-600",
  line: "bg-[#06C755] text-white hover:brightness-[0.93]",
  /* `.btn-ghost` in Concept B: white pill with a hairline border */
  secondary:
    "bg-white text-accent-500 border border-slate-200 hover:border-accent-200 hover:bg-accent-50",
  ghost:
    "bg-white text-accent-500 border border-slate-200 hover:border-accent-200 hover:bg-accent-50",
  /* For use on dark photography / navy panels */
  outline: "bg-white/10 text-white border border-white/35 backdrop-blur hover:bg-white/20",
};

const sizes: Record<Size, string> = {
  sm: "px-4 py-2 text-[14px]",
  md: "px-5 py-[11px] text-sm",
  lg: "px-6 py-3 text-[16px]",
};

const base =
  "inline-flex items-center justify-center gap-2 rounded-full font-medium leading-none transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-500";

export function Button({
  variant = "primary",
  size = "md",
  className = "",
  href,
  children,
  ...rest
}: {
  variant?: Variant;
  size?: Size;
  className?: string;
  href?: string;
  children: ReactNode;
} & Omit<ComponentProps<"a">, "href">) {
  const cls = `${base} ${variants[variant]} ${sizes[size]} ${className}`;
  if (!href) return <span className={cls}>{children}</span>;
  const external =
    href.startsWith("http") || href.startsWith("tel:") || href.startsWith("mailto:");
  if (external)
    return (
      <a href={href} className={cls} {...rest}>
        {children}
      </a>
    );
  return (
    <Link href={href} className={cls}>
      {children}
    </Link>
  );
}

/* ------------------------------------------------------------------ Eyebrow
 * Concept B's italic uppercase English label. Orange on light, pale blue on
 * dark photography.
 */

export function Eyebrow({
  children,
  tone = "light",
}: {
  children: ReactNode;
  tone?: "light" | "dark";
}) {
  return (
    <span
      className={`eyebrow-en block text-[14px] ${
        tone === "light" ? "text-accent-500" : "text-brand-200"
      }`}
    >
      {children}
    </span>
  );
}

/* ------------------------------------------------------------ SectionHeading
 * Two variants from Concept B:
 *   align="left"   → `.sec-head`  — accent bar + hairline rule + "more" link
 *   align="center" → `.sec-title-center` — accent English line above the h2
 */

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  tone = "light",
  action,
}: {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  align?: "left" | "center";
  tone?: "light" | "dark";
  action?: ReactNode;
}) {
  if (align === "center") {
    return (
      <div className="text-center">
        {eyebrow && <Eyebrow tone={tone}>{eyebrow}</Eyebrow>}
        <h2
          className={`mt-0.5 text-[clamp(20px,2.3vw,27px)] ${tone === "dark" ? "text-white" : ""}`}
        >
          {title}
        </h2>
        {description && (
          <p
            className={`mx-auto mt-3 max-w-2xl text-sm leading-relaxed ${
              tone === "dark" ? "text-brand-100/75" : "text-slate-500"
            }`}
          >
            {description}
          </p>
        )}
        {action && <div className="mt-6 flex justify-center">{action}</div>}
      </div>
    );
  }

  return (
    <div>
      {eyebrow && <Eyebrow tone={tone}>{eyebrow}</Eyebrow>}
      <div
        className={`mt-1 flex items-center justify-between gap-4 border-b pb-[11px] ${
          tone === "dark" ? "border-white/15" : "border-slate-200"
        }`}
      >
        <h2 className={`rule-bar text-xl font-semibold ${tone === "dark" ? "text-white" : ""}`}>
          {title}
        </h2>
        {action && <div className="shrink-0">{action}</div>}
      </div>
      {description && (
        <p
          className={`mt-4 max-w-3xl text-sm leading-relaxed ${
            tone === "dark" ? "text-brand-100/75" : "text-slate-500"
          }`}
        >
          {description}
        </p>
      )}
    </div>
  );
}

/** The "ดูทั้งหมด →" link that sits on the right of a `.sec-head`. */
export function MoreLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link
      href={href}
      className="inline-flex items-center gap-1.5 text-[14.5px] text-slate-500 transition hover:text-accent-500"
    >
      {children}
      <Icon.arrow className="size-3.5" />
    </Link>
  );
}

/* -------------------------------------------------------------------- Icons
 * Feather-style 2px strokes, matching the icon set drawn in Concept B.
 */

type IconProps = ComponentProps<"svg">;

const stroke = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;

export const Icon = {
  arrow: ({ className = "", ...p }: IconProps) => (
    <svg viewBox="0 0 24 24" aria-hidden className={`size-4 ${className}`} {...stroke} {...p}>
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  ),
  chevronDown: ({ className = "", ...p }: IconProps) => (
    <svg viewBox="0 0 24 24" aria-hidden className={`size-4 ${className}`} {...stroke} {...p}>
      <path d="M6 9l6 6 6-6" />
    </svg>
  ),
  check: ({ className = "", ...p }: IconProps) => (
    <svg viewBox="0 0 24 24" aria-hidden className={`size-4 ${className}`} {...stroke} {...p}>
      <polyline points="20 6 9 17 4 12" />
    </svg>
  ),
  phone: ({ className = "", ...p }: IconProps) => (
    <svg viewBox="0 0 24 24" aria-hidden className={`size-4 ${className}`} {...stroke} {...p}>
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.35 1.9.66 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.9.31 1.85.53 2.81.66A2 2 0 0 1 22 16.92z" />
    </svg>
  ),
  mail: ({ className = "", ...p }: IconProps) => (
    <svg viewBox="0 0 24 24" aria-hidden className={`size-4 ${className}`} {...stroke} {...p}>
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="m3 7 9 6 9-6" />
    </svg>
  ),
  pin: ({ className = "", ...p }: IconProps) => (
    <svg viewBox="0 0 24 24" aria-hidden className={`size-4 ${className}`} {...stroke} {...p}>
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  ),
  clock: ({ className = "", ...p }: IconProps) => (
    <svg viewBox="0 0 24 24" aria-hidden className={`size-4 ${className}`} {...stroke} {...p}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </svg>
  ),
  shield: ({ className = "", ...p }: IconProps) => (
    <svg
      viewBox="0 0 24 24"
      aria-hidden
      className={`size-6 ${className}`}
      {...stroke}
      strokeWidth={1.6}
      {...p}
    >
      <path d="M12 2l8 4v6c0 5-3.4 8.7-8 10-4.6-1.3-8-5-8-10V6l8-4z" />
      <path d="M9 12l2 2 4-4" />
    </svg>
  ),
  doc: ({ className = "", ...p }: IconProps) => (
    <svg
      viewBox="0 0 24 24"
      aria-hidden
      className={`size-6 ${className}`}
      {...stroke}
      strokeWidth={1.6}
      {...p}
    >
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <path d="M9 15l2 2 4-4" />
    </svg>
  ),
  truck: ({ className = "", ...p }: IconProps) => (
    <svg
      viewBox="0 0 24 24"
      aria-hidden
      className={`size-6 ${className}`}
      {...stroke}
      strokeWidth={1.6}
      {...p}
    >
      <rect x="1" y="3" width="15" height="13" rx="1.5" />
      <path d="M16 8h4l3 3v5h-7z" />
      <circle cx="5.5" cy="18.5" r="2" />
      <circle cx="18.5" cy="18.5" r="2" />
    </svg>
  ),
  users: ({ className = "", ...p }: IconProps) => (
    <svg
      viewBox="0 0 24 24"
      aria-hidden
      className={`size-6 ${className}`}
      {...stroke}
      strokeWidth={1.6}
      {...p}
    >
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    </svg>
  ),
  flame: ({ className = "", ...p }: IconProps) => (
    <svg
      viewBox="0 0 24 24"
      aria-hidden
      className={`size-5 ${className}`}
      {...stroke}
      strokeWidth={1.7}
      {...p}
    >
      <path d="M12 2s5 4.5 5 9a5 5 0 0 1-10 0c0-2 1.2-3.6 2.4-4.6.2 1.6 1 2.4 1.8 2.4.9 0 1.4-.9.8-6.8z" />
      <path d="M12 22c2.8 0 5-1.9 5-4.4" />
    </svg>
  ),
  line: ({ className = "", ...p }: IconProps) => (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className={`size-4 ${className}`} {...p}>
      <path d="M12 2C6.48 2 2 5.66 2 10.16c0 4.03 3.55 7.4 8.35 8.04.33.07.77.22.88.5.1.26.07.66.03.92l-.14.85c-.04.25-.2.98.86.54 1.06-.45 5.71-3.36 7.79-5.76C21.13 13.68 22 12 22 10.16 22 5.66 17.52 2 12 2zM8.2 12.9H6.3a.35.35 0 0 1-.35-.35V8.72c0-.19.16-.35.35-.35s.35.16.35.35v3.48H8.2c.2 0 .35.16.35.35s-.15.35-.35.35zm1.43-.35c0 .19-.16.35-.35.35a.35.35 0 0 1-.35-.35V8.72c0-.19.16-.35.35-.35s.35.16.35.35v3.83zm4.35 0a.35.35 0 0 1-.63.21l-1.96-2.67v2.46c0 .19-.16.35-.35.35a.35.35 0 0 1-.35-.35V8.72a.35.35 0 0 1 .63-.21l1.96 2.67V8.72c0-.19.16-.35.35-.35s.35.16.35.35v3.83zm2.87-2.27c.2 0 .35.16.35.35s-.15.35-.35.35h-1.55v.92h1.55c.2 0 .35.16.35.35s-.15.35-.35.35H15c-.19 0-.35-.16-.35-.35V8.72c0-.19.16-.35.35-.35h1.85c.2 0 .35.16.35.35s-.15.35-.35.35H15.3v.92h1.55z" />
    </svg>
  ),
  facebook: ({ className = "", ...p }: IconProps) => (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className={`size-4 ${className}`} {...p}>
      <path d="M22 12a10 10 0 1 0-11.56 9.88v-6.99H7.9V12h2.54V9.8c0-2.5 1.49-3.89 3.77-3.89 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56V12h2.78l-.45 2.89h-2.33v6.99A10 10 0 0 0 22 12z" />
    </svg>
  ),
  quote: ({ className = "", ...p }: IconProps) => (
    <svg viewBox="0 0 48 34" fill="currentColor" aria-hidden className={`w-11 ${className}`} {...p}>
      <path d="M0 34V19.6C0 8.9 6.2 1.4 17 0l1.7 5.6C12.4 7.4 9 11.2 9 15.3h6.9V34H0zm29.3 0V19.6C29.3 8.9 35.5 1.4 46.3 0L48 5.6c-6.3 1.8-9.7 5.6-9.7 9.7h6.9V34H29.3z" />
    </svg>
  ),
};

/* --------------------------------------------------------------- Breadcrumb */

export function Breadcrumb({ items }: { items: { label: string; href?: string }[] }) {
  return (
    <nav aria-label="breadcrumb" className="text-[13.5px] text-slate-500">
      <ol className="flex flex-wrap items-center gap-2">
        {items.map((item, i) => (
          <li key={item.label} className="flex items-center gap-2">
            {i > 0 && <span className="text-slate-300">/</span>}
            {item.href ? (
              <Link href={item.href} className="transition hover:text-accent-500">
                {item.label}
              </Link>
            ) : (
              <span className="text-brand-700">{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

/* ------------------------------------------------------------------ PageHero
 * Concept B is a one-page concept, so the inner-page header is designed from
 * its parts: the `--sky` band, the accent English eyebrow and the accent
 * heading rule.
 */

export function PageHero({
  eyebrow,
  title,
  description,
  breadcrumb,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  breadcrumb: { label: string; href?: string }[];
}) {
  return (
    <section className="border-b border-slate-200 bg-brand-50">
      <Container className="py-9 sm:py-12">
        <Breadcrumb items={breadcrumb} />
        <div className="mt-5 max-w-3xl">
          {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
          <h1 className="rule-bar mt-1 text-[clamp(23px,3vw,34px)] font-semibold">{title}</h1>
          {description && (
            <p className="mt-4 text-sm leading-relaxed text-slate-500 sm:text-[16px]">
              {description}
            </p>
          )}
        </div>
      </Container>
    </section>
  );
}
