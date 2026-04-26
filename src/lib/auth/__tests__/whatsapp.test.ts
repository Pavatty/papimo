import { describe, expect, it } from "vitest";

import {
  buildWhatsAppLink,
  formatPhoneE164,
  generateOtpCode,
} from "@/lib/auth/whatsapp";

describe("whatsapp helpers", () => {
  it("generateOtpCode returns 6 digits", () => {
    const code = generateOtpCode();
    expect(code).toMatch(/^\d{6}$/);
    expect(Number(code)).toBeGreaterThanOrEqual(100000);
    expect(Number(code)).toBeLessThanOrEqual(999999);
  });

  it("generateOtpCode has approximate uniqueness", () => {
    const codes = new Set(Array.from({ length: 50 }, () => generateOtpCode()));
    expect(codes.size).toBeGreaterThan(45);
  });

  it("formatPhoneE164 normalizes Tunisian phone", () => {
    expect(formatPhoneE164("22 162 261", "TN")).toBe("+21622162261");
    expect(formatPhoneE164("+21622162261", "TN")).toBe("+21622162261");
  });

  it("buildWhatsAppLink encodes expected message", () => {
    const link = buildWhatsAppLink("+21622162261", "123456", "fr");
    expect(link).toContain("https://wa.me/21622162261");
    expect(link).toContain(
      encodeURIComponent("Bonjour papimo, mon code est 123456"),
    );
  });
});
