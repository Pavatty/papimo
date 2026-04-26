export type TransactionType = "sale" | "rent";
export type ListingCategory =
  | "apartment"
  | "villa"
  | "house"
  | "land"
  | "office"
  | "shop"
  | "parking"
  | "other";
export type ListingPack = "free" | "essential" | "comfort" | "premium";

export type PublishFormState = {
  id?: string;
  type?: TransactionType;
  category?: ListingCategory;
  title: string;
  description: string;
  price: number | null;
  currency: "TND" | "EUR" | "USD" | "MAD" | "DZD";
  surface_m2: number | null;
  rooms: number | null;
  bedrooms: number | null;
  bathrooms: number | null;
  floor: number | null;
  total_floors: number | null;
  year_built: number | null;
  latitude: number | null;
  longitude: number | null;
  address: string;
  city: string;
  neighborhood: string;
  country_code: string;
  pack: ListingPack;
  amenities: string[];
  video_url: string;
  images: Array<{
    id: string;
    url: string;
    position: number;
    is_cover: boolean;
  }>;
};
