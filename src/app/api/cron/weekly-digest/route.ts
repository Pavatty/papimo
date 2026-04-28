import { NextResponse } from "next/server";

import { createAdminClient } from "@/data/supabase/admin";
import { sendEmail } from "@/lib/email/send";
import { type EmailLocale } from "@/lib/email/templates/base";
import { weeklyDigestEmail } from "@/lib/email/templates/weekly-digest";

export const dynamic = "force-dynamic";

const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;
const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://papimo.vercel.app";

type Subscriber = {
  id: string;
  email: string | null;
  full_name: string | null;
  preferred_language: string | null;
  notifications_email: boolean | null;
};

type ListingPreview = {
  title: string | null;
  price: number;
  currency: string;
  city: string;
  slug: string | null;
  id: string;
};

function pickLocale(value: string | null | undefined): EmailLocale {
  if (value === "en" || value === "ar") return value;
  return "fr";
}

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  const secret = process.env.CRON_SECRET;
  if (!secret || authHeader !== `Bearer ${secret}`) {
    return NextResponse.json(
      { ok: false, error: "Unauthorized" },
      { status: 401 },
    );
  }

  const admin = createAdminClient();
  const { data: flagRow } = await admin
    .from("feature_flags")
    .select("enabled")
    .eq("key", "weekly_digest_enabled")
    .maybeSingle();
  if (!flagRow?.enabled) {
    return NextResponse.json({ ok: true, skipped: "flag_disabled" });
  }
  const sinceIso = new Date(Date.now() - SEVEN_DAYS_MS).toISOString();

  const { count: newListingsCount, error: countError } = await admin
    .from("listings")
    .select("*", { count: "exact", head: true })
    .eq("status", "active")
    .gte("created_at", sinceIso);
  if (countError) {
    return NextResponse.json(
      { ok: false, error: countError.message },
      { status: 500 },
    );
  }

  const { data: rawListings, error: listingsError } = await admin
    .from("listings")
    .select("id, title, price, currency, city, slug, created_at")
    .eq("status", "active")
    .gte("created_at", sinceIso)
    .order("favorites_count", { ascending: false })
    .order("views_count", { ascending: false })
    .limit(5);
  if (listingsError) {
    return NextResponse.json(
      { ok: false, error: listingsError.message },
      { status: 500 },
    );
  }

  const listings = (rawListings ?? []) as ListingPreview[];
  const listingIds = listings.map((l) => l.id);
  const coverByListing: Record<string, string> = {};
  if (listingIds.length > 0) {
    const { data: covers } = await admin
      .from("listing_images")
      .select("listing_id, url, position")
      .in("listing_id", listingIds)
      .order("position", { ascending: true });
    for (const row of covers ?? []) {
      if (!coverByListing[row.listing_id]) {
        coverByListing[row.listing_id] = row.url;
      }
    }
  }

  const { data: rawSubs, error: subsError } = await admin
    .from("profiles")
    .select("id, email, full_name, preferred_language, notifications_email")
    .eq("notifications_email", true);
  if (subsError) {
    return NextResponse.json(
      { ok: false, error: subsError.message },
      { status: 500 },
    );
  }
  const subscribers = (rawSubs ?? []) as Subscriber[];

  let sent = 0;
  let skipped = 0;
  let failed = 0;
  for (const sub of subscribers) {
    if (!sub.email) {
      skipped += 1;
      continue;
    }
    const locale = pickLocale(sub.preferred_language);
    const topListings = listings.map((l) => ({
      title: l.title ?? "Annonce",
      price: Number(l.price),
      currency: l.currency,
      city: l.city,
      url: `${APP_URL}/${locale}/annonce/${l.slug ?? l.id}`,
      cover: coverByListing[l.id] ?? null,
    }));
    const { subject, html } = weeklyDigestEmail({
      recipientName: sub.full_name ?? sub.email,
      newListingsCount: newListingsCount ?? 0,
      topListings,
      searchUrl: `${APP_URL}/${locale}/search`,
      locale,
    });
    const result = await sendEmail({ to: sub.email, subject, html });
    if (result.success) {
      sent += 1;
    } else {
      failed += 1;
    }
  }

  return NextResponse.json({
    ok: true,
    new_listings_count: newListingsCount ?? 0,
    subscribers: subscribers.length,
    sent,
    skipped,
    failed,
  });
}
