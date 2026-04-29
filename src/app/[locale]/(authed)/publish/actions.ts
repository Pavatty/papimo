"use server";

import { randomUUID } from "node:crypto";

import { revalidateTag } from "next/cache";
import { z } from "zod";

import { captureServerEvent } from "@/lib/analytics/events";
import { sendEmail } from "@/lib/email/send";
import { type EmailLocale } from "@/lib/email/templates/base";
import { listingPublishedEmail } from "@/lib/email/templates/listing-published";
import { isFlagEnabled } from "@/data/repositories/feature-flags";
import { checkAntiAgency } from "@/lib/moderation/anti-agency";
import { moderateWithClaude } from "@/lib/moderation/claude-moderator";
import { moderateListing } from "@/lib/moderation/listing";
import { logModeration } from "@/lib/moderation/log";
import {
  checkPublishRateLimit,
  incrementPublishCount,
} from "@/lib/moderation/rate-limit";
import {
  sanitizeDescription,
  sanitizeTitle,
} from "@/lib/validation/listing.schema";
import { createClient } from "@/data/supabase/server";
import type { TablesInsert } from "@/types/database";

const publishDraftSchema = z.object({
  id: z.string().uuid().optional(),
  owner_id: z.string().uuid().optional(),
  type: z.enum(["sale", "rent", "furnished_rent", "colocation"]).optional(),
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
  title: z.string().trim().max(80).optional(),
  description: z.string().trim().max(5000).optional(),
  price: z.number().positive().max(10_000_000_000).optional().nullable(),
  currency: z.enum(["TND", "EUR", "USD", "MAD", "DZD"]).optional(),
  surface_m2: z.number().int().positive().max(100_000).optional().nullable(),
  rooms: z.number().int().nonnegative().max(50).optional().nullable(),
  bedrooms: z.number().int().nonnegative().max(50).optional().nullable(),
  bathrooms: z.number().int().nonnegative().max(20).optional().nullable(),
  floor: z.number().int().min(-5).max(100).optional().nullable(),
  total_floors: z.number().int().positive().max(100).optional().nullable(),
  year_built: z.number().int().min(1800).max(2030).optional().nullable(),
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
  const d = parsed.data;
  const legacyType: "sale" | "rent" =
    d.type === "sale" || d.type === "rent"
      ? d.type
      : d.type === "colocation" || d.type === "furnished_rent"
        ? "rent"
        : "sale";
  const cleanTitle = d.title?.trim() ? sanitizeTitle(d.title) : "Brouillon";
  const cleanDescription = d.description?.trim()
    ? sanitizeDescription(d.description)
    : null;
  const payload: TablesInsert<"listings"> = {
    id: draftId,
    owner_id: user.id,
    type: legacyType,
    category: d.category ?? "apartment",
    title: cleanTitle,
    price: d.price && d.price > 0 ? d.price : 1,
    city: d.city?.trim() ? d.city : "À préciser",
    status: "draft",
    country_code: d.country_code ?? "TN",
    currency: d.currency ?? "TND",
    address: d.address?.trim() ? d.address : null,
    description: cleanDescription,
    surface_m2: d.surface_m2 ?? null,
    rooms: d.rooms ?? null,
    bedrooms: d.bedrooms ?? null,
    bathrooms: d.bathrooms ?? null,
    floor: d.floor ?? null,
    total_floors: d.total_floors ?? null,
    year_built: d.year_built ?? null,
    latitude: d.latitude ?? null,
    longitude: d.longitude ?? null,
    neighborhood: d.neighborhood?.trim() ? d.neighborhood : null,
    governorate: d.governorate?.trim() ? d.governorate : null,
    pack: d.pack ?? "free",
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
  revalidateTag("listings", "default");
  revalidateTag(`listing:${listing.id}`, "default");

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
    const imageId = orderedIds[idx];
    if (imageId === undefined) continue;
    await supabase
      .from("listing_images")
      .update({ position: idx, is_cover: idx === 0 })
      .eq("id", imageId)
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
  let priceQuery = supabase
    .from("price_index")
    .select("avg_price_m2_sale, avg_price_m2_rent")
    .eq("country_code", country_code)
    .eq("city", city);
  priceQuery =
    neighborhood === null
      ? priceQuery.is("neighborhood", null)
      : priceQuery.eq("neighborhood", neighborhood);
  const { data } = await priceQuery
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

  const [rateLimitFlag, antiAgencyFlag, aiFlag] = await Promise.all([
    isFlagEnabled("rate_limit_enabled"),
    isFlagEnabled("anti_agency_enabled"),
    isFlagEnabled("ai_moderation_enabled"),
  ]);

  if (rateLimitFlag) {
    const rl = await checkPublishRateLimit(user.id);
    if (!rl.allowed) {
      return {
        ok: false,
        error: `Limite de ${rl.limit} publications par jour atteinte. Réessayez demain.`,
        code: "RATE_LIMIT",
      };
    }
  }

  if (antiAgencyFlag && listing.pack === "free") {
    const aa = await checkAntiAgency(user.id);
    if (!aa.allowed) {
      return {
        ok: false,
        error: `Maximum ${aa.max} annonces gratuites actives. Passez en plan payant pour publier davantage.`,
        code: "ANTI_AGENCY",
      };
    }
  }

  const rules = await moderateListing(listing);

  let claudeResult: Awaited<ReturnType<typeof moderateWithClaude>> = null;
  if (aiFlag) {
    claudeResult = await moderateWithClaude(listing);
  }

  let targetStatus: "active" | "pending" = "pending";
  let logDecision: "approved" | "rejected" | "manual_review" | "pending" =
    "pending";
  let logSource: "ai_claude" | "rules" = "rules";
  const combinedReasons = [...rules.reasons];

  if (claudeResult) {
    logSource = "ai_claude";
    combinedReasons.push(...claudeResult.reasons);
    if (claudeResult.decision === "rejected") {
      logDecision = "rejected";
      await logModeration({
        listingId,
        userId: user.id,
        decision: "rejected",
        source: "ai_claude",
        reasons: combinedReasons,
        aiScore: claudeResult.score,
        aiRaw: claudeResult.raw,
      });
      return {
        ok: false,
        error: "Annonce rejetée par la modération automatique.",
        code: "MODERATION_REJECTED",
        reasons: combinedReasons,
      };
    }
    if (claudeResult.decision === "manual_review") {
      targetStatus = "pending";
      logDecision = "manual_review";
    } else if (rules.result === "active") {
      targetStatus = "active";
      logDecision = "approved";
    } else {
      targetStatus = "pending";
      logDecision = "pending";
    }
  } else {
    if (rules.result === "active") {
      targetStatus = "active";
      logDecision = "approved";
    } else {
      targetStatus = "pending";
      logDecision =
        rules.result === "manual_review" ? "manual_review" : "pending";
    }
  }

  const { error } = await supabase
    .from("listings")
    .update({ status: targetStatus })
    .eq("id", listingId)
    .eq("owner_id", user.id);

  if (error) return { ok: false, error: error.message };

  await logModeration({
    listingId,
    userId: user.id,
    decision: logDecision,
    source: logSource,
    reasons: combinedReasons,
    aiScore: claudeResult?.score ?? null,
    aiRaw: claudeResult?.raw ?? null,
  });

  if (rateLimitFlag) {
    await incrementPublishCount(user.id);
  }

  await captureServerEvent("publish_completed", user.id, {
    listingId,
    status: targetStatus,
  });
  revalidateTag("listings", "default");
  revalidateTag(`listing:${listingId}`, "default");

  if (targetStatus === "active") {
    const { data: ownerData } = await supabase
      .from("profiles")
      .select("email, full_name, preferred_language, notifications_email")
      .eq("id", user.id)
      .maybeSingle();
    const owner = ownerData as {
      email: string | null;
      full_name: string | null;
      preferred_language: string | null;
      notifications_email: boolean | null;
    } | null;

    if (owner?.email && owner.notifications_email !== false) {
      const preferredLocale =
        owner.preferred_language === "en" || owner.preferred_language === "ar"
          ? (owner.preferred_language as EmailLocale)
          : "fr";
      const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
      const listingPath = listing.slug || listingId;
      const { subject, html } = listingPublishedEmail({
        recipientName: owner.full_name || owner.email,
        listingTitle: listing.title || "Votre annonce",
        listingUrl: `${appUrl}/${preferredLocale}/annonce/${listingPath}`,
        locale: preferredLocale,
      });
      sendEmail({ to: owner.email, subject, html }).catch(console.error);
    }
  }

  return {
    ok: true,
    status: targetStatus,
    moderation: {
      decision: logDecision,
      source: logSource,
      reasons: combinedReasons,
    },
  };
}
