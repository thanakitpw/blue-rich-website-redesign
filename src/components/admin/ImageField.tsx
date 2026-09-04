"use client";

import Image from "next/image";
import { useState } from "react";
import type { MediaItem } from "@/lib/cms/media";
import { MediaPicker } from "./MediaPicker";

export function ImageField({
  label,
  value,
  media,
  onChange,
  hint,
}: {
  label?: string;
  value: string;
  media: MediaItem[];
  onChange: (url: string) => void;
  hint?: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div>
      {label && <label className="field-label">{label}</label>}
      <div className="flex items-start gap-3">
        <span className="relative block size-16 shrink-0 overflow-hidden rounded-lg border border-slate-200 bg-slate-50">
          {value ? <Image src={value} alt="" fill sizes="64px" className="object-contain p-1" /> : null}
        </span>
        <div className="min-w-0 flex-1">
          <input
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="/assets/products/example.jpg"
            className="field"
          />
          {hint && <p className="mt-1 text-[12px] text-slate-500">{hint}</p>}
        </div>
        <button type="button" onClick={() => setOpen(true)} className="btn-line-admin shrink-0">
          เลือกรูป
        </button>
      </div>

      <MediaPicker items={media} open={open} onClose={() => setOpen(false)} onPick={onChange} />
    </div>
  );
}
