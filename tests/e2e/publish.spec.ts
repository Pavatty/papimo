import { createClient } from "@supabase/supabase-js";
import { expect, test } from "@playwright/test";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRole = process.env.SUPABASE_SERVICE_ROLE_KEY;

test("publish stepper flow creates pending listing", async ({ page }) => {
  test.skip(!url || !serviceRole, "Supabase env vars are required");

  const admin = createClient(url!, serviceRole!, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
  const email = `papimo-e2e-${Date.now()}@example.com`;

  await admin.auth.admin.createUser({
    email,
    email_confirm: true,
    user_metadata: { full_name: "E2E User" },
  });

  const { data: linkData, error: linkError } =
    await admin.auth.admin.generateLink({
      type: "magiclink",
      email,
      options: {
        redirectTo: "http://localhost:3000/fr/auth/callback",
      },
    });
  expect(linkError).toBeNull();
  const actionUrl = linkData?.properties?.action_link;
  if (!actionUrl) {
    throw new Error("Missing magic link action_link");
  }
  await page.goto(actionUrl);
  await page.goto("/fr/publish");

  await page.getByRole("button", { name: "Vente" }).click();
  await page.getByRole("button", { name: "Suivant" }).click();
  await page.getByRole("button", { name: "Appartement" }).click();
  await page.getByRole("button", { name: "Suivant" }).click();
  await page.getByLabel("Ville").fill("La Marsa");
  await page.getByLabel("Quartier").fill("Sidi Daoud");
  await page.getByRole("button", { name: "Suivant" }).click();
  await page.getByLabel("Surface (m²)").fill("120");
  await page.getByRole("button", { name: "Suivant" }).click();

  const fileBuffer = Buffer.from(
    "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+yh2QAAAAASUVORK5CYII=",
    "base64",
  );
  await page.setInputFiles("input[type='file']", [
    {
      name: "photo1.png",
      mimeType: "image/png",
      buffer: fileBuffer,
    },
    {
      name: "photo2.png",
      mimeType: "image/png",
      buffer: fileBuffer,
    },
    {
      name: "photo3.png",
      mimeType: "image/png",
      buffer: fileBuffer,
    },
  ]);
  await page.getByRole("button", { name: "Suivant" }).click();

  await page.getByLabel("Prix").fill("350000");
  await page.getByLabel("Titre").fill("Appartement S+2 La Marsa");
  await page
    .getByLabel("Description")
    .fill(
      "Appartement S+2 lumineux à La Marsa, proche des commodités, idéal pour une famille.",
    );
  await page.getByRole("button", { name: "Suivant" }).click();
  await page.getByRole("button", { name: "Free" }).click();
  await page.getByRole("button", { name: "Publier mon annonce" }).click();

  await expect(page).toHaveURL(/dashboard\?published=(pending|active)/);

  const userId = linkData?.user?.id;
  expect(userId).toBeTruthy();

  const { data: listing } = await admin
    .from("listings")
    .select("status,title")
    .eq("owner_id", userId!)
    .eq("title", "Appartement S+2 La Marsa")
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  expect(listing?.status).toMatch(/pending|active/);
});
