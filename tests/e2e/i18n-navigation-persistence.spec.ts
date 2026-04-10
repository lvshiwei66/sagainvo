import { test, expect } from '@playwright/test';
import { switchToLanguage, waitForTranslation, getCurrentLanguage } from './utils/i18n-helpers';

test.describe('i18n Language Persistence Across Navigation', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 720 });
    // Use full URL to ensure consistent test start point
    await page.goto('http://localhost:3000/editor');
    // Wait for page to load with longer timeout
    await page.waitForSelector('input[placeholder="Business Name *"], input[placeholder="公司名称 *"]', { timeout: 10000 });
  });

  test('should maintain Chinese language when clicking sidebar navigation to /templates', async ({ page }) => {
    // 1. Switch to Chinese
    await switchToLanguage(page, 'zh-CN');
    await waitForTranslation(page);

    // 2. Verify current language in localStorage
    let currentLang = await getCurrentLanguage(page);
    console.log('Language before navigation:', currentLang);
    expect(currentLang).toBe('zh-CN');

    // 3. Navigate directly using goto (simulates hard refresh like <a> tag)
    await page.goto('http://localhost:3000/templates');
    await page.waitForTimeout(1000);

    // 4. Check localStorage - this is the KEY test
    currentLang = await getCurrentLanguage(page);
    console.log('Language after navigation to /templates:', currentLang);

    // 5. Verify language is still Chinese
    expect(currentLang).toBe('zh-CN');

    // 6. Verify UI shows Chinese text
    await expect(page.locator('h1')).toContainText('发票模板');
  });

  test('should maintain Chinese language when clicking sidebar navigation to / (home)', async ({ page }) => {
    // 1. Switch to Chinese
    await switchToLanguage(page, 'zh-CN');
    await waitForTranslation(page);

    // 2. Verify current language in localStorage
    let currentLang = await getCurrentLanguage(page);
    expect(currentLang).toBe('zh-CN');

    // 3. Navigate directly using goto
    await page.goto('http://localhost:3000/');
    await page.waitForTimeout(1000);

    // 4. Check localStorage
    currentLang = await getCurrentLanguage(page);
    expect(currentLang).toBe('zh-CN');
  });

  test('should maintain language when navigating multiple times', async ({ page }) => {
    // 1. Switch to Chinese
    await switchToLanguage(page, 'zh-CN');
    await waitForTranslation(page);

    // 2. Navigate to home
    await page.goto('http://localhost:3000/');
    await page.waitForTimeout(500);

    // 3. Navigate to editor
    await page.goto('http://localhost:3000/editor');
    await page.waitForTimeout(500);

    // 4. Navigate to templates
    await page.goto('http://localhost:3000/templates');
    await page.waitForTimeout(500);

    // 5. Verify language is still Chinese
    const currentLang = await getCurrentLanguage(page);
    expect(currentLang).toBe('zh-CN');

    // 6. Verify UI shows Chinese
    await expect(page.locator('h1')).toContainText('发票模板');
  });

  test('should work with English language too', async ({ page }) => {
    // 1. Ensure English is selected (should be default)
    await switchToLanguage(page, 'en');
    await waitForTranslation(page);

    // 2. Verify current language in localStorage
    let currentLang = await getCurrentLanguage(page);
    expect(currentLang).toBe('en');

    // 3. Navigate to templates
    await page.goto('http://localhost:3000/templates');
    await page.waitForTimeout(500);

    // 4. Check localStorage
    currentLang = await getCurrentLanguage(page);
    expect(currentLang).toBe('en');

    // 5. Verify UI shows English text
    await expect(page.locator('h1')).toContainText('Invoice Templates');
  });
});
