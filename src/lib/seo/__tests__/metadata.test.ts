import { describe, expect, it } from "vitest";

import {
  absoluteUrl,
  buildRealEstateJsonLd,
  localeAlternates,
} from "@/lib/seo/metadata";

describe("seo metadata helpers", () => {
  it("builds canonical and hreflang alternates", () => {
    const alt = localeAlternates("/search");
    expect(alt.canonical).toMatch(/\/fr\/search$/);
    expect(alt.languages.fr).toMatch(/\/fr\/search$/);
    expect(alt.languages.en).toMatch(/\/en\/search$/);
    expect(alt.languages.ar).toMatch(/\/ar\/search$/);
  });

  it("builds absolute URLs", () => {
    expect(absoluteUrl("/fr")).toMatch(/\/fr$/);
  });

  it("builds RealEstateListing json-ld payload", () => {
    const payload = buildRealEstateJsonLd({
      title: "Appartement test",
      description: "Belle vue",
      images: ["https://example.com/image.jpg"],
      datePosted: "2026-01-01T00:00:00.000Z",
      price: 100000,
      currency: "TND",
      countryCode: "TN",
      city: "Tunis",
      url: "https://lodge.tn/fr/listings/test",
    });
    expect(payload["@type"]).toBe("RealEstateListing");
    expect(payload.offers.price).toBe(100000);
    expect(payload.address.addressLocality).toBe("Tunis");
  });
});
