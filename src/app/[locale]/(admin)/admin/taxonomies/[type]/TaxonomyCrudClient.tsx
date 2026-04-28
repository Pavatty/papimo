"use client";

import { useTranslations } from "next-intl";
import { useState, useTransition } from "react";
import { toast } from "sonner";

import { toggleTaxonomyActive, updateTaxonomyRow } from "./actions";

export type TaxonomyKind = "transaction_types" | "property_types" | "amenities";

export interface TaxonomyRow {
  id: string;
  code: string;
  label_fr: string;
  label_ar: string;
  label_en: string;
  sort_order: number;
  is_active: boolean;
  category?: string;
}

type Props = {
  kind: TaxonomyKind;
  rows: TaxonomyRow[];
  locale: string;
};

type Draft = Partial<
  Pick<TaxonomyRow, "label_fr" | "label_ar" | "label_en" | "sort_order">
>;

export function TaxonomyCrudClient({ kind, rows, locale }: Props) {
  const t = useTranslations("common");
  const [items, setItems] = useState<TaxonomyRow[]>(rows);
  const [editing, setEditing] = useState<string | null>(null);
  const [draft, setDraft] = useState<Draft>({});
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const startEdit = (row: TaxonomyRow) => {
    setEditing(row.id);
    setDraft({
      label_fr: row.label_fr,
      label_ar: row.label_ar,
      label_en: row.label_en,
      sort_order: row.sort_order,
    });
    setError(null);
  };

  const cancelEdit = () => {
    setEditing(null);
    setDraft({});
  };

  const save = (id: string) => {
    startTransition(async () => {
      const result = await updateTaxonomyRow(locale, kind, id, draft);
      if (!result.ok) {
        setError(result.error ?? "Erreur");
        toast.error(result.error ?? t("saveError"));
        return;
      }
      setItems((prev) =>
        prev.map((r) => (r.id === id ? { ...r, ...draft } : r)),
      );
      setEditing(null);
      setDraft({});
      setError(null);
      toast.success(t("saveSuccess"));
    });
  };

  const toggleActive = (id: string, current: boolean) => {
    startTransition(async () => {
      const result = await toggleTaxonomyActive(locale, kind, id, !current);
      if (!result.ok) {
        setError(result.error ?? "Erreur");
        toast.error(result.error ?? t("saveError"));
        return;
      }
      setItems((prev) =>
        prev.map((r) => (r.id === id ? { ...r, is_active: !current } : r)),
      );
      toast.success(t("saveSuccess"));
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
        {items.map((row) => (
          <div
            key={row.id}
            className={`border-bordurewarm-tertiary dark:border-encre/20 rounded-xl border bg-white p-4 transition ${row.is_active ? "" : "opacity-50"}`}
          >
            {editing === row.id ? (
              <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                {(
                  ["label_fr", "label_ar", "label_en", "sort_order"] as const
                ).map((field) => (
                  <div key={field}>
                    <label className="text-encre/70 dark:text-creme/70 mb-1 block text-xs">
                      {field}
                    </label>
                    <input
                      type={field === "sort_order" ? "number" : "text"}
                      value={String(draft[field] ?? "")}
                      onChange={(e) =>
                        setDraft((prev) => ({
                          ...prev,
                          [field]:
                            field === "sort_order"
                              ? parseInt(e.target.value, 10) || 0
                              : e.target.value,
                        }))
                      }
                      className="border-bordurewarm-tertiary dark:border-encre/20 text-encre dark:text-creme focus:ring-bleu w-full rounded border bg-white px-2 py-1.5 text-sm focus:ring-1 focus:outline-none"
                    />
                  </div>
                ))}
                <div className="col-span-2 mt-1 flex gap-2 md:col-span-4">
                  <button
                    type="button"
                    onClick={() => save(row.id)}
                    disabled={pending}
                    className="bg-bleu hover:bg-bleu-hover rounded-control px-4 py-2 text-xs font-medium text-white transition disabled:opacity-50"
                  >
                    Sauvegarder
                  </button>
                  <button
                    type="button"
                    onClick={cancelEdit}
                    className="text-encre/70 dark:text-creme/70 hover:text-encre px-4 py-2 text-xs transition"
                  >
                    Annuler
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <p className="text-encre dark:text-creme text-sm font-medium">
                    {row.label_fr}
                  </p>
                  <p className="text-encre/70 dark:text-creme/70 mt-0.5 truncate text-xs">
                    {row.label_ar} · {row.label_en} · code: {row.code}
                    {row.category ? ` · ${row.category}` : ""}
                  </p>
                </div>
                <div className="flex flex-shrink-0 items-center gap-3">
                  <button
                    type="button"
                    onClick={() => toggleActive(row.id, row.is_active)}
                    disabled={pending}
                    className="text-encre/70 dark:text-creme/70 hover:text-encre text-xs transition disabled:opacity-50"
                  >
                    {row.is_active ? "Désactiver" : "Réactiver"}
                  </button>
                  <button
                    type="button"
                    onClick={() => startEdit(row)}
                    className="text-bleu hover:text-bleu-hover text-xs font-medium transition"
                  >
                    Modifier
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
