import { createClient } from "@supabase/supabase-js";
import { expect, test } from "@playwright/test";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

test("create conversation and send message", async ({ page }) => {
  test.skip(!supabaseUrl || !serviceRoleKey, "Supabase credentials missing");

  const admin = createClient(supabaseUrl!, serviceRoleKey!, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  const buyerEmail = `buyer-${Date.now()}@example.com`;
  const sellerEmail = `seller-${Date.now()}@example.com`;

  const [buyerRes, sellerRes] = await Promise.all([
    admin.auth.admin.createUser({
      email: buyerEmail,
      email_confirm: true,
      user_metadata: { full_name: "Buyer E2E" },
    }),
    admin.auth.admin.createUser({
      email: sellerEmail,
      email_confirm: true,
      user_metadata: { full_name: "Seller E2E" },
    }),
  ]);

  const buyerId = buyerRes.data.user?.id;
  const sellerId = sellerRes.data.user?.id;
  test.skip(!buyerId || !sellerId, "Users creation failed");

  await admin.from("profiles").upsert([
    {
      id: buyerId!,
      full_name: "Buyer E2E",
      preferred_language: "fr",
      preferred_currency: "TND",
      role: "user",
      country_code: "TN",
    },
    {
      id: sellerId!,
      full_name: "Seller E2E",
      preferred_language: "fr",
      preferred_currency: "TND",
      role: "user",
      country_code: "TN",
    },
  ]);

  const slug = `message-test-${Date.now()}`;
  const { data: listing } = await admin
    .from("listings")
    .insert({
      owner_id: sellerId!,
      slug,
      title: "Appartement messaging test",
      description: "Listing for messaging e2e flow",
      status: "active",
      type: "sale",
      category: "apartment",
      city: "Tunis",
      country_code: "TN",
      currency: "TND",
      price: 200000,
      surface_m2: 80,
      rooms: 3,
    })
    .select("id")
    .single();
  test.skip(!listing?.id, "Listing creation failed");

  const magicLink = await admin.auth.admin.generateLink({
    type: "magiclink",
    email: buyerEmail,
    options: { redirectTo: "http://localhost:3000/fr/auth/callback" },
  });
  const actionLink = magicLink.data.properties?.action_link;
  test.skip(!actionLink, "Magic link generation failed");

  await page.goto(actionLink!);
  await page.goto(
    `/fr/messages?listing_id=${listing.id}&seller_id=${sellerId}`,
  );
  await expect(page).toHaveURL(/\/fr\/messages\/.*/);

  await page
    .getByPlaceholder("Écrire un message...")
    .fill("Bonjour, le bien est-il disponible ?");
  await page.getByRole("button", { name: "Envoyer" }).click();
  await expect(
    page.getByText("Bonjour, le bien est-il disponible ?"),
  ).toBeVisible();
});
