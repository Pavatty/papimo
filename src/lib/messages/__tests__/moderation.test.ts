import { describe, expect, it } from "vitest";

import { isMessageSuspicious } from "@/lib/messages/moderation";

describe("isMessageSuspicious", () => {
  it("flags phone numbers", () => {
    const result = isMessageSuspicious("Contacte moi au +216 22 123 456");
    expect(result.flagged).toBe(true);
    expect(result.hasPhone).toBe(true);
  });

  it("flags email addresses", () => {
    const result = isMessageSuspicious("Mon email: test@example.com");
    expect(result.flagged).toBe(true);
    expect(result.hasEmail).toBe(true);
  });

  it("flags banking keywords", () => {
    const result = isMessageSuspicious("Paiement par western union");
    expect(result.flagged).toBe(true);
    expect(result.hasBankKeyword).toBe(true);
  });

  it("keeps normal message clean", () => {
    const result = isMessageSuspicious(
      "Bonjour, le bien est-il toujours disponible ?",
    );
    expect(result.flagged).toBe(false);
  });
});
