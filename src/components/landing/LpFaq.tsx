/**
 * Native <details> rather than a JS accordion — the answers stay in the DOM for
 * crawlers and for in-page find, and the section costs no client bundle.
 */
export default function LpFaq({ items }: { items: { q: string; a: string }[] }) {
  return (
    <div className="grid gap-3">
      {items.map((item) => (
        <details
          key={item.q}
          name="lp-faq"
          className="group rounded-3xl bg-white ring-1 ring-slate-200/80 transition open:ring-brand-300 hover:ring-brand-200"
        >
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-6 py-5 [&::-webkit-details-marker]:hidden">
            <span className="font-display text-[1.02rem] font-semibold text-brand-950">
              {item.q}
            </span>
            <span className="grid size-8 shrink-0 place-items-center rounded-full bg-brand-50 text-brand-600 ring-1 ring-brand-100 transition group-open:rotate-45 group-open:bg-brand-600 group-open:text-white">
              <svg viewBox="0 0 20 20" fill="none" aria-hidden className="size-4">
                <path
                  d="M10 4.5v11M4.5 10h11"
                  stroke="currentColor"
                  strokeWidth="1.9"
                  strokeLinecap="round"
                />
              </svg>
            </span>
          </summary>
          <p className="px-6 pb-6 text-[0.95rem] leading-relaxed text-slate-600">{item.a}</p>
        </details>
      ))}
    </div>
  );
}
