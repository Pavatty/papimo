"use server";

import { createClient } from "@/data/supabase/server";

export async function submitListingReport(
  listingId: string,
  reason: string,
  details: string,
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { ok: false, error: "Unauthorized" };
  }

  const { error } = await supabase.from("reports").insert({
    listing_id: listingId,
    reporter_id: user.id,
    reason,
    details: details.trim() || null,
  });

  if (error) return { ok: false, error: error.message };
  return { ok: true };
}

export async function incrementContactCount(listingId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { ok: false, error: "Unauthorized" };
  }

  const { data: listing } = await supabase
    .from("listings")
    .select("contacts_count")
    .eq("id", listingId)
    .single();

  const nextCount = (listing?.contacts_count ?? 0) + 1;
  const { error } = await supabase
    .from("listings")
    .update({ contacts_count: nextCount })
    .eq("id", listingId);

  if (error) return { ok: false, error: error.message };
  return { ok: true };
}
