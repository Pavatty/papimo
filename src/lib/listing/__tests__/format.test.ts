import { describe, expect, it } from "vitest";

import {
  TRANSACTION_BADGES,
  formatPrice,
  getTransactionBadge,
} from "@/lib/listing/format";

describe("formatPrice", () => {
  it("returns fallback when price is null", () => {
    expect(formatPrice(null, "TND")).toBe("Prix sur demande");
  });

  it("returns fallback when price is undefined", () => {
    expect(formatPrice(undefined, "TND")).toBe("Prix sur demande");
  });

  it("supports a custom fallback", () => {
    expect(formatPrice(null, "TND", null, { fallback: "—" })).toBe("—");
  });

  it("formats a sale price without suffix", () => {
    const result = formatPrice(450000, "TND", "sale");
    expect(result).toContain("450");
    expect(result).toContain("TND");
    expect(result).not.toContain("/ mois");
  });

  it("appends ' / mois' for rent", () => {
    const result = formatPrice(1200, "TND", "rent");
    expect(result).toContain("1");
    expect(result).toContain("200");
    expect(result).toContain("/ mois");
  });

  it("does not append rent suffix for colocation", () => {
    const result = formatPrice(500, "TND", "colocation");
    expect(result).not.toContain("/ mois");
  });

  it("falls back to TND when currency is null", () => {
    expect(formatPrice(1000, null, "sale")).toContain("TND");
  });

  it("respects a custom locale", () => {
    const result = formatPrice(1234567, "USD", "sale", { locale: "en-US" });
    expect(result).toContain("USD");
    expect(result).toMatch(/1,234,567|1.234.567/);
  });
});

describe("getTransactionBadge", () => {
  it("returns null for null", () => {
    expect(getTransactionBadge(null)).toBeNull();
  });

  it("returns null for undefined", () => {
    expect(getTransactionBadge(undefined)).toBeNull();
  });

  it("returns French label for sale", () => {
    expect(getTransactionBadge("sale")).toBe("À vendre");
  });

  it("returns French label for rent", () => {
    expect(getTransactionBadge("rent")).toBe("À louer");
  });

  it("returns label for colocation", () => {
    expect(getTransactionBadge("colocation")).toBe("Colocation");
  });

  it("returns the raw value for unknown transaction types", () => {
    expect(getTransactionBadge("auction")).toBe("auction");
  });

  it("exports TRANSACTION_BADGES as a record", () => {
    expect(TRANSACTION_BADGES.sale).toBe("À vendre");
    expect(TRANSACTION_BADGES.rent).toBe("À louer");
  });
});
