import { renderHook } from "@testing-library/react";
import { act } from "react";
import { describe, expect, it, vi } from "vitest";

import type { SaveDraftInput } from "@/app/[locale]/(authed)/publish/actions";
import { usePublishDraft } from "@/hooks/usePublishDraft";

const saveDraftMock = vi.fn(async (_input: SaveDraftInput) => ({
  ok: true,
  id: "draft-id",
}));

vi.mock("@/app/[locale]/(authed)/publish/actions", () => ({
  saveDraft: (input: SaveDraftInput) => saveDraftMock(input),
}));

describe("usePublishDraft", () => {
  it("debounces draft save by 1.5s", async () => {
    vi.useFakeTimers();
    const payload = {
      title: "Appartement",
      description: "",
      price: null,
      currency: "TND",
      surface_m2: null,
      rooms: null,
      bedrooms: null,
      bathrooms: null,
      floor: null,
      total_floors: null,
      year_built: null,
      latitude: null,
      longitude: null,
      address: "",
      city: "",
      neighborhood: "",
      country_code: "TN",
      pack: "free",
      amenities: [],
    } satisfies SaveDraftInput;

    renderHook(() => usePublishDraft(payload));
    expect(saveDraftMock).toHaveBeenCalledTimes(0);

    await act(async () => {
      vi.advanceTimersByTime(1490);
    });
    expect(saveDraftMock).toHaveBeenCalledTimes(0);

    await act(async () => {
      vi.advanceTimersByTime(20);
      await Promise.resolve();
    });
    expect(saveDraftMock).toHaveBeenCalledTimes(1);
    vi.useRealTimers();
  });
});
