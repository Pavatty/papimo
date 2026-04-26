"use server";

import { randomUUID } from "node:crypto";

import { revalidateTag } from "next/cache";
import { z } from "zod";

import { captureServerEvent } from "@/lib/analytics/events";
import { moderateListing } from "@/lib/moderation/listing";
import { createClient } from "@/lib/supabase/server";

const publishDraftSchema = z.object({
  id: z.string().uuid().optional(),
  owner_id: z.string().uuid().optional(),
  type: z.enum(["sale", "rent"]).optional(),
  category: z
    .enum([
      "apartment",
      "villa",
      "house",
      "land",
      "office",
      "shop",
      "parking",
      "other",
    ])
    .optional(),
  title: z.string().max(80).optional(),
  description: z.string().max(2000).optional(),
  price: z.number().positive().optional().nullable(),
  currency: z.enum(["TND", "EUR", "USD", "MAD", "DZD"]).optional(),
  surface_m2: z.number().int().positive().optional().nullable(),
  rooms: z.number().int().optional().nullable(),
  bedrooms: z.number().int().optional().nullable(),
  bathrooms: z.number().int().optional().nullable(),
  floor: z.number().int().optional().nullable(),
  total_floors: z.number().int().optional().nullable(),
  year_built: z.number().int().min(1900).max(2026).optional().nullable(),
  latitude: z.number().optional().nullable(),
  longitude: z.number().optional().nullable(),
  address: z.string().optional().nullable(),
  city: z.string().optional().nullable(),
  neighborhood: z.string().optional().nullable(),
  governorate: z.string().optional().nullable(),
  country_code: z.string().default("TN"),
  pack: z.enum(["free", "essential", "comfort", "premium"]).default("free"),
  video_url: z.string().url().optional().nullable(),
  amenities: z.array(z.string()).default([]),
});

export type SaveDraftInput = z.infer<typeof publishDraftSchema>;

export async function saveDraft(input: SaveDraftInput) {
  const parsed = publishDraftSchema.safeParse(input);
  if (!parsed.success) {
    return {
      ok: false,
      error: parsed.error.issues[0]?.message ?? "Invalid draft",
    };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { ok: false, error: "Unauthorized" };

  const draftId = parsed.data.id ?? randomUUID();
  const payload = {
    ...parsed.data,
    id: draftId,
    owner_id: user.id,
    type: parsed.data.type ?? "sale",
    category: parsed.data.category ?? "apartment",
    title: parsed.data.title?.trim() ? parsed.data.title : "Brouillon",
    price: parsed.data.price && parsed.data.price > 0 ? parsed.data.price : 1,
    city: parsed.data.city?.trim() ? parsed.data.city : "À préciser",
    status: "draft" as const,
    country_code: parsed.data.country_code ?? "TN",
    currency: parsed.data.currency ?? "TND",
  };

  const { data: listing, error } = await supabase
    .from("listings")
    .upsert(payload)
    .select("id, updated_at")
    .single();

  if (error) return { ok: false, error: error.message };

  if (parsed.data.amenities) {
    await supabase.from("listing_amenities").delete().eq("listing_id", draftId);
    if (parsed.data.amenities.length > 0) {
      await supabase.from("listing_amenities").insert(
        parsed.data.amenities.map((key) => ({
          listing_id: draftId,
          amenity_key: key,
          value: "true",
        })),
      );
    }
  }

  await captureServerEvent("publish_started", user.id, {
    listingId: listing.id,
  });
  revalidateTag("listings");
  revalidateTag(`listing:${listing.id}`);

  return { ok: true, id: listing.id, updatedAt: listing.updated_at };
}

export async function uploadListingImage(formData: FormData) {
  const listingId = String(formData.get("listingId") ?? "");
  const file = formData.get("file");
  if (!(file instanceof File) || !listingId) {
    return { ok: false, error: "Missing file or listingId" };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Unauthorized" };

  const { data: listing } = await supabase
    .from("listings")
    .select("id, owner_id")
    .eq("id", listingId)
    .single();
  if (!listing || listing.owner_id !== user.id) {
    return { ok: false, error: "Forbidden" };
  }

  const ext = file.name.split(".").pop() ?? "jpg";
  const objectPath = `${user.id}/${listingId}/${Date.now()}-${randomUUID()}.${ext}`;
  const { error: uploadError } = await supabase.storage
    .from("listings")
    .upload(objectPath, file, { contentType: file.type, upsert: false });

  if (uploadError) return { ok: false, error: uploadError.message };

  const { data: publicData } = supabase.storage
    .from("listings")
    .getPublicUrl(objectPath);

  const { data: currentImages } = await supabase
    .from("listing_images")
    .select("position")
    .eq("listing_id", listingId)
    .order("position", { ascending: false })
    .limit(1);
  const nextPosition = (currentImages?.[0]?.position ?? -1) + 1;

  const { data: imageRow, error: imageError } = await supabase
    .from("listing_images")
    .insert({
      listing_id: listingId,
      url: publicData.publicUrl,
      position: nextPosition,
      alt_text: `Photo annonce ${listingId}`,
    })
    .select("*")
    .single();

  if (imageError) return { ok: false, error: imageError.message };
  return { ok: true, image: imageRow };
}

export async function reorderImages(listingId: string, orderedIds: string[]) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Unauthorized" };

  const { data: listing } = await supabase
    .from("listings")
    .select("owner_id")
    .eq("id", listingId)
    .single();
  if (!listing || listing.owner_id !== user.id) {
    return { ok: false, error: "Forbidden" };
  }

  for (let idx = 0; idx < orderedIds.length; idx += 1) {
    const id = orderedIds[idx];
    await supabase
      .from("listing_images")
      .update({ position: idx, is_cover: idx === 0 })
      .eq("id", id)
      .eq("listing_id", listingId);
  }
  return { ok: true };
}

export async function deleteImage(imageId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Unauthorized" };

  const { data: image } = await supabase
    .from("listing_images")
    .select("id, listing_id, url")
    .eq("id", imageId)
    .single();

  if (!image) return { ok: false, error: "Image introuvable" };

  const { data: listing } = await supabase
    .from("listings")
    .select("owner_id")
    .eq("id", image.listing_id)
    .single();
  if (!listing || listing.owner_id !== user.id) {
    return { ok: false, error: "Forbidden" };
  }

  const publicPrefix = "/storage/v1/object/public/listings/";
  const objectPath = image.url.includes(publicPrefix)
    ? image.url.split(publicPrefix)[1]
    : null;

  await supabase.from("listing_images").delete().eq("id", imageId);
  if (objectPath) {
    await supabase.storage.from("listings").remove([objectPath]);
  }
  return { ok: true };
}

export async function getPriceMedian(
  country_code: string,
  city: string,
  neighborhood: string | null,
  type: "sale" | "rent",
) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("price_index")
    .select("avg_price_m2_sale, avg_price_m2_rent")
    .eq("country_code", country_code)
    .eq("city", city)
    .eq("neighborhood", neighborhood)
    .order("period", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (!data) return { median: null };
  return {
    median: type === "sale" ? data.avg_price_m2_sale : data.avg_price_m2_rent,
  };
}

export async function improveDescription(text: string) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return {
      improvedText: text,
      warning: "Configurer ANTHROPIC_API_KEY pour activer cette fonctionnalité",
    };
  }

  // Placeholder until Anthropic integration is wired.
  return { improvedText: text };
}

export async function submitForReview(listingId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Unauthorized" };

  const { data: listing } = await supabase
    .from("listings")
    .select("*")
    .eq("id", listingId)
    .eq("owner_id", user.id)
    .single();
  if (!listing) return { ok: false, error: "Listing introuvable" };

  const moderation = await moderateListing(listing);
  const targetStatus =
    moderation.result === "active"
      ? "active"
      : moderation.result === "pending"
        ? "pending"
        : "pending";

  const { error } = await supabase
    .from("listings")
    .update({ status: targetStatus })
    .eq("id", listingId)
    .eq("owner_id", user.id);

  if (error) return { ok: false, error: error.message };

  await captureServerEvent("publish_completed", user.id, {
    listingId,
    status: targetStatus,
  });
  revalidateTag("listings");
  revalidateTag(`listing:${listingId}`);

  return { ok: true, status: targetStatus, moderation };
}
