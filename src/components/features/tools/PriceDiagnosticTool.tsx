"use client";

import { useState, useTransition } from "react";

import { runPriceDiagnostic } from "@/app/[locale]/(public)/outils/actions";

export function PriceDiagnosticTool() {
  const [value, setValue] = useState("");
  const [result, setResult] = useState<{
    score: number;
    details: Record<string, number>;
    recommendations: string[];
  } | null>(null);
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  return (
    <section className="border-line rounded-2xl border bg-white p-5">
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="border-line w-full rounded-xl border px-3 py-2"
        placeholder="URL papimo ou ID annonce"
      />
      <button
        type="button"
        className="bg-corail mt-3 rounded-xl px-4 py-2 text-sm font-semibold text-white"
        onClick={() =>
          startTransition(async () => {
            const idOrSlug = value.includes("/listings/")
              ? (value.split("/listings/")[1]?.split("?")[0] ?? value)
              : value;
            const res = await runPriceDiagnostic({ listingIdOrSlug: idOrSlug });
            if (!res.ok) {
              setError(res.error ?? "Erreur");
              setResult(null);
              return;
            }
            setError("");
            setResult({
              score: res.score,
              details: res.details,
              recommendations: res.recommendations,
            });
          })
        }
        disabled={isPending || !value.trim()}
      >
        Analyser
      </button>

      {error ? <p className="text-danger mt-2 text-sm">{error}</p> : null}
      {result ? (
        <div className="bg-creme-pale mt-4 rounded-xl p-4">
          <p className="text-ink text-lg font-semibold">
            Score global: {result.score}/100
          </p>
          <div className="text-ink-soft mt-2 grid gap-1 text-xs">
            {Object.entries(result.details).map(([k, v]) => (
              <p key={k}>
                {k}: {v}
              </p>
            ))}
          </div>
          <ul className="text-ink mt-3 space-y-1 text-sm">
            {result.recommendations.map((r) => (
              <li key={r}>• {r}</li>
            ))}
          </ul>
        </div>
      ) : null}
    </section>
  );
}
