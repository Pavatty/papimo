"use client";

import {
  Building2,
  Home,
  Hotel,
  LandPlot,
  Store,
  Warehouse,
} from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

import {
  LISTING_PROPERTY_TYPES,
  LISTING_TRANSACTION_TYPES,
  type ListingCondition,
  type ListingFurnishedLevel,
  type ListingHeatingType,
  type ListingOrientation,
} from "@/lib/constants/listing-schema";
import {
  CONDITION_LABELS,
  FURNISHED_LEVEL_LABELS,
  HEATING_TYPE_LABELS,
  ORIENTATION_LABELS,
  PROPERTY_TYPE_LABELS,
  TRANSACTION_TYPE_LABELS,
  getLabel,
} from "@/lib/constants/listing-labels";
import { createClient } from "@/lib/supabase/client";

import type { SearchFiltersState } from "./SearchPage";
import { AmenitiesGrid } from "./AmenitiesGrid";
import { FilterSection } from "./FilterSection";
import { LocationCascade } from "./LocationCascade";
import { PriceRangeSlider } from "./PriceRangeSlider";

type Props = {
  filters: SearchFiltersState;
  onChange: (next: Partial<SearchFiltersState>) => void;
  onReset: () => void;
};

const typeIcons: Record<string, typeof Home> = {
  apartment: Building2,
  house: Home,
  villa: Hotel,
  land: LandPlot,
  commercial_space: Store,
  warehouse: Warehouse,
};

export function SearchFilters({ filters, onChange, onReset }: Props) {
  const t = useTranslations("search");
  const locale = useLocale() as "fr" | "en" | "ar";

  const saveSearch = async () => {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;
    await supabase.from("saved_searches").insert({
      user_id: user.id,
      name: `Recherche ${new Date().toLocaleDateString(locale)}`,
      criteria: filters,
    });
  };

  return (
    <div className="space-y-3">
      <FilterSection title={t("filters.transactionType")}>
        <div className="space-y-1">
          {LISTING_TRANSACTION_TYPES.map((transaction) => (
            <label
              key={transaction}
              className="flex items-center gap-2 text-sm"
            >
              <input
                type="radio"
                name="transaction"
                checked={filters.transaction_type === transaction}
                onChange={() => onChange({ transaction_type: transaction })}
              />
              {getLabel(TRANSACTION_TYPE_LABELS, transaction, locale)}
            </label>
          ))}
        </div>
      </FilterSection>

      <FilterSection title={t("filters.propertyType")}>
        <div className="flex flex-wrap gap-1.5">
          {LISTING_PROPERTY_TYPES.map((propertyType) => {
            const selected = filters.property_types.includes(propertyType);
            const Icon = typeIcons[propertyType] ?? Home;
            return (
              <button
                key={propertyType}
                type="button"
                onClick={() =>
                  onChange({
                    property_types: selected
                      ? filters.property_types.filter(
                          (it) => it !== propertyType,
                        )
                      : [...filters.property_types, propertyType],
                  })
                }
                className={`inline-flex items-center gap-1 rounded-full border px-2 py-1 text-xs ${
                  selected
                    ? "border-bleu bg-bleu-pale text-bleu"
                    : "border-line text-ink bg-white"
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                {getLabel(PROPERTY_TYPE_LABELS, propertyType, locale)}
              </button>
            );
          })}
        </div>
      </FilterSection>

      <FilterSection title={t("filters.location")}>
        <LocationCascade
          country={filters.country}
          region={filters.region}
          city={filters.city}
          neighborhoods={filters.neighborhoods}
          onChange={(next) =>
            onChange({
              country: next.country,
              region: next.region,
              city: next.city,
              neighborhoods: next.neighborhoods,
            })
          }
        />
      </FilterSection>

      <FilterSection title={t("filters.budget")}>
        <PriceRangeSlider
          min={filters.price_min}
          max={filters.price_max}
          onChange={(next) =>
            onChange({ price_min: next.min, price_max: next.max })
          }
        />
      </FilterSection>

      <FilterSection title={t("filters.surfaceAndRooms")}>
        <div className="space-y-2">
          <div className="grid grid-cols-2 gap-2">
            <input
              type="number"
              placeholder={t("filters.surfaceMin")}
              value={filters.surface_min ?? ""}
              onChange={(event) =>
                onChange({
                  surface_min: event.target.value
                    ? Number(event.target.value)
                    : undefined,
                })
              }
              className="border-line rounded-lg border px-2 py-1.5 text-sm"
            />
            <input
              type="number"
              placeholder={t("filters.surfaceMax")}
              value={filters.surface_max ?? ""}
              onChange={(event) =>
                onChange({
                  surface_max: event.target.value
                    ? Number(event.target.value)
                    : undefined,
                })
              }
              className="border-line rounded-lg border px-2 py-1.5 text-sm"
            />
          </div>
          <div className="flex flex-wrap gap-1.5">
            {[1, 2, 3, 4, 5].map((room) => (
              <button
                key={room}
                type="button"
                onClick={() => onChange({ rooms_min: room })}
                className={`rounded-full border px-2 py-1 text-xs ${
                  filters.rooms_min === room
                    ? "border-bleu bg-bleu-pale text-bleu"
                    : "border-line text-ink bg-white"
                }`}
              >
                {room === 5 ? "5+" : room}
              </button>
            ))}
          </div>
        </div>
      </FilterSection>

      <FilterSection title={t("filters.amenities")}>
        <AmenitiesGrid
          selected={filters.amenities}
          onChange={(amenities) => onChange({ amenities })}
        />
      </FilterSection>

      <FilterSection title={t("filters.moreCriteria")} defaultOpen={false}>
        <div className="space-y-2">
          <select className="border-line w-full rounded-lg border px-2 py-1.5 text-sm">
            <option>{t("filters.moreCriteria")}</option>
            {(
              ["A", "B", "C", "D", "E", "F", "G", "not_specified"] as const
            ).map((it) => (
              <option key={it} value={it}>
                {it}
              </option>
            ))}
          </select>
          <select className="border-line w-full rounded-lg border px-2 py-1.5 text-sm">
            <option>Heating</option>
            {(
              [
                "central",
                "individual_gas",
                "individual_electric",
                "fuel",
                "solar",
                "none",
              ] as ListingHeatingType[]
            ).map((it) => (
              <option key={it} value={it}>
                {getLabel(HEATING_TYPE_LABELS, it, locale)}
              </option>
            ))}
          </select>
          <select className="border-line w-full rounded-lg border px-2 py-1.5 text-sm">
            <option>Orientation</option>
            {(
              [
                "north",
                "south",
                "east",
                "west",
                "north_east",
                "north_west",
                "south_east",
                "south_west",
              ] as ListingOrientation[]
            ).map((it) => (
              <option key={it} value={it}>
                {getLabel(ORIENTATION_LABELS, it, locale)}
              </option>
            ))}
          </select>
          <select className="border-line w-full rounded-lg border px-2 py-1.5 text-sm">
            <option>Condition</option>
            {(
              [
                "new",
                "excellent",
                "good",
                "needs_refresh",
                "needs_renovation",
              ] as ListingCondition[]
            ).map((it) => (
              <option key={it} value={it}>
                {getLabel(CONDITION_LABELS, it, locale)}
              </option>
            ))}
          </select>
          <select className="border-line w-full rounded-lg border px-2 py-1.5 text-sm">
            <option>Furnished</option>
            {(
              [
                "unfurnished",
                "semi_furnished",
                "fully_furnished",
              ] as ListingFurnishedLevel[]
            ).map((it) => (
              <option key={it} value={it}>
                {getLabel(FURNISHED_LEVEL_LABELS, it, locale)}
              </option>
            ))}
          </select>
          <input
            type="number"
            placeholder="Construction year min"
            className="border-line w-full rounded-lg border px-2 py-1.5 text-sm"
          />
        </div>
      </FilterSection>

      <div className="sticky bottom-0 space-y-2 rounded-xl border bg-white p-3">
        <button
          type="button"
          onClick={onReset}
          className="border-line w-full rounded-lg border px-3 py-2 text-sm"
        >
          {t("filters.reset")}
        </button>
        <button
          type="button"
          onClick={saveSearch}
          className="bg-corail w-full rounded-lg px-3 py-2 text-sm font-semibold text-white"
        >
          {t("filters.save")}
        </button>
      </div>
    </div>
  );
}
