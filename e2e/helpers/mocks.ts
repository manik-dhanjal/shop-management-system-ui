/**
 * External-service route stubs (GST OTP + Cloudinary).
 *
 * Driven by MOCK_EXTERNALS (default ON in CI, OFF locally — see test-data.ts).
 * When off, requests pass through to the real sandbox APIs.
 *
 * The GST stubs mirror the patterns already proven in shop.spec.ts:
 *   **\/gst/request-otp  and  **\/gst/verify
 */
import { Page } from "@playwright/test";
import { MOCK_EXTERNALS, SAMPLE_GSTIN, SAMPLE_PAN } from "../fixtures/test-data";

export type GstScenario =
  | "success"
  | "invalid-otp"
  | "not-found"
  | "unavailable";

const TAXPAYER = {
  gstin: SAMPLE_GSTIN,
  legalName: "Test Company Pvt Ltd",
  tradeName: "Test Trade",
  panCardNumber: SAMPLE_PAN,
  status: "Active",
  constitutionOfBusiness: "Private Limited Company",
  state: "Maharashtra",
  registrationDate: "2018-04-01",
  einvoiceApplicable: true,
  natureOfBusiness: ["Wholesale Business", "Retail Business"],
  verifiedAt: new Date().toISOString(),
};

/** Stub the GST OTP request + verify endpoints for one scenario.
 *  Pass force=true to install stubs regardless of MOCK_EXTERNALS (for GST UI flow tests). */
export async function mockGst(page: Page, scenario: GstScenario = "success", force = false) {
  if (!MOCK_EXTERNALS && !force) return;

  await page.route("**/gst/request-otp", (r) => r.fulfill({ status: 204, body: "" }));

  await page.route("**/gst/verify", (r) => {
    switch (scenario) {
      case "success":
        return r.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify(TAXPAYER) });
      case "invalid-otp":
        return r.fulfill({ status: 400, contentType: "application/json", body: JSON.stringify({ message: "Invalid OTP. Please check and try again." }) });
      case "not-found":
        return r.fulfill({ status: 404, contentType: "application/json", body: JSON.stringify({ message: "GSTIN not found on the GST portal." }) });
      case "unavailable":
        return r.fulfill({ status: 503, contentType: "application/json", body: JSON.stringify({ message: "Verification service unavailable — try again later." }) });
    }
  });
}

/** Stub Cloudinary uploads so image pickers resolve deterministically. */
export async function mockCloudinary(page: Page) {
  if (!MOCK_EXTERNALS) return;
  await page.route("**/api.cloudinary.com/**", (r) =>
    r.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        secure_url: "https://res.cloudinary.com/demo/image/upload/e2e.png",
        public_id: "e2e/mock",
      }),
    }),
  );
}

/** Convenience: install all external mocks.
 *  force=true installs regardless of MOCK_EXTERNALS. */
export async function installMocks(page: Page, gst: GstScenario = "success", force = false) {
  await mockGst(page, gst, force);
  await mockCloudinary(page);
}
