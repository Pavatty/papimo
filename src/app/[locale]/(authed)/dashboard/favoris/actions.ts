"use server";

import { revalidateTag } from "next/cache";

import { createClient } from "@/data/supabase/server";

export async function toggleFavorite(
  listingId: string,
): Promise<{ ok: boolean; favorited?: boolean; error?: string }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return {
      ok: false,
      error: "Connectez-vous pour ajouter aux favoris",
    };
  }

  const { data: existing } = await supabase
    .from("favorites")
    .select("id")
    .eq("user_id", user.id)
    .eq("listing_id", listingId)
    .maybeSingle();

  if (existing) {
    const { error } = await supabase
      .from("favorites")
      .delete()
      .eq("user_id", user.id)
      .eq("listing_id", listingId);
    if (error) return { ok: false, error: error.message };
    revalidateTag("favorites", "default");
    return { ok: true, favorited: false };
  }

  const { error } = await supabase.from("favorites").insert({
    user_id: user.id,
    listing_id: listingId,
  });
  if (error) return { ok: false, error: error.message };
  revalidateTag("favorites", "default");
  return { ok: true, favorited: true };
}
