import { expect, test } from "@playwright/test";

test.describe("Listing photos", () => {
  test("first listing has at least 1 photo", async ({ page }) => {
    await page.goto("/fr/search");
    const card = page.locator("a[href*='/annonce/']").first();
    if (await card.isVisible({ timeout: 10000 }).catch(() => false)) {
      const href = await card.getAttribute("href");
      await page.goto(href!);
      await page.waitForLoadState("networkidle");
      const imgCount = await page.locator("img").count();
      expect(imgCount).toBeGreaterThan(0);
    }
  });
});
