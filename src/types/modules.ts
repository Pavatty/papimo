// LODGE — Types par module (Immobilier vs Séjours, etc.)
// Source de vérité pour les distinctions UI/business côté TS.
// Le mapping aux colonnes DB se fait dans @/data/repositories/* via module_name.

export type ModuleId =
  | "immobilier"
  | "sejours"
  | "rentacar"
  | "experiences"
  | "services";

// ═══════════════════════════════════════════
// IMMOBILIER
// ═══════════════════════════════════════════
export type ImmobilierTransactionType = "sale" | "rent" | "colocation";

export type ImmobilierPropertyType =
  | "apartment"
  | "house"
  | "villa"
  | "studio"
  | "duplex"
  | "land"
  | "commercial"
  | "office"
  | "warehouse"
  | "garage"
  | "building"
  | "farm"
  | "other";

// ═══════════════════════════════════════════
// SÉJOURS
// ═══════════════════════════════════════════
export type SejoursPropertyType =
  | "entire_place"
  | "private_room"
  | "shared_room";

export type SejoursAccommodationType =
  | "apartment"
  | "house"
  | "villa"
  | "studio"
  | "bungalow"
  | "cottage"
  | "cabin"
  | "chalet"
  | "boat"
  | "camper"
  | "other";

// ═══════════════════════════════════════════
// RENTACAR (futur)
// ═══════════════════════════════════════════
export type RentacarVehicleType =
  | "car"
  | "suv"
  | "van"
  | "motorcycle"
  | "scooter"
  | "bike"
  | "truck"
  | "other";

// ═══════════════════════════════════════════
// EXPERIENCES (futur)
// ═══════════════════════════════════════════
export type ExperiencesCategory =
  | "cultural"
  | "adventure"
  | "food_drink"
  | "sports"
  | "wellness"
  | "workshop"
  | "tours"
  | "other";

// ═══════════════════════════════════════════
// SERVICES (futur)
// ═══════════════════════════════════════════
export type ServicesCategory =
  | "cleaning"
  | "moving"
  | "handyman"
  | "plumbing"
  | "electrical"
  | "painting"
  | "gardening"
  | "other";

// ═══════════════════════════════════════════
// LISTING shapes côté domaine
// ═══════════════════════════════════════════
export type ListingStatus =
  | "draft"
  | "pending"
  | "active"
  | "sold"
  | "rented"
  | "rejected"
  | "archived"
  | "expired";

export interface ListingBase {
  id: string;
  module_name: ModuleId;
  owner_id: string;
  title: string | null;
  description: string | null;
  photos: string[] | null;
  country_code: string;
  city: string;
  status: ListingStatus;
  created_at: string;
  updated_at: string;
}

export interface ImmobilierListing extends ListingBase {
  module_name: "immobilier";
  transaction_type: ImmobilierTransactionType;
  property_type: ImmobilierPropertyType | null;
  price: number;
  currency: string;
  surface_m2: number | null;
  rooms: number | null;
  bathrooms: number | null;
}

export interface SejoursListing extends ListingBase {
  module_name: "sejours";
  property_type: ImmobilierPropertyType | null;
  base_price_per_night: number | null;
  currency: string;
  max_guests: number | null;
  bedrooms: number | null;
  bathrooms: number | null;
  min_nights: number | null;
  max_nights: number | null;
}

export type Listing = ImmobilierListing | SejoursListing;

export const MODULE_IDS: ReadonlyArray<ModuleId> = [
  "immobilier",
  "sejours",
  "rentacar",
  "experiences",
  "services",
] as const;

export function isModuleId(value: unknown): value is ModuleId {
  return (
    typeof value === "string" &&
    (MODULE_IDS as ReadonlyArray<string>).includes(value)
  );
}
