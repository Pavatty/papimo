import {
  Bath,
  BedDouble,
  CalendarDays,
  Landmark,
  Layers,
  Ruler,
} from "lucide-react";

import type { ListingDetails } from "./types";

type Props = {
  listing: ListingDetails;
};

export function ListingSpecs({ listing }: Props) {
  const specs = [
    {
      icon: Ruler,
      label: "Surface",
      value: listing.surface_m2 ? `${listing.surface_m2} m²` : "-",
    },
    { icon: Layers, label: "Pièces", value: listing.rooms ?? "-" },
    { icon: BedDouble, label: "Chambres", value: listing.bedrooms ?? "-" },
    { icon: Bath, label: "Salles de bain", value: listing.bathrooms ?? "-" },
    { icon: Landmark, label: "Étage", value: listing.floor ?? "-" },
    {
      icon: CalendarDays,
      label: "Année construction",
      value: listing.year_built ?? "-",
    },
  ];

  return (
    <section className="border-line rounded-2xl border bg-white p-5">
      <h2 className="text-ink mb-4 text-lg font-semibold">Caractéristiques</h2>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {specs.map((item) => (
          <div
            key={item.label}
            className="bg-creme-pale flex items-center gap-3 rounded-lg p-3"
          >
            <item.icon className="text-bleu h-4 w-4" />
            <div>
              <p className="text-ink-soft text-xs">{item.label}</p>
              <p className="text-ink text-sm font-medium">{item.value}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
