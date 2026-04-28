import { expect, test } from "@playwright/test";

test.describe("Search filters DB-driven", () => {
  test("page loads with header h1", async ({ page }) => {
    await page.goto("/fr/search");
    await expect(page.locator("h1, h2").first()).toBeVisible();
  });

  test("URL params sync with type=apartment", async ({ page }) => {
    await page.goto("/fr/search?type=apartment");
    expect(page.url()).toContain("type=apartment");
  });

  test("transaction radios render at least one option", async ({ page }) => {
    await page.goto("/fr/search");
    const radios = page.locator('input[type="radio"][name="transaction"]');
    const count = await radios.count();
    expect(count).toBeGreaterThanOrEqual(1);
  });
});
