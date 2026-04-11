"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { Modal } from "@/src/components/ui/modal";
import { cn } from "@/src/utils/cn";

type Props = {
  open: boolean;
  onClose: () => void;
  title?: string;
  images: { id: string; url: string }[];
  initialIndex?: number;
};

export function ImageCarouselModal({
  open,
  onClose,
  title = "Gallery",
  images,
  initialIndex = 0,
}: Props) {
  const safeInitial = useMemo(() => {
    if (!images.length) return 0;
    return Math.min(Math.max(initialIndex, 0), images.length - 1);
  }, [images.length, initialIndex]);

  const [index, setIndex] = useState(safeInitial);

  useEffect(() => {
    if (open) setIndex(safeInitial);
  }, [open, safeInitial]);

  const prev = () => setIndex((i) => (i - 1 + images.length) % images.length);
  const next = () => setIndex((i) => (i + 1) % images.length);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, images.length]);

  if (!images.length) return null;

  const current = images[index];

  return (
    <Modal open={open} onClose={onClose} title={`${title} (${index + 1}/${images.length})`}>
      <div className="space-y-4">
        {/* Main image */}
        <div className="relative aspect-[16/10] overflow-hidden rounded-2xl bg-slate-100">
          <Image
            src={current.url}
            alt="Experience image"
            fill
            sizes="(max-width: 768px) 92vw, 900px"
            className="object-contain"
            priority
          />

          {/* Prev */}
          <button
            type="button"
            onClick={prev}
            className={cn(
              "absolute left-3 top-1/2 -translate-y-1/2",
              "inline-flex h-11 w-11 items-center justify-center rounded-2xl",
              "bg-black/50 text-white backdrop-blur-sm hover:bg-black/60 transition"
            )}
            aria-label="Previous image"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          {/* Next */}
          <button
            type="button"
            onClick={next}
            className={cn(
              "absolute right-3 top-1/2 -translate-y-1/2",
              "inline-flex h-11 w-11 items-center justify-center rounded-2xl",
              "bg-black/50 text-white backdrop-blur-sm hover:bg-black/60 transition"
            )}
            aria-label="Next image"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>

        {/* Thumbnails */}
        <div className="flex gap-2 overflow-x-auto pb-1">
          {images.map((img, i) => (
            <button
              key={img.id}
              type="button"
              onClick={() => setIndex(i)}
              className={cn(
                "relative h-16 w-24 shrink-0 overflow-hidden rounded-xl border",
                i === index ? "border-amber-500" : "border-slate-200 hover:border-slate-300"
              )}
              aria-label={`Go to image ${i + 1}`}
            >
              <Image
                src={img.url}
                alt="Thumbnail"
                fill
                sizes="96px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      </div>
    </Modal>
  );
}