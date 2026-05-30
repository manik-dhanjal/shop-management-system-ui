/**
 * Form-interaction helpers for the MUI + react-hook-form stack used across the
 * shop/customer/supplier/order forms.
 *
 * These are thin, intentionally generic wrappers; flesh out selectors as the
 * specs are implemented. Prefer role/label queries over CSS where possible.
 */
import { Page, expect } from "@playwright/test";

/** Fill a labelled text/number field. */
export async function fillField(page: Page, label: RegExp | string, value: string) {
  await page.getByLabel(label).fill(value);
}

/** Pick an option from a MUI <Select> rendered by SelectFieldControlled. */
export async function selectOption(page: Page, label: RegExp | string, optionText: RegExp | string) {
  await page.getByLabel(label).click();
  await page.getByRole("option", { name: optionText }).click();
}

/** Type into a MUI Autocomplete and choose the first matching option. */
export async function autocompletePick(page: Page, label: RegExp | string, query: string, optionText?: RegExp | string) {
  const input = page.getByLabel(label);
  await input.click();
  await input.fill(query);
  await page.getByRole("option", { name: optionText ?? new RegExp(query, "i") }).first().click();
}

/** Assert at least one form/field-level validation error is visible. */
export async function expectValidationError(page: Page) {
  const errors = page.locator(".Mui-error, p.MuiFormHelperText-root, [class*='error']");
  await expect(errors.first()).toBeVisible({ timeout: 5_000 });
}

/** Click "Add <thing>" in a repeater section and return the new row index. */
export async function addRepeaterRow(page: Page, addButtonName: RegExp) {
  await page.getByRole("button", { name: addButtonName }).click();
}

/** Submit a form via its primary action (save/add/create/link/changes). */
export async function submitForm(page: Page) {
  await page.getByRole("button", { name: /save|add|create|link|changes/i }).first().click();
}
