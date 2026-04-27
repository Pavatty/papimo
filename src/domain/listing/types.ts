import type { Database } from "@/types/database";

export type ListingRow = Database["public"]["Tables"]["listings"]["Row"];
export type TransactionTypeRow =
  Database["public"]["Tables"]["transaction_types"]["Row"];
export type PropertyTypeRow =
  Database["public"]["Tables"]["property_types"]["Row"];
export type AmenityRow = Database["public"]["Tables"]["amenities"]["Row"];

export type Locale = "fr" | "ar" | "en";

export interface ListingDTO {
  id: string;
  slug: string | null;
  title: string;
  description: string | null;
  city: string | null;
  neighborhood: string | null;
  price: number | null;
  priceCurrency: string | null;
  transactionType: string | null;
  propertyType: string | null;
  surfaceArea: number | null;
  roomsTotal: number | null;
  bedrooms: number | null;
  bathrooms: number | null;
  floor: number | null;
  amenities: string[];
  photos: string[];
  mainPhoto: string | null;
  latitude: number | null;
  longitude: number | null;
  publishedAt: string | null;
  ownerId: string | null;
}

// Pure mapping Row → DTO. No I/O. Safe in client + server.
export function listingFromRow(row: ListingRow): ListingDTO {
  return {
    id: row.id,
    slug: row.slug ?? null,
    title: row.title ?? "",
    description: row.description ?? null,
    city: row.city ?? null,
    neighborhood: row.neighborhood ?? null,
    price: row.price ?? null,
    priceCurrency: row.price_currency ?? null,
    transactionType: row.transaction_type ?? null,
    propertyType: row.property_type ?? null,
    surfaceArea: row.surface_area ?? null,
    roomsTotal: row.rooms_total ?? null,
    bedrooms: row.bedrooms ?? null,
    bathrooms: row.bathrooms ?? null,
    floor: row.floor ?? null,
    amenities: row.amenities ?? [],
    photos: row.photos ?? [],
    mainPhoto: row.main_photo ?? null,
    latitude: row.latitude ?? null,
    longitude: row.longitude ?? null,
    publishedAt: row.published_at ?? null,
    ownerId: row.owner_id ?? null,
  };
}
