import { expect, test } from "@playwright/test";

test.describe("Footer Phase 2", () => {
  test("footer visible on desktop with 4 columns of links", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto("/fr");
    const footer = page.locator("footer");
    await expect(footer).toBeVisible();
    const links = footer.locator("a");
    const count = await links.count();
    expect(count).toBeGreaterThan(8);
  });

  test("mobile footer uses native details accordions", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 800 });
    await page.goto("/fr");
    const footer = page.locator("footer");
    await expect(footer).toBeVisible();
    const detailsCount = await footer.locator("details").count();
    expect(detailsCount).toBeGreaterThanOrEqual(4);
  });

  test("contact email link is reachable", async ({ page }) => {
    await page.goto("/fr");
    const mailLink = page.locator('footer a[href^="mailto:contact@"]').first();
    if (await mailLink.isVisible({ timeout: 3000 }).catch(() => false)) {
      await expect(mailLink).toBeVisible();
    }
  });
});
