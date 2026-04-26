import type { Tables } from "@/types/database";

export type ListingDetails = Tables<"listings"> & {
  listing_images: Tables<"listing_images">[];
  listing_amenities: Tables<"listing_amenities">[];
};

export type SellerProfile = Pick<
  Tables<"profiles">,
  | "id"
  | "full_name"
  | "avatar_url"
  | "is_verified"
  | "kyc_status"
  | "created_at"
>;
