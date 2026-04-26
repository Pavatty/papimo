import { Check } from "lucide-react";

type Props = {
  amenityKeys: string[];
};

export function ListingAmenities({ amenityKeys }: Props) {
  if (amenityKeys.length === 0) return null;

  return (
    <section className="border-line rounded-2xl border bg-white p-5">
      <h2 className="text-ink mb-4 text-lg font-semibold">Équipements</h2>
      <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
        {amenityKeys.map((key) => (
          <div
            key={key}
            className="text-ink bg-bleu-pale flex items-center gap-2 rounded-full px-3 py-2 text-xs"
          >
            <Check className="text-bleu h-3.5 w-3.5" />
            <span>{key.replaceAll("_", " ")}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
