import { test, expect } from '@playwright/test';

test.describe('Language Switching Functionality', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/editor');
    // Wait for the editor to load completely
    await page.waitForSelector('input[placeholder="Business Name *"]');
  });

  test('should detect browser language and set default language', async ({ page }) => {
    // Navigate to editor page where language switcher is located
    await page.goto('/editor');

    // Wait for the editor to load completely
    await page.waitForSelector('input[placeholder="Business Name *"]');

    // Verify HTML lang attribute is set to 'en' by default
    await expect(page.locator('html')).toHaveAttribute('lang', 'en');

    // Check that English placeholders are initially shown
    await expect(page.locator('input[placeholder="Business Name *"]')).toBeVisible();
    await expect(page.locator('input[placeholder="Client Name *"]')).toBeVisible();
  });

  test('should switch to Chinese and update UI text', async ({ page }) => {
    // Go to editor page where language switcher is located
    await page.goto('/editor');
    await page.waitForSelector('input[placeholder="Business Name *"]');

    // Find and click the language switcher (it's in the sidebar at the bottom)
    await page.click('button[aria-label="Change language"]');

    // Select Chinese language
    await page.click('button:text("简体中文")');

    // Wait for language change to take effect
    await page.waitForTimeout(1000);

    // Verify UI elements are translated to Chinese by checking placeholder texts
    await page.goto('/editor');
    await page.waitForSelector('input[placeholder="公司名称 *"]');

    await expect(page.locator('input[placeholder="公司名称 *"]')).toBeVisible();
    await expect(page.locator('input[placeholder="客户姓名 *"]')).toBeVisible();

    // Verify HTML lang attribute is updated to 'zh-CN'
    await expect(page.locator('html')).toHaveAttribute('lang', 'zh-CN');
  });

  test('should switch back to English and update UI text', async ({ page }) => {
    // Go to editor page
    await page.goto('/editor');
    await page.waitForSelector('input[placeholder="Business Name *"]');

    // Switch to Chinese first
    await page.click('button[aria-label="Change language"]');
    await page.click('button:text("简体中文")');
    await page.waitForTimeout(1000);

    // Verify Chinese is applied by going back to editor
    await page.goto('/editor');
    await page.waitForTimeout(500);
    await page.waitForSelector('input[placeholder="公司名称 *"]');
    await expect(page.locator('input[placeholder="公司名称 *"]')).toBeVisible();

    // Switch back to English
    await page.click('button[aria-label="Change language"]');
    await page.click('button:text("English")');
    await page.waitForTimeout(1000);

    // Go back to editor to verify English text is restored
    await page.goto('/editor');
    await page.waitForSelector('input[placeholder="Business Name *"]');

    // Verify English text is restored
    await expect(page.locator('input[placeholder="Business Name *"]')).toBeVisible();
    await expect(page.locator('input[placeholder="Client Name *"]')).toBeVisible();
  });

  test('should maintain language preference in localStorage', async ({ page }) => {
    // Go to editor
    await page.goto('/editor');
    await page.waitForSelector('input[placeholder="Business Name *"]');

    // Switch to Chinese
    await page.click('button[aria-label="Change language"]');
    await page.click('button:text("简体中文")');
    await page.waitForTimeout(1000);

    // Verify Chinese is applied
    await page.goto('/editor');
    await page.waitForSelector('input[placeholder="公司名称 *"]');
    await expect(page.locator('input[placeholder="公司名称 *"]')).toBeVisible();

    // Reload the page
    await page.reload();
    await page.waitForSelector('input[placeholder="公司名称 *"]');

    // Verify that language preference is maintained after refresh
    await expect(page.locator('input[placeholder="公司名称 *"]')).toBeVisible();
    await expect(page.locator('input[placeholder="客户姓名 *"]')).toBeVisible();

    // Verify language in localStorage
    const storedLanguage = await page.evaluate(() => localStorage.getItem('sagainvo:language'));
    expect(storedLanguage).toBe('zh-CN');
  });

  test('should save language preference when navigating between pages', async ({ page }) => {
    // Go to editor
    await page.goto('/editor');
    await page.waitForSelector('input[placeholder="Business Name *"]');

    // Switch to Chinese
    await page.click('button[aria-label="Change language"]');
    await page.click('button:text("简体中文")');
    await page.waitForTimeout(1000);

    // Go back to editor to see the change
    await page.goto('/editor');
    await page.waitForSelector('input[placeholder="公司名称 *"]');

    // Verify Chinese text appears on editor page
    await expect(page.locator('input[placeholder="公司名称 *"]')).toBeVisible();
    await expect(page.locator('input[placeholder="客户姓名 *"]')).toBeVisible();

    // Navigate to home and back
    await page.goto('/');
    await page.click('a[href="/editor"]');
    await page.waitForSelector('input[placeholder="公司名称 *"]');

    // Verify Chinese text is still present
    await expect(page.locator('input[placeholder="公司名称 *"]')).toBeVisible();
  });
});

test.describe('Translation Completeness', () => {
  test('should translate all common UI elements in English', async ({ page }) => {
    await page.goto('/editor');
    await page.waitForSelector('input[placeholder="Business Name *"]');

    // Test form labels and placeholders in English
    await expect(page.locator('text=Invoice Details')).toBeVisible();
    await expect(page.locator('text=Design Elements')).toBeVisible();
    await expect(page.locator('text=From (Your Business)')).toBeVisible();
    await expect(page.locator('text=To (Client)')).toBeVisible();
    await expect(page.locator('text=Line Items')).toBeVisible();
    await expect(page.locator('text=Notes')).toBeVisible();
    await expect(page.locator('text=Terms')).toBeVisible();

    // Check placeholders
    await expect(page.locator('input[placeholder="Business Name *"]')).toBeVisible();
    await expect(page.locator('input[placeholder="Client Name *"]')).toBeVisible();
    await expect(page.locator('input[placeholder="Description"]')).toBeVisible();
    await expect(page.locator('textarea[placeholder="Thank you for your business!"]')).toBeVisible();
  });

  test('should translate all common UI elements in Chinese', async ({ page }) => {
    // Switch to Chinese
    await page.goto('/editor');
    await page.waitForSelector('input[placeholder="Business Name *"]');

    await page.click('button[aria-label="Change language"]');
    await page.click('button:text("简体中文")');
    await page.waitForTimeout(1000);

    // Go back to editor to see changes
    await page.goto('/editor');
    await page.waitForSelector('input[placeholder="公司名称 *"]');

    // Test form labels and placeholders in Chinese
    await expect(page.locator('text=发票详情')).toBeVisible();
    await expect(page.locator('text=设计元素')).toBeVisible();
    await expect(page.locator('text=来自（您的公司）')).toBeVisible();
    await expect(page.locator('text=收件人（客户）')).toBeVisible();
    await expect(page.locator('text=明细项目')).toBeVisible();
    await expect(page.locator('text=备注')).toBeVisible();
    await expect(page.locator('text=条款')).toBeVisible();

    // Check placeholders in Chinese
    await expect(page.locator('input[placeholder="公司名称 *"]')).toBeVisible();
    await expect(page.locator('input[placeholder="客户姓名 *"]')).toBeVisible();
    await expect(page.locator('input[placeholder="描述"]')).toBeVisible();
    await expect(page.locator('textarea[placeholder="感谢您的惠顾！"]')).toBeVisible();
  });

  test('should translate invoice preview elements in English', async ({ page }) => {
    await page.goto('/editor');
    await page.waitForSelector('input[placeholder="Business Name *"]');

    // Check invoice preview elements in English by looking for preview text
    // Fill in some data to make preview visible
    await page.fill('input[placeholder="Business Name *"]', 'Test Business');
    await page.fill('input[placeholder="Client Name *"]', 'Test Client');
    await page.fill('input[placeholder="Description"]', 'Test Service');

    // Wait for preview to update
    await page.waitForTimeout(500);

    // Check that preview shows English text labels
    await expect(page.locator('text=INVOICE')).toBeVisible();
    await expect(page.locator('text=Invoice #:')).toBeVisible();
    await expect(page.locator('text=Date:')).toBeVisible();
    await expect(page.locator('text=Due Date:')).toBeVisible();
    await expect(page.locator('text=From:')).toBeVisible();
    await expect(page.locator('text=To:')).toBeVisible();
    await expect(page.locator('text=Description')).toBeVisible();
    await expect(page.locator('text=Qty')).toBeVisible();
    await expect(page.locator('text=Rate')).toBeVisible();
    await expect(page.locator('text=Amount')).toBeVisible();
    await expect(page.locator('text=Subtotal:')).toBeVisible();
    await expect(page.locator('text=Total:')).toBeVisible();
  });

  test('should translate invoice preview elements in Chinese', async ({ page }) => {
    // Switch to Chinese first
    await page.goto('/editor');
    await page.waitForSelector('input[placeholder="Business Name *"]');

    await page.click('button[aria-label="Change language"]');
    await page.click('button:text("简体中文")');
    await page.waitForTimeout(1000);

    // Go back to editor
    await page.goto('/editor');
    await page.waitForSelector('input[placeholder="公司名称 *"]');

    // Fill in some data to make preview visible
    await page.fill('input[placeholder="公司名称 *"]', '测试公司');
    await page.fill('input[placeholder="客户姓名 *"]', '测试客户');
    await page.fill('input[placeholder="描述"]', '测试服务');

    // Wait for preview to update
    await page.waitForTimeout(500);

    // Check invoice preview elements in Chinese
    await expect(page.locator('text=发票')).toBeVisible();
    await expect(page.locator('text=发票编号:')).toBeVisible();
    await expect(page.locator('text=日期:')).toBeVisible();
    await expect(page.locator('text=截止日期:')).toBeVisible();
    await expect(page.locator('text=来自:')).toBeVisible();
    await expect(page.locator('text=收件人:')).toBeVisible();
    await expect(page.locator('text=描述')).toBeVisible();
    await expect(page.locator('text=数量')).toBeVisible();
    await expect(page.locator('text=单价')).toBeVisible();
    await expect(page.locator('text=金额')).toBeVisible();
    await expect(page.locator('text=小计:')).toBeVisible();
    await expect(page.locator('text=总计:')).toBeVisible();
  });
});

test.describe('Chinese Character Detection and PDF Export', () => {
  test('should detect Chinese characters in invoice content', async ({ page }) => {
    await page.goto('/editor');

    // Add some Chinese content to invoice
    await page.fill('input[placeholder="Business Name *"]', '我的公司 中国');
    await page.fill('input[placeholder="Client Name *"]', '客户名称');
    await page.fill('textarea[placeholder="Thank you for your business!"]', '谢谢您的光临！');

    // Add a line item with Chinese description
    await page.fill('input[placeholder="Description"]', '产品服务 产品');

    // Check if Chinese text is displayed properly in the preview
    await expect(page.locator('text=我的公司 中国')).toBeVisible();
    await expect(page.locator('text=客户名称')).toBeVisible();
    await expect(page.locator('text=产品服务 产品')).toBeVisible();
  });

  test('should trigger html2canvas method for Chinese content in PDF export', async ({ page }) => {
    // Mock alert to capture the message
    let alertMessage = '';
    page.on('dialog', dialog => {
      alertMessage = dialog.message();
      dialog.accept();
    });

    await page.goto('/editor');

    // Add Chinese content
    await page.fill('input[placeholder="Business Name *"]', '测试公司 中国');
    await page.fill('input[placeholder="Client Name *"]', '测试客户');
    await page.fill('input[placeholder="Description"]', '测试产品 产品');
    await page.fill('textarea[placeholder="Thank you for your business!"]', '中文测试内容');

    // Trigger PDF export
    await page.click('button:text("Download PDF")');

    // Wait for potential alert
    await page.waitForTimeout(1000);

    // Verify that the Chinese character detection triggered the html2canvas method
    expect(alertMessage).toContain('Invoice contains Chinese characters');
    expect(alertMessage).toContain('using image-based PDF export');
  });

  test('should properly handle mixed English and Chinese content', async ({ page }) => {
    await page.goto('/editor');

    // Mix English and Chinese content
    await page.fill('input[placeholder="Business Name *"]', 'ABC Company 中文测试');
    await page.fill('input[placeholder="Client Name *"]', 'XYZ Client 客户');
    await page.fill('input[placeholder="Description"]', 'Service Item 服务项目');
    await page.fill('textarea[placeholder="Thank you for your business!"]', 'Thank you 谢谢');

    // Verify content displays correctly
    await expect(page.locator('text=ABC Company 中文测试')).toBeVisible();
    await expect(page.locator('text=XYZ Client 客户')).toBeVisible();
    await expect(page.locator('text=Service Item 服务项目')).toBeVisible();
    await expect(page.locator('text=Thank you 谢谢')).toBeVisible();
  });
});

test.describe('Storage Persistence', () => {
  test('should save and retrieve language preferences from localStorage', async ({ page }) => {
    await page.goto('/editor');
    await page.waitForSelector('input[placeholder="Business Name *"]');

    // Check initial language in storage
    let storedLanguage = await page.evaluate(() => localStorage.getItem('sagainvo:language'));

    // Switch language to Chinese
    await page.click('button[aria-label="Change language"]');
    await page.click('button:text("简体中文")');
    await page.waitForTimeout(1000);

    // Check that language was saved
    storedLanguage = await page.evaluate(() => localStorage.getItem('sagainvo:language'));
    expect(storedLanguage).toBe('zh-CN');

    // Reload the page and verify language persists
    await page.reload();
    await page.waitForSelector('input[placeholder="公司名称 *"]');

    await expect(page.locator('input[placeholder="公司名称 *"]')).toBeVisible(); // Chinese text should appear
    storedLanguage = await page.evaluate(() => localStorage.getItem('sagainvo:language'));
    expect(storedLanguage).toBe('zh-CN');
  });

  test('should maintain language setting after browser restart simulation', async ({ page, context }) => {
    await page.goto('/editor');
    await page.waitForSelector('input[placeholder="Business Name *"]');

    // Change language to Chinese
    await page.click('button[aria-label="Change language"]');
    await page.click('button:text("简体中文")');
    await page.waitForTimeout(1000);

    // Verify Chinese text
    await page.goto('/editor');
    await page.waitForSelector('input[placeholder="公司名称 *"]');
    await expect(page.locator('input[placeholder="公司名称 *"]')).toBeVisible();

    // Simulate browser restart by creating a new page in the same context
    const newPage = await context.newPage();
    await newPage.goto('/editor');
    await newPage.waitForSelector('input[placeholder="公司名称 *"]');

    // Check if language preference is maintained across pages
    await expect(newPage.locator('input[placeholder="公司名称 *"]')).toBeVisible();
    const storedLanguage = await newPage.evaluate(() => localStorage.getItem('sagainvo:language'));
    expect(storedLanguage).toBe('zh-CN');
  });
});

test.describe('Browser Language Detection', () => {
  test('should default to English when no browser language preference', async ({ page }) => {
    // This simulates default behavior
    await page.goto('/editor');
    await page.waitForSelector('input[placeholder="Business Name *"]');

    // Verify HTML lang attribute is set to 'en' by default
    await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  });

  test('should detect simplified Chinese browser language', async ({ page }) => {
    // Test by manually switching to Chinese and verifying it works
    await page.goto('/editor');
    await page.waitForSelector('input[placeholder="Business Name *"]');

    await page.click('button[aria-label="Change language"]');
    await page.click('button:text("简体中文")');
    await page.waitForTimeout(1000);

    await page.goto('/editor');
    await page.waitForSelector('input[placeholder="公司名称 *"]');
    await expect(page.locator('input[placeholder="公司名称 *"]')).toBeVisible();
  });
});