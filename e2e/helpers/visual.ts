/**
 * Visual-regression helper.
 *
 * Snapshots run on ALL environments, so we mask dynamic regions (numbers,
 * dates, avatars, spinners, chart canvases) and allow a small pixel tolerance.
 * Baselines are authoritative when generated in CI (Linux/chromium); local
 * macOS diffs are expected and not gating (see docs/e2e-test-plan.md §10.3).
 */
import { Page, Locator, expect } from "@playwright/test";

/** Locators commonly masked out of snapshots. Extend per page as needed. */
export function dynamicMasks(page: Page): Locator[] {
  return [
    page.locator("[data-testid='kpi-value']"),
    page.locator("canvas"), // chart.js
    page.locator("time, [class*='date']"),
    page.locator("[class*='avatar'], img[alt*='avatar' i]"),
    page.locator(".MuiCircularProgress-root, .MuiLinearProgress-root"),
  ];
}

/** Wait for the page to settle, then take a masked screenshot. */
export async function stableScreenshot(page: Page, name: string, extraMasks: Locator[] = []) {
  await page.waitForLoadState("networkidle");
  // give skeletons/spinners a beat to disappear
  await expect(page.locator(".MuiSkeleton-root").first()).toBeHidden({ timeout: 10_000 }).catch(() => {});
  await expect(page).toHaveScreenshot(name, {
    fullPage: true,
    mask: [...dynamicMasks(page), ...extraMasks],
    maxDiffPixelRatio: 0.02,
    animations: "disabled",
  });
}
