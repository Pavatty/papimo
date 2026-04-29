"use client";

import { useState, useTransition } from "react";

import { updateSetting } from "@/app/actions/settings";

type Props = {
  label: string;
  settingKey: string;
  value: boolean;
  description?: string | null;
};

export function SettingToggle({
  label,
  settingKey,
  value,
  description,
}: Props) {
  const [enabled, setEnabled] = useState(value);
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  return (
    <div className="bg-creme-foncee/40 dark:bg-encre/40 flex items-start justify-between gap-4 rounded-md p-4">
      <div className="flex-1">
        <p className="text-encre dark:text-creme text-sm font-medium">
          {label}
        </p>
        {description ? (
          <p className="text-encre/60 dark:text-creme/60 mt-0.5 text-xs">
            {description}
          </p>
        ) : null}
        {error ? <p className="text-coeur mt-1 text-xs">{error}</p> : null}
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={enabled}
        onClick={() => {
          const next = !enabled;
          setEnabled(next);
          setError(null);
          startTransition(async () => {
            const result = await updateSetting({
              key: settingKey,
              value: next ? "true" : "false",
            });
            if (!result.ok) {
              setEnabled(!next);
              setError(result.error);
            }
          });
        }}
        disabled={pending}
        className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition disabled:opacity-50 ${
          enabled ? "bg-vert" : "bg-bordurewarm-secondary"
        }`}
      >
        <span
          className={`inline-block h-4 w-4 rounded-full bg-white transition ${
            enabled ? "translate-x-6" : "translate-x-1"
          }`}
        />
      </button>
    </div>
  );
}
