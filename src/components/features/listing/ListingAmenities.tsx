import { Check } from "lucide-react";
import { getTranslations } from "next-intl/server";

import { isKnownAmenityKey, normalizeAmenityKey } from "@/lib/amenities";

type Props = {
  amenityKeys: string[];
};

export async function ListingAmenities({ amenityKeys }: Props) {
  if (amenityKeys.length === 0) return null;

  const t = await getTranslations("amenities");
  const seen = new Set<string>();
  const uniqueRaw = amenityKeys.filter((raw) => {
    const key = normalizeAmenityKey(raw);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  return (
    <section className="border-line rounded-2xl border bg-white p-5">
      <h2 className="text-ink mb-4 text-lg font-semibold">Équipements</h2>
      <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
        {uniqueRaw.map((raw) => {
          const key = normalizeAmenityKey(raw);
          return (
            <div
              key={key}
              className="text-ink bg-bleu-pale flex items-center gap-2 rounded-full px-3 py-2 text-xs"
            >
              <Check className="text-bleu h-3.5 w-3.5" />
              <span>
                {isKnownAmenityKey(key) ? t(key) : raw.replaceAll("_", " ")}
              </span>
            </div>
          );
        })}
      </div>
    </section>
  );
}
