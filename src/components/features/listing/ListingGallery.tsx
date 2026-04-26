"use client";

import { useMemo, useState } from "react";
import Lightbox from "yet-another-react-lightbox";
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";

import "yet-another-react-lightbox/styles.css";
import "yet-another-react-lightbox/plugins/thumbnails.css";

type Props = {
  images: Array<{
    id: string;
    url: string;
    alt_text: string | null;
  }>;
};

export function ListingGallery({ images }: Props) {
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);
  const slides = useMemo(
    () =>
      images.map((img) => ({
        src: img.url,
        alt: img.alt_text ?? "Photo annonce",
      })),
    [images],
  );

  if (images.length === 0) {
    return (
      <div className="border-line bg-paper flex aspect-video items-center justify-center rounded-2xl border">
        <p className="text-ink-soft text-sm">Aucune photo disponible</p>
      </div>
    );
  }

  return (
    <>
      <button
        type="button"
        className="group relative block w-full overflow-hidden rounded-2xl"
        onClick={() => setOpen(true)}
      >
        <img
          src={images[0].url}
          alt={images[0].alt_text ?? "Photo principale"}
          className="aspect-video w-full object-cover transition duration-300 group-hover:scale-[1.01]"
        />
        <span className="bg-ink/75 absolute right-3 bottom-3 rounded-full px-3 py-1 text-xs text-white">
          {images.length} photos
        </span>
      </button>

      <div className="mt-2 grid grid-cols-4 gap-2">
        {images.slice(1, 5).map((image, idx) => (
          <button
            key={image.id}
            type="button"
            className="overflow-hidden rounded-lg"
            onClick={() => {
              setIndex(idx + 1);
              setOpen(true);
            }}
          >
            <img
              src={image.url}
              alt={image.alt_text ?? "Photo annonce"}
              className="aspect-video w-full object-cover transition hover:opacity-90"
            />
          </button>
        ))}
      </div>

      <Lightbox
        open={open}
        close={() => setOpen(false)}
        slides={slides}
        index={index}
        plugins={[Thumbnails]}
        controller={{ closeOnBackdropClick: true }}
      />
    </>
  );
}
