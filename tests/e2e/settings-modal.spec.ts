import { test, expect } from '@playwright/test';

test.describe('Settings Modal Functionality', () => {
  test.use({ baseURL: 'http://localhost:3000' }); // Set base URL for the tests

  test.beforeEach(async ({ page }) => {
    // Visit the editor page where the sidebar is present
    await page.goto('/editor');
  });

  test('should open settings modal when settings button is clicked', async ({ page }) => {
    // Click the settings button in the sidebar
    await page.locator('text=Settings').click();

    // Verify the modal appears
    await expect(page.locator('[role="dialog"]')).toBeVisible();
    await expect(page.locator('text=Settings').first()).toBeVisible(); // There might be multiple "Settings" texts
  });

  test('should close settings modal when close button is clicked', async ({ page }) => {
    // Open the modal first
    await page.locator('text=Settings').click();

    // Click the close button (X icon)
    await page.locator('button[aria-label="Close"]').click();

    // Verify the modal disappears
    await expect(page.locator('[role="dialog"]')).not.toBeVisible();
  });

  test('should close settings modal when clicking on backdrop', async ({ page }) => {
    // Open the modal first
    await page.locator('text=Settings').click();

    // Click on the backdrop (the overlay area)
    await page.locator('div.bg-black').first().click(); // backdrop has bg-black class

    // Verify the modal disappears
    await expect(page.locator('[role="dialog"]')).not.toBeVisible();
  });

  test('should close settings modal when pressing Escape key', async ({ page }) => {
    // Open the modal first
    await page.locator('text=Settings').click();

    // Press Escape key
    await page.keyboard.press('Escape');

    // Verify the modal disappears
    await expect(page.locator('[role="dialog"]')).not.toBeVisible();
  });

  test('should display language settings section', async ({ page }) => {
    // Open the modal first
    await page.locator('text=Settings').click();

    // Verify the language settings section is visible
    await expect(page.locator('text=Language')).toBeVisible();
    await expect(page.locator('text=Choose your preferred language')).toBeVisible();
  });

  test('should allow switching language in modal', async ({ page }) => {
    // Open the modal first
    await page.locator('text=Settings').click();

    // Initially, English should be selected (depends on default/local storage)
    const englishRadio = page.locator('#language-en');
    const chineseRadio = page.locator('#language-zh-CN');

    // Click to switch to Chinese
    await chineseRadio.click();

    // The Chinese option should now be selected
    await expect(chineseRadio).toBeChecked();
  });
});