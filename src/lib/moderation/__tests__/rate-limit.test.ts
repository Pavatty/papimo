import { afterEach, describe, expect, it, vi } from "vitest";

import {
  checkPublishRateLimit,
  incrementPublishCount,
} from "@/lib/moderation/rate-limit";

type FromMock = ReturnType<typeof vi.fn>;

let mockFrom: FromMock;

vi.mock("@/data/supabase/server", () => ({
  createClient: vi.fn(async () => ({
    from: (table: string) => mockFrom(table),
  })),
}));

afterEach(() => {
  vi.clearAllMocks();
});

describe("checkPublishRateLimit", () => {
  it("allows when under quota", async () => {
    mockFrom = vi.fn((table: string) => {
      if (table === "app_settings") {
        return {
          select: () => ({
            eq: () => ({ maybeSingle: async () => ({ data: { value: 3 } }) }),
          }),
        };
      }
      return {
        select: () => ({
          eq: () => ({
            eq: () => ({
              maybeSingle: async () => ({ data: { publish_count: 1 } }),
            }),
          }),
        }),
      };
    });

    const result = await checkPublishRateLimit("user-1");
    expect(result.allowed).toBe(true);
    expect(result.remaining).toBe(2);
    expect(result.limit).toBe(3);
  });

  it("blocks when quota reached", async () => {
    mockFrom = vi.fn((table: string) => {
      if (table === "app_settings") {
        return {
          select: () => ({
            eq: () => ({ maybeSingle: async () => ({ data: null }) }),
          }),
        };
      }
      return {
        select: () => ({
          eq: () => ({
            eq: () => ({
              maybeSingle: async () => ({ data: { publish_count: 3 } }),
            }),
          }),
        }),
      };
    });

    const result = await checkPublishRateLimit("user-1");
    expect(result.allowed).toBe(false);
    expect(result.remaining).toBe(0);
    expect(result.limit).toBe(3);
  });
});

describe("incrementPublishCount", () => {
  it("inserts when no row exists", async () => {
    const insertSpy = vi.fn(async () => ({ error: null }));
    const updateSpy = vi.fn();
    mockFrom = vi.fn((table: string) => {
      if (table === "user_rate_limits") {
        return {
          select: () => ({
            eq: () => ({
              eq: () => ({ maybeSingle: async () => ({ data: null }) }),
            }),
          }),
          insert: insertSpy,
          update: updateSpy,
        };
      }
      return { select: () => ({}) };
    });

    await incrementPublishCount("user-1");
    expect(insertSpy).toHaveBeenCalledTimes(1);
    expect(updateSpy).not.toHaveBeenCalled();
  });

  it("updates when a row already exists", async () => {
    const updateChain = {
      eq: vi.fn().mockReturnThis(),
    };
    const updateSpy = vi.fn(() => updateChain);
    mockFrom = vi.fn(() => ({
      select: () => ({
        eq: () => ({
          eq: () => ({
            maybeSingle: async () => ({ data: { publish_count: 1 } }),
          }),
        }),
      }),
      update: updateSpy,
      insert: vi.fn(),
    }));

    await incrementPublishCount("user-1");
    expect(updateSpy).toHaveBeenCalledTimes(1);
  });
});
