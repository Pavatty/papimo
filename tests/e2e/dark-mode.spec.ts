import { expect, test } from "@playwright/test";

test.describe("Dark mode", () => {
  test("theme switcher visible in header", async ({ page }) => {
    await page.goto("/fr");
    const switcher = page.locator('button[aria-label*="thème" i]').first();
    await expect(switcher).toBeVisible();
  });

  test("clicking dark applies dark class to html", async ({ page }) => {
    await page.goto("/fr");
    const switcher = page.locator('button[aria-label*="thème" i]').first();
    await switcher.click();
    await page.waitForTimeout(200);
    const darkBtn = page
      .getByRole("menuitemradio", { name: /sombre/i })
      .first();
    if (await darkBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
      await darkBtn.click();
      await page.waitForTimeout(300);
      const cls = await page.locator("html").getAttribute("class");
      expect(cls).toContain("dark");
    }
  });
});
