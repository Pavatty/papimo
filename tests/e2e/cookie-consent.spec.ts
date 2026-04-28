import { expect, test } from "@playwright/test";

test.describe("Cookie consent banner", () => {
  test("clicking Accepter does not crash the page", async ({ page }) => {
    const errorEvents: string[] = [];
    page.on("pageerror", (e) => errorEvents.push(e.message));

    await page.goto("/fr");
    await expect(page.locator("h1").first()).toBeVisible();

    const acceptBtn = page.getByRole("button", { name: /accepter/i }).first();
    if (await acceptBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
      await acceptBtn.click();
      await page.waitForTimeout(1000);

      expect(errorEvents).toEqual([]);
      await expect(page.locator("h1").first()).toBeVisible();
      await expect(page.locator("h1").first()).toContainText(/immobilier/i);
      await expect(page.locator('[role="dialog"]')).toHaveCount(0);
    }
  });

  test("clicking Refuser does not crash either", async ({ page, context }) => {
    await context.clearCookies();
    const errors: string[] = [];
    page.on("pageerror", (e) => errors.push(e.message));

    await page.goto("/fr");

    const refuseBtn = page.getByRole("button", { name: /refuser/i }).first();
    if (await refuseBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
      await refuseBtn.click();
      await page.waitForTimeout(1000);

      expect(errors).toEqual([]);
      await expect(page.locator("h1").first()).toBeVisible();
      await expect(page.locator('[role="dialog"]')).toHaveCount(0);
    }
  });

  test("clicking Personnaliser then Personnaliser again does not crash", async ({
    page,
    context,
  }) => {
    await context.clearCookies();
    const errors: string[] = [];
    page.on("pageerror", (e) => errors.push(e.message));

    await page.goto("/fr");

    const customBtn = page
      .getByRole("button", { name: /personnaliser/i })
      .first();
    if (await customBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
      await customBtn.click();
      await page.waitForTimeout(300);
      await customBtn.click();
      await page.waitForTimeout(1000);

      expect(errors).toEqual([]);
      await expect(page.locator("h1").first()).toBeVisible();
    }
  });
});
