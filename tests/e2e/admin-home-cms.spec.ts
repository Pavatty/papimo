import { expect, test } from "@playwright/test";

test.describe("Admin home CMS", () => {
  test("admin home page is auth-gated", async ({ page, context }) => {
    await context.clearCookies();
    await page.goto("/fr/admin/home");
    expect(page.url()).not.toMatch(/\/admin\/home/);
  });
});
