import { describe, expect, it, vi } from "vitest";

import { logModeration } from "@/lib/moderation/log";

const insertSpy = vi.fn(async () => ({ error: null }));

vi.mock("@/data/supabase/server", () => ({
  createClient: vi.fn(async () => ({
    from: () => ({ insert: insertSpy }),
  })),
}));

describe("logModeration", () => {
  it("inserts a moderation log entry", async () => {
    await logModeration({
      listingId: "11111111-1111-1111-1111-111111111111",
      userId: "22222222-2222-2222-2222-222222222222",
      decision: "approved",
      source: "rules",
      reasons: ["ok"],
    });
    expect(insertSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        listing_id: "11111111-1111-1111-1111-111111111111",
        decision: "approved",
        source: "rules",
        reasons: ["ok"],
      }),
    );
  });

  it("propagates ai_score and ai_raw_response", async () => {
    await logModeration({
      listingId: "11111111-1111-1111-1111-111111111111",
      userId: "22222222-2222-2222-2222-222222222222",
      decision: "rejected",
      source: "ai_claude",
      reasons: ["scam"],
      aiScore: 0.95,
      aiRaw: "{...}",
    });
    expect(insertSpy).toHaveBeenLastCalledWith(
      expect.objectContaining({
        ai_score: 0.95,
        ai_raw_response: "{...}",
      }),
    );
  });
});
