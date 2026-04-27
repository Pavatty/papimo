import { beforeEach, describe, expect, it, vi } from "vitest";

const hoisted = vi.hoisted(() => {
  const signInWithOtp = vi.fn();
  const verifyOtp = vi.fn();
  const signInWithOAuth = vi.fn();
  const signOut = vi.fn();
  const getUser = vi.fn();
  const fromSelect = vi.fn();
  const fromEq = vi.fn();
  const fromSingle = vi.fn();

  const createClient = vi.fn(async () => ({
    auth: { signInWithOtp, verifyOtp, signInWithOAuth, signOut, getUser },
    from: vi.fn(() => ({ select: fromSelect, eq: fromEq, single: fromSingle })),
  }));

  return {
    signInWithOtp,
    verifyOtp,
    signInWithOAuth,
    signOut,
    getUser,
    fromSelect,
    fromEq,
    fromSingle,
    createClient,
  };
});

vi.mock("@/lib/supabase/server", () => ({
  createClient: hoisted.createClient,
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
    vi.stubEnv("NEXT_PUBLIC_WHATSAPP_OTP_ENABLED", "true");

    hoisted.signInWithOtp.mockResolvedValue({ error: null });
    hoisted.verifyOtp.mockResolvedValue({ error: null });
  });

  it("sendMagicLink calls signInWithOtp", async () => {
    const { sendMagicLink } = await import("@/lib/auth/actions");
    const result = await sendMagicLink("user@example.com");
    expect(result.ok).toBe(true);
    expect(hoisted.signInWithOtp).toHaveBeenCalled();
  }, 15000);

  it("sendWhatsAppCode sends a WhatsApp OTP", async () => {
    const { sendWhatsAppCode } = await import("@/lib/auth/actions");
    const result = await sendWhatsAppCode("+21622162261");
    expect(result.ok).toBe(true);
    expect(hoisted.signInWithOtp).toHaveBeenCalledWith(
      expect.objectContaining({
        options: expect.objectContaining({ channel: "whatsapp" }),
      }),
    );
  });

  it("verifyWhatsAppCode succeeds on valid code", async () => {
    const { verifyWhatsAppCode } = await import("@/lib/auth/actions");
    const result = await verifyWhatsAppCode("+21622162261", "123456");
    expect(result.ok).toBe(true);
    expect(hoisted.verifyOtp).toHaveBeenCalled();
  });

  it("verifyWhatsAppCode fails on provider error", async () => {
    hoisted.verifyOtp.mockResolvedValueOnce({
      error: { message: "invalid otp" },
    });
    const { verifyWhatsAppCode } = await import("@/lib/auth/actions");
    const result = await verifyWhatsAppCode("+21622162261", "123456");
    expect(result.ok).toBe(false);
  });

  it("verifyWhatsAppCode fails when otp format is invalid", async () => {
    const { verifyWhatsAppCode } = await import("@/lib/auth/actions");
    const result = await verifyWhatsAppCode("+21622162261", "abc123");
    expect(result.ok).toBe(false);
  });
});
