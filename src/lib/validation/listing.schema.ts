import DOMPurify from "isomorphic-dompurify";
import { z } from "zod";

const CURRENT_YEAR = new Date().getFullYear();

// Sanitisation côté serveur uniquement : ALLOWED_TAGS=[] retire tout HTML
// pour le titre, et garde un sous-ensemble safe pour la description.
export function sanitizeTitle(input: string): string {
  return DOMPurify.sanitize(input, { ALLOWED_TAGS: [], ALLOWED_ATTR: [] });
}

export function sanitizeDescription(input: string): string {
  return DOMPurify.sanitize(input, {
    ALLOWED_TAGS: ["p", "br", "strong", "em", "ul", "ol", "li"],
    ALLOWED_ATTR: [],
  });
}

const phoneRegex = /^[+\d\s()-]{7,20}$/;

export const listingSchema = z.object({
  // Step 1 — Type de transaction
  transaction_type: z.enum(["sale", "rent", "seasonal_rent", "colocation"]),
  // Step 2 — Catégorie
  property_type: z.string().min(1),
  // Step 3 — Localisation
  country_code: z.string().min(2).max(3),
  region_code: z.string().min(1).optional(),
  city: z.string().trim().min(1).max(100),
  neighborhood: z.string().trim().max(100).optional(),
  // Step 4 — Surface & pièces
  surface_m2: z.coerce.number().int().positive().max(100_000),
  rooms: z.coerce.number().int().nonnegative().max(50).optional(),
  bedrooms: z.coerce.number().int().nonnegative().max(50).optional(),
  bathrooms: z.coerce.number().int().nonnegative().max(20).optional(),
  floor: z.coerce.number().int().min(-5).max(100).optional(),
  total_floors: z.coerce.number().int().positive().max(100).optional(),
  year_built: z.coerce
    .number()
    .int()
    .min(1800)
    .max(CURRENT_YEAR + 5)
    .optional(),
  // Step 5 — Photos
  photos: z.array(z.string().url()).min(1).max(20),
  // Step 6 — Prix + description + titre
  price: z.coerce.number().positive().max(10_000_000_000),
  currency: z.enum(["TND", "EUR", "USD", "MAD", "DZD"]).default("TND"),
  title: z.string().trim().min(10).max(80),
  description: z.string().trim().min(20).max(5000),
  // Step 7 — Contact
  contact_name: z.string().trim().min(2).max(100).optional(),
  contact_email: z.string().trim().email().max(120).optional(),
  contact_phone: z.string().trim().regex(phoneRegex).optional(),
});

export type ListingInput = z.infer<typeof listingSchema>;

// Schémas par étape pour validation progressive côté client
export const stepSchemas = {
  step1: listingSchema.pick({ transaction_type: true, property_type: true }),
  step2: listingSchema.pick({
    country_code: true,
    region_code: true,
    city: true,
    neighborhood: true,
  }),
  step3: listingSchema.pick({
    surface_m2: true,
    rooms: true,
    bedrooms: true,
    bathrooms: true,
    floor: true,
    total_floors: true,
  }),
  step4: listingSchema.pick({ year_built: true }),
  step5: listingSchema.pick({ photos: true }),
  step6: listingSchema.pick({
    price: true,
    currency: true,
    title: true,
    description: true,
  }),
  step7: listingSchema.pick({
    contact_name: true,
    contact_email: true,
    contact_phone: true,
  }),
};
