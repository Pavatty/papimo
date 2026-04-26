import { expect, test } from "@playwright/test";

test("whatsapp flow shows code and wa link", async ({ page }) => {
  await page.goto("/fr/login");
  await page.getByLabel("Numero de telephone").fill("+21622162261");
  await page.getByRole("button", { name: "Continuer avec WhatsApp" }).click();
  await expect(
    page.getByRole("link", { name: "Ouvrir WhatsApp" }),
  ).toBeVisible();
  await expect(page.locator("a[href*='wa.me']")).toBeVisible();
});
