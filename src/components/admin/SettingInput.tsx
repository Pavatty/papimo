"use client";

import { Check } from "lucide-react";
import { useState, useTransition } from "react";

import { updateSetting } from "@/app/actions/settings";

type Props = {
  label: string;
  settingKey: string;
  type?: "text" | "number";
  value: string;
  description?: string | null;
};

export function SettingInput({
  label,
  settingKey,
  type = "text",
  value,
  description,
}: Props) {
  const [current, setCurrent] = useState(value);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const changed = current !== value;

  return (
    <div>
      <label className="text-encre dark:text-creme mb-1 block text-sm font-medium">
        {label}
      </label>
      {description ? (
        <p className="text-encre/60 dark:text-creme/60 mb-2 text-xs">
          {description}
        </p>
      ) : null}
      <div className="flex items-center gap-2">
        <input
          type={type}
          value={current}
          onChange={(e) => {
            setCurrent(e.target.value);
            setError(null);
            setSuccess(false);
          }}
          className="border-bordurewarm-tertiary text-encre dark:bg-encre/30 dark:text-creme focus:border-vert flex-1 rounded-md border bg-white px-3 py-2 text-sm focus:outline-none"
        />
        <button
          type="button"
          onClick={() => {
            setError(null);
            startTransition(async () => {
              const result = await updateSetting({
                key: settingKey,
                value: current,
              });
              if (result.ok) {
                setSuccess(true);
                window.setTimeout(() => setSuccess(false), 2000);
              } else {
                setError(result.error);
              }
            });
          }}
          disabled={pending || !changed}
          className={`rounded-md px-4 py-2 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-50 ${
            success
              ? "bg-vert text-white"
              : "bg-vert hover:bg-vert-hover text-white"
          }`}
        >
          {success ? <Check className="h-4 w-4" /> : pending ? "…" : "Sauver"}
        </button>
      </div>
      {error ? (
        <p className="bg-coeur-soft text-coeur mt-2 rounded-md px-2 py-1 text-xs">
          {error}
        </p>
      ) : null}
    </div>
  );
}
