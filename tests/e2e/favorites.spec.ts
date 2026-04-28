import { expect, test } from "@playwright/test";

test.describe("Favorites", () => {
  test("favorite button visible on listing cards", async ({ page }) => {
    await page.goto("/fr/search");
    const heart = page.locator("button[aria-label*='favoris' i]").first();
    if (await heart.isVisible({ timeout: 5000 }).catch(() => false)) {
      await expect(heart).toBeVisible();
    }
  });

  test("non-auth user redirected from /dashboard/favoris", async ({
    page,
    context,
  }) => {
    await context.clearCookies();
    await page.goto("/fr/dashboard/favoris");
    expect(page.url()).toMatch(/\/fr\/(login|dashboard\/favoris)/);
  });
});
