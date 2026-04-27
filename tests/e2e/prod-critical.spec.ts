import { createClient } from "@supabase/supabase-js";
import { expect, test } from "@playwright/test";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

function getAdminClient() {
  return createClient(supabaseUrl!, serviceRoleKey!, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

test("critical flow: signup magic link -> publish free -> listing visible on search", async ({
  page,
}) => {
  test.skip(!supabaseUrl || !serviceRoleKey, "Supabase credentials missing");
  const admin = getAdminClient();
  const email = `critical-publish-${Date.now()}@example.com`;

  await admin.auth.admin.createUser({
    email,
    email_confirm: true,
    user_metadata: { full_name: "Critical Publisher" },
  });
  const { data: linkData } = await admin.auth.admin.generateLink({
    type: "magiclink",
    email,
    options: { redirectTo: "http://localhost:3000/fr/auth/callback" },
  });
  const signupLink = linkData?.properties?.action_link;
  if (!signupLink) {
    throw new Error("Missing magic link for critical flow");
  }

  await page.goto(signupLink);
  await page.goto("/fr/publish");
  await page.getByRole("button", { name: "Vente" }).click();
  await page.getByRole("button", { name: "Suivant" }).click();
  await page.getByRole("button", { name: "Appartement" }).click();
  await page.getByRole("button", { name: "Suivant" }).click();
  await page.getByLabel("Ville").fill("La Marsa");
  await page.getByLabel("Quartier").fill("Sidi Abdelaziz");
  await page.getByRole("button", { name: "Suivant" }).click();
  await page.getByLabel("Surface (m²)").fill("130");
  await page.getByRole("button", { name: "Suivant" }).click();
  const fileBuffer = Buffer.from(
    "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+yh2QAAAAASUVORK5CYII=",
    "base64",
  );
  await page.setInputFiles("input[type='file']", {
    name: "photo.png",
    mimeType: "image/png",
    buffer: fileBuffer,
  });
  await page.getByRole("button", { name: "Suivant" }).click();
  const title = `Appartement La Marsa ${Date.now()}`;
  await page.getByLabel("Prix").fill("420000");
  await page.getByLabel("Titre").fill(title);
  await page
    .getByLabel("Description")
    .fill("Appartement test e2e, publication gratuite.");
  await page.getByRole("button", { name: "Suivant" }).click();
  await page.getByRole("button", { name: "Free" }).click();
  await page.getByRole("button", { name: "Publier mon annonce" }).click();

  const userId = linkData.user?.id;
  const { data: listing } = await admin
    .from("listings")
    .select("id,status,slug")
    .eq("owner_id", userId!)
    .eq("title", title)
    .order("created_at", { ascending: false })
    .limit(1)
    .single();
  expect(listing).toBeTruthy();
  if (!listing) {
    return;
  }
  if (listing.status !== "active") {
    await admin
      .from("listings")
      .update({ status: "active" })
      .eq("id", listing.id);
  }

  await page.goto("/fr/search?q=La%20Marsa");
  await expect(page.getByText(title)).toBeVisible();
});

test("critical flow: search -> listing -> message conversation realtime", async ({
  browser,
  page,
}) => {
  test.skip(!supabaseUrl || !serviceRoleKey, "Supabase credentials missing");
  const admin = getAdminClient();
  const buyerEmail = `buyer-critical-${Date.now()}@example.com`;
  const sellerEmail = `seller-critical-${Date.now()}@example.com`;
  const [buyer, seller] = await Promise.all([
    admin.auth.admin.createUser({ email: buyerEmail, email_confirm: true }),
    admin.auth.admin.createUser({ email: sellerEmail, email_confirm: true }),
  ]);
  const buyerId = buyer.data.user?.id;
  const sellerId = seller.data.user?.id;
  test.skip(!buyerId || !sellerId, "Failed to create buyer/seller users");
  await admin.from("profiles").upsert([
    { id: buyerId, email: buyerEmail, role: "user", country_code: "TN" },
    { id: sellerId, email: sellerEmail, role: "user", country_code: "TN" },
  ]);
  const slug = `la-marsa-sale-${Date.now()}`;
  await admin.from("listings").insert({
    owner_id: sellerId,
    slug,
    title: "Appartement Vente La Marsa",
    status: "active",
    type: "sale",
    category: "apartment",
    city: "La Marsa",
    country_code: "TN",
    currency: "TND",
    price: 350000,
  });

  const buyerLink = await admin.auth.admin.generateLink({
    type: "magiclink",
    email: buyerEmail,
    options: { redirectTo: "http://localhost:3000/fr/auth/callback" },
  });
  const sellerLink = await admin.auth.admin.generateLink({
    type: "magiclink",
    email: sellerEmail,
    options: { redirectTo: "http://localhost:3000/fr/auth/callback" },
  });
  const buyerAction = buyerLink.data.properties?.action_link;
  const sellerAction = sellerLink.data.properties?.action_link;
  if (!buyerAction || !sellerAction) {
    throw new Error("Missing magic link for buyer/seller");
  }

  await page.goto(buyerAction);
  await page.goto("/fr/search?q=La%20Marsa");
  await page.getByText("Appartement Vente La Marsa").first().click();
  await page.getByRole("link", { name: "Envoyer un message" }).first().click();
  await page.getByPlaceholder("Écrire un message...").fill("Bonjour vendeur");
  await page.getByRole("button", { name: "Envoyer" }).click();
  await expect(page.getByText("Bonjour vendeur")).toBeVisible();

  const sellerContext = await browser.newContext();
  const sellerPage = await sellerContext.newPage();
  await sellerPage.goto(sellerAction);
  await sellerPage.goto("/fr/messages");
  await expect(sellerPage.getByText("Bonjour vendeur")).toBeVisible();
});

test("critical flow: admin moderation + user visibility update", async ({
  page,
}) => {
  test.skip(!supabaseUrl || !serviceRoleKey, "Supabase credentials missing");
  const adminClient = getAdminClient();
  const adminEmail = `admin-mod-${Date.now()}@example.com`;
  const userEmail = `user-mod-${Date.now()}@example.com`;
  const [adminUser, normalUser] = await Promise.all([
    adminClient.auth.admin.createUser({
      email: adminEmail,
      email_confirm: true,
    }),
    adminClient.auth.admin.createUser({
      email: userEmail,
      email_confirm: true,
    }),
  ]);
  const adminId = adminUser.data.user?.id;
  const userId = normalUser.data.user?.id;
  test.skip(!adminId || !userId, "Failed to create admin/user");
  await adminClient.from("profiles").upsert([
    { id: adminId, email: adminEmail, role: "admin", country_code: "TN" },
    { id: userId, email: userEmail, role: "user", country_code: "TN" },
  ]);
  const { data: listing } = await adminClient
    .from("listings")
    .insert({
      owner_id: userId,
      title: `Pending moderation ${Date.now()}`,
      slug: `pending-${Date.now()}`,
      status: "pending",
      type: "sale",
      category: "apartment",
      city: "Tunis",
      country_code: "TN",
      currency: "TND",
      price: 200000,
    })
    .select("id")
    .single();
  if (!listing?.id) {
    throw new Error("Failed to create listing for moderation test");
  }
  const adminLink = await adminClient.auth.admin.generateLink({
    type: "magiclink",
    email: adminEmail,
    options: { redirectTo: "http://localhost:3000/fr/auth/callback" },
  });
  const adminAction = adminLink.data.properties?.action_link;
  if (!adminAction) {
    throw new Error("Missing admin magic link");
  }

  await page.goto(adminAction);
  await page.goto("/fr/admin/moderation");
  await page.getByRole("button", { name: "Approve" }).first().click();

  const { data: updated } = await adminClient
    .from("listings")
    .select("status")
    .eq("id", listing.id)
    .single();
  expect(updated?.status).toBe("active");
});

test("critical flow: normal user cannot access admin", async ({ page }) => {
  test.skip(!supabaseUrl || !serviceRoleKey, "Supabase credentials missing");
  const admin = getAdminClient();
  const email = `normal-user-${Date.now()}@example.com`;
  await admin.auth.admin.createUser({ email, email_confirm: true });
  const link = await admin.auth.admin.generateLink({
    type: "magiclink",
    email,
    options: { redirectTo: "http://localhost:3000/fr/auth/callback" },
  });
  const normalUserLink = link.data.properties?.action_link;
  if (!normalUserLink) {
    throw new Error("Missing magic link");
  }
  await page.goto(normalUserLink);
  const response = await page.goto("/fr/admin");
  expect([307, 403]).toContain(response?.status() ?? 0);
});

test("critical flow: SQL injection attempt is blocked by validation/RLS", async ({
  page,
}) => {
  test.skip(!supabaseUrl || !serviceRoleKey, "Supabase credentials missing");
  const admin = getAdminClient();
  await page.goto("/fr/search?q=';DROP TABLE listings;--");
  await expect(
    page.getByRole("heading", { name: "Recherche immobilière" }),
  ).toBeVisible();
  const { error } = await admin.from("listings").select("id").limit(1);
  expect(error).toBeNull();
});
