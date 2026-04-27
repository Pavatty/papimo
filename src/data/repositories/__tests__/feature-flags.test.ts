import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("next/cache", () => ({
  unstable_cache: <T>(fn: T) => fn,
}));

const fromMock = vi.fn();
vi.mock("@/data/supabase/server", () => ({
  createClient: () => ({ from: fromMock }),
}));

function builderWith(rows: Array<{ key: string; enabled: boolean }> | null) {
  const builder: Record<string, unknown> = {};
  builder.select = vi
    .fn()
    .mockReturnValue(
      Promise.resolve({ data: rows }) as unknown as typeof builder,
    );
  return builder;
}

describe("feature-flags repository", () => {
  beforeEach(() => {
    fromMock.mockReset();
  });

  it("getFeatureFlags returns a key→enabled map", async () => {
    fromMock.mockReturnValue(
      builderWith([
        { key: "beta_mode", enabled: true },
        { key: "ai_descriptions", enabled: false },
      ]),
    );
    const { getFeatureFlags } = await import("../feature-flags");
    const flags = await getFeatureFlags();
    expect(flags.beta_mode).toBe(true);
    expect(flags.ai_descriptions).toBe(false);
  });

  it("getFeatureFlags returns empty object on null data", async () => {
    fromMock.mockReturnValue(builderWith(null));
    const { getFeatureFlags } = await import("../feature-flags");
    expect(await getFeatureFlags()).toEqual({});
  });

  it("isFlagEnabled returns true when present and enabled", async () => {
    fromMock.mockReturnValue(
      builderWith([{ key: "messaging_enabled", enabled: true }]),
    );
    const { isFlagEnabled } = await import("../feature-flags");
    expect(await isFlagEnabled("messaging_enabled")).toBe(true);
  });

  it("isFlagEnabled returns false when missing", async () => {
    fromMock.mockReturnValue(builderWith([]));
    const { isFlagEnabled } = await import("../feature-flags");
    expect(await isFlagEnabled("does_not_exist")).toBe(false);
  });
});
