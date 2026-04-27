import { beforeEach, describe, expect, it, vi } from "vitest";

const hoisted = vi.hoisted(() => {
  const getUser = vi.fn();
  const select = vi.fn();
  const eq = vi.fn();
  const single = vi.fn();
  const from = vi.fn(() => ({ select, eq, single }));
  const createClient = vi.fn(async () => ({ auth: { getUser }, from }));
  const redirect = vi.fn();
  const forbidden = vi.fn();
  return {
    getUser,
    select,
    eq,
    single,
    from,
    createClient,
    redirect,
    forbidden,
  };
});

vi.mock("@/data/supabase/server", () => ({
  createClient: hoisted.createClient,
}));
vi.mock("next/navigation", () => ({
  redirect: hoisted.redirect,
  forbidden: hoisted.forbidden,
}));

describe("requireAdmin", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    hoisted.eq.mockReturnValue({ single: hoisted.single });
    hoisted.select.mockReturnValue({ eq: hoisted.eq, single: hoisted.single });
  });

  it("redirects to login when unauthenticated", async () => {
    hoisted.getUser.mockResolvedValue({ data: { user: null } });
    const { requireAdmin } = await import("@/lib/admin/guards");
    await expect(requireAdmin("fr")).rejects.toThrow();
    expect(hoisted.redirect).toHaveBeenCalledWith(
      "/fr/login?reason=unauthorized",
    );
  });

  it("calls forbidden when user is not admin", async () => {
    hoisted.getUser.mockResolvedValue({ data: { user: { id: "u1" } } });
    hoisted.single.mockResolvedValue({ data: { id: "u1", role: "user" } });
    const { requireAdmin } = await import("@/lib/admin/guards");
    await requireAdmin("fr");
    expect(hoisted.forbidden).toHaveBeenCalled();
  });

  it("returns admin context when role is admin", async () => {
    hoisted.getUser.mockResolvedValue({ data: { user: { id: "u1" } } });
    hoisted.single.mockResolvedValue({ data: { id: "u1", role: "admin" } });
    const { requireAdmin } = await import("@/lib/admin/guards");
    const result = await requireAdmin("fr");
    expect(result.profile.role).toBe("admin");
  });
});
