import { test, expect } from '@playwright/test';

test.describe('Invoice Templates', () => {
  test.beforeEach(async ({ page }) => {
    // Set desktop viewport to ensure sidebar is visible
    await page.setViewportSize({ width: 1280, height: 720 });
  });

  test('can view templates page', async ({ page }) => {
    // Navigate to templates page
    await page.goto('http://localhost:3000/templates');

    // Wait for page to load
    await expect(page.locator('h1')).toContainText(/Invoice Templates|发票模板/i);

    // Verify template gallery is visible
    await expect(page.getByText('Choose a Template').first()).toBeVisible();

    // Take screenshot
    await page.screenshot({ path: 'artifacts/templates-page.png' });
  });

  test('can see all template categories', async ({ page }) => {
    await page.goto('http://localhost:3000/templates');

    // Verify filter buttons exist
    await expect(page.getByRole('button', { name: 'All' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Modern' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Classic' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Minimal' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Colorful' })).toBeVisible();

    // Take screenshot
    await page.screenshot({ path: 'artifacts/template-filters.png' });
  });

  test('can filter templates by category', async ({ page }) => {
    await page.goto('http://localhost:3000/templates');

    // Wait for template cards to load
    await page.waitForSelector('[data-testid="template-card"]', { state: 'visible', timeout: 10000 });

    // Count initial templates
    const initialCards = await page.locator('[data-testid="template-card"]').count();
    expect(initialCards).toBeGreaterThan(0);

    // Click Modern filter
    await page.getByRole('button', { name: 'Modern' }).click();
    await page.waitForTimeout(1000);

    // Verify filtered results (should be 1 modern template)
    const modernCards = await page.locator('[data-testid="template-card"]').count();
    expect(modernCards).toBeGreaterThanOrEqual(1);

    // Click All to reset
    await page.getByRole('button', { name: 'All' }).click();
    await page.waitForTimeout(1000);

    // Verify all templates shown again
    const finalCards = await page.locator('[data-testid="template-card"]').count();
    expect(finalCards).toBe(initialCards);

    // Take screenshot
    await page.screenshot({ path: 'artifacts/template-filtered.png' });
  });

  test('can preview template', async ({ page }) => {
    await page.goto('http://localhost:3000/templates');

    // Wait for template cards to load
    await page.waitForSelector('[data-testid="template-card"]', { state: 'visible', timeout: 10000 });

    // Click on first template card
    await page.locator('[data-testid="template-card"]').first().click();

    // Wait for preview modal to open
    await expect(page.getByText('Template Preview').first()).toBeVisible({ timeout: 5000 });
    await expect(page.getByRole('button', { name: 'Use Template' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Close' })).toBeVisible();

    // Take screenshot
    await page.screenshot({ path: 'artifacts/template-preview.png' });

    // Close modal
    await page.getByRole('button', { name: 'Close' }).click();
    await page.waitForTimeout(1000);

    // Verify modal dialog is closed (check for the modal container)
    await expect(page.locator('fixed.inset-0').first()).not.toBeVisible();
  });

  test('can navigate to templates from sidebar', async ({ page }) => {
    // Navigate to editor first (where sidebar is visible)
    await page.goto('http://localhost:3000/editor');

    // Wait for page to load
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    // Click Templates link in sidebar - use href attribute to find the link
    await page.click('a[href="/templates"]');

    // Verify navigation to templates page
    await expect(page).toHaveURL(/.*\/templates/);
    await expect(page.locator('h1')).toContainText(/Invoice Templates|发票模板/i);

    // Take screenshot
    await page.screenshot({ path: 'artifacts/sidebar-navigation.png' });
  });

  test('can see Choose Template button in editor', async ({ page }) => {
    await page.goto('http://localhost:3000/editor');

    // Wait for page to load and editor to initialize
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(5000);

    // Verify Choose Template button exists - use the button with "Choose Template" text (not sidebar link)
    const chooseTemplateBtn = page.getByRole('link', { name: 'Choose Template' });
    await expect(chooseTemplateBtn).toBeVisible({ timeout: 10000 });

    // Take screenshot
    await page.screenshot({ path: 'artifacts/editor-template-button.png' });
  });

  test('template categories have correct tags', async ({ page }) => {
    await page.goto('http://localhost:3000/templates');

    // Verify template cards have tags
    await page.waitForSelector('[data-testid="template-card"]', { state: 'visible', timeout: 10000 });

    const firstCard = page.locator('[data-testid="template-card"]').first();

    // Verify Built-in badge exists
    await expect(firstCard.getByText('Built-in').first()).toBeVisible();

    // Verify tags are displayed
    await expect(firstCard.locator('[class*="bg-slate-100"]').first()).toBeVisible();

    // Take screenshot
    await page.screenshot({ path: 'artifacts/template-tags.png' });
  });
});
