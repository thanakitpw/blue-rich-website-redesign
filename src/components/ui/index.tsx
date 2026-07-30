import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

/* ---------------------------------------------------------------- Container */

export function Container({
  className = "",
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={`mx-auto w-full max-w-[1200px] px-5 sm:px-8 ${className}`}>
      {children}
    </div>
  );
}

/* ------------------------------------------------------------------- Button */

type Variant = "primary" | "secondary" | "ghost" | "line";
type Size = "md" | "lg";

const variants: Record<Variant, string> = {
  primary:
    "bg-brand-700 text-white shadow-lg shadow-brand-900/20 hover:bg-brand-800 hover:shadow-brand-900/30",
  secondary:
    "bg-white text-brand-800 ring-1 ring-inset ring-brand-200 hover:bg-brand-50 hover:ring-brand-300",
  ghost:
    "bg-white/10 text-white ring-1 ring-inset ring-white/30 backdrop-blur hover:bg-white/20",
  line: "bg-[#06C755] text-white shadow-lg shadow-[#06C755]/25 hover:bg-[#05b34c]",
};

const sizes: Record<Size, string> = {
  md: "px-5 py-2.5 text-sm",
  lg: "px-7 py-3.5 text-[0.95rem]",
};

const base =
  "inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500 active:scale-[0.98]";

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
  const external = href.startsWith("http") || href.startsWith("tel:") || href.startsWith("mailto:");
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

/* ------------------------------------------------------------------- Eyebrow */

export function Eyebrow({
  children,
  tone = "light",
}: {
  children: ReactNode;
  tone?: "light" | "dark";
}) {
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-semibold tracking-wide ${
        tone === "light"
          ? "bg-brand-50 text-brand-700 ring-1 ring-inset ring-brand-100"
          : "bg-white/10 text-brand-100 ring-1 ring-inset ring-white/20"
      }`}
    >
      <span className="size-1.5 rounded-full bg-current" />
      {children}
    </span>
  );
}

/* ------------------------------------------------------------ SectionHeading */

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
  const centered = align === "center";
  return (
    <div
      className={`flex flex-col gap-5 ${
        centered ? "items-center text-center" : "md:flex-row md:items-end md:justify-between"
      }`}
    >
      <div className={`max-w-2xl ${centered ? "" : "flex-1"}`}>
        {eyebrow && <Eyebrow tone={tone}>{eyebrow}</Eyebrow>}
        <h2
          className={`mt-4 text-3xl leading-[1.25] sm:text-4xl lg:text-[2.6rem] ${
            tone === "dark" ? "text-white" : ""
          }`}
        >
          {title}
        </h2>
        {description && (
          <p
            className={`mt-4 text-base leading-relaxed sm:text-[1.05rem] ${
              tone === "dark" ? "text-brand-100/80" : "text-slate-600"
            }`}
          >
            {description}
          </p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}

/* -------------------------------------------------------------------- Icons */

/**
 * Icon props merge into the default size instead of replacing it — passing a
 * `className` for animation must not strip the intrinsic sizing class.
 */
type IconProps = ComponentProps<"svg">;

export const Icon = {
  arrow: ({ className = "", ...p }: IconProps) => (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden className={`size-4 ${className}`} {...p}>
      <path
        d="M4 10h12m0 0-4.5-4.5M16 10l-4.5 4.5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  phone: ({ className = "", ...p }: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden className={`size-4 ${className}`} {...p}>
      <path
        d="M6.6 3h2.2l1.6 4-2 1.2a12 12 0 0 0 5.4 5.4l1.2-2 4 1.6v2.2A2.6 2.6 0 0 1 16.4 18 13.4 13.4 0 0 1 4 5.6 2.6 2.6 0 0 1 6.6 3Z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
    </svg>
  ),
  mail: ({ className = "", ...p }: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden className={`size-4 ${className}`} {...p}>
      <rect x="3" y="5" width="18" height="14" rx="2.5" stroke="currentColor" strokeWidth="1.7" />
      <path d="m4 7 8 5.5L20 7" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  ),
  pin: ({ className = "", ...p }: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden className={`size-4 ${className}`} {...p}>
      <path
        d="M12 21s7-5.6 7-11a7 7 0 1 0-14 0c0 5.4 7 11 7 11Z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="10" r="2.6" stroke="currentColor" strokeWidth="1.7" />
    </svg>
  ),
  clock: ({ className = "", ...p }: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden className={`size-4 ${className}`} {...p}>
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.7" />
      <path d="M12 7.5V12l3 1.8" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  ),
  line: ({ className = "", ...p }: IconProps) => (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className={`size-4 ${className}`} {...p}>
      <path d="M12 3C6.9 3 2.8 6.3 2.8 10.4c0 3.7 3.3 6.8 7.7 7.4.3.06.7.2.8.46.1.24.07.6.03.84l-.13.78c-.04.23-.18.9.79.49s5.24-3.09 7.15-5.29c1.32-1.45 1.95-2.92 1.95-4.68C21.1 6.3 17 3 12 3ZM8.2 12.9H6.6a.4.4 0 0 1-.4-.4V9.1a.4.4 0 0 1 .81 0v3h1.2a.4.4 0 0 1 0 .8Zm1.6-.4a.4.4 0 0 1-.81 0V9.1a.4.4 0 0 1 .81 0v3.4Zm3.9 0a.4.4 0 0 1-.73.24l-1.75-2.38v2.14a.4.4 0 0 1-.81 0V9.1a.4.4 0 0 1 .73-.24l1.76 2.39V9.1a.4.4 0 0 1 .8 0v3.4Zm2.9-2.1a.4.4 0 0 1 0 .8h-1.2v.9h1.2a.4.4 0 0 1 0 .8h-1.6a.4.4 0 0 1-.4-.4V9.1a.4.4 0 0 1 .4-.4h1.6a.4.4 0 0 1 0 .81h-1.2v.9h1.2Z" />
    </svg>
  ),
  shield: ({ className = "", ...p }: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden className={`size-6 ${className}`} {...p}>
      <path
        d="M12 3 5 5.8v5.4c0 4.3 2.9 8.3 7 9.6 4.1-1.3 7-5.3 7-9.6V5.8L12 3Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path d="m9 12 2.1 2.1L15.3 10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  flame: ({ className = "", ...p }: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden className={`size-6 ${className}`} {...p}>
      <path
        d="M12 3s5 4 5 8.5A5 5 0 0 1 7 11.5C7 9 8.6 7.4 9.6 6.6c.2 1.4.9 2.2 1.7 2.2.9 0 1.4-.9.7-5.8Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path
        d="M12 21c2.8 0 5-1.9 5-4.4 0-1.6-1-3-2.2-3.9.2 1.9-.9 2.9-1.7 2.9-1.1 0-1.3-1-1.1-2.6-1.3.8-2.3 2.3-2.3 3.9C9.7 19 10.9 21 12 21Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  ),
  doc: ({ className = "", ...p }: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden className={`size-6 ${className}`} {...p}>
      <path
        d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8l-5-5Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path d="M14 3v5h5M8.5 13h7M8.5 16.5h4.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  truck: ({ className = "", ...p }: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden className={`size-6 ${className}`} {...p}>
      <path
        d="M3 7a1 1 0 0 1 1-1h9a1 1 0 0 1 1 1v9H3V7ZM14 10h3.3l2.7 3v3h-6v-6Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <circle cx="7" cy="17.5" r="1.8" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="17" cy="17.5" r="1.8" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  ),
  users: ({ className = "", ...p }: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden className={`size-6 ${className}`} {...p}>
      <circle cx="9" cy="8" r="3.2" stroke="currentColor" strokeWidth="1.6" />
      <path d="M3.5 19a5.5 5.5 0 0 1 11 0" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M16 5.4a3.2 3.2 0 0 1 0 5.2M17.5 14.2A5.5 5.5 0 0 1 20.5 19" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  ),
  quote: ({ className = "", ...p }: IconProps) => (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className={`size-7 ${className}`} {...p}>
      <path d="M9.5 5.5C6.4 6.9 4.5 9.7 4.5 13v5.5h6.2V13H7.6c0-2 .9-3.6 2.9-4.6l-1-2.9Zm9 0C15.4 6.9 13.5 9.7 13.5 13v5.5h6.2V13h-3.1c0-2 .9-3.6 2.9-4.6l-1-2.9Z" />
    </svg>
  ),
};

/* --------------------------------------------------------------- Breadcrumb */

export function Breadcrumb({ items }: { items: { label: string; href?: string }[] }) {
  return (
    <nav aria-label="breadcrumb" className="text-sm text-brand-100/70">
      <ol className="flex flex-wrap items-center gap-2">
        {items.map((item, i) => (
          <li key={item.label} className="flex items-center gap-2">
            {i > 0 && <span className="text-brand-200/40">/</span>}
            {item.href ? (
              <Link href={item.href} className="transition hover:text-white">
                {item.label}
              </Link>
            ) : (
              <span className="text-white">{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

/* ------------------------------------------------------------------ PageHero */

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
    <section className="relative overflow-hidden bg-brand-950 pt-32 pb-16 sm:pt-40 sm:pb-20">
      <div
        aria-hidden
        className="absolute inset-0 bg-[radial-gradient(60rem_30rem_at_15%_-10%,var(--color-brand-700),transparent),radial-gradient(40rem_24rem_at_100%_10%,var(--color-brand-800),transparent)]"
      />
      <div
        aria-hidden
        className="absolute -top-24 right-[-6rem] size-72 rotate-45 rounded-[28%] border border-white/10"
      />
      <Container className="relative">
        <Breadcrumb items={breadcrumb} />
        <div className="mt-6 max-w-3xl">
          {eyebrow && <Eyebrow tone="dark">{eyebrow}</Eyebrow>}
          <h1 className="mt-4 text-4xl leading-[1.15] text-white sm:text-5xl lg:text-[3.4rem]">
            {title}
          </h1>
          {description && (
            <p className="mt-5 text-base leading-relaxed text-brand-100/80 sm:text-lg">
              {description}
            </p>
          )}
        </div>
      </Container>
    </section>
  );
}
