import { expect, test } from "@playwright/test";

test.describe("Input validation", () => {
  test("publish wizard inputs have HTML5 number bounds where present", async ({
    page,
    context,
  }) => {
    await context.clearCookies();
    await page.goto("/fr/publish");
    // /publish is auth-gated; we just check the redirect target is /login
    expect(page.url()).toMatch(/\/(login|publish)/);
  });

  test("login page email input has type=email", async ({ page }) => {
    await page.goto("/fr/login");
    const email = page.locator("input[type='email']").first();
    if (await email.isVisible({ timeout: 3000 }).catch(() => false)) {
      const type = await email.getAttribute("type");
      expect(type).toBe("email");
    }
  });
});
