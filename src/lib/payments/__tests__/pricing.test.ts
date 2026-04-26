import { describe, expect, it } from "vitest";

import {
  BOOST_CONFIG,
  LISTING_PACK_PRICES_TND,
  convertTndToForeign,
} from "@/lib/payments/pricing";

describe("payments pricing helpers", () => {
  it("exposes listing pack prices", () => {
    expect(LISTING_PACK_PRICES_TND.essential).toBeGreaterThan(0);
    expect(LISTING_PACK_PRICES_TND.premium).toBeGreaterThan(
      LISTING_PACK_PRICES_TND.essential,
    );
  });

  it("converts TND to foreign currencies", () => {
    expect(convertTndToForeign(100, "EUR")).toBeGreaterThan(0);
    expect(convertTndToForeign(100, "USD")).toBeGreaterThan(0);
  });

  it("contains boost durations", () => {
    expect(BOOST_CONFIG.top_list.durationDays).toBeGreaterThan(0);
  });
});
