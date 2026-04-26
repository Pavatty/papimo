"use client";

import { MapPin } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

type Props = {
  value: {
    address: string;
    city: string;
    neighborhood: string;
    latitude: number | null;
    longitude: number | null;
    country_code: string;
  };
  onChange: (next: Partial<Props["value"]>) => void;
};

type Suggestion = {
  id: string;
  place_name: string;
  center: [number, number];
  context?: Array<{ id: string; text: string }>;
};

export function Step3Location({ value, onChange }: Props) {
  const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
  const [query, setQuery] = useState(value.address ?? "");
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);

  const isTokenAvailable = Boolean(token);

  useEffect(() => {
    if (!isTokenAvailable || query.trim().length < 3) {
      return;
    }

    const handle = setTimeout(async () => {
      const encoded = encodeURIComponent(query.trim());
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encoded}.json?access_token=${token}&country=tn,ma,dz,fr&limit=5`,
      );
      if (!response.ok) {
        setSuggestions([]);
        return;
      }
      const json = await response.json();
      setSuggestions((json.features ?? []) as Suggestion[]);
    }, 300);

    return () => clearTimeout(handle);
  }, [query, token, isTokenAvailable]);

  const mapUrl = useMemo(() => {
    const lon = value.longitude ?? 10.2;
    const lat = value.latitude ?? 36.8;
    return `https://api.mapbox.com/styles/v1/mapbox/streets-v12.html?title=false&zoomwheel=true&fresh=true#9/${lat}/${lon}`;
  }, [value.latitude, value.longitude]);

  return (
    <div className="space-y-4">
      {!isTokenAvailable ? (
        <p className="bg-corail-pale text-ink rounded-xl p-3 text-sm">
          NEXT_PUBLIC_MAPBOX_TOKEN non configuré. Saisie manuelle activée.
        </p>
      ) : null}

      <label className="text-ink text-sm font-medium">Adresse</label>
      <div className="relative">
        <MapPin className="text-ink-soft absolute top-3 left-3 h-4 w-4" />
        <input
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            onChange({ address: event.target.value });
          }}
          className="border-line focus:border-bleu w-full rounded-xl border bg-white py-2.5 pr-3 pl-9 outline-none"
          placeholder="Rue, quartier, ville"
        />
        {suggestions.length > 0 ? (
          <div className="border-line absolute z-10 mt-1 max-h-64 w-full overflow-auto rounded-xl border bg-white shadow">
            {suggestions.map((suggestion) => (
              <button
                key={suggestion.id}
                type="button"
                className="hover:bg-bleu-pale block w-full px-3 py-2 text-left text-sm"
                onClick={() => {
                  const cityCtx = suggestion.context?.find((ctx) =>
                    ctx.id.startsWith("place"),
                  );
                  const neighborhoodCtx = suggestion.context?.find((ctx) =>
                    ctx.id.startsWith("neighborhood"),
                  );
                  setQuery(suggestion.place_name);
                  setSuggestions([]);
                  onChange({
                    address: suggestion.place_name,
                    longitude: suggestion.center[0],
                    latitude: suggestion.center[1],
                    city: cityCtx?.text ?? value.city,
                    neighborhood: neighborhoodCtx?.text ?? value.neighborhood,
                  });
                }}
              >
                {suggestion.place_name}
              </button>
            ))}
          </div>
        ) : null}
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        <div>
          <label
            className="text-ink text-sm font-medium"
            htmlFor="publish-city"
          >
            Ville
          </label>
          <input
            id="publish-city"
            value={value.city}
            onChange={(event) => onChange({ city: event.target.value })}
            className="border-line focus:border-bleu mt-1 w-full rounded-xl border bg-white px-3 py-2.5 outline-none"
            placeholder="La Marsa"
          />
        </div>
        <div>
          <label
            className="text-ink text-sm font-medium"
            htmlFor="publish-neighborhood"
          >
            Quartier
          </label>
          <input
            id="publish-neighborhood"
            value={value.neighborhood}
            onChange={(event) => onChange({ neighborhood: event.target.value })}
            className="border-line focus:border-bleu mt-1 w-full rounded-xl border bg-white px-3 py-2.5 outline-none"
            placeholder="Sidi Daoud"
          />
        </div>
      </div>

      {isTokenAvailable ? (
        <div className="border-line overflow-hidden rounded-2xl border bg-white">
          <iframe
            title="Mapbox preview"
            src={mapUrl}
            className="h-[400px] w-full"
          />
          <div className="grid gap-3 border-t p-3 md:grid-cols-2">
            <div>
              <label className="text-ink-soft text-xs">Latitude</label>
              <input
                type="number"
                step="0.0000001"
                value={value.latitude ?? ""}
                onChange={(event) =>
                  onChange({
                    latitude: event.target.value
                      ? Number(event.target.value)
                      : null,
                  })
                }
                className="border-line mt-1 w-full rounded-lg border px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="text-ink-soft text-xs">Longitude</label>
              <input
                type="number"
                step="0.0000001"
                value={value.longitude ?? ""}
                onChange={(event) =>
                  onChange({
                    longitude: event.target.value
                      ? Number(event.target.value)
                      : null,
                  })
                }
                className="border-line mt-1 w-full rounded-lg border px-3 py-2 text-sm"
              />
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
