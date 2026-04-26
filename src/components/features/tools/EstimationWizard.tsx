"use client";

import { useState, useTransition } from "react";

import { estimatePropertyRange } from "@/app/[locale]/(public)/outils/actions";

type StepData = {
  type: "sale" | "rent";
  category: string;
  city: string;
  neighborhood: string;
  surfaceM2: number;
  rooms: number;
  yearBuilt: number;
};

const defaults: StepData = {
  type: "sale",
  category: "apartment",
  city: "",
  neighborhood: "",
  surfaceM2: 90,
  rooms: 3,
  yearBuilt: 2018,
};

export function EstimationWizard() {
  const [step, setStep] = useState(1);
  const [data, setData] = useState<StepData>(defaults);
  const [result, setResult] = useState<{
    low: number;
    mid: number;
    high: number;
    fallbackUsed: boolean;
  } | null>(null);
  const [isPending, startTransition] = useTransition();

  const submit = () =>
    startTransition(async () => {
      const res = await estimatePropertyRange({
        countryCode: "TN",
        city: data.city,
        neighborhood: data.neighborhood,
        surfaceM2: data.surfaceM2,
      });
      setResult(res);
    });

  return (
    <div className="border-line rounded-2xl border bg-white p-5">
      <p className="text-ink-soft mb-3 text-sm">Étape {step}/5</p>
      {step === 1 ? (
        <div className="grid gap-3 md:grid-cols-2">
          <select
            value={data.type}
            onChange={(e) =>
              setData((prev) => ({
                ...prev,
                type: e.target.value as "sale" | "rent",
              }))
            }
            className="border-line rounded-xl border px-3 py-2"
          >
            <option value="sale">Vente</option>
            <option value="rent">Location</option>
          </select>
          <select
            value={data.category}
            onChange={(e) =>
              setData((prev) => ({ ...prev, category: e.target.value }))
            }
            className="border-line rounded-xl border px-3 py-2"
          >
            <option value="apartment">Appartement</option>
            <option value="villa">Villa</option>
            <option value="house">Maison</option>
          </select>
        </div>
      ) : null}
      {step === 2 ? (
        <div className="grid gap-3 md:grid-cols-2">
          <input
            value={data.city}
            onChange={(e) => setData((p) => ({ ...p, city: e.target.value }))}
            className="border-line rounded-xl border px-3 py-2"
            placeholder="Ville"
          />
          <input
            value={data.neighborhood}
            onChange={(e) =>
              setData((p) => ({ ...p, neighborhood: e.target.value }))
            }
            className="border-line rounded-xl border px-3 py-2"
            placeholder="Quartier"
          />
        </div>
      ) : null}
      {step === 3 ? (
        <div>
          <label className="text-ink-soft text-sm">Surface m²</label>
          <input
            type="number"
            value={data.surfaceM2}
            onChange={(e) =>
              setData((p) => ({ ...p, surfaceM2: Number(e.target.value) }))
            }
            className="border-line mt-1 w-full rounded-xl border px-3 py-2"
          />
        </div>
      ) : null}
      {step === 4 ? (
        <div>
          <label className="text-ink-soft text-sm">Chambres</label>
          <input
            type="number"
            value={data.rooms}
            onChange={(e) =>
              setData((p) => ({ ...p, rooms: Number(e.target.value) }))
            }
            className="border-line mt-1 w-full rounded-xl border px-3 py-2"
          />
        </div>
      ) : null}
      {step === 5 ? (
        <div>
          <label className="text-ink-soft text-sm">Année de construction</label>
          <input
            type="number"
            value={data.yearBuilt}
            onChange={(e) =>
              setData((p) => ({ ...p, yearBuilt: Number(e.target.value) }))
            }
            className="border-line mt-1 w-full rounded-xl border px-3 py-2"
          />
        </div>
      ) : null}

      <div className="mt-4 flex justify-between">
        <button
          type="button"
          disabled={step === 1}
          onClick={() => setStep((s) => Math.max(1, s - 1))}
          className="border-line rounded-xl border bg-white px-3 py-2 text-sm"
        >
          Précédent
        </button>
        {step < 5 ? (
          <button
            type="button"
            onClick={() => setStep((s) => Math.min(5, s + 1))}
            className="bg-corail rounded-xl px-3 py-2 text-sm font-semibold text-white"
          >
            Suivant
          </button>
        ) : (
          <button
            type="button"
            onClick={submit}
            className="bg-corail rounded-xl px-3 py-2 text-sm font-semibold text-white"
            disabled={isPending}
          >
            Calculer
          </button>
        )}
      </div>

      {result ? (
        <div className="mt-5 border-t pt-4">
          <p className="text-ink text-sm font-medium">Fourchette estimée</p>
          {result.fallbackUsed ? (
            <p className="text-ink-soft mt-1 text-xs">
              Fallback moyenne ville utilisé.
            </p>
          ) : null}
          <div className="mt-3 space-y-2">
            {[
              { label: "Bas", value: result.low, width: 70 },
              { label: "Médian", value: result.mid, width: 100 },
              { label: "Haut", value: result.high, width: 82 },
            ].map((it) => (
              <div key={it.label}>
                <div className="text-ink-soft mb-1 flex justify-between text-xs">
                  <span>{it.label}</span>
                  <span>{it.value} DT</span>
                </div>
                <div className="bg-bleu-soft h-2 rounded">
                  <div
                    className="bg-bleu h-2 rounded"
                    style={{ width: `${it.width}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
