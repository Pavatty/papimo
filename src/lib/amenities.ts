export const AMENITY_KEYS = [
  "parking",
  "elevator",
  "balcony",
  "terrace",
  "garden",
  "pool",
  "ac",
  "heating",
  "furnished",
  "new",
  "sea_view",
  "mountain_view",
  "fiber",
  "security",
  "caretaker",
] as const;

export type AmenityKey = (typeof AMENITY_KEYS)[number];

export function isKnownAmenityKey(key: string): key is AmenityKey {
  return (AMENITY_KEYS as readonly string[]).includes(key);
}

/** Maps legacy DB keys to current canonical keys. */
export function normalizeAmenityKey(key: string): string {
  return key;
}
