"use client";

import { useTranslations } from "next-intl";
import { useState, useTransition } from "react";
import { toast } from "sonner";

import { toggleHomeSectionActive, updateHomeSection } from "./actions";

interface Section {
  id: string;
  section_key: string;
  section_type: string;
  sort_order: number;
  active: boolean;
  content_json: Record<string, unknown>;
}

type Props = {
  initialSections: Section[];
  locale: string;
};

export function HomeSectionsClient({ initialSections, locale }: Props) {
  const t = useTranslations("common");
  const [sections, setSections] = useState(initialSections);
  const [pending, startTransition] = useTransition();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draftJson, setDraftJson] = useState<string>("");
  const [jsonError, setJsonError] = useState<string | null>(null);

  const startEdit = (section: Section) => {
    setEditingId(section.id);
    setDraftJson(JSON.stringify(section.content_json, null, 2));
    setJsonError(null);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setDraftJson("");
    setJsonError(null);
  };

  const saveJson = (id: string) => {
    let parsed: Record<string, unknown>;
    try {
      parsed = JSON.parse(draftJson) as Record<string, unknown>;
    } catch (e) {
      setJsonError(`JSON invalide: ${(e as Error).message}`);
      return;
    }
    startTransition(async () => {
      const result = await updateHomeSection(locale, id, {
        content_json: parsed,
      });
      if (!result.ok) {
        toast.error(result.error ?? t("saveError"));
        return;
      }
      setSections((prev) =>
        prev.map((s) => (s.id === id ? { ...s, content_json: parsed } : s)),
      );
      setEditingId(null);
      setDraftJson("");
      toast.success(t("saveSuccess"));
    });
  };

  const toggleActive = (id: string, current: boolean) => {
    startTransition(async () => {
      const result = await toggleHomeSectionActive(locale, id, !current);
      if (!result.ok) {
        toast.error(result.error ?? t("saveError"));
        return;
      }
      setSections((prev) =>
        prev.map((s) => (s.id === id ? { ...s, active: !current } : s)),
      );
      toast.success(t("saveSuccess"));
    });
  };

  const updateOrder = (id: string, value: string) => {
    const sortOrder = parseInt(value, 10);
    if (Number.isNaN(sortOrder)) return;
    startTransition(async () => {
      const result = await updateHomeSection(locale, id, {
        sort_order: sortOrder,
      });
      if (!result.ok) {
        toast.error(result.error ?? t("saveError"));
        return;
      }
      setSections((prev) =>
        prev
          .map((s) => (s.id === id ? { ...s, sort_order: sortOrder } : s))
          .sort((a, b) => a.sort_order - b.sort_order),
      );
    });
  };

  return (
    <div className="space-y-3">
      {sections.map((section) => (
        <article
          key={section.id}
          className={`border-bordurewarm-tertiary dark:border-encre/20 bg-blanc-casse dark:bg-encre/95 rounded-card border p-4 transition ${
            section.active ? "" : "opacity-60"
          }`}
        >
          <header className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-encre dark:text-creme text-sm font-semibold">
                {section.section_key}
              </p>
              <p className="text-encre/60 dark:text-creme/60 text-xs">
                type: {section.section_type}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <label className="text-encre/70 dark:text-creme/70 inline-flex items-center gap-2 text-xs">
                Ordre
                <input
                  type="number"
                  min={0}
                  step={10}
                  defaultValue={section.sort_order}
                  onBlur={(e) => updateOrder(section.id, e.target.value)}
                  disabled={pending}
                  className="border-bordurewarm-tertiary dark:border-encre/20 bg-blanc-casse dark:bg-encre/95 text-encre dark:text-creme w-16 rounded border px-2 py-1 text-xs"
                />
              </label>
              <button
                type="button"
                onClick={() => toggleActive(section.id, section.active)}
                disabled={pending}
                className="text-encre/70 dark:text-creme/70 hover:text-encre dark:hover:text-creme text-xs transition disabled:opacity-50"
              >
                {section.active ? "Désactiver" : "Réactiver"}
              </button>
              <button
                type="button"
                onClick={() => startEdit(section)}
                disabled={pending}
                className="text-vert hover:text-vert-hover text-xs font-medium transition"
              >
                {editingId === section.id ? "Annuler" : "Éditer JSON"}
              </button>
            </div>
          </header>

          {editingId === section.id ? (
            <div className="mt-3 space-y-2">
              {jsonError ? (
                <p className="rounded bg-red-600/10 px-2 py-1 text-xs text-red-600">
                  {jsonError}
                </p>
              ) : null}
              <textarea
                value={draftJson}
                onChange={(e) => {
                  setDraftJson(e.target.value);
                  setJsonError(null);
                }}
                rows={20}
                spellCheck={false}
                className="border-bordurewarm-tertiary dark:border-encre/20 bg-blanc-casse dark:bg-encre/95 text-encre dark:text-creme min-h-64 w-full rounded border p-2 font-mono text-xs"
              />
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => saveJson(section.id)}
                  disabled={pending}
                  className="bg-vert hover:bg-vert-hover rounded-control px-4 py-2 text-xs font-medium text-white transition disabled:opacity-50"
                >
                  Sauvegarder
                </button>
                <button
                  type="button"
                  onClick={cancelEdit}
                  className="text-encre/70 dark:text-creme/70 px-4 py-2 text-xs transition"
                >
                  Annuler
                </button>
              </div>
            </div>
          ) : null}
        </article>
      ))}
    </div>
  );
}
