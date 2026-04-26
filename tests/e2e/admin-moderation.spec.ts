import { createClient } from "@supabase/supabase-js";
import { expect, test } from "@playwright/test";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

test("admin can approve pending listing from moderation queue", async ({
  page,
}) => {
  test.skip(!supabaseUrl || !serviceRoleKey, "Supabase credentials missing");

  const admin = createClient(supabaseUrl!, serviceRoleKey!, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  const adminEmail = `admin-${Date.now()}@example.com`;
  const ownerEmail = `owner-${Date.now()}@example.com`;

  const [adminRes, ownerRes] = await Promise.all([
    admin.auth.admin.createUser({
      email: adminEmail,
      email_confirm: true,
      user_metadata: { full_name: "Admin E2E" },
    }),
    admin.auth.admin.createUser({
      email: ownerEmail,
      email_confirm: true,
      user_metadata: { full_name: "Owner E2E" },
    }),
  ]);

  const adminId = adminRes.data.user?.id;
  const ownerId = ownerRes.data.user?.id;
  test.skip(!adminId || !ownerId, "Users creation failed");

  await admin.from("profiles").upsert([
    {
      id: adminId!,
      email: adminEmail,
      full_name: "Admin E2E",
      preferred_language: "fr",
      preferred_currency: "TND",
      role: "admin",
      country_code: "TN",
    },
    {
      id: ownerId!,
      email: ownerEmail,
      full_name: "Owner E2E",
      preferred_language: "fr",
      preferred_currency: "TND",
      role: "user",
      country_code: "TN",
    },
  ]);

  const slug = `admin-moderation-${Date.now()}`;
  const { data: listing } = await admin
    .from("listings")
    .insert({
      owner_id: ownerId!,
      slug,
      title: "Listing pending moderation",
      description: "Waiting approval from admin",
      status: "pending",
      type: "sale",
      category: "apartment",
      city: "Tunis",
      country_code: "TN",
      currency: "TND",
      price: 310000,
      surface_m2: 100,
      rooms: 3,
    })
    .select("id")
    .single();
  test.skip(!listing?.id, "Listing creation failed");

  const magicLink = await admin.auth.admin.generateLink({
    type: "magiclink",
    email: adminEmail,
    options: { redirectTo: "http://localhost:3000/fr/auth/callback" },
  });
  const actionLink = magicLink.data.properties?.action_link;
  test.skip(!actionLink, "Magic link generation failed");

  await page.goto(actionLink!);
  await page.goto("/fr/admin/moderation");

  await expect(page.getByText("Listing pending moderation")).toBeVisible();
  await page.getByRole("button", { name: "Approve" }).first().click();
  await page.reload();

  const { data: updated } = await admin
    .from("listings")
    .select("status")
    .eq("id", listing.id)
    .single();
  expect(updated?.status).toBe("active");
});
