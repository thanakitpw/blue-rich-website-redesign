"use client";

import Image from "next/image";
import { useState } from "react";

export default function ProductGallery({
  images,
  alt,
}: {
  images: string[];
  alt: string;
}) {
  const [active, setActive] = useState(0);

  return (
    <div>
      <div className="relative aspect-square overflow-hidden rounded-4xl bg-gradient-to-br from-brand-50 to-slate-50 ring-1 ring-slate-200">
        <Image
          key={images[active]}
          src={images[active]}
          alt={alt}
          fill
          priority
          sizes="(min-width: 1024px) 46vw, 92vw"
          className="object-contain p-8"
        />
      </div>

      {images.length > 1 && (
        <div className="mt-4 flex gap-3">
          {images.map((src, i) => (
            <button
              key={src}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`ดูรูปที่ ${i + 1}`}
              aria-current={i === active}
              className={`relative size-20 overflow-hidden rounded-2xl bg-white transition sm:size-24 ${
                i === active
                  ? "ring-2 ring-brand-600"
                  : "opacity-70 ring-1 ring-slate-200 hover:opacity-100 hover:ring-brand-300"
              }`}
            >
              <Image src={src} alt="" fill sizes="96px" className="object-contain p-2" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
