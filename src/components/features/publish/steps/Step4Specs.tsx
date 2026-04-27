"use client";

import { useTranslations } from "next-intl";

import { AMENITY_KEYS, type AmenityKey } from "@/lib/amenities";

type Props = {
  value: {
    surface_m2: number | null;
    rooms: number | null;
    bedrooms: number | null;
    bathrooms: number | null;
    floor: number | null;
    total_floors: number | null;
    year_built: number | null;
    amenities: string[];
  };
  onChange: (next: Partial<Props["value"]>) => void;
};

export function Step4Specs({ value, onChange }: Props) {
  const tAmenity = useTranslations("amenities");

  const isAmenitySelected = (key: AmenityKey) => {
    if (key === "caretaker") {
      return (
        value.amenities.includes("caretaker") ||
        value.amenities.includes("gardian")
      );
    }
    return value.amenities.includes(key);
  };

  const toggleAmenity = (key: AmenityKey) => {
    const selected = isAmenitySelected(key);
    if (key === "caretaker") {
      if (selected) {
        onChange({
          amenities: value.amenities.filter(
            (a) => a !== "caretaker" && a !== "gardian",
          ),
        });
      } else {
        const withoutLegacy = value.amenities.filter((a) => a !== "gardian");
        onChange({ amenities: [...withoutLegacy, "caretaker"] });
      }
      return;
    }
    onChange({
      amenities: selected
        ? value.amenities.filter((it) => it !== key)
        : [...value.amenities, key],
    });
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label
            className="text-ink text-sm font-medium"
            htmlFor="publish-surface"
          >
            Surface (m²)
          </label>
          <input
            id="publish-surface"
            type="number"
            required
            value={value.surface_m2 ?? ""}
            onChange={(event) =>
              onChange({
                surface_m2: event.target.value
                  ? Number(event.target.value)
                  : null,
              })
            }
            className="border-line focus:border-bleu mt-1 w-full rounded-xl border bg-white px-3 py-2.5 outline-none"
          />
          <input
            type="range"
            min={0}
            max={1000}
            value={value.surface_m2 ?? 0}
            onChange={(event) =>
              onChange({ surface_m2: Number(event.target.value) })
            }
            className="mt-3 w-full"
          />
        </div>
        <div>
          <label className="text-ink text-sm font-medium">Pièces</label>
          <div className="mt-2 flex flex-wrap gap-2">
            {[1, 2, 3, 4, 5].map((room) => (
              <button
                key={room}
                type="button"
                onClick={() => onChange({ rooms: room === 5 ? 5 : room })}
                className={`rounded-lg border px-3 py-1.5 text-sm ${
                  value.rooms === room
                    ? "border-bleu bg-bleu-pale"
                    : "border-line bg-white"
                }`}
              >
                {room === 5 ? "5+" : room}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {(
          [
            ["bedrooms", "Chambres"],
            ["bathrooms", "Salles de bain"],
            ["floor", "Étage"],
            ["total_floors", "Étages total"],
            ["year_built", "Année de construction"],
          ] as const satisfies ReadonlyArray<
            readonly [
              keyof Pick<
                Props["value"],
                | "bedrooms"
                | "bathrooms"
                | "floor"
                | "total_floors"
                | "year_built"
              >,
              string,
            ]
          >
        ).map(([key, label]) => {
          const bounds: {
            min?: number;
            max?: number;
          } =
            key === "bedrooms" || key === "bathrooms"
              ? { min: 0 }
              : key === "floor"
                ? { min: -5, max: 100 }
                : key === "total_floors"
                  ? { min: 0 }
                  : key === "year_built"
                    ? { min: 1900, max: 2026 }
                    : {};

          return (
            <div key={key}>
              <label className="text-ink text-sm font-medium">{label}</label>
              <input
                type="number"
                min={bounds.min}
                max={bounds.max}
                value={value[key] ?? ""}
                onChange={(event) =>
                  onChange({
                    [key]: event.target.value
                      ? Number(event.target.value)
                      : null,
                  })
                }
                className="border-line focus:border-bleu mt-1 w-full rounded-xl border bg-white px-3 py-2.5 outline-none"
              />
            </div>
          );
        })}
      </div>

      <section>
        <h3 className="text-ink mb-2 text-sm font-semibold">Équipements</h3>
        <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
          {AMENITY_KEYS.map((amenity) => {
            const selected = isAmenitySelected(amenity);
            return (
              <button
                key={amenity}
                type="button"
                onClick={() => toggleAmenity(amenity)}
                className={`rounded-lg border px-2 py-2 text-left text-xs ${
                  selected ? "border-bleu bg-bleu-pale" : "border-line bg-white"
                }`}
              >
                {tAmenity(amenity)}
              </button>
            );
          })}
        </div>
      </section>
    </div>
  );
}
