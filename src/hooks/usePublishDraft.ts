"use client";

import { useEffect, useRef, useState } from "react";

import {
  saveDraft,
  type SaveDraftInput,
} from "@/app/[locale]/(authed)/publish/actions";

export function usePublishDraft(data: SaveDraftInput) {
  const [savedId, setSavedId] = useState<string | null>(data.id ?? null);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSavedAt, setLastSavedAt] = useState<Date | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(async () => {
      setIsSaving(true);
      const result = await saveDraft(data);
      if (result.ok) {
        setLastSavedAt(new Date());
        setSavedId(result.id ?? null);
      }
      setIsSaving(false);
    }, 1500);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [data]);

  return { isSaving, lastSavedAt, savedId };
}
