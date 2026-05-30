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

  test("shows 'Save first to verify' hint when no shopId", async ({
    page,
  }) => {
    // On Add Shop there's no shopId, so the OTP verify button is replaced
    // by a hint telling the user to save first
    const gstinField = page.getByLabel(/gstin/i);
    await gstinField.fill("27AABCU9603R1ZX");

    await expect(
      page.getByText(/save the shop first/i),
    ).toBeVisible({ timeout: 3_000 });
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

  test("shows 'Send OTP to verify' button for a valid GSTIN", async ({
    page,
  }) => {
    const gstinField = page.getByLabel(/gstin/i);
    await gstinField.fill("27AABCU9603R1ZX");

    const sendOtpBtn = page.getByRole("button", { name: /send otp/i });
    await expect(sendOtpBtn).toBeVisible({ timeout: 3_000 });
    await expect(sendOtpBtn).toBeEnabled();
  });

  test("disables 'Send OTP' when GSTIN is invalid", async ({ page }) => {
    const gstinField = page.getByLabel(/gstin/i);
    await gstinField.fill("INVALID");

    const sendOtpBtn = page.getByRole("button", { name: /send otp/i });
    // Button should either not exist or be disabled
    const count = await sendOtpBtn.count();
    if (count > 0) {
      await expect(sendOtpBtn).toBeDisabled();
    }
    // Not finding the button is also acceptable
  });

  test("shows OTP input after clicking Send OTP", async ({ page }) => {
    const gstinField = page.getByLabel(/gstin/i);
    await gstinField.fill("27AABCU9603R1ZX");

    // Intercept the request-otp API call so the test doesn't hit the real portal
    await page.route("**/gst/request-otp", async (route) => {
      await route.fulfill({ status: 204, body: "" });
    });

    await page.getByRole("button", { name: /send otp/i }).click();

    await expect(page.getByLabel(/otp/i)).toBeVisible({ timeout: 5_000 });
    await expect(page.getByRole("button", { name: /^verify$/i })).toBeVisible();
    await expect(
      page.getByRole("button", { name: /resend otp/i }),
    ).toBeVisible();
  });

  test("shows error alert when verify OTP fails", async ({ page }) => {
    const gstinField = page.getByLabel(/gstin/i);
    await gstinField.fill("27AABCU9603R1ZX");

    await page.route("**/gst/request-otp", (r) =>
      r.fulfill({ status: 204, body: "" }),
    );
    await page.route("**/gst/verify", (r) =>
      r.fulfill({
        status: 400,
        contentType: "application/json",
        body: JSON.stringify({ message: "Invalid OTP. Please check and try again." }),
      }),
    );

    await page.getByRole("button", { name: /send otp/i }).click();
    await page.getByLabel(/otp/i).fill("999999");
    await page.getByRole("button", { name: /^verify$/i }).click();

    await expect(
      page.getByText(/invalid otp/i),
    ).toBeVisible({ timeout: 5_000 });
  });

  test("shows verified panel after successful OTP verify", async ({ page }) => {
    const gstinField = page.getByLabel(/gstin/i);
    await gstinField.fill("27AABCU9603R1ZX");

    await page.route("**/gst/request-otp", (r) =>
      r.fulfill({ status: 204, body: "" }),
    );
    await page.route("**/gst/verify", (r) =>
      r.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          gstin: "27AABCU9603R1ZX",
          legalName: "Test Company Pvt Ltd",
          tradeName: "Test Trade",
          panCardNumber: "AABCU9603R",
          status: "Active",
          constitutionOfBusiness: "Private Limited Company",
          state: "Maharashtra",
          verifiedAt: new Date().toISOString(),
        }),
      }),
    );

    await page.getByRole("button", { name: /send otp/i }).click();
    await page.getByLabel(/otp/i).fill("575757");
    await page.getByRole("button", { name: /^verify$/i }).click();

    // The source fix (verifiedGstDetails state) means the panel now shows immediately
    // from the mutation result — no need to stub the shop GET refetch.
    await expect(
      page.getByText(/verified from gst portal/i).first(),
    ).toBeVisible({ timeout: 8_000 });
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
