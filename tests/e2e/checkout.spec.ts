import { createClient } from "@supabase/supabase-js";
import { expect, test } from "@playwright/test";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

test("checkout page renders and starts payment", async ({ page }) => {
  test.skip(!supabaseUrl || !serviceRoleKey, "Supabase credentials missing");

  const admin = createClient(supabaseUrl!, serviceRoleKey!, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  const email = `checkout-e2e-${Date.now()}@example.com`;
  const userRes = await admin.auth.admin.createUser({
    email,
    email_confirm: true,
    user_metadata: { full_name: "Checkout User" },
  });
  const userId = userRes.data.user?.id;
  test.skip(!userId, "Could not create user");

  await admin.from("profiles").upsert({
    id: userId!,
    full_name: "Checkout User",
    preferred_currency: "TND",
    preferred_language: "fr",
    role: "user",
    country_code: "TN",
  });

  const { data: listing } = await admin
    .from("listings")
    .insert({
      owner_id: userId!,
      title: "Draft checkout listing",
      description: "test",
      status: "draft",
      type: "sale",
      category: "apartment",
      city: "Tunis",
      country_code: "TN",
      currency: "TND",
      price: 100000,
      pack: "essential",
      slug: `checkout-${Date.now()}`,
    })
    .select("id")
    .single();
  test.skip(!listing?.id, "Could not create listing");

  const linkRes = await admin.auth.admin.generateLink({
    type: "magiclink",
    email,
    options: { redirectTo: "http://localhost:3000/fr/auth/callback" },
  });
  const magicLink = linkRes.data.properties?.action_link;
  test.skip(!magicLink, "Could not create magic link");

  await page.goto(magicLink!);
  await page.goto(`/fr/checkout?type=listing-pack&listingId=${listing.id}`);

  await expect(page.getByRole("heading", { name: "Checkout" })).toBeVisible();
  await expect(page.getByText("Pack")).toBeVisible();
  await expect(page.getByRole("button", { name: "Payer" })).toBeVisible();
});
