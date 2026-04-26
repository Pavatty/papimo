import { expect, test } from "@playwright/test";

test("home has keyboard skip-link and accessible tree", async ({ page }) => {
  await page.goto("/fr");
  await page.keyboard.press("Tab");
  await expect(page.getByText("Aller au contenu principal")).toBeVisible();
  await expect(page.getByRole("banner")).toBeVisible();
  await expect(page.getByRole("contentinfo")).toBeVisible();
});

test("cookie banner buttons are keyboard focusable", async ({ page }) => {
  await page.goto("/fr");
  await page
    .getByRole("button", { name: /Personnaliser|Customize|تخصيص/ })
    .focus();
  await expect(
    page.getByRole("button", { name: /Personnaliser|Customize|تخصيص/ }),
  ).toBeFocused();
});
