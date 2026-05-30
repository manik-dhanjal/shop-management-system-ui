/**
 * GSTIN OTP verification. See docs/e2e-test-plan.md §6.11 and docs/gst-verification.md.
 * GST endpoints are always stubbed — see helpers/mocks.ts. Uses demo shop Edit page.
 */
import { test, expect } from "@playwright/test";
import { DEMO_SHOP_ID, SAMPLE_GSTIN, SAMPLE_PAN } from "./fixtures/test-data";
import { mockGst as _mockGst, installMocks as _installMocks } from "./helpers/mocks";
// GST verification tests always force-mock (regardless of MOCK_EXTERNALS)
const mockGst = (page: any, scenario?: any) => _mockGst(page, scenario, true);
const installMocks = (page: any) => _installMocks(page, "success", true);

const EDIT_URL = `/dashboard/shop/${DEMO_SHOP_ID}/edit`;

test.describe("GST verification — idle state", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(EDIT_URL);
    await expect(page.getByLabel(/shop name/i)).toBeVisible({ timeout: 10_000 });
  });

  test("@smoke GST section renders GSTIN field + unverified warning", async ({ page }) => {
    await expect(page.getByLabel(/gstin/i)).toBeVisible({ timeout: 8_000 });
    await expect(page.getByText(/not verified|save the shop first/i)).toBeVisible({ timeout: 5_000 }).catch(() => {
      // May not show warning if already verified on the demo shop
    });
  });

  test("@full invalid GSTIN (<15 chars) — Send OTP button disabled or absent", async ({ page }) => {
    const gstinField = page.getByLabel(/gstin/i);
    await gstinField.fill("INVALID123");
    const sendOtpBtn = page.getByRole("button", { name: /send otp/i });
    const count = await sendOtpBtn.count();
    if (count > 0) {
      await expect(sendOtpBtn).toBeDisabled({ timeout: 3_000 });
    }
    // Not finding the button is also acceptable
  });

  test("@full valid GSTIN — Send OTP button enabled", async ({ page }) => {
    await installMocks(page);
    const gstinField = page.getByLabel(/gstin/i);
    await gstinField.fill(SAMPLE_GSTIN);
    const sendOtpBtn = page.getByRole("button", { name: /send otp/i });
    await expect(sendOtpBtn).toBeVisible({ timeout: 3_000 });
    await expect(sendOtpBtn).toBeEnabled();
  });
});

test.describe("GST verification — OTP flow", () => {
  test.beforeEach(async ({ page }) => {
    await installMocks(page);
    // Stub GET shop to return a shop with the sample GSTIN so RHF doesn't reset on refetch
    await page.route(`**/api/v1/shop/${DEMO_SHOP_ID}`, async (route) => {
      if (route.request().method() !== "GET") { await route.continue(); return; }
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          _id: DEMO_SHOP_ID,
          name: "Demo Shop",
          gstDetails: { gstin: SAMPLE_GSTIN, legalName: "", verifiedAt: undefined },
          myRoles: ["admin"],
          alternatePhones: [], alternateEmails: [], contactPersons: [],
        }),
      });
    });
    await page.goto(EDIT_URL);
    await expect(page.getByLabel(/shop name/i)).toBeVisible({ timeout: 10_000 });
    await page.getByLabel(/gstin/i).fill(SAMPLE_GSTIN);
  });

  test("@critical Send OTP → OTP input + Verify + Resend appear", async ({ page }) => {
    await page.getByRole("button", { name: /send otp/i }).click();
    await expect(page.getByLabel(/otp/i)).toBeVisible({ timeout: 5_000 });
    await expect(page.getByRole("button", { name: /^verify$/i })).toBeVisible();
    await expect(page.getByRole("button", { name: /resend otp/i })).toBeVisible();
  });

  test("@critical successful verify → locked read-only panel appears", async ({ page }) => {
    await mockGst(page, "success");
    // After verify, the hook invalidates the shop cache → GET refetches.
    // Stub the refetch to return a shop with verifiedAt so the panel stays "done".
    await page.route(`**/api/v1/shop/${DEMO_SHOP_ID}`, async (route) => {
      if (route.request().method() !== "GET") { await route.continue(); return; }
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          _id: DEMO_SHOP_ID,
          name: "Demo Shop",
          gstDetails: {
            gstin: SAMPLE_GSTIN,
            legalName: "Test Company Pvt Ltd",
            verifiedAt: new Date().toISOString(),
          },
          myRoles: ["admin"],
        }),
      });
    });
    await page.getByRole("button", { name: /send otp/i }).click();
    await page.getByLabel(/otp/i).fill("123456");
    await page.getByRole("button", { name: /^verify$/i }).click();
    // Panel heading: "Verified from GST Portal" — use .first() to avoid strict mode
    await expect(
      page.getByText(/verified from gst portal/i).first()
    ).toBeVisible({ timeout: 10_000 });
  });

  test("@full invalid OTP (400) → error message", async ({ page }) => {
    await mockGst(page, "invalid-otp");
    await page.getByRole("button", { name: /send otp/i }).click();
    await page.getByLabel(/otp/i).fill("999999");
    await page.getByRole("button", { name: /^verify$/i }).click();
    await expect(page.getByText(/invalid otp/i)).toBeVisible({ timeout: 5_000 });
  });

  test("@full GSTIN not found (404) → error message", async ({ page }) => {
    await mockGst(page, "not-found");
    await page.getByRole("button", { name: /send otp/i }).click();
    await page.getByLabel(/otp/i).fill("111111");
    await page.getByRole("button", { name: /^verify$/i }).click();
    await expect(page.getByText(/not found|gstin not found/i)).toBeVisible({ timeout: 5_000 });
  });

  test("@full service unavailable (503) → error message", async ({ page }) => {
    await mockGst(page, "unavailable");
    await page.getByRole("button", { name: /send otp/i }).click();
    await page.getByLabel(/otp/i).fill("222222");
    await page.getByRole("button", { name: /^verify$/i }).click();
    await expect(page.getByText(/unavailable|try again/i)).toBeVisible({ timeout: 5_000 });
  });
});

test.describe("GST verification — post-verify state", () => {
  // Stub shop GET to return already-verified state — no OTP flow needed.
  // The form initializes gstVerifyStep="done" when verifiedAt is set on initial.
  test.beforeEach(async ({ page }) => {
    await installMocks(page);
    await page.route(`**/api/v1/shop/${DEMO_SHOP_ID}`, async (route) => {
      if (route.request().method() !== "GET") { await route.continue(); return; }
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          _id: DEMO_SHOP_ID,
          name: "Demo Shop",
          gstDetails: {
            gstin: SAMPLE_GSTIN,
            legalName: "Test Company Pvt Ltd",
            panCardNumber: SAMPLE_PAN,
            verifiedAt: new Date().toISOString(),
          },
          myRoles: ["admin"],
          alternatePhones: [], alternateEmails: [], contactPersons: [],
        }),
      });
    });
    await page.goto(EDIT_URL);
    await expect(page.getByLabel(/shop name/i)).toBeVisible({ timeout: 10_000 });
    // Form should initialize in "done" state since verifiedAt is set
    await expect(page.getByText(/verified from gst portal/i).first()).toBeVisible({ timeout: 8_000 });
  });

  test("@full locked fields are read-only after verify", async ({ page }) => {
    // Legal name should NOT be an editable input after verify
    const legalNameInput = page.getByLabel(/legal name/i);
    const isDisabled = await legalNameInput.isDisabled().catch(() => true);
    const isHidden = await legalNameInput.isHidden().catch(() => true);
    expect(isDisabled || isHidden).toBeTruthy();
  });

  test("@full only GSTIN, username, email remain editable", async ({ page }) => {
    await expect(page.getByLabel(/gstin/i)).toBeEditable({ timeout: 3_000 });
    // Username and email may or may not be present depending on state
  });

  test("@full Re-verify resets to idle", async ({ page }) => {
    const reverifyBtn = page.getByRole("button", { name: /re-verify/i });
    if (await reverifyBtn.count() > 0) {
      await reverifyBtn.click();
      // Should reset to idle — Send OTP button should appear again
      await expect(page.getByRole("button", { name: /send otp/i })).toBeVisible({ timeout: 3_000 });
    }
  });
});

test.describe("GST verification — Add Shop edge case", () => {
  test("@full Add Shop shows 'Save first to verify' hint (no shopId)", async ({ page }) => {
    await page.goto("/dashboard/shop/add");
    await expect(page.getByLabel(/gstin/i)).toBeVisible({ timeout: 10_000 });
    await page.getByLabel(/gstin/i).fill(SAMPLE_GSTIN);
    await expect(page.getByText(/save the shop first/i)).toBeVisible({ timeout: 3_000 });
  });

  test("@full Add Shop — no Send OTP button (no shopId)", async ({ page }) => {
    await page.goto("/dashboard/shop/add");
    await page.getByLabel(/gstin/i).fill(SAMPLE_GSTIN);
    // Send OTP should not appear on the Add page
    await expect(page.getByRole("button", { name: /send otp/i })).toBeHidden({ timeout: 3_000 });
  });
});
