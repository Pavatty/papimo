import { beforeEach, describe, expect, it, vi } from "vitest";

const hoisted = vi.hoisted(() => {
  const signInWithOtp = vi.fn();
  const signInWithOAuth = vi.fn();
  const signOut = vi.fn();
  const getUser = vi.fn();
  const fromSelect = vi.fn();
  const fromEq = vi.fn();
  const fromSingle = vi.fn();

  const createClient = vi.fn(async () => ({
    auth: { signInWithOtp, signInWithOAuth, signOut, getUser },
    from: vi.fn(() => ({ select: fromSelect, eq: fromEq, single: fromSingle })),
  }));

  const adminInsert = vi.fn();
  const adminSelect = vi.fn();
  const adminEq = vi.fn();
  const adminOrder = vi.fn();
  const adminLimit = vi.fn();
  const adminUpdate = vi.fn();
  const adminCreateUser = vi.fn();

  const adminFrom = vi.fn(() => ({
    insert: adminInsert,
    select: adminSelect,
    eq: adminEq,
    order: adminOrder,
    limit: adminLimit,
    update: adminUpdate,
  }));

  const createAdminClient = vi.fn(() => ({
    from: adminFrom,
    auth: { admin: { createUser: adminCreateUser } },
  }));

  return {
    signInWithOtp,
    signInWithOAuth,
    signOut,
    getUser,
    fromSelect,
    fromEq,
    fromSingle,
    createClient,
    adminInsert,
    adminSelect,
    adminEq,
    adminOrder,
    adminLimit,
    adminUpdate,
    adminCreateUser,
    adminFrom,
    createAdminClient,
  };
});

vi.mock("@/lib/supabase/server", () => ({
  createClient: hoisted.createClient,
}));

vi.mock("@supabase/supabase-js", () => ({
  createClient: hoisted.createAdminClient,
}));

vi.mock("next/headers", () => ({
  headers: async () =>
    new Headers({
      "x-forwarded-for": "10.0.0.1",
      "user-agent": "vitest",
    }),
}));

describe("auth actions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubEnv("NEXT_PUBLIC_APP_URL", "http://localhost:3000");
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "https://example.supabase.co");
    vi.stubEnv("SUPABASE_SERVICE_ROLE_KEY", "service-role-key");

    hoisted.signInWithOtp.mockResolvedValue({ error: null });
    hoisted.adminInsert.mockResolvedValue({ error: null });
    hoisted.adminLimit.mockResolvedValue({
      data: [
        {
          id: "otp-id",
          code: "123456",
          attempts: 0,
          used: false,
          expires_at: "2999-01-01T00:00:00.000Z",
        },
      ],
      error: null,
    });
    hoisted.adminUpdate.mockReturnValue({
      eq: vi.fn().mockResolvedValue({ error: null }),
    });
    hoisted.adminCreateUser.mockResolvedValue({ error: null });
    hoisted.adminEq.mockReturnThis();
    hoisted.adminOrder.mockReturnThis();
    hoisted.adminSelect.mockReturnThis();
  });

  it("sendMagicLink calls signInWithOtp", async () => {
    const { sendMagicLink } = await import("@/lib/auth/actions");
    const result = await sendMagicLink("user@example.com");
    expect(result.ok).toBe(true);
    expect(hoisted.signInWithOtp).toHaveBeenCalled();
  });

  it("sendWhatsAppCode returns code and link", async () => {
    const { sendWhatsAppCode } = await import("@/lib/auth/actions");
    const result = await sendWhatsAppCode("+21622162261");
    expect(result.ok).toBe(true);
    expect(result).toHaveProperty("code");
    expect(result).toHaveProperty("whatsappLink");
  });

  it("verifyWhatsAppCode succeeds on valid code", async () => {
    const { verifyWhatsAppCode } = await import("@/lib/auth/actions");
    const result = await verifyWhatsAppCode("+21622162261", "123456");
    expect(result.ok).toBe(true);
    expect(hoisted.adminCreateUser).toHaveBeenCalled();
  });

  it("verifyWhatsAppCode fails when code expired", async () => {
    hoisted.adminLimit.mockResolvedValueOnce({
      data: [
        {
          id: "otp-id",
          code: "123456",
          attempts: 0,
          used: false,
          expires_at: "2000-01-01T00:00:00.000Z",
        },
      ],
      error: null,
    });
    const { verifyWhatsAppCode } = await import("@/lib/auth/actions");
    const result = await verifyWhatsAppCode("+21622162261", "123456");
    expect(result.ok).toBe(false);
  });

  it("verifyWhatsAppCode fails when code already used or missing", async () => {
    hoisted.adminLimit.mockResolvedValueOnce({ data: [], error: null });
    const { verifyWhatsAppCode } = await import("@/lib/auth/actions");
    const result = await verifyWhatsAppCode("+21622162261", "123456");
    expect(result.ok).toBe(false);
  });
});
