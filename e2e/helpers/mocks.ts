/**
 * External-service route stubs (Cloudinary uploads).
 *
 * Driven by MOCK_EXTERNALS (default ON in CI, OFF locally — see test-data.ts).
 * When off, requests pass through to the real sandbox APIs.
 */
import { Page } from "@playwright/test";
import { MOCK_EXTERNALS } from "../fixtures/test-data";

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

/** Convenience: install all external mocks. */
export async function installMocks(page: Page) {
  await mockCloudinary(page);
}
