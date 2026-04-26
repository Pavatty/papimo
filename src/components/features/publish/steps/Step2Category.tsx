"use client";

import {
  BriefcaseBusiness,
  Building2,
  Home,
  House,
  MoreHorizontal,
  ParkingCircle,
  Store,
  Trees,
} from "lucide-react";

import type { ListingCategory } from "../types";

type Props = {
  value?: ListingCategory;
  onChange: (value: ListingCategory) => void;
};

const categories: Array<{
  value: ListingCategory;
  label: string;
  Icon: typeof Building2;
}> = [
  { value: "apartment", label: "Appartement", Icon: Building2 },
  { value: "villa", label: "Villa", Icon: House },
  { value: "house", label: "Maison", Icon: Home },
  { value: "land", label: "Terrain", Icon: Trees },
  { value: "office", label: "Bureau", Icon: BriefcaseBusiness },
  { value: "shop", label: "Local commercial", Icon: Store },
  { value: "parking", label: "Parking", Icon: ParkingCircle },
  { value: "other", label: "Autre", Icon: MoreHorizontal },
];

export function Step2Category({ value, onChange }: Props) {
  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
      {categories.map((cat) => {
        const selected = value === cat.value;
        return (
          <button
            key={cat.value}
            type="button"
            onClick={() => onChange(cat.value)}
            className={`rounded-xl border p-4 text-left ${
              selected ? "border-bleu bg-bleu-pale" : "border-line bg-white"
            }`}
          >
            <cat.Icon className="text-bleu mb-2 h-5 w-5" />
            <span className="text-ink text-sm font-medium">{cat.label}</span>
          </button>
        );
      })}
    </div>
  );
}
