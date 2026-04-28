"use client";

import { useMemo, useState } from "react";

import { computeAcquisitionFees } from "@/lib/tools/calculations";

export function FeesCalculator() {
  const [price, setPrice] = useState(300000);
  const [countryCode, setCountryCode] = useState("TN");

  const fees = useMemo(
    () => computeAcquisitionFees({ price, countryCode }),
    [price, countryCode],
  );

  // LODGE est gratuit pour particuliers (3 annonces max), 0% commission.
  // L'outil n'affiche donc que les frais réels d'acquisition.
  const rows = [
    ["Droits enregistrement", fees.registration],
    ["Honoraires notaire", fees.notary],
    ["Taxe foncière prorata", fees.propertyTaxProrata],
    ["Frais dossier banque", fees.bankFileFee],
  ];
  const totalSansAgence =
    fees.registration +
    fees.notary +
    fees.propertyTaxProrata +
    fees.bankFileFee;

  return (
    <section className="border-line rounded-2xl border bg-white p-5">
      <div className="grid gap-3 md:grid-cols-2">
        <input
          type="number"
          value={price}
          onChange={(e) => setPrice(Number(e.target.value))}
          className="border-line rounded-xl border px-3 py-2"
          placeholder="Prix du bien"
        />
        <select
          value={countryCode}
          onChange={(e) => setCountryCode(e.target.value)}
          className="border-line rounded-xl border px-3 py-2"
        >
          {["TN", "MA", "FR", "DZ"].map((code) => (
            <option key={code} value={code}>
              {code}
            </option>
          ))}
        </select>
      </div>

      <div className="mt-5 space-y-2 text-sm">
        {rows.map(([label, amount]) => (
          <div
            key={label}
            className="border-line flex justify-between border-b py-2"
          >
            <span className="text-ink-soft">{label}</span>
            <span className="text-ink font-medium">
              {Math.round(Number(amount))} DT
            </span>
          </div>
        ))}
      </div>
      <div className="mt-4 flex justify-between">
        <span className="text-ink font-semibold">Total</span>
        <span className="text-bleu text-xl font-bold">
          {Math.round(totalSansAgence)} DT
        </span>
      </div>
    </section>
  );
}
