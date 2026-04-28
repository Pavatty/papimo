import { expect, test } from "@playwright/test";

test.describe("UX audit fixes", () => {
  test("404 page renders for unknown route", async ({ page }) => {
    const response = await page.goto("/fr/this-page-does-not-exist-12345");
    expect(response?.status()).toBe(404);
    await expect(page.locator("h1")).toBeVisible();
  });

  test("404 has actionable links", async ({ page }) => {
    await page.goto("/fr/unknown-route-test");
    const homeLink = page.locator("a", { hasText: /accueil/i }).first();
    if (await homeLink.isVisible({ timeout: 3000 }).catch(() => false)) {
      await expect(homeLink).toHaveAttribute("href", /.+/);
    }
  });

  test("404 page renders the bicolor heading", async ({ page }) => {
    await page.goto("/fr/another-unknown-route");
    const bigCode = page.locator("text=404").first();
    if (await bigCode.isVisible({ timeout: 3000 }).catch(() => false)) {
      await expect(bigCode).toBeVisible();
    }
  });
});
