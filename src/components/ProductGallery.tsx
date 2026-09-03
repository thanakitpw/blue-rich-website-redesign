"use client";

import Image from "next/image";
import { useState } from "react";

/**
 * Product gallery in the layout the client picked: one large frame with
 * prev/next arrows sitting on the left and right edges, and a thumbnail strip
 * underneath. Product photography ships with a white background, so the main
 * image and the thumbnails blend it into the frame instead of showing a box.
 */
export default function ProductGallery({
  images,
  alt,
}: {
  images: string[];
  alt: string;
}) {
  const [active, setActive] = useState(0);
  const many = images.length > 1;
  const go = (next: number) => setActive((next + images.length) % images.length);

  return (
    <div>
      <div className="relative aspect-square overflow-hidden rounded-3xl border border-slate-200 bg-white">
        <Image
          key={images[active]}
          src={images[active]}
          alt={alt}
          fill
          priority
          sizes="(min-width: 1024px) 46vw, 92vw"
          className="object-contain p-6 mix-blend-multiply sm:p-10"
        />

        {many && (
          <>
            <button
              type="button"
              onClick={() => go(active - 1)}
              aria-label="รูปก่อนหน้า"
              className="absolute top-1/2 left-3 grid size-11 -translate-y-1/2 place-items-center rounded-2xl bg-brand-50 text-brand-600 transition hover:bg-brand-600 hover:text-white"
            >
              <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>
            <button
              type="button"
              onClick={() => go(active + 1)}
              aria-label="รูปถัดไป"
              className="absolute top-1/2 right-3 grid size-11 -translate-y-1/2 place-items-center rounded-2xl bg-brand-50 text-brand-600 transition hover:bg-brand-600 hover:text-white"
            >
              <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d="M9 18l6-6-6-6" />
              </svg>
            </button>
          </>
        )}
      </div>

      {many && (
        <div className="mt-4 flex flex-wrap gap-3">
          {images.map((src, i) => (
            <button
              key={src}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`ดูรูปที่ ${i + 1}`}
              aria-current={i === active}
              className={`relative size-[74px] overflow-hidden rounded-2xl bg-white transition sm:size-[84px] ${
                i === active
                  ? "border-2 border-brand-600"
                  : "border border-slate-200 opacity-75 hover:border-brand-200 hover:opacity-100"
              }`}
            >
              <Image src={src} alt="" fill sizes="84px" className="object-contain p-1.5 mix-blend-multiply" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
