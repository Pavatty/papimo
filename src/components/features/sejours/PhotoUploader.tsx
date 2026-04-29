"use client";

import { ImagePlus, Loader2 } from "lucide-react";
import { useRef, useState } from "react";

import { createClient } from "@/data/supabase/client";

const MAX_BYTES = 5 * 1024 * 1024;
const ACCEPTED_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
]);

type Props = {
  listingId: string;
  ownerId: string;
  maxPhotos?: number;
  onUploaded?: (urls: string[]) => void;
};

export function PhotoUploader({
  listingId,
  ownerId,
  maxPhotos = 20,
  onUploaded,
}: Props) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [count, setCount] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    setError(null);
    setUploading(true);
    setCount(0);

    const supabase = createClient();
    const urls: string[] = [];
    const max = Math.min(files.length, maxPhotos);

    for (let i = 0; i < max; i += 1) {
      const file = files[i];
      if (!file) continue;
      if (!ACCEPTED_TYPES.has(file.type)) {
        setError(`${file.name} : format non supporté`);
        continue;
      }
      if (file.size > MAX_BYTES) {
        setError(`${file.name} : dépasse 5 Mo`);
        continue;
      }
      const ext = file.name.split(".").pop() ?? "jpg";
      const path = `${ownerId}/${listingId}/${Date.now()}-${crypto.randomUUID()}.${ext}`;
      const { error: upErr } = await supabase.storage
        .from("listings")
        .upload(path, file, { contentType: file.type, upsert: false });
      if (upErr) {
        setError(`${file.name} : ${upErr.message}`);
        continue;
      }
      const { data } = supabase.storage.from("listings").getPublicUrl(path);
      urls.push(data.publicUrl);
      setCount((c) => c + 1);
    }

    setUploading(false);
    if (urls.length > 0 && onUploaded) onUploaded(urls);
    if (inputRef.current) inputRef.current.value = "";
  }

  return (
    <div className="border-sejours-turquoise hover:bg-sejours-sky/30 dark:hover:bg-sejours-sky/10 rounded-card border-2 border-dashed p-8 text-center transition">
      <input
        ref={inputRef}
        type="file"
        multiple
        accept={Array.from(ACCEPTED_TYPES).join(",")}
        onChange={(e) => {
          void handleFiles(e.target.files);
        }}
        disabled={uploading}
        className="hidden"
        id="sejours-photo-upload"
      />
      <label
        htmlFor="sejours-photo-upload"
        className="flex cursor-pointer flex-col items-center gap-3"
      >
        {uploading ? (
          <Loader2
            className="text-sejours-turquoise h-10 w-10 animate-spin"
            aria-hidden
          />
        ) : (
          <ImagePlus className="text-sejours-turquoise h-10 w-10" aria-hidden />
        )}
        <div className="text-encre dark:text-creme text-base font-semibold">
          {uploading ? `Upload ${count}/${maxPhotos}...` : "Ajouter des photos"}
        </div>
        <p className="text-encre/60 dark:text-creme/60 text-xs">
          Jusqu&apos;à {maxPhotos} photos · JPG, PNG, WEBP, AVIF · max 5 Mo
        </p>
      </label>
      {error ? (
        <p className="bg-coeur-soft text-coeur mx-auto mt-3 inline-block rounded-md px-3 py-1 text-xs">
          {error}
        </p>
      ) : null}
    </div>
  );
}
