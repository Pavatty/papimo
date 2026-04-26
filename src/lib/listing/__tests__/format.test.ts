import { describe, expect, it } from "vitest";

import { formatPrice } from "@/lib/listing/format";

describe("formatPrice", () => {
  it("formats TND in fr locale", () => {
    const result = formatPrice(350000, "TND", "fr-TN");
    expect(result).toContain("350");
    expect(result).toMatch(/DT|TND/);
  });

  it("formats EUR in french locale", () => {
    const result = formatPrice(120000, "EUR", "fr-FR");
    expect(result).toContain("€");
  });

  it("formats USD in english locale", () => {
    const result = formatPrice(900, "USD", "en-US");
    expect(result).toContain("$");
  });
});
