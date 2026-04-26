import { createClient } from "@supabase/supabase-js";
import { expect, test } from "@playwright/test";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

test("listing detail page renders gallery and actions", async ({ page }) => {
  test.skip(!supabaseUrl || !serviceRoleKey, "Supabase credentials missing");

  const admin = createClient(supabaseUrl!, serviceRoleKey!, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  const email = `listing-e2e-${Date.now()}@example.com`;
  const createdUser = await admin.auth.admin.createUser({
    email,
    email_confirm: true,
    user_metadata: { full_name: "Listing E2E Seller" },
  });
  const sellerId = createdUser.data.user?.id;
  test.skip(!sellerId, "Could not create seller user");

  const slug = `appartement-la-marsa-${Date.now()}`;

  await admin.from("profiles").upsert({
    id: sellerId!,
    full_name: "Listing E2E Seller",
    is_verified: true,
    kyc_status: "verified",
    preferred_language: "fr",
    preferred_currency: "TND",
    role: "user",
    country_code: "TN",
  });

  const { data: insertedListing } = await admin
    .from("listings")
    .insert({
      owner_id: sellerId!,
      slug,
      title: "Appartement S+2 La Marsa",
      description: "Appartement lumineux proche mer avec terrasse et parking.",
      status: "active",
      type: "sale",
      category: "apartment",
      city: "La Marsa",
      country_code: "TN",
      currency: "TND",
      price: 350000,
      surface_m2: 120,
      rooms: 3,
    })
    .select("id")
    .single();

  const newListingId = insertedListing?.id;
  if (!newListingId) {
    test.skip(true, "Could not create listing");
    return;
  }

  await admin.from("listing_images").insert([
    {
      listing_id: newListingId,
      url: "https://images.unsplash.com/photo-1560185007-cde436f6a4d0?w=1600",
      position: 0,
      is_cover: true,
    },
    {
      listing_id: newListingId,
      url: "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=1600",
      position: 1,
      is_cover: false,
    },
  ]);

  await page.goto(`/fr/listings/${slug}`);
  await expect(
    page.getByRole("heading", { name: "Appartement S+2 La Marsa" }),
  ).toBeVisible();
  await expect(
    page.getByText("Acheter > Tunisie > La Marsa > apartment"),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Envoyer un message" }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Signaler cette annonce" }),
  ).toBeVisible();
});
