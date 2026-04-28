import { expect, test } from "@playwright/test";

test.describe("Admin auth gate", () => {
  test("non-authenticated user redirected away from /fr/admin", async ({
    page,
    context,
  }) => {
    await context.clearCookies();
    await page.goto("/fr/admin");
    expect(page.url()).not.toMatch(/\/fr\/admin(\?|$|\/)/);
  });

  test("non-authenticated user redirected away from /fr/admin/feature-flags", async ({
    page,
    context,
  }) => {
    await context.clearCookies();
    await page.goto("/fr/admin/feature-flags");
    expect(page.url()).not.toMatch(/\/admin\/feature-flags/);
  });

  test("non-authenticated user redirected away from /fr/admin/marque", async ({
    page,
    context,
  }) => {
    await context.clearCookies();
    await page.goto("/fr/admin/marque");
    expect(page.url()).not.toMatch(/\/admin\/marque/);
  });

  test("non-authenticated user redirected away from /fr/admin/taxonomies/transaction-types", async ({
    page,
    context,
  }) => {
    await context.clearCookies();
    await page.goto("/fr/admin/taxonomies/transaction-types");
    expect(page.url()).not.toMatch(/\/admin\/taxonomies/);
  });
});
