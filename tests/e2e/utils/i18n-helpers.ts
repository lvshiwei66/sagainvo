import { Page } from '@playwright/test';

/**
 * Switch to the specified language
 * Opens settings modal and selects the language
 * @param page - Playwright page instance
 * @param language - Language code ('en' or 'zh-CN')
 */
export async function switchToLanguage(page: Page, language: 'en' | 'zh-CN'): Promise<void> {
  const currentLang = await getCurrentLanguage(page);

  if (currentLang === language) {
    return;
  }

  // Set viewport to desktop size to ensure sidebar is visible
  await page.setViewportSize({ width: 1280, height: 720 });

  // Click the Settings button to open settings modal
  await page.click('button:has-text("Settings"), button:has-text("设置")');

  // Wait for modal to open and render
  await page.waitForTimeout(500);

  // Click the target language label (which triggers the radio)
  const targetLabel = language === 'zh-CN' ? '中文' : 'English';
  await page.click(`label:text("${targetLabel}")`);

  // Wait for language change to take effect
  await page.waitForTimeout(800);

  // Close modal by clicking backdrop
  await page.click('[data-testid="modal-backdrop"]');
  await page.waitForTimeout(300);
}

/**
 * Get the current language from localStorage
 * @param page - Playwright page instance
 * @returns Current language code
 */
export async function getCurrentLanguage(page: Page): Promise<string> {
  return await page.evaluate(() => localStorage.getItem('sagainvo:language') || 'en');
}

/**
 * Wait for translation to be applied
 * @param page - Playwright page instance
 * @param timeout - Maximum wait time in ms (default: 1000)
 */
export async function waitForTranslation(page: Page, timeout: number = 1000): Promise<void> {
  await page.waitForTimeout(timeout);
}

/**
 * Verify the HTML lang attribute matches expected language
 * @param page - Playwright page instance
 * @param expectedLang - Expected language code
 */
export async function expectLangAttribute(page: Page, expectedLang: string): Promise<void> {
  const { expect } = await import('@playwright/test');
  await expect(page.locator('html')).toHaveAttribute('lang', expectedLang);
}

/**
 * Fill in invoice form with test data
 * @param page - Playwright page instance
 * @param data - Optional custom data (uses defaults if not provided)
 */
export async function fillInvoiceForm(
  page: Page,
  data?: {
    businessName?: string;
    clientName?: string;
    description?: string;
  }
): Promise<void> {
  const businessName = data?.businessName || 'Test Business';
  const clientName = data?.clientName || 'Test Client';
  const description = data?.description || 'Test Service';

  await page.fill('input[placeholder*="Business Name" i], input[placeholder*="公司名称" i]', businessName);
  await page.fill('input[placeholder*="Client Name" i], input[placeholder*="客户姓名" i]', clientName);
  await page.fill('input[placeholder*="Description" i], input[placeholder*="描述" i]', description);

  // Wait for preview to update
  await page.waitForTimeout(300);
}
