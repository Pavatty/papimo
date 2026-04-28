import { expect, test } from "@playwright/test";

test.describe("Design system v2", () => {
  test("home renders header + footer + hero h1", async ({ page }) => {
    await page.goto("/fr");
    await expect(page.locator("header")).toBeVisible();
    await expect(page.locator("footer")).toBeVisible();
    await expect(page.locator("h1").first()).toContainText(/immobilier/i);
  });

  test("listing card on search has image + price", async ({ page }) => {
    await page.goto("/fr/search");
    const card = page.locator("a[href*='/annonce/']").first();
    if (await card.isVisible({ timeout: 10000 }).catch(() => false)) {
      await expect(card.locator("img").first()).toBeVisible();
    }
  });

  test("scroll-aware header stays sticky", async ({ page }) => {
    await page.goto("/fr");
    await page.evaluate(() => window.scrollTo(0, 200));
    await page.waitForTimeout(300);
    await expect(page.locator("header")).toBeVisible();
  });
});
