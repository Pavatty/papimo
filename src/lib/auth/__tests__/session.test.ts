import { beforeEach, describe, expect, it, vi } from "vitest";

const hoisted = vi.hoisted(() => {
  const getUser = vi.fn();
  const upsert = vi.fn();
  const select = vi.fn();
  const eq = vi.fn();
  const single = vi.fn();
  const from = vi.fn(() => ({ upsert, select, eq, single }));
  const createClient = vi.fn(async () => ({
    auth: { getUser },
    from,
  }));
  return { getUser, upsert, select, eq, single, from, createClient };
});

vi.mock("@/lib/supabase/server", () => ({
  createClient: hoisted.createClient,
}));

describe("auth session helpers", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    hoisted.select.mockReturnValue({ eq: hoisted.eq, single: hoisted.single });
    hoisted.eq.mockReturnValue({ single: hoisted.single });
  });

  it("returns null user/profile when unauthenticated", async () => {
    hoisted.getUser.mockResolvedValue({ data: { user: null } });
    const { getCurrentUser } = await import("@/lib/auth/session");
    const result = await getCurrentUser();
    expect(result.user).toBeNull();
    expect(result.profile).toBeNull();
  });

  it("ensureProfile upserts and returns profile", async () => {
    hoisted.getUser.mockResolvedValue({
      data: {
        user: {
          id: "u1",
          email: "u1@example.com",
          user_metadata: { full_name: "User One" },
        },
      },
    });
    hoisted.single.mockResolvedValue({
      data: { id: "u1", full_name: "User One", role: "user" },
    });
    const { ensureProfile } = await import("@/lib/auth/session");
    const result = await ensureProfile();
    expect(hoisted.upsert).toHaveBeenCalled();
    expect(result.profile?.id).toBe("u1");
  });
});
