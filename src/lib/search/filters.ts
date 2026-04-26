import { z } from "zod";

export const searchFilterSchema = z.object({
  type: z.enum(["sale", "rent"]).optional(),
  category: z
    .enum([
      "apartment",
      "villa",
      "house",
      "land",
      "office",
      "shop",
      "parking",
      "other",
    ])
    .optional(),
  city: z.string().trim().min(1).max(120).optional(),
  q: z.string().trim().max(120).optional(),
  minPrice: z.coerce.number().positive().optional(),
  maxPrice: z.coerce.number().positive().optional(),
});

export type ParsedSearchFilters = z.infer<typeof searchFilterSchema>;

export function parseSearchFilters(input: Record<string, string | undefined>) {
  const result = searchFilterSchema.safeParse({
    type: input.type,
    category: input.category,
    city: input.city,
    q: input.q,
    minPrice: input.minPrice,
    maxPrice: input.maxPrice,
  });
  if (!result.success) return { ok: false as const, error: result.error };
  return { ok: true as const, data: result.data };
}
