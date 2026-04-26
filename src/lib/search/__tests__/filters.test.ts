import { describe, expect, it } from "vitest";

import { parseSearchFilters } from "@/lib/search/filters";

describe("parseSearchFilters", () => {
  it("parses valid filters", () => {
    const result = parseSearchFilters({
      type: "sale",
      category: "apartment",
      city: "La Marsa",
      q: "vue mer",
      minPrice: "100000",
      maxPrice: "500000",
    });
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.data.type).toBe("sale");
      expect(result.data.minPrice).toBe(100000);
    }
  });

  it("rejects invalid enum values", () => {
    const result = parseSearchFilters({
      type: "DROP TABLE listings;" as never,
    });
    expect(result.ok).toBe(false);
  });
});
