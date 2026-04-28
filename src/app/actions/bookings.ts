"use server";

import { revalidateTag } from "next/cache";
import { z } from "zod";

import { createClient } from "@/data/supabase/server";
import { getCurrentUser } from "@/data/supabase/session";

const DEFAULT_GUEST_FEE_PERCENT = 5;
const DEFAULT_HOST_FEE_PERCENT = 5;

const createBookingSchema = z.object({
  listingId: z.string().uuid(),
  checkInDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  checkOutDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  numGuests: z.number().int().positive().max(50),
});

export type CreateBookingInput = z.infer<typeof createBookingSchema>;

async function getCommissionPercents(): Promise<{
  guest: number;
  host: number;
}> {
  const supabase = await createClient();
  const { data: rows } = await supabase
    .from("app_settings")
    .select("key, value")
    .in("key", ["sejours_guest_fee_percent", "sejours_host_fee_percent"]);
  let guest = DEFAULT_GUEST_FEE_PERCENT;
  let host = DEFAULT_HOST_FEE_PERCENT;
  for (const row of rows ?? []) {
    if (
      row.key === "sejours_guest_fee_percent" &&
      typeof row.value === "number"
    ) {
      guest = row.value;
    }
    if (
      row.key === "sejours_host_fee_percent" &&
      typeof row.value === "number"
    ) {
      host = row.value;
    }
  }
  return { guest, host };
}

export async function createBooking(input: CreateBookingInput) {
  const parsed = createBookingSchema.safeParse(input);
  if (!parsed.success) {
    return {
      ok: false as const,
      error: parsed.error.issues[0]?.message ?? "Invalid input",
    };
  }

  const user = await getCurrentUser();
  if (!user) return { ok: false as const, error: "Non connecté" };

  if (parsed.data.checkOutDate <= parsed.data.checkInDate) {
    return { ok: false as const, error: "Dates invalides" };
  }

  const supabase = await createClient();

  const { data: listing } = await supabase
    .from("listings")
    .select(
      "id, owner_id, base_price_per_night, currency, rental_type, status, min_nights, max_guests",
    )
    .eq("id", parsed.data.listingId)
    .maybeSingle();

  if (!listing) return { ok: false as const, error: "Annonce introuvable" };
  if (listing.rental_type !== "short_term") {
    return { ok: false as const, error: "Annonce non disponible en séjour" };
  }
  if (listing.status !== "active") {
    return { ok: false as const, error: "Annonce inactive" };
  }
  if (listing.owner_id === user.id) {
    return {
      ok: false as const,
      error: "Vous ne pouvez pas réserver votre propre annonce",
    };
  }
  if (listing.max_guests && parsed.data.numGuests > listing.max_guests) {
    return {
      ok: false as const,
      error: `Maximum ${listing.max_guests} voyageurs`,
    };
  }

  const ms =
    new Date(parsed.data.checkOutDate).getTime() -
    new Date(parsed.data.checkInDate).getTime();
  const nights = Math.round(ms / (1000 * 60 * 60 * 24));
  if (nights < (listing.min_nights ?? 1)) {
    return {
      ok: false as const,
      error: `Minimum ${listing.min_nights ?? 1} nuits`,
    };
  }

  const { data: conflicts } = await supabase
    .from("bookings")
    .select("id")
    .eq("listing_id", parsed.data.listingId)
    .in("status", ["confirmed", "pending_payment"])
    .lt("check_in_date", parsed.data.checkOutDate)
    .gt("check_out_date", parsed.data.checkInDate);

  if (conflicts && conflicts.length > 0) {
    return { ok: false as const, error: "Dates déjà réservées" };
  }

  const pricePerNight = Number(listing.base_price_per_night ?? 0);
  if (pricePerNight <= 0) {
    return { ok: false as const, error: "Prix non défini" };
  }
  const basePrice = pricePerNight * nights;
  const { guest: guestFeePercent } = await getCommissionPercents();
  const serviceFee = (basePrice * guestFeePercent) / 100;
  const totalPrice = basePrice + serviceFee;

  const { data: booking, error } = await supabase
    .from("bookings")
    .insert({
      listing_id: parsed.data.listingId,
      guest_id: user.id,
      host_id: listing.owner_id,
      check_in_date: parsed.data.checkInDate,
      check_out_date: parsed.data.checkOutDate,
      num_guests: parsed.data.numGuests,
      base_price: basePrice,
      service_fee: serviceFee,
      total_price: totalPrice,
      currency: listing.currency,
      status: "pending_payment",
    })
    .select("id")
    .single();

  if (error) return { ok: false as const, error: error.message };

  revalidateTag(`bookings:${user.id}`, "default");
  revalidateTag(`bookings:listing:${parsed.data.listingId}`, "default");
  return { ok: true as const, bookingId: booking.id };
}

const confirmSchema = z.object({
  bookingId: z.string().uuid(),
  paymentIntentId: z.string().min(1),
});

export async function confirmBooking(input: z.infer<typeof confirmSchema>) {
  const parsed = confirmSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false as const, error: "Invalid input" };
  }
  const user = await getCurrentUser();
  if (!user) return { ok: false as const, error: "Non connecté" };

  const supabase = await createClient();

  const { data: booking, error } = await supabase
    .from("bookings")
    .update({
      status: "confirmed",
      payment_status: "paid",
      payment_intent_id: parsed.data.paymentIntentId,
      updated_at: new Date().toISOString(),
    })
    .eq("id", parsed.data.bookingId)
    .eq("guest_id", user.id)
    .select("listing_id, check_in_date, check_out_date")
    .maybeSingle();

  if (error || !booking) {
    return {
      ok: false as const,
      error: error?.message ?? "Réservation introuvable",
    };
  }

  const dates: string[] = [];
  const cursor = new Date(booking.check_in_date + "T00:00:00Z");
  const end = new Date(booking.check_out_date + "T00:00:00Z");
  while (cursor < end) {
    dates.push(cursor.toISOString().slice(0, 10));
    cursor.setUTCDate(cursor.getUTCDate() + 1);
  }

  if (dates.length > 0) {
    await supabase.from("availability_calendars").upsert(
      dates.map((date) => ({
        listing_id: booking.listing_id,
        date,
        available: false,
      })),
      { onConflict: "listing_id,date" },
    );
  }

  revalidateTag(`bookings:${user.id}`, "default");
  revalidateTag(`bookings:listing:${booking.listing_id}`, "default");
  return { ok: true as const };
}

export async function cancelBookingByGuest(bookingId: string) {
  const user = await getCurrentUser();
  if (!user) return { ok: false as const, error: "Non connecté" };

  const supabase = await createClient();
  const { data: booking, error } = await supabase
    .from("bookings")
    .update({
      status: "cancelled_by_guest",
      cancelled_at: new Date().toISOString(),
    })
    .eq("id", bookingId)
    .eq("guest_id", user.id)
    .in("status", ["pending_payment", "confirmed"])
    .select("listing_id, check_in_date, check_out_date")
    .maybeSingle();

  if (error || !booking) {
    return {
      ok: false as const,
      error: error?.message ?? "Réservation introuvable",
    };
  }

  const dates: string[] = [];
  const cursor = new Date(booking.check_in_date + "T00:00:00Z");
  const end = new Date(booking.check_out_date + "T00:00:00Z");
  while (cursor < end) {
    dates.push(cursor.toISOString().slice(0, 10));
    cursor.setUTCDate(cursor.getUTCDate() + 1);
  }
  if (dates.length > 0) {
    await supabase
      .from("availability_calendars")
      .update({ available: true })
      .eq("listing_id", booking.listing_id)
      .in("date", dates);
  }

  revalidateTag(`bookings:${user.id}`, "default");
  return { ok: true as const };
}
