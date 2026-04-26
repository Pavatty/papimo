import { describe, expect, it, vi } from "vitest";

import type { Database } from "@/types/database";
import { moderateListing } from "@/lib/moderation/listing";

vi.mock("@/lib/supabase/server", () => ({
  createClient: vi.fn(async () => ({
    from: (table: string) => {
      if (table === "settings") {
        return {
          select: () => ({
            eq: () => ({ maybeSingle: async () => ({ data: null }) }),
          }),
        };
      }
      if (table === "listing_images") {
        return {
          select: () => ({
            eq: () => ({
              limit: async () => ({ data: [{ id: "img-1" }] }),
            }),
          }),
        };
      }
      if (table === "price_index") {
        return {
          select: () => ({
            eq: () => ({
              eq: () => ({
                eq: () => ({
                  order: () => ({
                    limit: () => ({
                      maybeSingle: async () => ({
                        data: {
                          avg_price_m2_sale: 3000,
                          avg_price_m2_rent: 20,
                        },
                      }),
                    }),
                  }),
                }),
              }),
            }),
          }),
        };
      }
      if (table === "listings") {
        return {
          select: () => ({
            eq: () => ({
              in: async () => ({ count: 0 }),
            }),
          }),
        };
      }
      return { select: () => ({}) };
    },
  })),
}));

const baseListing: Database["public"]["Tables"]["listings"]["Row"] = {
  id: "11111111-1111-1111-1111-111111111111",
  owner_id: "22222222-2222-2222-2222-222222222222",
  title: "Appartement S+2",
  description:
    "Très bel appartement lumineux avec grand salon et cuisine équipée au coeur de La Marsa.",
  country_code: "TN",
  city: "La Marsa",
  neighborhood: "Sidi Daoud",
  governorate: null,
  address: null,
  floor: null,
  total_floors: null,
  rooms: null,
  bedrooms: null,
  bathrooms: null,
  year_built: null,
  latitude: null,
  longitude: null,
  currency: "TND",
  contacts_count: 0,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  expires_at: null,
  favorites_count: 0,
  views_count: 0,
  pack: "free",
  search_vector: null as unknown,
  slug: "appartement-s2",
  status: "draft",
  type: "sale",
  price: 300000,
  surface_m2: 100,
  category: "apartment",
};

describe("moderateListing", () => {
  it("returns pending when listing is valid", async () => {
    const result = await moderateListing(baseListing);
    expect(result.result).toBe("pending");
  });

  it("flags manual_review when price is out of range", async () => {
    const result = await moderateListing({ ...baseListing, price: 2000000 });
    expect(result.result).toBe("manual_review");
    expect(result.reasons).toContain("price_out_of_range");
  });

  it("flags manual_review when blacklist keyword is present", async () => {
    const result = await moderateListing({
      ...baseListing,
      description:
        "Paiement Western Union uniquement, contactez moi avant visite pour finaliser.",
    });
    expect(result.result).toBe("manual_review");
    expect(result.reasons).toContain("blacklist_keyword_detected");
  });
});
