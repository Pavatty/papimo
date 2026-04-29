"use server";

import { revalidateTag } from "next/cache";
import { z } from "zod";

import { createClient } from "@/data/supabase/server";
import { getCurrentUser } from "@/data/supabase/session";

const setAvailabilitySchema = z.object({
  listingId: z.string().uuid(),
  dates: z
    .array(z.string().regex(/^\d{4}-\d{2}-\d{2}$/))
    .min(1)
    .max(366),
  available: z.boolean(),
});

export async function setAvailability(
  input: z.infer<typeof setAvailabilitySchema>,
) {
  const parsed = setAvailabilitySchema.safeParse(input);
  if (!parsed.success) {
    return {
      ok: false as const,
      error: parsed.error.issues[0]?.message ?? "Invalid input",
    };
  }
  const user = await getCurrentUser();
  if (!user) return { ok: false as const, error: "Non connecté" };

  const supabase = await createClient();
  const { data: listing } = await supabase
    .from("listings")
    .select("owner_id")
    .eq("id", parsed.data.listingId)
    .maybeSingle();
  if (!listing || listing.owner_id !== user.id) {
    return { ok: false as const, error: "Non autorisé" };
  }

  const { error } = await supabase.from("availability_calendars").upsert(
    parsed.data.dates.map((date) => ({
      listing_id: parsed.data.listingId,
      date,
      available: parsed.data.available,
    })),
    { onConflict: "listing_id,date" },
  );
  if (error) return { ok: false as const, error: error.message };

  revalidateTag(`availability:${parsed.data.listingId}`, "default");
  return { ok: true as const };
}
