import { expect, test } from "@playwright/test";

test("la home charge avec le titre papimo", async ({ page }) => {
  await page.goto("/fr");
  await expect(page).toHaveTitle(/papimo/i);
});
