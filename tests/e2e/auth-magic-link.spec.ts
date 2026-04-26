import { expect, test } from "@playwright/test";

test("magic link form shows success state", async ({ page }) => {
  await page.goto("/fr/login");
  await page.getByLabel("Email").fill("test@example.com");
  await page.getByRole("button", { name: "Continuer" }).first().click();
  await expect(page.getByText("Verifiez votre boite mail")).toBeVisible();
});
