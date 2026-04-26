import { expect, test } from "@playwright/test";

test("dashboard redirects to login when unauthenticated", async ({ page }) => {
  await page.goto("/fr/dashboard");
  await expect(page).toHaveURL(/\/fr\/login/);
});
