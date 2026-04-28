import { expect, test } from "@playwright/test";

test.describe("Admin access", () => {
  test("non-authenticated visitor redirected from /admin to /login", async ({
    page,
    context,
  }) => {
    await context.clearCookies();
    await page.goto("/fr/admin");
    expect(page.url()).toMatch(/\/fr\/login/);
  });

  test("non-authenticated visitor sees no admin link on home", async ({
    page,
    context,
  }) => {
    await context.clearCookies();
    await page.goto("/fr");
    const adminLink = page.locator("a", {
      hasText: /tableau de bord admin/i,
    });
    expect(await adminLink.count()).toBe(0);
  });

  test("non-authenticated visitor redirected from /admin/feature-flags", async ({
    page,
    context,
  }) => {
    await context.clearCookies();
    await page.goto("/fr/admin/feature-flags");
    expect(page.url()).not.toMatch(/\/admin\/feature-flags/);
  });
});
