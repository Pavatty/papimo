"use client";

import imageCompression from "browser-image-compression";
import {
  DndContext,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  rectSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { ImagePlus, X } from "lucide-react";
import Image from "next/image";
import { useDropzone } from "react-dropzone";
import { useTransition } from "react";

import {
  deleteImage,
  reorderImages,
  uploadListingImage,
} from "@/app/[locale]/(authed)/publish/actions";

type ImageItem = {
  id: string;
  url: string;
  position: number;
  is_cover: boolean;
};

type Props = {
  listingId?: string;
  pack: "free" | "essential" | "comfort" | "premium";
  images: ImageItem[];
  onImagesChange: (images: ImageItem[]) => void;
};

function maxPhotosForPack(pack: Props["pack"]) {
  if (pack === "comfort") return 20;
  if (pack === "premium") return 30;
  return 12;
}

function SortablePhoto({
  image,
  onSetCover,
  onDelete,
}: {
  image: ImageItem;
  onSetCover: () => void;
  onDelete: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({
      id: image.id,
    });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="border-line group relative overflow-hidden rounded-xl border bg-white"
    >
      <Image
        src={image.url}
        alt=""
        width={640}
        height={320}
        className="h-40 w-full object-cover"
      />
      <div className="absolute top-2 right-2 flex gap-2">
        <button
          type="button"
          className="rounded bg-white/90 px-2 py-1 text-xs"
          onClick={onSetCover}
        >
          {image.is_cover ? "Couverture" : "Définir comme couverture"}
        </button>
        <button
          type="button"
          className="rounded bg-white/90 p-1"
          onClick={onDelete}
          aria-label="Supprimer"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

export function Step5Photos({
  listingId,
  pack,
  images,
  onImagesChange,
}: Props) {
  const [isPending, startTransition] = useTransition();
  const sensors = useSensors(useSensor(PointerSensor));
  const maxPhotos = maxPhotosForPack(pack);

  const onDrop = (acceptedFiles: File[]) => {
    if (!listingId) return;
    startTransition(async () => {
      for (const file of acceptedFiles.slice(
        0,
        Math.max(0, maxPhotos - images.length),
      )) {
        const compressed = await imageCompression(file, {
          maxWidthOrHeight: 1920,
          initialQuality: 0.8,
          useWebWorker: true,
        });
        const formData = new FormData();
        formData.append("listingId", listingId);
        formData.append("file", compressed, file.name);
        const result = await uploadListingImage(formData);
        if (result.ok && result.image) {
          onImagesChange([...images, result.image as ImageItem]);
        }
      }
    });
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/jpeg": [],
      "image/png": [],
      "image/webp": [],
      "image/avif": [],
    },
  });

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={`border-line rounded-2xl border-2 border-dashed bg-white p-8 text-center ${
          isDragActive ? "border-bleu bg-bleu-pale" : ""
        }`}
      >
        <input {...getInputProps()} />
        <ImagePlus className="text-ink-soft mx-auto mb-3 h-8 w-8" />
        <p className="text-ink text-sm">
          Déposez vos photos ici ou cliquez pour sélectionner des fichiers.
        </p>
        <p className="text-ink-soft mt-1 text-xs">
          {images.length}/{maxPhotos} photos
        </p>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={({ active, over }) => {
          if (!over || active.id === over.id || !listingId) return;
          const oldIndex = images.findIndex((img) => img.id === active.id);
          const newIndex = images.findIndex((img) => img.id === over.id);
          const reordered = arrayMove(images, oldIndex, newIndex).map(
            (img, idx) => ({
              ...img,
              position: idx,
              is_cover: idx === 0,
            }),
          );
          onImagesChange(reordered);
          startTransition(async () => {
            await reorderImages(
              listingId,
              reordered.map((it) => it.id),
            );
          });
        }}
      >
        <SortableContext
          items={images.map((i) => i.id)}
          strategy={rectSortingStrategy}
        >
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
            {images.map((image) => (
              <SortablePhoto
                key={image.id}
                image={image}
                onSetCover={() => {
                  const updated = images.map((img) => ({
                    ...img,
                    is_cover: img.id === image.id,
                  }));
                  onImagesChange(updated);
                }}
                onDelete={() =>
                  startTransition(async () => {
                    if (!confirm("Supprimer cette photo ?")) return;
                    await deleteImage(image.id);
                    onImagesChange(images.filter((img) => img.id !== image.id));
                  })
                }
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      <div>
        <label className="text-ink text-sm font-medium">
          URL vidéo (YouTube/Vimeo)
        </label>
        <input className="border-line mt-1 w-full rounded-xl border bg-white px-3 py-2.5" />
      </div>
      {isPending ? (
        <p className="text-ink-soft text-xs">Traitement des photos…</p>
      ) : null}
    </div>
  );
}
