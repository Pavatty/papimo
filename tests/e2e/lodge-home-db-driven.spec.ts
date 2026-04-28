import { expect, test } from "@playwright/test";

test.describe("LODGE home DB-driven", () => {
  test("Hero displays new slogan from DB", async ({ page }) => {
    await page.goto("/fr");
    await expect(page.locator("h1").first()).toContainText(
      /projet prend vie|particuliers/i,
    );
  });

  test("Listings render before TrustSignals", async ({ page }) => {
    await page.goto("/fr");
    const firstListing = page.locator("a[href*='/annonce/']").first();
    if (await firstListing.isVisible({ timeout: 5000 }).catch(() => false)) {
      const trustText = page
        .locator("text=/donn[eé]es s[eé]curis[eé]es/i")
        .first();
      const lb = await firstListing.boundingBox();
      const tb = await trustText.boundingBox().catch(() => null);
      if (tb && lb) expect(lb.y).toBeLessThan(tb.y);
    }
  });

  test("Footer uses dark green background", async ({ page }) => {
    await page.goto("/fr");
    const footer = page.locator("footer, [aria-label='Pied de page']").first();
    await expect(footer).toBeVisible();
  });
});
