import { unstable_cache } from "next/cache";

import { createAnonClient, createClient } from "@/data/supabase/server";
import { listingFromRow, type ListingDTO } from "@/domain/listing/types";
import type { ListingDetails } from "@/components/features/listing/types";

export async function getActiveListingBySlug(
  slug: string,
): Promise<ListingDTO | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("listings")
    .select("*")
    .eq("slug", slug)
    .eq("status", "active")
    .maybeSingle();
  return data ? listingFromRow(data) : null;
}

// Pour la page détail riche : Row + listing_images + listing_amenities joints.
export async function getListingDetailsBySlug(
  slug: string,
): Promise<ListingDetails | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("listings")
    .select("*, listing_images(*), listing_amenities(*)")
    .eq("slug", slug)
    .eq("status", "active")
    .limit(1)
    .maybeSingle();
  return (data as ListingDetails | null) ?? null;
}

export async function getActiveListingById(
  id: string,
): Promise<ListingDTO | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("listings")
    .select("*")
    .eq("id", id)
    .eq("status", "active")
    .maybeSingle();
  return data ? listingFromRow(data) : null;
}

export const getLatestActiveListings = unstable_cache(
  async (limit = 4): Promise<ListingDTO[]> => {
    const supabase = createAnonClient();
    const { data } = await supabase
      .from("listings")
      .select("*")
      .eq("status", "active")
      .order("published_at", { ascending: false, nullsFirst: false })
      .limit(limit);
    return (data ?? []).map(listingFromRow);
  },
  ["latest-active-listings"],
  { revalidate: 60, tags: ["listings"] },
);

export async function getSimilarActiveListings(params: {
  transactionType: string | null;
  city: string | null;
  excludeId: string;
  limit?: number;
}): Promise<ListingDTO[]> {
  const { transactionType, city, excludeId, limit = 4 } = params;
  const supabase = await createClient();
  let query = supabase
    .from("listings")
    .select("*")
    .eq("status", "active")
    .neq("id", excludeId);
  if (transactionType) query = query.eq("transaction_type", transactionType);
  if (city) query = query.eq("city", city);
  const { data } = await query
    .order("published_at", { ascending: false, nullsFirst: false })
    .limit(limit);
  return (data ?? []).map(listingFromRow);
}
