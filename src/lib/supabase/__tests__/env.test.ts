import { describe, expect, it, vi } from "vitest";

import { getSupabaseEnv } from "@/lib/supabase/env";

describe("getSupabaseEnv", () => {
  it("returns url and publishable key when present", () => {
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "https://example.supabase.co");
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY", "sb_publishable_test");

    expect(getSupabaseEnv()).toEqual({
      url: "https://example.supabase.co",
      publishableKey: "sb_publishable_test",
    });

    vi.unstubAllEnvs();
  });

  it("throws when url is missing", () => {
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "");
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY", "sb_publishable_test");

    expect(() => getSupabaseEnv()).toThrow("Missing NEXT_PUBLIC_SUPABASE_URL");

    vi.unstubAllEnvs();
  });
});
