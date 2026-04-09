import { test, expect } from '@playwright/test';

test.describe('Settings Modal Final Verification', () => {
  test.use({ baseURL: 'http://localhost:3000' });

  test.beforeEach(async ({ page }) => {
    await page.goto('/editor');
  });

  test('should open settings modal and display language settings', async ({ page }) => {
    // Click the settings button in the sidebar
    await page.locator('text=Settings').click();

    // Verify the modal appears
    await expect(page.locator('[role="dialog"]')).toBeVisible();

    // Verify modal title
    await expect(page.locator('text=Settings')).nth(0).toBeVisible();

    // Verify language settings section is visible
    await expect(page.locator('text=Language')).toBeVisible();
    await expect(page.locator('text=Choose your preferred language')).toBeVisible();

    // Verify language options are visible
    await expect(page.locator('text=English')).toBeVisible();
    await expect(page.locator('text=中文')).toBeVisible();
  });

  test('should close settings modal when clicking close button', async ({ page }) => {
    // Open the modal first
    await page.locator('text=Settings').click();

    // Verify modal is open
    await expect(page.locator('[role="dialog"]')).toBeVisible();

    // Click the close button (X icon)
    await page.locator('button[aria-label="Close"]').click();

    // Verify the modal disappears
    await expect(page.locator('[role="dialog"]')).not.toBeVisible();
  });

  test('should close settings modal when pressing Escape key', async ({ page }) => {
    // Open the modal first
    await page.locator('text=Settings').click();

    // Verify modal is open
    await expect(page.locator('[role="dialog"]')).toBeVisible();

    // Press Escape key
    await page.keyboard.press('Escape');

    // Verify the modal disappears
    await expect(page.locator('[role="dialog"]')).not.toBeVisible();
  });

  test('should allow language switching in modal', async ({ page }) => {
    // Open the modal first
    await page.locator('text=Settings').click();

    // Initially, English should be selected (this depends on initial state)
    const englishRadio = page.locator('#language-en');
    const chineseRadio = page.locator('#language-zh-CN');

    // Check initial state and then change to the other language
    const isEnglishSelected = await englishRadio.isChecked();
    if (isEnglishSelected) {
      // Switch to Chinese
      await chineseRadio.click();
      // Verify Chinese is now selected
      await expect(chineseRadio).toBeChecked();
    } else {
      // Switch to English
      await englishRadio.click();
      // Verify English is now selected
      await expect(englishRadio).toBeChecked();
    }
  });
});