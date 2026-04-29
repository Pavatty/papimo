// LODGE Immobilier : 3 types uniquement. Les locations courte durée
// passent par le module Séjours (rental_type='short_term').
export const LISTING_TRANSACTION_TYPES = [
  "sale",
  "rent",
  "colocation",
] as const;
export type ListingTransactionType = (typeof LISTING_TRANSACTION_TYPES)[number];

export const LISTING_PROPERTY_TYPES = [
  "apartment",
  "house",
  "villa",
  "studio",
  "duplex",
  "land",
  "commercial_space",
  "shop",
  "office",
  "warehouse",
  "garage_parking",
  "building",
  "farm",
  "other",
] as const;
export type ListingPropertyType = (typeof LISTING_PROPERTY_TYPES)[number];

export const LISTING_AMENITIES = [
  "parking",
  "elevator",
  "balcony",
  "terrace",
  "garden",
  "pool",
  "ac",
  "heating",
  "furnished",
  "new_construction",
  "sea_view",
  "mountain_view",
  "city_view",
  "fiber",
  "security",
  "caretaker",
  "alarm",
  "intercom",
  "double_glazing",
  "fireplace",
  "cellar",
  "dishwasher",
  "washing_machine",
] as const;
export type ListingAmenity = (typeof LISTING_AMENITIES)[number];

export const LISTING_HEATING_TYPES = [
  "central",
  "individual_gas",
  "individual_electric",
  "fuel",
  "solar",
  "none",
] as const;
export type ListingHeatingType = (typeof LISTING_HEATING_TYPES)[number];

export const LISTING_DPE_RATINGS = [
  "A",
  "B",
  "C",
  "D",
  "E",
  "F",
  "G",
  "not_specified",
] as const;
export type ListingDPERating = (typeof LISTING_DPE_RATINGS)[number];

export const LISTING_ORIENTATIONS = [
  "north",
  "south",
  "east",
  "west",
  "north_east",
  "north_west",
  "south_east",
  "south_west",
] as const;
export type ListingOrientation = (typeof LISTING_ORIENTATIONS)[number];

export const LISTING_FURNISHED_LEVELS = [
  "unfurnished",
  "semi_furnished",
  "fully_furnished",
] as const;
export type ListingFurnishedLevel = (typeof LISTING_FURNISHED_LEVELS)[number];

export const LISTING_CONDITIONS = [
  "new",
  "excellent",
  "good",
  "needs_refresh",
  "needs_renovation",
] as const;
export type ListingCondition = (typeof LISTING_CONDITIONS)[number];

export const LISTING_STATUSES = [
  "draft",
  "pending",
  "active",
  "sold",
  "rented",
  "archived",
] as const;
export type ListingStatus = (typeof LISTING_STATUSES)[number];

// Catégories d'amenities pour grouper visuellement dans les forms
export const AMENITY_CATEGORIES = {
  comfort: [
    "furnished",
    "ac",
    "heating",
    "fiber",
    "dishwasher",
    "washing_machine",
    "fireplace",
  ],
  exterior: ["parking", "garden", "balcony", "terrace", "pool"],
  building: [
    "elevator",
    "intercom",
    "double_glazing",
    "cellar",
    "new_construction",
  ],
  views: ["sea_view", "mountain_view", "city_view"],
  security: ["security", "alarm", "caretaker"],
} as const;
