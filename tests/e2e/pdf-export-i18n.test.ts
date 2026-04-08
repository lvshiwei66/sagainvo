import { test, expect } from '@playwright/test';
import { switchToLanguage, getCurrentLanguage, waitForTranslation } from './utils/i18n-helpers';

test.describe('PDF Export with Language Support', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/editor');
    // Wait for editor to load
    await page.waitForSelector('input[placeholder="Business Name *"]');
  });

  test('should export English invoice to PDF correctly', async ({ page }) => {
    // Fill in English invoice data
    await page.fill('input[placeholder="Business Name *"]', 'Sample Business Inc.');
    await page.fill('input[placeholder="Client Name *"]', 'John Doe');
    await page.fill('input[placeholder="Description"]', 'Website Development');

    // Set up intercept for PDF download
    const downloadPromise = page.waitForEvent('download');

    // Click download PDF button
    await page.click('button:text("Download PDF")');

    // Wait for download to complete
    const download = await downloadPromise;
    const downloadPath = await download.path();

    // Verify download happened
    expect(downloadPath).toBeDefined();
    expect(download.suggestedFilename()).toMatch(/\.pdf$/);
  });

  test('should detect Chinese and use html2canvas for PDF export', async ({ page }) => {
    // Mock the alert dialog that warns about using html2canvas for Chinese
    let alertReceived = false;
    let alertMessage = '';

    page.on('dialog', async (dialog) => {
      alertMessage = dialog.message();
      alertReceived = true;
      await dialog.accept();
    });

    // Fill in Chinese invoice data
    await page.fill('input[placeholder="Business Name *"]', '测试公司 有限公司');
    await page.fill('input[placeholder="Client Name *"]', '张三');
    await page.fill('input[placeholder="Description"]', '网站开发服务');
    await page.fill('textarea[placeholder="Thank you for your business!"]', '谢谢合作！');

    // Click download PDF button
    await page.click('button:text("Download PDF")');

    // Wait a bit to ensure the alert was captured
    await page.waitForTimeout(1000);

    // Verify that the Chinese detection triggered the appropriate alert
    expect(alertReceived).toBeTruthy();
    expect(alertMessage).toContain('Chinese characters');
    expect(alertMessage).toContain('image-based PDF export');
  });

  test('should export Chinese invoice with mixed content', async ({ page }) => {
    let alertReceived = false;

    page.on('dialog', async (dialog) => {
      alertReceived = true;
      await dialog.accept();
    });

    // Fill in mixed language content
    await page.fill('input[placeholder="Business Name *"]', 'Global Corp 全球公司');
    await page.fill('input[placeholder="Client Name *"]', 'International Client 国际客户');
    await page.fill('input[placeholder="Description"]', 'Consulting Service 咨询服务');
    await page.fill('textarea[placeholder="Thank you for your business!"]', 'Thank you 谢谢！');

    // Click download PDF button
    await page.click('button:text("Download PDF")');

    await page.waitForTimeout(1000);

    // Chinese characters should still trigger the html2canvas method
    expect(alertReceived).toBeTruthy();
  });

  test('should render all invoice fields in selected language', async ({ page }) => {
    // Skip for now - language switcher needs fixing
    test.fixme();

    // Switch to Chinese
    await page.goto('/');
    await page.click('button[aria-label="Change language"]');
    await page.click('button:text("简体中文")');
    await page.waitForTimeout(500);

    // Go back to editor
    await page.goto('/editor');
    await page.waitForSelector('input[placeholder="公司名称 *"]');

    // Verify placeholders are in Chinese
    await expect(page.locator('input[placeholder="公司名称 *"]')).toBeVisible();
    await expect(page.locator('input[placeholder="客户姓名 *"]')).toBeVisible();
    await expect(page.locator('input[placeholder="描述"]')).toBeVisible();
    await expect(page.locator('textarea[placeholder="感谢您的惠顾！"]')).toBeVisible();

    // Fill in some data
    await page.fill('input[placeholder="公司名称 *"]', '测试公司');
    await page.fill('input[placeholder="客户姓名 *"]', '测试客户');
    await page.fill('input[placeholder="描述"]', '测试服务');

    // Verify the filled data appears in preview in Chinese context
    await expect(page.locator('text=测试公司')).toBeVisible();
    await expect(page.locator('text=测试客户')).toBeVisible();
    await expect(page.locator('text=测试服务')).toBeVisible();
  });

  test('should verify PDF download button label changes with language', async ({ page }) => {
    // Skip for now - language switcher needs fixing
    test.fixme();

    // Verify English label
    await expect(page.locator('button:text("Download PDF")')).toBeVisible();

    // Switch to Chinese using helper
    await switchToLanguage(page, 'zh-CN');
    await page.waitForTimeout(500);

    // Verify Chinese label
    await expect(page.locator('button:text("下载 PDF")')).toBeVisible();
  });

  test('should handle PDF export cancellation gracefully', async ({ page }) => {
    // Mock dialog to cancel
    page.on('dialog', async (dialog) => {
      await dialog.dismiss();
    });

    // Fill in Chinese content to trigger the html2canvas warning
    await page.fill('input[placeholder="Business Name *"]', '测试公司');
    await page.fill('input[placeholder="Description"]', '测试服务');

    // Click download button
    await page.click('button:text("Download PDF")');

    await page.waitForTimeout(500);

    // Should not have crashed
    await expect(page.locator('input[placeholder="Business Name *"]')).toBeVisible();
  });
});

test.describe('PDF Export Language Detection', () => {
  test('should detect Chinese characters anywhere in invoice content', async ({ page }) => {
    let alertMessage = '';

    page.on('dialog', async (dialog) => {
      alertMessage = dialog.message();
      await dialog.accept();
    });

    // Only fill business name with Chinese
    await page.fill('input[placeholder="Business Name *"]', '中国公司');
    await page.fill('input[placeholder="Client Name *"]', 'English Client');
    await page.fill('input[placeholder="Description"]', 'English service');

    await page.click('button:text("Download PDF")');
    await page.waitForTimeout(1000);

    // Should still detect Chinese and use html2canvas
    expect(alertMessage).toContain('Chinese characters');
  });

  test('should NOT trigger html2canvas for pure English content', async ({ page }) => {
    let dialogTriggered = false;

    page.on('dialog', async (dialog) => {
      dialogTriggered = true;
      await dialog.accept();
    });

    // Fill only English content
    await page.fill('input[placeholder="Business Name *"]', 'English Company LLC');
    await page.fill('input[placeholder="Client Name *"]', 'John Smith');
    await page.fill('input[placeholder="Description"]', 'Web development service');

    await page.click('button:text("Download PDF")');
    await page.waitForTimeout(1000);

    // Should not trigger the Chinese detection warning
    expect(dialogTriggered).toBeFalsy();
  });
});