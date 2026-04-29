"use client";

import { ChevronLeft, ChevronRight, X } from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";

type Props = {
  photos: string[];
  alt?: string;
};

export function PhotoGallery({ photos, alt }: Props) {
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);

  const close = useCallback(() => setOpen(false), []);
  const prev = useCallback(
    () => setIndex((i) => (i - 1 + photos.length) % photos.length),
    [photos.length],
  );
  const next = useCallback(
    () => setIndex((i) => (i + 1) % photos.length),
    [photos.length],
  );

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, close, prev, next]);

  if (!photos || photos.length === 0) {
    return (
      <div className="bg-sejours-sky rounded-card flex aspect-video items-center justify-center">
        <p className="text-encre/60 text-sm">Aucune photo disponible</p>
      </div>
    );
  }

  return (
    <>
      <div className="rounded-card grid grid-cols-4 gap-2 overflow-hidden">
        {photos.slice(0, 5).map((photo, i) => (
          <button
            key={i}
            type="button"
            onClick={() => {
              setIndex(i);
              setOpen(true);
            }}
            className={`group focus-visible:ring-sejours-turquoise relative cursor-pointer overflow-hidden focus-visible:ring-2 focus-visible:outline-none ${
              i === 0 ? "col-span-2 row-span-2 aspect-[4/3]" : "aspect-square"
            }`}
            aria-label={`Voir la photo ${i + 1}`}
          >
            <Image
              src={photo}
              alt={alt ? `${alt} — ${i + 1}` : ""}
              fill
              sizes="(max-width: 768px) 50vw, 25vw"
              className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
              priority={i === 0}
            />
            {i === 4 && photos.length > 5 ? (
              <span className="absolute inset-0 flex items-center justify-center bg-black/70 text-base font-semibold text-white transition group-hover:bg-black/60">
                +{photos.length - 5} photos
              </span>
            ) : null}
          </button>
        ))}
      </div>

      {open ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/95"
          role="dialog"
          aria-modal="true"
          aria-label="Galerie photos"
        >
          <button
            type="button"
            onClick={close}
            aria-label="Fermer"
            className="hover:text-sejours-coral focus-visible:ring-sejours-coral absolute top-4 right-4 inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition focus-visible:ring-2 focus-visible:outline-none"
          >
            <X className="h-5 w-5" />
          </button>

          <button
            type="button"
            onClick={prev}
            aria-label="Photo précédente"
            className="hover:text-sejours-turquoise absolute left-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white transition"
          >
            <ChevronLeft className="h-7 w-7" />
          </button>

          <div className="relative mx-12 h-[80vh] w-full max-w-5xl">
            <Image
              src={photos[index] ?? ""}
              alt={alt ? `${alt} — ${index + 1}` : ""}
              fill
              sizes="100vw"
              className="object-contain"
              priority
            />
          </div>

          <button
            type="button"
            onClick={next}
            aria-label="Photo suivante"
            className="hover:text-sejours-turquoise absolute right-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white transition"
          >
            <ChevronRight className="h-7 w-7" />
          </button>

          <p className="absolute bottom-4 rounded-full bg-black/50 px-4 py-2 text-sm font-medium text-white">
            {index + 1} / {photos.length}
          </p>
        </div>
      ) : null}
    </>
  );
}
