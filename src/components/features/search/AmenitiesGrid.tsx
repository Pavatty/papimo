"use client";

import { useLocale, useTranslations } from "next-intl";

import {
  AMENITY_CATEGORIES,
  type ListingAmenity,
} from "@/lib/constants/listing-schema";
import { AMENITY_LABELS, getLabel } from "@/lib/constants/listing-labels";

type AmenityKey = ListingAmenity;

type Props = {
  selected: string[];
  onChange: (next: string[]) => void;
};

export function AmenitiesGrid({ selected, onChange }: Props) {
  const locale = useLocale() as "fr" | "en" | "ar";
  const t = useTranslations("search");

  const toggleAmenity = (key: AmenityKey) => {
    const isSelected = selected.includes(key);
    if (isSelected) {
      onChange(selected.filter((it) => it !== key));
    } else {
      onChange([...selected, key]);
    }
  };

  return (
    <div className="space-y-3">
      {Object.entries(AMENITY_CATEGORIES).map(([category, keys]) => (
        <div key={category}>
          <p className="text-ink-soft mb-1 text-xs font-semibold">
            {t(`amenityCategories.${category}`)}
          </p>
          <div className="flex flex-wrap gap-1.5">
            {keys.map((key) => {
              const isSelected = selected.includes(key);
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => toggleAmenity(key)}
                  className={`rounded-full border px-2 py-1 text-xs ${
                    isSelected
                      ? "border-bleu bg-bleu-pale text-bleu"
                      : "border-line text-ink bg-white"
                  }`}
                >
                  {getLabel(AMENITY_LABELS, key as ListingAmenity, locale)}
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
