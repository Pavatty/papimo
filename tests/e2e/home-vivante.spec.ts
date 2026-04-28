import { expect, test } from "@playwright/test";

test.describe("Home Phase 4A", () => {
  test("hero search bar visible", async ({ page }) => {
    await page.goto("/fr");
    const searchBar = page.locator("input[placeholder*='Ville']").first();
    await expect(searchBar).toBeVisible();
  });

  test("trust signals + quick filters + pourquoi papimo present", async ({
    page,
  }) => {
    await page.goto("/fr");
    await expect(
      page.locator("text=/recherches populaires/i").first(),
    ).toBeVisible();
    await expect(page.locator("text=/pourquoi papimo/i").first()).toBeVisible();
  });

  test("sticky CTA appears after scroll", async ({ page }) => {
    await page.goto("/fr");
    await page.evaluate(() => window.scrollTo(0, 800));
    await page.waitForTimeout(500);
    const cta = page.locator("a[aria-label*='Publier' i]").first();
    await expect(cta).toBeVisible();
  });

  test("at least 4 listings visible on home", async ({ page }) => {
    await page.goto("/fr");
    const listings = page.locator("a[href*='/annonce/']");
    const count = await listings.count();
    expect(count).toBeGreaterThanOrEqual(4);
  });
});
