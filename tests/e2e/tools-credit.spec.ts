import { expect, test } from "@playwright/test";

test("credit simulator computes monthly payment", async ({ page }) => {
  await page.goto("/fr/outils/simulateur-credit");
  await expect(
    page.getByRole("heading", { name: "Simulateur de crédit" }),
  ).toBeVisible();
  await page.getByPlaceholder("Prix du bien").fill("400000");
  await page.locator("input[type='range']").fill("9");
  await expect(page.getByText("Mensualité", { exact: true })).toBeVisible();
  await expect(page.getByText("DT").first()).toBeVisible();
});
