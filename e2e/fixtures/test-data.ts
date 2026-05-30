/**
 * Shared test-data constants and unique-name builders.
 *
 * Every entity a test creates MUST be named with `uniqueName()` so that:
 *  - parallel/older runs never collide on the shared dev/stage DB, and
 *  - stragglers from a crashed run are identifiable + sweepable (prefix `E2E-`).
 *
 * See docs/e2e-test-plan.md §7 (Data lifecycle & cleanup).
 */

/** One id per process — stable across a worker's specs. */
export const RUN_ID = `${Date.now().toString(36)}${Math.random()
  .toString(36)
  .slice(2, 6)}`;

export const E2E_PREFIX = "E2E";

/** `E2E-<runId>-<label>-<n>` — collision-proof, greppable for cleanup. */
let counter = 0;
export function uniqueName(label = "item"): string {
  counter += 1;
  return `${E2E_PREFIX}-${RUN_ID}-${label}-${counter}`;
}

/** Unique +91 mobile (starts 6–9, 10 digits) for customer/supplier phone. */
export function uniquePhone(): string {
  const n = (6 + (counter++ % 4)).toString();
  const rest = Math.floor(100000000 + Math.random() * 899999999).toString();
  return `+91${n}${rest.slice(0, 9)}`;
}

export function uniqueEmail(label = "user"): string {
  return `e2e-${label}-${RUN_ID}-${counter++}@sms.com`.toLowerCase();
}

/** Seeded references — read-only, never delete. */
export const DEMO_SHOP_ID = "000000000000000000000001";

/** Sample valid GST/PAN that satisfy the backend regexes (for mocked flows). */
export const SAMPLE_GSTIN = "27AABCU9603R1ZX";
export const SAMPLE_PAN = "AABCU9603R"; // == SAMPLE_GSTIN[2..12]

/** Credentials (env-overridable). */
export const ADMIN = {
  email: process.env.E2E_ADMIN_EMAIL ?? "admin@sms.com",
  password: process.env.E2E_ADMIN_PASSWORD ?? "Admin@123",
};
export const TEST_PASSWORD = process.env.E2E_TEST_PASSWORD ?? "E2e@12345";
export const MANAGER = {
  email: process.env.E2E_MANAGER_EMAIL ?? "e2e-manager@sms.com",
  password: TEST_PASSWORD,
  firstName: "E2E",
  lastName: "Manager",
};
export const EMPLOYEE = {
  email: process.env.E2E_EMPLOYEE_EMAIL ?? "e2e-employee@sms.com",
  password: TEST_PASSWORD,
  firstName: "E2E",
  lastName: "Employee",
};

export const API_URL = process.env.API_URL ?? "http://localhost:3001";
/** Mock externals (GST/Cloudinary) — default ON in CI, OFF locally. */
export const MOCK_EXTERNALS =
  process.env.MOCK_EXTERNALS != null
    ? process.env.MOCK_EXTERNALS === "1"
    : !!process.env.CI;
