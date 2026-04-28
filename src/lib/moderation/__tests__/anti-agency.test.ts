import { afterEach, describe, expect, it, vi } from "vitest";

import { checkAntiAgency } from "@/lib/moderation/anti-agency";

let listingsCount = 0;
let settingValue: number | null = null;

vi.mock("@/data/supabase/server", () => ({
  createClient: vi.fn(async () => ({
    from: (table: string) => {
      if (table === "app_settings") {
        return {
          select: () => ({
            eq: () => ({
              maybeSingle: async () => ({
                data: settingValue === null ? null : { value: settingValue },
              }),
            }),
          }),
        };
      }
      return {
        select: () => ({
          eq: () => ({
            eq: () => ({
              in: async () => ({ count: listingsCount }),
            }),
          }),
        }),
      };
    },
  })),
}));

afterEach(() => {
  listingsCount = 0;
  settingValue = null;
});

describe("checkAntiAgency", () => {
  it("allows under default max (3)", async () => {
    listingsCount = 1;
    const result = await checkAntiAgency("user-1");
    expect(result.allowed).toBe(true);
    expect(result.activeCount).toBe(1);
    expect(result.max).toBe(3);
  });

  it("blocks at or above max", async () => {
    listingsCount = 3;
    const result = await checkAntiAgency("user-1");
    expect(result.allowed).toBe(false);
  });

  it("respects DB setting override", async () => {
    settingValue = 5;
    listingsCount = 4;
    const result = await checkAntiAgency("user-1");
    expect(result.allowed).toBe(true);
    expect(result.max).toBe(5);
  });
});
