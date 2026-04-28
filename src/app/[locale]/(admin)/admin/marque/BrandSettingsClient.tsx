"use client";

import { useState, useTransition } from "react";

import { saveBrandSettings } from "./actions";

interface BrandFields {
  name: string;
  logo_part1: string;
  logo_part2: string;
  tagline_fr: string;
  tagline_ar: string;
  tagline_en: string;
  contact_email: string;
}

type Props = { initial: BrandFields; locale: string };

const FIELDS: Array<{ key: keyof BrandFields; label: string; hint: string }> = [
  {
    key: "name",
    label: "Nom de marque",
    hint: 'Affiché partout (ex: "papimo")',
  },
  { key: "logo_part1", label: "Logo - partie bleue", hint: 'ex: "pap"' },
  { key: "logo_part2", label: "Logo - partie corail", hint: 'ex: "imo"' },
  {
    key: "tagline_fr",
    label: "Slogan (FR)",
    hint: 'ex: "L\'immobilier entre particuliers"',
  },
  { key: "tagline_ar", label: "Slogan (AR)", hint: "ex: العقارات بين الأفراد" },
  {
    key: "tagline_en",
    label: "Slogan (EN)",
    hint: 'ex: "Real estate, peer to peer"',
  },
  {
    key: "contact_email",
    label: "Email de contact",
    hint: 'ex: "contact@papimo.com"',
  },
];

export function BrandSettingsClient({ initial, locale }: Props) {
  const [form, setForm] = useState(initial);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const update =
    (field: keyof BrandFields) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setSaved(false);
      setForm((prev) => ({ ...prev, [field]: e.target.value }));
    };

  const submit = () =>
    startTransition(async () => {
      setError(null);
      const result = await saveBrandSettings(locale, form);
      if (result.ok) setSaved(true);
      else setError(result.error ?? "Erreur");
    });

  return (
    <div className="max-w-lg space-y-5">
      {error ? (
        <p className="rounded-control bg-red-600/10 p-3 text-sm text-red-600">
          {error}
        </p>
      ) : null}
      {FIELDS.map(({ key, label, hint }) => (
        <div key={key}>
          <label
            htmlFor={`brand-${key}`}
            className="text-encre mb-1 block text-sm font-medium"
          >
            {label}
          </label>
          <input
            id={`brand-${key}`}
            value={form[key]}
            onChange={update(key)}
            className="border-bordurewarm-tertiary text-encre focus:ring-bleu w-full rounded border bg-white px-3 py-2 text-sm focus:ring-2 focus:outline-none"
          />
          <p className="text-encre/70 mt-1 text-xs">{hint}</p>
        </div>
      ))}
      <div className="flex items-center gap-4 pt-2">
        <button
          type="button"
          onClick={submit}
          disabled={pending}
          className="bg-bleu hover:bg-bleu-hover rounded-control px-5 py-2.5 text-sm font-medium text-white transition disabled:opacity-50"
        >
          {pending ? "Sauvegarde…" : "Sauvegarder"}
        </button>
        {saved ? <span className="text-bleu text-sm">✓ Sauvegardé</span> : null}
      </div>
      <div className="border-bordurewarm-tertiary bg-creme-pale rounded-xl border p-4">
        <p className="text-encre/70 mb-2 text-xs">Aperçu du logo</p>
        <span className="font-serif text-3xl font-medium tracking-tight">
          <span className="text-bleu">{form.logo_part1}</span>
          <span className="text-corail">{form.logo_part2}</span>
        </span>
      </div>
    </div>
  );
}
