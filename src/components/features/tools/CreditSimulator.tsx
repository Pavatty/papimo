"use client";

import { useMemo, useState } from "react";

import {
  buildYearlySchedule,
  computeAcquisitionFees,
  estimateMonthlyPayment,
} from "@/lib/tools/calculations";

export function CreditSimulator() {
  const [price, setPrice] = useState(300000);
  const [downPayment, setDownPayment] = useState(60000);
  const [years, setYears] = useState(20);
  const [rate, setRate] = useState(8);
  const [countryCode, setCountryCode] = useState("TN");

  const principal = Math.max(0, price - downPayment);
  const monthly = useMemo(
    () =>
      estimateMonthlyPayment({
        principal,
        annualRatePercent: rate,
        years,
      }),
    [principal, rate, years],
  );
  const schedule = useMemo(
    () =>
      buildYearlySchedule({
        principal,
        annualRatePercent: rate,
        years,
      }),
    [principal, rate, years],
  );
  const totalPaid = monthly * years * 12;
  const totalInterest = totalPaid - principal;
  const fees = computeAcquisitionFees({ price, countryCode });

  return (
    <div className="space-y-5">
      <section className="border-line rounded-2xl border bg-white p-5">
        <div className="grid gap-3 md:grid-cols-2">
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(Number(e.target.value))}
            className="border-line rounded-xl border px-3 py-2"
            placeholder="Prix du bien"
          />
          <input
            type="number"
            value={downPayment}
            onChange={(e) => setDownPayment(Number(e.target.value))}
            className="border-line rounded-xl border px-3 py-2"
            placeholder="Apport"
          />
          <select
            value={years}
            onChange={(e) => setYears(Number(e.target.value))}
            className="border-line rounded-xl border px-3 py-2"
          >
            {[10, 15, 20, 25, 30].map((y) => (
              <option key={y} value={y}>
                {y} ans
              </option>
            ))}
          </select>
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
        <div className="mt-4">
          <label className="text-ink-soft text-sm">Taux annuel: {rate}%</label>
          <input
            type="range"
            min={4}
            max={12}
            step={0.1}
            value={rate}
            onChange={(e) => setRate(Number(e.target.value))}
            className="w-full"
          />
        </div>
      </section>

      <section className="border-line rounded-2xl border bg-white p-5">
        <div className="grid gap-3 md:grid-cols-3">
          <div>
            <p className="text-ink-soft text-xs">Mensualité</p>
            <p className="text-bleu text-2xl font-bold">
              {Math.round(monthly)} DT
            </p>
          </div>
          <div>
            <p className="text-ink-soft text-xs">Intérêts cumulés</p>
            <p className="text-ink text-xl font-semibold">
              {Math.round(totalInterest)} DT
            </p>
          </div>
          <div>
            <p className="text-ink-soft text-xs">Frais achat estimés</p>
            <p className="text-ink text-xl font-semibold">
              {Math.round(fees.total)} DT
            </p>
          </div>
        </div>
      </section>

      <section className="border-line rounded-2xl border bg-white p-5">
        <h2 className="text-ink mb-3 text-lg font-semibold">
          Échéancier annuel
        </h2>
        <div className="space-y-2">
          {schedule.rows.map((row) => (
            <details
              key={row.year}
              className="border-line rounded-lg border p-3"
            >
              <summary className="text-ink cursor-pointer text-sm font-medium">
                Année {row.year}
              </summary>
              <div className="text-ink-soft mt-2 grid grid-cols-1 gap-1 text-xs md:grid-cols-3">
                <p>Principal payé: {Math.round(row.principalPaid)} DT</p>
                <p>Intérêts payés: {Math.round(row.interestPaid)} DT</p>
                <p>Reste dû: {Math.round(row.remaining)} DT</p>
              </div>
            </details>
          ))}
        </div>
      </section>
    </div>
  );
}
