"use client";

import { useEffect, useMemo, useState, useTransition } from "react";

import {
  getPriceMedian,
  improveDescription,
} from "@/app/[locale]/(authed)/publish/actions";

type Props = {
  value: {
    price: number | null;
    currency: "TND" | "EUR" | "USD" | "MAD" | "DZD";
    title: string;
    description: string;
    city: string;
    neighborhood: string;
    country_code: string;
    type?: "sale" | "rent";
    surface_m2: number | null;
  };
  onChange: (next: Partial<Props["value"]>) => void;
  preferredCurrency?: "TND" | "EUR" | "USD" | "MAD" | "DZD";
};

export function Step6PriceDescription({
  value,
  onChange,
  preferredCurrency,
}: Props) {
  const [median, setMedian] = useState<number | null>(null);
  const [warning, setWarning] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (!value.type || !value.city) return;
    startTransition(async () => {
      const result = await getPriceMedian(
        value.country_code || "TN",
        value.city,
        value.neighborhood || null,
        value.type,
      );
      setMedian(result.median ?? null);
    });
  }, [value.type, value.city, value.neighborhood, value.country_code]);

  const medianStatus = useMemo(() => {
    if (!median || !value.price || !value.surface_m2) return null;
    const pricePerM2 = value.price / value.surface_m2;
    const ratio = pricePerM2 / median;
    if (ratio >= 0.8 && ratio <= 1.2) return "green";
    if (ratio >= 0.5 && ratio <= 1.5) return "orange";
    return "red";
  }, [median, value.price, value.surface_m2]);

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label
            className="text-ink text-sm font-medium"
            htmlFor="publish-price"
          >
            Prix
          </label>
          <div className="border-line mt-1 flex rounded-xl border bg-white">
            <select
              value={value.currency || preferredCurrency || "TND"}
              onChange={(event) =>
                onChange({
                  currency: event.target.value as Props["value"]["currency"],
                })
              }
              className="border-line rounded-l-xl border-r px-3 py-2.5 text-sm outline-none"
            >
              {["TND", "EUR", "USD", "MAD", "DZD"].map((currency) => (
                <option key={currency} value={currency}>
                  {currency}
                </option>
              ))}
            </select>
            <input
              id="publish-price"
              type="number"
              value={value.price ?? ""}
              onChange={(event) =>
                onChange({
                  price: event.target.value ? Number(event.target.value) : null,
                })
              }
              className="w-full rounded-r-xl px-3 py-2.5 outline-none"
              required
            />
          </div>
        </div>
      </div>

      {medianStatus ? (
        <div
          className={`rounded-xl p-3 text-sm ${
            medianStatus === "green"
              ? "bg-green/10 text-green"
              : medianStatus === "orange"
                ? "bg-orange-100 text-orange-700"
                : "bg-red-100 text-red-700"
          }`}
        >
          {medianStatus === "green" &&
            "Prix cohérent avec le marché du quartier"}
          {medianStatus === "orange" &&
            "Prix modérément éloigné du marché du quartier"}
          {medianStatus === "red" &&
            "Prix très inférieur ou supérieur au marché du quartier"}
        </div>
      ) : null}

      <div>
        <label className="text-ink text-sm font-medium" htmlFor="publish-title">
          Titre
        </label>
        <input
          id="publish-title"
          value={value.title}
          maxLength={80}
          onChange={(event) => onChange({ title: event.target.value })}
          className="border-line focus:border-bleu mt-1 w-full rounded-xl border bg-white px-3 py-2.5 outline-none"
          required
        />
        <p className="text-ink-soft mt-1 text-xs">{value.title.length}/80</p>
      </div>

      <div>
        <label
          className="text-ink text-sm font-medium"
          htmlFor="publish-description"
        >
          Description
        </label>
        <textarea
          id="publish-description"
          value={value.description}
          maxLength={2000}
          rows={7}
          onChange={(event) => onChange({ description: event.target.value })}
          className="border-line focus:border-bleu mt-1 w-full rounded-xl border bg-white px-3 py-2.5 outline-none"
        />
        <div className="mt-2 flex items-center justify-between">
          <p className="text-ink-soft text-xs">
            {value.description.length}/2000
          </p>
          <button
            type="button"
            className="border-line text-ink rounded-lg border bg-white px-3 py-1.5 text-xs"
            onClick={() =>
              startTransition(async () => {
                const result = await improveDescription(value.description);
                onChange({ description: result.improvedText });
                setWarning(result.warning ?? null);
              })
            }
          >
            Améliorer avec l&#39;IA
          </button>
        </div>
        {warning ? (
          <p className="text-ink-soft mt-2 text-xs">{warning}</p>
        ) : null}
      </div>
      {isPending ? (
        <p className="text-ink-soft text-xs">Calcul en cours…</p>
      ) : null}
    </div>
  );
}
