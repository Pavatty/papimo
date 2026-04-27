"use client";

import { useMemo } from "react";
import { useLocale, useTranslations } from "next-intl";

import {
  COUNTRIES,
  getCitiesByRegion,
  getNeighborhoodsByCity,
  getRegionsByCountry,
} from "@/lib/constants/geography";

type Props = {
  country?: string | undefined;
  region?: string | undefined;
  city?: string | undefined;
  neighborhoods: string[];
  onChange: (next: {
    country?: string | undefined;
    region?: string | undefined;
    city?: string | undefined;
    neighborhoods: string[];
  }) => void;
};

export function LocationCascade({
  country,
  region,
  city,
  neighborhoods,
  onChange,
}: Props) {
  const t = useTranslations("search");
  const locale = useLocale();

  const regions = useMemo(
    () => (country ? getRegionsByCountry(country) : []),
    [country],
  );
  const cities = useMemo(
    () => (country && region ? getCitiesByRegion(country, region) : []),
    [country, region],
  );
  const availableNeighborhoods = useMemo(
    () =>
      country && region && city
        ? getNeighborhoodsByCity(country, region, city)
        : [],
    [country, region, city],
  );

  return (
    <div className="space-y-2">
      <select
        value={country ?? "TN"}
        onChange={(event) =>
          onChange({
            country: event.target.value || undefined,
            region: undefined,
            city: undefined,
            neighborhoods: [],
          })
        }
        className="border-line w-full rounded-lg border px-2 py-1.5 text-sm"
      >
        {COUNTRIES.map((item) => {
          const label =
            locale === "ar"
              ? item.name_ar
              : locale === "en"
                ? item.name_en
                : item.name_fr;
          return (
            <option key={item.code} value={item.code}>
              {item.flag} {label}
            </option>
          );
        })}
      </select>

      <select
        value={region ?? ""}
        onChange={(event) =>
          onChange({
            country,
            region: event.target.value || undefined,
            city: undefined,
            neighborhoods: [],
          })
        }
        className="border-line w-full rounded-lg border px-2 py-1.5 text-sm"
      >
        <option value="">{t("filters.region")}</option>
        {regions.map((item) => (
          <option key={item.name} value={item.name}>
            {item.name}
          </option>
        ))}
      </select>

      <select
        value={city ?? ""}
        onChange={(event) =>
          onChange({
            country,
            region,
            city: event.target.value || undefined,
            neighborhoods: [],
          })
        }
        className="border-line w-full rounded-lg border px-2 py-1.5 text-sm"
      >
        <option value="">{t("filters.city")}</option>
        {cities.map((item) => (
          <option key={item.name} value={item.name}>
            {item.name}
          </option>
        ))}
      </select>

      {availableNeighborhoods.length > 0 ? (
        <div>
          <p className="text-ink-soft mb-1 text-xs">
            {t("filters.neighborhoods")}
          </p>
          <div className="flex max-h-28 flex-wrap gap-1 overflow-y-auto">
            {availableNeighborhoods.map((item) => {
              const isSelected = neighborhoods.includes(item);
              return (
                <button
                  key={item}
                  type="button"
                  onClick={() =>
                    onChange({
                      country,
                      region,
                      city,
                      neighborhoods: isSelected
                        ? neighborhoods.filter((n) => n !== item)
                        : [...neighborhoods, item],
                    })
                  }
                  className={`rounded-full border px-2 py-1 text-xs ${
                    isSelected
                      ? "border-bleu bg-bleu-pale text-bleu"
                      : "border-line text-ink bg-white"
                  }`}
                >
                  {item}
                </button>
              );
            })}
          </div>
        </div>
      ) : null}
    </div>
  );
}
