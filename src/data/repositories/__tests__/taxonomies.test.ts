import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("next/cache", () => ({
  unstable_cache: <T>(fn: T) => fn,
}));

const fromMock = vi.fn();
vi.mock("@/data/supabase/server", () => ({
  createClient: () => ({ from: fromMock }),
}));

function makeBuilder<T>(rows: T[] | null) {
  const builder: Record<string, unknown> = {};
  builder.select = vi.fn().mockReturnValue(builder);
  builder.eq = vi.fn().mockReturnValue(builder);
  builder.order = vi.fn().mockReturnValue(builder);
  builder.then = (resolve: (value: { data: T[] | null }) => unknown) =>
    Promise.resolve(resolve({ data: rows }));
  return builder;
}

describe("taxonomies repository", () => {
  beforeEach(() => {
    fromMock.mockReset();
  });

  it("getTransactionTypes returns active rows ordered", async () => {
    const rows = [
      {
        code: "sale",
        label_fr: "À vendre",
        label_ar: "للبيع",
        label_en: "For sale",
        sort_order: 1,
        is_active: true,
        badge_color: "corail",
        id: "1",
        created_at: "",
        updated_at: "",
      },
      {
        code: "rent",
        label_fr: "À louer",
        label_ar: "للإيجار",
        label_en: "For rent",
        sort_order: 2,
        is_active: true,
        badge_color: "corail",
        id: "2",
        created_at: "",
        updated_at: "",
      },
    ];
    fromMock.mockReturnValue(makeBuilder(rows));
    const { getTransactionTypes } = await import("../taxonomies");
    const result = await getTransactionTypes();
    expect(result).toHaveLength(2);
    expect(result[0]?.code).toBe("sale");
  });

  it("getPropertyTypes returns rows", async () => {
    fromMock.mockReturnValue(
      makeBuilder([
        {
          code: "apartment",
          label_fr: "Appartement",
          label_ar: "شقة",
          label_en: "Apartment",
          sort_order: 1,
          is_active: true,
          category: "residential",
          icon_name: "building",
          id: "1",
          created_at: "",
          updated_at: "",
        },
      ]),
    );
    const { getPropertyTypes } = await import("../taxonomies");
    const result = await getPropertyTypes();
    expect(result[0]?.code).toBe("apartment");
  });

  it("getAmenities returns empty array on null data", async () => {
    fromMock.mockReturnValue(makeBuilder(null));
    const { getAmenities } = await import("../taxonomies");
    const result = await getAmenities();
    expect(result).toEqual([]);
  });

  it("getTaxonomyLabel returns fr by default", async () => {
    const { getTaxonomyLabel } = await import("../taxonomies");
    const item = {
      label_fr: "Appartement",
      label_ar: "شقة",
      label_en: "Apartment",
    };
    expect(getTaxonomyLabel(item, "fr")).toBe("Appartement");
    expect(getTaxonomyLabel(item, "ar")).toBe("شقة");
    expect(getTaxonomyLabel(item, "en")).toBe("Apartment");
  });

  it("getTransactionBadge resolves the localized label or falls back to code", async () => {
    fromMock.mockReturnValue(
      makeBuilder([
        {
          code: "sale",
          label_fr: "À vendre",
          label_ar: "للبيع",
          label_en: "For sale",
          sort_order: 1,
          is_active: true,
          badge_color: "corail",
          id: "1",
          created_at: "",
          updated_at: "",
        },
      ]),
    );
    const { getTransactionBadge } = await import("../taxonomies");
    expect(await getTransactionBadge("sale", "fr")).toBe("À vendre");
    expect(await getTransactionBadge("sale", "en")).toBe("For sale");
    expect(await getTransactionBadge(null)).toBeNull();
  });
});
