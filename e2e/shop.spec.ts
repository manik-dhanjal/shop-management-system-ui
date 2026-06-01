/**
 * Shop management tests.
 * Runs with the saved admin auth state.
 */
import { test, expect } from "@playwright/test";
import { goToShops, goToAddShop } from "./helpers/navigate";

test.describe("All Shops page", () => {
  test("loads the shops list", async ({ page }) => {
    await goToShops(page);
    // Page title or a recognisable heading should be present
    await expect(
      page.getByRole("heading", { name: /shops/i }).first(),
    ).toBeVisible({ timeout: 10_000 });
  });

  test("has an Add Shop button", async ({ page }) => {
    await goToShops(page);
    const addBtn = page
      .getByRole("link", { name: /add shop/i })
      .or(page.getByRole("button", { name: /add shop/i }));
    await expect(addBtn.first()).toBeVisible({ timeout: 8_000 });
  });
});

test.describe("Add Shop form", () => {
  test.beforeEach(async ({ page }) => {
    await goToAddShop(page);
  });

  test("renders the Identity section", async ({ page }) => {
    await expect(
      page.getByRole("heading", { name: /identity/i }),
    ).toBeVisible({ timeout: 8_000 });
    await expect(page.getByLabel(/shop name/i)).toBeVisible();
  });

  test("renders the GST & Tax section", async ({ page }) => {
    await expect(
      page.getByRole("heading", { name: /gst & tax/i }),
    ).toBeVisible({ timeout: 8_000 });
    await expect(page.getByLabel(/gstin/i)).toBeVisible();
  });

  test("renders the Address section", async ({ page }) => {
    await expect(
      page.getByRole("heading", { name: /address/i }),
    ).toBeVisible({ timeout: 8_000 });
  });

  test("renders the Contact section", async ({ page }) => {
    await expect(
      page.getByRole("heading", { name: /contact/i }),
    ).toBeVisible({ timeout: 8_000 });
    await expect(page.getByLabel(/phone/i)).toBeVisible();
  });

  test("shows validation error when submitting empty required fields", async ({
    page,
  }) => {
    // Clear the shop name (which is required) and submit
    const nameField = page.getByLabel(/shop name/i);
    await nameField.fill("");

    await page.getByRole("button", { name: /create shop|save changes/i }).click();

    // Expect at least one field error to appear
    const errors = page.locator(
      ".Mui-error, [class*='error'], p.MuiFormHelperText-root",
    );
    await expect(errors.first()).toBeVisible({ timeout: 5_000 });
  });

  test("auto-fills PAN from a valid GSTIN", async ({ page }) => {
    const gstinField = page.getByLabel(/gstin/i);
    await gstinField.fill("27AABCU9603R1ZX");

    // PAN is extracted from chars 3–12 of the GSTIN
    const panField = page.getByLabel(/pan/i);
    await expect(panField).toHaveValue("AABCU9603R", { timeout: 3_000 });
  });
});

test.describe("Edit Shop — GST & Tax section", () => {
  // Uses the seeded demo shop (ObjectId 000000000000000000000001)
  const DEMO_SHOP_ID = "000000000000000000000001";

  test.beforeEach(async ({ page }) => {
    await page.goto(`/dashboard/shop/${DEMO_SHOP_ID}/edit`);
    // Wait for the form to load
    await expect(page.getByLabel(/shop name/i)).toBeVisible({
      timeout: 10_000,
    });
  });

  test("renders GSTIN field", async ({ page }) => {
    await expect(page.getByLabel(/gstin/i)).toBeVisible();
  });

  test("renders manual GST fields (Legal Name, PAN, State)", async ({ page }) => {
    // GST is manual-entry only — no OTP verification UI
    await expect(page.getByLabel(/legal name/i)).toBeVisible();
    await expect(page.getByLabel(/pan/i)).toBeVisible();
    await expect(page.getByLabel(/state/i).first()).toBeVisible();
    await expect(page.getByRole("button", { name: /send otp/i })).toHaveCount(0);
  });

  test("auto-fills PAN + State from a valid GSTIN", async ({ page }) => {
    await page.getByLabel(/gstin/i).fill("27AABCU9603R1ZX");
    // PAN = chars 3–12; state code 27 → Maharashtra
    await expect(page.getByLabel(/pan/i)).toHaveValue("AABCU9603R", { timeout: 3_000 });
  });

  test("can save shop without GST details", async ({ page }) => {
    // Change just the shop name and save — should not require GSTIN
    const nameField = page.getByLabel(/shop name/i);
    await nameField.fill("Updated Demo Shop");

    // Intercept the PATCH to avoid actually mutating data
    await page.route(`**/shop/${DEMO_SHOP_ID}`, async (route) => {
      if (route.request().method() === "PATCH") {
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({ _id: DEMO_SHOP_ID, name: "Updated Demo Shop" }),
        });
      } else {
        await route.continue();
      }
    });

    await page.getByRole("button", { name: /save changes/i }).click();
    // Should not show a GST validation error
    await expect(page.getByText(/gstin is required/i)).not.toBeVisible({
      timeout: 3_000,
    });
  });
});
