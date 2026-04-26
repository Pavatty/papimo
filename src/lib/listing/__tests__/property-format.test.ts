import { describe, expect, it } from "vitest";

import {
  formatListingDate,
  formatSurface,
} from "@/lib/listing/property-format";

describe("property format helpers", () => {
  it("formats surface correctly", () => {
    expect(formatSurface(120)).toContain("120");
    expect(formatSurface(null)).toBe("-");
  });

  it("formats listing date safely", () => {
    expect(formatListingDate("2026-01-10T00:00:00.000Z")).toMatch(/2026/);
    expect(formatListingDate("bad-date")).toBe("-");
  });
});
