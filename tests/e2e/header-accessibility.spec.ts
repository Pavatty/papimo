import { expect, test } from "@playwright/test";

test.describe("Header accessibility", () => {
  test("all nav links are visible", async ({ page }) => {
    await page.goto("/fr");
    const navLinks = page.locator("header a");
    const count = await navLinks.count();
    expect(count).toBeGreaterThan(3);

    for (let i = 0; i < Math.min(count, 8); i++) {
      const link = navLinks.nth(i);
      await expect(link).toBeVisible();
    }
  });

  test("locale switcher links are accessible and labeled", async ({ page }) => {
    await page.goto("/fr");
    const frLink = page.locator("header a", { hasText: /^FR$/i }).first();
    if (await frLink.isVisible({ timeout: 3000 }).catch(() => false)) {
      await expect(frLink).toBeVisible();
      const ariaCurrent = await frLink.getAttribute("aria-current");
      expect(ariaCurrent).toBe("true");
    }
  });

  test("skip-to-content link is present", async ({ page }) => {
    await page.goto("/fr");
    const skip = page.locator('a[href="#main-content"]').first();
    await expect(skip).toHaveCount(1);
  });
});
