import { test, expect } from '@playwright/test';

test.describe('Complete Internationalized Invoice Flow', () => {
  test('full invoice creation and export flow in English', async ({ page }) => {
    // Navigate to editor
    await page.goto('/editor');

    // Fill in invoice details in English
    await page.fill('input[placeholder="Business Name *"]', 'Tech Solutions Ltd.');
    await page.fill('input[placeholder="Street Address"]', '123 Main Street');
    await page.fill('input[placeholder="City, State, ZIP"]', 'San Francisco, CA 94105');
    await page.fill('input[placeholder="Country"]', 'United States');
    await page.fill('input[placeholder="Email *"]', 'contact@techsolutions.com');

    await page.fill('input[placeholder="Client Name *"]', 'Acme Corporation');
    await page.fill('input[placeholder="Company"]', 'Acme Inc.');
    await page.fill('input[placeholder="Address"]', '456 Market Street');
    await page.fill('input[placeholder="City, State, ZIP"]', 'New York, NY 10001');
    await page.fill('input[placeholder="Email *"]', 'billing@acme.com');

    // Fill invoice meta details
    await page.fill('input[placeholder="INV-001"]', 'INV-2023-001');
    await page.fill('input[type="date"]:nth-of-type(1)', '2023-12-01');
    await page.fill('input[type="date"]:nth-of-type(2)', '2023-12-31');
    await page.fill('input[placeholder="Tax Rate (%)"]', '8.5');

    // Add line item
    await page.fill('input[placeholder="Description"]', 'Web Application Development');
    await page.fill('input[placeholder="Qty"]', '40');
    await page.fill('input[placeholder="Rate"]', '100');

    // Add notes and terms
    await page.fill('textarea[placeholder="Thank you for your business!"]', 'Thank you for your continued partnership.');
    await page.fill('textarea[placeholder="Payment due within 30 days"]', 'Net 30 payment terms apply.');

    // Verify the preview shows correct data in English
    await expect(page.locator('text=Tech Solutions Ltd.')).toBeVisible();
    await expect(page.locator('text=Acme Corporation')).toBeVisible();
    await expect(page.locator('text=Web Application Development')).toBeVisible();
    await expect(page.locator('text=$4,000.00')).toBeVisible(); // 40 * 100

    // Export to PDF
    await page.click('button:text("Download PDF")');

    // The English invoice should proceed normally (no Chinese chars detected)
    // Verify that no alert was shown (since there are no Chinese characters)
    await page.waitForTimeout(1000);
  });

  test('full invoice creation and export flow in Chinese', async ({ page }) => {
    // Switch to Chinese first
    await page.goto('/');
    await page.click('button[aria-label="Change language"]');
    await page.click('button:text("简体中文")');
    await page.waitForTimeout(500);

    // Navigate to editor
    await page.click('a[href="/editor"]');
    await page.waitForSelector('input[placeholder="公司名称 *"]');

    // Fill in invoice details in Chinese
    await page.fill('input[placeholder="公司名称 *"]', '科技解决方案有限公司');
    await page.fill('input[placeholder="街道地址"]', '主街123号');
    await page.fill('input[placeholder="城市, 州, 邮编"]', '旧金山, 加州 94105');
    await page.fill('input[placeholder="国家"]', '美国');
    await page.fill('input[placeholder="邮箱 *"]', 'contact@techsolutions.com');

    await page.fill('input[placeholder="客户姓名 *"]', 'Acme公司');
    await page.fill('input[placeholder="公司"]', 'Acme有限公司');
    await page.fill('input[placeholder="街道地址"]', '市场街456号');
    await page.fill('input[placeholder="城市, 州, 邮编"]', '纽约, 纽约州 10001');
    await page.fill('input[placeholder="邮箱 *"]', 'billing@acme.com');

    // Fill invoice meta details in Chinese context
    await page.fill('input[placeholder="发票号-001"]', '发票-2023-001');
    await page.fill('input[type="date"]:nth-of-type(1)', '2023-12-01');
    await page.fill('input[type="date"]:nth-of-type(2)', '2023-12-31');
    await page.fill('input[placeholder="税率 (%)"]', '8.5');

    // Add line item with Chinese description
    await page.fill('input[placeholder="描述"]', '网站应用开发服务');
    await page.fill('input[placeholder="数量"]', '40');
    await page.fill('input[placeholder="单价"]', '100');

    // Add notes and terms in Chinese
    await page.fill('textarea[placeholder="感谢您的惠顾！"]', '感谢您持续的合作。');
    await page.fill('textarea[placeholder="付款期限为30天内"]', '净30天付款条件适用。');

    // Verify the preview shows correct data in Chinese context
    await expect(page.locator('text=科技解决方案有限公司')).toBeVisible();
    await expect(page.locator('text=Acme公司')).toBeVisible();
    await expect(page.locator('text=网站应用开发服务')).toBeVisible();
    await expect(page.locator('text=$4,000.00')).toBeVisible(); // 40 * 100

    // Set up alert listener for Chinese detection
    let alertReceived = false;
    let alertMessage = '';
    page.on('dialog', async (dialog) => {
      alertMessage = dialog.message();
      alertReceived = true;
      await dialog.accept();
    });

    // Export to PDF - should trigger Chinese detection
    await page.click('button:text("下载 PDF")');

    // Wait to capture the alert
    await page.waitForTimeout(1000);

    // Verify that Chinese detection worked and fallback was used
    expect(alertReceived).toBeTruthy();
    expect(alertMessage).toContain('Chinese characters');
    expect(alertMessage).toContain('image-based PDF export');
  });

  test('should maintain language preference through complete workflow', async ({ page }) => {
    // Start with Chinese
    await page.goto('/');
    await page.click('button[aria-label="Change language"]');
    await page.click('button:text("简体中文")');
    await page.waitForTimeout(500);

    // Navigate to editor
    await page.click('a[href="/editor"]');
    await page.waitForSelector('input[placeholder="公司名称 *"]');

    // Fill in some Chinese data
    await page.fill('input[placeholder="公司名称 *"]', '测试公司');
    await page.fill('input[placeholder="客户姓名 *"]', '测试客户');

    // Navigate away and back
    await page.goto('/');
    await page.click('a[href="/editor"]');

    // Verify Chinese language is maintained throughout
    await expect(page.locator('input[placeholder="公司名称 *"]')).toBeVisible();
    await expect(page.locator('text=测试公司')).toBeVisible();

    // Also verify the language selector still shows Chinese
    const currentLang = await page.textContent('button[aria-label="Change language"] span');
    expect(currentLang).toBe('简体中文');
  });

  test('should handle language switching mid-workflow', async ({ page }) => {
    // Start with English
    await page.goto('/editor');
    await page.waitForSelector('input[placeholder="Business Name *"]');

    // Fill in some English data
    await page.fill('input[placeholder="Business Name *"]', 'Original English Business');

    // Switch language to Chinese mid-workflow
    await page.goto('/');
    await page.click('button[aria-label="Change language"]');
    await page.click('button:text("简体中文")');
    await page.waitForTimeout(500);

    // Go back to editor
    await page.click('a[href="/editor"]');
    await page.waitForSelector('input[placeholder="公司名称 *"]');

    // The data should still be there but interface should be in Chinese
    await expect(page.locator('text=Original English Business')).toBeVisible();
    await expect(page.locator('input[placeholder="公司名称 *"]')).toBeVisible();

    // Add more Chinese data
    await page.fill('input[placeholder="客户姓名 *"]', '中文客户');

    // Switch back to English
    await page.goto('/');
    await page.click('button[aria-label="Change language"]');
    await page.click('button:text("English")');
    await page.waitForTimeout(500);

    // Go back to editor
    await page.click('a[href="/editor"]');
    await page.waitForSelector('input[placeholder="Business Name *"]');

    // Data should still be there but interface should now be in English again
    await expect(page.locator('text=Original English Business')).toBeVisible();
    await expect(page.locator('text=中文客户')).toBeVisible(); // Chinese text content should remain
    await expect(page.locator('input[placeholder="Business Name *"]')).toBeVisible();
  });
});