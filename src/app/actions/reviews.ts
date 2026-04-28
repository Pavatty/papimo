"use server";

import { revalidateTag } from "next/cache";
import { z } from "zod";

import { createClient } from "@/data/supabase/server";
import { getCurrentUser } from "@/data/supabase/session";

const reviewSchema = z.object({
  bookingId: z.string().uuid(),
  reviewType: z.enum(["guest_to_host", "host_to_guest"]),
  rating: z.number().int().min(1).max(5),
  cleanlinessRating: z.number().int().min(1).max(5).optional(),
  communicationRating: z.number().int().min(1).max(5).optional(),
  accuracyRating: z.number().int().min(1).max(5).optional(),
  locationRating: z.number().int().min(1).max(5).optional(),
  valueRating: z.number().int().min(1).max(5).optional(),
  comment: z.string().trim().min(10).max(2000).optional(),
  privateFeedback: z.string().trim().max(2000).optional(),
});

export type CreateReviewInput = z.infer<typeof reviewSchema>;

export async function createReview(input: CreateReviewInput) {
  const parsed = reviewSchema.safeParse(input);
  if (!parsed.success) {
    return {
      ok: false as const,
      error: parsed.error.issues[0]?.message ?? "Invalid input",
    };
  }
  const user = await getCurrentUser();
  if (!user) return { ok: false as const, error: "Non connecté" };

  const supabase = await createClient();

  const { data: booking } = await supabase
    .from("bookings")
    .select("id, guest_id, host_id, listing_id, status, check_out_date")
    .eq("id", parsed.data.bookingId)
    .maybeSingle();
  if (!booking) {
    return { ok: false as const, error: "Réservation introuvable" };
  }

  const isGuest = booking.guest_id === user.id;
  const isHost = booking.host_id === user.id;
  if (!isGuest && !isHost) {
    return { ok: false as const, error: "Non autorisé" };
  }

  const expectedType = isGuest ? "guest_to_host" : "host_to_guest";
  if (parsed.data.reviewType !== expectedType) {
    return { ok: false as const, error: "Type d'avis invalide" };
  }

  const today = new Date().toISOString().slice(0, 10);
  if (booking.check_out_date > today) {
    return {
      ok: false as const,
      error: "L'avis n'est ouvert qu'après la fin du séjour",
    };
  }

  if (
    booking.status === "cancelled_by_guest" ||
    booking.status === "cancelled_by_host"
  ) {
    return {
      ok: false as const,
      error: "Pas d'avis sur une réservation annulée",
    };
  }

  const revieweeId = isGuest ? booking.host_id : booking.guest_id;

  const { error } = await supabase.from("reviews").insert({
    booking_id: booking.id,
    reviewer_id: user.id,
    reviewee_id: revieweeId,
    listing_id: booking.listing_id,
    review_type: parsed.data.reviewType,
    rating: parsed.data.rating,
    cleanliness_rating: parsed.data.cleanlinessRating ?? null,
    communication_rating: parsed.data.communicationRating ?? null,
    accuracy_rating: parsed.data.accuracyRating ?? null,
    location_rating: parsed.data.locationRating ?? null,
    value_rating: parsed.data.valueRating ?? null,
    comment: parsed.data.comment ?? null,
    private_feedback: parsed.data.privateFeedback ?? null,
  });

  if (error) {
    return { ok: false as const, error: error.message };
  }

  revalidateTag(`reviews:listing:${booking.listing_id}`, "default");
  revalidateTag(`reviews:user:${revieweeId}`, "default");
  return { ok: true as const };
}

const responseSchema = z.object({
  reviewId: z.string().uuid(),
  response: z.string().trim().min(5).max(1000),
});

export async function respondToReview(input: z.infer<typeof responseSchema>) {
  const parsed = responseSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false as const, error: "Invalid input" };
  }
  const user = await getCurrentUser();
  if (!user) return { ok: false as const, error: "Non connecté" };

  const supabase = await createClient();
  const { data: review, error } = await supabase
    .from("reviews")
    .update({
      response: parsed.data.response,
      response_at: new Date().toISOString(),
    })
    .eq("id", parsed.data.reviewId)
    .eq("reviewee_id", user.id)
    .is("response", null)
    .select("listing_id")
    .maybeSingle();

  if (error || !review) {
    return { ok: false as const, error: error?.message ?? "Avis introuvable" };
  }

  revalidateTag(`reviews:listing:${review.listing_id}`, "default");
  return { ok: true as const };
}
