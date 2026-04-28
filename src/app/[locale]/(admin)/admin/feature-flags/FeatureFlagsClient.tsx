"use client";

import { useState, useTransition } from "react";

import { toggleFeatureFlag } from "./actions";

interface Flag {
  key: string;
  enabled: boolean;
  description: string | null;
  rollout_pct: number;
  updated_at: string;
}

type Props = {
  initialFlags: Flag[];
  locale: string;
};

export function FeatureFlagsClient({ initialFlags, locale }: Props) {
  const [flags, setFlags] = useState(initialFlags);
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const toggle = (key: string) => {
    const current = flags.find((f) => f.key === key);
    if (!current) return;
    const newEnabled = !current.enabled;
    setFlags((prev) =>
      prev.map((f) => (f.key === key ? { ...f, enabled: newEnabled } : f)),
    );
    startTransition(async () => {
      const result = await toggleFeatureFlag(locale, key, newEnabled);
      if (!result.ok) {
        setFlags((prev) =>
          prev.map((f) =>
            f.key === key ? { ...f, enabled: current.enabled } : f,
          ),
        );
        setError(result.error ?? "Erreur");
      } else {
        setError(null);
      }
    });
  };

  return (
    <div>
      {error ? (
        <p className="rounded-control mb-4 bg-red-600/10 p-3 text-sm text-red-600">
          {error}
        </p>
      ) : null}
      <div className="space-y-2">
        {flags.map((flag) => (
          <div
            key={flag.key}
            className="border-bordurewarm-tertiary flex items-center justify-between gap-4 rounded-xl border bg-white px-5 py-4"
          >
            <div className="min-w-0 flex-1">
              <p className="text-encre text-sm font-medium">{flag.key}</p>
              {flag.description ? (
                <p className="text-encre/70 mt-0.5 text-xs">
                  {flag.description}
                </p>
              ) : null}
            </div>
            <button
              type="button"
              onClick={() => toggle(flag.key)}
              disabled={pending}
              aria-pressed={flag.enabled}
              aria-label={`${flag.enabled ? "Désactiver" : "Activer"} ${flag.key}`}
              className={`focus-visible:ring-bleu relative inline-flex h-6 w-11 flex-shrink-0 items-center rounded-full transition-colors focus-visible:ring-2 focus-visible:outline-none disabled:opacity-50 ${
                flag.enabled ? "bg-bleu" : "bg-line"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  flag.enabled ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
